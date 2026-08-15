import path from 'node:path'
import { IngestionError, fail } from './shared/ingestion-error.mjs'
import { persistRawSnapshot, sha256 } from './shared/snapshot-store.mjs'
import { promoteCanonicalAtomically } from './shared/canonical-store.mjs'

export const MSFT_CAPEX_SOURCE = Object.freeze({ id: 'msft-management-total-capex-official', issuer: 'MSFT', ticker: 'MSFT', tier: 'TIER_1_OFFICIAL', definitionId: 'msft-management-reported-total-capex', unit: 'USD billions' })
export const MSFT_CAPEX_DISCLOSURES = Object.freeze([
  ['MSFT-FY2025-Q1', 20.0, '2024-10-30T21:30:00.000Z', 'msft-fy2025-q1-earnings-call'],
  ['MSFT-FY2025-Q2', 22.6, '2025-01-29T21:30:00.000Z', 'msft-fy2025-q2-earnings-call'],
  ['MSFT-FY2025-Q3', 21.4, '2025-04-30T21:30:00.000Z', 'msft-fy2025-q3-earnings-call'],
  ['MSFT-FY2025-Q4', 24.2, '2025-07-30T21:30:00.000Z', 'msft-fy2025-q4-earnings-call'],
  ['MSFT-FY2026-Q1', 34.9, '2025-10-29T21:30:00.000Z', 'msft-fy2026-q1-earnings-call'],
  ['MSFT-FY2026-Q2', 37.5, '2026-01-28T21:30:00.000Z', 'msft-fy2026-q2-earnings-call'],
  ['MSFT-FY2026-Q3', 31.9, '2026-04-29T21:30:00.000Z', 'msft-fy2026-q3-earnings-call'],
].map(([period, value, publishedAt, sourceId]) => { const match = /^MSFT-FY(\d{4})-Q([1-4])$/.exec(period); return Object.freeze({ period, expectedValue: value, publishedAt, sourceId, fiscalYear: match[1], fiscalQuarter: match[2], officialUrl: `https://www.microsoft.com/en-us/investor/events/fy-${match[1]}/earnings-fy-${match[1]}-q${match[2]}`, versionId: `microsoft-${period.toLowerCase()}-earnings-call` }) }))

