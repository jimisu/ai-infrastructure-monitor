import { IngestionError } from './ingestion-error.mjs'

export const HTTP_TRANSPORT_DEFAULTS = Object.freeze({
  timeoutMs: 15_000,
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 4_000,
  maxRetryAfterMs: 30_000,
})

export const RETRYABLE_HTTP_STATUSES = Object.freeze(new Set([408, 425, 429, 500, 502, 503, 504]))

const details = (reason, attempts, timeoutMs, lastStatus, lastFailureReason) => ({
  reason,
  attempts,
  ...(lastStatus === undefined ? {} : { lastStatus }),
  timeoutMs,
  ...(lastFailureReason === undefined ? {} : { lastFailureReason }),
})

export function parseRetryAfter(value, now = () => Date.now()) {
  if (typeof value !== 'string' || value.trim() === '') return null
  const normalized = value.trim()
  if (/^\d+$/.test(normalized)) return Number(normalized) * 1_000
  const timestamp = Date.parse(normalized)
  if (!Number.isFinite(timestamp)) return null
  const delay = timestamp - now()
  return delay >= 0 ? delay : null
}

export function defaultSleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = setTimeout(done, ms)
    function done() {
      signal?.removeEventListener('abort', aborted)
      resolve()
    }
    function aborted() {
      clearTimeout(timer)
      signal?.removeEventListener('abort', aborted)
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
    }
    signal?.addEventListener('abort', aborted, { once: true })
  })
}

function attemptSignal(callerSignal, timeoutMs) {
  const controller = new AbortController()
  let timedOut = false
  const callerAborted = () => controller.abort(callerSignal.reason)
  if (callerSignal?.aborted) callerAborted()
  else callerSignal?.addEventListener('abort', callerAborted, { once: true })
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort(new DOMException('Timed out', 'TimeoutError'))
  }, timeoutMs)
  return {
    signal: controller.signal,
    timedOut: () => timedOut,
    cleanup() {
      clearTimeout(timer)
      callerSignal?.removeEventListener('abort', callerAborted)
    },
  }
}

function awaitWithAbort(promise, signal) {
  if (signal.aborted) return Promise.reject(signal.reason)
  return new Promise((resolve, reject) => {
    const aborted = () => reject(signal.reason)
    signal.addEventListener('abort', aborted, { once: true })
    Promise.resolve(promise).then(
      (value) => { signal.removeEventListener('abort', aborted); resolve(value) },
      (cause) => { signal.removeEventListener('abort', aborted); reject(cause) },
    )
  })
}

function backoffDelay(attempt, random, baseDelayMs, maxDelayMs) {
  const exponential = Math.min(maxDelayMs, baseDelayMs * (2 ** (attempt - 1)))
  return Math.round(exponential * (0.5 + (0.5 * random())))
}

function isTransientNetworkError(cause) {
  if (cause instanceof TypeError) return true
  const code = cause?.code ?? cause?.cause?.code
  return typeof code === 'string' && (
    ['EAI_AGAIN', 'ENETDOWN', 'ENETUNREACH', 'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EPIPE'].includes(code) || code.startsWith('UND_ERR_')
  )
}

function error(code, message, errorDetails) {
  return new IngestionError(code, message, errorDetails)
}

export async function requestWithRetry({
  url,
  options = {},
  errorCode,
  httpErrorCode = errorCode,
  fetchImpl = fetch,
  signal = options.signal,
  sleep = defaultSleep,
  now = () => Date.now(),
  random = Math.random,
  timeoutMs = HTTP_TRANSPORT_DEFAULTS.timeoutMs,
  maxAttempts = HTTP_TRANSPORT_DEFAULTS.maxAttempts,
  baseDelayMs = HTTP_TRANSPORT_DEFAULTS.baseDelayMs,
  maxDelayMs = HTTP_TRANSPORT_DEFAULTS.maxDelayMs,
  maxRetryAfterMs = HTTP_TRANSPORT_DEFAULTS.maxRetryAfterMs,
}) {
  if (typeof url !== 'string' || !url) throw new TypeError('url is required')
  if (typeof errorCode !== 'string' || !errorCode) throw new TypeError('errorCode is required')
  if ((options.method ?? 'GET').toUpperCase() !== 'GET') throw new TypeError('Only GET acquisition is supported')
  if (signal?.aborted) throw error(errorCode, 'Request aborted for ' + url, details('CALLER_ABORTED', 0, timeoutMs))

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const scoped = attemptSignal(signal, timeoutMs)
    let response
    let body
    let lastFailureReason
    try {
      response = await awaitWithAbort(Promise.resolve().then(() => fetchImpl(url, { ...options, signal: scoped.signal })), scoped.signal)
      try {
        body = Buffer.from(await awaitWithAbort(Promise.resolve().then(() => response.arrayBuffer()), scoped.signal))
      } catch {
        lastFailureReason = scoped.timedOut() ? 'TIMEOUT' : 'BODY_STREAM_ERROR'
        throw new Error(lastFailureReason)
      }
    } catch (cause) {
      const callerAborted = signal?.aborted === true
      const reason = callerAborted ? 'CALLER_ABORTED' : (lastFailureReason ?? (scoped.timedOut() ? 'TIMEOUT' : 'NETWORK_ERROR'))
      const retryable = reason === 'TIMEOUT' || reason === 'BODY_STREAM_ERROR' || isTransientNetworkError(cause)
      scoped.cleanup()
      if (callerAborted) throw error(errorCode, 'Request aborted for ' + url, details(reason, attempt, timeoutMs))
      if (!retryable) throw error(errorCode, 'Request failed for ' + url, details(reason, attempt, timeoutMs))
      if (attempt === maxAttempts) throw error(errorCode, 'Request failed after ' + attempt + ' attempts for ' + url, details('RETRY_EXHAUSTED', attempt, timeoutMs, undefined, reason))
      try {
        await sleep(backoffDelay(attempt, random, baseDelayMs, maxDelayMs), signal)
      } catch {
        if (signal?.aborted) throw error(errorCode, 'Request aborted for ' + url, details('CALLER_ABORTED', attempt, timeoutMs))
        throw error(errorCode, 'Retry delay failed for ' + url, details('NETWORK_ERROR', attempt, timeoutMs))
      }
      continue
    }
    scoped.cleanup()

    if (!RETRYABLE_HTTP_STATUSES.has(response.status)) {
      return { response, body, requestedUrl: url, finalUrl: response.url || url, attempts: attempt }
    }
    const retryAfterMs = [429, 503].includes(response.status) ? parseRetryAfter(response.headers.get('retry-after'), now) : null
    if (retryAfterMs !== null && retryAfterMs > maxRetryAfterMs) {
      throw error(httpErrorCode, 'Retry-After exceeds limit for ' + url, details('RETRY_AFTER_EXCEEDED', attempt, timeoutMs, response.status))
    }
    if (attempt === maxAttempts) {
      throw error(httpErrorCode, 'Request failed after ' + attempt + ' attempts for ' + url, details('RETRY_EXHAUSTED', attempt, timeoutMs, response.status))
    }
    const delay = retryAfterMs ?? backoffDelay(attempt, random, baseDelayMs, maxDelayMs)
    try {
      await sleep(delay, signal)
    } catch {
      if (signal?.aborted) throw error(errorCode, 'Request aborted for ' + url, details('CALLER_ABORTED', attempt, timeoutMs, response.status))
      throw error(errorCode, 'Retry delay failed for ' + url, details('NETWORK_ERROR', attempt, timeoutMs, response.status))
    }
  }
  throw new Error('Unreachable HTTP transport state')
}
