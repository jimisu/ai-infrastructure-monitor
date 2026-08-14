import canonicalDocument from '../../data/ingestion/observations/goog-annual-capex-guidance.json'
import { GOOG_REPORTED_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import type { MetricObservation } from '../types/metric'
import { GOOG_CAPEX_OBSERVATIONS } from './googCapexMetrics'

export type GoogGuidanceObservationMode = 'MANUAL' | 'INGESTED'
const guidanceMetrics = new Set(['CAPEX_GUIDANCE_POINT', 'CAPEX_GUIDANCE_LOW', 'CAPEX_GUIDANCE_HIGH'])
const manualGuidance = GOOG_CAPEX_OBSERVATIONS.filter((item) => guidanceMetrics.has(item.metric)).map((item) => ({ ...item })).sort(sort)
export const GOOG_MANUAL_NON_GUIDANCE_OBSERVATIONS = GOOG_CAPEX_OBSERVATIONS.filter((item) => !guidanceMetrics.has(item.metric)).map((item) => ({ ...item }))
const fail = (message: string): never => { throw new Error(`Invalid canonical GOOG annual CapEx guidance: ${message}`) }
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
function sort(a: MetricObservation, b: MetricObservation) { return (a.guidanceAsOfPeriod ?? '').localeCompare(b.guidanceAsOfPeriod ?? '') || a.metric.localeCompare(b.metric) }
const semantic = (item: MetricObservation) => [item.companyTicker, item.metric, item.periodType, item.period, item.guidanceAsOfPeriod, item.metric === 'CAPEX_GUIDANCE_POINT' ? 'APPROXIMATE_POINT' : 'RANGE', item.unit, item.sourceId, item.capexDefinitionId].join('|')

export function parseCanonicalGoogGuidanceObservations(document: unknown): MetricObservation[] {
  if (!object(document)) return fail('document is missing')
  if (document.schemaVersion !== 2 || document.pipelineId !== 'goog-annual-capex-guidance' || document.issuer !== 'GOOG' || document.sourceId !== 'goog-annual-capex-guidance-official' || document.capexDefinitionId !== GOOG_REPORTED_CAPEX_DEFINITION.id || !Array.isArray(document.latestSnapshotIds) || !Array.isArray(document.records)) fail('document envelope is invalid')
  const records = document.records as unknown[]
  const active = records.filter((record): record is Record<string, unknown> => object(record) && record.status === 'ACTIVE')
  if (active.length !== 7) fail('complete five-disclosure guidance history is required')
  const observations: MetricObservation[] = [], ids = new Set<string>(), keys = new Set<string>()
  for (const record of active) {
    if (!object(record.observation) || typeof record.recordId !== 'string' || typeof record.sourceDocumentVersionId !== 'string' || typeof record.snapshotId !== 'string' || !object(record.sourceLocator)) fail('promotion provenance is incomplete')
    const item = record.observation as unknown as MetricObservation
    if (item.companyTicker !== 'GOOG' || !guidanceMetrics.has(item.metric) || item.periodType !== 'YEAR' || !['2025', '2026'].includes(item.period) || !/^202[45]-Q[1-4]$/.test(item.guidanceAsOfPeriod ?? '') || item.unit !== 'USD billions' || item.capexDefinitionId !== GOOG_REPORTED_CAPEX_DEFINITION.id || typeof item.value !== 'number' || !Number.isFinite(item.value) || typeof item.sourceUrl !== 'string' || !['www.sec.gov', 'abc.xyz'].includes(new URL(item.sourceUrl).hostname)) fail('observation contract mismatch')
    const key = semantic(item); if (record.logicalFactKey !== key || ids.has(item.id) || keys.has(key)) fail('duplicate or inconsistent canonical identity')
    if (item.metric === 'CAPEX_GUIDANCE_POINT' && item.approximate !== true) fail('approximate-point semantics lost')
    ids.add(item.id); keys.add(key); observations.push({ ...item })
  }
  const grouped = new Map<string, MetricObservation[]>(); for (const item of observations) grouped.set(item.guidanceAsOfPeriod!, [...(grouped.get(item.guidanceAsOfPeriod!) ?? []), item])
  if (grouped.size !== 5) fail('guidance history periods are incomplete')
  for (const [period, group] of grouped) { if (['2024-Q4', '2025-Q1', '2025-Q2'].includes(period)) { if (group.length !== 1 || group[0].metric !== 'CAPEX_GUIDANCE_POINT' || !group[0].approximate) fail('approximate point atomicity failed') } else { const low = group.find((x) => x.metric === 'CAPEX_GUIDANCE_LOW'), high = group.find((x) => x.metric === 'CAPEX_GUIDANCE_HIGH'); if (group.length !== 2 || !low || !high || low.value > high.value || low.sourceId !== high.sourceId) fail('range atomicity failed') } }
  return observations.sort(sort)
}

export function getGoogCapexGuidanceObservations(mode: GoogGuidanceObservationMode): MetricObservation[] {
  if (mode === 'MANUAL') return manualGuidance.map((item) => ({ ...item }))
  if (mode === 'INGESTED') return parseCanonicalGoogGuidanceObservations(canonicalDocument)
  return fail('unsupported provider mode')
}

export function composeGoogCapexObservations(mode: GoogGuidanceObservationMode): MetricObservation[] {
  const result = [...getGoogCapexGuidanceObservations(mode), ...GOOG_MANUAL_NON_GUIDANCE_OBSERVATIONS], seen = new Set<string>()
  for (const item of result) { const key = item.metric === 'CAPEX_ACTUAL' ? [item.companyTicker, item.metric, item.periodType, item.period, item.unit, item.capexDefinitionId].join('|') : semantic(item); if (seen.has(key)) fail('manual and ingested guidance were combined'); seen.add(key) }
  return result
}

export const GOOG_PRODUCTION_CAPEX_OBSERVATIONS = composeGoogCapexObservations('INGESTED')
