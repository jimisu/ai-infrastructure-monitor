import assert from 'node:assert/strict'
import test from 'node:test'
import { IngestionError } from '../../scripts/ingestion/shared/ingestion-error.mjs'
import { parseRetryAfter, requestWithRetry } from '../../scripts/ingestion/shared/http-client.mjs'

function response(status = 200, body = 'ok', headers = {}, url = 'https://example.test/data') {
  return { status, url, headers: new Headers(headers), async arrayBuffer() { return Buffer.from(body) } }
}
const request = (overrides = {}) => requestWithRetry({ url: 'https://example.test/data', errorCode: 'SOURCE_UNAVAILABLE', sleep: async () => {}, random: () => 0, ...overrides })

test('returns a completely consumed body and transport-only attempt count', async () => {
  const result = await request({ fetchImpl: async () => response(200, 'complete') })
  assert.equal(result.body.toString(), 'complete')
  assert.equal(result.attempts, 1)
})

test('retries approved transient statuses and succeeds within three total attempts', async () => {
  for (const status of [408, 425, 429, 500, 502, 503, 504]) {
    let calls = 0
    const result = await request({ fetchImpl: async () => (++calls < 3 ? response(status) : response()) })
    assert.equal(result.attempts, 3)
    assert.equal(calls, 3)
  }
})

test('does not retry 403 or unlisted statuses', async () => {
  for (const status of [400, 403, 404, 501]) {
    let calls = 0
    const result = await request({ fetchImpl: async () => { calls += 1; return response(status) } })
    assert.equal(result.response.status, status)
    assert.equal(calls, 1)
  }
})

test('retries transient network and body-stream failures', async () => {
  let calls = 0
  assert.equal((await request({ fetchImpl: async () => { calls += 1; if (calls === 1) throw new TypeError('offline'); return response() } })).attempts, 2)
  calls = 0
  assert.equal((await request({ fetchImpl: async () => ({ ...response(), async arrayBuffer() { calls += 1; if (calls === 1) throw new TypeError('stream reset'); return Buffer.from('ok') } }) })).attempts, 2)
})

test('does not retry non-network exceptions and preserves HTTP response error context', async () => {
  let calls = 0
  await assert.rejects(request({ fetchImpl: async () => { calls += 1; throw new Error('programmer error') } }), (failure) => failure.code === 'SOURCE_UNAVAILABLE' && failure.details.attempts === 1)
  assert.equal(calls, 1)
  await assert.rejects(
    request({ fetchImpl: async () => response(503), httpErrorCode: 'DOCUMENT_RESPONSE' }),
    (failure) => failure.code === 'DOCUMENT_RESPONSE' && failure.details.reason === 'RETRY_EXHAUSTED' && failure.details.lastStatus === 503,
  )
})

test('exhaustion preserves contextual code and deterministic reason details', async () => {
  await assert.rejects(request({ fetchImpl: async () => { throw new TypeError('platform-specific failure') } }), (failure) =>
    failure instanceof IngestionError && failure.code === 'SOURCE_UNAVAILABLE' &&
    failure.details.reason === 'RETRY_EXHAUSTED' && failure.details.lastFailureReason === 'NETWORK_ERROR' &&
    failure.details.attempts === 3 && !JSON.stringify(failure.details).includes('platform-specific'))
})

test('internal timeout covers fetch and body consumption', async () => {
  const hanging = (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true }))
  await assert.rejects(request({ fetchImpl: hanging, timeoutMs: 5 }), (failure) => failure.details.reason === 'RETRY_EXHAUSTED' && failure.details.lastFailureReason === 'TIMEOUT')
  await assert.rejects(request({ fetchImpl: async () => ({ ...response(), arrayBuffer: () => new Promise(() => {}) }), timeoutMs: 5 }), (failure) => failure.details.reason === 'RETRY_EXHAUSTED' && failure.details.lastFailureReason === 'TIMEOUT')
})

test('caller abort before, during fetch, and during backoff is never retried', async () => {
  const before = new AbortController(); before.abort(); let calls = 0
  await assert.rejects(request({ signal: before.signal, fetchImpl: async () => { calls += 1; return response() } }), (failure) => failure.details.reason === 'CALLER_ABORTED' && failure.details.attempts === 0)
  assert.equal(calls, 0)
  const during = new AbortController()
  await assert.rejects(request({ signal: during.signal, fetchImpl: async (_url, options) => new Promise((_resolve, reject) => { options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true }); during.abort() }) }), (failure) => failure.details.reason === 'CALLER_ABORTED')
  const backoff = new AbortController(); calls = 0
  await assert.rejects(request({ signal: backoff.signal, fetchImpl: async () => { calls += 1; return response(503) }, sleep: async () => { backoff.abort(); throw backoff.signal.reason } }), (failure) => failure.details.reason === 'CALLER_ABORTED')
  assert.equal(calls, 1)
})

test('Retry-After accepts bounded seconds and HTTP dates', async () => {
  const delays = []; let calls = 0
  await request({ fetchImpl: async () => (++calls === 1 ? response(429, '', { 'retry-after': '30' }) : response()), sleep: async (delay) => delays.push(delay) })
  assert.deepEqual(delays, [30_000])
  calls = 0; delays.length = 0
  await request({ fetchImpl: async () => (++calls === 1 ? response(503, '', { 'retry-after': 'Thu, 01 Jan 2026 00:00:20 GMT' }) : response()), now: () => Date.parse('Thu, 01 Jan 2026 00:00:00 GMT'), sleep: async (delay) => delays.push(delay) })
  assert.deepEqual(delays, [20_000])
})

test('invalid or past Retry-After falls back to jittered backoff', async () => {
  for (const value of ['invalid', 'Wed, 31 Dec 2025 23:59:59 GMT']) {
    const delays = []; let calls = 0
    await request({ fetchImpl: async () => (++calls === 1 ? response(503, '', { 'retry-after': value }) : response()), now: () => Date.parse('Thu, 01 Jan 2026 00:00:00 GMT'), sleep: async (delay) => delays.push(delay), random: () => 0 })
    assert.deepEqual(delays, [250])
  }
})

test('Retry-After above 30 seconds fails closed without sleep or retry', async () => {
  let calls = 0; let sleeps = 0
  await assert.rejects(request({ fetchImpl: async () => { calls += 1; return response(429, '', { 'retry-after': '31' }) }, sleep: async () => { sleeps += 1 } }), (failure) => failure.details.reason === 'RETRY_AFTER_EXCEEDED')
  assert.equal(calls, 1); assert.equal(sleeps, 0)
})

test('equal jitter uses 50 to 100 percent of exponential delay', async () => {
  for (const [value, expected] of [[0, [250, 500]], [1, [500, 1000]]]) {
    const delays = []; let calls = 0
    await request({ fetchImpl: async () => (++calls < 3 ? response(500) : response()), sleep: async (delay) => delays.push(delay), random: () => value })
    assert.deepEqual(delays, expected)
  }
})

test('parseRetryAfter rejects malformed and past values', () => {
  assert.equal(parseRetryAfter('10', () => 0), 10_000)
  assert.equal(parseRetryAfter('bad', () => 0), null)
  assert.equal(parseRetryAfter('Thu, 01 Jan 1970 00:00:00 GMT', () => 1), null)
})
