import canonical from '../../data/ingestion/observations/amzn-ppe-purchases.json'
import { AMZN_PP_AND_E_PURCHASES_DEFINITION } from '../config/capexDefinitionRegistry'
import { AMZN_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { composeAmznCapexObservations, getAmznPpeObservations, parseCanonicalAmznPpeObservations, AMZN_MANUAL_NON_PPE_OBSERVATIONS, AMZN_PRODUCTION_CAPEX_OBSERVATIONS } from '../data/amznPpeObservationProvider'
import { TSM_PRODUCTION_OBSERVATIONS } from '../data/tsmMonthlyObservationProvider'
import { normalizeCapexObservations, deriveCompanyCapexTtmYoYActualTrends } from '../signals/companyCapexSignalEngine'
import { deriveCurrentHyperscalerCapexTrend } from '../signals/hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from '../signals/hyperscalerTsmConfirmationEngine'
import { verifyGoogCapexSignals } from '../signals/googCapexSignalVerification'
import type { MetricObservation } from '../types/metric'

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Amazon PP&E ingestion verification failed: ${message}`)
}

const fact = (item: MetricObservation) => ({
  companyTicker: item.companyTicker,
  metric: item.metric,
  period: item.period,
  periodType: item.periodType,
  value: item.value,
  unit: item.unit,
  sourceId: item.sourceId,
  capexDefinitionId: item.capexDefinitionId,
})

function derive(observations: MetricObservation[]) {
  return deriveCompanyCapexTtmYoYActualTrends(
    normalizeCapexObservations(observations, AMZN_CAPEX_PROFILE, [AMZN_PP_AND_E_PURCHASES_DEFINITION]),
    AMZN_CAPEX_PROFILE,
    AMZN_PP_AND_E_PURCHASES_DEFINITION.id,
    () => '2026-08-14T00:00:00.000Z'
  )
}

type AmznSignals = ReturnType<typeof derive>

function rollingDocument() {
  const document = structuredClone(canonical)
  const baselinePeriods = new Set(getAmznPpeObservations('MANUAL').map((item) => item.period))
  document.records = document.records.filter((record) => baselinePeriods.has(record.observation.period))
  const template = document.records[0]
  for (const [period, value] of [['TTM-2025-Q2', 107.656], ['TTM-2026-Q2', 173.028]] as const) {
    const record = structuredClone(template)
    record.recordId = 'rolling-record-' + period
    record.logicalFactKey = ['AMZN', 'CAPEX_ACTUAL', 'POINT_IN_TIME', period, 'USD billions', 'amzn-2026-q1-results', AMZN_PP_AND_E_PURCHASES_DEFINITION.id].join('|')
    record.snapshotId = 'rolling-snapshot-q2'
    record.observation = {
      ...record.observation,
      id: 'rolling-observation-' + period,
      period,
      value,
      publishedAt: '2026-07-31T00:00:00.000Z',
      retrievedAt: '2026-08-15T00:00:00.000Z',
      sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1018724/000101872426000026/amzn-20260630.htm',
    }
    document.records.push(record)
  }
  return document
}

function rejects(document: unknown) {
  try {
    parseCanonicalAmznPpeObservations(document)
    return false
  } catch {
    return true
  }
}

function assertManualOverlap(manual: MetricObservation[], ingested: MetricObservation[]) {
  assert(manual.length === 2 && ingested.length >= manual.length, 'manual overlap floor changed')
  const ingestedFacts = new Map(ingested.map((observation) => [JSON.stringify(fact(observation)), observation]))
  assert(manual.every((observation) => ingestedFacts.has(JSON.stringify(fact(observation)))), 'golden overlap factual parity failed')
  assert(manual.every((observation) => ingestedFacts.get(JSON.stringify(fact(observation)))?.id === observation.id), 'legacy observation ID compatibility changed')
}

function assertPpeComposition(ingestedInput: MetricObservation[], ingested: MetricObservation[]) {
  assert(JSON.stringify(AMZN_PRODUCTION_CAPEX_OBSERVATIONS) === JSON.stringify(ingestedInput), 'production composition changed')
  assert(ingestedInput.length === AMZN_MANUAL_NON_PPE_OBSERVATIONS.length + ingested.length, 'manual and ingested PP&E were accidentally merged')
  const primaryKeys = ingestedInput
    .filter((item) => item.capexDefinitionId === AMZN_PP_AND_E_PURCHASES_DEFINITION.id)
    .map((item) => `${item.period}|${item.metric}`)
  assert(primaryKeys.length === new Set(primaryKeys).size && primaryKeys.length === ingested.length, 'manual and ingested PP&E were merged')
}

function assertCanonicalFailClosed() {
  let missingRejected = false
  let invalidRejected = false
  try { parseCanonicalAmznPpeObservations(null) } catch { missingRejected = true }
  try {
    const invalid = structuredClone(canonical)
    invalid.records.push(structuredClone(invalid.records[0]))
    parseCanonicalAmznPpeObservations(invalid)
  } catch { invalidRejected = true }
  assert(missingRejected && invalidRejected, 'invalid canonical data did not fail closed')
  return { missingRejected, invalidRejected }
}

function assertLatestSameQuarterTtm(ingested: MetricObservation[], ingestedSignals: AmznSignals) {
  const latestSignal = ingestedSignals.at(-1)!
  const latestObservation = ingested.at(-1)!
  const latestMatch = /^TTM-(20\d{2})-Q([1-4])$/.exec(latestObservation.period)
  assert(latestMatch !== null && latestSignal.period === latestObservation.period, 'latest complete TTM pair was not selected')
  const priorPeriod = `TTM-${Number(latestMatch[1]) - 1}-Q${latestMatch[2]}`
  const priorObservation = ingested.find((item) => item.period === priorPeriod)
  assert(priorObservation !== undefined, 'latest TTM comparator is missing')
  assert(latestSignal.priorYearValue === priorObservation.value && latestSignal.currentValue === latestObservation.value, 'latest TTM comparator changed')
  const expectedYoY = ((latestObservation.value - priorObservation.value) / priorObservation.value) * 100
  assert(Math.abs(latestSignal.yoyPercent - expectedYoY) < 1e-12, 'latest TTM YoY calculation changed')
  return latestSignal
}

function assertRollingTtmSelection() {
  const rolling = rollingDocument()
  const rollingPpe = parseCanonicalAmznPpeObservations(rolling)
  const rollingInput = [...AMZN_MANUAL_NON_PPE_OBSERVATIONS, ...rollingPpe]
  const rollingSignals = derive(rollingInput)
  const latestRolling = rollingSignals.at(-1)!
  assert(rollingPpe.length === 4 && rollingPpe.some((item) => item.period === 'TTM-2025-Q1') && rollingPpe.some((item) => item.period === 'TTM-2026-Q1'), 'historical Q1 pair was not retained')
  assert(rollingSignals.length === 2 && latestRolling.period === 'TTM-2026-Q2' && latestRolling.priorYearValue === 107.656 && latestRolling.currentValue === 173.028, 'latest Q2 TTM pair was not selected')
  const expectedQ2 = ((173.028 - 107.656) / 107.656) * 100
  assert(Math.abs(latestRolling.yoyPercent - expectedQ2) < 1e-12 && latestRolling.spendingDirection === 'POSITIVE', 'Q2 TTM YoY calculation changed')
  const missingPrior = structuredClone(rolling)
  missingPrior.records = missingPrior.records.filter((record) => record.observation.period !== 'TTM-2025-Q2')
  const duplicate = structuredClone(rolling)
  duplicate.records.push(structuredClone(duplicate.records.at(-1)!))
  const crossQuarter = structuredClone(rolling)
  crossQuarter.records = crossQuarter.records.filter((record) => record.observation.period !== 'TTM-2025-Q2')
  const mixedDefinition = structuredClone(rolling)
  mixedDefinition.records.at(-1)!.observation.capexDefinitionId = 'incompatible-definition'
  const mixedUnit = structuredClone(rolling)
  mixedUnit.records.at(-1)!.observation.unit = 'USD millions'
  const malformed = structuredClone(rolling)
  malformed.records.at(-1)!.observation.value = Number.NaN
  const malformedPeriod = structuredClone(rolling)
  malformedPeriod.records.at(-1)!.observation.period = 'TTM-2026-Q5'
  assert([missingPrior, duplicate, crossQuarter, mixedDefinition, mixedUnit, malformed, malformedPeriod].every(rejects), 'rolling TTM fail-closed contract regressed')
  return latestRolling
}

function assertIssuerRegressions() {
  const aggregate = deriveCurrentHyperscalerCapexTrend(() => '2026-08-14T00:00:00.000Z')
  assert(aggregate !== null && aggregate.eligibleCount === 4 && aggregate.positiveCount === 4 && aggregate.coverage === 100 && aggregate.positiveBreadth === 100 && aggregate.direction === 'POSITIVE' && aggregate.confidence === 'HIGH', 'hyperscaler regression failed')
  const cross = deriveHyperscalerTsmConfirmation(aggregate, TSM_PRODUCTION_OBSERVATIONS, () => '2026-08-14T00:00:00.000Z')
  assert(cross !== null && cross.direction === 'POSITIVE' && cross.alignment === 'CONFIRMED' && cross.confidence === 'HIGH', 'cross-confirmation regression failed')
  const regressions = verifyGoogCapexSignals()
  assert(regressions.metaParity && regressions.msftParity && regressions.crossCompanyUnchanged, 'META/MSFT/GOOG regressions failed')
  return { aggregate, cross }
}

export function verifyAmznPpeIngestionParity() {
  const manual = getAmznPpeObservations('MANUAL')
  const ingested = getAmznPpeObservations('INGESTED')
  assertManualOverlap(manual, ingested)

  const ingestedInput = composeAmznCapexObservations('INGESTED')
  assertPpeComposition(ingestedInput, ingested)

  const { missingRejected, invalidRejected } = assertCanonicalFailClosed()

  const ingestedSignals = derive(ingestedInput)
  const repeatedSignals = derive(ingestedInput)
  assert(ingestedSignals.length >= 1 && JSON.stringify(ingestedSignals) === JSON.stringify(repeatedSignals), 'Amazon signal derivation is unavailable or nondeterministic')
  const latestSignal = assertLatestSameQuarterTtm(ingested, ingestedSignals)
  const latestRolling = assertRollingTtmSelection()
  const { aggregate, cross } = assertIssuerRegressions()

  return {
    factualParityCount: manual.length,
    ingestedObservationCount: ingested.length,
    latestTtmPrior: latestSignal.priorYearValue,
    latestTtmCurrent: latestSignal.currentValue,
    latestTtmYoYPercent: latestSignal.yoyPercent,
    latestTtmPeriod: latestSignal.period,
    q2TtmPrior: latestRolling.priorYearValue,
    q2TtmCurrent: latestRolling.currentValue,
    q2TtmYoYPercent: latestRolling.yoyPercent,
    q2Period: latestRolling.period,
    amznDirection: latestSignal.spendingDirection,
    deterministicIdStable: ingestedSignals.every((signal, index) => signal.id === repeatedSignals[index]?.id),
    providerMode: 'INGESTED',
    noDoubleCounting: true,
    missingCanonicalRejected: missingRejected,
    invalidCanonicalRejected: invalidRejected,
    hyperscaler: { eligible: aggregate.eligibleCount, positive: aggregate.positiveCount, coverage: aggregate.coverage, breadth: aggregate.positiveBreadth, direction: aggregate.direction, confidence: aggregate.confidence },
    cross: { direction: cross.direction, alignment: cross.alignment, confidence: cross.confidence },
    regressionsPassed: true,
  }
}
