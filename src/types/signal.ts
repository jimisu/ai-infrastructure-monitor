export interface Signal {
  category: 'compute' | 'memory' | 'networking' | 'power' | 'cooling' | 'datacenter'
  score: number // 0-100
  change30d: number // change in past 30 days
  trend: 'accelerating' | 'stable' | 'decelerating'
  timestamp: string // ISO date
  source: string
  description: string
}

export interface MarketSignal {
  score: number // 0-100
  change30d: number
  trend: 'accelerating' | 'stable' | 'decelerating'
  timestamp: string
}

export interface ImpactEvent {
  id: string
  timestamp: string
  source: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  affectedCompanies: string[] // tickers
  category?: string
}

export interface Opportunity {
  ticker: string
  name: string
  infrastructureLayer: string
  opportunityScore: number // 0-100
  aiss: number
  tenxScore: number
  valuationAttractiveness: number
  signalMomentum: number
  reasoning: string
}
