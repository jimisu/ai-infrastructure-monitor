import { META_CAPEX_OBSERVATIONS } from '../data/metaCapexMetrics'
import { TSM_METRIC_OBSERVATIONS } from '../data/tsmMetrics'
import { deriveCrossCompanySignals } from './crossCompanySignalInterpreter'

export interface CrossCompanySignalVerificationResult {
  signalId: string
  underlyingDerivedSignalIds: string[]
  evidenceCount: number
  missingMetaRejected: boolean
  missingTsmRejected: boolean
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Cross-company signal verification failed: ${message}`)
  }
}

export function verifyCrossCompanySignal(): CrossCompanySignalVerificationResult {
  const firstGeneratedAt = () => '2026-08-13T00:00:00.000Z'
  const secondGeneratedAt = () => '2030-01-01T00:00:00.000Z'
  const firstSignal = deriveCrossCompanySignals(
    META_CAPEX_OBSERVATIONS,
    TSM_METRIC_OBSERVATIONS,
    firstGeneratedAt
  )[0]
  const secondSignal = deriveCrossCompanySignals(
    META_CAPEX_OBSERVATIONS,
    TSM_METRIC_OBSERVATIONS,
    secondGeneratedAt
  )[0]

  assert(firstSignal !== undefined, 'current data did not produce a signal')
  assert(firstSignal.direction === 'POSITIVE', 'current signal was not POSITIVE')
  assert(firstSignal.confidence === 'HIGH', 'current signal was not HIGH confidence')
  assert(secondSignal !== undefined, 'second derivation did not produce a signal')
  assert(firstSignal.id === secondSignal.id, 'stable ID changed across identical inputs')
  assert(firstSignal.generatedAt !== secondSignal.generatedAt, 'generatedAt was not injectable')

  const missingMetaEvidence = META_CAPEX_OBSERVATIONS.filter(
    (observation) => observation.id !== 'meta-2026-q2-capex-guidance-low'
  )
  const missingMetaRejected =
    deriveCrossCompanySignals(missingMetaEvidence, TSM_METRIC_OBSERVATIONS).length === 0
  assert(missingMetaRejected, 'missing Meta evidence produced HIGH confirmation')

  const missingTsmConfirmation = TSM_METRIC_OBSERVATIONS.filter(
    (observation) => observation.period !== '2026-03'
  )
  const missingTsmRejected =
    deriveCrossCompanySignals(META_CAPEX_OBSERVATIONS, missingTsmConfirmation).length === 0
  assert(missingTsmRejected, 'missing TSMC confirmation produced HIGH confirmation')

  return {
    signalId: firstSignal.id,
    underlyingDerivedSignalIds: firstSignal.underlyingDerivedSignalIds,
    evidenceCount: firstSignal.evidenceObservationIds.length,
    missingMetaRejected,
    missingTsmRejected,
  }
}
