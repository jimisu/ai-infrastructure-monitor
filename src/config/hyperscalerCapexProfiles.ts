import type { CompanyCapexProfile } from '../types/capex'
import { AMZN_2026_CAPEX_OUTLOOK_DEFINITION, AMZN_FINANCE_LEASE_ACQUIRED_PP_AND_E_DEFINITION, AMZN_OPERATING_LEASE_ASSETS_DEFINITION, AMZN_PP_AND_E_NOT_YET_PAID_DEFINITION, AMZN_PP_AND_E_PURCHASES_DEFINITION, AMZN_PP_AND_E_SALES_INCENTIVES_DEFINITION, GOOG_REPORTED_CAPEX_DEFINITION, META_CAPEX_DEFINITION, MSFT_CASH_PAID_PP_AND_E_DEFINITION, MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION } from './capexDefinitionRegistry'

export const AMZN_CAPEX_PROFILE: CompanyCapexProfile = {
  companyTicker: 'AMZN',
  defaultCapexDefinitionId: AMZN_PP_AND_E_PURCHASES_DEFINITION.id,
  capexDefinitionIds: [
    AMZN_PP_AND_E_PURCHASES_DEFINITION.id,
    AMZN_PP_AND_E_SALES_INCENTIVES_DEFINITION.id,
    AMZN_FINANCE_LEASE_ACQUIRED_PP_AND_E_DEFINITION.id,
    AMZN_PP_AND_E_NOT_YET_PAID_DEFINITION.id,
    AMZN_OPERATING_LEASE_ASSETS_DEFINITION.id,
    AMZN_2026_CAPEX_OUTLOOK_DEFINITION.id,
  ],
  currencyUnit: 'USD billions',
  fiscalYearEndMonth: 12,
}

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
