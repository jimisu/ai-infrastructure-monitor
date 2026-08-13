import type {
  CapexDefinition,
  CapexGuidanceRevision,
  CapexQoQGrowth,
  CompanyCapexProfile,
  NormalizedCapexObservation,
} from '../types/capex'
import type { DerivedSignal } from '../types/derivedSignal'
import type { MetricObservation } from '../types/metric'
import {
  buildDerivedSignalId,
  systemGeneratedAt,
  type GeneratedAtProvider,
} from './derivedSignalIdentity'

export function normalizeCapexObservations(
  observations: MetricObservation[],
  profile: CompanyCapexProfile,
  definition: CapexDefinition
): NormalizedCapexObservation[] {
  if (
    definition.id !== profile.capexDefinitionId ||
    definition.companyTicker !== profile.companyTicker
  ) {
    return []
  }

  return observations.flatMap((observation): NormalizedCapexObservation[] => {
    if (
      observation.companyTicker !== profile.companyTicker ||
      observation.unit !== profile.currencyUnit ||
      !definition.sourceIds.includes(observation.sourceId)
    ) {
      return []
    }

    if (
      observation.metric === 'CAPEX_GUIDANCE_LOW' &&
      observation.periodType === 'YEAR' &&
      observation.guidanceAsOfPeriod
    ) {
      return [{
        ...observation,
        kind: 'ANNUAL_GUIDANCE_LOW',
        targetPeriod: observation.period,
        targetPeriodType: 'YEAR',
        capexDefinitionId: definition.id,
        sourceObservation: observation,
      }]
    }

    if (
      observation.metric === 'CAPEX_GUIDANCE_HIGH' &&
      observation.periodType === 'YEAR' &&
      observation.guidanceAsOfPeriod
    ) {
      return [{
        ...observation,
        kind: 'ANNUAL_GUIDANCE_HIGH',
        targetPeriod: observation.period,
        targetPeriodType: 'YEAR',
        capexDefinitionId: definition.id,
        sourceObservation: observation,
      }]
    }

    if (observation.metric === 'CAPEX_ACTUAL' && observation.periodType === 'QUARTER') {
      return [{
        ...observation,
        kind: 'QUARTERLY_ACTUAL',
        targetPeriod: observation.period,
        targetPeriodType: 'QUARTER',
        capexDefinitionId: definition.id,
        sourceObservation: observation,
      }]
    }

    return []
  })
}

function latestGuidancePair(observations: NormalizedCapexObservation[]) {
  const annualGuidance = observations
    .filter((observation) => observation.targetPeriodType === 'YEAR')
    .sort((a, b) =>
      a.targetPeriod.localeCompare(b.targetPeriod) ||
      a.guidanceAsOfPeriod!.localeCompare(b.guidanceAsOfPeriod!)
    )
  const latestTargetPeriod = annualGuidance.at(-1)?.targetPeriod
  if (!latestTargetPeriod) return null

  const targetGuidance = annualGuidance.filter(
    (observation) => observation.targetPeriod === latestTargetPeriod
  )
  const asOfPeriods = [...new Set(targetGuidance.map((observation) => observation.guidanceAsOfPeriod!))]
  if (asOfPeriods.length < 2) return null

  const priorAsOfPeriod = asOfPeriods.at(-2)!
  const latestAsOfPeriod = asOfPeriods.at(-1)!
  const find = (kind: NormalizedCapexObservation['kind'], asOfPeriod: string) =>
    targetGuidance.find(
      (observation) => observation.kind === kind && observation.guidanceAsOfPeriod === asOfPeriod
    )
  const priorLow = find('ANNUAL_GUIDANCE_LOW', priorAsOfPeriod)
  const priorHigh = find('ANNUAL_GUIDANCE_HIGH', priorAsOfPeriod)
  const latestLow = find('ANNUAL_GUIDANCE_LOW', latestAsOfPeriod)
  const latestHigh = find('ANNUAL_GUIDANCE_HIGH', latestAsOfPeriod)

  if (!priorLow || !priorHigh || !latestLow || !latestHigh) return null
  return { priorAsOfPeriod, latestAsOfPeriod, priorLow, priorHigh, latestLow, latestHigh }
}

