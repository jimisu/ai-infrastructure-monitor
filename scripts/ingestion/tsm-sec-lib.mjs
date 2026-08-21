import path from 'node:path'
import { IngestionError, TSMC_MONTHLY_SOURCE, persistRawSnapshot, logicalFactKey, immutableObservationId, promoteCandidate, validateTsmcCandidates } from './tsm-monthly-lib.mjs'
import { promoteCanonicalAtomically } from './shared/canonical-store.mjs'
import { buildSecArchiveUrl, validateSecUserAgent } from './shared/sec-client.mjs'
import { matchesSecIssuerIdentity } from './shared/sec-issuer-identity.mjs'
import { requestWithRetry } from './shared/http-client.mjs'

export const TSMC_SEC_ACQUISITION = Object.freeze({
  cik: '0001046179', submissionsUrl: 'https://data.sec.gov/submissions/CIK0001046179.json',
  archivesHostname: 'www.sec.gov', formType: '6-K', acquisitionChannel: 'SEC_EDGAR',
  filedWith: 'SEC EDGAR', evidenceType: 'ISSUER_FILED_FORM_6_K',
})
const months = new Map(['january','february','march','april','may','june','july','august','september','october','november','december'].map((month,index)=>[month,index+1]))

function requireUserAgent(value) { return validateSecUserAgent(value) }
function urlFor(filing) {
  if (!/^[A-Za-z0-9._-]+\.htm$/i.test(filing.primaryDocument)) throw new IngestionError('PRIMARY_DOCUMENT', 'Invalid SEC primary document')
  return buildSecArchiveUrl({ cik: TSMC_SEC_ACQUISITION.cik, accessionNumber: filing.accessionNumber, primaryDocument: filing.primaryDocument })
}
function metadataEligible(filing) { return filing.form === '6-K' && /^tsm-revenue\d+(?:x6k)?\.htm$/i.test(filing.primaryDocument) }

