/**
 * Opportunity Score
 * Ranks companies by investment opportunity potential.
 *
 * Formula:
 * 35% AISS (acceleration fundamentals)
 * 25% 10X Score (long-term potential)
 * 20% Valuation Attractiveness (price entry)
 * 20% Signal Momentum (recent acceleration)
 */

export interface OpportunityInputs {
  aiss: number // 0-100
  tenxScore: number // 0-100
  valuationAttractiveness: number // 0-100 (100 = cheap, 0 = expensive)
  signalMomentum: number // 0-100
}

export const calculateOpportunityScore = (inputs: OpportunityInputs): number => {
  const score =
    inputs.aiss * 0.35 +
    inputs.tenxScore * 0.25 +
    inputs.valuationAttractiveness * 0.2 +
    inputs.signalMomentum * 0.2

  return Math.round(Math.min(100, Math.max(0, score)))
}
