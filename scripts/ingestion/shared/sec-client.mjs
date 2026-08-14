import { fail, IngestionError } from './ingestion-error.mjs'

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

async function request(fetchImpl, url, options, code) {
  try { return await fetchImpl(url, options) }
  catch (error) { fail(code, 'Request failed for ' + url, { cause: error.message }) }
}

export async function fetchSecSubmissions({ cik, userAgent, fetchImpl = fetch }) {
  const url = 'https://data.sec.gov/submissions/CIK' + cik + '.json'
  const response = await request(fetchImpl, url, { headers: { 'user-agent': validateSecUserAgent(userAgent), accept: 'application/json' }, redirect: 'follow' }, 'DISCOVERY_UNAVAILABLE')
  if (response.status !== 200) fail('DISCOVERY_UNAVAILABLE', 'SEC submissions returned ' + response.status)
  if (!(response.headers.get('content-type') ?? '').toLowerCase().includes('json')) fail('DISCOVERY_CONTENT_TYPE', 'SEC submissions did not return JSON')
  try { return { submissions: await response.json(), url } }
  catch (error) { if (error instanceof IngestionError) throw error; fail('DISCOVERY_JSON', 'SEC submissions response is malformed JSON') }
}

export async function collectSecFiling({ filing, cik, userAgent, fetchImpl = fetch }) {
  const expectedUrl = buildSecArchiveUrl({ cik, accessionNumber: filing.accessionNumber, primaryDocument: filing.primaryDocument })
  if (filing.filingUrl && filing.filingUrl !== expectedUrl) fail('FILING_PROVENANCE', 'Filing URL and SEC metadata are inconsistent')
  const response = await request(fetchImpl, expectedUrl, { headers: { 'user-agent': validateSecUserAgent(userAgent), accept: 'text/html,application/xhtml+xml' }, redirect: 'follow' }, 'SOURCE_UNAVAILABLE')
  const finalUrl = response.url || expectedUrl
  if (finalUrl !== expectedUrl || new URL(finalUrl).hostname !== 'www.sec.gov') fail('FILING_PROVENANCE', 'Filing did not resolve to its immutable SEC Archives URL')
  return { response, requestedUrl: expectedUrl, finalUrl, body: Buffer.from(await response.arrayBuffer()) }
}
