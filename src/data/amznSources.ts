import type { Source } from '../types/source'

export const AMZN_SOURCES: Source[] = [
  {
    id: 'amzn-2026-q1-results',
    companyTicker: 'AMZN',
    name: 'Amazon Q1 2026 Results',
    url: 'https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-First-Quarter-Results/',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'QUARTERLY_RESULTS',
    updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles',
    enabled: true,
  },
  {
    id: 'amzn-2025-q4-results',
    companyTicker: 'AMZN',
    name: 'Amazon Q4 2025 and Full-Year Results',
    url: 'https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/',
    tier: 'TIER_1_OFFICIAL',
    sourceType: 'QUARTERLY_RESULTS',
    updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles',
    enabled: true,
  },
]
