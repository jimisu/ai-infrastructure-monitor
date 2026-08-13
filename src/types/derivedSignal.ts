/**
 * Derived Signal Type
 *
 * Represents a deterministic signal derived from MetricObservations.
 * Every signal is:
 * - Fully traceable to source observations
 * - Mathematically transparent
 * - Free from interpretation or recommendation
 */

export type SignalType =
  | 'REVENUE_OUTLOOK_ACCELERATION'
  | 'REVENUE_OUTLOOK_DECELERATION'
  | 'MARGIN_EXPANSION'
  | 'MARGIN_CONTRACTION'
  | 'REVENUE_GROWTH_ACCELERATION'
  | 'REVENUE_GROWTH_DECELERATION'

export type Direction = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW'

export interface DerivedSignal {
  id: string
  companyTicker: string
  signalType: SignalType
  direction: Direction
  magnitude: number // percentage change or other magnitude
  unit: string // e.g., "percent", "dollars"
  confidence: Confidence
  period: string // e.g., "2026-Q3"
  generatedAt: string // ISO 8601 timestamp
  evidenceObservationIds: string[] // IDs of MetricObservations used
  description: string // Factual description only
}
