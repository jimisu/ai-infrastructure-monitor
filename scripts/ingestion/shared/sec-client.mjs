import { fail, IngestionError } from './ingestion-error.mjs'
import { requestWithRetry } from './http-client.mjs'

export function validateSecUserAgent(value) {
  if (typeof value !== 'string' || !/\S+@\S+\.\S+/.test(value)) {
    fail('SEC_USER_AGENT', 'SEC_USER_AGENT must identify the application and include a monitored email address')
  }
  return value
}

export function normalizeAccession(value) {
  if (!/^\d{10}-\d{2}-\d{6}$/.test(value)) fail('ACCESSION_NUMBER', 'Invalid SEC accession ' + value)
  return value.replaceAll('-', '')
}

export function buildSecArchiveUrl({ cik, accessionNumber, primaryDocument }) {
  if (!/^\d{10}$/.test(cik)) fail('CIK', 'CIK must contain ten digits')
  if (!/^[A-Za-z0-9._-]+\.htm$/i.test(primaryDocument)) fail('PRIMARY_DOCUMENT', 'Invalid SEC primary document')
  return 'https://www.sec.gov/Archives/edgar/data/' + Number(cik) + '/' + normalizeAccession(accessionNumber) + '/' + primaryDocument
}

export async function fetchSecSubmissions({ cik, userAgent, fetchImpl = fetch, signal, transport = {} }) {
  const url = 'https://data.sec.gov/submissions/CIK' + cik + '.json'
  const collected = await requestWithRetry({ ...transport, url, options: { headers: { 'user-agent': validateSecUserAgent(userAgent), accept: 'application/json' }, redirect: 'follow' }, errorCode: 'DISCOVERY_UNAVAILABLE', fetchImpl, signal })
  const { response, body } = collected
  if (response.status !== 200) fail('DISCOVERY_UNAVAILABLE', 'SEC submissions returned ' + response.status)
  if (!(response.headers.get('content-type') ?? '').toLowerCase().includes('json')) fail('DISCOVERY_CONTENT_TYPE', 'SEC submissions did not return JSON')
  try { return { submissions: JSON.parse(body.toString('utf8')), url, attempts: collected.attempts } }
  catch (error) { if (error instanceof IngestionError) throw error; fail('DISCOVERY_JSON', 'SEC submissions response is malformed JSON') }
}

export async function collectSecFiling({ filing, cik, userAgent, fetchImpl = fetch, signal, responseErrorCode = 'SOURCE_UNAVAILABLE', transport = {} }) {
  const expectedUrl = buildSecArchiveUrl({ cik, accessionNumber: filing.accessionNumber, primaryDocument: filing.primaryDocument })
  if (filing.filingUrl && filing.filingUrl !== expectedUrl) fail('FILING_PROVENANCE', 'Filing URL and SEC metadata are inconsistent')
  const collected = await requestWithRetry({ ...transport, url: expectedUrl, options: { headers: { 'user-agent': validateSecUserAgent(userAgent), accept: 'text/html,application/xhtml+xml' }, redirect: 'follow' }, errorCode: 'SOURCE_UNAVAILABLE', httpErrorCode: responseErrorCode, fetchImpl, signal })
  const { response, body, finalUrl } = collected
  if (finalUrl !== expectedUrl || new URL(finalUrl).hostname !== 'www.sec.gov') fail('FILING_PROVENANCE', 'Filing did not resolve to its immutable SEC Archives URL')
  return { response, requestedUrl: expectedUrl, finalUrl, body, attempts: collected.attempts }
}
