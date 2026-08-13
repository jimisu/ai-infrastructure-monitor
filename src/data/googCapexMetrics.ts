import type { CapexCommentaryObservation } from '../types/capex'
import type { MetricObservation } from '../types/metric'
import { GOOG_REPORTED_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'

const Q4_2024 = 'https://abc.xyz/investor/events/event-details/2025/2024-Q4-Earnings-Call/'
const Q1_2025 = 'https://abc.xyz/2025-q1-earnings-call/'
const Q2_2025 = 'https://abc.xyz/investor/events/event-details/2025/2025-Q2-Earnings-Call/'
const Q3_2025 = 'https://abc.xyz/investor/events/event-details/2025/2025-Q3-Earnings-Call-2025-4OI4Bac_Q9/default.aspx'
const Q4_2025 = 'https://abc.xyz/investor/events/event-details/2026/2025-Q4-Earnings-Call-2026-Dr_C033hS6/default.aspx'
const definition = GOOG_REPORTED_CAPEX_DEFINITION.id
const retrievedAt = '2026-08-13T14:00:00.000Z'

export const GOOG_CAPEX_OBSERVATIONS: MetricObservation[] = [
  {
    id: 'goog-2025-initial-capex-guidance-approximate', companyTicker: 'GOOG',
    metric: 'CAPEX_GUIDANCE_POINT', value: 75, unit: 'USD billions',
    period: '2025', periodType: 'YEAR', guidanceAsOfPeriod: '2024-Q4', approximate: true,
    capexDefinitionId: definition, publishedAt: '2025-02-04T21:30:00.000Z', retrievedAt,
    sourceId: 'goog-2024-q4-earnings-call', sourceUrl: Q4_2024,
  },
  {
    id: 'goog-2025-q1-capex-guidance-approximate', companyTicker: 'GOOG',
    metric: 'CAPEX_GUIDANCE_POINT', value: 75, unit: 'USD billions',
    period: '2025', periodType: 'YEAR', guidanceAsOfPeriod: '2025-Q1', approximate: true,
    capexDefinitionId: definition, publishedAt: '2025-04-24T20:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q1-earnings-call', sourceUrl: Q1_2025,
  },
  {
    id: 'goog-2025-q2-capex-guidance-approximate', companyTicker: 'GOOG',
    metric: 'CAPEX_GUIDANCE_POINT', value: 85, unit: 'USD billions',
    period: '2025', periodType: 'YEAR', guidanceAsOfPeriod: '2025-Q2', approximate: true,
    capexDefinitionId: definition, publishedAt: '2025-07-23T20:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q2-earnings-call', sourceUrl: Q2_2025,
  },
  {
    id: 'goog-2025-q3-capex-guidance-low', companyTicker: 'GOOG',
    metric: 'CAPEX_GUIDANCE_LOW', value: 91, unit: 'USD billions',
    period: '2025', periodType: 'YEAR', guidanceAsOfPeriod: '2025-Q3',
    capexDefinitionId: definition, publishedAt: '2025-10-29T20:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q3-earnings-call', sourceUrl: Q3_2025,
  },
  {
    id: 'goog-2025-q3-capex-guidance-high', companyTicker: 'GOOG',
    metric: 'CAPEX_GUIDANCE_HIGH', value: 93, unit: 'USD billions',
    period: '2025', periodType: 'YEAR', guidanceAsOfPeriod: '2025-Q3',
    capexDefinitionId: definition, publishedAt: '2025-10-29T20:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q3-earnings-call', sourceUrl: Q3_2025,
  },
  {
    id: 'goog-2025-capex-actual', companyTicker: 'GOOG',
    metric: 'CAPEX_ACTUAL', value: 91.4, unit: 'USD billions',
    period: '2025', periodType: 'YEAR', capexDefinitionId: definition,
    publishedAt: '2026-02-04T21:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q4-earnings-call', sourceUrl: Q4_2025,
  },
  {
    id: 'goog-2026-capex-guidance-low', companyTicker: 'GOOG',
    metric: 'CAPEX_GUIDANCE_LOW', value: 175, unit: 'USD billions',
    period: '2026', periodType: 'YEAR', guidanceAsOfPeriod: '2025-Q4',
    capexDefinitionId: definition, publishedAt: '2026-02-04T21:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q4-earnings-call', sourceUrl: Q4_2025,
  },
  {
    id: 'goog-2026-capex-guidance-high', companyTicker: 'GOOG',
    metric: 'CAPEX_GUIDANCE_HIGH', value: 185, unit: 'USD billions',
    period: '2026', periodType: 'YEAR', guidanceAsOfPeriod: '2025-Q4',
    capexDefinitionId: definition, publishedAt: '2026-02-04T21:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q4-earnings-call', sourceUrl: Q4_2025,
  },
  {
    id: 'goog-2025-q1-capex-actual', companyTicker: 'GOOG',
    metric: 'CAPEX_ACTUAL', value: 17.197, unit: 'USD billions',
    period: '2025-Q1', periodType: 'QUARTER', capexDefinitionId: definition,
    publishedAt: '2025-04-24T20:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q1-earnings-call', sourceUrl: Q1_2025,
  },
  {
    id: 'goog-2025-q2-capex-actual', companyTicker: 'GOOG',
    metric: 'CAPEX_ACTUAL', value: 22.446, unit: 'USD billions',
    period: '2025-Q2', periodType: 'QUARTER', capexDefinitionId: definition,
    publishedAt: '2025-07-23T20:30:00.000Z', retrievedAt,
    sourceId: 'goog-2025-q2-earnings-call', sourceUrl: Q2_2025,
  },
]

export const GOOG_CAPEX_COMMENTARY: CapexCommentaryObservation[] = [
  {
    id: 'goog-2025-q3-capex-infrastructure-mix', companyTicker: 'GOOG', period: '2025-Q3',
    text: 'Alphabet said the vast majority of CapEx was technical infrastructure, with servers and data centers and networking as major components.',
    classification: 'AI_AND_CLOUD_INFRASTRUCTURE_CONTEXT',
    sourceId: 'goog-2025-q3-earnings-call', sourceUrl: Q3_2025,
    publishedAt: '2025-10-29T20:30:00.000Z', retrievedAt,
  },
  {
    id: 'goog-2025-q4-capex-demand-context', companyTicker: 'GOOG', period: '2025-Q4',
    text: 'Alphabet described infrastructure investment as supporting Cloud customer demand and AI compute capacity, without identifying total CapEx as AI CapEx.',
    classification: 'AI_AND_CLOUD_INFRASTRUCTURE_CONTEXT',
    sourceId: 'goog-2025-q4-earnings-call', sourceUrl: Q4_2025,
    publishedAt: '2026-02-04T21:30:00.000Z', retrievedAt,
  },
]
