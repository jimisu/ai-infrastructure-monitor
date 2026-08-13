/**
 * Signal Derivation Verification
 *
 * Simple verification utilities to test signal derivation logic.
 * No test framework - just pure functions.
 */

import { deriveTsmSignals, deriveTsmSignalsWithTrendConfirmation, derive3MYoYTrend } from './tsmSignalInterpreter'
import { TSM_METRIC_OBSERVATIONS } from '../data/tsmMetrics'
import { deriveMetaCapexSignals, deriveCapexQoQGrowthRates, deriveCapexGuidanceRevision } from './metaCapexSignalInterpreter'
import { META_CAPEX_OBSERVATIONS } from '../data/metaCapexMetrics'
import { getSourceById } from '../data/sources'

/**
 * Verify TSMC signal derivation
 * Returns human-readable verification report
 */
export function verifyTsmSignalDerivation(): string {
  const lines: string[] = []

  lines.push('╔════════════════════════════════════════════════════════════╗')
  lines.push('║  TSMC SIGNAL DERIVATION VERIFICATION                       ║')
  lines.push('╚════════════════════════════════════════════════════════════╝')
  lines.push('')

  // Input observations
  lines.push('INPUT OBSERVATIONS:')
  lines.push('─'.repeat(60))

  const q2Revenue = TSM_METRIC_OBSERVATIONS.find(
    (o) => o.metric === 'QUARTERLY_REVENUE' && o.period === '2026-Q2'
  )
  const q3GuidanceLow = TSM_METRIC_OBSERVATIONS.find(
    (o) => o.metric === 'REVENUE_GUIDANCE_LOW' && o.period === '2026-Q3'
  )
  const q3GuidanceHigh = TSM_METRIC_OBSERVATIONS.find(
    (o) => o.metric === 'REVENUE_GUIDANCE_HIGH' && o.period === '2026-Q3'
  )

  if (q2Revenue) {
    lines.push(`✓ Q2 2026 Actual Revenue: ${q2Revenue.value} ${q2Revenue.unit}`)
    lines.push(`  Observation ID: ${q2Revenue.id}`)
    lines.push(`  Source: ${getSourceById(q2Revenue.sourceId)?.name || 'Unknown'}`)
  } else {
    lines.push('✗ Q2 2026 Actual Revenue: NOT FOUND')
  }

  if (q3GuidanceLow) {
    lines.push(`✓ Q3 2026 Guidance Low: ${q3GuidanceLow.value} ${q3GuidanceLow.unit}`)
    lines.push(`  Observation ID: ${q3GuidanceLow.id}`)
  } else {
    lines.push('✗ Q3 2026 Guidance Low: NOT FOUND')
  }

  if (q3GuidanceHigh) {
    lines.push(`✓ Q3 2026 Guidance High: ${q3GuidanceHigh.value} ${q3GuidanceHigh.unit}`)
    lines.push(`  Observation ID: ${q3GuidanceHigh.id}`)
  } else {
    lines.push('✗ Q3 2026 Guidance High: NOT FOUND')
  }

  lines.push('')
  lines.push('CALCULATION:')
  lines.push('─'.repeat(60))

  if (q2Revenue && q3GuidanceLow && q3GuidanceHigh) {
    const midpoint = (q3GuidanceLow.value + q3GuidanceHigh.value) / 2
    const percentChange = ((midpoint - q2Revenue.value) / q2Revenue.value) * 100

    lines.push(`Q3 Guidance Midpoint = (${q3GuidanceLow.value} + ${q3GuidanceHigh.value}) / 2`)
    lines.push(`                     = ${midpoint.toFixed(2)} USD billion`)
    lines.push('')
    lines.push(`Percentage Change = (${midpoint.toFixed(2)} - ${q2Revenue.value}) / ${q2Revenue.value} × 100`)
    lines.push(`                  = ${percentChange.toFixed(2)}%`)
    lines.push('')

    if (percentChange > 2) {
      lines.push(`Direction: POSITIVE (midpoint > Q2 actual + 2% threshold)`)
    } else if (percentChange < -2) {
      lines.push(`Direction: NEGATIVE (midpoint < Q2 actual - 2% threshold)`)
    } else {
      lines.push(`Direction: NEUTRAL (midpoint ≈ Q2 actual)`)
    }
  } else {
    lines.push('⚠ Cannot calculate: missing required observations')
  }

  lines.push('')
  lines.push('DERIVED SIGNALS:')
  lines.push('─'.repeat(60))

  const signals = deriveTsmSignals(TSM_METRIC_OBSERVATIONS)
  if (signals.length > 0) {
    signals.forEach((signal, i) => {
      lines.push(`Signal ${i + 1}: ${signal.signalType}`)
      lines.push(`  Direction: ${signal.direction}`)
      lines.push(`  Magnitude: ${signal.magnitude.toFixed(2)} ${signal.unit}`)
      lines.push(`  Description: ${signal.description}`)
      lines.push(`  Evidence: ${signal.evidenceObservationIds.join(', ')}`)
      lines.push('')
    })
  } else {
    lines.push('⚠ No signals derived')
  }

  lines.push('╚════════════════════════════════════════════════════════════╝')

  return lines.join('\n')
}

