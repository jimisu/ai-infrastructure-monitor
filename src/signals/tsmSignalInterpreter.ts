import type { MetricObservation } from '../types/metric'
import type { DerivedSignal } from '../types/derivedSignal'
import {
  REVENUE_OUTLOOK_NEUTRAL_THRESHOLD,
  MONTHLY_YOY_ACCELERATION_THRESHOLD,
  TREND_ACCELERATION_THRESHOLD,
  type ConfidenceLevel,
  type TrendDirection,
  type SignalConfirmation,
} from '../config/signalRules'

/**
 * TSMC Signal Interpreter
 *
 * Pure function that derives deterministic signals from observations.
 * No side effects, no global state, no interpretation.
 * Only mathematics and fact.
 *
 * All business thresholds are defined in src/config/signalRules.ts
 */

/**
 * Derive all TSMC signals from observations
 */
export function deriveTsmSignals(observations: MetricObservation[]): DerivedSignal[] {
  const signals: DerivedSignal[] = []

  // Attempt to derive Q3 revenue outlook signal
  const outlookSignal = deriveQ3RevenueOutlookSignal(observations)
  if (outlookSignal) {
    signals.push(outlookSignal)
  }

  // Attempt to derive monthly revenue growth acceleration/deceleration signals
  const growthSignals = deriveRevenueGrowthAccelerationSignals(observations)
  signals.push(...growthSignals)

  return signals
}

/**
 * Derive all TSMC signals with trend confirmation
 *
 * This is the enhanced version that includes:
 * - Q3 revenue outlook signal (forward-looking)
 * - Monthly YoY growth acceleration signals
 * - 3M YoY trend (historical)
 * - Signal confirmation combining historical + forward
 *
 * Returns both individual signals and confirmation metadata
 */
export interface TrendEngineResult {
  signals: DerivedSignal[]
  trend3M: Trend3M | null
  confirmation: SignalConfirmation | null
}

export function deriveTsmSignalsWithTrendConfirmation(
  observations: MetricObservation[]
): TrendEngineResult {
  // Get all base signals
  const signals = deriveTsmSignals(observations)

  // Derive 3M trend
  const trend3M = derive3MYoYTrend(observations)

  // Find the forward outlook signal for confirmation
  const outlookSignal = signals.find((s) => s.signalType === 'REVENUE_OUTLOOK_ACCELERATION')

  // Confirm signals
  const confirmation = confirmSignals(trend3M, outlookSignal || null)

  return {
    signals,
    trend3M,
    confirmation,
  }
}

/**
 * Derive Q3 2026 revenue outlook signal
 *
 * Logic:
 * 1. Find Q2 2026 actual quarterly revenue
 * 2. Find Q3 2026 guidance low and high
 * 3. Calculate guidance midpoint: (low + high) / 2
 * 4. Calculate % change: (midpoint - q2Actual) / q2Actual * 100
 * 5. Determine direction based on % change
 * 6. Return signal with evidence IDs
 */
function deriveQ3RevenueOutlookSignal(observations: MetricObservation[]): DerivedSignal | null {
  // Find required observations
  const q2ActualObs = observations.find(
    (o) => o.metric === 'QUARTERLY_REVENUE' && o.period === '2026-Q2'
  )
  const q3GuidanceLowObs = observations.find(
    (o) => o.metric === 'REVENUE_GUIDANCE_LOW' && o.period === '2026-Q3'
  )
  const q3GuidanceHighObs = observations.find(
    (o) => o.metric === 'REVENUE_GUIDANCE_HIGH' && o.period === '2026-Q3'
  )

  // If any required observation is missing, return null
  if (!q2ActualObs || !q3GuidanceLowObs || !q3GuidanceHighObs) {
    return null
  }

  // Calculate midpoint
  const q2Actual = q2ActualObs.value
  const q3GuidanceLow = q3GuidanceLowObs.value
  const q3GuidanceHigh = q3GuidanceHighObs.value
  const q3Midpoint = (q3GuidanceLow + q3GuidanceHigh) / 2

  // Calculate percentage change
  const percentageChange = ((q3Midpoint - q2Actual) / q2Actual) * 100

  // Determine direction using centralized threshold
  let direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  if (percentageChange > REVENUE_OUTLOOK_NEUTRAL_THRESHOLD) {
    // Threshold from signalRules.ts: > 2% is acceleration
    direction = 'POSITIVE'
  } else if (percentageChange < -REVENUE_OUTLOOK_NEUTRAL_THRESHOLD) {
    // Threshold from signalRules.ts: < -2% is deceleration
    direction = 'NEGATIVE'
  } else {
    // Approximately flat
    direction = 'NEUTRAL'
  }

  return {
    id: `tsm-q3-2026-revenue-outlook-${Date.now()}`,
    companyTicker: 'TSM',
    signalType: 'REVENUE_OUTLOOK_ACCELERATION',
    direction,
    magnitude: percentageChange,
    unit: 'percent',
    confidence: 'HIGH', // Official guidance vs actual results
    period: '2026-Q3',
    generatedAt: new Date().toISOString(),
    evidenceObservationIds: [q2ActualObs.id, q3GuidanceLowObs.id, q3GuidanceHighObs.id],
    description: `TSMC Q3 2026 revenue guidance midpoint is ${q3Midpoint.toFixed(2)} USD billion, ${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}% versus Q2 2026 actual revenue of ${q2Actual.toFixed(2)} USD billion.`,
  }
}

