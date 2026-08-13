import type { MetricObservation } from '../types/metric'

/**
 * META CapEx Metric Observations
 *
 * Real factual data from official META investor relations.
 * Each observation is immutable and fully attributed.
 *
 * IMPORTANT: This layer contains FACTS ONLY.
 * No interpretation, no AI attribution, no scoring.
 * Interpretation happens in the signal layer.
 *
 * META defines CapEx as: capital expenditures including principal
 * payments on finance leases. This definition is preserved across
 * all observations and derived signals.
 *
 * Note: Initial guidance from 2025 Q4 includes 2026 full-year guidance.
 * Quarterly guidance updates as results are released.
 */

export const META_CAPEX_OBSERVATIONS: MetricObservation[] = [
  // 2025 Q4 Guidance (issued late 2025)
  // Full-year 2026 CapEx guidance: $115B–$135B
  {
    id: 'meta-2026-full-year-capex-guidance-low-2025q4',
    companyTicker: 'META',
    metric: 'CAPEX_GUIDANCE_LOW',
    value: 115.0,
    unit: 'USD billions',
    period: '2026',
    periodType: 'YEAR',
    guidanceAsOfPeriod: '2025-Q4',
    publishedAt: '2025-12-31T09:00:00Z',
    retrievedAt: '2026-08-13T14:00:00Z',
    sourceId: 'meta-capex-2025q4-guidance',
    sourceUrl: 'https://investor.fb.com/investor-news/press-releases',
  },
  {
    id: 'meta-2026-full-year-capex-guidance-high-2025q4',
    companyTicker: 'META',
    metric: 'CAPEX_GUIDANCE_HIGH',
    value: 135.0,
    unit: 'USD billions',
    period: '2026',
    periodType: 'YEAR',
    guidanceAsOfPeriod: '2025-Q4',
    publishedAt: '2025-12-31T09:00:00Z',
    retrievedAt: '2026-08-13T14:00:00Z',
    sourceId: 'meta-capex-2025q4-guidance',
    sourceUrl: 'https://investor.fb.com/investor-news/press-releases',
  },

  // 2026 Q1 Guidance (issued Apr 2026 with earnings)
  // Full-year 2026 CapEx guidance: $125B–$145B
  {
    id: 'meta-2026-q1-capex-guidance-low',
    companyTicker: 'META',
    metric: 'CAPEX_GUIDANCE_LOW',
    value: 125.0,
    unit: 'USD billions',
    period: '2026',
    periodType: 'YEAR',
    guidanceAsOfPeriod: '2026-Q1',
    publishedAt: '2026-04-22T09:00:00Z',
    retrievedAt: '2026-08-13T14:00:00Z',
    sourceId: 'meta-capex-2026q1-guidance',
    sourceUrl: 'https://investor.fb.com/investor-news/press-releases',
  },
  {
    id: 'meta-2026-q1-capex-guidance-high',
    companyTicker: 'META',
    metric: 'CAPEX_GUIDANCE_HIGH',
    value: 145.0,
    unit: 'USD billions',
    period: '2026',
    periodType: 'YEAR',
    guidanceAsOfPeriod: '2026-Q1',
    publishedAt: '2026-04-22T09:00:00Z',
    retrievedAt: '2026-08-13T14:00:00Z',
    sourceId: 'meta-capex-2026q1-guidance',
    sourceUrl: 'https://investor.fb.com/investor-news/press-releases',
  },

  // 2026 Q1 Actual (issued Apr 2026 with earnings)
  {
    id: 'meta-2026-q1-capex-actual',
    companyTicker: 'META',
    metric: 'CAPEX_ACTUAL',
    value: 19.84,
    unit: 'USD billions',
    period: '2026-Q1',
    periodType: 'QUARTER',
    publishedAt: '2026-04-22T09:00:00Z',
    retrievedAt: '2026-08-13T14:00:00Z',
    sourceId: 'meta-quarterly-results-2026-q1',
    sourceUrl: 'https://investor.fb.com/investor-news/press-releases',
  },

  // 2026 Q2 Guidance (issued Jul 2026 with earnings)
  // Full-year 2026 CapEx guidance: $130B–$145B
  {
    id: 'meta-2026-q2-capex-guidance-low',
    companyTicker: 'META',
    metric: 'CAPEX_GUIDANCE_LOW',
    value: 130.0,
    unit: 'USD billions',
    period: '2026',
    periodType: 'YEAR',
    guidanceAsOfPeriod: '2026-Q2',
    publishedAt: '2026-07-23T09:00:00Z',
    retrievedAt: '2026-08-13T14:00:00Z',
    sourceId: 'meta-capex-2026q2-guidance',
    sourceUrl: 'https://investor.fb.com/investor-news/press-releases',
  },
  {
    id: 'meta-2026-q2-capex-guidance-high',
    companyTicker: 'META',
    metric: 'CAPEX_GUIDANCE_HIGH',
    value: 145.0,
    unit: 'USD billions',
    period: '2026',
    periodType: 'YEAR',
    guidanceAsOfPeriod: '2026-Q2',
    publishedAt: '2026-07-23T09:00:00Z',
    retrievedAt: '2026-08-13T14:00:00Z',
    sourceId: 'meta-capex-2026q2-guidance',
    sourceUrl: 'https://investor.fb.com/investor-news/press-releases',
  },

  // 2026 Q2 Actual (issued Jul 2026 with earnings)
  {
    id: 'meta-2026-q2-capex-actual',
    companyTicker: 'META',
    metric: 'CAPEX_ACTUAL',
    value: 31.08,
    unit: 'USD billions',
    period: '2026-Q2',
    periodType: 'QUARTER',
    publishedAt: '2026-07-23T09:00:00Z',
    retrievedAt: '2026-08-13T14:00:00Z',
    sourceId: 'meta-quarterly-results-2026-q2',
    sourceUrl: 'https://investor.fb.com/investor-news/press-releases',
  },
]
