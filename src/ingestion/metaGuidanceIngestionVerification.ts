import canonical from '../../data/ingestion/observations/meta-annual-capex-guidance.json'
import { META_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import { composeMetaCapexObservations, getMetaAnnualGuidanceObservations, META_MANUAL_QUARTERLY_ACTUAL_OBSERVATIONS, META_PRODUCTION_CAPEX_OBSERVATIONS, parseCanonicalMetaGuidanceObservations } from '../data/metaGuidanceObservationProvider'
import { deriveCapexGuidanceRevision, deriveMetaCapexSignals } from '../signals/metaCapexSignalInterpreter'
import { deriveCurrentHyperscalerCapexTrend } from '../signals/hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from '../signals/hyperscalerTsmConfirmationEngine'
import { TSM_PRODUCTION_OBSERVATIONS } from '../data/tsmMonthlyObservationProvider'
import { verifyAmznPpeIngestionParity } from './amznPpeIngestionVerification'
import { verifyTsmMonthlyIngestionParity } from './tsmMonthlyIngestionVerification'
import { verifyGoogCapexSignals } from '../signals/googCapexSignalVerification'
import type { MetricObservation } from '../types/metric'

function assert(condition: boolean, message: string): asserts condition { if (!condition) throw new Error(`META guidance ingestion verification failed: ${message}`) }
const fixedTime = () => '2026-08-14T00:00:00.000Z'
const fact = (item: MetricObservation) => ({ companyTicker: item.companyTicker, metric: item.metric, period: item.period, periodType: item.periodType, guidanceAsOfPeriod: item.guidanceAsOfPeriod, value: item.value, unit: item.unit, sourceId: item.sourceId, capexDefinitionId: item.capexDefinitionId })

export function verifyMetaGuidanceIngestionParity() {
  const manual = getMetaAnnualGuidanceObservations('MANUAL'), ingested = getMetaAnnualGuidanceObservations('INGESTED')
  assert(JSON.stringify(manual.map(fact)) === JSON.stringify(ingested.map(fact)), 'golden factual parity failed')
  const manualInput = composeMetaCapexObservations('MANUAL'), ingestedInput = composeMetaCapexObservations('INGESTED')
  assert(META_PRODUCTION_CAPEX_OBSERVATIONS.length === manualInput.length && META_MANUAL_QUARTERLY_ACTUAL_OBSERVATIONS.length === 2, 'production/manual composition changed')
  const manualSignals = deriveMetaCapexSignals(manualInput, fixedTime), ingestedSignals = deriveMetaCapexSignals(ingestedInput, fixedTime)
  assert(JSON.stringify(manualSignals) === JSON.stringify(ingestedSignals), 'derived signal parity failed')
  const revision = deriveCapexGuidanceRevision(ingestedInput)
  assert(revision !== null && revision.initialMidpoint === 135 && revision.currentMidpoint === 137.5 && Math.abs(revision.revisionPercent - 1.8518518518518516) < 1e-12, 'guidance revision changed')
  const guidanceSignal = ingestedSignals.find((item) => item.signalType === 'CAPEX_GUIDANCE_REVISION_UP')
  assert(guidanceSignal?.direction === 'POSITIVE', 'positive guidance signal missing')
  const manualQoq = manualSignals.find((item) => item.signalType === 'CAPEX_QOQ_ACCELERATION' || item.signalType === 'CAPEX_QOQ_DECELERATION'), ingestedQoq = ingestedSignals.find((item) => item.signalType === 'CAPEX_QOQ_ACCELERATION' || item.signalType === 'CAPEX_QOQ_DECELERATION')
  assert(JSON.stringify(manualQoq) === JSON.stringify(ingestedQoq), 'manual quarterly actual signal changed')
  let missingRejected = false, duplicateRejected = false
  try { parseCanonicalMetaGuidanceObservations(null) } catch { missingRejected = true }
  try { const invalid = structuredClone(canonical); invalid.records.push(structuredClone(invalid.records[0])); parseCanonicalMetaGuidanceObservations(invalid) } catch { duplicateRejected = true }
  assert(missingRejected && duplicateRejected, 'provider did not fail closed')
  const aggregate = deriveCurrentHyperscalerCapexTrend(fixedTime)
  assert(aggregate !== null && aggregate.eligibleCount === 4 && aggregate.positiveCount === 4 && aggregate.direction === 'POSITIVE' && aggregate.confidence === 'HIGH', 'hyperscaler regression failed')
  const cross = deriveHyperscalerTsmConfirmation(aggregate, TSM_PRODUCTION_OBSERVATIONS, fixedTime)
  assert(cross !== null && cross.direction === 'POSITIVE' && cross.alignment === 'CONFIRMED' && cross.confidence === 'HIGH', 'cross-confirmation regression failed')
  const tsm = verifyTsmMonthlyIngestionParity(), amzn = verifyAmznPpeIngestionParity(), others = verifyGoogCapexSignals()
  assert(tsm.crossConfirmationUnchanged && amzn.regressionsPassed && others.metaParity && others.msftParity && others.crossCompanyUnchanged, 'issuer regressions failed')
  return { factualParityCount: ingested.length, capexDefinitionId: META_CAPEX_DEFINITION.id, previousMidpoint: revision.initialMidpoint, currentMidpoint: revision.currentMidpoint, revisionPercent: revision.revisionPercent, signalType: guidanceSignal.signalType, direction: guidanceSignal.direction, deterministicSignalIdStable: guidanceSignal.id === manualSignals.find((item) => item.signalType === guidanceSignal.signalType)?.id, quarterlyActualsRemainManual: true, providerMode: 'INGESTED', noDoubleCounting: true, missingCanonicalRejected: missingRejected, duplicateCanonicalRejected: duplicateRejected, hyperscaler: { eligible: aggregate.eligibleCount, positive: aggregate.positiveCount, direction: aggregate.direction, confidence: aggregate.confidence }, cross: { direction: cross.direction, alignment: cross.alignment, confidence: cross.confidence }, issuerRegressionsPassed: true }
}
