/**
 * Signal Rules Configuration
 *
 * Centralized threshold definitions for all signal derivation rules.
 * All business logic thresholds should be defined here, not hard-coded
 * in individual signal functions.
 *
 * IMPORTANT: Changing these values requires re-running derivation logic.
 * These are deterministic rules applied consistently to all observations.
 */

/**
 * Revenue Outlook Threshold
 *
 * Used to determine if quarterly guidance represents acceleration or deceleration
 * versus actual prior quarter results.
 *
 * Threshold: ±2 percentage points
 * - > +2%: POSITIVE (accelerating)
 * - < -2%: NEGATIVE (decelerating)
 * - between: NEUTRAL (flat)
 */
export const REVENUE_OUTLOOK_NEUTRAL_THRESHOLD = 2

/**
 * Monthly Revenue YoY Growth Acceleration Threshold
 *
 * Used to determine if YoY growth rate is significantly accelerating or decelerating
 * month-over-month.
 *
 * Threshold: ±3 percentage points
 * - > +3pp: POSITIVE (growth accelerating)
 * - < -3pp: NEGATIVE (growth decelerating)
 * - between: NEUTRAL (stable)
 */
export const MONTHLY_YOY_ACCELERATION_THRESHOLD = 3

/**
 * 3-Month Trend Acceleration Threshold
 *
 * Used to determine if the average YoY growth rate of the current 3-month period
 * is significantly higher or lower than the previous 3-month period.
 *
 * Threshold: ±3 percentage points
 * - current 3M avg - previous 3M avg > +3pp: ACCELERATING
 * - current 3M avg - previous 3M avg < -3pp: DECELERATING
 * - between: STABLE
 */
export const TREND_ACCELERATION_THRESHOLD = 3

/**
 * Confidence Levels
 *
 * Used when combining multiple signals to determine overall confidence.
 */
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW'

/**
 * Trend Direction
 */
export type TrendDirection = 'ACCELERATING' | 'STABLE' | 'DECELERATING'

/**
 * Signal Confirmation Result
 *
 * When combining historical trend with forward outlook:
 */
export interface SignalConfirmation {
  level: ConfidenceLevel
  historical: {
    direction: TrendDirection
    magnitude: number // e.g., +3.77 percentage points
    period: string // e.g., "2026-Q1-vs-Q2"
  }
  forward: {
    direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
    magnitude: number // e.g., +12.44 percent
    period: string // e.g., "2026-Q3 guidance"
  }
  alignment: 'CONFIRMED' | 'CONFLICTING' | 'PARTIAL'
  description: string
  evidenceIds: string[]
}
