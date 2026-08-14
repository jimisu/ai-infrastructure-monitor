import { TSM_METRIC_OBSERVATIONS } from '../data/tsmMetrics'
import { deriveCurrentHyperscalerCapexTrend } from './hyperscalerCapexBreadthEngine'
import { verifyHyperscalerCapexBreadth } from './hyperscalerCapexBreadthVerification'
import { deriveHyperscalerTsmConfirmation } from './hyperscalerTsmConfirmationEngine'

export interface HyperscalerTsmConfirmationVerificationResult {
  direction: string
  alignment: string
  confidence: string
  demandConfidence: string
  supplyConfidence: string
  evidenceCount: number
  participatingCompanies: string[]
  unavailableCompanies: string[]
  aggregateEvidenceIncluded: boolean
  evidenceDeduplicated: boolean
  deterministicId: string
  regressionsPassed: boolean
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Hyperscaler x TSMC verification failed: ${message}`)
}

export function verifyHyperscalerTsmConfirmation(): HyperscalerTsmConfirmationVerificationResult {
  const demandFirst = deriveCurrentHyperscalerCapexTrend(
    () => '2026-08-13T00:00:00.000Z'
  )
  const demandSecond = deriveCurrentHyperscalerCapexTrend(
    () => '2030-01-01T00:00:00.000Z'
  )
  const first = deriveHyperscalerTsmConfirmation(
    demandFirst,
    TSM_METRIC_OBSERVATIONS,
    () => '2026-08-13T00:00:00.000Z'
  )
  const second = deriveHyperscalerTsmConfirmation(
    demandSecond,
    TSM_METRIC_OBSERVATIONS,
    () => '2030-01-01T00:00:00.000Z'
  )

  assert(demandFirst !== null && first !== null && second !== null, 'confirmation unavailable')
  assert(first.demandInput.direction === 'POSITIVE', 'demand direction changed')
  assert(first.demandInput.confidence === 'HIGH', 'demand confidence changed')
  assert(first.demandInput.coverage === 100, 'demand coverage changed')
  assert(first.supplyInput.direction === 'POSITIVE', 'supply direction changed')
  assert(first.supplyInput.confidence === 'HIGH', 'supply confidence changed')
  assert(first.direction === 'POSITIVE', 'confirmation direction changed')
  assert(first.alignment === 'CONFIRMED', 'alignment changed')
  assert(first.confidence === 'HIGH', 'confidence cap did not preserve aligned HIGH inputs')
  assert(first.id === second.id, 'stable ID changed with generatedAt')
  assert(first.demandInput.hyperscalerAggregateId === demandFirst.id, 'aggregate ID not preserved')
  assert(first.tsmUnderlyingSignalIds.length > 0, 'TSMC signal IDs missing')
  assert(first.unavailableCompanies.length === 0, 'validated AMZN remains unavailable')
  assert(first.participatingCompanies.includes('AMZN'), 'AMZN is not participating')

  const aggregateEvidenceIncluded = demandFirst.evidenceObservationIds.every(
    (id) => first.evidenceObservationIds.includes(id)
  )
  const evidenceDeduplicated =
    new Set(first.evidenceObservationIds).size === first.evidenceObservationIds.length
  assert(aggregateEvidenceIncluded, 'aggregate demand evidence missing')
  assert(evidenceDeduplicated, 'evidence IDs are not deduplicated')

  const breadthRegression = verifyHyperscalerCapexBreadth()
  const regressionsPassed =
    breadthRegression.regressionStatus && breadthRegression.crossCompanyUnchanged
  assert(regressionsPassed, 'company-engine regression failed')

  return {
    direction: first.direction,
    alignment: first.alignment,
    confidence: first.confidence,
    demandConfidence: first.demandInput.confidence,
    supplyConfidence: first.supplyInput.confidence,
    evidenceCount: first.evidenceObservationIds.length,
    participatingCompanies: first.participatingCompanies,
    unavailableCompanies: first.unavailableCompanies,
    aggregateEvidenceIncluded,
    evidenceDeduplicated,
    deterministicId: first.id,
    regressionsPassed,
  }
}
