import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fail } from './shared/ingestion-error.mjs'

export const GOOG_FROZEN_Q1_BASELINE = Object.freeze({
  logicalFactKey: 'GOOG|CAPEX_GUIDANCE_POINT|YEAR|2025|2025-Q1|APPROXIMATE_POINT|USD billions|goog-2025-q1-earnings-call|goog-purchases-of-property-and-equipment',
  observationId: 'goog-2025-q1-capex-guidance-approximate', value: 75, unit: 'USD billions', period: '2025', periodType: 'YEAR', guidanceAsOfPeriod: '2025-Q1', approximate: true,
  capexDefinitionId: 'goog-purchases-of-property-and-equipment', sourceId: 'goog-2025-q1-earnings-call', sourceUrl: 'https://abc.xyz/2025-q1-earnings-call/',
  sourceDocumentVersionId: 'alphabet-2025-q1-earnings-call-2025-04-24', snapshotId: 'raw-snapshot:fixture:sha256:0a6941fd95f219193325a357a209cd5248765e662193d447a7a19f6b797ea85b',
  snapshotSha256: '3cdd705034cd809cf911af0db442beef91e275ea9f049acf484f5662cba7bfae', manifestFile: '0a6941fd95f219193325a357a209cd5248765e662193d447a7a19f6b797ea85b.json', rawFile: '3cdd705034cd809cf911af0db442beef91e275ea9f049acf484f5662cba7bfae.html',
  sourceLocator: Object.freeze({ document: 'Alphabet official earnings-call page', disclosure: 'capital expenditures of approximately $75 billion' }),
})
const integrity=(message,details={})=>fail('FROZEN_BASELINE_INTEGRITY',message,details)
const readJson=async(file,label)=>{try{return JSON.parse(await readFile(file,'utf8'))}catch(error){return integrity(`Frozen GOOG Q1 ${label} is missing or malformed`,{path:file,cause:error.code??error.message})}}
const same=(actual,expected,label)=>{if(actual!==expected)integrity(`Frozen GOOG Q1 ${label} changed`,{expected,actual})}

export async function verifyGoogFrozenQ1Baseline(outputRoot){
 const pinned=GOOG_FROZEN_Q1_BASELINE,canonicalPath=path.join(outputRoot,'observations','goog-annual-capex-guidance.json'),canonical=await readJson(canonicalPath,'canonical document')
 const matching=(canonical.records??[]).filter((record)=>record.status==='ACTIVE'&&record.logicalFactKey===pinned.logicalFactKey)
 if(matching.length!==1)integrity('Frozen GOOG Q1 logical fact is missing or ambiguous',{count:matching.length})
 const record=matching[0],observation=record.observation??{}
 for(const [field,expected] of Object.entries({id:pinned.observationId,value:pinned.value,unit:pinned.unit,period:pinned.period,periodType:pinned.periodType,guidanceAsOfPeriod:pinned.guidanceAsOfPeriod,approximate:pinned.approximate,capexDefinitionId:pinned.capexDefinitionId,sourceId:pinned.sourceId,sourceUrl:pinned.sourceUrl}))same(observation[field],expected,`observation ${field}`)
 same(record.sourceDocumentVersionId,pinned.sourceDocumentVersionId,'source-document identity')
 same(record.snapshotId,pinned.snapshotId,'snapshot identity')
 same(record.sourceLocator?.document,pinned.sourceLocator.document,'source locator document')
 same(record.sourceLocator?.disclosure,pinned.sourceLocator.disclosure,'source locator disclosure')
 const manifestPath=path.join(outputRoot,'manifests','GOOG',pinned.manifestFile),manifest=await readJson(manifestPath,'snapshot manifest')
 for(const [field,expected] of Object.entries({snapshotId:pinned.snapshotId,sha256:pinned.snapshotSha256,evidenceUrl:pinned.sourceUrl}))same(manifest[field],expected,`manifest ${field}`)
 same(manifest.rawContentPath,`raw/GOOG/${pinned.rawFile}`,'manifest raw-content path')
 for(const [field,expected] of Object.entries({sourceDocumentVersionId:pinned.sourceDocumentVersionId,guidanceAsOfPeriod:pinned.guidanceAsOfPeriod,targetPeriod:pinned.period,expectedShape:'APPROXIMATE_POINT',definitionId:pinned.capexDefinitionId,sourceId:pinned.sourceId}))same(manifest.provenance?.[field],expected,`manifest provenance ${field}`)
 const rawPath=path.join(outputRoot,manifest.rawContentPath??''),raw=await readFile(rawPath).catch((error)=>integrity('Frozen GOOG Q1 raw snapshot is missing',{path:rawPath,cause:error.code??error.message})),digest=createHash('sha256').update(raw).digest('hex')
 same(digest,pinned.snapshotSha256,'raw snapshot SHA-256')
 return {record,snapshotId:pinned.snapshotId,warning:{code:'KNOWN_HISTORICAL_SOURCE_UNAVAILABLE',message:'Alphabet Q1 2025 transcript is a verified frozen historical baseline and is not reacquired during unattended ingestion',sourceUrl:pinned.sourceUrl,guidanceAsOfPeriod:pinned.guidanceAsOfPeriod}}
}
