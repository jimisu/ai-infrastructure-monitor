import { verifyAmznPpeIngestionParity } from './amznPpeIngestionVerification'
import { verifyGoogGuidanceIngestionParity } from './googGuidanceIngestionVerification'
import { verifyMetaGuidanceIngestionParity } from './metaGuidanceIngestionVerification'
import { verifyMsftCapexIngestionParity } from './msftCapexIngestionVerification'
import { verifyTsmMonthlyIngestionParity } from './tsmMonthlyIngestionVerification'

export function verifyProductionIngestion(){const tsm=verifyTsmMonthlyIngestionParity(),meta=verifyMetaGuidanceIngestionParity(),msft=verifyMsftCapexIngestionParity(),goog=verifyGoogGuidanceIngestionParity(),amzn=verifyAmznPpeIngestionParity();const aggregate=msft.hyperscaler,cross=msft.cross;if(aggregate.eligible!==4||aggregate.positive!==4||aggregate.direction!=='POSITIVE'||aggregate.confidence!=='HIGH')throw new Error('Hyperscaler production regression failed');if(cross.direction!=='POSITIVE'||cross.alignment!=='CONFIRMED'||cross.confidence!=='HIGH')throw new Error('Hyperscaler x TSMC production regression failed');return{issuers:{TSMC:tsm.providerMode,META:meta.providerMode,MSFT:msft.providerMode,GOOG:goog.providerMode,AMZN:amzn.providerMode},hyperscaler:aggregate,cross}}
