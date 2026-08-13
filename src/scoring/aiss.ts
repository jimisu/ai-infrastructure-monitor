/**
 * AISS (AI Infrastructure Signal Score)
 * Measures whether company/industry fundamentals are accelerating.
 * Score: 0-100
 */

export interface AISSInputs {
  revenueAcceleration: number // 0-100
  backlogBookings: number // 0-100
  hyperscalerCapExExposure: number // 0-100
  industryDemand: number // 0-100
  marginExpansion: number // 0-100
  signalVelocity: number // 0-100
  valuation: number // 0-100
}

export const calculateAISS = (inputs: AISSInputs): number => {
  const score =
    inputs.revenueAcceleration * 0.2 +
    inputs.backlogBookings * 0.2 +
    inputs.hyperscalerCapExExposure * 0.15 +
    inputs.industryDemand * 0.15 +
    inputs.marginExpansion * 0.1 +
    inputs.signalVelocity * 0.1 +
    inputs.valuation * 0.1

  return Math.round(Math.min(100, Math.max(0, score)))
}
