import type { CapexDefinition } from '../types/capex'

export const META_CAPEX_DEFINITION: CapexDefinition = {
  id: 'meta-capex-including-finance-lease-principal',
  companyTicker: 'META',
  officialDefinition: 'Capital expenditures including principal payments on finance leases',
  basis: 'MANAGEMENT_REPORTED_TOTAL_CAPEX',
  financeLeaseTreatment: 'INCLUDED',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: [
    'meta-capex-2025q4-guidance',
    'meta-capex-2026q1-guidance',
    'meta-capex-2026q2-guidance',
    'meta-quarterly-results-2026-q1',
    'meta-quarterly-results-2026-q2',
  ],
}

export const MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION: CapexDefinition = {
  id: 'msft-management-reported-total-capex',
  companyTicker: 'MSFT',
  officialDefinition:
    'Management-reported capital expenditures, including finance leases recorded at commencement',
  basis: 'MANAGEMENT_REPORTED_TOTAL_CAPEX',
  financeLeaseTreatment: 'INCLUDED',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['msft-fy2025-q1-earnings-call', 'msft-fy2025-q2-earnings-call', 'msft-fy2025-q3-earnings-call', 'msft-fy2025-q4-earnings-call', 'msft-fy2026-q1-earnings-call', 'msft-fy2026-q2-earnings-call', 'msft-fy2026-q3-earnings-call'],
}

export const MSFT_CASH_PAID_PP_AND_E_DEFINITION: CapexDefinition = {
  id: 'msft-cash-paid-pp-and-e',
  companyTicker: 'MSFT',
  officialDefinition: 'Cash paid for property and equipment',
  basis: 'CASH_PAID_FOR_PROPERTY_AND_EQUIPMENT',
  financeLeaseTreatment: 'EXCLUDED_FROM_CASH_MEASURE',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['msft-fy2026-q1-earnings-call', 'msft-fy2026-q2-earnings-call', 'msft-fy2026-q3-earnings-call'],
}

export const GOOG_REPORTED_CAPEX_DEFINITION: CapexDefinition = {
  id: 'goog-purchases-of-property-and-equipment',
  companyTicker: 'GOOG',
  officialDefinition: 'Capital expenditures / purchases of property and equipment, as reported by Alphabet',
  basis: 'PURCHASES_OF_PROPERTY_AND_EQUIPMENT',
  financeLeaseTreatment: 'AS_REPORTED',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['goog-2024-q4-earnings-call', 'goog-2025-q1-earnings-call', 'goog-2025-q2-earnings-call', 'goog-2025-q3-earnings-call', 'goog-2025-q4-earnings-call'],
}


export const AMZN_PP_AND_E_PURCHASES_DEFINITION: CapexDefinition = {
  id: 'amzn-purchases-of-property-and-equipment',
  companyTicker: 'AMZN',
  officialDefinition: 'Purchases of property and equipment',
  basis: 'PURCHASES_OF_PROPERTY_AND_EQUIPMENT',
  financeLeaseTreatment: 'AS_REPORTED',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['amzn-2026-q1-results'],
}

export const AMZN_PP_AND_E_SALES_INCENTIVES_DEFINITION: CapexDefinition = {
  id: 'amzn-property-equipment-sales-and-incentives',
  companyTicker: 'AMZN',
  officialDefinition: 'Proceeds from property and equipment sales and incentives',
  basis: 'PROPERTY_EQUIPMENT_SALES_AND_INCENTIVES',
  financeLeaseTreatment: 'NOT_APPLICABLE',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['amzn-2026-q1-results'],
}

export const AMZN_FINANCE_LEASE_ACQUIRED_PP_AND_E_DEFINITION: CapexDefinition = {
  id: 'amzn-finance-lease-acquired-property-and-equipment',
  companyTicker: 'AMZN',
  officialDefinition: 'Property and equipment acquired under finance leases, net of remeasurements and modifications',
  basis: 'FINANCE_LEASE_ACQUIRED_PROPERTY_AND_EQUIPMENT',
  financeLeaseTreatment: 'INCLUDED',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['amzn-2026-q1-results'],
}

export const AMZN_PP_AND_E_NOT_YET_PAID_DEFINITION: CapexDefinition = {
  id: 'amzn-property-and-equipment-acquired-not-yet-paid',
  companyTicker: 'AMZN',
  officialDefinition: 'Increase in property and equipment acquired but not yet paid',
  basis: 'PROPERTY_AND_EQUIPMENT_ACQUIRED_NOT_YET_PAID',
  financeLeaseTreatment: 'NOT_APPLICABLE',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['amzn-2026-q1-results'],
}

export const AMZN_OPERATING_LEASE_ASSETS_DEFINITION: CapexDefinition = {
  id: 'amzn-operating-lease-assets',
  companyTicker: 'AMZN',
  officialDefinition: 'Assets acquired under operating leases',
  basis: 'OPERATING_LEASE_ASSETS',
  financeLeaseTreatment: 'NOT_APPLICABLE',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['amzn-2026-q1-results'],
}

export const AMZN_2026_CAPEX_OUTLOOK_DEFINITION: CapexDefinition = {
  id: 'amzn-company-wide-capital-expenditures-outlook',
  companyTicker: 'AMZN',
  officialDefinition: 'Expected capital expenditures across Amazon',
  basis: 'COMPANY_WIDE_CAPITAL_EXPENDITURES_OUTLOOK',
  financeLeaseTreatment: 'AS_REPORTED',
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: ['amzn-2025-q4-results'],
}

export const CAPEX_DEFINITIONS = [
  META_CAPEX_DEFINITION,
  MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION,
  MSFT_CASH_PAID_PP_AND_E_DEFINITION,
  GOOG_REPORTED_CAPEX_DEFINITION,
  AMZN_PP_AND_E_PURCHASES_DEFINITION,
  AMZN_PP_AND_E_SALES_INCENTIVES_DEFINITION,
  AMZN_FINANCE_LEASE_ACQUIRED_PP_AND_E_DEFINITION,
  AMZN_PP_AND_E_NOT_YET_PAID_DEFINITION,
  AMZN_OPERATING_LEASE_ASSETS_DEFINITION,
  AMZN_2026_CAPEX_OUTLOOK_DEFINITION,
]

export function getCapexDefinition(id: string): CapexDefinition | undefined {
  return CAPEX_DEFINITIONS.find((definition) => definition.id === id)
}
