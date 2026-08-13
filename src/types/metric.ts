/**
 * Metric Observation Type
 *
 * Represents a single factual observation.
 * MUST contain FACTS ONLY — no interpretation, scoring, or recommendations.
 * Every observation is immutable and traceable to its source.
 */

export type MetricName =
  | 'MONTHLY_REVENUE'
  | 'MONTHLY_REVENUE_YOY_PERCENT'
  | 'MONTHLY_REVENUE_MOM_PERCENT'
  | 'QUARTERLY_REVENUE'
  | 'HPC_REVENUE'
  | 'GROSS_MARGIN'
  | 'OPERATING_MARGIN'
  | 'REVENUE_GUIDANCE_LOW'
  | 'REVENUE_GUIDANCE_HIGH'
  | 'CAPEX_GUIDANCE_LOW'
  | 'CAPEX_GUIDANCE_HIGH'
  | 'CAPEX_GUIDANCE_POINT'
  | 'CAPEX_GUIDANCE_LOWER_BOUND'
  | 'CAPEX_ACTUAL'

export type PeriodType = 'MONTH' | 'QUARTER' | 'YEAR' | 'POINT_IN_TIME'

export interface MetricObservation {
  id: string
  companyTicker: string
  metric: MetricName
  value: number
  unit: string
  period: string // e.g. "2026-Q2", "2026-08", "2026"
  periodType: PeriodType
  guidanceAsOfPeriod?: string // Reporting period when annual guidance was issued, e.g. "2026-Q2"
  capexDefinitionId?: string
  approximate?: boolean
  publishedAt: string // ISO 8601 date
  retrievedAt: string // ISO 8601 date when we captured this
  sourceId: string
  sourceUrl: string
}
