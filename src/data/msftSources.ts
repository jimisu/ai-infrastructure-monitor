import type { Source } from '../types/source'

export const MSFT_SOURCES: Source[] = [
  {
    id: 'msft-fy2026-q1-earnings-call', companyTicker: 'MSFT',
    name: 'Microsoft FY2026 Q1 Earnings Conference Call',
    url: 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q1',
    tier: 'TIER_1_OFFICIAL', sourceType: 'EARNINGS_TRANSCRIPT', updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles', enabled: true,
  },
  {
    id: 'msft-fy2026-q2-earnings-call', companyTicker: 'MSFT',
    name: 'Microsoft FY2026 Q2 Earnings Conference Call',
    url: 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q2',
    tier: 'TIER_1_OFFICIAL', sourceType: 'EARNINGS_TRANSCRIPT', updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles', enabled: true,
  },
  {
    id: 'msft-fy2026-q3-earnings-call', companyTicker: 'MSFT',
    name: 'Microsoft FY2026 Q3 Earnings Conference Call',
    url: 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q3',
    tier: 'TIER_1_OFFICIAL', sourceType: 'EARNINGS_TRANSCRIPT', updateFrequency: 'quarterly',
    timezone: 'America/Los_Angeles', enabled: true,
  },
]
