import type { MetricObservation } from '../types/metric'
import { META_CAPEX_OBSERVATIONS } from '../data/metaCapexMetrics'
import { TSM_METRIC_OBSERVATIONS } from '../data/tsmMetrics'
import { deriveMetaCapexSignals } from './metaCapexSignalInterpreter'
import { derive3MYoYTrend, deriveTsmSignals } from './tsmSignalInterpreter'

export interface SignalIntegrityVerificationResult {
  deterministicIds: string[]
  janToJunMagnitude: number
  rollingPreviousPeriod: string
  rollingCurrentPeriod: string
  missingMonthRejected: boolean
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Signal integrity verification failed: ${message}`)
  }
}

export function verifySignalIntegrity(): SignalIntegrityVerificationResult {
  const firstGeneratedAt = () => '2026-08-13T00:00:00.000Z'
  const secondGeneratedAt = () => '2030-01-01T00:00:00.000Z'
  const firstSignals = [
    ...deriveTsmSignals(TSM_METRIC_OBSERVATIONS, firstGeneratedAt),
    ...deriveMetaCapexSignals(META_CAPEX_OBSERVATIONS, firstGeneratedAt),
  ]
  const secondSignals = [
    ...deriveTsmSignals(TSM_METRIC_OBSERVATIONS, secondGeneratedAt),
    ...deriveMetaCapexSignals(META_CAPEX_OBSERVATIONS, secondGeneratedAt),
  ]
  const firstIds = firstSignals.map((signal) => signal.id)
  const secondIds = secondSignals.map((signal) => signal.id)

  assert(firstIds.length > 0, 'expected derived signals')
  assert(JSON.stringify(firstIds) === JSON.stringify(secondIds), 'IDs changed with generatedAt')
  assert(
    firstSignals.every((signal, index) => signal.generatedAt !== secondSignals[index].generatedAt),
    'verification timestamps were not injected'
  )

  const janToJunTrend = derive3MYoYTrend(TSM_METRIC_OBSERVATIONS)
  assert(janToJunTrend !== null, 'Jan-Jun trend was not derived')
  assert(
    Math.abs(janToJunTrend.magnitude - 3.7666666666666657) < 1e-10,
    'Jan-Jun trend changed from +3.77pp'
  )

  const juneObservation = TSM_METRIC_OBSERVATIONS.find(
    (observation) =>
      observation.metric === 'MONTHLY_REVENUE_YOY_PERCENT' && observation.period === '2026-06'
  )
  assert(juneObservation !== undefined, 'June YoY observation was not found')

  const julyObservation: MetricObservation = {
    ...juneObservation,
    id: 'verification-tsm-2026-07-monthly-revenue-yoy',
    period: '2026-07',
    value: 50,
    publishedAt: '2026-08-10T09:00:00.000Z',
    retrievedAt: '2026-08-13T14:00:00.000Z',
  }
  const withJuly = [...TSM_METRIC_OBSERVATIONS, julyObservation]
  const rollingTrend = derive3MYoYTrend(withJuly)

  assert(rollingTrend !== null, 'Feb-Jul rolling trend was not derived')
  assert(
    rollingTrend.previousPeriod.period === '2026-02-to-2026-04' &&
      rollingTrend.currentPeriod.period === '2026-05-to-2026-07',
    'latest-six window did not roll to Feb-Jul'
  )

  const missingMarch = withJuly.filter(
    (observation) =>
      !(
        observation.metric === 'MONTHLY_REVENUE_YOY_PERCENT' &&
        observation.period === '2026-03'
      )
  )
  const missingMonthRejected = derive3MYoYTrend(missingMarch) === null
  assert(missingMonthRejected, 'non-consecutive latest-six window was accepted')

  return {
    deterministicIds: firstIds,
    janToJunMagnitude: janToJunTrend.magnitude,
    rollingPreviousPeriod: rollingTrend.previousPeriod.period,
    rollingCurrentPeriod: rollingTrend.currentPeriod.period,
    missingMonthRejected,
  }
}
