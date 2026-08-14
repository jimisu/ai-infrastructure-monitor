import canonical from '../../data/ingestion/observations/goog-annual-capex-guidance.json'
import { GOOG_REPORTED_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import { GOOG_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { composeGoogCapexObservations, getGoogCapexGuidanceObservations, GOOG_MANUAL_NON_GUIDANCE_OBSERVATIONS, GOOG_PRODUCTION_CAPEX_OBSERVATIONS, parseCanonicalGoogGuidanceObservations } from '../data/googCapexGuidanceObservationProvider'
import { TSM_PRODUCTION_OBSERVATIONS } from '../data/tsmMonthlyObservationProvider'
import { deriveCompanyCapexForwardImpliedYoYGrowth, deriveCompanyCapexGuidanceRevisionChain, normalizeCapexObservations } from '../signals/companyCapexSignalEngine'
import { verifyMetaCompanyCapexParity } from '../signals/companyCapexSignalParityVerification'
import { deriveCurrentHyperscalerCapexTrend } from '../signals/hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from '../signals/hyperscalerTsmConfirmationEngine'
import { verifyMsftCapexYoYTrends } from '../signals/msftCapexYoYVerification'
import type { MetricObservation } from '../types/metric'
import { verifyAmznPpeIngestionParity } from './amznPpeIngestionVerification'
import { verifyTsmMonthlyIngestionParity } from './tsmMonthlyIngestionVerification'

function assert(condition: boolean, message: string): asserts condition { if (!condition) throw new Error(`GOOG guidance ingestion verification failed: ${message}`) }
const fixedTime = () => '2026-08-14T00:00:00.000Z'
const fact = (x: MetricObservation) => ({ companyTicker: x.companyTicker, metric: x.metric, period: x.period, periodType: x.periodType, guidanceAsOfPeriod: x.guidanceAsOfPeriod, value: x.value, unit: x.unit, capexDefinitionId: x.capexDefinitionId, approximate: x.approximate ?? false, sourceId: x.sourceId })

export function verifyGoogGuidanceIngestionParity() {
  const manual = getGoogCapexGuidanceObservations('MANUAL'), ingested = getGoogCapexGuidanceObservations('INGESTED')
  assert(JSON.stringify(manual.map(fact)) === JSON.stringify(ingested.map(fact)), 'golden factual parity failed')
  assert(GOOG_MANUAL_NON_GUIDANCE_OBSERVATIONS.length === 3 && GOOG_PRODUCTION_CAPEX_OBSERVATIONS.length === 10, 'production composition changed')
  const derive = (mode: 'MANUAL' | 'INGESTED') => { const normalized = normalizeCapexObservations(composeGoogCapexObservations(mode), GOOG_CAPEX_PROFILE, [GOOG_REPORTED_CAPEX_DEFINITION]); return { revisions: deriveCompanyCapexGuidanceRevisionChain(normalized, GOOG_CAPEX_PROFILE, GOOG_REPORTED_CAPEX_DEFINITION.id, fixedTime), forward: deriveCompanyCapexForwardImpliedYoYGrowth(normalized, GOOG_CAPEX_PROFILE, GOOG_REPORTED_CAPEX_DEFINITION.id, fixedTime) } }
  const manualResult = derive('MANUAL'), ingestedResult = derive('INGESTED')
  assert(JSON.stringify(manualResult) === JSON.stringify(ingestedResult), 'derived signal parity failed')
  assert(ingestedResult.revisions.length === 2 && Math.abs(ingestedResult.revisions[0].revisionPercent - 13.333333333333334) < 1e-12 && Math.abs(ingestedResult.revisions[1].revisionPercent - 8.235294117647058) < 1e-12, 'guidance revisions changed')
  assert(ingestedResult.revisions.every((x) => x.approximate), 'approximation metadata was lost')
  const forward = ingestedResult.forward
  assert(forward !== null && forward.guidanceMidpoint === 180 && forward.priorActualValue === 91.4 && Math.abs(forward.impliedYoYPercent - 96.93654266958424) < 1e-12, 'forward result changed')
  let missingRejected = false, duplicateRejected = false
  try { parseCanonicalGoogGuidanceObservations(null) } catch { missingRejected = true }
  try { const invalid = structuredClone(canonical); invalid.records.push(structuredClone(invalid.records[0])); parseCanonicalGoogGuidanceObservations(invalid) } catch { duplicateRejected = true }
  assert(missingRejected && duplicateRejected, 'provider did not fail closed')
  const aggregate = deriveCurrentHyperscalerCapexTrend(fixedTime), cross = aggregate && deriveHyperscalerTsmConfirmation(aggregate, TSM_PRODUCTION_OBSERVATIONS, fixedTime)
  assert(aggregate?.eligibleCount === 4 && aggregate.positiveCount === 4 && aggregate.direction === 'POSITIVE' && aggregate.confidence === 'HIGH', 'hyperscaler regression failed')
  assert(cross?.direction === 'POSITIVE' && cross.alignment === 'CONFIRMED' && cross.confidence === 'HIGH', 'cross confirmation changed')
  const meta = verifyMetaCompanyCapexParity(), msft = verifyMsftCapexYoYTrends(), amzn = verifyAmznPpeIngestionParity(), tsm = verifyTsmMonthlyIngestionParity()
  assert(meta.crossCompanyEvidenceCount === 13 && msft.latestSpendingDirection === 'POSITIVE' && amzn.regressionsPassed && tsm.crossConfirmationUnchanged, 'other issuer regression failed')
  return { factualParityCount: ingested.length, capexDefinitionId: GOOG_REPORTED_CAPEX_DEFINITION.id, guidanceRevisionPercents: ingestedResult.revisions.map((x) => x.revisionPercent), approximationPreserved: true, forwardGuidanceMidpoint: forward.guidanceMidpoint, priorActualValue: forward.priorActualValue, forwardImpliedYoYPercent: forward.impliedYoYPercent, deterministicIdsStable: JSON.stringify(manualResult.revisions.map((x) => x.id)) === JSON.stringify(ingestedResult.revisions.map((x) => x.id)) && manualResult.forward?.id === forward.id, providerMode: 'INGESTED', annualActualAndQuarterlyActualsRemainManual: true, missingCanonicalRejected: missingRejected, duplicateCanonicalRejected: duplicateRejected, hyperscaler: { eligible: aggregate.eligibleCount, positive: aggregate.positiveCount, direction: aggregate.direction, confidence: aggregate.confidence }, cross: { direction: cross.direction, alignment: cross.alignment, confidence: cross.confidence }, issuerRegressionsPassed: true }
}
