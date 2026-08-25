import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { IngestionError, MSFT_CAPEX_DISCLOSURES, ingestMsftManagementTotalCapex, parseMsftManagementTotalCapex, validateMsftManagementTotalCapex, validateMsftComparisonHistory } from '../../scripts/ingestion/msft-capex-lib.mjs'

const fixture = (period) => `tests/fixtures/ingestion/msft/${period.replace('MSFT-','').toLowerCase()}.html`
function response(body, url, status = 200) { return { status, url, headers: new Headers({ 'content-type': 'text/html' }), arrayBuffer: async () => Buffer.from(body) } }
async function fetcher(transform = (html) => html, status = 200) { const bodies = new Map(); for (const d of MSFT_CAPEX_DISCLOSURES) bodies.set(d.period, await readFile(fixture(d.period), 'utf8')); return async (url) => { const d = MSFT_CAPEX_DISCLOSURES.find((x) => x.officialUrl === url); if (!d) throw new Error(`unexpected URL ${url}`); return response(transform(bodies.get(d.period), d), url, status) } }
const root = () => mkdtemp(path.join(os.tmpdir(), 'msft-capex-test-'))
async function ingest(outputRoot, transform, status) { return ingestMsftManagementTotalCapex({ outputRoot, retrievedAt: '2026-08-14T00:00:00.000Z', fetchImpl: await fetcher(transform, status), acquisitionMode: 'FIXTURE', fixturePath: 'tests/ingestion/msftCapexIngestion.test.mjs', transport: { sleep: async () => {}, random: () => 0 } }) }

test('official transcripts parse old and new management-total structures with exact history', async () => { const r = await ingest(await root()); assert.equal(r.created, 7); assert.equal(r.revisions, 0); assert.deepEqual(r.candidates.map((x) => [x.period,x.value,x.financeLeaseTreatment]), MSFT_CAPEX_DISCLOSURES.map((x) => [x.period,x.expectedValue,'INCLUDED'])); assert.deepEqual(r.candidates.map((x) => x.sourceLocator.disclosureStructure), ['ATOMIC_INCLUDING_FINANCE_LEASES','ATOMIC_INCLUDING_FINANCE_LEASES','ATOMIC_INCLUDING_FINANCE_LEASES','TOTAL_PLUS_FINANCE_LEASE_EVIDENCE_BUNDLE','TOTAL_PLUS_FINANCE_LEASE_EVIDENCE_BUNDLE','TOTAL_PLUS_FINANCE_LEASE_EVIDENCE_BUNDLE','TOTAL_PLUS_FINANCE_LEASE_EVIDENCE_BUNDLE']); assert.ok(r.snapshots.every((x) => x.provenance.publicationVenue === 'Microsoft Investor Relations' && x.provenance.fiscalYearEnd === 'June 30')) })
test('same transcript versions are idempotent with stable IDs', async () => { const outputRoot = await root(), a = await ingest(outputRoot), b = await ingest(outputRoot); assert.equal(b.created, 0); assert.equal(b.revisions, 0); assert.deepEqual(a.document.records.map((x) => x.observation.id), b.document.records.map((x) => x.observation.id)) })

const failures = [
  ['wrong issuer',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('Microsoft','Example'):h,'WRONG_DOCUMENT'],
  ['wrong document',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('Third Quarter','Second Quarter'):h,'WRONG_DOCUMENT'],
  ['wrong fiscal period',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('FY26','FY25'):h,'WRONG_DOCUMENT'],
  ['calendar confusion',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('FY26 Third Quarter','calendar 2026 third quarter'):h,'WRONG_DOCUMENT'],
  ['management definition absent',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('Capital expenditures were $31.9 billion. ',''):h,'MANAGEMENT_TOTAL_DEFINITION'],
  ['finance leases absent',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('This quarter, total finance leases were $4.7 billion. ',''):h,'MANAGEMENT_TOTAL_DEFINITION'],
  ['cash PP&E mistaken for total',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('Capital expenditures were $31.9 billion. ',''):h,'MANAGEMENT_TOTAL_DEFINITION'],
  ['incompatible definition',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('Capital expenditures were','Operating leases were'):h,'MANAGEMENT_TOTAL_DEFINITION'],
  ['duplicate fact',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('</body>','<p>Capital expenditures were $31.9 billion.</p></body>'):h,'DUPLICATE_FACT'],
  ['malformed number',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('$31.9 billion','$abc billion'):h,'MANAGEMENT_TOTAL_DEFINITION'],
  ['ambiguous units',(h,d)=>d.period==='MSFT-FY2026-Q3'?h.replace('$31.9 billion','$31.9 million'):h,'MANAGEMENT_TOTAL_DEFINITION'],
]
for (const [name, transform, code] of failures) test(`${name} fails closed without canonical mutation`, async () => { const outputRoot = await root(); await ingest(outputRoot); const file = path.join(outputRoot,'observations','msft-management-total-capex.json'), before = await readFile(file,'utf8'); await assert.rejects(() => ingest(outputRoot, transform), (e) => e instanceof IngestionError && e.code === code); assert.equal(await readFile(file,'utf8'), before) })
test('invalid fiscal provenance fails closed', async () => { const r = await ingest(await root()), snapshot = structuredClone(r.snapshots[0]); snapshot.provenance.issuerFiscalPeriod = '2025-Q1'; assert.throws(() => parseMsftManagementTotalCapex(snapshot,'<html></html>'), (e) => e.code === 'FISCAL_PERIOD') })
test('missing required comparison quarter is rejected', async () => { const r=await ingest(await root()); assert.throws(() => validateMsftComparisonHistory(r.candidates.slice(1)), (e) => e.code === 'MISSING_COMPARISON_QUARTER') })
test('validator rejects incompatible definition', async () => { const r = await ingest(await root()), x = [{...r.candidates[0],capexDefinitionId:'msft-cash-paid-pp-and-e'}]; assert.throws(() => validateMsftManagementTotalCapex(x,r.snapshots[0]), (e) => e.code === 'VALIDATION_FAILED') })
test('source outage fails closed', async () => { const outputRoot = await root(); await assert.rejects(() => ingestMsftManagementTotalCapex({outputRoot,fetchImpl:async()=>{throw new Error('offline')}}), (e) => e.code === 'SOURCE_UNAVAILABLE') })
test('error page fails closed', async () => { const outputRoot=await root(); await assert.rejects(() => ingest(outputRoot, h=>h, 503), (e) => e.code === 'DOCUMENT_RESPONSE') })
test('inconsistent redirect provenance fails closed', async () => { const outputRoot=await root(); await assert.rejects(() => ingestMsftManagementTotalCapex({outputRoot,fetchImpl:async()=>response('<html/>','https://example.com/redirect')}), (e) => e.code === 'DOCUMENT_PROVENANCE') })
