import { GOOG_REPORTED_CAPEX_DEFINITION, MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import { GOOG_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { GOOG_CAPEX_OBSERVATIONS } from '../data/googCapexMetrics'
import { META_CAPEX_OBSERVATIONS } from '../data/metaCapexMetrics'
import { getSourceById } from '../data/sources'
import { TSM_METRIC_OBSERVATIONS } from '../data/tsmMetrics'
import {
  deriveCompanyCapexForwardImpliedYoYGrowth,
  deriveCompanyCapexGuidanceRevisionChain,
  normalizeCapexObservations,
} from './companyCapexSignalEngine'
import { verifyMetaCompanyCapexParity } from './companyCapexSignalParityVerification'
import { deriveCrossCompanySignals } from './crossCompanySignalInterpreter'
import { verifyMsftCapexYoYTrends } from './msftCapexYoYVerification'

export interface GoogCapexVerificationResult {
  guidanceRevisionPercents: number[]
  forwardGuidanceMidpoint: number
  priorActualValue: number
  forwardImpliedYoYPercent: number
  approximationPreserved: boolean
  missingQuarterlyObservationsNotInvented: boolean
  incompatibleDefinitionsNotCompared: boolean
  deterministicIds: string[]
  metaParity: boolean
  msftParity: boolean
  crossCompanyUnchanged: boolean
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`GOOG CapEx verification failed: ${message}`)
}

export function verifyGoogCapexSignals(): GoogCapexVerificationResult {
  const normalized = normalizeCapexObservations(
    GOOG_CAPEX_OBSERVATIONS,
    GOOG_CAPEX_PROFILE,
    [GOOG_REPORTED_CAPEX_DEFINITION]
  )
  assert(normalized.length === GOOG_CAPEX_OBSERVATIONS.length, 'observations failed normalization')
  assert(
    GOOG_CAPEX_OBSERVATIONS.every(
      (observation) => getSourceById(observation.sourceId)?.tier === 'TIER_1_OFFICIAL'
    ),
    'non-Tier-1 source found'
  )

  const firstTime = () => '2026-08-13T00:00:00.000Z'
  const secondTime = () => '2030-01-01T00:00:00.000Z'
  const revisions = deriveCompanyCapexGuidanceRevisionChain(
    normalized,
    GOOG_CAPEX_PROFILE,
    GOOG_REPORTED_CAPEX_DEFINITION.id,
    firstTime
  )
  const repeatedRevisions = deriveCompanyCapexGuidanceRevisionChain(
    normalized,
    GOOG_CAPEX_PROFILE,
    GOOG_REPORTED_CAPEX_DEFINITION.id,
    secondTime
  )

  assert(revisions.length === 2, 'expected exactly two non-zero 2025 revisions')
  assert(Math.abs(revisions[0].revisionPercent - 13.333333333333334) < 1e-12, '75-to-85 revision changed')
  assert(Math.abs(revisions[1].revisionPercent - 8.235294117647058) < 1e-12, '85-to-92 revision changed')
  assert(revisions.every((revision) => revision.approximate), 'approximation metadata was lost')
  assert(revisions[0].priorGuidanceShape === 'APPROXIMATE_POINT', 'prior approximate point shape was lost')
  assert(revisions[1].currentGuidanceShape === 'RANGE', 'range shape was lost')

  const forward = deriveCompanyCapexForwardImpliedYoYGrowth(
    normalized,
    GOOG_CAPEX_PROFILE,
    GOOG_REPORTED_CAPEX_DEFINITION.id,
    firstTime
  )
  const repeatedForward = deriveCompanyCapexForwardImpliedYoYGrowth(
    normalized,
    GOOG_CAPEX_PROFILE,
    GOOG_REPORTED_CAPEX_DEFINITION.id,
    secondTime
  )
  assert(forward !== null && repeatedForward !== null, 'forward implied growth unavailable')
  assert(forward.guidanceMidpoint === 180, '2026 midpoint changed')
  assert(forward.priorActualValue === 91.4, '2025 actual changed')
  assert(Math.abs(forward.impliedYoYPercent - 96.93654266958424) < 1e-12, 'forward implied YoY changed')
  assert(forward.signalType === 'CAPEX_FORWARD_IMPLIED_YOY_GROWTH', 'wrong forward signal semantic')
  assert(
    !revisions.some((revision) => revision.period === '2026'),
    'forward implied growth was emitted as a guidance revision'
  )

  const deterministicIds = [...revisions.map((revision) => revision.id), forward.id]
  assert(
    JSON.stringify(deterministicIds) ===
      JSON.stringify([...repeatedRevisions.map((revision) => revision.id), repeatedForward.id]),
    'deterministic IDs changed with generatedAt'
  )

  const quarterlyActuals = normalized.filter((observation) => observation.kind === 'QUARTERLY_ACTUAL')
  const missingQuarterlyObservationsNotInvented =
    quarterlyActuals.length === 2 &&
    quarterlyActuals.every((observation) => ['2025-Q1', '2025-Q2'].includes(observation.targetPeriod))
  assert(missingQuarterlyObservationsNotInvented, 'missing quarters were invented')

  const incompatibleDefinitionsNotCompared =
    deriveCompanyCapexGuidanceRevisionChain(
      normalized,
      { ...GOOG_CAPEX_PROFILE, capexDefinitionIds: [MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id] },
      MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
      firstTime
    ).length === 0
  assert(incompatibleDefinitionsNotCompared, 'incompatible definition was compared')

  const metaParity = verifyMetaCompanyCapexParity().crossCompanyEvidenceCount === 13
  const msft = verifyMsftCapexYoYTrends()
  const msftParity =
    msft.latestSpendingDirection === 'POSITIVE' &&
    msft.latestGrowthRateTrend === 'DECELERATING'
  assert(metaParity, 'META parity failed')
  assert(msftParity, 'MSFT parity failed')

  const crossCompany = deriveCrossCompanySignals(
    META_CAPEX_OBSERVATIONS,
    TSM_METRIC_OBSERVATIONS,
    firstTime
  )[0]
  const crossCompanyUnchanged =
    crossCompany?.direction === 'POSITIVE' &&
    crossCompany.confidence === 'HIGH' &&
    crossCompany.evidenceObservationIds.length === 13
  assert(crossCompanyUnchanged, 'META x TSMC cross-company signal changed')

  return {
    guidanceRevisionPercents: revisions.map((revision) => revision.revisionPercent),
    forwardGuidanceMidpoint: forward.guidanceMidpoint,
    priorActualValue: forward.priorActualValue,
    forwardImpliedYoYPercent: forward.impliedYoYPercent,
    approximationPreserved: revisions.every((revision) => revision.approximate),
    missingQuarterlyObservationsNotInvented,
    incompatibleDefinitionsNotCompared,
    deterministicIds,
    metaParity,
    msftParity,
    crossCompanyUnchanged,
  }
}
