export type CrossCompanySignalType = 'AI_INFRASTRUCTURE_DEMAND_CONFIRMATION'

export interface CrossCompanySignal {
  id: string
  signalType: CrossCompanySignalType
  direction: 'POSITIVE'
  confidence: 'HIGH'
  participatingCompanies: string[]
  underlyingDerivedSignalIds: string[]
  evidenceObservationIds: string[]
  period: {
    metaTargetPeriod: string
    metaGuidanceAsOfPeriod: string
    tsmHistoricalPeriod: string
    tsmForwardPeriod: string
  }
  generatedAt: string
  description: string
}
