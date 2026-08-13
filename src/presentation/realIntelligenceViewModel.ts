import type { HyperscalerTsmConfirmation } from '../types/hyperscalerTsmConfirmation'
import type { DerivedSignal } from '../types/derivedSignal'
import type { CompanyCapexAvailability, HyperscalerCapexTrend, HyperscalerTicker } from '../types/hyperscalerCapexTrend'
import type { MetricObservation } from '../types/metric'
import type { Source } from '../types/source'
import type { Trend3M } from '../signals/tsmSignalInterpreter'

export interface RealIntelligenceViewModel {
  crossCompanySignal: HyperscalerTsmConfirmation
  crossValidation: {
    alignment: HyperscalerTsmConfirmation['alignment']
    confidence: HyperscalerTsmConfirmation['confidence']
    evidenceCount: number
  }
  hyperscaler: {
    direction: HyperscalerCapexTrend['direction']
    confidence: HyperscalerCapexTrend['confidence']
    coverageLabel: string
    positiveBreadthLabel: string
    companies: Array<{
      ticker: HyperscalerTicker
      status: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'UNAVAILABLE'
    }>
    evidenceCount: number
  }
  tsmTrend: {
    previousAverage: number
    currentAverage: number
    changePercentagePoints: number
  }
  tsmOutlook: {
    actualRevenue: number
    guidanceMidpoint: number
    changePercent: number
  }
  sources: Source[]
}

interface Inputs {
  crossCompanySignal?: HyperscalerTsmConfirmation | null
  hyperscalerCapexTrend?: HyperscalerCapexTrend | null
  tsmOutlookSignal?: DerivedSignal
  tsmTrend: Trend3M | null
  tsmObservations: MetricObservation[]
  sources: Source[]
}

export function createRealIntelligenceViewModel(inputs: Inputs): RealIntelligenceViewModel | null {
  const {
    crossCompanySignal,
    hyperscalerCapexTrend,
    tsmOutlookSignal,
    tsmTrend,
  } = inputs
  if (!crossCompanySignal || !hyperscalerCapexTrend || !tsmOutlookSignal || !tsmTrend) {
    return null
  }

  const tsmEvidence = inputs.tsmObservations.filter((observation) =>
    tsmOutlookSignal.evidenceObservationIds.includes(observation.id)
  )
  const actualRevenue = tsmEvidence.find((observation) => observation.metric === 'QUARTERLY_REVENUE')
  const guidanceLow = tsmEvidence.find((observation) => observation.metric === 'REVENUE_GUIDANCE_LOW')
  const guidanceHigh = tsmEvidence.find((observation) => observation.metric === 'REVENUE_GUIDANCE_HIGH')

  if (!actualRevenue || !guidanceLow || !guidanceHigh) return null

  const companyStatuses = new Map<HyperscalerTicker, CompanyCapexAvailability>(
    hyperscalerCapexTrend.participatingCompanies.map(
      (company) => [company.companyTicker, company.direction] as const
    )
  )
  for (const ticker of hyperscalerCapexTrend.unavailableCompanies) {
    companyStatuses.set(ticker, 'UNAVAILABLE')
  }
  const universe: HyperscalerTicker[] = ['META', 'MSFT', 'GOOG', 'AMZN']
  const companies = universe.map((ticker) => ({
    ticker,
    status: companyStatuses.get(ticker) ?? 'UNAVAILABLE',
  }))

  return {
    crossCompanySignal,
    crossValidation: {
      alignment: crossCompanySignal.alignment,
      confidence: crossCompanySignal.confidence,
      evidenceCount: crossCompanySignal.evidenceObservationIds.length,
    },
    hyperscaler: {
      direction: hyperscalerCapexTrend.direction,
      confidence: hyperscalerCapexTrend.confidence,
      coverageLabel: `${hyperscalerCapexTrend.eligibleCount} / ${hyperscalerCapexTrend.totalUniverseCount}`,
      positiveBreadthLabel: `${hyperscalerCapexTrend.positiveCount} / ${hyperscalerCapexTrend.eligibleCount}`,
      companies,
      evidenceCount: hyperscalerCapexTrend.evidenceObservationIds.length,
    },
    tsmTrend: {
      previousAverage: tsmTrend.previousPeriod.avgYoY,
      currentAverage: tsmTrend.currentPeriod.avgYoY,
      changePercentagePoints: tsmTrend.magnitude,
    },
    tsmOutlook: {
      actualRevenue: actualRevenue.value,
      guidanceMidpoint: (guidanceLow.value + guidanceHigh.value) / 2,
      changePercent: tsmOutlookSignal.magnitude,
    },
    sources: inputs.sources,
  }
}
