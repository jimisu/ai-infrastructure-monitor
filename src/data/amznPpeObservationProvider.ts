import canonicalDocument from '../../data/ingestion/observations/amzn-ppe-purchases.json'
import { AMZN_PP_AND_E_PURCHASES_DEFINITION } from '../config/capexDefinitionRegistry'
import type { MetricObservation } from '../types/metric'
import { AMZN_CAPEX_OBSERVATIONS } from './amznCapexMetrics'

export type AmznPpeObservationMode = 'MANUAL' | 'INGESTED'
const definitionId = AMZN_PP_AND_E_PURCHASES_DEFINITION.id
const manualPpe = AMZN_CAPEX_OBSERVATIONS.filter((observation) => observation.capexDefinitionId === definitionId)
const manualByPeriod = new Map(manualPpe.map((observation) => [observation.period, observation]))
const fail = (message: string): never => { throw new Error(`Invalid canonical Amazon PP&E observations: ${message}`) }
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const key = (observation: MetricObservation) => [observation.companyTicker, observation.metric, observation.periodType, observation.period, observation.unit, observation.sourceId, observation.capexDefinitionId].join('|')

const ttmPeriod = (period: string) => { const match = /^TTM-(20\d{2})-Q([1-4])$/.exec(period); return match ? { year: Number(match[1]), quarter: Number(match[2]) } : null }
export function parseCanonicalAmznPpeObservations(document: unknown): MetricObservation[] {
  if (!isObject(document)) return fail('document is missing')
  const canonical = document as Record<string, unknown>
  if (![1, 2].includes(canonical.schemaVersion as number) || canonical.issuer !== 'AMZN' || canonical.sourceId !== 'amzn-2026-q1-results' || canonical.capexDefinitionId !== definitionId || !Array.isArray(canonical.records)) fail('document envelope is invalid')
  const records = canonical.records
  if (!Array.isArray(records)) return fail('records are missing')
  const active = records.filter((record: unknown) => isObject(record) && record.status === 'ACTIVE')
  if (active.length < 2) fail('at least two active TTM observations are required')
  const observations: MetricObservation[] = []
  const keys = new Set<string>(), ids = new Set<string>(), periods = new Set<string>()
  for (const raw of active) {
    if (!isObject(raw) || !isObject(raw.observation) || typeof raw.snapshotId !== 'string' || !isObject(raw.sourceLocator)) fail('promotion record is malformed')
    const observation = raw.observation as unknown as MetricObservation
    if (typeof observation.id !== 'string' || observation.companyTicker !== 'AMZN' || observation.metric !== 'CAPEX_ACTUAL' || observation.periodType !== 'POINT_IN_TIME' || !ttmPeriod(observation.period) || observation.unit !== 'USD billions' || observation.capexDefinitionId !== definitionId || observation.sourceId !== 'amzn-2026-q1-results' || typeof observation.value !== 'number' || !Number.isFinite(observation.value) || observation.value <= 0) fail('observation contract mismatch')
    if (typeof observation.sourceUrl !== 'string' || new URL(observation.sourceUrl).hostname !== 'www.sec.gov') fail('observation is not backed by SEC Archives')
    if (raw.logicalFactKey !== key(observation)) fail('logical fact key is inconsistent')
    if (keys.has(raw.logicalFactKey)) fail('duplicate logical fact')
    if (periods.has(observation.period)) fail('duplicate active TTM period')
    if (ids.has(observation.id)) fail('duplicate observation ID')
    keys.add(raw.logicalFactKey); periods.add(observation.period); ids.add(observation.id)
    const legacy = manualByPeriod.get(observation.period)
    observations.push(legacy && legacy.value === observation.value ? { ...observation, id: legacy.id } : { ...observation })
  }
  observations.sort((a, b) => { const left=ttmPeriod(a.period)!,right=ttmPeriod(b.period)!;return left.year-right.year||left.quarter-right.quarter })
  const latest=observations.at(-1)!,latestPeriod=ttmPeriod(latest.period)!,requiredPrior=`TTM-${latestPeriod.year-1}-Q${latestPeriod.quarter}`
  if (!periods.has(requiredPrior)) fail(`latest TTM period ${latest.period} is missing required comparator ${requiredPrior}`)
  return observations
}

export function getAmznPpeObservations(mode: AmznPpeObservationMode): MetricObservation[] {
  if (mode === 'MANUAL') return manualPpe.map((observation) => ({ ...observation }))
  if (mode === 'INGESTED') return parseCanonicalAmznPpeObservations(canonicalDocument)
  return fail('unsupported provider mode')
}

export const AMZN_MANUAL_NON_PPE_OBSERVATIONS = AMZN_CAPEX_OBSERVATIONS.filter((observation) => observation.capexDefinitionId !== definitionId).map((observation) => ({ ...observation }))
export function composeAmznCapexObservations(mode: AmznPpeObservationMode): MetricObservation[] {
  const selected = getAmznPpeObservations(mode)
  const result = [...AMZN_MANUAL_NON_PPE_OBSERVATIONS, ...selected]
  const keys = new Set<string>()
  for (const observation of result) { const semantic = key(observation); if (keys.has(semantic)) fail('manual and ingested series were combined'); keys.add(semantic) }
  return result
}
export const AMZN_PRODUCTION_CAPEX_OBSERVATIONS = composeAmznCapexObservations('INGESTED')
