import type { MetricObservation } from '../types/metric'
import type { DerivedSignal } from '../types/derivedSignal'
import type { CapexGuidanceRevision, CapexQoQGrowth } from '../types/capex'
import { META_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { META_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import {
  deriveCompanyCapexGuidanceRevision,
  deriveCompanyCapexQoQGrowthRates,
  deriveCompanyCapexSignals,
  normalizeCapexObservations,
} from './companyCapexSignalEngine'
import { systemGeneratedAt, type GeneratedAtProvider } from './derivedSignalIdentity'

/**
 * Compatibility wrapper for existing META consumers.
 * All normalization and calculation is delegated to the generic company engine.
 */
export function deriveMetaCapexSignals(
  observations: MetricObservation[],
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): DerivedSignal[] {
  const normalized = normalizeCapexObservations(
    observations,
    META_CAPEX_PROFILE,
    META_CAPEX_DEFINITION
  )
  return deriveCompanyCapexSignals(normalized, META_CAPEX_PROFILE, generatedAt)
}

export function deriveCapexQoQGrowthRates(observations: MetricObservation[]): CapexQoQGrowth[] {
  return deriveCompanyCapexQoQGrowthRates(
    normalizeCapexObservations(observations, META_CAPEX_PROFILE, META_CAPEX_DEFINITION)
  )
}

export function deriveCapexGuidanceRevision(
  observations: MetricObservation[]
): CapexGuidanceRevision | null {
  return deriveCompanyCapexGuidanceRevision(
    normalizeCapexObservations(observations, META_CAPEX_PROFILE, META_CAPEX_DEFINITION),
    META_CAPEX_PROFILE.companyTicker
  )
}

export type { CapexGuidanceRevision, CapexQoQGrowth }
