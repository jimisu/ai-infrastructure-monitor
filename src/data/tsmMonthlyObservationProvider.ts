import canonicalDocument from '../../data/ingestion/observations/tsm-monthly.json'
import { TSM_METRIC_OBSERVATIONS } from './tsmMetrics'
import type { MetricName, MetricObservation } from '../types/metric'

export type TsmMonthlyObservationMode = 'MANUAL' | 'INGESTED'

interface CanonicalRecord {
  logicalFactKey: string
  snapshotId: string
  sourceLocator: Record<string, unknown>
  status: 'ACTIVE' | 'SUPERSEDED'
  observation: unknown
}

interface CanonicalDocument {
  schemaVersion: number
  issuer: string
  sourceId: string
  pipelineId?: string
  latestSnapshotIds?: string[]
  records: CanonicalRecord[]
}

const MONTHLY_METRICS: MetricName[] = ['MONTHLY_REVENUE', 'MONTHLY_REVENUE_YOY_PERCENT']
const isMonthlyMetric = (metric: MetricName) => MONTHLY_METRICS.includes(metric)
const semanticKey = (observation: MetricObservation) => [
  observation.companyTicker,
  observation.metric,
  observation.periodType,
  observation.period,
  observation.unit,
  observation.sourceId,
].join('|')
const manualMonthly = TSM_METRIC_OBSERVATIONS.filter((observation) => isMonthlyMetric(observation.metric))
const manualBySemanticKey = new Map(manualMonthly.map((observation) => [semanticKey(observation), observation]))

function fail(message: string): never {
  throw new Error(`Invalid canonical TSMC monthly observations: ${message}`)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateObservation(value: unknown): MetricObservation {
  if (!isRecord(value)) fail('observation is not an object')
  const observation = value as unknown as MetricObservation
  if (typeof observation.id !== 'string' || observation.id.length === 0) fail('observation ID is missing')
  if (observation.companyTicker !== 'TSM') fail('ticker is not TSM')
  if (!MONTHLY_METRICS.includes(observation.metric)) fail('unexpected metric')
  if (observation.metric === 'MONTHLY_REVENUE' && observation.value <= 0) fail('monthly revenue must be positive')
  // Conservative bound: permits extreme real growth but rejects obvious shifted revenue/YTD values.
  if (observation.metric === 'MONTHLY_REVENUE_YOY_PERCENT' && Math.abs(observation.value) > 1000) fail('monthly YoY exceeds sanity bound')
  if (observation.periodType !== 'MONTH' || !/^20\d{2}-(0[1-9]|1[0-2])$/.test(observation.period)) fail('invalid monthly period')
  if (typeof observation.value !== 'number' || !Number.isFinite(observation.value)) fail('invalid numeric value')
  const expectedUnit = observation.metric === 'MONTHLY_REVENUE' ? 'NT$ millions' : 'percent'
  if (observation.unit !== expectedUnit) fail('unit does not match metric')
  if (observation.sourceId !== 'tsmc-monthly-revenue') fail('source semantics changed')
  if (typeof observation.sourceUrl !== 'string' || observation.sourceUrl.length === 0) fail('source URL is missing')
  try {
    const hostname = new URL(observation.sourceUrl).hostname
    if (!['investor.tsmc.com', 'www.sec.gov'].includes(hostname)) fail('source URL is not an approved official host')
  } catch {
    fail('source URL is invalid')
  }
  if (Number.isNaN(Date.parse(observation.publishedAt)) || Number.isNaN(Date.parse(observation.retrievedAt))) fail('timestamps are invalid')
  return { ...observation }
}

export function parseCanonicalTsmMonthlyObservations(document: unknown): MetricObservation[] {
  if (!isRecord(document)) fail('document is missing')
  const canonical = document as unknown as CanonicalDocument
  if (![1, 2].includes(canonical.schemaVersion) || canonical.issuer !== 'TSM' || canonical.sourceId !== 'tsmc-monthly-revenue' || !Array.isArray(canonical.records)) fail('document envelope is invalid')
  const active = canonical.records.filter((record) => record?.status === 'ACTIVE')
  if (active.length === 0) fail('no active promoted observations')
  const observations: MetricObservation[] = []
  const keys = new Set<string>()
  const ids = new Set<string>()
  for (const record of active) {
    if (typeof record.snapshotId !== 'string' || record.snapshotId.length === 0 || !isRecord(record.sourceLocator)) fail('promotion provenance is incomplete')
    const observation = validateObservation(record.observation)
    const key = semanticKey(observation)
    if (record.logicalFactKey !== key) fail('logical fact key is inconsistent')
    if (keys.has(key)) fail('duplicate semantic observation')
    if (ids.has(observation.id)) fail('duplicate observation ID')
    keys.add(key)
    ids.add(observation.id)
    const legacy = manualBySemanticKey.get(key)
    observations.push(legacy && legacy.value === observation.value ? { ...observation, id: legacy.id } : observation)
  }
  const periods = new Map<string, Set<MetricName>>()
  for (const observation of observations) {
    const metrics = periods.get(observation.period) ?? new Set<MetricName>()
    metrics.add(observation.metric)
    periods.set(observation.period, metrics)
  }
  for (const [period, metrics] of periods) if (metrics.size !== MONTHLY_METRICS.length) fail(`incomplete metric pair for ${period}`)
  return observations.sort((a, b) => a.period.localeCompare(b.period) || a.metric.localeCompare(b.metric))
}

export function getTsmMonthlyObservations(mode: TsmMonthlyObservationMode): MetricObservation[] {
  if (mode === 'MANUAL') return manualMonthly.map((observation) => ({ ...observation }))
  if (mode === 'INGESTED') return parseCanonicalTsmMonthlyObservations(canonicalDocument)
  return fail('unsupported provider mode')
}

export const TSM_MANUAL_NON_MONTHLY_OBSERVATIONS = TSM_METRIC_OBSERVATIONS
  .filter((observation) => !isMonthlyMetric(observation.metric))
  .map((observation) => ({ ...observation }))

export function composeTsmSignalObservations(mode: TsmMonthlyObservationMode): MetricObservation[] {
  const monthly = getTsmMonthlyObservations(mode)
  const result = [...TSM_MANUAL_NON_MONTHLY_OBSERVATIONS, ...monthly]
  const keys = new Set<string>()
  for (const observation of result) {
    const key = [observation.companyTicker, observation.metric, observation.periodType, observation.period, observation.unit].join('|')
    if (keys.has(key)) fail('composition contains duplicate facts')
    keys.add(key)
  }
  return result
}

export const TSM_PRODUCTION_OBSERVATIONS = composeTsmSignalObservations('INGESTED')
