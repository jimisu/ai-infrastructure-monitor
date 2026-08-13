import type { Confidence, Direction } from './derivedSignal'

export type HyperscalerTicker = 'META' | 'MSFT' | 'GOOG' | 'AMZN'
export type CompanyCapexAvailability = Direction | 'UNAVAILABLE'

export interface HyperscalerCompanyCapexInput {
  companyTicker: HyperscalerTicker
  availability: CompanyCapexAvailability
  primarySignalId?: string
  supportingSignalIds?: string[]
  evidenceObservationIds?: string[]
  asOfPeriod?: string
  latestEvidencePublishedAt?: string
  tier1Evidence: boolean
  comparabilityValid: boolean
}

export interface HyperscalerCompanyParticipation {
  companyTicker: HyperscalerTicker
  direction: Direction
  primarySignalId: string
  supportingSignalIds: string[]
  asOfPeriod: string
}

export interface HyperscalerCapexTrend {
  id: string
  signalType: 'HYPERSCALER_CAPEX_TREND'
  participatingCompanies: HyperscalerCompanyParticipation[]
  unavailableCompanies: HyperscalerTicker[]
  positiveCount: number
  negativeCount: number
  neutralCount: number
  eligibleCount: number
  totalUniverseCount: number
  positiveBreadth: number
  coverage: number
  direction: Direction
  confidence: Confidence
  underlyingCompanySignalIds: string[]
  evidenceObservationIds: string[]
  asOf: {
    companyPeriods: Partial<Record<HyperscalerTicker, string>>
    latestEvidencePublishedAt: string
  }
  generatedAt: string
}
