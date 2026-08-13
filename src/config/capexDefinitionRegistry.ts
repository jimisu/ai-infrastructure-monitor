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

export const CAPEX_DEFINITIONS = [
  META_CAPEX_DEFINITION,
  MSFT_MANAGEMENT_REPORTED_CAPEX_DEFINITION,
  MSFT_CASH_PAID_PP_AND_E_DEFINITION,
]

export function getCapexDefinition(id: string): CapexDefinition | undefined {
  return CAPEX_DEFINITIONS.find((definition) => definition.id === id)
}
