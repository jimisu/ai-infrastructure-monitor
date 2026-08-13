/**
 * 10X Score (Ten-Bagger Potential Score)
 * Measures long-term asymmetric upside potential.
 * Score: 0-100
 */

export interface TenXInputs {
  tamExpansion: number // 0-100
  revenueGrowth: number // 0-100
  earningsGrowth: number // 0-100
  moat: number // 0-100
  operatingLeverage: number // 0-100
  aiInfrastructurePurity: number // 0-100
  marketCapRunway: number // 0-100
  valuation: number // 0-100
}

export const calculateTenX = (inputs: TenXInputs): number => {
  const score =
    inputs.tamExpansion * 0.2 +
    inputs.revenueGrowth * 0.15 +
    inputs.earningsGrowth * 0.15 +
    inputs.moat * 0.15 +
    inputs.operatingLeverage * 0.1 +
    inputs.aiInfrastructurePurity * 0.1 +
    inputs.marketCapRunway * 0.1 +
    inputs.valuation * 0.05

  return Math.round(Math.min(100, Math.max(0, score)))
}
