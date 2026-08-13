/**
 * Source Type
 *
 * Represents the origin of a metric observation.
 * Every factual metric must be traceable to a source.
 */

export type SourceTier = 'TIER_1_OFFICIAL' | 'TIER_2_REPUTABLE_MEDIA' | 'TIER_3_INDUSTRY' | 'TIER_4_UNVERIFIED'

export type SourceType =
  | 'INVESTOR_RELATIONS'
  | 'MONTHLY_REVENUE'
  | 'QUARTERLY_RESULTS'
  | 'SEC_FILING'
  | 'EARNINGS_TRANSCRIPT'
  | 'FINANCIAL_CALENDAR'
  | 'NEWS'
  | 'INDUSTRY_DATA'

export interface Source {
  id: string
  companyTicker: string
  name: string
  url: string
  tier: SourceTier
  sourceType: SourceType
  updateFrequency: string
  timezone: string
  enabled: boolean
}
