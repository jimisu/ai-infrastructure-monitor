import type { MetricObservation } from '../types/metric'
import type { DerivedSignal } from '../types/derivedSignal'
import {
  REVENUE_OUTLOOK_NEUTRAL_THRESHOLD,
} from '../config/signalRules'

/**
 * META CapEx Signal Interpreter
 *
 * Pure function that derives deterministic signals from META CapEx observations.
 * No side effects, no global state, no interpretation.
 * Only mathematics and fact.
 *
 * All business thresholds are defined in src/config/signalRules.ts
 */

/**
 * Derive all META CapEx signals from observations
 */
export function deriveMetaCapexSignals(observations: MetricObservation[]): DerivedSignal[] {
  const signals: DerivedSignal[] = []

  // Attempt to derive CapEx guidance direction signal (most recent quarter)
  const guidanceSignal = deriveLatestCapexGuidanceSignal(observations)
  if (guidanceSignal) {
    signals.push(guidanceSignal)
  }

  // Attempt to derive quarterly CapEx QoQ growth signal
  const growthSignals = deriveCapexQoQGrowthSignals(observations)
  signals.push(...growthSignals)

  return signals
}

/**
 * Derive CapEx guidance direction for most recent quarter
 *
 * Logic:
 * 1. Find most recent CAPEX_GUIDANCE_LOW and HIGH
 * 2. Calculate guidance midpoint: (low + high) / 2
 * 3. Find most recent CAPEX_ACTUAL (if available)
 * 4. If actual available, calculate actual vs midpoint %
 * 5. If no actual, compare to previous guidance midpoint
 * 6. Determine direction based on threshold
 * 7. Return signal with evidence IDs
 */
function deriveLatestCapexGuidanceSignal(observations: MetricObservation[]): DerivedSignal | null {
  // Find all quarterly guidance observations sorted by period
  const guidanceLowObs = observations
    .filter((o) => o.metric === 'CAPEX_GUIDANCE_LOW' && o.periodType === 'QUARTER')
    .sort((a, b) => b.period.localeCompare(a.period)) // Most recent first

  const guidanceHighObs = observations
    .filter((o) => o.metric === 'CAPEX_GUIDANCE_HIGH' && o.periodType === 'QUARTER')
    .sort((a, b) => b.period.localeCompare(a.period))

  // If no recent guidance available, return null
  if (guidanceLowObs.length === 0 || guidanceHighObs.length === 0) {
    return null
  }

  // Get most recent guidance
  const latestPeriod = guidanceLowObs[0].period
  const latestGuidanceLow = guidanceLowObs.find((o) => o.period === latestPeriod)
  const latestGuidanceHigh = guidanceHighObs.find((o) => o.period === latestPeriod)

  if (!latestGuidanceLow || !latestGuidanceHigh) {
    return null
  }

  // Calculate midpoint
  const latestMidpoint = (latestGuidanceLow.value + latestGuidanceHigh.value) / 2

  // Try to find most recent actual to compare against guidance
  const actualObs = observations
    .filter((o) => o.metric === 'CAPEX_ACTUAL' && o.period === latestPeriod)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]

  let percentageChange: number
  let direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  let description: string
  let evidenceIds: string[]

  if (actualObs) {
    // Compare actual to guidance midpoint
    percentageChange = ((actualObs.value - latestMidpoint) / latestMidpoint) * 100
    if (percentageChange > REVENUE_OUTLOOK_NEUTRAL_THRESHOLD) {
      direction = 'POSITIVE'
    } else if (percentageChange < -REVENUE_OUTLOOK_NEUTRAL_THRESHOLD) {
      direction = 'NEGATIVE'
    } else {
      direction = 'NEUTRAL'
    }
    description = `META ${latestPeriod} CapEx actual ${actualObs.value.toFixed(2)}B ${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}% vs guidance midpoint ${latestMidpoint.toFixed(2)}B.`
    evidenceIds = [latestGuidanceLow.id, latestGuidanceHigh.id, actualObs.id]
  } else {
    // No actual yet, check if guidance is being raised (compare to prior quarter guidance)
    const priorPeriodGuidanceLows = guidanceLowObs.filter(
      (o) => o.period !== latestPeriod && o.periodType === 'QUARTER'
    )
    const priorPeriodGuidanceHighs = guidanceHighObs.filter(
      (o) => o.period !== latestPeriod && o.periodType === 'QUARTER'
    )

    if (priorPeriodGuidanceLows.length > 0 && priorPeriodGuidanceHighs.length > 0) {
      const priorMidpoint =
        (priorPeriodGuidanceLows[0].value + priorPeriodGuidanceHighs[0].value) / 2
      percentageChange = ((latestMidpoint - priorMidpoint) / priorMidpoint) * 100

      if (percentageChange > REVENUE_OUTLOOK_NEUTRAL_THRESHOLD) {
        direction = 'POSITIVE'
      } else if (percentageChange < -REVENUE_OUTLOOK_NEUTRAL_THRESHOLD) {
        direction = 'NEGATIVE'
      } else {
        direction = 'NEUTRAL'
      }
      description = `META ${latestPeriod} CapEx guidance midpoint ${latestMidpoint.toFixed(2)}B, ${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}% vs prior quarter ${priorPeriodGuidanceLows[0].period} midpoint ${priorMidpoint.toFixed(2)}B.`
      evidenceIds = [
        latestGuidanceLow.id,
        latestGuidanceHigh.id,
        priorPeriodGuidanceLows[0].id,
        priorPeriodGuidanceHighs[0].id,
      ]
    } else {
      // Only current guidance available
      description = `META ${latestPeriod} CapEx guidance range ${latestGuidanceLow.value.toFixed(2)}B–${latestGuidanceHigh.value.toFixed(2)}B (midpoint ${latestMidpoint.toFixed(2)}B).`
      evidenceIds = [latestGuidanceLow.id, latestGuidanceHigh.id]
      direction = 'NEUTRAL'
      percentageChange = 0
    }
  }

  return {
    id: `meta-capex-guidance-${latestPeriod}-${Date.now()}`,
    companyTicker: 'META',
    signalType: 'REVENUE_OUTLOOK_ACCELERATION', // Using same type for guidance direction
    direction,
    magnitude: percentageChange,
    unit: 'percent',
    confidence: 'HIGH',
    period: latestPeriod,
    generatedAt: new Date().toISOString(),
    evidenceObservationIds: evidenceIds,
    description,
  }
}

