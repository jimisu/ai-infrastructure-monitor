import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { IngestionError } from '../../scripts/ingestion/tsm-monthly-lib.mjs'
import { AMZN_SEC_ACQUISITION, discoverAmznQuarterlyFilings, ingestAmznPpe } from '../../scripts/ingestion/amzn-ppe-lib.mjs'
const fixturePath=path.resolve('tests/fixtures/ingestion/amzn/2026-q1-10q-ppe.html'),agent='AI Infrastructure Monitor tests maintainer@example.com'
const filing={accessionNumber:'0001018724-26-000014',filingDate:'2026-04-30',reportDate:'2026-03-31',form:'10-Q',primaryDocument:'amzn-20260331.htm'}
function submissions(extra=[]){const values=[filing,{accessionNumber:'0001018724-26-000012',filingDate:'2026-04-29',reportDate:'2026-03-31',form:'8-K',primaryDocument:'amzn-20260331x8k.htm'},...extra];return{cik:1018724,name:'Amazon.com, Inc.',filings:{recent:Object.fromEntries(['accessionNumber','filingDate','reportDate','form','primaryDocument'].map((field)=>[field,values.map((value)=>value[field])]))}}}
function response(body,type,url,status=200){return{status,url,headers:new Headers({'content-type':type}),json:async()=>JSON.parse(body),arrayBuffer:async()=>Buffer.from(body)}}
async function fetcher(transform=(html)=>html,{status=200,metadata=submissions(),finalUrl}={}){const html=await readFile(fixturePath,'utf8');return async(url)=>{if(url===AMZN_SEC_ACQUISITION.submissionsUrl)return response(JSON.stringify(metadata),'application/json',url);return response(transform(html),'text/html',finalUrl??url,status)}}
async function root(){return mkdtemp(path.join(os.tmpdir(),'amzn-ppe-test-'))}
async function ingest(outputRoot,options={}){return ingestAmznPpe({outputRoot,retrievedAt:'2026-08-14T00:00:00.000Z',fetchImpl:await fetcher(options.transform,options),secUserAgent:agent,reportPeriod:'2026-Q1'})}
test('SEC discovery selects Amazon 10-Q and excludes other filings',()=>{const found=discoverAmznQuarterlyFilings(submissions());assert.equal(found.length,1);assert.equal(found[0].accessionNumber,filing.accessionNumber);assert.match(found[0].filingUrl,/000101872426000014\/amzn-20260331\.htm$/)})
test('Amazon PP&E ingestion preserves exact definition, provenance, and golden facts',async()=>{const result=await ingest(await root());assert.equal(result.created,2);assert.equal(result.revisions,0);assert.deepEqual(result.document.records.map((record)=>[record.observation.period,record.observation.value,record.observation.unit,record.observation.capexDefinitionId]),[['TTM-2025-Q1',93.093,'USD billions','amzn-purchases-of-property-and-equipment'],['TTM-2026-Q1',151.003,'USD billions','amzn-purchases-of-property-and-equipment']]);const p=result.snapshot.provenance;assert.equal(p.issuer,'Amazon');assert.equal(p.evidenceDocument,'AMAZON_ISSUER_FILED_FORM_10_Q');assert.equal(p.filedWith,'SEC EDGAR');assert.equal(p.acquisitionChannel,'SEC_EDGAR');assert.equal(p.accessionNumber,filing.accessionNumber);assert.match(result.snapshot.sha256,/^[a-f0-9]{64}$/);assert.ok(result.snapshot.rawContentPath)})
test('repeated filing ingestion is idempotent',async()=>{const outputRoot=await root(),first=await ingest(outputRoot),second=await ingest(outputRoot);assert.equal(second.created,0);assert.equal(second.revisions,0);assert.deepEqual(second.document.records.map((record)=>record.observation.id),first.document.records.map((record)=>record.observation.id))})
const failures=[
 ['wrong issuer',(html)=>html.replace('AMAZON.COM, INC.','EXAMPLE CORP'),'WRONG_ISSUER'],
 ['wrong document',(html)=>html.replace(/form 10-q/gi,'FORM 8-K'),'WRONG_ISSUER'],
 ['missing PP&E row',(html)=>html.replace('Purchases of property and equipment</td>','Capital additions</td>'),'MISSING_PPE_ROW'],
 ['duplicate PP&E row',(html)=>html.replace('</table><table>','<tr><td>Purchases of property and equipment</td><td>(25,019)</td><td>(44,203)</td><td>(93,093)</td><td>(151,003)</td></tr></table><table>'),'DUPLICATE_PPE_ROW'],
 ['malformed value',(html)=>html.replace('(151,003)','not-a-number'),'INCOMPLETE_TTM_PERIOD'],
 ['ambiguous units',(html)=>html.replace('(in millions)','(units omitted)'),'AMBIGUOUS_UNITS'],
 ['incomplete TTM period',(html)=>html.replace('Twelve Months Ended March 31,','Year to date March 31,'),'INCOMPLETE_TTM_PERIOD'],
]
for(const [name,transform,code] of failures)test(name+' fails closed without changing canonical data',async()=>{const outputRoot=await root();await ingest(outputRoot);const canonicalPath=path.join(outputRoot,'observations','amzn-ppe-purchases.json'),before=await readFile(canonicalPath,'utf8');await assert.rejects(()=>ingest(outputRoot,{transform}),(error)=>error instanceof IngestionError&&error.code===code);assert.equal(await readFile(canonicalPath,'utf8'),before)})
test('source outage fails closed',async()=>{const outputRoot=await root();await assert.rejects(()=>ingest(outputRoot,{status:503}),(error)=>error instanceof IngestionError&&error.code==='FILING_RESPONSE')})
test('inconsistent provenance redirect fails closed',async()=>{const outputRoot=await root();await assert.rejects(()=>ingest(outputRoot,{finalUrl:'https://example.com/filing.htm'}),(error)=>error instanceof IngestionError&&error.code==='FILING_PROVENANCE')})
test('incompatible definition provenance is rejected',async()=>{const outputRoot=await root();const bad={...filing,filingUrl:'https://www.sec.gov/Archives/edgar/data/1018724/000101872426000014/amzn-20260331.htm'};void bad;const transform=(html)=>html;const fetchImpl=await fetcher(transform);await assert.rejects(()=>ingestAmznPpe({outputRoot,retrievedAt:'2026-08-14T00:00:00.000Z',fetchImpl,secUserAgent:agent,reportPeriod:'2026-Q1',source:{id:'amzn-2026-q1-results',issuer:'AMZN',ticker:'AMZN',tier:'TIER_1_OFFICIAL',definitionId:'amzn-property-equipment-sales-and-incentives',unit:'USD billions'}}),(error)=>error instanceof IngestionError&&error.code==='INCOMPATIBLE_DEFINITION')})
