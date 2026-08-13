export interface Company {
  ticker: string
  name: string
  sector: string
  infrastructureLayer: string
  aiss: number // 0-100
  aissChange30d: number // change in past 30 days
  trend: 'accelerating' | 'stable' | 'decelerating'
  revenueGrowth: number // %
  aiExposure: number // 0-100
  tenxScore: number // 0-100
  valuationAttractiveness: number // 0-100 (100 = cheap, 0 = expensive)
  signalMomentum: number // 0-100
}
