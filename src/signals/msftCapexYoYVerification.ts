import { MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import { MSFT_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { MSFT_CAPEX_OBSERVATIONS } from '../data/msftCapexMetrics'
import {
  deriveCompanyCapexSignals,
  deriveCompanyCapexYoYActualTrends,
  normalizeCapexObservations,
} from './companyCapexSignalEngine'
import { verifyMsftCapexSignals } from './msftCapexSignalVerification'

export interface MsftCapexYoYVerificationResult {
  yoyGrowthRates: number[]
  latestSpendingDirection: string
  latestGrowthRateTrend: string
  qoqDidNotOverrideYoYDirection: boolean
  incompatiblePpAndEExcluded: boolean
  deterministicIds: string[]
  metaParity: boolean
  crossCompanyUnchanged: boolean
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`MSFT CapEx YoY verification failed: ${message}`)
}

export function verifyMsftCapexYoYTrends(): MsftCapexYoYVerificationResult {
  const phaseTwo = verifyMsftCapexSignals()
  const managementOnly = normalizeCapexObservations(
    MSFT_CAPEX_OBSERVATIONS,
    { ...MSFT_CAPEX_PROFILE, capexDefinitionIds: [MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id] },
    [MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION]
  )
  const firstTime = () => '2026-08-13T00:00:00.000Z'
  const secondTime = () => '2030-01-01T00:00:00.000Z'
  const first = deriveCompanyCapexYoYActualTrends(
    managementOnly,
    MSFT_CAPEX_PROFILE,
    MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    firstTime
  ).filter((signal) => signal.period.startsWith('MSFT-FY2026'))
  const second = deriveCompanyCapexYoYActualTrends(
    managementOnly,
    MSFT_CAPEX_PROFILE,
    MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    secondTime
  ).filter((signal) => signal.period.startsWith('MSFT-FY2026'))

  assert(first.length === 3, 'expected three FY26 YoY signals')
  assert(Math.abs(first[0].yoyPercent - 74.5) < 1e-12, 'FY26 Q1 YoY changed')
  assert(Math.abs(first[1].yoyPercent - 65.929203539823) < 1e-12, 'FY26 Q2 YoY changed')
  assert(Math.abs(first[2].yoyPercent - 49.06542056074766) < 1e-12, 'FY26 Q3 YoY changed')
  assert(first.every((signal) => signal.spendingDirection === 'POSITIVE'), 'spending direction changed')
  assert(first[2].growthRateTrend === 'DECELERATING', 'latest growth trend is not decelerating')
  assert(
    JSON.stringify(first.map((signal) => signal.id)) === JSON.stringify(second.map((signal) => signal.id)),
    'deterministic IDs changed'
  )

  const qoqSignals = deriveCompanyCapexSignals(managementOnly, MSFT_CAPEX_PROFILE, firstTime)
  const latestQoq = qoqSignals.filter((signal) => signal.period === 'MSFT-FY2026-Q3').at(-1)
  const qoqDidNotOverrideYoYDirection =
    latestQoq?.magnitude === phaseTwo.managementGrowthRates[1] &&
    latestQoq.magnitude < 0 &&
    first[2].spendingDirection === 'POSITIVE'
  assert(qoqDidNotOverrideYoYDirection, 'negative QoQ overrode positive YoY spending direction')

  const incompatiblePpAndEExcluded = first.every((signal) =>
    signal.evidenceObservationIds.every((id) => !id.includes('cash-paid-pp-and-e'))
  )
  assert(incompatiblePpAndEExcluded, 'cash-paid PP&E entered management-total YoY evidence')

  return {
    yoyGrowthRates: first.map((signal) => signal.yoyPercent),
    latestSpendingDirection: first[2].spendingDirection,
    latestGrowthRateTrend: first[2].growthRateTrend,
    qoqDidNotOverrideYoYDirection,
    incompatiblePpAndEExcluded,
    deterministicIds: first.map((signal) => signal.id),
    metaParity: phaseTwo.metaParity,
    crossCompanyUnchanged: phaseTwo.crossCompanyUnchanged,
  }
}
