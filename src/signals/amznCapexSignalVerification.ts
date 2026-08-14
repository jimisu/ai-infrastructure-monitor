import {
  AMZN_2026_CAPEX_OUTLOOK_DEFINITION,
  AMZN_FINANCE_LEASE_ACQUIRED_PP_AND_E_DEFINITION,
  AMZN_OPERATING_LEASE_ASSETS_DEFINITION,
  AMZN_PP_AND_E_NOT_YET_PAID_DEFINITION,
  AMZN_PP_AND_E_PURCHASES_DEFINITION,
  AMZN_PP_AND_E_SALES_INCENTIVES_DEFINITION,
} from '../config/capexDefinitionRegistry'
import { AMZN_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { AMZN_CAPEX_COMMENTARY, AMZN_CAPEX_OBSERVATIONS } from '../data/amznCapexMetrics'
import { getSourceById } from '../data/sources'
import {
  deriveCompanyCapexForwardImpliedYoYGrowth,
  deriveCompanyCapexTtmYoYActualTrends,
  normalizeCapexObservations,
} from './companyCapexSignalEngine'
import { verifyGoogCapexSignals } from './googCapexSignalVerification'
import { deriveCurrentHyperscalerCapexTrend } from './hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from './hyperscalerTsmConfirmationEngine'
import { TSM_METRIC_OBSERVATIONS } from '../data/tsmMetrics'

export interface AmznCapexVerificationResult {
  ttmYoYPercent: number
  spendingDirection: string
  outlookApproximate: boolean
  forwardImpliedGrowthUnavailable: boolean
  incompatibleSeriesExcluded: boolean
  deterministicId: string
  aggregateCoverage: number
  aggregateConfidence: string
  aggregateEvidenceCount: number
  crossConfidence: string
  crossEvidenceCount: number
  regressionsPassed: boolean
}

const definitions = [
  AMZN_PP_AND_E_PURCHASES_DEFINITION,
  AMZN_PP_AND_E_SALES_INCENTIVES_DEFINITION,
  AMZN_FINANCE_LEASE_ACQUIRED_PP_AND_E_DEFINITION,
  AMZN_PP_AND_E_NOT_YET_PAID_DEFINITION,
  AMZN_OPERATING_LEASE_ASSETS_DEFINITION,
  AMZN_2026_CAPEX_OUTLOOK_DEFINITION,
]

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`AMZN CapEx verification failed: ${message}`)
}

