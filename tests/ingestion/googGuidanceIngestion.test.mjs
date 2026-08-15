import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { GOOG_GUIDANCE_DISCLOSURES, GOOG_SEC_ACQUISITION, IngestionError, discoverGoogGuidanceFilings, ingestGoogAnnualGuidance, parseGoogAnnualCapexGuidance, validateGoogGuidanceCandidates } from '../../scripts/ingestion/goog-guidance-lib.mjs'

const agent = 'AI Infrastructure Monitor tests maintainer@example.com'
const fixtures = new Map([
  ['2024-Q4', 'tests/fixtures/ingestion/goog/2024-q4-guidance.html'], ['2025-Q1', 'tests/fixtures/ingestion/goog/2025-q1-guidance.html'], ['2025-Q2', 'tests/fixtures/ingestion/goog/2025-q2-guidance.html'], ['2025-Q3', 'tests/fixtures/ingestion/goog/2025-q3-guidance.html'], ['2025-Q4', 'tests/fixtures/ingestion/goog/2025-q4-guidance.html'],
])
const sec = GOOG_GUIDANCE_DISCLOSURES.filter((item) => item.accessionNumber)
function submissions() { return { cik: 1652044, name: 'Alphabet Inc.', filings: { recent: Object.fromEntries(['accessionNumber', 'filingDate', 'reportDate', 'form', 'primaryDocument'].map((field) => [field, sec.map((item) => item[field])])) } } }
function response(body, type, url, status = 200) { return { status, url, headers: new Headers({ 'content-type': type }), json: async () => JSON.parse(body), arrayBuffer: async () => Buffer.from(body) } }
async function fetcher(transform = (html) => html, status = 200) { const bodies = new Map(); for (const disclosure of GOOG_GUIDANCE_DISCLOSURES) bodies.set(disclosure.asOf, await readFile(fixtures.get(disclosure.asOf), 'utf8')); return async (url) => { if (url === GOOG_SEC_ACQUISITION.submissionsUrl) return response(JSON.stringify(submissions()), 'application/json', url); const disclosure = GOOG_GUIDANCE_DISCLOSURES.find((item) => url === item.officialUrl || url.endsWith(item.evidenceDocument ?? '__none__')); if (!disclosure) throw new Error(`unexpected URL ${url}`); return response(transform(bodies.get(disclosure.asOf), disclosure), 'text/html', url, status) } }
const root = () => mkdtemp(path.join(os.tmpdir(), 'goog-guidance-test-'))
async function ingest(outputRoot, transform, status) { return ingestGoogAnnualGuidance({ outputRoot, retrievedAt: '2026-08-14T00:00:00.000Z', fetchImpl: await fetcher(transform, status), secUserAgent: agent, acquisitionMode: 'FIXTURE', fixturePath: 'tests/ingestion/googGuidanceIngestion.test.mjs' }) }

test('SEC discovery resolves four immutable filed exhibits and leaves Q1 to official IR', () => { const found = discoverGoogGuidanceFilings(submissions()); assert.equal(found.length, 4); assert.ok(found.every((item) => item.filingUrl.startsWith('https://www.sec.gov/Archives/'))); assert.equal(GOOG_GUIDANCE_DISCLOSURES.filter((item) => item.officialUrl).length, 1) })
test('five disclosures promote seven exact golden guidance observations', async () => { const result = await ingest(await root()); assert.equal(result.created, 7); assert.equal(result.revisions, 0); assert.deepEqual(result.candidates.map((x) => [x.guidanceAsOfPeriod, x.metric, x.value, x.approximate]), [['2024-Q4','CAPEX_GUIDANCE_POINT',75,true],['2025-Q1','CAPEX_GUIDANCE_POINT',75,true],['2025-Q2','CAPEX_GUIDANCE_POINT',85,true],['2025-Q3','CAPEX_GUIDANCE_LOW',91,false],['2025-Q3','CAPEX_GUIDANCE_HIGH',93,false],['2025-Q4','CAPEX_GUIDANCE_LOW',175,false],['2025-Q4','CAPEX_GUIDANCE_HIGH',185,false]]); assert.equal(result.snapshots.filter((x) => x.provenance.filedWith === 'SEC EDGAR').length, 4); assert.equal(result.snapshots.filter((x) => x.provenance.filedWith === 'Alphabet Investor Relations').length, 1) })
test('SEC discovery validates actual event dates and rejects fiscal quarter-end provenance', () => { const found = discoverGoogGuidanceFilings(submissions()); assert.deepEqual(found.map((item) => item.reportDate), ['2025-02-04','2025-07-23','2025-10-29','2026-02-04']); const wrong = submissions(); wrong.filings.recent.reportDate[0] = '2024-12-31'; assert.throws(() => discoverGoogGuidanceFilings(wrong), (error) => error.code === 'FILING_PROVENANCE') })
test('same source versions are idempotent with stable observation IDs', async () => { const outputRoot = await root(), first = await ingest(outputRoot), second = await ingest(outputRoot); assert.equal(second.created, 0); assert.equal(second.revisions, 0); assert.deepEqual(second.document.records.map((x) => x.observation.id), first.document.records.map((x) => x.observation.id)) })

