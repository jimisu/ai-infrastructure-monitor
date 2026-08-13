import type { MetricObservation } from './metric'

export type CapexObservationKind =
  | 'ANNUAL_GUIDANCE_LOW'
  | 'ANNUAL_GUIDANCE_HIGH'
  | 'QUARTERLY_ACTUAL'

export interface CapexDefinition {
  id: string
  companyTicker: string
  officialDefinition: string
  basis: 'CAPITAL_EXPENDITURES'
  includesFinanceLeasePrincipal: boolean
  scope: 'CONSOLIDATED_TOTAL'
  sourceIds: string[]
}

export interface CompanyCapexProfile {
  companyTicker: string
  capexDefinitionId: string
  currencyUnit: string
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
  publishedAt: string
  retrievedAt: string
  sourceId: string
  sourceUrl: string
  sourceObservation: MetricObservation
}

export interface CapexQoQGrowth {
  period: string
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