export function verifyAmznCapexSignals(): AmznCapexVerificationResult {
  const normalized = normalizeCapexObservations(
    AMZN_CAPEX_OBSERVATIONS,
    AMZN_CAPEX_PROFILE,
    definitions
  )
  assert(normalized.length === AMZN_CAPEX_OBSERVATIONS.length, 'observations failed normalization')
  assert(
    AMZN_CAPEX_OBSERVATIONS.every(
      (observation) => getSourceById(observation.sourceId)?.tier === 'TIER_1_OFFICIAL'
    ),
    'non-Tier-1 source found'
  )

  const first = deriveCompanyCapexTtmYoYActualTrends(
    normalized,
    AMZN_CAPEX_PROFILE,
    AMZN_PP_AND_E_PURCHASES_DEFINITION.id,
    () => '2026-08-14T00:00:00.000Z'
  )
  const second = deriveCompanyCapexTtmYoYActualTrends(
    normalized,
    AMZN_CAPEX_PROFILE,
    AMZN_PP_AND_E_PURCHASES_DEFINITION.id,
    () => '2030-01-01T00:00:00.000Z'
  )
  assert(first.length === 1, 'expected one comparable primary TTM result')
  const expected = ((151.003 - 93.093) / 93.093) * 100
  assert(Math.abs(first[0].yoyPercent - expected) < 1e-12, 'TTM YoY calculation changed')
  assert(first[0].spendingDirection === 'POSITIVE', 'TTM direction is not positive')
  assert(first[0].id === second[0].id, 'deterministic ID changed with generatedAt')

  const outlook = normalized.find(
    (observation) =>
      observation.kind === 'GUIDANCE_POINT' &&
      observation.capexDefinitionId === AMZN_2026_CAPEX_OUTLOOK_DEFINITION.id
  )
  assert(outlook?.value === 200 && outlook.approximate, 'outlook lost approximate-point status')

  const primaryForward = deriveCompanyCapexForwardImpliedYoYGrowth(
    normalized,
    AMZN_CAPEX_PROFILE,
    AMZN_PP_AND_E_PURCHASES_DEFINITION.id
  )
  const outlookForward = deriveCompanyCapexForwardImpliedYoYGrowth(
    normalized,
    AMZN_CAPEX_PROFILE,
    AMZN_2026_CAPEX_OUTLOOK_DEFINITION.id
  )
  const forwardImpliedGrowthUnavailable = primaryForward === null && outlookForward === null
  assert(forwardImpliedGrowthUnavailable, 'fabricated forward implied growth was produced')

  const incompatibleSeriesExcluded = first[0].evidenceObservationIds.every((id) =>
    id.includes('purchases-of-property-and-equipment')
  )
  assert(incompatibleSeriesExcluded, 'incompatible Amazon series entered primary TTM evidence')

  assert(
    AMZN_CAPEX_COMMENTARY.some((item) => item.text.includes('primarily reflects investments in artificial intelligence')),
    'AI attribution commentary missing'
  )
  assert(
    AMZN_CAPEX_COMMENTARY.every((item) => !item.text.includes('all Amazon CapEx is AI')),
    'total CapEx was relabeled as AI CapEx'
  )

  const regressions = verifyGoogCapexSignals()
  const regressionsPassed =
    regressions.metaParity && regressions.msftParity && regressions.crossCompanyUnchanged
  assert(regressionsPassed, 'META/MSFT/GOOG regression failed')

  const aggregate = deriveCurrentHyperscalerCapexTrend(
    () => '2026-08-14T00:00:00.000Z'
  )
  assert(aggregate !== null, 'hyperscaler aggregate unavailable')
  assert(aggregate.eligibleCount === 4 && aggregate.coverage === 100, 'coverage is not 4/4')
  assert(aggregate.positiveCount === 4 && aggregate.positiveBreadth === 100, 'breadth is not 4/4')
  assert(aggregate.direction === 'POSITIVE', 'aggregate direction changed')
  assert(aggregate.confidence === 'HIGH', 'existing breadth rules did not produce HIGH')
  assert(aggregate.unavailableCompanies.length === 0, 'AMZN remains unavailable')
  assert(
    new Set(aggregate.evidenceObservationIds).size === aggregate.evidenceObservationIds.length,
    'aggregate evidence is not deduplicated'
  )

  const cross = deriveHyperscalerTsmConfirmation(
    aggregate,
    TSM_METRIC_OBSERVATIONS,
    () => '2026-08-14T00:00:00.000Z'
  )
  assert(cross !== null, 'hyperscaler x TSMC confirmation unavailable')
  assert(cross.direction === 'POSITIVE' && cross.alignment === 'CONFIRMED', 'cross result changed')
  assert(cross.confidence === 'HIGH', 'confidence cap did not naturally produce HIGH')
  assert(
    new Set(cross.evidenceObservationIds).size === cross.evidenceObservationIds.length,
    'cross evidence is not deduplicated'
  )

  return {
    ttmYoYPercent: first[0].yoyPercent,
    spendingDirection: first[0].spendingDirection,
    outlookApproximate: outlook.approximate,
    forwardImpliedGrowthUnavailable,
    incompatibleSeriesExcluded,
    deterministicId: first[0].id,
    aggregateCoverage: aggregate.coverage,
    aggregateConfidence: aggregate.confidence,
    aggregateEvidenceCount: aggregate.evidenceObservationIds.length,
    crossConfidence: cross.confidence,
    crossEvidenceCount: cross.evidenceObservationIds.length,
    regressionsPassed,
  }
}