/**
 * Derive revenue growth acceleration/deceleration signals
 *
 * Logic:
 * 1. Find all monthly YoY observations sorted by period
 * 2. For each month (starting from the 2nd), compare current YoY to previous YoY
 * 3. Calculate MoM YoY change: currentYoY - previousYoY
 * 4. Determine direction based on YoY acceleration
 * 5. Return signal with evidence IDs
 *
 * Note: No AI attribution. This is pure factual revenue growth comparison.
 */
export function deriveRevenueGrowthAccelerationSignals(
  observations: MetricObservation[]
): DerivedSignal[] {
  const signals: DerivedSignal[] = []

  // Find all monthly YoY observations and sort by period
  const yoyObservations = observations
    .filter((o) => o.metric === 'MONTHLY_REVENUE_YOY_PERCENT' && o.periodType === 'MONTH')
    .sort((a, b) => a.period.localeCompare(b.period))

  // Need at least 2 months to detect acceleration
  if (yoyObservations.length < 2) {
    return signals
  }

  // For each month starting from index 1, compare to previous month
  for (let i = 1; i < yoyObservations.length; i++) {
    const prevObs = yoyObservations[i - 1]
    const currObs = yoyObservations[i]

    const prevYoY = prevObs.value
    const currYoY = currObs.value
    const yoyChange = currYoY - prevYoY // Acceleration: positive means YoY is increasing

    // Determine direction based on YoY acceleration
    // Only signal if acceleration is significant (threshold from signalRules.ts: > 3pp)
    let direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
    if (yoyChange > MONTHLY_YOY_ACCELERATION_THRESHOLD) {
      direction = 'POSITIVE' // Growth rate is accelerating
    } else if (yoyChange < -MONTHLY_YOY_ACCELERATION_THRESHOLD) {
      direction = 'NEGATIVE' // Growth rate is decelerating
    } else {
      direction = 'NEUTRAL' // Approximately flat
    }

    // Only emit signals for significant changes
    if (direction !== 'NEUTRAL') {
      signals.push({
        id: `tsm-revenue-growth-${currObs.period}-${Date.now()}`,
        companyTicker: 'TSM',
        signalType:
          direction === 'POSITIVE'
            ? 'REVENUE_GROWTH_ACCELERATION'
            : 'REVENUE_GROWTH_DECELERATION',
        direction,
        magnitude: yoyChange,
        unit: 'percent',
        confidence: 'HIGH', // Official monthly data vs prior month
        period: currObs.period,
        generatedAt: new Date().toISOString(),
        evidenceObservationIds: [prevObs.id, currObs.id],
        description: `TSMC ${currObs.period} YoY growth ${currYoY.toFixed(1)}% vs ${prevObs.period} ${prevYoY.toFixed(1)}%, ${direction === 'POSITIVE' ? 'accelerating' : 'decelerating'} by ${Math.abs(yoyChange).toFixed(1)}%.`,
      })
    }
  }

  return signals
}

/**
 * Derive MoM growth rates from monthly revenue observations
 *
 * Logic:
 * 1. Find all monthly revenue observations sorted by period
 * 2. For each month (starting from 2nd), calculate: (currentRevenue - previousRevenue) / previousRevenue * 100
 * 3. Return derived MoM growth rate (not as a signal, but as a derived metric)
 *
 * Returns array of derived growth rates with evidence IDs for dashboard/analysis
 */
export interface DerivedGrowthRate {
  period: string // e.g. "2026-02"
  mom_percent: number // Month-over-month growth percentage
  yoy_percent: number // Year-over-year growth percentage from observation
  evidenceIds: string[] // [previousMonthRevenueId, currentMonthRevenueId, currentMonthYoYId]
}

