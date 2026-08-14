import canonical from '../../data/ingestion/observations/msft-management-total-capex.json'
import { MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION } from '../config/capexDefinitionRegistry'
import { MSFT_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { composeMsftCapexObservations, getMsftManagementTotalCapexObservations, MSFT_MANUAL_OTHER_CAPEX_OBSERVATIONS, MSFT_PRODUCTION_CAPEX_OBSERVATIONS, parseCanonicalMsftManagementCapex } from '../data/msftCapexObservationProvider'
import { TSM_PRODUCTION_OBSERVATIONS } from '../data/tsmMonthlyObservationProvider'
import { deriveCompanyCapexSignals, deriveCompanyCapexYoYActualTrends, normalizeCapexObservations } from '../signals/companyCapexSignalEngine'
import { deriveCurrentHyperscalerCapexTrend } from '../signals/hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from '../signals/hyperscalerTsmConfirmationEngine'
import type { MetricObservation } from '../types/metric'
import { verifyAmznPpeIngestionParity } from './amznPpeIngestionVerification'
import { verifyGoogGuidanceIngestionParity } from './googGuidanceIngestionVerification'
import { verifyMetaGuidanceIngestionParity } from './metaGuidanceIngestionVerification'
import { verifyTsmMonthlyIngestionParity } from './tsmMonthlyIngestionVerification'

function assert(condition:boolean,message:string):asserts condition{if(!condition)throw new Error(`MSFT CapEx ingestion verification failed: ${message}`)}
const fixed=()=> '2026-08-14T00:00:00.000Z'
const fact=(x:MetricObservation)=>({companyTicker:x.companyTicker,metric:x.metric,capexDefinitionId:x.capexDefinitionId,period:x.period,periodType:x.periodType,value:x.value,unit:x.unit,sourceId:x.sourceId})
function derive(mode:'MANUAL'|'INGESTED'){const n=normalizeCapexObservations(composeMsftCapexObservations(mode),MSFT_CAPEX_PROFILE,[MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION]);const yoy=deriveCompanyCapexYoYActualTrends(n,MSFT_CAPEX_PROFILE,MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,fixed).filter(x=>x.period.startsWith('MSFT-FY2026'));const qoq=deriveCompanyCapexSignals(n,MSFT_CAPEX_PROFILE,fixed).filter(x=>x.period==='MSFT-FY2026-Q3').at(-1);return{yoy,qoq}}

export function verifyMsftCapexIngestionParity(){
  const manual=getMsftManagementTotalCapexObservations('MANUAL'),ingested=getMsftManagementTotalCapexObservations('INGESTED');assert(JSON.stringify(manual.map(fact))===JSON.stringify(ingested.map(fact)),'golden factual parity failed');assert(MSFT_MANUAL_OTHER_CAPEX_OBSERVATIONS.length===5&&MSFT_PRODUCTION_CAPEX_OBSERVATIONS.length===12,'production composition changed')
  const a=derive('MANUAL'),b=derive('INGESTED');assert(JSON.stringify(a)===JSON.stringify(b),'signal parity failed');const expected=[74.5,65.929203539823,49.06542056074766];assert(b.yoy.length===3&&b.yoy.every((x,i)=>Math.abs(x.yoyPercent-expected[i])<1e-12),'FY26 YoY changed');assert(b.yoy[2].spendingDirection==='POSITIVE'&&b.yoy[2].growthRateTrend==='DECELERATING','latest semantics changed');assert(b.qoq!==undefined&&Math.abs(b.qoq.magnitude-(-14.933333333333334))<1e-12&&b.yoy[2].spendingDirection==='POSITIVE','QoQ semantics changed')
  let missing=false,duplicate=false;try{parseCanonicalMsftManagementCapex(null)}catch{missing=true}try{const d=structuredClone(canonical);d.records.push(structuredClone(d.records[0]));parseCanonicalMsftManagementCapex(d)}catch{duplicate=true}assert(missing&&duplicate,'provider did not fail closed')
  const aggregate=deriveCurrentHyperscalerCapexTrend(fixed),cross=aggregate&&deriveHyperscalerTsmConfirmation(aggregate,TSM_PRODUCTION_OBSERVATIONS,fixed);assert(aggregate?.eligibleCount===4&&aggregate.positiveCount===4&&aggregate.direction==='POSITIVE'&&aggregate.confidence==='HIGH','hyperscaler regression failed');assert(cross?.direction==='POSITIVE'&&cross.alignment==='CONFIRMED'&&cross.confidence==='HIGH','cross regression failed')
  const meta=verifyMetaGuidanceIngestionParity(),goog=verifyGoogGuidanceIngestionParity(),amzn=verifyAmznPpeIngestionParity(),tsm=verifyTsmMonthlyIngestionParity();assert(meta.issuerRegressionsPassed&&goog.issuerRegressionsPassed&&amzn.regressionsPassed&&tsm.crossConfirmationUnchanged,'issuer regression failed')
  return{factualParityCount:ingested.length,yoyGrowthRates:b.yoy.map(x=>x.yoyPercent),latestSpendingDirection:b.yoy[2].spendingDirection,latestGrowthRateTrend:b.yoy[2].growthRateTrend,q3QoqPercent:b.qoq.magnitude,qoqDidNotOverrideYoY:true,deterministicIdsStable:JSON.stringify(a.yoy.map(x=>x.id))===JSON.stringify(b.yoy.map(x=>x.id)),providerMode:'INGESTED',otherMsftFactsRemainManual:true,missingCanonicalRejected:missing,duplicateCanonicalRejected:duplicate,hyperscaler:{eligible:aggregate.eligibleCount,positive:aggregate.positiveCount,direction:aggregate.direction,confidence:aggregate.confidence},cross:{direction:cross.direction,alignment:cross.alignment,confidence:cross.confidence},issuerRegressionsPassed:true}
}
