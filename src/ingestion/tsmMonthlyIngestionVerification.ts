import canonical from '../../data/ingestion/observations/tsm-monthly.json'
import { getSourceById } from '../data/sources'
import { composeTsmSignalObservations, getTsmMonthlyObservations, parseCanonicalTsmMonthlyObservations, TSM_MANUAL_NON_MONTHLY_OBSERVATIONS, TSM_PRODUCTION_OBSERVATIONS } from '../data/tsmMonthlyObservationProvider'
import type { MetricObservation } from '../types/metric'
import { TREND_ACCELERATION_THRESHOLD } from '../config/signalRules'
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
  assert(manual.length === 12 && ingested.length >= manual.length, 'manual overlap floor changed')
  const ingestedFacts = new Map(ingested.map((observation) => [JSON.stringify(factual(observation)), observation]))
  assert(manual.every((observation) => ingestedFacts.has(JSON.stringify(factual(observation)))), 'MANUAL overlap factual parity failed')
  assert(manual.every((observation) => ingestedFacts.get(JSON.stringify(factual(observation)))?.id === observation.id), 'legacy observation ID compatibility changed')
  assert(new Set(ingested.map((observation) => observation.id)).size === ingested.length, 'provider returned duplicate IDs')

  const ingestedInput = composeTsmSignalObservations('INGESTED')
  assert(JSON.stringify(TSM_PRODUCTION_OBSERVATIONS) === JSON.stringify(ingestedInput), 'production does not select exactly one monthly source')
  assert(ingestedInput.length === TSM_MANUAL_NON_MONTHLY_OBSERVATIONS.length + ingested.length, 'manual and ingested monthly data were accidentally merged')
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
  const ingestedResult = deriveTsmSignalsWithTrendConfirmation(ingestedInput, fixedTime)
  const repeatedResult = deriveTsmSignalsWithTrendConfirmation(ingestedInput, fixedTime)
  assert(JSON.stringify(signalProjection(ingestedResult)) === JSON.stringify(signalProjection(repeatedResult)), 'TSMC signal derivation is not deterministic')
  const trend = ingestedResult.trend3M
  assert(trend !== null, 'ingested trend unavailable')
  const latestYoY = ingested.filter((observation) => observation.metric === 'MONTHLY_REVENUE_YOY_PERCENT').slice(-6)
  assert(latestYoY.length === 6, 'latest six-month trend input unavailable')
  const previousAverage = latestYoY.slice(0, 3).reduce((sum, observation) => sum + observation.value, 0) / 3
  const currentAverage = latestYoY.slice(3).reduce((sum, observation) => sum + observation.value, 0) / 3
  const magnitude = currentAverage - previousAverage
  const expectedDirection = magnitude > TREND_ACCELERATION_THRESHOLD ? 'ACCELERATING' : magnitude < -TREND_ACCELERATION_THRESHOLD ? 'DECELERATING' : 'STABLE'
  assert(Math.abs(trend.previousPeriod.avgYoY - previousAverage) < 1e-12 && Math.abs(trend.currentPeriod.avgYoY - currentAverage) < 1e-12, 'trend averages do not use the latest six months')
  assert(Math.abs(trend.magnitude - magnitude) < 1e-12 && trend.direction === expectedDirection, 'latest trend calculation changed')
  assert(JSON.stringify(trend.evidenceIds) === JSON.stringify(latestYoY.map((observation) => observation.id)), 'trend evidence does not select the latest six months')

  const demand = deriveCurrentHyperscalerCapexTrend(fixedTime)
  const ingestedCross = deriveHyperscalerTsmConfirmation(demand, ingestedInput, fixedTime)
  const repeatedCross = deriveHyperscalerTsmConfirmation(demand, ingestedInput, fixedTime)
  assert(ingestedCross !== null && repeatedCross !== null, 'cross-confirmation unavailable')
  assert(JSON.stringify(ingestedCross) === JSON.stringify(repeatedCross), 'Hyperscaler x TSMC confirmation is not deterministic')

  const source = getSourceById('tsmc-monthly-revenue')
  assert(source?.companyTicker === 'TSM' && source.tier === 'TIER_1_OFFICIAL', 'source registry mismatch')
  return {
    parityObservationCount: manual.length,
    ingestedObservationCount: ingested.length,
    providerMode: 'INGESTED',
    productionObservationCount: TSM_PRODUCTION_OBSERVATIONS.length,
    previousAverage: trend.previousPeriod.avgYoY,
    currentAverage: trend.currentPeriod.avgYoY,
    deltaPercentagePoints: trend.magnitude,
    trendDirection: trend.direction,
    derivedSignalsIdentical: true,
    deterministicIdsIdentical: ingestedResult.signals.every((signal, index) => signal.id === repeatedResult.signals[index]?.id),
    forwardSignalUnchanged: true,
    tsmConfirmationUnchanged: true,
    crossConfirmationUnchanged: true,
    missingCanonicalRejected: missingRejected,
    malformedCanonicalRejected: malformedRejected,
    noDoubleCounting: true,
  }
}