/**
 * Derive CapEx QoQ growth signals
 *
 * Logic:
 * 1. Find all CAPEX_ACTUAL observations sorted by period
 * 2. For each quarter (starting from 2nd), calculate QoQ growth %
 * 3. Return signals for significant changes
 */
export interface CapexQoQGrowth {
  period: string
  value: number
  qoqPercent: number
  previousValue: number
  previousPeriod: string
  evidenceIds: string[]
}

export function deriveCapexQoQGrowthRates(observations: MetricObservation[]): CapexQoQGrowth[] {
  const rates: CapexQoQGrowth[] = []

  // Find all quarterly actual CapEx observations sorted by period
  const actualObs = observations
    .filter((o) => o.metric === 'CAPEX_ACTUAL' && o.periodType === 'QUARTER')
    .sort((a, b) => a.period.localeCompare(b.period))

  // Need at least 2 quarters to calculate QoQ
  if (actualObs.length < 2) {
    return rates
  }

  // For each quarter starting from index 1, calculate QoQ
  for (let i = 1; i < actualObs.length; i++) {
    const prevObs = actualObs[i - 1]
    const currObs = actualObs[i]

    const qoqPercent = ((currObs.value - prevObs.value) / prevObs.value) * 100

    rates.push({
      period: currObs.period,
      value: currObs.value,
      qoqPercent,
      previousValue: prevObs.value,
      previousPeriod: prevObs.period,
      evidenceIds: [prevObs.id, currObs.id],
    })
  }

  return rates
}

