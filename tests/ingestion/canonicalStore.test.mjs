import assert from 'node:assert/strict'
import test from 'node:test'
import { buildCanonicalPromotion } from '../../scripts/ingestion/shared/canonical-store.mjs'

const candidate = (value, version) => ({
  issuer: 'TEST', companyTicker: 'TEST', metric: 'CAPEX_ACTUAL', capexDefinitionId: 'test-capex',
  period: '2026-Q1', periodType: 'QUARTER', semanticRole: 'ACTUAL', unit: 'USD billions',
  sourceId: 'test-source', value, snapshotId: `snapshot-${version}`,
  sourceDocumentVersionId: version, sourceLocator: { version },
})
const promote = (existingDocument, value, version) => buildCanonicalPromotion({
  existingDocument, candidates: [candidate(value, version)], snapshotIds: [`snapshot-${version}`],
  pipelineId: 'test', issuer: 'TEST', sourceId: 'test-source',
  toObservation: (item, id) => ({ id, companyTicker: item.companyTicker, metric: item.metric,
    value: item.value, unit: item.unit, period: item.period, periodType: item.periodType,
    sourceId: item.sourceId }),
})

function sequence(steps) {
  let document = null
  const results = []
  for (const [value, version] of steps) {
    const result = promote(document, value, version)
    document = result.document
    results.push(result)
  }
  return { document, results }
}

test('same source version re-fetch is idempotent (A to A)', () => {
  const { document, results } = sequence([[1, 'v1'], [1, 'v1']])
  assert.equal(results[1].created, 0)
  assert.equal(document.records.length, 1)
})

test('changed value creates one revision (A to B)', () => {
  const { document, results } = sequence([[1, 'v1'], [2, 'v2']])
  assert.equal(results[1].revisions, 1)
  assert.equal(document.records.filter((record) => record.status === 'ACTIVE')[0].observation.value, 2)
})

test('later source version can reassert a historical value (A to B to A)', () => {
  const { document, results } = sequence([[1, 'v1'], [2, 'v2'], [1, 'v3']])
  assert.equal(results[2].created, 1)
  assert.equal(results[2].revisions, 1)
  assert.equal(document.records.length, 3)
  const active = document.records.filter((record) => record.status === 'ACTIVE')
  assert.equal(active.length, 1)
  assert.equal(active[0].observation.value, 1)
  assert.equal(active[0].sourceDocumentVersionId, 'v3')
})

test('later source version can reassert current value without a numeric revision (A to B to B)', () => {
  const { document, results } = sequence([[1, 'v1'], [2, 'v2'], [2, 'v3']])
  assert.equal(results[2].created, 1)
  assert.equal(results[2].revisions, 0)
  assert.equal(results[2].transitions, 1)
  assert.equal(document.records.filter((record) => record.status === 'ACTIVE')[0].sourceDocumentVersionId, 'v3')
})

test('re-fetching every version never duplicates its canonical record', () => {
  const { document } = sequence([[1, 'v1'], [1, 'v1'], [2, 'v2'], [2, 'v2'], [1, 'v3'], [1, 'v3']])
  assert.equal(document.records.length, 3)
  assert.equal(new Set(document.records.map((record) => record.recordId)).size, 3)
})


test('equivalent value from the same source version and a different snapshot is a provenance reassertion', () => {
  const firstCandidate = { ...candidate(1, 'v1'), snapshotId: 'snapshot-fixture' }
  const first = buildCanonicalPromotion({ existingDocument: null, candidates: [firstCandidate], snapshotIds: [firstCandidate.snapshotId], pipelineId: 'test', issuer: 'TEST', sourceId: 'test-source', toObservation: (item, id) => ({ id, companyTicker: item.companyTicker, metric: item.metric, value: item.value, unit: item.unit, period: item.period, periodType: item.periodType, sourceId: item.sourceId }) })
  const liveCandidate = { ...candidate(1, 'v1'), snapshotId: 'snapshot-live' }
  const live = buildCanonicalPromotion({ existingDocument: first.document, candidates: [liveCandidate], snapshotIds: [liveCandidate.snapshotId], pipelineId: 'test', issuer: 'TEST', sourceId: 'test-source', toObservation: (item, id) => ({ id, companyTicker: item.companyTicker, metric: item.metric, value: item.value, unit: item.unit, period: item.period, periodType: item.periodType, sourceId: item.sourceId }) })
  assert.equal(live.created, 1); assert.equal(live.newFacts, 0); assert.equal(live.revisions, 0); assert.equal(live.provenanceReassertions, 1); assert.equal(live.transitions, 1)
})
test('same source version with changed snapshot content is an effective correction', () => {
  const firstCandidate = { ...candidate(1, 'v1'), snapshotId: 'snapshot-content-a' }
  const first = buildCanonicalPromotion({ existingDocument: null, candidates: [firstCandidate], snapshotIds: [firstCandidate.snapshotId], pipelineId: 'test', issuer: 'TEST', sourceId: 'test-source', observationId: () => 'legacy-stable-id', toObservation: (item, id) => ({ id, companyTicker: item.companyTicker, metric: item.metric, value: item.value, unit: item.unit, period: item.period, periodType: item.periodType, sourceId: item.sourceId }) })
  const correctedCandidate = { ...candidate(2, 'v1'), snapshotId: 'snapshot-content-b' }
  const corrected = buildCanonicalPromotion({ existingDocument: first.document, candidates: [correctedCandidate], snapshotIds: [correctedCandidate.snapshotId], pipelineId: 'test', issuer: 'TEST', sourceId: 'test-source', observationId: () => 'legacy-stable-id', toObservation: (item, id) => ({ id, companyTicker: item.companyTicker, metric: item.metric, value: item.value, unit: item.unit, period: item.period, periodType: item.periodType, sourceId: item.sourceId }) })
  assert.equal(corrected.created, 1)
  assert.equal(corrected.transitions, 1)
  assert.equal(corrected.revisions, 1)
  assert.equal(corrected.document.records.filter((record) => record.status === 'ACTIVE')[0].observation.value, 2)
})