/**
 * Verify 3M Trend Engine
 * Returns human-readable verification report including confirmation
 */
export function verifyTrendEngine(): string {
  const lines: string[] = []

  lines.push('╔════════════════════════════════════════════════════════════╗')
  lines.push('║  TSMC TREND ENGINE v0.1 - VERIFICATION                    ║')
  lines.push('╚════════════════════════════════════════════════════════════╝')
  lines.push('')

  lines.push('MONTHLY YOY DATA (Input):')
  lines.push('─'.repeat(60))

  const monthlyYoYObs = TSM_METRIC_OBSERVATIONS.filter(
    (o) => o.metric === 'MONTHLY_REVENUE_YOY_PERCENT'
  ).sort((a, b) => a.period.localeCompare(b.period))

  monthlyYoYObs.forEach((obs) => {
    lines.push(`${obs.period}: ${obs.value}% (ObsID: ${obs.id})`)
  })

  lines.push('')
  lines.push('3M TREND CALCULATION:')
  lines.push('─'.repeat(60))

  const trend3M = derive3MYoYTrend(TSM_METRIC_OBSERVATIONS)

  if (trend3M) {
    const prevObs = trend3M.previousPeriod.observations
    const currObs = trend3M.currentPeriod.observations

    lines.push(`Previous 3M (${trend3M.previousPeriod.period}):`)
    prevObs.forEach((obs) => {
      lines.push(`  ${obs.period}: ${obs.value}%`)
    })
    lines.push(`  Average: ${trend3M.previousPeriod.avgYoY.toFixed(2)}%`)

    lines.push('')
    lines.push(`Current 3M (${trend3M.currentPeriod.period}):`)
    currObs.forEach((obs) => {
      lines.push(`  ${obs.period}: ${obs.value}%`)
    })
    lines.push(`  Average: ${trend3M.currentPeriod.avgYoY.toFixed(2)}%`)

    lines.push('')
    lines.push(`Delta = ${trend3M.currentPeriod.avgYoY.toFixed(2)} - ${trend3M.previousPeriod.avgYoY.toFixed(2)} = ${trend3M.magnitude.toFixed(2)}pp`)
    lines.push(`Threshold: ±3pp | Derived Direction: ${trend3M.direction}`)
    lines.push('')
    lines.push(`Description: ${trend3M.description}`)
  } else {
    lines.push('⚠ Cannot derive 3M trend: insufficient monthly observations')
  }

  lines.push('')
  lines.push('SIGNAL CONFIRMATION:')
  lines.push('─'.repeat(60))

  const result = deriveTsmSignalsWithTrendConfirmation(TSM_METRIC_OBSERVATIONS)

  if (result.confirmation) {
    const conf = result.confirmation
    lines.push(`Confirmation Level: ${conf.level}`)
    lines.push(`Alignment: ${conf.alignment}`)
    lines.push('')
    lines.push('Historical Trend:')
    lines.push(`  Direction: ${conf.historical.direction}`)
    lines.push(`  Magnitude: ${conf.historical.magnitude.toFixed(2)}pp`)
    lines.push(`  Period: ${conf.historical.period}`)
    lines.push('')
    lines.push('Forward Outlook:')
    lines.push(`  Direction: ${conf.forward.direction}`)
    lines.push(`  Magnitude: ${conf.forward.magnitude.toFixed(2)}%`)
    lines.push(`  Period: ${conf.forward.period}`)
    lines.push('')
    lines.push(`Confirmation: ${conf.description}`)
    lines.push('')
    lines.push(`Evidence IDs (${conf.evidenceIds.length}):`)
    conf.evidenceIds.forEach((id) => {
      lines.push(`  - ${id}`)
    })
  } else {
    lines.push('⚠ Cannot confirm signals: insufficient data')
  }

  lines.push('╚════════════════════════════════════════════════════════════╝')

  return lines.join('\n')
}

