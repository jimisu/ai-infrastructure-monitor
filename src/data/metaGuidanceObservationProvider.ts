import canonicalDocument from '../../data/ingestion/observations/meta-annual-capex-guidance.json'
import { META_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import type { MetricObservation } from '../types/metric'
import { META_CAPEX_OBSERVATIONS } from './metaCapexMetrics'

export type MetaGuidanceObservationMode = 'MANUAL' | 'INGESTED'
const guidanceMetrics = new Set(['CAPEX_GUIDANCE_LOW', 'CAPEX_GUIDANCE_HIGH'])
const manualGuidance = META_CAPEX_OBSERVATIONS.filter((item) => guidanceMetrics.has(item.metric)).map((item) => ({ ...item, capexDefinitionId: META_CAPEX_DEFINITION.id })).sort((a, b) => a.guidanceAsOfPeriod!.localeCompare(b.guidanceAsOfPeriod!) || a.metric.localeCompare(b.metric))
export const META_MANUAL_QUARTERLY_ACTUAL_OBSERVATIONS = META_CAPEX_OBSERVATIONS.filter((item) => item.metric === 'CAPEX_ACTUAL').map((item) => ({ ...item }))
const fail = (message: string): never => { throw new Error(`Invalid canonical META annual CapEx guidance: ${message}`) }
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const key = (item: MetricObservation) => [item.companyTicker, item.metric, item.periodType, item.period, item.guidanceAsOfPeriod, 'RANGE', item.unit, item.sourceId, item.capexDefinitionId].join('|')
const fact = (item: MetricObservation) => [item.companyTicker, item.metric, item.period, item.periodType, item.guidanceAsOfPeriod, item.value, item.unit, item.sourceId, item.capexDefinitionId].join('|')

export function parseCanonicalMetaGuidanceObservations(document: unknown): MetricObservation[] {
  if (!object(document)) return fail('document is missing')
  if (document.schemaVersion !== 2 || document.pipelineId !== 'meta-annual-capex-guidance' || document.issuer !== 'META' || document.sourceId !== 'meta-annual-capex-guidance-sec' || document.capexDefinitionId !== META_CAPEX_DEFINITION.id || !Array.isArray(document.latestSnapshotIds) || !Array.isArray(document.records)) fail('document envelope is invalid')
  const records = document.records as unknown[]
  const active = records.filter((record): record is Record<string, unknown> => object(record) && record.status === 'ACTIVE')
  if (active.length !== 6) fail('three complete guidance ranges are required')
  const observations: MetricObservation[] = [], ids = new Set<string>(), keys = new Set<string>()
  for (const record of active) {
    if (!object(record) || !object(record.observation) || typeof record.recordId !== 'string' || typeof record.sourceDocumentVersionId !== 'string' || typeof record.snapshotId !== 'string' || !object(record.sourceLocator)) fail('promotion provenance is incomplete')
    const item = record.observation as unknown as MetricObservation
    if (item.companyTicker !== 'META' || !guidanceMetrics.has(item.metric) || item.period !== '2026' || item.periodType !== 'YEAR' || !/^202[56]-Q[1-4]$/.test(item.guidanceAsOfPeriod ?? '') || item.unit !== 'USD billions' || item.capexDefinitionId !== META_CAPEX_DEFINITION.id || typeof item.value !== 'number' || !Number.isFinite(item.value)) fail('observation contract mismatch')
    if (typeof item.sourceUrl !== 'string' || new URL(item.sourceUrl).hostname !== 'www.sec.gov') fail('observation is not backed by SEC Archives')
    const semantic = key(item)
    if (record.logicalFactKey !== semantic || keys.has(semantic) || ids.has(item.id)) fail('duplicate or inconsistent canonical identity')
    keys.add(semantic); ids.add(item.id); observations.push({ ...item })
  }
  const ranges = new Map<string, MetricObservation[]>()
  for (const item of observations) ranges.set(item.guidanceAsOfPeriod!, [...(ranges.get(item.guidanceAsOfPeriod!) ?? []), item])
  if (ranges.size !== 3) fail('guidance history periods are incomplete')
  for (const pair of ranges.values()) { const low = pair.find((item) => item.metric === 'CAPEX_GUIDANCE_LOW'), high = pair.find((item) => item.metric === 'CAPEX_GUIDANCE_HIGH'); if (pair.length !== 2 || !low || !high || low.value > high.value || low.sourceId !== high.sourceId) fail('range atomicity failed') }
  return observations.sort((a, b) => a.guidanceAsOfPeriod!.localeCompare(b.guidanceAsOfPeriod!) || a.metric.localeCompare(b.metric))
}

export function getMetaAnnualGuidanceObservations(mode: MetaGuidanceObservationMode): MetricObservation[] {
  if (mode === 'MANUAL') return manualGuidance.map((item) => ({ ...item }))
  if (mode === 'INGESTED') return parseCanonicalMetaGuidanceObservations(canonicalDocument)
  return fail('unsupported provider mode')
}

export function composeMetaCapexObservations(mode: MetaGuidanceObservationMode): MetricObservation[] {
  const guidance = getMetaAnnualGuidanceObservations(mode), result = [...guidance, ...META_MANUAL_QUARTERLY_ACTUAL_OBSERVATIONS]
  const facts = new Set<string>()
  for (const item of result) { const semantic = item.metric === 'CAPEX_ACTUAL' ? [item.companyTicker, item.metric, item.periodType, item.period, item.unit, item.sourceId].join('|') : fact(item); if (facts.has(semantic)) fail('manual and ingested guidance were combined'); facts.add(semantic) }
  return result
}

export const META_PRODUCTION_CAPEX_OBSERVATIONS = composeMetaCapexObservations('INGESTED')
