import path from 'node:path'
import { IngestionError, fail } from './shared/ingestion-error.mjs'
import { buildSecArchiveUrl, fetchSecSubmissions, collectSecFiling } from './shared/sec-client.mjs'
import { persistRawSnapshot, sha256 } from './shared/snapshot-store.mjs'
import { promoteCanonicalAtomically } from './shared/canonical-store.mjs'

export const META_GUIDANCE_SOURCE = Object.freeze({ id: 'meta-annual-capex-guidance-sec', issuer: 'META', ticker: 'META', tier: 'TIER_1_OFFICIAL', definitionId: 'meta-capex-including-finance-lease-principal', unit: 'USD billions' })
export const META_SEC_ACQUISITION = Object.freeze({ cik: '0001326801', submissionsUrl: 'https://data.sec.gov/submissions/CIK0001326801.json', channel: 'SEC_EDGAR', filedWith: 'SEC EDGAR' })
const targetReports = new Map([
  ['2025-12-31', { form: '10-K', asOf: '2025-Q4', sourceId: 'meta-capex-2025q4-guidance' }],
  ['2026-03-31', { form: '10-Q', asOf: '2026-Q1', sourceId: 'meta-capex-2026q1-guidance' }],
  ['2026-06-30', { form: '10-Q', asOf: '2026-Q2', sourceId: 'meta-capex-2026q2-guidance' }],
])

