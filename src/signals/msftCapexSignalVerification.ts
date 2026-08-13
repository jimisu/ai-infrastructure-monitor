import {
  MSFT_CASH_PAID_PP_AND_E_DEFINITION,
  MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION,
} from '../config/capexDefinitionRegistry'
import { MSFT_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { META_CAPEX_OBSERVATIONS } from '../data/metaCapexMetrics'
import { MSFT_CAPEX_OBSERVATIONS } from '../data/msftCapexMetrics'
import { getSourceById } from '../data/sources'
import { TSM_METRIC_OBSERVATIONS } from '../data/tsmMetrics'
import {
  deriveCompanyCapexQoQGrowthRates,
  deriveCompanyCapexSignals,
  normalizeCapexObservations,
} from './companyCapexSignalEngine'
import { verifyMetaCompanyCapexParity } from './companyCapexSignalParityVerification'
import { deriveCrossCompanySignals } from './crossCompanySignalInterpreter'

export interface MsftCapexVerificationResult {
  managementGrowthRates: number[]
  latestManagementDirection: string
  lowerBoundDidNotProduceRevision: boolean
  incompatibleDefinitionsNotCompared: boolean
  deterministicIds: string[]
  metaParity: boolean
  crossCompanyUnchanged: boolean
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`MSFT CapEx verification failed: ${message}`)
}

export function verifyMsftCapexSignals(): MsftCapexVerificationResult {
  const definitions = [
    MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION,
    MSFT_CASH_PAID_PP_AND_E_DEFINITION,
  ]
  const normalized = normalizeCapexObservations(
    MSFT_CAPEX_OBSERVATIONS,
    MSFT_CAPEX_PROFILE,
    definitions
  )
  assert(normalized.length === MSFT_CAPEX_OBSERVATIONS.length, 'observations failed normalization')
  assert(
    MSFT_CAPEX_OBSERVATIONS.every(
      (observation) => getSourceById(observation.sourceId)?.tier === 'TIER_1_OFFICIAL'
    ),
    'non-Tier-1 source found'
  )

  const rates = deriveCompanyCapexQoQGrowthRates(normalized)
  const managementRates = rates.filter(
    (rate) => rate.capexDefinitionId === MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id && ['MSFT-FY2026-Q2', 'MSFT-FY2026-Q3'].includes(rate.period)
  )
  assert(managementRates.length === 2, 'expected two management-total sequential rates')
  assert(Math.abs(managementRates[0].qoqPercent - 7.449856733524361) < 1e-12, 'Q1-Q2 changed')
  assert(Math.abs(managementRates[1].qoqPercent - -14.933333333333334) < 1e-12, 'Q2-Q3 changed')

  const firstTime = () => '2026-08-13T00:00:00.000Z'
  const secondTime = () => '2030-01-01T00:00:00.000Z'
  const firstSignals = deriveCompanyCapexSignals(normalized, MSFT_CAPEX_PROFILE, firstTime)
  const secondSignals = deriveCompanyCapexSignals(normalized, MSFT_CAPEX_PROFILE, secondTime)
  assert(
    JSON.stringify(firstSignals.map((signal) => signal.id)) ===
      JSON.stringify(secondSignals.map((signal) => signal.id)),
    'deterministic IDs changed with generatedAt'
  )

  const latestManagementSignal = firstSignals
    .filter(
      (signal) => signal.capexDefinitionId === MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id
    )
    .at(-1)
  assert(latestManagementSignal?.period === 'MSFT-FY2026-Q3', 'latest fiscal period is incorrect')
  assert(latestManagementSignal.direction === 'NEGATIVE', 'latest direction is not Q2-Q3')

  const lowerBound = normalized.find((observation) => observation.kind === 'GUIDANCE_LOWER_BOUND')
  const approximatePoint = normalized.find((observation) => observation.kind === 'GUIDANCE_POINT')
  assert(lowerBound !== undefined, 'Q4 lower bound was not normalized')
  assert(approximatePoint?.approximate === true, 'calendar guidance lost approximate status')
  const lowerBoundDidNotProduceRevision = firstSignals.every(
    (signal) =>
      signal.signalType !== 'CAPEX_GUIDANCE_REVISION_UP' &&
      signal.signalType !== 'CAPEX_GUIDANCE_REVISION_DOWN'
  )
  assert(lowerBoundDidNotProduceRevision, 'lower-bound or point guidance produced a midpoint revision')

  const incompatiblePair = normalized.filter((observation) =>
    ['msft-fy2026-q1-management-total-capex', 'msft-fy2026-q2-cash-paid-pp-and-e'].includes(
      observation.id
    )
  )
  const incompatibleDefinitionsNotCompared =
    deriveCompanyCapexQoQGrowthRates(incompatiblePair).length === 0
  assert(incompatibleDefinitionsNotCompared, 'incompatible definitions were compared')

  const metaParity = verifyMetaCompanyCapexParity().crossCompanyEvidenceCount === 13
  assert(metaParity, 'Meta parity failed')
  const crossCompany = deriveCrossCompanySignals(
    META_CAPEX_OBSERVATIONS,
    TSM_METRIC_OBSERVATIONS,
    firstTime
  )[0]
  const crossCompanyUnchanged =
    crossCompany?.direction === 'POSITIVE' &&
    crossCompany.confidence === 'HIGH' &&
    crossCompany.evidenceObservationIds.length === 13
  assert(crossCompanyUnchanged, 'existing cross-company signal changed')

  return {
    managementGrowthRates: managementRates.map((rate) => rate.qoqPercent),
    latestManagementDirection: latestManagementSignal.direction,
    lowerBoundDidNotProduceRevision,
    incompatibleDefinitionsNotCompared,
    deterministicIds: firstSignals.map((signal) => signal.id),
    metaParity,
    crossCompanyUnchanged,
  }
}
