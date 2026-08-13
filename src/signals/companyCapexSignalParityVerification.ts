import { META_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { META_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import { META_CAPEX_OBSERVATIONS } from '../data/metaCapexMetrics'
import { TSM_METRIC_OBSERVATIONS } from '../data/tsmMetrics'
import {
  deriveCompanyCapexSignals,
  normalizeCapexObservations,
} from './companyCapexSignalEngine'
import { deriveCrossCompanySignals } from './crossCompanySignalInterpreter'
import { deriveMetaCapexSignals } from './metaCapexSignalInterpreter'

export interface CompanyCapexParityResult {
  guidanceRevisionPercent: number
  qoqGrowthPercent: number
  signalIds: string[]
  evidenceIds: string[][]
  crossCompanySignalId: string
  crossCompanyEvidenceCount: number
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Company CapEx parity verification failed: ${message}`)
}

export function verifyMetaCompanyCapexParity(): CompanyCapexParityResult {
  const generatedAt = () => '2026-08-13T00:00:00.000Z'
  const normalized = normalizeCapexObservations(
    META_CAPEX_OBSERVATIONS,
    META_CAPEX_PROFILE,
    META_CAPEX_DEFINITION
  )
  const genericSignals = deriveCompanyCapexSignals(normalized, META_CAPEX_PROFILE, generatedAt)
  const compatibilitySignals = deriveMetaCapexSignals(META_CAPEX_OBSERVATIONS, generatedAt)

  assert(
    JSON.stringify(genericSignals) === JSON.stringify(compatibilitySignals),
    'compatibility wrapper differs from generic engine'
  )

  const guidance = genericSignals.find(
    (signal) => signal.signalType === 'CAPEX_GUIDANCE_REVISION_UP'
  )
  const qoq = genericSignals.find((signal) => signal.signalType === 'CAPEX_QOQ_ACCELERATION')
  assert(guidance !== undefined, 'guidance revision signal missing')
  assert(qoq !== undefined, 'QoQ signal missing')
  assert(Math.abs(guidance.magnitude - 1.8518518518518516) < 1e-12, 'guidance magnitude changed')
  assert(Math.abs(qoq.magnitude - 56.653225806451616) < 1e-12, 'QoQ magnitude changed')
  assert(
    JSON.stringify(guidance.evidenceObservationIds) === JSON.stringify([
      'meta-2026-q1-capex-guidance-low',
      'meta-2026-q1-capex-guidance-high',
      'meta-2026-q2-capex-guidance-low',
      'meta-2026-q2-capex-guidance-high',
    ]),
    'guidance evidence changed'
  )
  assert(
    JSON.stringify(qoq.evidenceObservationIds) === JSON.stringify([
      'meta-2026-q1-capex-actual',
      'meta-2026-q2-capex-actual',
    ]),
    'QoQ evidence changed'
  )

  const crossCompanySignal = deriveCrossCompanySignals(
    META_CAPEX_OBSERVATIONS,
    TSM_METRIC_OBSERVATIONS,
    generatedAt
  )[0]
  assert(crossCompanySignal !== undefined, 'cross-company signal no longer emitted')
  assert(crossCompanySignal.direction === 'POSITIVE', 'cross-company direction changed')
  assert(crossCompanySignal.confidence === 'HIGH', 'cross-company confidence changed')
  assert(crossCompanySignal.evidenceObservationIds.length === 13, 'cross-company evidence changed')
  assert(
    crossCompanySignal.underlyingDerivedSignalIds.includes(guidance.id),
    'cross-company signal no longer references generic Meta signal'
  )

  return {
    guidanceRevisionPercent: guidance.magnitude,
    qoqGrowthPercent: qoq.magnitude,
    signalIds: genericSignals.map((signal) => signal.id),
    evidenceIds: genericSignals.map((signal) => signal.evidenceObservationIds),
    crossCompanySignalId: crossCompanySignal.id,
    crossCompanyEvidenceCount: crossCompanySignal.evidenceObservationIds.length,
  }
}
