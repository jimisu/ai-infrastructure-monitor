import canonical from '../../data/ingestion/observations/tsm-monthly.json'
import { getSourceById } from '../data/sources'
import { composeTsmSignalObservations, getTsmMonthlyObservations, parseCanonicalTsmMonthlyObservations, TSM_PRODUCTION_OBSERVATIONS } from '../data/tsmMonthlyObservationProvider'
import type { MetricObservation } from '../types/metric'
import { deriveCurrentHyperscalerCapexTrend } from '../signals/hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from '../signals/hyperscalerTsmConfirmationEngine'
import { deriveTsmSignalsWithTrendConfirmation } from '../signals/tsmSignalInterpreter'

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`TSMC ingestion verification failed: ${message}`)
}
const factual = (observation: MetricObservation) => ({
  companyTicker: observation.companyTicker, metric: observation.metric, period: observation.period,
  periodType: observation.periodType, value: observation.value, unit: observation.unit,
  sourceId: observation.sourceId,
})
const signalProjection = (result: ReturnType<typeof deriveTsmSignalsWithTrendConfirmation>) => ({
  signals: result.signals,
  trend: result.trend3M && {
    direction: result.trend3M.direction, magnitude: result.trend3M.magnitude,
    previousPeriod: { period: result.trend3M.previousPeriod.period, avgYoY: result.trend3M.previousPeriod.avgYoY },
    currentPeriod: { period: result.trend3M.currentPeriod.period, avgYoY: result.trend3M.currentPeriod.avgYoY },
    evidenceIds: result.trend3M.evidenceIds,
  },
  confirmation: result.confirmation,
})

export function verifyTsmMonthlyIngestionParity() {
  const manual = getTsmMonthlyObservations('MANUAL')
  const ingested = getTsmMonthlyObservations('INGESTED')
  assert(manual.length === 12 && ingested.length === 12, 'baseline count changed')
  assert(JSON.stringify(ingested.map(factual)) === JSON.stringify(manual.map(factual)), 'MANUAL and INGESTED factual parity failed')
  assert(new Set(ingested.map((observation) => observation.id)).size === ingested.length, 'provider returned duplicate IDs')

  const manualInput = composeTsmSignalObservations('MANUAL')
  const ingestedInput = composeTsmSignalObservations('INGESTED')
  assert(TSM_PRODUCTION_OBSERVATIONS.length === ingestedInput.length, 'production does not select exactly one monthly source')
  assert(ingestedInput.length === 17, 'manual and ingested monthly data were accidentally merged')
  const monthlyKeys = ingestedInput.filter((observation) => observation.periodType === 'MONTH').map((observation) => observation.metric + '|' + observation.period)
  assert(new Set(monthlyKeys).size === monthlyKeys.length, 'monthly composition contains duplicates')

  let missingRejected = false
  let malformedRejected = false
  try { parseCanonicalTsmMonthlyObservations(null) } catch { missingRejected = true }
  try {
    const invalid = structuredClone(canonical)
    invalid.records.push(structuredClone(invalid.records[0]))
    parseCanonicalTsmMonthlyObservations(invalid)
  } catch { malformedRejected = true }
  assert(missingRejected, 'missing canonical data did not fail closed')
  assert(malformedRejected, 'invalid canonical data did not fail closed')

  const fixedTime = () => '2026-08-13T00:00:00.000Z'
  const manualResult = deriveTsmSignalsWithTrendConfirmation(manualInput, fixedTime)
  const ingestedResult = deriveTsmSignalsWithTrendConfirmation(ingestedInput, fixedTime)
  assert(JSON.stringify(signalProjection(ingestedResult)) === JSON.stringify(signalProjection(manualResult)), 'TSMC derived signal parity failed')
  const trend = ingestedResult.trend3M
  assert(trend !== null, 'ingested trend unavailable')
  assert(Math.abs(trend.previousPeriod.avgYoY - 34.733333333333334) < 1e-12, 'previous average changed')
  assert(trend.currentPeriod.avgYoY === 38.5, 'current average changed')
  assert(Math.abs(trend.magnitude - 3.7666666666666657) < 1e-12 && trend.direction === 'ACCELERATING', 'trend changed')

  const demand = deriveCurrentHyperscalerCapexTrend(fixedTime)
  const manualCross = deriveHyperscalerTsmConfirmation(demand, manualInput, fixedTime)
  const ingestedCross = deriveHyperscalerTsmConfirmation(demand, ingestedInput, fixedTime)
  assert(manualCross !== null && ingestedCross !== null, 'cross-confirmation unavailable')
  assert(JSON.stringify(ingestedCross) === JSON.stringify(manualCross), 'Hyperscaler x TSMC confirmation changed')

  const source = getSourceById('tsmc-monthly-revenue')
  assert(source?.companyTicker === 'TSM' && source.tier === 'TIER_1_OFFICIAL', 'source registry mismatch')
  return {
    parityObservationCount: ingested.length,
    providerMode: 'INGESTED',
    productionObservationCount: TSM_PRODUCTION_OBSERVATIONS.length,
    previousAverage: trend.previousPeriod.avgYoY,
    currentAverage: trend.currentPeriod.avgYoY,
    deltaPercentagePoints: trend.magnitude,
    trendDirection: trend.direction,
    derivedSignalsIdentical: true,
    deterministicIdsIdentical: ingestedResult.signals.every((signal, index) => signal.id === manualResult.signals[index]?.id),
    forwardSignalUnchanged: true,
    tsmConfirmationUnchanged: true,
    crossConfirmationUnchanged: true,
    missingCanonicalRejected: missingRejected,
    malformedCanonicalRejected: malformedRejected,
    noDoubleCounting: true,
  }
}
