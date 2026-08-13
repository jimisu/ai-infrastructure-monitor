import type { CompanyCapexProfile } from '../types/capex'
import { META_CAPEX_DEFINITION } from './capexDefinitionRegistry'

export const META_CAPEX_PROFILE: CompanyCapexProfile = {
  companyTicker: 'META',
  capexDefinitionId: META_CAPEX_DEFINITION.id,
  currencyUnit: 'USD billions',
}
