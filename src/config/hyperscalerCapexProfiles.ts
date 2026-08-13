import type { CompanyCapexProfile } from '../types/capex'
import { GOOG_REPORTED_CAPEX_DEFINITION, META_CAPEX_DEFINITION, MSFT_CASH_PAID_PP_AND_E_DEFINITION, MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION } from './capexDefinitionRegistry'

export const META_CAPEX_PROFILE: CompanyCapexProfile = {
  companyTicker: 'META',
  defaultCapexDefinitionId: META_CAPEX_DEFINITION.id,
  capexDefinitionIds: [META_CAPEX_DEFINITION.id],
  currencyUnit: 'USD billions',
  fiscalYearEndMonth: 12,
}
export const GOOG_CAPEX_PROFILE: CompanyCapexProfile = {
  companyTicker: 'GOOG',
  defaultCapexDefinitionId: GOOG_REPORTED_CAPEX_DEFINITION.id,
  capexDefinitionIds: [GOOG_REPORTED_CAPEX_DEFINITION.id],
  currencyUnit: 'USD billions',
  fiscalYearEndMonth: 12,
}

export const MSFT_CAPEX_PROFILE: CompanyCapexProfile = {
  companyTicker: 'MSFT',
  defaultCapexDefinitionId: MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
  capexDefinitionIds: [
    MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION.id,
    MSFT_CASH_PAID_PP_AND_E_DEFINITION.id,
  ],
  currencyUnit: 'USD billions',
  fiscalYearEndMonth: 6,
}