/**
 * Verify META CapEx signal derivation
 * Returns human-readable verification report
 */
export function verifyMetaCapexSignalDerivation(): string {
  const lines: string[] = []

  lines.push('╔════════════════════════════════════════════════════════════╗')
  lines.push('║  META CAPEX ENGINE v0.1 - VERIFICATION                    ║')
  lines.push('╚════════════════════════════════════════════════════════════╝')
  lines.push('')

  lines.push('GUIDANCE AND ACTUAL OBSERVATIONS:')
  lines.push('─'.repeat(60))

  // Show all observations grouped by type
  const guidanceLows = META_CAPEX_OBSERVATIONS.filter((o) => o.metric === 'CAPEX_GUIDANCE_LOW')
  const guidanceHighs = META_CAPEX_OBSERVATIONS.filter((o) => o.metric === 'CAPEX_GUIDANCE_HIGH')
  const actuals = META_CAPEX_OBSERVATIONS.filter((o) => o.metric === 'CAPEX_ACTUAL')

  const periods = new Set([...guidanceLows, ...guidanceHighs, ...actuals].map((o) => o.period))
  const sortedPeriods = Array.from(periods).sort()

  sortedPeriods.forEach((period) => {
    lines.push(`\n${period}:`)
    const lowObs = guidanceLows.find((o) => o.period === period)
    const highObs = guidanceHighs.find((o) => o.period === period)
    const actualObs = actuals.find((o) => o.period === period)

    if (lowObs && highObs) {
      const midpoint = (lowObs.value + highObs.value) / 2
      lines.push(`  Guidance: ${lowObs.value.toFixed(1)}B–${highObs.value.toFixed(1)}B (midpoint ${midpoint.toFixed(2)}B)`)
    } else if (lowObs) {
      lines.push(`  Guidance Low: ${lowObs.value.toFixed(1)}B`)
    } else if (highObs) {
      lines.push(`  Guidance High: ${highObs.value.toFixed(1)}B`)
    }

    if (actualObs) {
      lines.push(`  Actual: ${actualObs.value.toFixed(2)}B`)
    }
  })

  lines.push('')
  lines.push('DERIVED SIGNALS:')
  lines.push('─'.repeat(60))

  const signals = deriveMetaCapexSignals(META_CAPEX_OBSERVATIONS)
  if (signals.length > 0) {
    signals.forEach((signal, i) => {
      lines.push(`Signal ${i + 1}: ${signal.signalType}`)
      lines.push(`  Period: ${signal.period}`)
      lines.push(`  Direction: ${signal.direction}`)
      lines.push(`  Magnitude: ${signal.magnitude.toFixed(2)} ${signal.unit}`)
      lines.push(`  Description: ${signal.description}`)
      lines.push('')
    })
  } else {
    lines.push('⚠ No signals derived')
  }

  lines.push('QoQ GROWTH RATES:')
  lines.push('─'.repeat(60))

  const growthRates = deriveCapexQoQGrowthRates(META_CAPEX_OBSERVATIONS)
  if (growthRates.length > 0) {
    growthRates.forEach((rate) => {
      lines.push(`${rate.period}: ${rate.value.toFixed(2)}B, ${rate.qoqPercent >= 0 ? '+' : ''}${rate.qoqPercent.toFixed(1)}% vs ${rate.previousPeriod}`)
    })
  } else {
    lines.push('⚠ No QoQ growth data available')
  }

  lines.push('')
  lines.push('GUIDANCE REVISION ANALYSIS:')
  lines.push('─'.repeat(60))

  const revision = deriveCapexGuidanceRevision(META_CAPEX_OBSERVATIONS)
  if (revision) {
    lines.push(`Initial 2026 Full-Year Midpoint: ${revision.initialMidpoint.toFixed(2)}B`)
    lines.push(`Current ${revision.period} Midpoint: ${revision.currentMidpoint.toFixed(2)}B`)
    lines.push(`Revision: ${revision.revisionPercent >= 0 ? '+' : ''}${revision.revisionPercent.toFixed(1)}%`)
    lines.push(`Trend: ${revision.trend}`)
    lines.push(`\nDescription: ${revision.description}`)
  } else {
    lines.push('⚠ Cannot calculate guidance revision: insufficient data')
  }

  lines.push('')
  lines.push('╚════════════════════════════════════════════════════════════╝')

  return lines.join('\n')
}
