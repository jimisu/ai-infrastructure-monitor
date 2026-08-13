import type { DerivedSignal } from '../types/derivedSignal'

/**
 * Signal Inspector
 *
 * Development utility for inspecting and formatting derived signals.
 * NOT integrated into the main dashboard.
 * For verification and debugging only.
 */

/**
 * Format a signal for console/dev display
 */
export function formatSignalForInspection(signal: DerivedSignal): string {
  const lines = [
    `═══════════════════════════════════════════════════`,
    `DERIVED SIGNAL: ${signal.signalType}`,
    `═══════════════════════════════════════════════════`,
    `Company: ${signal.companyTicker}`,
    `Period: ${signal.period}`,
    `Direction: ${signal.direction}`,
    `Magnitude: ${signal.magnitude.toFixed(2)} ${signal.unit}`,
    `Confidence: ${signal.confidence}`,
    `Generated: ${signal.generatedAt}`,
    ``,
    `Description:`,
    `${signal.description}`,
    ``,
    `Evidence (Observation IDs):`,
  ]

  signal.evidenceObservationIds.forEach((id, i) => {
    lines.push(`  ${i + 1}. ${id}`)
  })

  lines.push(`═══════════════════════════════════════════════════`)

  return lines.join('\n')
}

/**
 * Format multiple signals for inspection
 */
export function formatSignalsForInspection(signals: DerivedSignal[]): string {
  if (signals.length === 0) {
    return '[No derived signals]'
  }

  return signals.map((signal) => formatSignalForInspection(signal)).join('\n\n')
}

/**
 * Log signals to console (dev only)
 */
export function logSignals(signals: DerivedSignal[]): void {
  if (typeof console !== 'undefined') {
    console.log('\n' + formatSignalsForInspection(signals))
  }
}
