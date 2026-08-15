import assert from 'node:assert/strict'
import test from 'node:test'
import { COVERAGE_CONTRACT, CURRENT_PRODUCTION_COVERAGE, evaluateCoverage } from '../../scripts/ingestion/coverage-contract.mjs'

test('current production boundaries are completely accounted for with visible manual dependencies', () => {
  assert.deepEqual(CURRENT_PRODUCTION_COVERAGE.counts, { requiredFactFamilies: 16, ingested: 5, frozen: 1, manual: 10, notDisclosed: 0, missing: 0 })
  assert.equal(CURRENT_PRODUCTION_COVERAGE.status, 'COMPLETE_WITH_MANUAL_DEPENDENCIES')
  assert.ok(['TSMC','META','MSFT','GOOG','AMZN'].every((issuer) => CURRENT_PRODUCTION_COVERAGE.entries.some((item) => item.issuer === issuer && item.coverageMode === 'MANUAL')))
})

test('GOOG frozen Q1 is covered rather than missing', () => {
  const q1 = CURRENT_PRODUCTION_COVERAGE.entries.find((item) => item.id === 'GOOG:2025-q1-capex-guidance')
  assert.equal(q1.coverageMode, 'FROZEN')
  assert.equal(q1.disclosureOutcome, 'PRESENT')
  assert.equal(q1.sourceCheck, 'VERIFIED_LOCAL')
})

test('NOT_DISCLOSED is accounted for and distinct from MISSING', () => {
  const declarations = COVERAGE_CONTRACT.map((item) => item.id === 'AMZN:forward-capex-guidance' ? { ...item, coverageMode: null, disclosureOutcome: 'NOT_DISCLOSED', sourceCheck: 'SUCCESSFUL' } : item)
  const result = evaluateCoverage(declarations)
  assert.equal(result.counts.notDisclosed, 1)
  assert.equal(result.counts.missing, 0)
  assert.equal(result.status, 'COMPLETE_WITH_MANUAL_DEPENDENCIES')
})

test('removing an expected covered family produces explicit incomplete coverage', () => {
  const result = evaluateCoverage(COVERAGE_CONTRACT.filter((item) => item.id !== 'META:annual-capex-guidance'))
  const missing = result.entries.find((item) => item.id === 'META:annual-capex-guidance')
  assert.equal(missing.coverageMode, 'MISSING')
  assert.equal(missing.disclosureOutcome, 'MISSING')
  assert.equal(missing.sourceCheck, 'FAILED')
  assert.equal(result.counts.missing, 1)
  assert.equal(result.status, 'INCOMPLETE')
})
