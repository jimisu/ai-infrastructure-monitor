import path from 'node:path'
import { IngestionError, fail } from './shared/ingestion-error.mjs'
import { buildSecArchiveUrl, fetchSecSubmissions, collectSecFiling } from './shared/sec-client.mjs'
import { persistRawSnapshot, sha256 } from './shared/snapshot-store.mjs'
import { promoteCanonicalAtomically } from './shared/canonical-store.mjs'
import { verifyGoogFrozenQ1Baseline } from './goog-frozen-baseline.mjs'
import { requestWithRetry } from './shared/http-client.mjs'

export const GOOG_GUIDANCE_SOURCE = Object.freeze({ id: 'goog-annual-capex-guidance-official', issuer: 'GOOG', ticker: 'GOOG', tier: 'TIER_1_OFFICIAL', definitionId: 'goog-purchases-of-property-and-equipment', unit: 'USD billions' })
export const GOOG_SEC_ACQUISITION = Object.freeze({ cik: '0001652044', submissionsUrl: 'https://data.sec.gov/submissions/CIK0001652044.json', channel: 'SEC_EDGAR', filedWith: 'SEC EDGAR' })
export const GOOG_GUIDANCE_DISCLOSURES = Object.freeze([
  { accessionNumber: '0001652044-25-000010', filingDate: '2025-02-04', reportDate: '2025-02-04', form: '8-K', primaryDocument: 'goog-20250204.htm', evidenceDocument: 'googexhibit991q42024.htm', asOf: '2024-Q4', target: '2025', shape: 'APPROXIMATE_POINT', sourceId: 'goog-2024-q4-earnings-call', publishedAt: '2025-02-04T21:30:00.000Z' },
  { accessionNumber: null, filingDate: '2025-04-24', reportDate: '2025-03-31', form: 'EARNINGS_CALL', primaryDocument: null, evidenceDocument: null, asOf: '2025-Q1', target: '2025', shape: 'APPROXIMATE_POINT', sourceId: 'goog-2025-q1-earnings-call', publishedAt: '2025-04-24T20:30:00.000Z', officialUrl: 'https://abc.xyz/2025-q1-earnings-call/', versionId: 'alphabet-2025-q1-earnings-call-2025-04-24' },
  { accessionNumber: '0001652044-25-000056', filingDate: '2025-07-23', reportDate: '2025-07-23', form: '8-K', primaryDocument: 'goog-20250723.htm', evidenceDocument: 'googexhibit991q22025.htm', asOf: '2025-Q2', target: '2025', shape: 'APPROXIMATE_POINT', sourceId: 'goog-2025-q2-earnings-call', publishedAt: '2025-07-23T20:30:00.000Z' },
  { accessionNumber: '0001652044-25-000087', filingDate: '2025-10-29', reportDate: '2025-10-29', form: '8-K', primaryDocument: 'goog-20251029.htm', evidenceDocument: 'googexhibit991q32025.htm', asOf: '2025-Q3', target: '2025', shape: 'RANGE', sourceId: 'goog-2025-q3-earnings-call', publishedAt: '2025-10-29T20:30:00.000Z' },
  { accessionNumber: '0001652044-26-000012', filingDate: '2026-02-04', reportDate: '2026-02-04', form: '8-K', primaryDocument: 'goog-20260204.htm', evidenceDocument: 'googexhibit991q42025.htm', asOf: '2025-Q4', target: '2026', shape: 'RANGE', sourceId: 'goog-2025-q4-earnings-call', publishedAt: '2026-02-04T21:30:00.000Z' },
])

