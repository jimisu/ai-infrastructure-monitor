import type { Source } from '../types/source'

/**
 * Source Registry
 *
 * Official sources for metric observations.
 * TIER_1_OFFICIAL sources are directly from company investor relations.
 */

export const TSMC_SOURCES: Source[] = [
  {
    id: 'tsmc-ir-main',
    companyTicker: 'TSM',
    name: 'TSMC Investor Relations',
    url: 'https://investor.tsmc.com/english',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'INVESTOR_RELATIONS',
    updateFrequency: 'continuous',
    timezone: 'Asia/Taipei',
    enabled: true,
  },
  {
    id: 'tsmc-monthly-revenue',
    companyTicker: 'TSM',
    name: 'TSMC Monthly Revenue',
    url: 'https://investor.tsmc.com/english/monthly-revenue/2026',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'MONTHLY_REVENUE',
    updateFrequency: 'monthly',
    timezone: 'Asia/Taipei',
    enabled: true,
  },
  {
    id: 'tsmc-quarterly-results-2026-q2',
    companyTicker: 'TSM',
    name: 'TSMC Quarterly Results Q2 2026',
    url: 'https://investor.tsmc.com/english/quarterly-results/2026/q2',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'QUARTERLY_RESULTS',
    updateFrequency: 'quarterly',
    timezone: 'Asia/Taipei',
    enabled: true,
  },
  {
    id: 'tsmc-financial-calendar',
    companyTicker: 'TSM',
    name: 'TSMC Financial Calendar',
    url: 'https://investor.tsmc.com/english/financial-calendar',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'FINANCIAL_CALENDAR',
    updateFrequency: 'continuous',
    timezone: 'Asia/Taipei',
    enabled: true,
  },
]

export const META_SOURCES: Source[] = [
  {
    id: 'meta-ir-main',
    companyTicker: 'META',
    name: 'META Investor Relations',
    url: 'https://investor.fb.com/investor-news',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'INVESTOR_RELATIONS',
    updateFrequency: 'continuous',
    timezone: 'America/Los_Angeles',
    enabled: true,
  },
  {
    id: 'meta-capex-2025q4-guidance',
    companyTicker: 'META',
    name: 'META 2025 Q4 CapEx Guidance',
    url: 'https://investor.fb.com/investor-news/press-releases',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'EARNINGS_TRANSCRIPT',
    updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles',
    enabled: true,
  },
  {
    id: 'meta-capex-2026q1-guidance',
    companyTicker: 'META',
    name: 'META 2026 Q1 CapEx Guidance',
    url: 'https://investor.fb.com/investor-news/press-releases',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'EARNINGS_TRANSCRIPT',
    updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles',
    enabled: true,
  },
  {
    id: 'meta-capex-2026q2-guidance',
    companyTicker: 'META',
    name: 'META 2026 Q2 CapEx Guidance',
    url: 'https://investor.fb.com/investor-news/press-releases',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'EARNINGS_TRANSCRIPT',
    updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles',
    enabled: true,
  },
  {
    id: 'meta-quarterly-results-2026-q1',
    companyTicker: 'META',
    name: 'META Q1 2026 Earnings',
    url: 'https://investor.fb.com/investor-news/press-releases',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'QUARTERLY_RESULTS',
    updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles',
    enabled: true,
  },
  {
    id: 'meta-quarterly-results-2026-q2',
    companyTicker: 'META',
    name: 'META Q2 2026 Earnings',
    url: 'https://investor.fb.com/investor-news/press-releases',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'QUARTERLY_RESULTS',
    updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles',
    enabled: true,
  },
]

const ALL_SOURCES = [...TSMC_SOURCES, ...META_SOURCES]

/**
 * Get source by ID
 */
export function getSourceById(id: string): Source | undefined {
  return ALL_SOURCES.find((s) => s.id === id)
}

/**
 * Get sources by company ticker
 */
export function getSourcesByTicker(ticker: string): Source[] {
  return ALL_SOURCES.filter((s) => s.companyTicker === ticker)
}
