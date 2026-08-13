import type { CapexDefinition } from '../types/capex'

export const META_CAPEX_DEFINITION: CapexDefinition = {
  id: 'meta-capex-including-finance-lease-principal',
  companyTicker: 'META',
  officialDefinition: 'Capital expenditures including principal payments on finance leases',
  basis: 'CAPITAL_EXPENDITURES',
  includesFinanceLeasePrincipal: true,
  scope: 'CONSOLIDATED_TOTAL',
  sourceIds: [
    'meta-capex-2025q4-guidance',
    'meta-capex-2026q1-guidance',
    'meta-capex-2026q2-guidance',
    'meta-quarterly-results-2026-q1',
    'meta-quarterly-results-2026-q2',
  ],
}

const CAPEX_DEFINITIONS = [META_CAPEX_DEFINITION]

export function getCapexDefinition(id: string): CapexDefinition | undefined {
  return CAPEX_DEFINITIONS.find((definition) => definition.id === id)
}