export function deriveMoMGrowthRates(observations: MetricObservation[]): DerivedGrowthRate[] {
  const rates: DerivedGrowthRate[] = []

  // Find all monthly revenue observations and sort by period
  const revenueObservations = observations
    .filter((o) => o.metric === 'MONTHLY_REVENUE' && o.periodType === 'MONTH')
    .sort((a, b) => a.period.localeCompare(b.period))

  // Need at least 2 months to calculate MoM
  if (revenueObservations.length < 2) {
    return rates
  }

  // For each month starting from index 1, calculate MoM
  for (let i = 1; i < revenueObservations.length; i++) {
    const prevObs = revenueObservations[i - 1]
    const currObs = revenueObservations[i]
    const currPeriod = currObs.period

    // Find corresponding YoY observation for current month
    const yoyObs = observations.find(
      (o) => o.metric === 'MONTHLY_REVENUE_YOY_PERCENT' && o.period === currPeriod
    )

    if (!yoyObs) continue // Skip if YoY data not available

    const prevRevenue = prevObs.value
    const currRevenue = currObs.value
    const momPercent = ((currRevenue - prevRevenue) / prevRevenue) * 100
    const yoyPercent = yoyObs.value

    rates.push({
      period: currPeriod,
      mom_percent: momPercent,
      yoy_percent: yoyPercent,
      evidenceIds: [prevObs.id, currObs.id, yoyObs.id],
    })
  }

  return rates
}

/**
 * Derive 3-Month YoY Growth Trend
 *
 * Logic:
 * 1. Find all monthly YoY observations sorted by period
 * 2. Calculate average YoY for previous 3 months (months 1-3)
 * 3. Calculate average YoY for current 3 months (months 4-6)
 * 4. Calculate delta: current avg - previous avg
 * 5. Determine trend direction based on delta vs threshold
 * 6. Return trend with evidence IDs for full audit trail
 *
 * Threshold from signalRules.ts:
 * - delta > +3pp: ACCELERATING
 * - delta < -3pp: DECELERATING
 * - otherwise: STABLE
 */
export interface Trend3M {
  direction: TrendDirection
  magnitude: number // delta in percentage points
  previousPeriod: {
    period: string // e.g., "2026-01-to-03"
    avgYoY: number // average YoY growth %
    observations: MetricObservation[]
  }
  currentPeriod: {
    period: string // e.g., "2026-04-to-06"
    avgYoY: number // average YoY growth %
    observations: MetricObservation[]
  }
  evidenceIds: string[]
  description: string
}

export function derive3MYoYTrend(observations: MetricObservation[]): Trend3M | null {
  // Find all monthly YoY observations sorted by period
  const yoyObservations = observations
    .filter((o) => o.metric === 'MONTHLY_REVENUE_YOY_PERCENT' && o.periodType === 'MONTH')
    .sort((a, b) => a.period.localeCompare(b.period))

  // Need at least 6 months to calculate 3M vs 3M trend
  if (yoyObservations.length < 6) {
    return null
  }

  // Previous 3 months (first 3 observations)
  const prevPeriodObs = yoyObservations.slice(0, 3)
  const prevPeriodAvg =
    prevPeriodObs.reduce((sum, o) => sum + o.value, 0) / prevPeriodObs.length

  // Current 3 months (observations 3-5, since we have 6 total: 0-5)
  const currPeriodObs = yoyObservations.slice(3, 6)
  const currPeriodAvg =
    currPeriodObs.reduce((sum, o) => sum + o.value, 0) / currPeriodObs.length

  // Calculate delta
  const delta = currPeriodAvg - prevPeriodAvg

  // Determine trend direction using centralized threshold
  let direction: TrendDirection
  if (delta > TREND_ACCELERATION_THRESHOLD) {
    direction = 'ACCELERATING'
  } else if (delta < -TREND_ACCELERATION_THRESHOLD) {
    direction = 'DECELERATING'
  } else {
    direction = 'STABLE'
  }

  // Build evidence IDs list
  const evidenceIds = [...prevPeriodObs, ...currPeriodObs].map((o) => o.id)

  // Get period labels
  const prevPeriod = `${prevPeriodObs[0].period}-to-${prevPeriodObs[2].period}`
  const currPeriod = `${currPeriodObs[0].period}-to-${currPeriodObs[2].period}`

  return {
    direction,
    magnitude: delta,
    previousPeriod: {
      period: prevPeriod,
      avgYoY: prevPeriodAvg,
      observations: prevPeriodObs,
    },
    currentPeriod: {
      period: currPeriod,
      avgYoY: currPeriodAvg,
      observations: currPeriodObs,
    },
    evidenceIds,
    description: `TSMC 3M YoY trend: previous 3M average ${prevPeriodAvg.toFixed(2)}% vs current 3M average ${currPeriodAvg.toFixed(2)}%, ${direction.toLowerCase()} by ${Math.abs(delta).toFixed(2)}pp.`,
  }
}

