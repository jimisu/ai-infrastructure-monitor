import {
  AMZN_2026_CAPEX_OUTLOOK_DEFINITION,
  AMZN_FINANCE_LEASE_ACQUIRED_PP_AND_E_DEFINITION,
  AMZN_OPERATING_LEASE_ASSETS_DEFINITION,
  AMZN_PP_AND_E_NOT_YET_PAID_DEFINITION,
  AMZN_PP_AND_E_PURCHASES_DEFINITION,
  AMZN_PP_AND_E_SALES_INCENTIVES_DEFINITION,
} from '../config/capexDefinitionRegistry'
import type { CapexCommentaryObservation } from '../types/capex'
import type { MetricObservation } from '../types/metric'

const Q1_SOURCE = 'https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-First-Quarter-Results/'
const Q4_SOURCE = 'https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/'
const retrievedAt = '2026-08-14T00:00:00.000Z'
const q1PublishedAt = '2026-04-29T20:30:00.000Z'
const q4PublishedAt = '2026-02-05T22:00:00.000Z'

interface TtmSeries {
  id: string
  definitionId: string
  value2025: number
  value2026: number
}

const ttmSeries: TtmSeries[] = [
  {
    id: 'purchases-of-property-and-equipment',
    definitionId: AMZN_PP_AND_E_PURCHASES_DEFINITION.id,
    value2025: 93.093,
    value2026: 151.003,
  },
  {
    id: 'property-equipment-sales-incentives',
    definitionId: AMZN_PP_AND_E_SALES_INCENTIVES_DEFINITION.id,
    value2025: 5.115,
    value2026: 3.704,
  },
  {
    id: 'finance-lease-acquired-property-equipment',
    definitionId: AMZN_FINANCE_LEASE_ACQUIRED_PP_AND_E_DEFINITION.id,
    value2025: 0.866,
    value2026: 4.422,
  },
  {
    id: 'property-equipment-not-yet-paid',
    definitionId: AMZN_PP_AND_E_NOT_YET_PAID_DEFINITION.id,
    value2025: 9.736,
    value2026: 16.967,
  },
  {
    id: 'operating-lease-assets',
    definitionId: AMZN_OPERATING_LEASE_ASSETS_DEFINITION.id,
    value2025: 15.992,
    value2026: 21.848,
  },
]

export const AMZN_CAPEX_OBSERVATIONS: MetricObservation[] = [
  ...ttmSeries.flatMap(({ id, definitionId, value2025, value2026 }): MetricObservation[] => [
    {
      id: `amzn-ttm-2025-q1-${id}`,
      companyTicker: 'AMZN',
      metric: 'CAPEX_ACTUAL',
      value: value2025,
      unit: 'USD billions',
      period: 'TTM-2025-Q1',
      periodType: 'POINT_IN_TIME',
      capexDefinitionId: definitionId,
      publishedAt: q1PublishedAt,
      retrievedAt,
      sourceId: 'amzn-2026-q1-results',
      sourceUrl: Q1_SOURCE,
    },
    {
      id: `amzn-ttm-2026-q1-${id}`,
      companyTicker: 'AMZN',
      metric: 'CAPEX_ACTUAL',
      value: value2026,
      unit: 'USD billions',
      period: 'TTM-2026-Q1',
      periodType: 'POINT_IN_TIME',
      capexDefinitionId: definitionId,
      publishedAt: q1PublishedAt,
      retrievedAt,
      sourceId: 'amzn-2026-q1-results',
      sourceUrl: Q1_SOURCE,
    },
  ]),
  {
    id: 'amzn-2026-company-capex-guidance-approximate',
    companyTicker: 'AMZN',
    metric: 'CAPEX_GUIDANCE_POINT',
    value: 200,
    unit: 'USD billions',
    period: '2026',
    periodType: 'YEAR',
    guidanceAsOfPeriod: '2025-Q4',
    capexDefinitionId: AMZN_2026_CAPEX_OUTLOOK_DEFINITION.id,
    approximate: true,
    publishedAt: q4PublishedAt,
    retrievedAt,
    sourceId: 'amzn-2025-q4-results',
    sourceUrl: Q4_SOURCE,
  },
]

export const AMZN_CAPEX_COMMENTARY: CapexCommentaryObservation[] = [
  {
    id: 'amzn-ttm-2026-q1-ai-investment-attribution',
    companyTicker: 'AMZN',
    period: 'TTM-2026-Q1',
    text: 'Amazon stated that the year-over-year increase in purchases of property and equipment, net of proceeds from sales and incentives, primarily reflects investments in artificial intelligence.',
    classification: 'AI_AND_CLOUD_INFRASTRUCTURE_CONTEXT',
    sourceId: 'amzn-2026-q1-results',
    sourceUrl: Q1_SOURCE,
    publishedAt: q1PublishedAt,
    retrievedAt,
  },
  {
    id: 'amzn-2025-q4-aws-infrastructure-context',
    companyTicker: 'AMZN',
    period: '2025-Q4',
    text: 'Amazon described strong AWS demand and investment opportunities including AI, chips, robotics, and low earth orbit satellites alongside its company-wide 2026 CapEx outlook.',
    classification: 'AI_AND_CLOUD_INFRASTRUCTURE_CONTEXT',
    sourceId: 'amzn-2025-q4-results',
    sourceUrl: Q4_SOURCE,
    publishedAt: q4PublishedAt,
    retrievedAt,
  },
]
