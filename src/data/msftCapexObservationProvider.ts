import canonicalDocument from '../../data/ingestion/observations/msft-management-total-capex.json'
import { MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import type { MetricObservation } from '../types/metric'
import { MSFT_CAPEX_OBSERVATIONS } from './msftCapexMetrics'

export type MsftCapexObservationMode = 'MANUAL' | 'INGESTED'
const definition = MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id
const isManagementActual = (x: MetricObservation) => x.metric === 'CAPEX_ACTUAL' && x.capexDefinitionId === definition
const manual = MSFT_CAPEX_OBSERVATIONS.filter(isManagementActual).map((x) => ({...x})).sort((a,b)=>a.period.localeCompare(b.period))
export const MSFT_MANUAL_OTHER_CAPEX_OBSERVATIONS = MSFT_CAPEX_OBSERVATIONS.filter((x) => !isManagementActual(x)).map((x) => ({...x}))
const fail = (message: string): never => { throw new Error(`Invalid canonical MSFT management-total CapEx: ${message}`) }
const object = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const key = (x: MetricObservation) => [x.companyTicker,x.metric,x.periodType,x.period,x.unit,x.sourceId,x.capexDefinitionId].join('|')

export function parseCanonicalMsftManagementCapex(document: unknown): MetricObservation[] {
  if (!object(document)) return fail('document is missing')
  if (document.schemaVersion !== 2 || document.pipelineId !== 'msft-management-total-capex' || document.issuer !== 'MSFT' || document.sourceId !== 'msft-management-total-capex-official' || document.capexDefinitionId !== definition || document.fiscalCalendar !== 'MICROSOFT_FISCAL_YEAR_END_JUNE_30' || document.financeLeaseTreatment !== 'INCLUDED' || !Array.isArray(document.records) || !Array.isArray(document.latestSnapshotIds)) fail('document envelope is invalid')
  const records = document.records as unknown[], active = records.filter((x): x is Record<string,unknown> => object(x) && x.status === 'ACTIVE')
  if (active.length !== 7) fail('seven issuer-fiscal comparison quarters are required')
  const result: MetricObservation[] = [], ids = new Set<string>(), keys = new Set<string>()
  for (const record of active) { if (!object(record.observation) || typeof record.recordId !== 'string' || typeof record.snapshotId !== 'string' || typeof record.sourceDocumentVersionId !== 'string' || !object(record.sourceLocator)) fail('promotion provenance is incomplete'); const x=record.observation as unknown as MetricObservation; if (x.companyTicker!=='MSFT'||x.metric!=='CAPEX_ACTUAL'||x.periodType!=='QUARTER'||!/^MSFT-FY202[56]-Q[1-4]$/.test(x.period)||x.capexDefinitionId!==definition||x.unit!=='USD billions'||typeof x.value!=='number'||!Number.isFinite(x.value)||typeof x.sourceUrl!=='string'||new URL(x.sourceUrl).hostname!=='www.microsoft.com') fail('observation contract mismatch'); const semantic=key(x); if (record.logicalFactKey!==semantic||ids.has(x.id)||keys.has(semantic)) fail('duplicate or inconsistent canonical identity'); ids.add(x.id); keys.add(semantic); result.push({...x}) }
  const required=['MSFT-FY2025-Q1','MSFT-FY2025-Q2','MSFT-FY2025-Q3','MSFT-FY2025-Q4','MSFT-FY2026-Q1','MSFT-FY2026-Q2','MSFT-FY2026-Q3']; if (!required.every((p)=>result.some((x)=>x.period===p))) fail('issuer-fiscal history is incomplete')
  return result.sort((a,b)=>a.period.localeCompare(b.period))
}

export function getMsftManagementTotalCapexObservations(mode: MsftCapexObservationMode): MetricObservation[] { if(mode==='MANUAL') return manual.map((x)=>({...x})); if(mode==='INGESTED') return parseCanonicalMsftManagementCapex(canonicalDocument); return fail('unsupported provider mode') }
export function composeMsftCapexObservations(mode: MsftCapexObservationMode): MetricObservation[] { const result=[...getMsftManagementTotalCapexObservations(mode),...MSFT_MANUAL_OTHER_CAPEX_OBSERVATIONS], seen=new Set<string>(); for(const x of result){const semantic=key(x);if(seen.has(semantic)) fail('manual and ingested management-total observations were combined');seen.add(semantic)} return result }
export const MSFT_PRODUCTION_CAPEX_OBSERVATIONS = composeMsftCapexObservations('INGESTED')
