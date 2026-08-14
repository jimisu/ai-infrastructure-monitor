import { AMZN_2026_CAPEX_OUTLOOK_DEFINITION, AMZN_PP_AND_E_PURCHASES_DEFINITION, GOOG_REPORTED_CAPEX_DEFINITION, META_CAPEX_DEFINITION, MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import { AMZN_CAPEX_PROFILE, GOOG_CAPEX_PROFILE, META_CAPEX_PROFILE, MSFT_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { AMZN_PRODUCTION_CAPEX_OBSERVATIONS } from '../data/amznPpeObservationProvider'
import { GOOG_CAPEX_OBSERVATIONS } from '../data/googCapexMetrics'
import { META_PRODUCTION_CAPEX_OBSERVATIONS } from '../data/metaGuidanceObservationProvider'
import { MSFT_CAPEX_OBSERVATIONS } from '../data/msftCapexMetrics'
import { getSourceById } from '../data/sources'
import type { Direction } from '../types/derivedSignal'
import type {
  HyperscalerCapexTrend,
  HyperscalerCompanyCapexInput,
  HyperscalerTicker,
} from '../types/hyperscalerCapexTrend'
import {
  deriveCompanyCapexForwardImpliedYoYGrowth,
  deriveCompanyCapexGuidanceRevisionChain,
  deriveCompanyCapexYoYActualTrends,
  deriveCompanyCapexSignals,
  deriveCompanyCapexTtmYoYActualTrends,
  normalizeCapexObservations,
} from './companyCapexSignalEngine'
import { systemGeneratedAt, type GeneratedAtProvider } from './derivedSignalIdentity'

export const HYPERSCALER_CAPEX_UNIVERSE: HyperscalerTicker[] = ['META', 'MSFT', 'GOOG', 'AMZN']

function stableAggregateId(
  inputs: HyperscalerCompanyCapexInput[],
  signalIds: string[],
  evidenceIds: string[]
): string {
  const availability = inputs
    .map((input) => `${input.companyTicker}=${input.availability}`)
    .sort()
  return `aggregate-signal:${[
    'HYPERSCALER_CAPEX_TREND',
    ...availability,
    ...signalIds.slice().sort(),
    ...evidenceIds.slice().sort(),
  ].map(encodeURIComponent).join(':')}`
}

export function deriveHyperscalerCapexTrend(
  inputs: HyperscalerCompanyCapexInput[],
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): HyperscalerCapexTrend | null {
  const byTicker = new Map(inputs.map((input) => [input.companyTicker, input]))
  if (byTicker.size !== HYPERSCALER_CAPEX_UNIVERSE.length) return null
  if (!HYPERSCALER_CAPEX_UNIVERSE.every((ticker) => byTicker.has(ticker))) return null

  const eligible = HYPERSCALER_CAPEX_UNIVERSE.flatMap((ticker) => {
    const input = byTicker.get(ticker)!
    if (
      input.availability === 'UNAVAILABLE' ||
      !input.primarySignalId ||
      !input.asOfPeriod ||
      !input.tier1Evidence ||
      !input.comparabilityValid
    ) return []
    return [input]
  })
  if (eligible.length < 2) return null

  const count = (direction: Direction) =>
    eligible.filter((input) => input.availability === direction).length
  const positiveCount = count('POSITIVE')
  const negativeCount = count('NEGATIVE')
  const neutralCount = count('NEUTRAL')
  const strictMajority = eligible.length / 2
  const direction: Direction =
    positiveCount > strictMajority && positiveCount > negativeCount
      ? 'POSITIVE'
      : negativeCount > strictMajority && negativeCount > positiveCount
        ? 'NEGATIVE'
        : 'NEUTRAL'

  const agreeingCount =
    direction === 'POSITIVE'
      ? positiveCount
      : direction === 'NEGATIVE'
        ? negativeCount
        : neutralCount
  const materialConflict =
    direction === 'POSITIVE'
      ? negativeCount > 0
      : direction === 'NEGATIVE'
        ? positiveCount > 0
        : positiveCount > 0 && negativeCount > 0
  const confidence =
    eligible.length === 4 && agreeingCount >= 3 && !materialConflict
      ? 'HIGH'
      : eligible.length >= 3 && direction !== 'NEUTRAL' && !materialConflict
        ? 'MEDIUM'
        : 'LOW'

  const underlyingCompanySignalIds = [...new Set(eligible.flatMap((input) => [
    input.primarySignalId!,
    ...(input.supportingSignalIds ?? []),
  ]))].sort()
  const evidenceObservationIds = [...new Set(
    eligible.flatMap((input) => input.evidenceObservationIds ?? [])
  )].sort()
  const unavailableCompanies = HYPERSCALER_CAPEX_UNIVERSE.filter(
    (ticker) => !eligible.some((input) => input.companyTicker === ticker)
  )
  const companyPeriods = Object.fromEntries(
    eligible.map((input) => [input.companyTicker, input.asOfPeriod!])
  ) as Partial<Record<HyperscalerTicker, string>>
  const latestEvidencePublishedAt = eligible
    .map((input) => input.latestEvidencePublishedAt)
    .filter((value): value is string => value !== undefined)
    .sort()
    .at(-1)
  if (!latestEvidencePublishedAt) return null

  return {
    id: stableAggregateId(inputs, underlyingCompanySignalIds, evidenceObservationIds),
    signalType: 'HYPERSCALER_CAPEX_TREND',
    participatingCompanies: eligible.map((input) => ({
      companyTicker: input.companyTicker,
      direction: input.availability as Direction,
      primarySignalId: input.primarySignalId!,
      supportingSignalIds: input.supportingSignalIds ?? [],
      asOfPeriod: input.asOfPeriod!,
    })),
    unavailableCompanies,
    positiveCount,
    negativeCount,
    neutralCount,
    eligibleCount: eligible.length,
    totalUniverseCount: HYPERSCALER_CAPEX_UNIVERSE.length,
    positiveBreadth: (positiveCount / eligible.length) * 100,
    coverage: (eligible.length / HYPERSCALER_CAPEX_UNIVERSE.length) * 100,
    direction,
    confidence,
    underlyingCompanySignalIds,
    evidenceObservationIds,
    asOf: { companyPeriods, latestEvidencePublishedAt },
    generatedAt: generatedAt(),
  }
}

function latestPublishedAt(evidenceIds: string[], observations: typeof META_PRODUCTION_CAPEX_OBSERVATIONS): string {
  const evidence = new Set(evidenceIds)
  return observations
    .filter((observation) => evidence.has(observation.id))
    .map((observation) => observation.publishedAt)
    .sort()
    .at(-1) ?? ''
}

function hasOnlyTier1Evidence(evidenceIds: string[], observations: typeof META_PRODUCTION_CAPEX_OBSERVATIONS): boolean {
  const evidence = new Set(evidenceIds)
  const selected = observations.filter((observation) => evidence.has(observation.id))
  return selected.length === evidence.size && selected.every(
    (observation) => getSourceById(observation.sourceId)?.tier === 'TIER_1_OFFICIAL'
  )
}

export function deriveCurrentHyperscalerCapexTrend(
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): HyperscalerCapexTrend | null {
  const metaNormalized = normalizeCapexObservations(
    META_PRODUCTION_CAPEX_OBSERVATIONS,
    META_CAPEX_PROFILE,
    [META_CAPEX_DEFINITION]
  )
  const meta = deriveCompanyCapexSignals(metaNormalized, META_CAPEX_PROFILE, generatedAt)
    .filter((signal) =>
      signal.signalType === 'CAPEX_GUIDANCE_REVISION_UP' ||
      signal.signalType === 'CAPEX_GUIDANCE_REVISION_DOWN'
    )
    .at(-1)

  const msftNormalized = normalizeCapexObservations(
    MSFT_CAPEX_OBSERVATIONS,
    MSFT_CAPEX_PROFILE,
    [MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION]
  )
  const msft = deriveCompanyCapexYoYActualTrends(
    msftNormalized,
    MSFT_CAPEX_PROFILE,
    MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    generatedAt
  ).at(-1)

  const googNormalized = normalizeCapexObservations(
    GOOG_CAPEX_OBSERVATIONS,
    GOOG_CAPEX_PROFILE,
    [GOOG_REPORTED_CAPEX_DEFINITION]
  )
  const googForward = deriveCompanyCapexForwardImpliedYoYGrowth(
    googNormalized,
    GOOG_CAPEX_PROFILE,
    GOOG_REPORTED_CAPEX_DEFINITION.id,
    generatedAt
  )
  const googSupporting = deriveCompanyCapexGuidanceRevisionChain(
    googNormalized,
    GOOG_CAPEX_PROFILE,
    GOOG_REPORTED_CAPEX_DEFINITION.id,
    generatedAt
  ).at(-1)

  const metaEvidence = meta?.evidenceObservationIds ?? []
  const msftEvidence = msft?.evidenceObservationIds ?? []
  const googEvidence = [
    ...(googForward?.evidenceObservationIds ?? []),
    ...(googSupporting?.evidenceObservationIds ?? []),
  ]

  const amznNormalized = normalizeCapexObservations(
    AMZN_PRODUCTION_CAPEX_OBSERVATIONS,
    AMZN_CAPEX_PROFILE,
    [AMZN_PP_AND_E_PURCHASES_DEFINITION, AMZN_2026_CAPEX_OUTLOOK_DEFINITION]
  )
  const amzn = deriveCompanyCapexTtmYoYActualTrends(
    amznNormalized,
    AMZN_CAPEX_PROFILE,
    AMZN_PP_AND_E_PURCHASES_DEFINITION.id,
    generatedAt
  ).at(-1)
  const amznOutlook = amznNormalized.find(
    (observation) =>
      observation.kind === 'GUIDANCE_POINT' &&
      observation.capexDefinitionId === AMZN_2026_CAPEX_OUTLOOK_DEFINITION.id &&
      observation.approximate
  )
  const amznEvidence = [
    ...(amzn?.evidenceObservationIds ?? []),
    ...(amznOutlook ? [amznOutlook.id] : []),
  ]

  return deriveHyperscalerCapexTrend([
    {
      companyTicker: 'META',
      availability: meta?.direction ?? 'UNAVAILABLE',
      primarySignalId: meta?.id,
      evidenceObservationIds: metaEvidence,
      asOfPeriod: META_PRODUCTION_CAPEX_OBSERVATIONS
        .filter((observation) => metaEvidence.includes(observation.id))
        .map((observation) => observation.guidanceAsOfPeriod)
        .filter((period): period is string => period !== undefined)
        .sort()
        .at(-1),
      latestEvidencePublishedAt: latestPublishedAt(metaEvidence, META_PRODUCTION_CAPEX_OBSERVATIONS),
      tier1Evidence: hasOnlyTier1Evidence(metaEvidence, META_PRODUCTION_CAPEX_OBSERVATIONS),
      comparabilityValid: meta !== undefined,
    },
    {
      companyTicker: 'MSFT',
      availability: msft?.spendingDirection ?? 'UNAVAILABLE',
      primarySignalId: msft?.id,
      evidenceObservationIds: msftEvidence,
      asOfPeriod: msft?.period,
      latestEvidencePublishedAt: latestPublishedAt(msftEvidence, MSFT_CAPEX_OBSERVATIONS),
      tier1Evidence: hasOnlyTier1Evidence(msftEvidence, MSFT_CAPEX_OBSERVATIONS),
      comparabilityValid: msft !== undefined,
    },
    {
      companyTicker: 'GOOG',
      availability: googForward?.direction ?? 'UNAVAILABLE',
      primarySignalId: googForward?.id,
      supportingSignalIds: googSupporting ? [googSupporting.id] : [],
      evidenceObservationIds: googEvidence,
      asOfPeriod: googForward?.guidanceAsOfPeriod,
      latestEvidencePublishedAt: latestPublishedAt(googEvidence, GOOG_CAPEX_OBSERVATIONS),
      tier1Evidence: hasOnlyTier1Evidence(googEvidence, GOOG_CAPEX_OBSERVATIONS),
      comparabilityValid: googForward !== null,
    },
    {
      companyTicker: 'AMZN',
      availability: amzn?.spendingDirection ?? 'UNAVAILABLE',
      primarySignalId: amzn?.id,
      evidenceObservationIds: amznEvidence,
      asOfPeriod: amzn?.period,
      latestEvidencePublishedAt: latestPublishedAt(amznEvidence, AMZN_PRODUCTION_CAPEX_OBSERVATIONS),
      tier1Evidence: hasOnlyTier1Evidence(amznEvidence, AMZN_PRODUCTION_CAPEX_OBSERVATIONS),
      comparabilityValid: amzn !== undefined,
    },
  ], generatedAt)
}