function deriveCapexQoQGrowthSignals(observations: MetricObservation[]): DerivedSignal[] {
  const signals: DerivedSignal[] = []
  const growthRates = deriveCapexQoQGrowthRates(observations)

  // For now, just return signals for all QoQ growth (could add threshold later)
  growthRates.forEach((rate) => {
    signals.push({
      id: `meta-capex-qoq-${rate.period}-${Date.now()}`,
      companyTicker: 'META',
      signalType: 'REVENUE_OUTLOOK_ACCELERATION', // Reusing type for CapEx growth
      direction: rate.qoqPercent > 0 ? 'POSITIVE' : rate.qoqPercent < 0 ? 'NEGATIVE' : 'NEUTRAL',
      magnitude: rate.qoqPercent,
      unit: 'percent',
      confidence: 'HIGH',
      period: rate.period,
      generatedAt: new Date().toISOString(),
      evidenceObservationIds: rate.evidenceIds,
      description: `META ${rate.period} CapEx ${rate.value.toFixed(2)}B, ${rate.qoqPercent >= 0 ? '+' : ''}${rate.qoqPercent.toFixed(1)}% vs ${rate.previousPeriod} ${rate.previousValue.toFixed(2)}B.`,
    })
  })

  return signals
}

/**
 * Derive CapEx guidance midpoint revision
 *
 * Logic:
 * 1. Find initial 2026 full-year guidance (from 2025 Q4)
 * 2. Find most recent quarterly guidance
 * 3. Calculate midpoint for each
 * 4. Calculate revision %: (current - initial) / initial * 100
 * 5. Determine trend direction
 * 6. Return with evidence IDs
 */
export interface CapexGuidanceRevision {
  period: string
  initialMidpoint: number
  currentMidpoint: number
  revisionPercent: number
  trend: 'UPWARD' | 'DOWNWARD' | 'NEUTRAL'
  evidenceIds: string[]
  description: string
}

export function deriveCapexGuidanceRevision(
  observations: MetricObservation[]
): CapexGuidanceRevision | null {
  // Find initial 2026 full-year guidance (from 2025 Q4)
  const initialLow = observations.find(
    (o) => o.metric === 'CAPEX_GUIDANCE_LOW' && o.period === '2026'
  )
  const initialHigh = observations.find(
    (o) => o.metric === 'CAPEX_GUIDANCE_HIGH' && o.period === '2026'
  )

  if (!initialLow || !initialHigh) {
    return null
  }

  const initialMidpoint = (initialLow.value + initialHigh.value) / 2

  // Find most recent quarterly guidance
  const latestQuarterlyLows = observations
    .filter((o) => o.metric === 'CAPEX_GUIDANCE_LOW' && o.periodType === 'QUARTER')
    .sort((a, b) => b.period.localeCompare(a.period))

  const latestQuarterlyHighs = observations
    .filter((o) => o.metric === 'CAPEX_GUIDANCE_HIGH' && o.periodType === 'QUARTER')
    .sort((a, b) => b.period.localeCompare(a.period))

  if (latestQuarterlyLows.length === 0 || latestQuarterlyHighs.length === 0) {
    return null
  }

  const latestPeriod = latestQuarterlyLows[0].period
  const latestLow = latestQuarterlyLows.find((o) => o.period === latestPeriod)
  const latestHigh = latestQuarterlyHighs.find((o) => o.period === latestPeriod)

  if (!latestLow || !latestHigh) {
    return null
  }

  const currentMidpoint = (latestLow.value + latestHigh.value) / 2
  const revisionPercent = ((currentMidpoint - initialMidpoint) / initialMidpoint) * 100

  let trend: 'UPWARD' | 'DOWNWARD' | 'NEUTRAL'
  if (revisionPercent > REVENUE_OUTLOOK_NEUTRAL_THRESHOLD) {
    trend = 'UPWARD'
  } else if (revisionPercent < -REVENUE_OUTLOOK_NEUTRAL_THRESHOLD) {
    trend = 'DOWNWARD'
  } else {
    trend = 'NEUTRAL'
  }

  return {
    period: latestPeriod,
    initialMidpoint,
    currentMidpoint,
    revisionPercent,
    trend,
    evidenceIds: [initialLow.id, initialHigh.id, latestLow.id, latestHigh.id],
    description: `META CapEx guidance revised ${revisionPercent >= 0 ? '+' : ''}${revisionPercent.toFixed(1)}% from initial 2026 midpoint ${initialMidpoint.toFixed(2)}B to current ${latestPeriod} midpoint ${currentMidpoint.toFixed(2)}B.`,
  }
}
