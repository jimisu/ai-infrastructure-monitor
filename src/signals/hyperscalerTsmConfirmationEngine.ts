import type { MetricObservation } from '../types/metric'
import type { Confidence } from '../types/derivedSignal'
import type { HyperscalerCapexTrend } from '../types/hyperscalerCapexTrend'
import type { HyperscalerTsmConfirmation } from '../types/hyperscalerTsmConfirmation'
import { systemGeneratedAt, type GeneratedAtProvider } from './derivedSignalIdentity'
import { deriveTsmSignalsWithTrendConfirmation } from './tsmSignalInterpreter'

const confidenceRank: Record<Confidence, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 }

function weakerConfidence(first: Confidence, second: Confidence): Confidence {
  return confidenceRank[first] <= confidenceRank[second] ? first : second
}

function stableId(
  aggregateId: string,
  tsmSignalIds: string[],
  evidenceIds: string[]
): string {
  return `cross-company-signal:${[
    'AI_INFRASTRUCTURE_DEMAND_CONFIRMATION',
    aggregateId,
    ...tsmSignalIds.slice().sort(),
    ...evidenceIds.slice().sort(),
  ].map(encodeURIComponent).join(':')}`
}

export function deriveHyperscalerTsmConfirmation(
  demand: HyperscalerCapexTrend | null,
  tsmObservations: MetricObservation[],
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): HyperscalerTsmConfirmation | null {
  if (!demand || demand.direction !== 'POSITIVE') return null

  const tsm = deriveTsmSignalsWithTrendConfirmation(tsmObservations, generatedAt)
  const outlook = tsm.signals.find(
    (signal) =>
      signal.signalType === 'REVENUE_OUTLOOK_ACCELERATION' &&
      signal.direction === 'POSITIVE'
  )
  const supplyPositive =
    tsm.trend3M?.direction === 'ACCELERATING' &&
    outlook !== undefined &&
    tsm.confirmation?.alignment === 'CONFIRMED' &&
    tsm.confirmation.level === 'HIGH'
  if (!supplyPositive || !tsm.trend3M || !tsm.confirmation || !outlook) return null

  const observationIds = new Set(tsmObservations.map((observation) => observation.id))
  if (!tsm.confirmation.evidenceIds.every((id) => observationIds.has(id))) return null

  const confirmationEvidence = new Set(tsm.confirmation.evidenceIds)
  const tsmUnderlyingSignalIds = tsm.signals
    .filter((signal) =>
      signal.evidenceObservationIds.some((id) => confirmationEvidence.has(id))
    )
    .map((signal) => signal.id)
    .sort()
  if (!tsmUnderlyingSignalIds.includes(outlook.id)) return null

  const evidenceObservationIds = [...new Set([
    ...demand.evidenceObservationIds,
    ...tsm.confirmation.evidenceIds,
  ])].sort()
  const underlyingSignalIds = [
    demand.id,
    ...demand.underlyingCompanySignalIds,
    ...tsmUnderlyingSignalIds,
  ].sort()
  const participatingCompanies = [
    ...demand.participatingCompanies.map((company) => company.companyTicker),
    'TSM' as const,
  ]
  const confidence = weakerConfidence(demand.confidence, 'HIGH')

  return {
    id: stableId(demand.id, tsmUnderlyingSignalIds, evidenceObservationIds),
    signalType: 'AI_INFRASTRUCTURE_DEMAND_CONFIRMATION',
    direction: 'POSITIVE',
    alignment: 'CONFIRMED',
    confidence,
    demandInput: {
      hyperscalerAggregateId: demand.id,
      direction: demand.direction,
      confidence: demand.confidence,
      coverage: demand.coverage,
      eligibleCount: demand.eligibleCount,
      totalUniverseCount: demand.totalUniverseCount,
    },
    supplyInput: {
      companyTicker: 'TSM',
      direction: 'POSITIVE',
      confidence: 'HIGH',
      historicalPeriod: tsm.trend3M.currentPeriod.period,
      forwardPeriod: outlook.period,
    },
    participatingCompanies,
    unavailableCompanies: [...demand.unavailableCompanies],
    underlyingSignalIds,
    tsmUnderlyingSignalIds,
    evidenceObservationIds,
    asOf: {
      hyperscalerCompanyPeriods: { ...demand.asOf.companyPeriods },
      hyperscalerLatestEvidencePublishedAt: demand.asOf.latestEvidencePublishedAt,
      tsmHistoricalPeriod: tsm.trend3M.currentPeriod.period,
      tsmForwardPeriod: outlook.period,
    },
    generatedAt: generatedAt(),
    description:
      'Hyperscaler CapEx trend is positive while TSMC historical revenue momentum and forward revenue outlook are also positive.',
  }
}
