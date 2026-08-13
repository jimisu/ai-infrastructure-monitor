import type { CapexCommentaryObservation } from '../types/capex'
import type { MetricObservation } from '../types/metric'
import {
  MSFT_CASH_PAID_PP_AND_E_DEFINITION,
  MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION,
} from '../config/capexDefinitionRegistry'

const Q1_SOURCE = 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q1'
const Q2_SOURCE = 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q2'
const Q3_SOURCE = 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q3'

export const MSFT_CAPEX_OBSERVATIONS: MetricObservation[] = [
  {
    id: 'msft-fy2026-q1-management-total-capex', companyTicker: 'MSFT', metric: 'CAPEX_ACTUAL',
    value: 34.9, unit: 'USD billions', period: 'MSFT-FY2026-Q1', periodType: 'QUARTER',
    capexDefinitionId: MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    publishedAt: '2025-10-29T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
    sourceId: 'msft-fy2026-q1-earnings-call', sourceUrl: Q1_SOURCE,
  },
  {
    id: 'msft-fy2026-q2-management-total-capex', companyTicker: 'MSFT', metric: 'CAPEX_ACTUAL',
    value: 37.5, unit: 'USD billions', period: 'MSFT-FY2026-Q2', periodType: 'QUARTER',
    capexDefinitionId: MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    publishedAt: '2026-01-28T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
    sourceId: 'msft-fy2026-q2-earnings-call', sourceUrl: Q2_SOURCE,
  },
  {
    id: 'msft-fy2026-q3-management-total-capex', companyTicker: 'MSFT', metric: 'CAPEX_ACTUAL',
    value: 31.9, unit: 'USD billions', period: 'MSFT-FY2026-Q3', periodType: 'QUARTER',
    capexDefinitionId: MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    publishedAt: '2026-04-29T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
    sourceId: 'msft-fy2026-q3-earnings-call', sourceUrl: Q3_SOURCE,
  },
  {
    id: 'msft-fy2026-q1-cash-paid-pp-and-e', companyTicker: 'MSFT', metric: 'CAPEX_ACTUAL',
    value: 19.4, unit: 'USD billions', period: 'MSFT-FY2026-Q1', periodType: 'QUARTER',
    capexDefinitionId: MSFT_CASH_PAID_PP_AND_E_DEFINITION.id,
    publishedAt: '2025-10-29T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
    sourceId: 'msft-fy2026-q1-earnings-call', sourceUrl: Q1_SOURCE,
  },
  {
    id: 'msft-fy2026-q2-cash-paid-pp-and-e', companyTicker: 'MSFT', metric: 'CAPEX_ACTUAL',
    value: 29.9, unit: 'USD billions', period: 'MSFT-FY2026-Q2', periodType: 'QUARTER',
    capexDefinitionId: MSFT_CASH_PAID_PP_AND_E_DEFINITION.id,
    publishedAt: '2026-01-28T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
    sourceId: 'msft-fy2026-q2-earnings-call', sourceUrl: Q2_SOURCE,
  },
  {
    id: 'msft-fy2026-q3-cash-paid-pp-and-e', companyTicker: 'MSFT', metric: 'CAPEX_ACTUAL',
    value: 30.9, unit: 'USD billions', period: 'MSFT-FY2026-Q3', periodType: 'QUARTER',
    capexDefinitionId: MSFT_CASH_PAID_PP_AND_E_DEFINITION.id,
    publishedAt: '2026-04-29T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
    sourceId: 'msft-fy2026-q3-earnings-call', sourceUrl: Q3_SOURCE,
  },
  {
    id: 'msft-fy2026-q4-total-capex-lower-bound', companyTicker: 'MSFT',
    metric: 'CAPEX_GUIDANCE_LOWER_BOUND', value: 40, unit: 'USD billions',
    period: 'MSFT-FY2026-Q4', periodType: 'QUARTER', guidanceAsOfPeriod: 'MSFT-FY2026-Q3',
    capexDefinitionId: MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    publishedAt: '2026-04-29T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
    sourceId: 'msft-fy2026-q3-earnings-call', sourceUrl: Q3_SOURCE,
  },
  {
    id: 'msft-calendar-2026-total-capex-approximate-point', companyTicker: 'MSFT',
    metric: 'CAPEX_GUIDANCE_POINT', value: 190, unit: 'USD billions',
    period: '2026', periodType: 'YEAR', guidanceAsOfPeriod: 'MSFT-FY2026-Q3', approximate: true,
    capexDefinitionId: MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    publishedAt: '2026-04-29T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
    sourceId: 'msft-fy2026-q3-earnings-call', sourceUrl: Q3_SOURCE,
  },
]

export const MSFT_CAPEX_COMMENTARY: CapexCommentaryObservation[] = [{
  id: 'msft-fy2026-q3-ai-cloud-infrastructure-context', companyTicker: 'MSFT',
  period: 'MSFT-FY2026-Q3',
  text: 'Microsoft described CapEx in the context of cloud infrastructure buildouts and short-lived GPU and CPU assets.',
  classification: 'AI_AND_CLOUD_INFRASTRUCTURE_CONTEXT',
  sourceId: 'msft-fy2026-q3-earnings-call', sourceUrl: Q3_SOURCE,
  publishedAt: '2026-04-29T21:30:00.000Z', retrievedAt: '2026-08-13T14:00:00.000Z',
}]
