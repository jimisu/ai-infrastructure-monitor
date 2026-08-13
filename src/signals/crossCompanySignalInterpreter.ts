import type { MetricObservation } from '../types/metric'
import type { CrossCompanySignal } from '../types/crossCompanySignal'
import { systemGeneratedAt, type GeneratedAtProvider } from './derivedSignalIdentity'
import { deriveMetaCapexSignals } from './metaCapexSignalInterpreter'
import { deriveTsmSignalsWithTrendConfirmation } from './tsmSignalInterpreter'

function buildCrossCompanySignalId(
  signalType: CrossCompanySignal['signalType'],
  participatingCompanies: string[],
  underlyingDerivedSignalIds: string[],
  evidenceObservationIds: string[]
): string {
  const parts = [
    signalType,
    ...[...participatingCompanies].sort(),
    ...[...underlyingDerivedSignalIds].sort(),
    ...[...evidenceObservationIds].sort(),
  ]

  return `cross-company-signal:${parts.map(encodeURIComponent).join(':')}`
}

function hasValidEvidence(signalEvidenceIds: string[], observations: MetricObservation[]): boolean {
  const observationIds = new Set(observations.map((observation) => observation.id))
  return signalEvidenceIds.length > 0 && signalEvidenceIds.every((id) => observationIds.has(id))
}

export function deriveCrossCompanySignals(
  metaObservations: MetricObservation[],
  tsmObservations: MetricObservation[],
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): CrossCompanySignal[] {
  const metaSignals = deriveMetaCapexSignals(metaObservations, generatedAt)
  const metaDemandSignal = metaSignals.find(
    (signal) =>
      signal.companyTicker === 'META' &&
      signal.signalType === 'CAPEX_GUIDANCE_REVISION_UP' &&
      signal.direction === 'POSITIVE'
  )
  const tsmResult = deriveTsmSignalsWithTrendConfirmation(tsmObservations, generatedAt)
  const tsmOutlookSignal = tsmResult.signals.find(
    (signal) =>
      signal.companyTicker === 'TSM' &&
      signal.signalType === 'REVENUE_OUTLOOK_ACCELERATION' &&
      signal.direction === 'POSITIVE'
  )

  const metaEvidenceValid =
    metaDemandSignal !== undefined &&
    hasValidEvidence(metaDemandSignal.evidenceObservationIds, metaObservations)
  const tsmEvidenceIds = tsmResult.confirmation?.evidenceIds ?? []
  const tsmConfirmationPositive =
    tsmResult.trend3M?.direction === 'ACCELERATING' &&
    tsmOutlookSignal !== undefined &&
    tsmResult.confirmation?.alignment === 'CONFIRMED' &&
    tsmResult.confirmation.level === 'HIGH' &&
    hasValidEvidence(tsmEvidenceIds, tsmObservations)

  if (!metaDemandSignal || !metaEvidenceValid || !tsmOutlookSignal || !tsmConfirmationPositive) {
    return []
  }

  const latestMetaEvidence = metaObservations
    .filter((observation) => metaDemandSignal.evidenceObservationIds.includes(observation.id))
    .sort((a, b) => (a.guidanceAsOfPeriod ?? '').localeCompare(b.guidanceAsOfPeriod ?? ''))
    .at(-1)

  if (!latestMetaEvidence?.guidanceAsOfPeriod || !tsmResult.trend3M) {
    return []
  }

  const participatingCompanies = ['META', 'TSM']
  const underlyingDerivedSignalIds = [metaDemandSignal.id, tsmOutlookSignal.id].sort()
  const evidenceObservationIds = [
    ...new Set([...metaDemandSignal.evidenceObservationIds, ...tsmEvidenceIds]),
  ].sort()
  const signalType = 'AI_INFRASTRUCTURE_DEMAND_CONFIRMATION' as const

  return [
    {
      id: buildCrossCompanySignalId(
        signalType,
        participatingCompanies,
        underlyingDerivedSignalIds,
        evidenceObservationIds
      ),
      signalType,
      direction: 'POSITIVE',
      confidence: 'HIGH',
      participatingCompanies,
      underlyingDerivedSignalIds,
      evidenceObservationIds,
      period: {
        metaTargetPeriod: metaDemandSignal.period,
        metaGuidanceAsOfPeriod: latestMetaEvidence.guidanceAsOfPeriod,
        tsmHistoricalPeriod: tsmResult.trend3M.currentPeriod.period,
        tsmForwardPeriod: tsmOutlookSignal.period,
      },
      generatedAt: generatedAt(),
      description:
        'Meta annual CapEx guidance revision is positive while TSMC historical revenue momentum and forward revenue outlook are also positive.',
    },
  ]
}
