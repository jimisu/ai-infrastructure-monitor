import type { DemandBoardStatus } from './demandStatus'
import type { HyperscalerCapexTrend, HyperscalerTicker } from '../types/hyperscalerCapexTrend'
import type { DerivedSignal } from '../types/derivedSignal'
import type { Trend3M } from '../signals/tsmSignalInterpreter'

interface SnapshotInputs {
  asOf: string
  status: DemandBoardStatus
  hyperscalerCapexTrend: HyperscalerCapexTrend | null
  tsmTrend: Trend3M | null
  tsmOutlookSignal?: DerivedSignal
  sources: { name: string; url: string }[]
}

export function toLatestSnapshot(inputs: SnapshotInputs) {
  const universe: HyperscalerTicker[] = ['META', 'MSFT', 'GOOG', 'AMZN']
  return {
    asOf: inputs.asOf,
    status: inputs.status,
    // Existing aggregate confidence; this does not assign a new confidence rank.
    confidence: inputs.hyperscalerCapexTrend?.confidence ?? 'UNAVAILABLE',
    hyperscalers: Object.fromEntries(universe.map((ticker) => [ticker,
      inputs.hyperscalerCapexTrend?.participatingCompanies.find((company) => company.companyTicker === ticker)?.direction ?? 'UNAVAILABLE',
    ])),
    tsm: {
      trend3m: inputs.tsmTrend?.direction ?? 'UNAVAILABLE',
      outlook: inputs.tsmOutlookSignal?.direction ?? 'UNAVAILABLE',
    },
    sources: inputs.sources.map(({ name, url }) => ({ name, url })),
    disclaimer: 'Not investment advice. Issuer CapEx is not AI-only CapEx.',
  }
}
