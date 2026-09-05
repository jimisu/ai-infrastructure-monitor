import type { DerivedSignal } from '../types/derivedSignal'
import type { HyperscalerCapexTrend } from '../types/hyperscalerCapexTrend'
import type { HyperscalerTsmConfirmation } from '../types/hyperscalerTsmConfirmation'
import type { Trend3M } from '../signals/tsmSignalInterpreter'

export type DemandBoardStatus = 'ACCELERATING' | 'STABLE' | 'WEAKENING' | 'INCOMPLETE'

export interface DemandStatusInputs {
  hyperscalerCapexTrend: Pick<HyperscalerCapexTrend, 'direction' | 'eligibleCount' | 'totalUniverseCount' | 'coverage'> | null
  tsmTrend: Pick<Trend3M, 'direction'> | null
  tsmOutlookSignal?: Pick<DerivedSignal, 'direction'> | null
  crossCompanySignal: Pick<HyperscalerTsmConfirmation, 'direction' | 'alignment'> | null
}

export function toDemandStatus({ hyperscalerCapexTrend: demand, tsmTrend, tsmOutlookSignal, crossCompanySignal }: DemandStatusInputs): { status: DemandBoardStatus; explanation: string } {
  if (!demand || demand.eligibleCount !== 4 || demand.totalUniverseCount !== 4 || demand.coverage !== 100 || !tsmTrend) {
    return { status: 'INCOMPLETE', explanation: 'The board requires 4/4 hyperscaler coverage and a TSMC three-month trend.' }
  }
  if (crossCompanySignal?.direction === 'POSITIVE' && crossCompanySignal.alignment === 'CONFIRMED') {
    return { status: 'ACCELERATING', explanation: 'Full hyperscaler coverage with positive, confirmed demand and semiconductor supply signals.' }
  }
  if (demand.direction === 'NEGATIVE' || tsmTrend.direction === 'DECELERATING' || tsmOutlookSignal?.direction === 'NEGATIVE') {
    return { status: 'WEAKENING', explanation: `Hyperscalers: ${demand.direction}; TSMC three-month trend: ${tsmTrend.direction}; outlook: ${tsmOutlookSignal?.direction ?? 'UNAVAILABLE'}. At least one is negative or decelerating.` }
  }
  return { status: 'STABLE', explanation: `Full coverage without positive cross-confirmation or a negative input. Hyperscalers: ${demand.direction}; TSMC three-month trend: ${tsmTrend.direction}; outlook: ${tsmOutlookSignal?.direction ?? 'UNAVAILABLE'}.` }
}