export function discoverTsmcMonthlyFilings(submissions) {
  if (!matchesSecIssuerIdentity(submissions, { cik: TSMC_SEC_ACQUISITION.cik, ticker: 'TSM', legalName: 'Taiwan Semiconductor Manufacturing Company Limited' })) throw new IngestionError('DISCOVERY_ISSUER','SEC submissions response is not for TSMC')
  const recent=submissions?.filings?.recent
  const fields=['accessionNumber','filingDate','form','primaryDocument']
  if (!recent || fields.some((field)=>!Array.isArray(recent[field]))) throw new IngestionError('DISCOVERY_SCHEMA','SEC recent-filings metadata is incomplete')
  const count=recent.accessionNumber.length
  if (fields.some((field)=>recent[field].length!==count)) throw new IngestionError('DISCOVERY_SCHEMA','SEC recent-filings arrays are inconsistent')
  const result=[]
  for(let index=0;index<count;index++) {
    const filing=Object.fromEntries(fields.map((field)=>[field,recent[field][index]]))
    if(metadataEligible(filing)) result.push({...filing,filingUrl:urlFor(filing)})
  }
  if(new Set(result.map((item)=>item.accessionNumber)).size!==result.length) throw new IngestionError('DUPLICATE_ACCESSION','SEC discovery contains a duplicate accession')
  return result.sort((a,b)=>a.filingDate.localeCompare(b.filingDate)||a.accessionNumber.localeCompare(b.accessionNumber))
}
async function request(fetchImpl,url,options,code,signal,transport={},httpErrorCode=code) {
  const collected=await requestWithRetry({...transport,url,options,errorCode:code,httpErrorCode,fetchImpl,signal})
  return {status:collected.response.status,url:collected.finalUrl,headers:collected.response.headers,arrayBuffer:async()=>collected.body,json:async()=>JSON.parse(collected.body.toString('utf8')),attempts:collected.attempts}
}
export async function discoverFromSec({fetchImpl=fetch,secUserAgent,signal,transport={}}) {
  const agent=requireUserAgent(secUserAgent??process.env.SEC_USER_AGENT)
  const response=await request(fetchImpl,TSMC_SEC_ACQUISITION.submissionsUrl,{headers:{'user-agent':agent,accept:'application/json'},redirect:'follow'},'DISCOVERY_UNAVAILABLE',signal,transport)
  if(response.status!==200) throw new IngestionError('DISCOVERY_UNAVAILABLE','SEC submissions returned '+response.status)
  if(!(response.headers.get('content-type')??'').toLowerCase().includes('json')) throw new IngestionError('DISCOVERY_CONTENT_TYPE','SEC submissions did not return JSON')
  try { return discoverTsmcMonthlyFilings(await response.json()) } catch(error) { if(error instanceof IngestionError) throw error; throw new IngestionError('DISCOVERY_JSON','SEC submissions response is malformed JSON') }
}
function snapshotEvidenceUrl(snapshot) { return snapshot.acquisitionMode === 'FIXTURE' ? snapshot.evidenceUrl : snapshot.finalUrl }
function textContent(value) { return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/&nbsp;|&#160;/gi,' ').replace(/&#58;/gi,':').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim() }
// A 1,000% absolute ceiling admits extreme real growth while rejecting obvious column-shift corruption.
export const MAX_ABSOLUTE_MONTHLY_YOY_PERCENT = 1000
function numeric(value,field) { const raw=value.replace(/,/g,'').trim(), parenthesized=/^\(\d+(?:\.\d+)?\)$/.test(raw), normalized=parenthesized?'-'+raw.slice(1,-1):raw; if(!/^-?\d+(?:\.\d+)?$/.test(normalized)) throw new IngestionError('MALFORMED_NUMBER','Malformed '+field+': '+value); return Number(normalized) }

export function parseSecMonthlyRevenue(snapshot,html,source=TSMC_MONTHLY_SOURCE) {
  const p=snapshot.provenance
  if(snapshot.httpStatus!==200||!snapshot.contentType.toLowerCase().includes('html')) throw new IngestionError('FILING_RESPONSE','SEC filing response is not HTML 200')
  if(!p||p.cik!==TSMC_SEC_ACQUISITION.cik||p.formType!=='6-K'||p.issuer!=='TSMC') throw new IngestionError('FILING_PROVENANCE','SEC filing provenance is inconsistent')
  if(new URL(snapshotEvidenceUrl(snapshot)).hostname!==TSMC_SEC_ACQUISITION.archivesHostname||snapshotEvidenceUrl(snapshot)!==p.secFilingUrl) throw new IngestionError('FILING_PROVENANCE','SEC archive URL is inconsistent')
  const text=textContent(html)
  if(!/FORM 6-K/i.test(text)||!/Taiwan Semiconductor Manufacturing Company Limited/i.test(text)) throw new IngestionError('FILING_ISSUER','Filing is not a TSMC Form 6-K')
  const title=text.match(/TSMC\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d{2})\s+Revenue Report/i)
  if(!title) throw new IngestionError('NOT_MONTHLY_REVENUE','Filing is not a TSMC monthly revenue report')
  if(!/Unit\s*:\s*NT\$\s*million/i.test(text)) throw new IngestionError('UNIT_MARKER','Expected unambiguous NT$ million unit marker')
  const tables=[...html.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)].map((match)=>match[0]).filter((table)=>{const value=textContent(table);return /Net Revenue/i.test(value)&&/M-o-M/i.test(value)&&/Y-o-Y/i.test(value)&&/NT\$\s*million/i.test(value)})
  if(tables.length!==1) throw new IngestionError('TABLE_STRUCTURE','Expected one monthly revenue table, found '+tables.length)
  const rows=[...tables[0].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((match)=>[...match[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell)=>textContent(cell[1])))
  const revenueRows=rows.filter((cells)=>cells.some((cell)=>/^Net Revenue$/i.test(cell)))
  if(revenueRows.length!==1) throw new IngestionError('TABLE_STRUCTURE','Expected one Net Revenue row')
  const month=months.get(title[1].toLowerCase()), year=Number(title[2])
  if(!month) throw new IngestionError('REPORTING_MONTH','Reporting month is ambiguous')
  const monthHeader=title[1]+' '+year, priorMonthHeader=title[1]+' '+(year-1)
  const headerRows=rows.filter((row)=>row.filter((cell)=>cell===monthHeader).length===1&&row.filter((cell)=>cell===priorMonthHeader).length===1)
  if(headerRows.length!==1) throw new IngestionError('TABLE_STRUCTURE','Expected one unambiguous monthly header row')
  const headers=headerRows[0], periodIndex=headers.findIndex((cell)=>/^Period$/i.test(cell)), currentIndex=headers.indexOf(monthHeader), priorIndex=headers.indexOf(priorMonthHeader)
  if(periodIndex<0||currentIndex<=periodIndex||priorIndex<=currentIndex) throw new IngestionError('TABLE_STRUCTURE','Monthly header order is invalid')
  if(!/^Y-o-Y Increase\s*\(Decrease\)\s*%$/i.test(headers[priorIndex+1]??'')) throw new IngestionError('TABLE_STRUCTURE','Monthly YoY header is missing or ambiguous')
  const cells=revenueRows[0], labelIndex=cells.findIndex((cell)=>/^Net Revenue$/i.test(cell)), offset=labelIndex-periodIndex
  const revenueRaw=cells[currentIndex+offset], yoyRaw=cells[priorIndex+1+offset]
  if(revenueRaw===undefined||yoyRaw===undefined) throw new IngestionError('TABLE_STRUCTURE','Monthly revenue row is incomplete')
  const revenue=numeric(revenueRaw,'monthly revenue'), yoy=numeric(yoyRaw,'reported YoY')
  if(revenue<=0) throw new IngestionError('VALUE_RANGE','Monthly revenue must be positive')
  if(Math.abs(yoy)>MAX_ABSOLUTE_MONTHLY_YOY_PERCENT) throw new IngestionError('YOY_PERCENT_RANGE','Reported monthly YoY exceeds conservative sanity bound')
  const period=year+'-'+String(month).padStart(2,'0')
  const common={issuer:source.issuer,companyTicker:source.ticker,period,periodType:'MONTH',sourceId:source.id,sourceUrl:snapshotEvidenceUrl(snapshot),publishedAt:p.filingDate+'T00:00:00.000Z',retrievedAt:snapshot.retrievedAt,snapshotId:snapshot.snapshotId,sourceDocumentVersionId:p.accessionNumber}
  const locator={accessionNumber:p.accessionNumber,primaryDocument:p.primaryDocument,table:'TSMC '+title[1]+' Revenue Report (Consolidated)',row:'Net Revenue',reportedUnit:'NT$ million'}
  return [
    {...common,candidateType:'NUMERIC_METRIC',metric:'MONTHLY_REVENUE',value:revenue,unit:source.revenueUnit,sourceLocator:{...locator,column:monthHeader},originalText:revenueRaw},
    {...common,candidateType:'NUMERIC_METRIC',metric:'MONTHLY_REVENUE_YOY_PERCENT',value:yoy,unit:source.yoyUnit,sourceLocator:{...locator,column:headers[priorIndex+1]},originalText:yoyRaw},
  ]
}
async function collect({filing,outputRoot,retrievedAt,fetchImpl,secUserAgent,source,acquisitionMode,fixturePath,signal,transport}) {
  if(!metadataEligible(filing)) throw new IngestionError('FILING_METADATA','Filing metadata is not an eligible monthly revenue 6-K')
  const expected=urlFor(filing)
  if(filing.filingUrl!==expected) throw new IngestionError('FILING_METADATA','Filing URL and accession are inconsistent')
  const agent=requireUserAgent(secUserAgent??process.env.SEC_USER_AGENT)
  const response=await request(fetchImpl,expected,{headers:{'user-agent':agent,accept:'text/html,application/xhtml+xml'},redirect:'follow'},'FILING_UNAVAILABLE',signal,transport,'FILING_RESPONSE')
  const finalUrl=response.url||expected
  if(finalUrl!==expected||new URL(finalUrl).hostname!==TSMC_SEC_ACQUISITION.archivesHostname) throw new IngestionError('FILING_REDIRECT','Filing did not resolve to its immutable SEC URL')
  return persistRawSnapshot({body:Buffer.from(await response.arrayBuffer()),source,requestedUrl:expected,finalUrl,retrievedAt,status:response.status,contentType:response.headers.get('content-type')??'',outputRoot,acquisitionMode,acquisitionChannel:TSMC_SEC_ACQUISITION.acquisitionChannel,fixturePath:acquisitionMode==='FIXTURE'?fixturePath:undefined,fixtureId:acquisitionMode==='FIXTURE'?filing.accessionNumber:undefined,evidenceUrl:expected,provenance:{cik:TSMC_SEC_ACQUISITION.cik,accessionNumber:filing.accessionNumber,formType:filing.form,filingDate:filing.filingDate,primaryDocument:filing.primaryDocument,secFilingUrl:expected,issuer:'TSMC',evidenceSourceId:source.id,evidenceDocument:TSMC_SEC_ACQUISITION.evidenceType,filedWith:TSMC_SEC_ACQUISITION.filedWith,acquisitionChannel:TSMC_SEC_ACQUISITION.acquisitionChannel}})
}
export async function ingestTsmcMonthlyFromSec({outputRoot,retrievedAt=new Date().toISOString(),fetchImpl=fetch,secUserAgent,source=TSMC_MONTHLY_SOURCE,reportingYear,acquisitionMode='LIVE',fixturePath='tests/ingestion/tsmSecIngestion.test.mjs',signal,transport={}}) {
  const filings=(await discoverFromSec({fetchImpl,secUserAgent,signal,transport})).filter((filing)=>!reportingYear||filing.filingDate.startsWith(String(reportingYear)))
  const candidates=[], snapshots=[]
  for(const filing of filings) { const persisted=await collect({filing,outputRoot,retrievedAt,fetchImpl,secUserAgent,source,acquisitionMode,fixturePath,signal,transport}); const parsed=parseSecMonthlyRevenue(persisted.snapshot,persisted.body,source); validateTsmcCandidates(parsed,persisted.snapshot,{...source,hostname:TSMC_SEC_ACQUISITION.archivesHostname}); candidates.push(...parsed); snapshots.push(persisted.snapshot) }
  if(candidates.length===0) throw new IngestionError('NO_ELIGIBLE_FILINGS','SEC discovery returned no eligible monthly revenue filings')
  const keys=new Set()
  for(const candidate of candidates) { const key=[candidate.companyTicker,candidate.metric,candidate.period,candidate.unit].join('|'); if(keys.has(key)) throw new IngestionError('DUPLICATE_SEMANTIC_OBSERVATION','Multiple SEC filings contain the same semantic observation'); keys.add(key) }
  const canonicalPath=path.join(outputRoot,'observations','tsm-monthly.json')
  const promotion=await promoteCanonicalAtomically({candidates,snapshotIds:snapshots.map((snapshot)=>snapshot.snapshotId),canonicalPath,pipelineId:'tsm-monthly-sec',issuer:'TSM',sourceId:source.id,logicalFactKey,observationId:immutableObservationId,toObservation:(candidate)=>promoteCandidate(candidate).observation})
  return {filings,snapshots,candidateCount:candidates.length,canonicalPath,...promotion}
}
