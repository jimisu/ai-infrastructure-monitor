import type { Confidence, Direction } from './derivedSignal'
import type { HyperscalerTicker } from './hyperscalerCapexTrend'

export interface HyperscalerTsmConfirmation {
  id: string
  signalType: 'AI_INFRASTRUCTURE_DEMAND_CONFIRMATION'
  direction: Direction
  alignment: 'CONFIRMED'
  confidence: Confidence
  demandInput: {
    hyperscalerAggregateId: string
    direction: Direction
    confidence: Confidence
    coverage: number
    eligibleCount: number
    totalUniverseCount: number
  }
  supplyInput: {
    companyTicker: 'TSM'
    direction: Direction
    confidence: Confidence
    historicalPeriod: string
    forwardPeriod: string
  }
  participatingCompanies: Array<HyperscalerTicker | 'TSM'>
  unavailableCompanies: HyperscalerTicker[]
  underlyingSignalIds: string[]
  tsmUnderlyingSignalIds: string[]
  evidenceObservationIds: string[]
  asOf: {
    hyperscalerCompanyPeriods: Partial<Record<HyperscalerTicker, string>>
    hyperscalerLatestEvidencePublishedAt: string
    tsmHistoricalPeriod: string
    tsmForwardPeriod: string
  }
  generatedAt: string
  description: string
}
