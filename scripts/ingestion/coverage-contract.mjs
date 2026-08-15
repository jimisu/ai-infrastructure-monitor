export const COVERAGE_MODES = Object.freeze(['INGESTED', 'FROZEN', 'MANUAL', 'MISSING'])
export const DISCLOSURE_OUTCOMES = Object.freeze(['PRESENT', 'NOT_DISCLOSED', 'MISSING'])

const family = (issuer, id, factFamily, coverageMode) => Object.freeze({ id: `${issuer}:${id}`, issuer, factFamily, required: true, coverageMode, disclosureOutcome: 'PRESENT', sourceCheck: coverageMode === 'INGESTED' ? 'SUCCESSFUL' : coverageMode === 'FROZEN' ? 'VERIFIED_LOCAL' : 'NOT_APPLICABLE' })

export const COVERAGE_CONTRACT = Object.freeze([
  family('TSMC', 'monthly-revenue', 'Monthly revenue and reported YoY', 'INGESTED'),
  family('TSMC', 'quarterly-revenue-actual', 'Quarterly revenue actual', 'MANUAL'),
  family('TSMC', 'forward-revenue-guidance', 'Forward quarterly revenue guidance', 'MANUAL'),
  family('META', 'annual-capex-guidance', 'Annual CapEx guidance history', 'INGESTED'),
  family('META', 'quarterly-capex-actual', 'Quarterly actual CapEx', 'MANUAL'),
  family('MSFT', 'management-total-capex-actual', 'Management-reported total CapEx actuals', 'INGESTED'),
  family('MSFT', 'forward-capex-guidance', 'Forward CapEx guidance', 'MANUAL'),
  family('MSFT', 'cash-paid-ppe', 'Cash paid for PP&E comparison series', 'MANUAL'),
  family('GOOG', 'annual-capex-guidance-sec', 'SEC-backed annual CapEx guidance disclosures', 'INGESTED'),
  family('GOOG', '2025-q1-capex-guidance', '2025-Q1 annual CapEx guidance historical disclosure', 'FROZEN'),
  family('GOOG', 'capex-actuals', 'Annual and quarterly actual CapEx', 'MANUAL'),
  family('GOOG', 'infrastructure-commentary', 'Infrastructure investment commentary', 'MANUAL'),
  family('AMZN', 'ppe-purchases-ttm', 'Purchases of property and equipment TTM actuals', 'INGESTED'),
  family('AMZN', 'other-ppe-series', 'Separate non-purchases PP&E series', 'MANUAL'),
  family('AMZN', 'forward-capex-guidance', 'Forward company-wide CapEx guidance', 'MANUAL'),
  family('AMZN', 'ai-infrastructure-commentary', 'AI and infrastructure attribution commentary', 'MANUAL'),
])

const validMode = new Set(COVERAGE_MODES), validOutcome = new Set(DISCLOSURE_OUTCOMES)
function validate(item) {
  if (!item || typeof item.id !== 'string' || typeof item.issuer !== 'string' || typeof item.factFamily !== 'string' || item.required !== true) throw new Error('Invalid required coverage declaration')
  if (!validOutcome.has(item.disclosureOutcome)) throw new Error(`Invalid disclosure outcome for ${item.id}`)
  if (item.disclosureOutcome === 'PRESENT' && !validMode.has(item.coverageMode)) throw new Error(`Present family lacks coverage mode: ${item.id}`)
  if (!['SUCCESSFUL', 'VERIFIED_LOCAL', 'NOT_APPLICABLE', 'FAILED'].includes(item.sourceCheck)) throw new Error(`Invalid source check for ${item.id}`)
  if (item.disclosureOutcome === 'NOT_DISCLOSED' && item.coverageMode != null) throw new Error(`NOT_DISCLOSED cannot claim a fact mode: ${item.id}`)
  if (item.disclosureOutcome === 'NOT_DISCLOSED' && item.sourceCheck !== 'SUCCESSFUL') throw new Error(`NOT_DISCLOSED requires a successful source check: ${item.id}`)
}

export function evaluateCoverage(declarations = COVERAGE_CONTRACT, contract = COVERAGE_CONTRACT) {
  const supplied = new Map()
  for (const item of declarations) { validate(item); if (supplied.has(item.id)) throw new Error(`Duplicate coverage declaration: ${item.id}`); supplied.set(item.id, item) }
  const entries = contract.map((expected) => {
    const actual = supplied.get(expected.id)
    if (!actual) return { ...expected, coverageMode: 'MISSING', disclosureOutcome: 'MISSING', sourceCheck: 'FAILED' }
    if (actual.issuer !== expected.issuer || actual.factFamily !== expected.factFamily) throw new Error(`Coverage identity drift: ${expected.id}`)
    return { ...actual }
  })
  const count = (mode) => entries.filter((item) => item.disclosureOutcome === 'PRESENT' && item.coverageMode === mode).length
  const missing = entries.filter((item) => item.disclosureOutcome === 'MISSING' || item.coverageMode === 'MISSING').length
  const notDisclosed = entries.filter((item) => item.disclosureOutcome === 'NOT_DISCLOSED').length
  const counts = { requiredFactFamilies: contract.length, ingested: count('INGESTED'), frozen: count('FROZEN'), manual: count('MANUAL'), notDisclosed, missing }
  const status = missing > 0 ? 'INCOMPLETE' : counts.manual > 0 || counts.frozen > 0 ? 'COMPLETE_WITH_MANUAL_DEPENDENCIES' : 'COMPLETE_AUTOMATED'
  return { schemaVersion: 1, status, counts, entries }
}

export const CURRENT_PRODUCTION_COVERAGE = Object.freeze(evaluateCoverage())