/**
 * Confirm Signals by Combining Historical Trend with Forward Outlook
 *
 * Logic:
 * 1. Compare historical trend direction with forward outlook direction
 * 2. Determine confidence level based on alignment
 * 3. Return confirmation with alignment status and evidence
 *
 * Confidence Rules:
 * - CONFIRMED: Historical and forward same direction (HIGH confidence)
 * - PARTIAL: Only one signal available (MEDIUM confidence)
 * - CONFLICTING: Historical and forward opposite directions (LOW confidence)
 */
export function confirmSignals(
  historicalTrend: Trend3M | null,
  forwardOutlook: DerivedSignal | null
): SignalConfirmation | null {
  // Need at least one signal
  if (!historicalTrend && !forwardOutlook) {
    return null
  }

  // If only one available, return MEDIUM confidence
  if (!historicalTrend && forwardOutlook) {
    return {
      level: 'MEDIUM',
      historical: {
        direction: 'STABLE',
        magnitude: 0,
        period: 'N/A',
      },
      forward: {
        direction: (forwardOutlook.direction as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL') || 'NEUTRAL',
        magnitude: forwardOutlook.magnitude,
        period: forwardOutlook.period,
      },
      alignment: 'PARTIAL',
      description: 'Only forward-looking guidance available. Historical trend data insufficient.',
      evidenceIds: forwardOutlook.evidenceObservationIds,
    }
  }

  if (historicalTrend && !forwardOutlook) {
    return {
      level: 'MEDIUM',
      historical: {
        direction: historicalTrend.direction,
        magnitude: historicalTrend.magnitude,
        period: historicalTrend.currentPeriod.period,
      },
      forward: {
        direction: 'NEUTRAL',
        magnitude: 0,
        period: 'N/A',
      },
      alignment: 'PARTIAL',
      description: 'Only historical trend available. Forward guidance data insufficient.',
      evidenceIds: historicalTrend.evidenceIds,
    }
  }

  // Both available - compare directions
  // Normalize directions for comparison
  const historicalDir =
    historicalTrend!.direction === 'ACCELERATING'
      ? 'POSITIVE'
      : historicalTrend!.direction === 'DECELERATING'
        ? 'NEGATIVE'
        : 'NEUTRAL'

  const forwardDir = forwardOutlook!.direction

  // Determine alignment
  const isSameDirection = historicalDir === forwardDir && forwardDir !== 'NEUTRAL'
  const isConflicting = historicalDir !== 'NEUTRAL' && forwardDir !== 'NEUTRAL' && historicalDir !== forwardDir

  let alignment: 'CONFIRMED' | 'CONFLICTING' | 'PARTIAL'
  let level: ConfidenceLevel
  let descriptionSuffix: string

  if (isSameDirection) {
    alignment = 'CONFIRMED'
    level = 'HIGH'
    descriptionSuffix = `Historical trend (${historicalTrend!.direction.toLowerCase()}) confirms forward outlook (${forwardDir.toLowerCase()}).`
  } else if (isConflicting) {
    alignment = 'CONFLICTING'
    level = 'LOW'
    descriptionSuffix = `Historical trend (${historicalTrend!.direction.toLowerCase()}) conflicts with forward outlook (${forwardDir.toLowerCase()}).`
  } else {
    alignment = 'PARTIAL'
    level = 'MEDIUM'
    descriptionSuffix = 'One signal directional, other signal stable or neutral.'
  }

  return {
    level,
    historical: {
      direction: historicalTrend!.direction,
      magnitude: historicalTrend!.magnitude,
      period: historicalTrend!.currentPeriod.period,
    },
    forward: {
      direction: forwardDir,
      magnitude: forwardOutlook!.magnitude,
      period: forwardOutlook!.period,
    },
    alignment,
    description: descriptionSuffix,
    evidenceIds: [...historicalTrend!.evidenceIds, ...forwardOutlook!.evidenceObservationIds],
  }
}
