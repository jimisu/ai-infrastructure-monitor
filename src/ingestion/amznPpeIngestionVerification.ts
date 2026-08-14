import canonical from '../../data/ingestion/observations/amzn-ppe-purchases.json'
import { AMZN_PP_AND_E_PURCHASES_DEFINITION } from '../config/capexDefinitionRegistry'
import { AMZN_CAPEX_PROFILE } from '../config/hyperscalerCapexProfiles'
import { AMZN_CAPEX_OBSERVATIONS } from '../data/amznCapexMetrics'
import { composeAmznCapexObservations, getAmznPpeObservations, parseCanonicalAmznPpeObservations, AMZN_PRODUCTION_CAPEX_OBSERVATIONS } from '../data/amznPpeObservationProvider'
import { TSM_PRODUCTION_OBSERVATIONS } from '../data/tsmMonthlyObservationProvider'
import { normalizeCapexObservations, deriveCompanyCapexTtmYoYActualTrends } from '../signals/companyCapexSignalEngine'
import { deriveCurrentHyperscalerCapexTrend } from '../signals/hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from '../signals/hyperscalerTsmConfirmationEngine'
import { verifyGoogCapexSignals } from '../signals/googCapexSignalVerification'
import type { MetricObservation } from '../types/metric'
function assert(condition: boolean, message: string): asserts condition { if (!condition) throw new Error(`Amazon PP&E ingestion verification failed: ${message}`) }
const fact=(item:MetricObservation)=>({companyTicker:item.companyTicker,metric:item.metric,period:item.period,periodType:item.periodType,value:item.value,unit:item.unit,sourceId:item.sourceId,capexDefinitionId:item.capexDefinitionId})
function derive(observations:MetricObservation[]){return deriveCompanyCapexTtmYoYActualTrends(normalizeCapexObservations(observations,AMZN_CAPEX_PROFILE,[AMZN_PP_AND_E_PURCHASES_DEFINITION]),AMZN_CAPEX_PROFILE,AMZN_PP_AND_E_PURCHASES_DEFINITION.id,()=> '2026-08-14T00:00:00.000Z')}
export function verifyAmznPpeIngestionParity(){
 const manual=getAmznPpeObservations('MANUAL'),ingested=getAmznPpeObservations('INGESTED')
 assert(manual.length===2&&ingested.length===2,'provider baseline count changed')
 assert(JSON.stringify(manual.map(fact))===JSON.stringify(ingested.map(fact)),'golden factual parity failed')
 const manualInput=composeAmznCapexObservations('MANUAL'),ingestedInput=composeAmznCapexObservations('INGESTED')
 assert(AMZN_PRODUCTION_CAPEX_OBSERVATIONS.length===AMZN_CAPEX_OBSERVATIONS.length,'production composition count changed')
 const primaryKeys=ingestedInput.filter((item)=>item.capexDefinitionId===AMZN_PP_AND_E_PURCHASES_DEFINITION.id).map((item)=>item.period+'|'+item.metric)
 assert(primaryKeys.length===new Set(primaryKeys).size&&primaryKeys.length===2,'manual and ingested PP&E were merged')
 let missingRejected=false,invalidRejected=false
 try{parseCanonicalAmznPpeObservations(null)}catch{missingRejected=true}
 try{const invalid=structuredClone(canonical);invalid.records.push(structuredClone(invalid.records[0]));parseCanonicalAmznPpeObservations(invalid)}catch{invalidRejected=true}
 assert(missingRejected&&invalidRejected,'invalid canonical data did not fail closed')
 const manualSignal=derive(manualInput),ingestedSignal=derive(ingestedInput)
 assert(manualSignal.length===1&&ingestedSignal.length===1,'expected one TTM signal')
 assert(JSON.stringify(manualSignal)===JSON.stringify(ingestedSignal),'Amazon signal parity failed')
 const expected=((151.003-93.093)/93.093)*100
 assert(Math.abs(ingestedSignal[0].yoyPercent-expected)<1e-12,'TTM YoY changed')
 assert(ingestedSignal[0].spendingDirection==='POSITIVE','Amazon direction changed')
 const aggregate=deriveCurrentHyperscalerCapexTrend(()=> '2026-08-14T00:00:00.000Z')
 assert(aggregate!==null&&aggregate.eligibleCount===4&&aggregate.positiveCount===4&&aggregate.coverage===100&&aggregate.positiveBreadth===100&&aggregate.direction==='POSITIVE'&&aggregate.confidence==='HIGH','hyperscaler regression failed')
 const cross=deriveHyperscalerTsmConfirmation(aggregate,TSM_PRODUCTION_OBSERVATIONS,()=> '2026-08-14T00:00:00.000Z')
 assert(cross!==null&&cross.direction==='POSITIVE'&&cross.alignment==='CONFIRMED'&&cross.confidence==='HIGH','cross-confirmation regression failed')
 const regressions=verifyGoogCapexSignals();assert(regressions.metaParity&&regressions.msftParity&&regressions.crossCompanyUnchanged,'META/MSFT/GOOG regressions failed')
 return{factualParityCount:ingested.length,ttmPrior:ingested[0].value,ttmCurrent:ingested[1].value,ttmYoYPercent:ingestedSignal[0].yoyPercent,amznDirection:ingestedSignal[0].spendingDirection,deterministicIdStable:ingestedSignal[0].id===manualSignal[0].id,providerMode:'INGESTED',noDoubleCounting:true,missingCanonicalRejected:missingRejected,invalidCanonicalRejected:invalidRejected,hyperscaler:{eligible:aggregate.eligibleCount,positive:aggregate.positiveCount,coverage:aggregate.coverage,breadth:aggregate.positiveBreadth,direction:aggregate.direction,confidence:aggregate.confidence},cross:{direction:cross.direction,alignment:cross.alignment,confidence:cross.confidence},regressionsPassed:true}
}