export function deriveCompanyCapexGuidanceRevision(
  observations: NormalizedCapexObservation[],
  companyTicker: string
): CapexGuidanceRevision | null {
  const pair = latestGuidancePair(observations)
  if (!pair) return null

  const initialMidpoint = (pair.priorLow.value + pair.priorHigh.value) / 2
  const currentMidpoint = (pair.latestLow.value + pair.latestHigh.value) / 2
  const revisionPercent = ((currentMidpoint - initialMidpoint) / initialMidpoint) * 100
  const trend = revisionPercent > 0 ? 'UPWARD' : revisionPercent < 0 ? 'DOWNWARD' : 'NEUTRAL'

  return {
    period: pair.latestLow.targetPeriod,
    initialMidpoint,
    currentMidpoint,
    revisionPercent,
    trend,
    evidenceIds: [pair.priorLow.id, pair.priorHigh.id, pair.latestLow.id, pair.latestHigh.id],
    description: `${companyTicker} ${pair.latestLow.targetPeriod} CapEx guidance revised ${revisionPercent >= 0 ? '+' : ''}${revisionPercent.toFixed(1)}% from ${initialMidpoint.toFixed(2)}B as of ${pair.priorAsOfPeriod} to ${currentMidpoint.toFixed(2)}B as of ${pair.latestAsOfPeriod}.`,
  }
}

function quarterIndex(period: string): number | null {
  const match = /^(\d{4})-Q([1-4])$/.exec(period)
  return match ? Number(match[1]) * 4 + Number(match[2]) - 1 : null
}

export function deriveCompanyCapexQoQGrowthRates(
  observations: NormalizedCapexObservation[]
): CapexQoQGrowth[] {
  const actuals = observations
    .filter((observation) => observation.kind === 'QUARTERLY_ACTUAL')
    .map((observation) => ({ observation, index: quarterIndex(observation.targetPeriod) }))
    .filter((entry): entry is { observation: NormalizedCapexObservation; index: number } =>
      entry.index !== null
    )
    .sort((a, b) => a.index - b.index)
  const latest = actuals.at(-1)
  const prior = actuals.at(-2)

  if (!latest || !prior || latest.index !== prior.index + 1) return []

  return [{
    period: latest.observation.targetPeriod,
    value: latest.observation.value,
    qoqPercent:
      ((latest.observation.value - prior.observation.value) / prior.observation.value) * 100,
    previousValue: prior.observation.value,
    previousPeriod: prior.observation.targetPeriod,
    evidenceIds: [prior.observation.id, latest.observation.id],
  }]
}

export function deriveCompanyCapexSignals(
  observations: NormalizedCapexObservation[],
  profile: CompanyCapexProfile,
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): DerivedSignal[] {
  const signals: DerivedSignal[] = []
  const revision = deriveCompanyCapexGuidanceRevision(observations, profile.companyTicker)

  if (revision && revision.revisionPercent !== 0) {
    const signalType = revision.revisionPercent > 0
      ? 'CAPEX_GUIDANCE_REVISION_UP' as const
      : 'CAPEX_GUIDANCE_REVISION_DOWN' as const
    signals.push({
      id: buildDerivedSignalId(profile.companyTicker, signalType, revision.period, revision.evidenceIds),
      companyTicker: profile.companyTicker,
      signalType,
      direction: revision.revisionPercent > 0 ? 'POSITIVE' : 'NEGATIVE',
      magnitude: revision.revisionPercent,
      unit: 'percent',
      confidence: 'HIGH',
      period: revision.period,
      generatedAt: generatedAt(),
      evidenceObservationIds: revision.evidenceIds,
      description: revision.description.replace(' revised ', ' midpoint revised '),
    })
  }

  for (const rate of deriveCompanyCapexQoQGrowthRates(observations)) {
    const signalType = rate.qoqPercent >= 0
      ? 'CAPEX_QOQ_ACCELERATION' as const
      : 'CAPEX_QOQ_DECELERATION' as const
    signals.push({
      id: buildDerivedSignalId(profile.companyTicker, signalType, rate.period, rate.evidenceIds),
      companyTicker: profile.companyTicker,
      signalType,
      direction: rate.qoqPercent > 0 ? 'POSITIVE' : rate.qoqPercent < 0 ? 'NEGATIVE' : 'NEUTRAL',
      magnitude: rate.qoqPercent,
      unit: 'percent',
      confidence: 'HIGH',
      period: rate.period,
      generatedAt: generatedAt(),
      evidenceObservationIds: rate.evidenceIds,
      description: `${profile.companyTicker} ${rate.period} CapEx ${rate.value.toFixed(2)}B, ${rate.qoqPercent >= 0 ? '+' : ''}${rate.qoqPercent.toFixed(1)}% vs ${rate.previousPeriod} ${rate.previousValue.toFixed(2)}B.`,
    })
  }

  return signals
}