function plain(html) { return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/&nbsp;|&#160;/gi, ' ').replace(/&ndash;|&#8211;|&mdash;|&#8212;/gi, '–').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }
function evidenceUrl(snapshot) { return snapshot.acquisitionMode === 'FIXTURE' ? snapshot.evidenceUrl : snapshot.finalUrl }
function logicalKey(item) { return [item.companyTicker, item.metric, item.periodType, item.period, item.guidanceAsOfPeriod, item.guidanceShape, item.unit, item.sourceId, item.capexDefinitionId].join('|') }
function legacyId(item) { const ids = { '2024-Q4:CAPEX_GUIDANCE_POINT': 'goog-2025-initial-capex-guidance-approximate', '2025-Q1:CAPEX_GUIDANCE_POINT': 'goog-2025-q1-capex-guidance-approximate', '2025-Q2:CAPEX_GUIDANCE_POINT': 'goog-2025-q2-capex-guidance-approximate', '2025-Q3:CAPEX_GUIDANCE_LOW': 'goog-2025-q3-capex-guidance-low', '2025-Q3:CAPEX_GUIDANCE_HIGH': 'goog-2025-q3-capex-guidance-high', '2025-Q4:CAPEX_GUIDANCE_LOW': 'goog-2026-capex-guidance-low', '2025-Q4:CAPEX_GUIDANCE_HIGH': 'goog-2026-capex-guidance-high' }; return ids[`${item.guidanceAsOfPeriod}:${item.metric}`] ?? fail('OBSERVATION_ID', 'Unknown GOOG guidance identity') }
function observation(item, id) { return { id, companyTicker: item.companyTicker, metric: item.metric, value: item.value, unit: item.unit, period: item.period, periodType: item.periodType, guidanceAsOfPeriod: item.guidanceAsOfPeriod, capexDefinitionId: item.capexDefinitionId, approximate: item.approximate, publishedAt: item.publishedAt, retrievedAt: item.retrievedAt, sourceId: item.sourceId, sourceUrl: item.sourceUrl } }

export function discoverGoogGuidanceFilings(submissions) {
  if (String(submissions?.cik).padStart(10, '0') !== GOOG_SEC_ACQUISITION.cik || !/^Alphabet Inc\.$/i.test(submissions?.name ?? '')) fail('DISCOVERY_ISSUER', 'SEC submissions response is not Alphabet')
  const recent = submissions?.filings?.recent, fields = ['accessionNumber', 'filingDate', 'reportDate', 'form', 'primaryDocument']
  if (!recent || fields.some((field) => !Array.isArray(recent[field]))) fail('DISCOVERY_SCHEMA', 'SEC recent-filings metadata is incomplete')
  const count = recent.accessionNumber.length
  if (fields.some((field) => recent[field].length !== count)) fail('DISCOVERY_SCHEMA', 'SEC recent-filings arrays are inconsistent')
  const expected = GOOG_GUIDANCE_DISCLOSURES.filter((item) => item.accessionNumber)
  const found = expected.map((target) => { const index = recent.accessionNumber.indexOf(target.accessionNumber); if (index < 0) fail('MISSING_DISCLOSURE', `Missing Alphabet filing ${target.accessionNumber}`); const metadata = Object.fromEntries(fields.map((field) => [field, recent[field][index]])); if (metadata.form !== '8-K' || metadata.filingDate !== target.filingDate || metadata.reportDate !== target.reportDate || metadata.primaryDocument !== target.primaryDocument) fail('FILING_PROVENANCE', 'Alphabet filing metadata does not match the registered disclosure'); return { ...target, ...metadata, filingUrl: buildSecArchiveUrl({ cik: GOOG_SEC_ACQUISITION.cik, accessionNumber: target.accessionNumber, primaryDocument: target.evidenceDocument }) } })
  return found.sort((a, b) => a.asOf.localeCompare(b.asOf))
}

export function parseGoogAnnualCapexGuidance(snapshot, html, source = GOOG_GUIDANCE_SOURCE) {
  const p = snapshot.provenance, body = plain(html)
  if (snapshot.httpStatus !== 200 || !snapshot.contentType.toLowerCase().includes('html')) fail('DOCUMENT_RESPONSE', 'Alphabet evidence response is not HTML 200')
  if (!p || p.economicIssuer !== 'GOOG' || p.issuer !== 'Alphabet Inc.' || !['8-K', 'EARNINGS_CALL'].includes(p.formType)) fail('DOCUMENT_PROVENANCE', 'Alphabet evidence provenance is inconsistent')
  if (!/^202[45]-Q[1-4]$/.test(p.guidanceAsOfPeriod ?? '') || !/^20\d{2}$/.test(p.targetPeriod ?? '')) fail('GUIDANCE_PERIOD', 'Target year or guidanceAsOfPeriod is invalid')
  const url = evidenceUrl(snapshot); if (url !== p.evidenceUrl || !['www.sec.gov', 'abc.xyz'].includes(new URL(url).hostname)) fail('DOCUMENT_PROVENANCE', 'Official evidence URL is inconsistent')
  if (!/Alphabet Inc\.|Alphabet earnings/i.test(body)) fail('WRONG_DOCUMENT', 'Document is not an Alphabet disclosure')
  if (!/purchases of property and equipment/i.test(body) || !/capital expenditures|CapEx/i.test(body)) fail('CAPEX_DEFINITION', 'Alphabet PP&E-purchases definition parity is not proven')
  if (/for the quarter[^.]{0,80}\$\s*[\d,.]+\s*billion/i.test(body) && !/expect|approximately|range/i.test(body)) fail('QUARTERLY_ACTUAL', 'Quarterly actual cannot be annual guidance')
  if (!new RegExp('(?:capital expenditures|CapEx)[^.]{0,180}' + p.targetPeriod + '|' + p.targetPeriod + '[^.]{0,180}(?:capital expenditures|CapEx)', 'i').test(body)) fail('TARGET_PERIOD', 'Annual guidance target year is not proven')
  const common = { issuer: source.issuer, companyTicker: source.ticker, period: p.targetPeriod, periodType: 'YEAR', guidanceAsOfPeriod: p.guidanceAsOfPeriod, capexDefinitionId: source.definitionId, unit: source.unit, sourceId: p.sourceId, sourceUrl: url, publishedAt: p.publishedAt, retrievedAt: snapshot.retrievedAt, snapshotId: snapshot.snapshotId, sourceDocumentVersionId: p.sourceDocumentVersionId }
  const numeric = (raw) => { if (!/^\d+(?:\.\d+)?$/.test(raw.replaceAll(',', ''))) fail('MALFORMED_NUMBER', 'Malformed guidance value'); return Number(raw.replaceAll(',', '')) }
  if (p.expectedShape === 'APPROXIMATE_POINT') {
    const matches = [...body.matchAll(/(?:approximately|approx\.)\s*\$\s*([\d,.]+)\s*billion[^.]{0,120}(?:capital expenditures|CapEx)|(?:capital expenditures|CapEx)[^.]{0,120}(?:approximately|approx\.)\s*\$\s*([\d,.]+)\s*billion/gi)]
    if (matches.length !== 1) fail(matches.length ? 'AMBIGUOUS_APPROXIMATION' : 'APPROXIMATION_REQUIRED', 'Expected one explicitly approximate annual guidance point')
    const value = numeric(matches[0][1] ?? matches[0][2]); return [{ ...common, candidateType: 'NUMERIC_METRIC', metric: 'CAPEX_GUIDANCE_POINT', semanticRole: 'GUIDANCE_POINT', guidanceShape: 'APPROXIMATE_POINT', approximate: true, value, sourceLocator: { document: p.evidenceDocument, disclosure: matches[0][0] } }]
  }
  if (p.expectedShape !== 'RANGE') fail('GUIDANCE_SHAPE', 'Unsupported guidance shape')
  const matches = [...body.matchAll(/(?:capital expenditures|CapEx)[^.]{0,140}(?:range of\s*)?\$\s*([\d,.]+)\s*(?:billion\s*)?(?:to|–|-)\s*\$\s*([\d,.]+)\s*billion/gi)]
  if (matches.length !== 1) fail(matches.length ? 'DUPLICATE_RANGE' : 'INCOMPLETE_RANGE', 'Expected one complete annual guidance range')
  const low = numeric(matches[0][1]), high = numeric(matches[0][2]); if (low > high) fail('RANGE_ORDER', 'Guidance LOW exceeds HIGH')
  const base = { ...common, candidateType: 'NUMERIC_METRIC', semanticRole: 'GUIDANCE_BOUND', guidanceShape: 'RANGE', approximate: false, sourceLocator: { document: p.evidenceDocument, disclosure: matches[0][0] } }
  return [{ ...base, metric: 'CAPEX_GUIDANCE_LOW', bound: 'LOW', value: low }, { ...base, metric: 'CAPEX_GUIDANCE_HIGH', bound: 'HIGH', value: high }]
}

export function validateGoogGuidanceCandidates(candidates, snapshot, source = GOOG_GUIDANCE_SOURCE) {
  if (!Array.isArray(candidates) || ![1, 2].includes(candidates.length)) fail('GUIDANCE_ATOMICITY', 'Guidance must be one approximate point or one LOW/HIGH pair')
  for (const item of candidates) if (item.companyTicker !== 'GOOG' || item.periodType !== 'YEAR' || item.capexDefinitionId !== source.definitionId || item.unit !== source.unit || item.snapshotId !== snapshot.snapshotId || !['2025', '2026'].includes(item.period)) fail('VALIDATION_FAILED', 'GOOG annual guidance contract failed')
  if (candidates.length === 1 && (candidates[0].metric !== 'CAPEX_GUIDANCE_POINT' || candidates[0].guidanceShape !== 'APPROXIMATE_POINT' || candidates[0].approximate !== true)) fail('APPROXIMATION_REQUIRED', 'Approximate point semantics were lost')
  if (candidates.length === 2) { const low = candidates.find((x) => x.metric === 'CAPEX_GUIDANCE_LOW'), high = candidates.find((x) => x.metric === 'CAPEX_GUIDANCE_HIGH'); if (!low || !high || low.value > high.value || ['period', 'guidanceAsOfPeriod', 'unit', 'sourceId', 'sourceDocumentVersionId'].some((field) => low[field] !== high[field])) fail('RANGE_ATOMICITY', 'Range bounds are incomplete or inconsistent') }
  return candidates
}

async function collectDisclosure({ disclosure, outputRoot, retrievedAt, fetchImpl, secUserAgent, source, acquisitionMode, fixturePath, signal, transport }) {
  let response, requestedUrl, finalUrl, body
  const evidence = disclosure.filingUrl ?? disclosure.officialUrl
  if (disclosure.accessionNumber) { const filing = { ...disclosure, primaryDocument: disclosure.evidenceDocument, filingUrl: disclosure.filingUrl }; const result = await collectSecFiling({ filing, cik: GOOG_SEC_ACQUISITION.cik, userAgent: secUserAgent, fetchImpl, signal, responseErrorCode: 'DOCUMENT_RESPONSE', transport }); ({ response, requestedUrl, finalUrl, body } = result) }
  else { const collected = await requestWithRetry({ ...transport, url: disclosure.officialUrl, options: { headers: { 'user-agent': 'AI Infrastructure Monitor data-ingestion', accept: 'text/html,application/xhtml+xml' }, redirect: 'follow' }, errorCode: 'SOURCE_UNAVAILABLE', httpErrorCode: 'DOCUMENT_RESPONSE', fetchImpl, signal }); ({ response, requestedUrl, finalUrl, body } = collected); if (finalUrl !== requestedUrl || new URL(finalUrl).hostname !== 'abc.xyz') fail('DOCUMENT_PROVENANCE', 'Alphabet IR document redirected unexpectedly') }
  return persistRawSnapshot({ body, source, requestedUrl, finalUrl, retrievedAt, status: response.status, contentType: response.headers.get('content-type') ?? '', outputRoot, acquisitionMode, acquisitionChannel: disclosure.accessionNumber ? 'SEC_EDGAR' : 'ALPHABET_INVESTOR_RELATIONS', fixturePath: acquisitionMode === 'FIXTURE' ? fixturePath : undefined, fixtureId: acquisitionMode === 'FIXTURE' ? (disclosure.accessionNumber ?? disclosure.versionId) : undefined, evidenceUrl: evidence, provenance: { cik: disclosure.accessionNumber ? GOOG_SEC_ACQUISITION.cik : null, accessionNumber: disclosure.accessionNumber, formType: disclosure.form, filingDate: disclosure.filingDate, reportDate: disclosure.reportDate, primaryDocument: disclosure.primaryDocument, evidenceDocument: disclosure.evidenceDocument ?? 'Alphabet official earnings-call page', evidenceUrl: evidence, issuer: 'Alphabet Inc.', economicIssuer: 'GOOG', filedWith: disclosure.accessionNumber ? GOOG_SEC_ACQUISITION.filedWith : 'Alphabet Investor Relations', acquisitionChannel: disclosure.accessionNumber ? 'SEC_EDGAR' : 'ALPHABET_INVESTOR_RELATIONS', guidanceAsOfPeriod: disclosure.asOf, targetPeriod: disclosure.target, expectedShape: disclosure.shape, sourceId: disclosure.sourceId, sourceDocumentVersionId: disclosure.accessionNumber ?? disclosure.versionId, publishedAt: disclosure.publishedAt, definitionId: source.definitionId } })
}

export async function ingestGoogAnnualGuidance({ outputRoot, retrievedAt = new Date().toISOString(), fetchImpl = fetch, secUserAgent = process.env.SEC_USER_AGENT, source = GOOG_GUIDANCE_SOURCE, acquisitionMode = 'LIVE', fixturePath = 'tests/ingestion/googGuidanceIngestion.test.mjs', signal, transport = {} }) {
  const frozen = acquisitionMode === 'LIVE' ? await verifyGoogFrozenQ1Baseline(outputRoot) : null
  const { submissions } = await fetchSecSubmissions({ cik: GOOG_SEC_ACQUISITION.cik, userAgent: secUserAgent, fetchImpl, signal, transport })
  const sec = discoverGoogGuidanceFilings(submissions), byAccession = new Map(sec.map((item) => [item.accessionNumber, item]))
  const disclosures = GOOG_GUIDANCE_DISCLOSURES.map((item) => item.accessionNumber ? byAccession.get(item.accessionNumber) : item)
  if (disclosures.some((item) => !item)) fail('MISSING_DISCLOSURE', 'Alphabet guidance history is incomplete')
  const candidates = [], snapshots = [], collectable = frozen ? disclosures.filter((item) => item.accessionNumber) : disclosures
  for (const disclosure of collectable) { const persisted = await collectDisclosure({ disclosure, outputRoot, retrievedAt, fetchImpl, secUserAgent, source, acquisitionMode, fixturePath, signal, transport }); const parsed = parseGoogAnnualCapexGuidance(persisted.snapshot, persisted.body, source); validateGoogGuidanceCandidates(parsed, persisted.snapshot, source); candidates.push(...parsed); snapshots.push(persisted.snapshot) }
  if (new Set(candidates.map(logicalKey)).size !== candidates.length) fail('DUPLICATE_FACT', 'Duplicate semantic guidance fact')
  const canonicalPath = path.join(outputRoot, 'observations', 'goog-annual-capex-guidance.json')
  const promotion = await promoteCanonicalAtomically({ candidates, snapshotIds: [...snapshots.map((item) => item.snapshotId), ...(frozen ? [frozen.snapshotId] : [])], canonicalPath, pipelineId: 'goog-annual-capex-guidance', issuer: 'GOOG', sourceId: source.id, logicalFactKey: logicalKey, observationId: legacyId, toObservation: observation, envelope: { capexDefinitionId: source.definitionId } })
  return { disclosures, snapshots, candidates, warnings: frozen ? [frozen.warning] : [], frozenBaselineVerified: Boolean(frozen), canonicalPath, ...promotion }
}

export { IngestionError, sha256 }