function text(html) { return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/&nbsp;|&#160;/gi, ' ').replace(/&ndash;|&#8211;/gi, '–').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }
function evidenceUrl(snapshot) { return snapshot.acquisitionMode === 'FIXTURE' ? snapshot.evidenceUrl : snapshot.finalUrl }
function legacyId(candidate) {
  const suffix = candidate.guidanceAsOfPeriod === '2025-Q4' ? `2026-full-year-capex-guidance-${candidate.bound.toLowerCase()}-2025q4` : `2026-${candidate.guidanceAsOfPeriod.slice(-2).toLowerCase()}-capex-guidance-${candidate.bound.toLowerCase()}`
  return `meta-${suffix}`
}
function logicalKey(item) { return [item.companyTicker, item.metric, item.periodType, item.period, item.guidanceAsOfPeriod, item.guidanceShape, item.unit, item.sourceId, item.capexDefinitionId].join('|') }
function observation(item, id) { return { id, companyTicker: item.companyTicker, metric: item.metric, value: item.value, unit: item.unit, period: item.period, periodType: item.periodType, guidanceAsOfPeriod: item.guidanceAsOfPeriod, capexDefinitionId: item.capexDefinitionId, publishedAt: item.publishedAt, retrievedAt: item.retrievedAt, sourceId: item.sourceId, sourceUrl: item.sourceUrl } }

export function discoverMetaGuidanceFilings(submissions) {
  if (String(submissions?.cik).padStart(10, '0') !== META_SEC_ACQUISITION.cik || !/^Meta Platforms, Inc\.$/i.test(submissions?.name ?? '')) fail('DISCOVERY_ISSUER', 'SEC submissions response is not Meta Platforms')
  const recent = submissions?.filings?.recent
  const fields = ['accessionNumber', 'filingDate', 'reportDate', 'form', 'primaryDocument']
  if (!recent || fields.some((field) => !Array.isArray(recent[field]))) fail('DISCOVERY_SCHEMA', 'SEC recent-filings metadata is incomplete')
  const count = recent.accessionNumber.length
  if (fields.some((field) => recent[field].length !== count)) fail('DISCOVERY_SCHEMA', 'SEC recent-filings arrays are inconsistent')
  const filings = []
  for (let index = 0; index < count; index++) {
    const filing = Object.fromEntries(fields.map((field) => [field, recent[field][index]]))
    const target = targetReports.get(filing.reportDate)
    if (target && filing.form === target.form && /^meta-20\d{6}\.htm$/i.test(filing.primaryDocument)) filings.push({ ...filing, guidanceAsOfPeriod: target.asOf, sourceId: target.sourceId, filingUrl: buildSecArchiveUrl({ cik: META_SEC_ACQUISITION.cik, accessionNumber: filing.accessionNumber, primaryDocument: filing.primaryDocument }) })
  }
  if (new Set(filings.map((item) => item.guidanceAsOfPeriod)).size !== filings.length) fail('DUPLICATE_DISCLOSURE', 'Multiple filings map to the same guidance reporting period')
  return filings.sort((a, b) => a.reportDate.localeCompare(b.reportDate))
}

export function parseMetaAnnualCapexGuidance(snapshot, html, source = META_GUIDANCE_SOURCE) {
  const p = snapshot.provenance, body = text(html)
  if (snapshot.httpStatus !== 200 || !snapshot.contentType.toLowerCase().includes('html')) fail('FILING_RESPONSE', 'Meta filing response is not HTML 200')
  if (!p || p.cik !== META_SEC_ACQUISITION.cik || p.issuer !== 'Meta Platforms, Inc.' || !['10-K', '10-Q'].includes(p.formType)) fail('FILING_PROVENANCE', 'Meta filing provenance is inconsistent')
  if (evidenceUrl(snapshot) !== p.secFilingUrl || new URL(evidenceUrl(snapshot)).hostname !== 'www.sec.gov') fail('FILING_PROVENANCE', 'SEC archive URL is inconsistent')
  if (!new RegExp(`FORM ${p.formType.replace('-', '[- ]?')}`, 'i').test(body) || !/Meta Platforms, Inc\./i.test(body)) fail('WRONG_DOCUMENT', 'Filing is not the expected Meta report')
  if (!/^202[56]-Q[1-4]$/.test(p.guidanceAsOfPeriod ?? '')) fail('GUIDANCE_AS_OF', 'guidanceAsOfPeriod is missing or invalid')
  if (!/capital expenditures[^.]{0,180}(?:includes|including)[^.]{0,120}principal payments on finance leases/i.test(body)) fail('CAPEX_DEFINITION', 'Finance-lease-inclusive capital expenditure definition is not proven')
  const matches = [...body.matchAll(/anticipate making capital expenditures of approximately \$\s*([\d,.]+)\s*billion\s+to\s+\$?\s*([\d,.]+)\s*billion\s+in\s+(20\d{2})\b/gi)]
  if (matches.length !== 1) fail(matches.length === 0 ? 'GUIDANCE_RANGE' : 'DUPLICATE_RANGE', 'Expected exactly one unambiguous annual CapEx guidance range')
  const numeric = (raw) => { if (!/^\d+(?:\.\d+)?$/.test(raw.replaceAll(',', ''))) fail('MALFORMED_NUMBER', 'Malformed guidance bound'); return Number(raw.replaceAll(',', '')) }
  const low = numeric(matches[0][1]), high = numeric(matches[0][2]), year = matches[0][3]
  if (year !== '2026') fail('TARGET_PERIOD', 'Annual guidance target period is not 2026')
  if (!(low <= high)) fail('RANGE_ORDER', 'Guidance LOW exceeds HIGH')
  const common = { issuer: source.issuer, companyTicker: source.ticker, period: year, periodType: 'YEAR', guidanceAsOfPeriod: p.guidanceAsOfPeriod, guidanceShape: 'RANGE', semanticRole: 'GUIDANCE_BOUND', capexDefinitionId: source.definitionId, unit: source.unit, sourceId: p.sourceId, sourceUrl: evidenceUrl(snapshot), publishedAt: `${p.filingDate}T00:00:00.000Z`, retrievedAt: snapshot.retrievedAt, snapshotId: snapshot.snapshotId, sourceDocumentVersionId: p.accessionNumber }
  const locator = { accessionNumber: p.accessionNumber, primaryDocument: p.primaryDocument, section: 'Liquidity and Capital Resources', disclosure: matches[0][0] }
  return [{ ...common, candidateType: 'NUMERIC_METRIC', metric: 'CAPEX_GUIDANCE_LOW', bound: 'LOW', value: low, sourceLocator: locator }, { ...common, candidateType: 'NUMERIC_METRIC', metric: 'CAPEX_GUIDANCE_HIGH', bound: 'HIGH', value: high, sourceLocator: locator }]
}

export function validateMetaGuidanceRange(candidates, snapshot, source = META_GUIDANCE_SOURCE) {
  if (!Array.isArray(candidates) || candidates.length !== 2) fail('RANGE_ATOMICITY', 'Exactly one LOW/HIGH pair is required')
  const [low, high] = ['LOW', 'HIGH'].map((bound) => candidates.find((item) => item.bound === bound))
  if (!low || !high) fail('RANGE_ATOMICITY', 'Both LOW and HIGH are required')
  for (const field of ['companyTicker', 'period', 'periodType', 'guidanceAsOfPeriod', 'guidanceShape', 'capexDefinitionId', 'unit', 'sourceId', 'sourceDocumentVersionId']) if (low[field] !== high[field]) fail('RANGE_ATOMICITY', `Range ${field} is inconsistent`)
  if (low.companyTicker !== 'META' || low.period !== '2026' || low.periodType !== 'YEAR' || low.guidanceShape !== 'RANGE' || low.capexDefinitionId !== source.definitionId || low.unit !== source.unit || low.metric !== 'CAPEX_GUIDANCE_LOW' || high.metric !== 'CAPEX_GUIDANCE_HIGH' || low.value > high.value) fail('VALIDATION_FAILED', 'Meta annual guidance contract failed')
  if (low.snapshotId !== snapshot.snapshotId || high.snapshotId !== snapshot.snapshotId || low.sourceUrl !== evidenceUrl(snapshot)) fail('FILING_PROVENANCE', 'Candidate provenance is inconsistent')
  return candidates
}

async function collect({ filing, outputRoot, retrievedAt, fetchImpl, secUserAgent, source, acquisitionMode, fixturePath, signal, transport }) {
  const collected = await collectSecFiling({ filing, cik: META_SEC_ACQUISITION.cik, userAgent: secUserAgent, fetchImpl, signal, responseErrorCode: 'FILING_RESPONSE', transport })
  return persistRawSnapshot({ body: collected.body, source, requestedUrl: collected.requestedUrl, finalUrl: collected.finalUrl, retrievedAt, status: collected.response.status, contentType: collected.response.headers.get('content-type') ?? '', outputRoot, acquisitionMode, acquisitionChannel: META_SEC_ACQUISITION.channel, fixturePath: acquisitionMode === 'FIXTURE' ? fixturePath : undefined, fixtureId: acquisitionMode === 'FIXTURE' ? filing.accessionNumber : undefined, evidenceUrl: filing.filingUrl, provenance: { cik: META_SEC_ACQUISITION.cik, accessionNumber: filing.accessionNumber, formType: filing.form, filingDate: filing.filingDate, reportDate: filing.reportDate, primaryDocument: filing.primaryDocument, secFilingUrl: filing.filingUrl, issuer: 'Meta Platforms, Inc.', economicIssuer: 'META', evidenceDocument: `META_ISSUER_FILED_FORM_${filing.form.replace('-', '_')}`, filedWith: META_SEC_ACQUISITION.filedWith, acquisitionChannel: META_SEC_ACQUISITION.channel, guidanceAsOfPeriod: filing.guidanceAsOfPeriod, sourceId: filing.sourceId, definitionId: source.definitionId } })
}

export async function ingestMetaAnnualGuidance({ outputRoot, retrievedAt = new Date().toISOString(), fetchImpl = fetch, secUserAgent = process.env.SEC_USER_AGENT, source = META_GUIDANCE_SOURCE, acquisitionMode = 'LIVE', fixturePath = 'tests/ingestion/metaGuidanceIngestion.test.mjs', signal, transport = {} }) {
  const { submissions } = await fetchSecSubmissions({ cik: META_SEC_ACQUISITION.cik, userAgent: secUserAgent, fetchImpl, signal, transport })
  const filings = discoverMetaGuidanceFilings(submissions)
  if (filings.length !== targetReports.size) fail('MISSING_DISCLOSURE', 'Required Meta guidance history is incomplete')
  const candidates = [], snapshots = []
  for (const filing of filings) { const persisted = await collect({ filing, outputRoot, retrievedAt, fetchImpl, secUserAgent, source, acquisitionMode, fixturePath, signal, transport }); const pair = parseMetaAnnualCapexGuidance(persisted.snapshot, persisted.body, source); validateMetaGuidanceRange(pair, persisted.snapshot, source); candidates.push(...pair); snapshots.push(persisted.snapshot) }
  const canonicalPath = path.join(outputRoot, 'observations', 'meta-annual-capex-guidance.json')
  const promotion = await promoteCanonicalAtomically({ candidates, snapshotIds: snapshots.map((item) => item.snapshotId), canonicalPath, pipelineId: 'meta-annual-capex-guidance', issuer: 'META', sourceId: source.id, logicalFactKey: logicalKey, observationId: legacyId, toObservation: observation, envelope: { capexDefinitionId: source.definitionId } })
  return { filings, snapshots, candidates, canonicalPath, ...promotion }
}

export { IngestionError, legacyId as legacyMetaGuidanceObservationId, logicalKey as metaGuidanceLogicalFactKey, sha256 }
