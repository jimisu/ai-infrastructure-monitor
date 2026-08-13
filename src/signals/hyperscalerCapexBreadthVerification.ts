import { verifyGoogCapexSignals } from './googCapexSignalVerification'
import {
  deriveCurrentHyperscalerCapexTrend,
  deriveHyperscalerCapexTrend,
} from './hyperscalerCapexBreadthEngine'

export interface HyperscalerCapexBreadthVerificationResult {
  direction: string
  confidence: string
  eligibleCount: number
  positiveCount: number
  neutralCount: number
  coverage: number
  positiveBreadth: number
  unavailableCompanies: string[]
  deterministicId: string
  regressionStatus: boolean
  crossCompanyUnchanged: boolean
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Hyperscaler CapEx breadth verification failed: ${message}`)
}

export function verifyHyperscalerCapexBreadth(): HyperscalerCapexBreadthVerificationResult {
  const first = deriveCurrentHyperscalerCapexTrend(
    () => '2026-08-13T00:00:00.000Z'
  )
  const second = deriveCurrentHyperscalerCapexTrend(
    () => '2030-01-01T00:00:00.000Z'
  )
  assert(first !== null && second !== null, 'current aggregate was not produced')
  assert(first.id === second.id, 'stable ID changed with generatedAt')
  assert(first.direction === 'POSITIVE', '3/3 positive did not produce POSITIVE')
  assert(first.eligibleCount === 3, 'eligible count changed')
  assert(first.positiveCount === 3, 'positive count changed')
  assert(first.neutralCount === 0, 'AMZN was counted as neutral')
  assert(first.unavailableCompanies.length === 1, 'unexpected unavailable-company count')
  assert(first.unavailableCompanies[0] === 'AMZN', 'AMZN is not unavailable')
  assert(first.coverage === 75, 'coverage is not 75%')
  assert(first.positiveBreadth === 100, 'positive breadth is not 100%')
  assert(first.confidence === 'MEDIUM', 'incomplete coverage did not prevent HIGH confidence')
  assert(first.participatingCompanies.every((company) => company.direction === 'POSITIVE'), 'eligible company direction changed')

  const tooFew = deriveHyperscalerCapexTrend([
    {
      companyTicker: 'META',
      availability: 'POSITIVE',
      primarySignalId: 'meta-signal',
      evidenceObservationIds: ['meta-observation'],
      asOfPeriod: '2026-Q2',
      latestEvidencePublishedAt: '2026-07-30T00:00:00.000Z',
      tier1Evidence: true,
      comparabilityValid: true,
    },
    { companyTicker: 'MSFT', availability: 'UNAVAILABLE', tier1Evidence: false, comparabilityValid: false },
    { companyTicker: 'GOOG', availability: 'UNAVAILABLE', tier1Evidence: false, comparabilityValid: false },
    { companyTicker: 'AMZN', availability: 'UNAVAILABLE', tier1Evidence: false, comparabilityValid: false },
  ])
  assert(tooFew === null, 'aggregate direction emitted with fewer than two eligible companies')

  const regressions = verifyGoogCapexSignals()
  const regressionStatus = regressions.metaParity && regressions.msftParity
  assert(regressionStatus, 'META/MSFT/GOOG regression failed')
  assert(regressions.crossCompanyUnchanged, 'META x TSMC signal changed')

  return {
    direction: first.direction,
    confidence: first.confidence,
    eligibleCount: first.eligibleCount,
    positiveCount: first.positiveCount,
    neutralCount: first.neutralCount,
    coverage: first.coverage,
    positiveBreadth: first.positiveBreadth,
    unavailableCompanies: first.unavailableCompanies,
    deterministicId: first.id,
    regressionStatus,
    crossCompanyUnchanged: regressions.crossCompanyUnchanged,
  }
}
