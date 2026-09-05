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

export function verifyAmznPpeIngestionParity() {
  const manual = getAmznPpeObservations('MANUAL')
  const ingested = getAmznPpeObservations('INGESTED')
  assert(manual.length === 2 && ingested.length >= manual.length, 'manual overlap floor changed')
  const ingestedFacts = new Map(ingested.map((observation) => [JSON.stringify(fact(observation)), observation]))
  assert(manual.every((observation) => ingestedFacts.has(JSON.stringify(fact(observation)))), 'golden overlap factual parity failed')
  assert(manual.every((observation) => ingestedFacts.get(JSON.stringify(fact(observation)))?.id === observation.id), 'legacy observation ID compatibility changed')

  const ingestedInput = composeAmznCapexObservations('INGESTED')
  assert(JSON.stringify(AMZN_PRODUCTION_CAPEX_OBSERVATIONS) === JSON.stringify(ingestedInput), 'production composition changed')
  assert(ingestedInput.length === AMZN_MANUAL_NON_PPE_OBSERVATIONS.length + ingested.length, 'manual and ingested PP&E were accidentally merged')
  const primaryKeys = ingestedInput
    .filter((item) => item.capexDefinitionId === AMZN_PP_AND_E_PURCHASES_DEFINITION.id)
    .map((item) => `${item.period}|${item.metric}`)
  assert(primaryKeys.length === new Set(primaryKeys).size && primaryKeys.length === ingested.length, 'manual and ingested PP&E were merged')

  let missingRejected = false
  let invalidRejected = false
  try { parseCanonicalAmznPpeObservations(null) } catch { missingRejected = true }
  try {
    const invalid = structuredClone(canonical)
    invalid.records.push(structuredClone(invalid.records[0]))
    parseCanonicalAmznPpeObservations(invalid)
  } catch { invalidRejected = true }
  assert(missingRejected && invalidRejected, 'invalid canonical data did not fail closed')

  const ingestedSignals = derive(ingestedInput)
  const repeatedSignals = derive(ingestedInput)
  assert(ingestedSignals.length >= 1 && JSON.stringify(ingestedSignals) === JSON.stringify(repeatedSignals), 'Amazon signal derivation is unavailable or nondeterministic')
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

  const aggregate = deriveCurrentHyperscalerCapexTrend(() => '2026-08-14T00:00:00.000Z')
  assert(aggregate !== null && aggregate.eligibleCount === 4 && aggregate.positiveCount === 4 && aggregate.coverage === 100 && aggregate.positiveBreadth === 100 && aggregate.direction === 'POSITIVE' && aggregate.confidence === 'HIGH', 'hyperscaler regression failed')
  const cross = deriveHyperscalerTsmConfirmation(aggregate, TSM_PRODUCTION_OBSERVATIONS, () => '2026-08-14T00:00:00.000Z')
  assert(cross !== null && cross.direction === 'POSITIVE' && cross.alignment === 'CONFIRMED' && cross.confidence === 'HIGH', 'cross-confirmation regression failed')
  const regressions = verifyGoogCapexSignals()
  assert(regressions.metaParity && regressions.msftParity && regressions.crossCompanyUnchanged, 'META/MSFT/GOOG regressions failed')

  return {
    factualParityCount: manual.length,
    ingestedObservationCount: ingested.length,
    latestTtmPrior: latestSignal.priorYearValue,
    latestTtmCurrent: latestSignal.currentValue,
    latestTtmYoYPercent: latestSignal.yoyPercent,
    latestTtmPeriod: latestSignal.period,
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