const failures = [
  ['wrong issuer', (h,d) => d.asOf === '2025-Q4' ? h.replace('Alphabet Inc.', 'Example Corp.') : h, 'WRONG_DOCUMENT'],
  ['wrong document', (h,d) => d.asOf === '2025-Q4' ? h.replace('capital expenditures', 'operating expenses') : h, 'TARGET_PERIOD'],
  ['wrong definition', (h,d) => d.asOf === '2025-Q4' ? h.replace('Purchases of property and equipment', 'Depreciation expense') : h, 'CAPEX_DEFINITION'],
  ['missing target year', (h,d) => d.asOf === '2025-Q2' ? h.replace('in 2025', 'in the future') : h, 'TARGET_PERIOD'],
  ['approximate wording lost', (h,d) => d.asOf === '2025-Q2' ? h.replace('approximately ', '') : h, 'APPROXIMATION_REQUIRED'],
  ['ambiguous approximation', (h,d) => d.asOf === '2025-Q2' ? h.replace('</body>', '<p>CapEx is approximately $86 billion.</p></body>') : h, 'AMBIGUOUS_APPROXIMATION'],
  ['incomplete range', (h,d) => d.asOf === '2025-Q3' ? h.replace(' to $93 billion', '') : h, 'INCOMPLETE_RANGE'],
  ['inconsistent units', (h,d) => d.asOf === '2025-Q3' ? h.replace('$93 billion', '$93 million') : h, 'INCOMPLETE_RANGE'],
  ['duplicate semantic fact', (h,d) => d.asOf === '2025-Q3' ? h.replace('</body>', '<p>CapEx range of $91 billion to $93 billion.</p></body>') : h, 'DUPLICATE_RANGE'],
  ['quarterly actual', (h,d) => d.asOf === '2025-Q2' ? h.replace('We are increasing our investment in capital expenditures in 2025 to approximately $85 billion.', 'Capital expenditures for the quarter were $85 billion.') : h, 'QUARTERLY_ACTUAL'],
  ['qualitative commentary', (h,d) => d.asOf === '2025-Q2' ? h.replace('We are increasing our investment in capital expenditures in 2025 to approximately $85 billion.', 'AI infrastructure investment remains important.') : h, 'TARGET_PERIOD'],
  ['malformed numeric', (h,d) => d.asOf === '2025-Q2' ? h.replace('$85 billion', '$abc billion') : h, 'APPROXIMATION_REQUIRED'],
]
for (const [name, transform, code] of failures) test(`${name} fails closed without canonical mutation`, async () => { const outputRoot = await root(); await ingest(outputRoot); const target = path.join(outputRoot, 'observations', 'goog-annual-capex-guidance.json'), before = await readFile(target, 'utf8'); await assert.rejects(() => ingest(outputRoot, transform), (error) => error instanceof IngestionError && error.code === code); assert.equal(await readFile(target, 'utf8'), before) })
test('invalid guidanceAsOfPeriod fails closed', async () => { const result = await ingest(await root()), snapshot = structuredClone(result.snapshots[0]); snapshot.provenance.guidanceAsOfPeriod = 'bad'; assert.throws(() => parseGoogAnnualCapexGuidance(snapshot, '<html></html>'), (error) => error.code === 'GUIDANCE_PERIOD') })
test('LOW greater than HIGH is rejected', async () => { const result = await ingest(await root()), snapshot = result.snapshots[3], html = (await readFile(fixtures.get('2025-Q3'), 'utf8')).replace('$91 billion to $93 billion', '$99 billion to $93 billion'); assert.throws(() => parseGoogAnnualCapexGuidance(snapshot, html), (error) => error.code === 'RANGE_ORDER') })
test('range validator rejects mismatched units', async () => { const result = await ingest(await root()), pair = result.candidates.filter((x) => x.guidanceAsOfPeriod === '2025-Q3').map((x) => ({...x})); pair[1].unit = 'USD millions'; assert.throws(() => validateGoogGuidanceCandidates(pair, result.snapshots[3]), (error) => ['RANGE_ATOMICITY', 'VALIDATION_FAILED'].includes(error.code)) })
test('source outage fails closed', async () => { const outputRoot = await root(); await assert.rejects(() => ingestGoogAnnualGuidance({ outputRoot, fetchImpl: async () => { throw new Error('offline') }, secUserAgent: agent }), (error) => error.code === 'DISCOVERY_UNAVAILABLE') })
