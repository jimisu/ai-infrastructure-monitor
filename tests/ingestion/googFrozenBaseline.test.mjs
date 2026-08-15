import assert from 'node:assert/strict'
import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { GOOG_GUIDANCE_DISCLOSURES, GOOG_SEC_ACQUISITION, ingestGoogAnnualGuidance } from '../../scripts/ingestion/goog-guidance-lib.mjs'
import { GOOG_FROZEN_Q1_BASELINE, verifyGoogFrozenQ1Baseline } from '../../scripts/ingestion/goog-frozen-baseline.mjs'

const agent='AI Infrastructure Monitor tests maintainer@example.com',pinned=GOOG_FROZEN_Q1_BASELINE
const root=()=>mkdtemp(path.join(os.tmpdir(),'goog-frozen-test-'))
async function seed({raw=true}={}){const output=await root();await mkdir(path.join(output,'observations'),{recursive:true});await mkdir(path.join(output,'manifests','GOOG'),{recursive:true});await mkdir(path.join(output,'raw','GOOG'),{recursive:true});await cp('data/ingestion/observations/goog-annual-capex-guidance.json',path.join(output,'observations','goog-annual-capex-guidance.json'));await cp(path.join('data/ingestion/manifests/GOOG',pinned.manifestFile),path.join(output,'manifests','GOOG',pinned.manifestFile));if(raw)await cp(path.join('data/ingestion/raw/GOOG',pinned.rawFile),path.join(output,'raw','GOOG',pinned.rawFile));return output}
const canonicalPath=(output)=>path.join(output,'observations','goog-annual-capex-guidance.json')
const manifestPath=(output)=>path.join(output,'manifests','GOOG',pinned.manifestFile)
async function mutateJson(file,mutate){const document=JSON.parse(await readFile(file,'utf8'));mutate(document);await writeFile(file,JSON.stringify(document))}
const frozenRecord=(document)=>document.records.find((record)=>record.logicalFactKey===pinned.logicalFactKey&&record.status==='ACTIVE')
const sec=GOOG_GUIDANCE_DISCLOSURES.filter((item)=>item.accessionNumber)
const submissions={cik:1652044,name:'Alphabet Inc.',filings:{recent:Object.fromEntries(['accessionNumber','filingDate','reportDate','form','primaryDocument'].map((field)=>[field,sec.map((item)=>item[field])]))}}
function response(body,type,url,status=200){return{status,url,headers:new Headers({'content-type':type}),json:async()=>JSON.parse(body),arrayBuffer:async()=>Buffer.from(body)}}
async function liveFetcher({failEvidence=false}={}){const fixtures=new Map;for(const disclosure of sec)fixtures.set(disclosure.evidenceDocument,await readFile(`tests/fixtures/ingestion/goog/${disclosure.asOf.toLowerCase()}-guidance.html`,'utf8'));const calls=[];return{calls,fetch:async(url)=>{calls.push(url);if(url===GOOG_SEC_ACQUISITION.submissionsUrl)return response(JSON.stringify(submissions),'application/json',url);if(url===pinned.sourceUrl)throw new Error('frozen Q1 must not be fetched');if(failEvidence)throw new Error('new disclosure unavailable');const disclosure=sec.find((item)=>url.endsWith(item.evidenceDocument));if(!disclosure)throw new Error(`unexpected URL ${url}`);return response(fixtures.get(disclosure.evidenceDocument),'text/html',url)}}}
const integrity=(promise)=>assert.rejects(promise,(error)=>error.code==='FROZEN_BASELINE_INTEGRITY')

test('valid frozen Q1 baseline passes every pinned integrity check',async()=>{const output=await seed(),result=await verifyGoogFrozenQ1Baseline(output);assert.equal(result.record.observation.id,pinned.observationId);assert.equal(result.snapshotId,pinned.snapshotId)})
test('live ingestion verifies frozen Q1 without remote reacquisition',async()=>{const output=await seed(),client=await liveFetcher(),result=await ingestGoogAnnualGuidance({outputRoot:output,retrievedAt:'2026-08-15T00:00:00.000Z',fetchImpl:client.fetch,secUserAgent:agent});assert.equal(client.calls.includes(pinned.sourceUrl),false);assert.equal(result.frozenBaselineVerified,true);assert.deepEqual(result.warnings.map((warning)=>warning.code),['KNOWN_HISTORICAL_SOURCE_UNAVAILABLE']);assert.equal(result.document.records.filter((record)=>record.logicalFactKey===pinned.logicalFactKey&&record.status==='ACTIVE').length,1)})
test('changed frozen value fails closed',async()=>{const output=await seed();await mutateJson(canonicalPath(output),(document)=>{frozenRecord(document).observation.value=76});await integrity(verifyGoogFrozenQ1Baseline(output))})
test('changed snapshot hash fails closed',async()=>{const output=await seed();await mutateJson(manifestPath(output),(manifest)=>{manifest.sha256='0'.repeat(64)});await integrity(verifyGoogFrozenQ1Baseline(output))})
test('missing frozen raw snapshot fails closed',async()=>{const output=await seed({raw:false});await integrity(verifyGoogFrozenQ1Baseline(output))})
for(const [name,change] of [['source',(record)=>{record.observation.sourceUrl='https://example.com/'}],['period',(record)=>{record.observation.guidanceAsOfPeriod='2025-Q2'}],['definition',(record)=>{record.observation.capexDefinitionId='incompatible'}]])test(`changed frozen ${name} fails closed`,async()=>{const output=await seed();await mutateJson(canonicalPath(output),(document)=>change(frozenRecord(document)));await integrity(verifyGoogFrozenQ1Baseline(output))})
test('new GOOG disclosure acquisition failure remains fatal',async()=>{const output=await seed(),client=await liveFetcher({failEvidence:true});await assert.rejects(()=>ingestGoogAnnualGuidance({outputRoot:output,fetchImpl:client.fetch,secUserAgent:agent}),(error)=>error.code==='SOURCE_UNAVAILABLE');assert.equal(client.calls.includes(pinned.sourceUrl),false);assert.ok(client.calls.some((url)=>url.startsWith('https://www.sec.gov/Archives/')))})
