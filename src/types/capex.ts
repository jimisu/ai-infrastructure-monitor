import type { MetricObservation } from './metric'

export type CapexObservationKind =
  | 'ANNUAL_GUIDANCE_LOW'
  | 'ANNUAL_GUIDANCE_HIGH'
  | 'GUIDANCE_POINT'
  | 'GUIDANCE_LOWER_BOUND'
  | 'QUARTERLY_ACTUAL'

export interface CapexDefinition {
  id: string
  companyTicker: string
  officialDefinition: string
  basis: 'MANAGEMENT_REPORTED_TOTAL_CAPEX' | 'CASH_PAID_FOR_PROPERTY_AND_EQUIPMENT'
  financeLeaseTreatment: 'INCLUDED' | 'EXCLUDED_FROM_CASH_MEASURE'
  scope: 'CONSOLIDATED_TOTAL'
  sourceIds: string[]
}

export interface CompanyCapexProfile {
  companyTicker: string
  defaultCapexDefinitionId: string
  capexDefinitionIds: string[]
  currencyUnit: string
  fiscalYearEndMonth: number
}

export interface NormalizedCapexObservation {
  id: string
  companyTicker: string
  kind: CapexObservationKind
  value: number
  unit: string
  targetPeriod: string
  targetPeriodType: 'YEAR' | 'QUARTER'
  guidanceAsOfPeriod?: string
  capexDefinitionId: string
  approximate: boolean
  publishedAt: string
  retrievedAt: string
  sourceId: string
  sourceUrl: string
  sourceObservation: MetricObservation
}

export interface CapexQoQGrowth {
  period: string
  capexDefinitionId: string
  value: number
  qoqPercent: number
  previousValue: number
  previousPeriod: string
  evidenceIds: string[]
}

export interface CapexGuidanceRevision {
  period: string
  initialMidpoint: number
  currentMidpoint: number
  revisionPercent: number
  trend: 'UPWARD' | 'DOWNWARD' | 'NEUTRAL'
  evidenceIds: string[]
  description: string
}

export interface CapexCommentaryObservation {
  id: string
  companyTicker: string
  period: string
  text: string
  classification: 'AI_AND_CLOUD_INFRASTRUCTURE_CONTEXT'
  sourceId: string
  sourceUrl: string
  publishedAt: string
  retrievedAt: string
}

export interface CompanyCapexYoYActualTrendSignal {
  id: string
  signalType: 'CAPEX_YOY_ACTUAL_TREND'
  companyTicker: string
  capexDefinitionId: string
  period: string
  currentValue: number
  priorYearValue: number
  yoyPercent: number
  spendingDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  growthRateTrend: 'ACCELERATING' | 'DECELERATING' | 'STABLE'
  priorYoYPercent: number | null
  generatedAt: string
  evidenceObservationIds: string[]
  description: string
}
