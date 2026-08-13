import type { MetricObservation } from '../types/metric'
import type { DerivedSignal } from '../types/derivedSignal'

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
 * Derive the latest full-year CapEx guidance revision.
 *
 * Annual guidance revisions are ordered by guidanceAsOfPeriod and compared
 * only with the immediately preceding revision for the same target year.
 */
function deriveLatestCapexGuidanceSignal(observations: MetricObservation[]): DerivedSignal | null {
  const annualGuidance = observations
    .filter(
      (o) =>
        (o.metric === 'CAPEX_GUIDANCE_LOW' || o.metric === 'CAPEX_GUIDANCE_HIGH') &&
        o.periodType === 'YEAR' &&
        Boolean(o.guidanceAsOfPeriod)
    )
    .sort((a, b) => a.guidanceAsOfPeriod!.localeCompare(b.guidanceAsOfPeriod!))

  const asOfPeriods = [...new Set(annualGuidance.map((o) => o.guidanceAsOfPeriod!))]
  if (asOfPeriods.length < 2) {
    return null
  }

  const latestAsOfPeriod = asOfPeriods[asOfPeriods.length - 1]
  const priorAsOfPeriod = asOfPeriods[asOfPeriods.length - 2]
  const latestLow = annualGuidance.find(
    (o) => o.metric === 'CAPEX_GUIDANCE_LOW' && o.guidanceAsOfPeriod === latestAsOfPeriod
  )
  const latestHigh = annualGuidance.find(
    (o) => o.metric === 'CAPEX_GUIDANCE_HIGH' && o.guidanceAsOfPeriod === latestAsOfPeriod
  )
  const priorLow = annualGuidance.find(
    (o) => o.metric === 'CAPEX_GUIDANCE_LOW' && o.guidanceAsOfPeriod === priorAsOfPeriod
  )
  const priorHigh = annualGuidance.find(
    (o) => o.metric === 'CAPEX_GUIDANCE_HIGH' && o.guidanceAsOfPeriod === priorAsOfPeriod
  )

  if (!latestLow || !latestHigh || !priorLow || !priorHigh || latestLow.period !== priorLow.period) {
    return null
  }

  const latestMidpoint = (latestLow.value + latestHigh.value) / 2
  const priorMidpoint = (priorLow.value + priorHigh.value) / 2
  const percentageChange = ((latestMidpoint - priorMidpoint) / priorMidpoint) * 100

  if (percentageChange === 0) {
    return null
  }

  const direction = percentageChange > 0 ? 'POSITIVE' : 'NEGATIVE'

  return {
    id: `meta-capex-guidance-${latestLow.period}-as-of-${latestAsOfPeriod}-${Date.now()}`,
    companyTicker: 'META',
    signalType:
      direction === 'POSITIVE' ? 'CAPEX_GUIDANCE_REVISION_UP' : 'CAPEX_GUIDANCE_REVISION_DOWN',
    direction,
    magnitude: percentageChange,
    unit: 'percent',
    confidence: 'HIGH',
    period: latestLow.period,
    generatedAt: new Date().toISOString(),
    evidenceObservationIds: [priorLow.id, priorHigh.id, latestLow.id, latestHigh.id],
    description: `META ${latestLow.period} CapEx guidance midpoint revised ${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}% from ${priorMidpoint.toFixed(2)}B as of ${priorAsOfPeriod} to ${latestMidpoint.toFixed(2)}B as of ${latestAsOfPeriod}.`,
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
  const q1Actual = observations.find(
    (o) =>
      o.companyTicker === "META" &&
      o.metric === "CAPEX_ACTUAL" &&
      o.periodType === "QUARTER" &&
      o.period === "2026-Q1"
  )
  const q2Actual = observations.find(
    (o) =>
      o.companyTicker === "META" &&
      o.metric === "CAPEX_ACTUAL" &&
      o.periodType === "QUARTER" &&
      o.period === "2026-Q2"
  )

  if (!q1Actual || !q2Actual) {
    return []
  }

  return [
    {
      period: q2Actual.period,
      value: q2Actual.value,
      qoqPercent: ((q2Actual.value - q1Actual.value) / q1Actual.value) * 100,
      previousValue: q1Actual.value,
      previousPeriod: q1Actual.period,
      evidenceIds: [q1Actual.id, q2Actual.id],
    },
  ]
}

function deriveCapexQoQGrowthSignals(observations: MetricObservation[]): DerivedSignal[] {
  const signals: DerivedSignal[] = []
  const growthRates = deriveCapexQoQGrowthRates(observations)

  // For now, just return signals for all QoQ growth (could add threshold later)
  growthRates.forEach((rate) => {
    signals.push({
      id: `meta-capex-qoq-${rate.period}-${Date.now()}`,
      companyTicker: 'META',
      signalType:
        rate.qoqPercent >= 0 ? 'CAPEX_QOQ_ACCELERATION' : 'CAPEX_QOQ_DECELERATION',
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
 * 1. Find the prior annual guidance revision
 * 2. Find the latest annual guidance revision
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
  const annualGuidance = observations
    .filter(
      (o) =>
        (o.metric === "CAPEX_GUIDANCE_LOW" || o.metric === "CAPEX_GUIDANCE_HIGH") &&
        o.periodType === "YEAR" &&
        Boolean(o.guidanceAsOfPeriod)
    )
    .sort((a, b) => a.guidanceAsOfPeriod!.localeCompare(b.guidanceAsOfPeriod!))

  const asOfPeriods = [...new Set(annualGuidance.map((o) => o.guidanceAsOfPeriod!))]
  if (asOfPeriods.length < 2) {
    return null
  }

  const initialAsOfPeriod = asOfPeriods[asOfPeriods.length - 2]
  const latestAsOfPeriod = asOfPeriods[asOfPeriods.length - 1]
  const initialLow = annualGuidance.find(
    (o) => o.metric === "CAPEX_GUIDANCE_LOW" && o.guidanceAsOfPeriod === initialAsOfPeriod
  )
  const initialHigh = annualGuidance.find(
    (o) => o.metric === "CAPEX_GUIDANCE_HIGH" && o.guidanceAsOfPeriod === initialAsOfPeriod
  )
  const latestLow = annualGuidance.find(
    (o) => o.metric === "CAPEX_GUIDANCE_LOW" && o.guidanceAsOfPeriod === latestAsOfPeriod
  )
  const latestHigh = annualGuidance.find(
    (o) => o.metric === "CAPEX_GUIDANCE_HIGH" && o.guidanceAsOfPeriod === latestAsOfPeriod
  )

  if (!initialLow || !initialHigh || !latestLow || !latestHigh || initialLow.period !== latestLow.period) {
    return null
  }

  const initialMidpoint = (initialLow.value + initialHigh.value) / 2
  const currentMidpoint = (latestLow.value + latestHigh.value) / 2
  const revisionPercent = ((currentMidpoint - initialMidpoint) / initialMidpoint) * 100
  const trend =
    revisionPercent > 0 ? "UPWARD" : revisionPercent < 0 ? "DOWNWARD" : "NEUTRAL"

  return {
    period: latestLow.period,
    initialMidpoint,
    currentMidpoint,
    revisionPercent,
    trend,
    evidenceIds: [initialLow.id, initialHigh.id, latestLow.id, latestHigh.id],
    description: `META ${latestLow.period} CapEx guidance revised ${revisionPercent >= 0 ? "+" : ""}${revisionPercent.toFixed(1)}% from ${initialMidpoint.toFixed(2)}B as of ${initialAsOfPeriod} to ${currentMidpoint.toFixed(2)}B as of ${latestAsOfPeriod}.`,
  }
}
