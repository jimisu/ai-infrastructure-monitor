import type { CrossCompanySignal } from '../types/crossCompanySignal'
import type { DerivedSignal } from '../types/derivedSignal'
import type { MetricObservation } from '../types/metric'
import type { Source } from '../types/source'
import type { Trend3M } from '../signals/tsmSignalInterpreter'

export interface RealIntelligenceViewModel {
  crossCompanySignal: CrossCompanySignal
  meta: {
    priorMidpoint: number
    currentMidpoint: number
    revisionPercent: number
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
  crossCompanySignal?: CrossCompanySignal
  metaGuidanceSignal?: DerivedSignal
  tsmOutlookSignal?: DerivedSignal
  tsmTrend: Trend3M | null
  metaObservations: MetricObservation[]
  tsmObservations: MetricObservation[]
  sources: Source[]
}

export function createRealIntelligenceViewModel(inputs: Inputs): RealIntelligenceViewModel | null {
  const { crossCompanySignal, metaGuidanceSignal, tsmOutlookSignal, tsmTrend } = inputs
  if (!crossCompanySignal || !metaGuidanceSignal || !tsmOutlookSignal || !tsmTrend) {
    return null
  }

  const metaEvidence = inputs.metaObservations.filter((observation) =>
    metaGuidanceSignal.evidenceObservationIds.includes(observation.id)
  )
  const metaAsOfPeriods = [...new Set(metaEvidence.map((observation) => observation.guidanceAsOfPeriod))]
    .filter((period): period is string => Boolean(period))
    .sort()
  const priorAsOf = metaAsOfPeriods.at(-2)
  const currentAsOf = metaAsOfPeriods.at(-1)
  const metaPriorLow = metaEvidence.find(
    (observation) => observation.metric === 'CAPEX_GUIDANCE_LOW' && observation.guidanceAsOfPeriod === priorAsOf
  )
  const metaPriorHigh = metaEvidence.find(
    (observation) => observation.metric === 'CAPEX_GUIDANCE_HIGH' && observation.guidanceAsOfPeriod === priorAsOf
  )
  const metaCurrentLow = metaEvidence.find(
    (observation) => observation.metric === 'CAPEX_GUIDANCE_LOW' && observation.guidanceAsOfPeriod === currentAsOf
  )
  const metaCurrentHigh = metaEvidence.find(
    (observation) => observation.metric === 'CAPEX_GUIDANCE_HIGH' && observation.guidanceAsOfPeriod === currentAsOf
  )

  const tsmEvidence = inputs.tsmObservations.filter((observation) =>
    tsmOutlookSignal.evidenceObservationIds.includes(observation.id)
  )
  const actualRevenue = tsmEvidence.find((observation) => observation.metric === 'QUARTERLY_REVENUE')
  const guidanceLow = tsmEvidence.find((observation) => observation.metric === 'REVENUE_GUIDANCE_LOW')
  const guidanceHigh = tsmEvidence.find((observation) => observation.metric === 'REVENUE_GUIDANCE_HIGH')

  if (
    !metaPriorLow ||
    !metaPriorHigh ||
    !metaCurrentLow ||
    !metaCurrentHigh ||
    !actualRevenue ||
    !guidanceLow ||
    !guidanceHigh
  ) {
    return null
  }

  return {
    crossCompanySignal,
    meta: {
      priorMidpoint: (metaPriorLow.value + metaPriorHigh.value) / 2,
      currentMidpoint: (metaCurrentLow.value + metaCurrentHigh.value) / 2,
      revisionPercent: metaGuidanceSignal.magnitude,
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