function plain(html) { return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/&nbsp;|&#160;/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }
function evidenceUrl(snapshot) { return snapshot.acquisitionMode === 'FIXTURE' ? snapshot.evidenceUrl : snapshot.finalUrl }
function logicalKey(x) { return [x.companyTicker, x.metric, x.periodType, x.period, x.unit, x.sourceId, x.capexDefinitionId].join('|') }
function legacyId(x) { return `${x.period.toLowerCase()}-management-total-capex` }
function observation(x, id) { return { id, companyTicker: x.companyTicker, metric: x.metric, value: x.value, unit: x.unit, period: x.period, periodType: x.periodType, capexDefinitionId: x.capexDefinitionId, publishedAt: x.publishedAt, retrievedAt: x.retrievedAt, sourceId: x.sourceId, sourceUrl: x.sourceUrl } }

export function parseMsftManagementTotalCapex(snapshot, html, source = MSFT_CAPEX_SOURCE) {
  const p = snapshot.provenance, body = plain(html), url = evidenceUrl(snapshot)
  if (snapshot.httpStatus !== 200 || !snapshot.contentType.toLowerCase().includes('html')) fail('DOCUMENT_RESPONSE', 'Microsoft source is not HTML 200')
  if (!p || p.issuer !== 'Microsoft Corporation' || p.economicIssuer !== 'MSFT' || p.documentType !== 'EARNINGS_CALL_TRANSCRIPT' || p.acquisitionChannel !== 'MICROSOFT_INVESTOR_RELATIONS') fail('DOCUMENT_PROVENANCE', 'Microsoft source provenance is inconsistent')
  if (url !== p.evidenceUrl || new URL(url).hostname !== 'www.microsoft.com') fail('DOCUMENT_PROVENANCE', 'Microsoft official URL is inconsistent')
  const period = /^MSFT-FY(\d{4})-Q([1-4])$/.exec(p.issuerFiscalPeriod ?? ''); if (!period) fail('FISCAL_PERIOD', 'Issuer fiscal period is invalid')
  const ordinal = ['','First','Second','Third','Fourth'][Number(period[2])]
  if (!new RegExp(`Microsoft (?:Fiscal Year |FY)${period[1].slice(-2)}[^.]{0,80}(?:${ordinal}|Q${period[2]})`, 'i').test(body)) fail('WRONG_DOCUMENT', 'Transcript title does not match issuer fiscal period')
  const oldStructure = [...body.matchAll(/capital expenditures\s+including\s+finance leases\s+were\s+\$\s*([\d,.]+)\s+billion/gi)]
  const reportedTotals = [...body.matchAll(/capital expenditures\s+were\s+\$\s*([\d,.]+)\s+billion/gi)]
  const explicitFinanceLeases = /(?:including\s+\$\s*[\d,.]+\s+billion\s+of\s+finance leases|this quarter\s*,?\s*total finance leases were\s+\$\s*[\d,.]+\s+billion)/i.test(body)
  const actual = oldStructure.length ? oldStructure : (explicitFinanceLeases ? reportedTotals : [])
  if (actual.length !== 1) fail(actual.length ? 'DUPLICATE_FACT' : 'MANAGEMENT_TOTAL_DEFINITION', 'Expected one management-total CapEx disclosure including finance leases')
  if (!/cash\s+paid\s+for\s+(?:P\s*,?\s*P\s*,?\s*and\s*E|property\s+and\s+equipment)\s*,?\s*was\s+\$\s*[\d,.]+\s+billion/i.test(body)) fail('DEFINITION_ISOLATION', 'Separate cash-paid PP&E disclosure is required to prove definition isolation')
  const raw = actual[0][1].replaceAll(',', ''); if (!/^\d+(?:\.\d+)?$/.test(raw)) fail('MALFORMED_NUMBER', 'Management-total CapEx value is malformed')
  const value = Number(raw); if (!Number.isFinite(value)) fail('MALFORMED_NUMBER', 'Management-total CapEx value is invalid')
  return [{ issuer: source.issuer, candidateType: 'NUMERIC_METRIC', semanticRole: 'QUARTERLY_ACTUAL', companyTicker: source.ticker, metric: 'CAPEX_ACTUAL', value, unit: source.unit, period: p.issuerFiscalPeriod, periodType: 'QUARTER', capexDefinitionId: source.definitionId, financeLeaseTreatment: 'INCLUDED', fiscalCalendar: 'MICROSOFT_FISCAL_YEAR_END_JUNE_30', sourceId: p.sourceId, sourceUrl: url, publishedAt: p.publishedAt, retrievedAt: snapshot.retrievedAt, snapshotId: snapshot.snapshotId, sourceDocumentVersionId: p.sourceDocumentVersionId, sourceLocator: { document: 'Microsoft official earnings-call transcript', issuerFiscalPeriod: p.issuerFiscalPeriod, disclosureStructure: oldStructure.length ? 'ATOMIC_INCLUDING_FINANCE_LEASES' : 'TOTAL_PLUS_FINANCE_LEASE_EVIDENCE_BUNDLE', disclosure: actual[0][0] } }]
}

export function validateMsftManagementTotalCapex(candidates, snapshot, source = MSFT_CAPEX_SOURCE) {
  if (!Array.isArray(candidates) || candidates.length !== 1) fail('FACT_ATOMICITY', 'Exactly one management-total actual is required per document')
  const x = candidates[0]
  if (x.companyTicker !== 'MSFT' || x.metric !== 'CAPEX_ACTUAL' || x.periodType !== 'QUARTER' || !/^MSFT-FY202[56]-Q[1-4]$/.test(x.period) || x.capexDefinitionId !== source.definitionId || x.financeLeaseTreatment !== 'INCLUDED' || x.unit !== source.unit || x.snapshotId !== snapshot.snapshotId || !Number.isFinite(x.value)) fail('VALIDATION_FAILED', 'Microsoft management-total CapEx contract failed')
  return candidates
}

async function collect({ disclosure, outputRoot, retrievedAt, fetchImpl, source, acquisitionMode, fixturePath }) {
  let response
  try { response = await fetchImpl(disclosure.officialUrl, { headers: { 'user-agent': 'AI Infrastructure Monitor data-ingestion', accept: 'text/html,application/xhtml+xml' }, redirect: 'follow' }) } catch (error) { fail('SOURCE_UNAVAILABLE', 'Microsoft IR request failed', { cause: error.message }) }
  const finalUrl = response.url || disclosure.officialUrl
  if (finalUrl !== disclosure.officialUrl || new URL(finalUrl).hostname !== 'www.microsoft.com') fail('DOCUMENT_PROVENANCE', 'Microsoft IR document redirected unexpectedly')
  const body = Buffer.from(await response.arrayBuffer())
  return persistRawSnapshot({ body, source, requestedUrl: disclosure.officialUrl, finalUrl, retrievedAt, status: response.status, contentType: response.headers.get('content-type') ?? '', outputRoot, acquisitionMode, acquisitionChannel: 'MICROSOFT_INVESTOR_RELATIONS', fixturePath: acquisitionMode === 'FIXTURE' ? fixturePath : undefined, fixtureId: acquisitionMode === 'FIXTURE' ? disclosure.versionId : undefined, evidenceUrl: disclosure.officialUrl, provenance: { issuer: 'Microsoft Corporation', economicIssuer: 'MSFT', evidenceDocument: 'Microsoft official earnings-call transcript', publicationVenue: 'Microsoft Investor Relations', acquisitionChannel: 'MICROSOFT_INVESTOR_RELATIONS', documentType: 'EARNINGS_CALL_TRANSCRIPT', evidenceUrl: disclosure.officialUrl, sourceDocumentVersionId: disclosure.versionId, issuerFiscalPeriod: disclosure.period, fiscalYearEnd: 'June 30', sourceId: disclosure.sourceId, publishedAt: disclosure.publishedAt, definitionId: source.definitionId } })
}

export function validateMsftComparisonHistory(candidates) { const required = new Set(MSFT_CAPEX_DISCLOSURES.map((x) => x.period)); if (!Array.isArray(candidates) || required.size !== candidates.length || candidates.some((x) => !required.has(x.period))) fail('MISSING_COMPARISON_QUARTER', 'Required issuer fiscal comparison history is incomplete'); return candidates }

export async function ingestMsftManagementTotalCapex({ outputRoot, retrievedAt = new Date().toISOString(), fetchImpl = fetch, source = MSFT_CAPEX_SOURCE, acquisitionMode = 'LIVE', fixturePath = 'tests/ingestion/msftCapexIngestion.test.mjs' }) {
  const candidates = [], snapshots = []
  for (const disclosure of MSFT_CAPEX_DISCLOSURES) { const persisted = await collect({ disclosure, outputRoot, retrievedAt, fetchImpl, source, acquisitionMode, fixturePath }); const parsed = parseMsftManagementTotalCapex(persisted.snapshot, persisted.body, source); validateMsftManagementTotalCapex(parsed, persisted.snapshot, source); if (parsed[0].value !== disclosure.expectedValue) fail('GOLDEN_VALUE_MISMATCH', `Unexpected value for ${disclosure.period}`); candidates.push(...parsed); snapshots.push(persisted.snapshot) }
  if (new Set(candidates.map(logicalKey)).size !== candidates.length) fail('DUPLICATE_FACT', 'Duplicate semantic management-total fact')
  validateMsftComparisonHistory(candidates)
  const canonicalPath = path.join(outputRoot, 'observations', 'msft-management-total-capex.json')
  const promotion = await promoteCanonicalAtomically({ candidates, snapshotIds: snapshots.map((x) => x.snapshotId), canonicalPath, pipelineId: 'msft-management-total-capex', issuer: 'MSFT', sourceId: source.id, logicalFactKey: logicalKey, observationId: legacyId, toObservation: observation, envelope: { capexDefinitionId: source.definitionId, fiscalCalendar: 'MICROSOFT_FISCAL_YEAR_END_JUNE_30', financeLeaseTreatment: 'INCLUDED' } })
  return { disclosures: MSFT_CAPEX_DISCLOSURES, snapshots, candidates, canonicalPath, ...promotion }
}

export { IngestionError, sha256 }
