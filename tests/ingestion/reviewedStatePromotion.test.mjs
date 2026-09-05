import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { applyReviewedStatePromotion, prepareReviewedStatePromotion, productionContractArgs, runReviewedStatePromotionCli } from '../../scripts/ingestion/reviewed-state-promotion.mjs'

const observationFiles = [
  'amzn-ppe-purchases.json',
  'goog-annual-capex-guidance.json',
  'meta-annual-capex-guidance.json',
  'msft-management-total-capex.json',
  'tsm-monthly.json',
]
const sha256 = (value) => createHash('sha256').update(value).digest('hex')

async function json(target, value) {
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`)
}

async function fixture() {
  const sandbox = await mkdtemp(path.join(os.tmpdir(), 'reviewed-promotion-test-'))
  const sourceRoot = path.join(sandbox, 'reviewed')
  const productionRoot = path.join(sandbox, 'production')
  const reviewReportPath = path.join(sandbox, 'review.md')
  const runReportRelativePath = 'runs/reviewed-run.json'
  const snapshotHash = 'a'.repeat(64)
  const snapshotId = `raw-snapshot:live:sha256:${snapshotHash}`
  const raw = Buffer.from('<html>official evidence</html>')
  const rawHash = sha256(raw)
  const rawRelativePath = `raw/TSM/${rawHash}.html`
  const manifestRelativePath = `manifests/TSM/${snapshotHash}.json`
  const baselineDocument = { schemaVersion: 2, pipelineId: 'test', issuer: 'TSM', sourceId: 'test', latestSnapshotIds: [], records: [] }
  for (const file of observationFiles) {
    await json(path.join(productionRoot, 'observations', file), baselineDocument)
    await json(path.join(sourceRoot, 'observations', file), baselineDocument)
  }
  const proposed = {
    ...baselineDocument,
    latestSnapshotIds: [snapshotId],
    records: [{
      recordId: 'canonical-record:sha256:new',
      sourceDocumentVersionId: 'sec-accession:test',
      logicalFactKey: 'issuer=TSM|metric=MONTHLY_REVENUE|period=2026-07',
      snapshotId,
      sourceLocator: { type: 'table-row' },
      status: 'ACTIVE',
      supersedesRecordId: null,
      supersedesObservationId: null,
      observation: { id: 'metric-observation:v2:sha256:new', issuer: 'TSM', metric: 'MONTHLY_REVENUE', period: '2026-07', unit: 'NT$ millions', value: 467580 },
    }],
  }
  await json(path.join(sourceRoot, 'observations', 'tsm-monthly.json'), proposed)
  await mkdir(path.dirname(path.join(sourceRoot, rawRelativePath)), { recursive: true })
  await writeFile(path.join(sourceRoot, rawRelativePath), raw)
  await json(path.join(sourceRoot, manifestRelativePath), {
    snapshotId,
    acquisitionMode: 'LIVE',
    sourceId: 'test',
    issuer: 'TSM',
    requestedUrl: 'https://www.sec.gov/test',
    finalUrl: 'https://www.sec.gov/test',
    evidenceUrl: 'https://www.sec.gov/test',
    acquisitionChannel: 'SEC_EDGAR',
    fixture: null,
    retrievedAt: '2026-09-04T00:00:00.000Z',
    httpStatus: 200,
    contentType: 'text/html',
    contentLength: raw.byteLength,
    sha256: rawHash,
    rawContentPath: rawRelativePath,
    manifestPath: manifestRelativePath,
    provenance: { accessionNumber: 'test' },
  })
  const runReport = {
    schemaVersion: 4,
    runId: `ingestion-run:sha256:${'b'.repeat(64)}`,
    overallHealth: 'HEALTHY',
    totals: { failures: 0 },
    baselineVerification: { status: 'PASSED' },
    proposedStateVerification: { status: 'PASSED' },
  }
  await json(path.join(sourceRoot, runReportRelativePath), runReport)
  await writeFile(reviewReportPath, '# Reviewed\n')
  const expectedProductionHashes = Object.fromEntries(await Promise.all(observationFiles.map(async (file) => {
    const relativePath = `observations/${file}`
    return [relativePath, sha256(await readFile(path.join(productionRoot, relativePath)))]
  })))
  return {
    sandbox,
    sourceRoot,
    productionRoot,
    reviewReportPath,
    expectedReviewReportSha256: sha256(await readFile(reviewReportPath)),
    runReportRelativePath,
    expectedRunReportSha256: sha256(await readFile(path.join(sourceRoot, runReportRelativePath))),
    expectedProductionHashes,
    rawRelativePath,
    manifestRelativePath,
  }
}

async function prepare(state, bundleOutputPath) {
  return prepareReviewedStatePromotion({
    sourceRoot: state.sourceRoot,
    productionRoot: state.productionRoot,
    reviewReportPath: state.reviewReportPath,
    expectedReviewReportSha256: state.expectedReviewReportSha256,
    runReportRelativePath: state.runReportRelativePath,
    expectedRunReportSha256: state.expectedRunReportSha256,
    expectedProductionHashes: state.expectedProductionHashes,
    bundleOutputPath,
  })
}

test('prepare emits an exact deterministic delta without changing production', async () => {
  const state = await fixture()
  const before = state.expectedProductionHashes
  const first = await prepare(state)
  const second = await prepare(state)
  assert.equal(first.bundleSha256, second.bundleSha256)
  assert.deepEqual(first.bundle.exactDelta.map((item) => [item.path, item.action]), [
    [state.manifestRelativePath, 'ADD'],
    ['observations/tsm-monthly.json', 'REPLACE'],
    [state.rawRelativePath, 'ADD'],
    [state.runReportRelativePath, 'ADD'],
  ])
  for (const [relativePath, expected] of Object.entries(before)) assert.equal(sha256(await readFile(path.join(state.productionRoot, relativePath))), expected)
})

test('prepare rejects reviewed-report and run-report drift', async () => {
  const state = await fixture()
  await assert.rejects(prepareReviewedStatePromotion({
    ...state,
    expectedReviewReportSha256: '0'.repeat(64),
  }), (error) => error.code === 'REVIEW_REPORT_DRIFT')
  await assert.rejects(prepareReviewedStatePromotion({
    ...state,
    expectedRunReportSha256: '0'.repeat(64),
  }), (error) => error.code === 'RUN_REPORT_DRIFT')
})

test('prepare rejects manifest raw hash mismatch and unsafe manifest paths', async () => {
  const state = await fixture()
  const manifestPath = path.join(state.sourceRoot, state.manifestRelativePath)
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  await json(manifestPath, { ...manifest, sha256: '0'.repeat(64) })
  await assert.rejects(prepare(state), (error) => error.code === 'RAW_HASH_MISMATCH')
  await json(manifestPath, { ...manifest, rawContentPath: '../outside' })
  await assert.rejects(prepare(state), (error) => error.code === 'UNSAFE_PATH')
})

test('prepare rejects unexpected files and non-observation destination conflicts', async () => {
  const unexpected = await fixture()
  await writeFile(path.join(unexpected.sourceRoot, 'unexpected.txt'), 'no')
  await assert.rejects(prepare(unexpected), (error) => error.code === 'UNEXPECTED_FILE')

  const collision = await fixture()
  const target = path.join(collision.productionRoot, collision.rawRelativePath)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, 'different bytes')
  await assert.rejects(prepare(collision), (error) => error.code === 'DESTINATION_COLLISION')
})

test('prepare rejects an unexpected sixth observation and non-LIVE backing for a new record', async () => {
  const extra = await fixture()
  await json(path.join(extra.sourceRoot, 'observations', 'extra.json'), { records: [] })
  await assert.rejects(prepare(extra), (error) => error.code === 'OBSERVATION_SET_MISMATCH')

  const fixtureBacked = await fixture()
  const manifestPath = path.join(fixtureBacked.sourceRoot, fixtureBacked.manifestRelativePath)
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  await json(manifestPath, { ...manifest, acquisitionMode: 'FIXTURE' })
  await assert.rejects(prepare(fixtureBacked), (error) => error.code === 'NON_LIVE_PROPOSED_RECORD')
})

test('prepare rejects production baseline drift and removed baseline records', async () => {
  const drift = await fixture()
  await writeFile(path.join(drift.productionRoot, 'observations', 'tsm-monthly.json'), '{}\n')
  await assert.rejects(prepare(drift), (error) => error.code === 'PRODUCTION_BASELINE_DRIFT')

  const removed = await fixture()
  const productionPath = path.join(removed.productionRoot, 'observations', 'tsm-monthly.json')
  const sourcePath = path.join(removed.sourceRoot, 'observations', 'tsm-monthly.json')
  const baseline = JSON.parse(await readFile(productionPath, 'utf8'))
  baseline.records.push({ recordId: 'baseline-record' })
  await json(productionPath, baseline)
  removed.expectedProductionHashes['observations/tsm-monthly.json'] = sha256(await readFile(productionPath))
  const proposed = JSON.parse(await readFile(sourcePath, 'utf8'))
  await json(sourcePath, proposed)
  await assert.rejects(prepare(removed), (error) => error.code === 'BASELINE_RECORD_REMOVED')
})

test('apply requires the exact externally supplied bundle hash', async () => {
  const state = await fixture()
  const bundlePath = path.join(state.sandbox, 'bundle.json')
  await prepare(state, bundlePath)
  await assert.rejects(applyReviewedStatePromotion({
    bundlePath,
    expectedBundleSha256: '0'.repeat(64),
    rollbackRoot: path.join(state.sandbox, 'rollback'),
    deltaOutputPath: path.join(state.sandbox, 'delta.json'),
    verifyStaged: async () => {},
    verifyProduction: async () => {},
  }), (error) => error.code === 'BUNDLE_HASH_MISMATCH')
})

test('apply stages, verifies, snapshots rollback, and promotes only the exact delta', async () => {
  const state = await fixture()
  const bundlePath = path.join(state.sandbox, 'bundle.json')
  const rollbackRoot = path.join(state.sandbox, 'rollback')
  const deltaOutputPath = path.join(state.sandbox, 'delta.json')
  const prepared = await prepare(state, bundlePath)
  let stagedVerified = false
  const result = await applyReviewedStatePromotion({
    bundlePath,
    expectedBundleSha256: prepared.bundleSha256,
    rollbackRoot,
    deltaOutputPath,
    verifyStaged: async (root) => {
      stagedVerified = true
      assert.equal(sha256(await readFile(path.join(root, 'observations', 'tsm-monthly.json'))), sha256(await readFile(path.join(state.sourceRoot, 'observations', 'tsm-monthly.json'))))
    },
    verifyProduction: async (root) => assert.ok(stagedVerified && await readFile(path.join(root, state.rawRelativePath))),
  })
  assert.equal(result.bundleSha256, prepared.bundleSha256)
  assert.equal(sha256(await readFile(path.join(state.productionRoot, 'observations', 'tsm-monthly.json'))), sha256(await readFile(path.join(state.sourceRoot, 'observations', 'tsm-monthly.json'))))
  assert.equal(sha256(await readFile(path.join(rollbackRoot, 'observations', 'tsm-monthly.json'))), state.expectedProductionHashes['observations/tsm-monthly.json'])
  assert.equal(JSON.parse(await readFile(deltaOutputPath, 'utf8')).bundleSha256, prepared.bundleSha256)
})

test('post-apply verification failure restores the complete original production root', async () => {
  const state = await fixture()
  const bundlePath = path.join(state.sandbox, 'bundle.json')
  const prepared = await prepare(state, bundlePath)
  await assert.rejects(applyReviewedStatePromotion({
    bundlePath,
    expectedBundleSha256: prepared.bundleSha256,
    rollbackRoot: path.join(state.sandbox, 'rollback'),
    deltaOutputPath: path.join(state.sandbox, 'delta.json'),
    verifyStaged: async () => {},
    verifyProduction: async () => { throw Object.assign(new Error('failed'), { code: 'POST_VERIFY_FAILED' }) },
  }), (error) => error.code === 'POST_VERIFY_FAILED')
  for (const [relativePath, expected] of Object.entries(state.expectedProductionHashes)) assert.equal(sha256(await readFile(path.join(state.productionRoot, relativePath))), expected)
  assert.equal(await lstatSafe(path.join(state.productionRoot, state.rawRelativePath)), false)
})

test('staged production-contract failure blocks root replacement', async () => {
  const state = await fixture()
  const bundlePath = path.join(state.sandbox, 'bundle.json')
  const rollbackRoot = path.join(state.sandbox, 'rollback')
  const prepared = await prepare(state, bundlePath)
  let postVerificationRan = false
  await assert.rejects(applyReviewedStatePromotion({
    bundlePath,
    expectedBundleSha256: prepared.bundleSha256,
    rollbackRoot,
    deltaOutputPath: path.join(state.sandbox, 'delta.json'),
    verifyStaged: async () => { throw Object.assign(new Error('invalid production contract'), { code: 'PRODUCTION_CONTRACT_FAILED' }) },
    verifyProduction: async () => { postVerificationRan = true },
  }), (error) => error.code === 'PRODUCTION_CONTRACT_FAILED')
  assert.equal(postVerificationRan, false)
  assert.equal(await lstatSafe(rollbackRoot), false)
  for (const [relativePath, expected] of Object.entries(state.expectedProductionHashes)) assert.equal(sha256(await readFile(path.join(state.productionRoot, relativePath))), expected)
})

test('source or production drift after prepare blocks apply before replacement', async () => {
  const sourceDrift = await fixture()
  const sourceBundle = path.join(sourceDrift.sandbox, 'bundle.json')
  const sourcePrepared = await prepare(sourceDrift, sourceBundle)
  await writeFile(path.join(sourceDrift.sourceRoot, sourceDrift.rawRelativePath), 'changed')
  await assert.rejects(applyReviewedStatePromotion({
    bundlePath: sourceBundle,
    expectedBundleSha256: sourcePrepared.bundleSha256,
    rollbackRoot: path.join(sourceDrift.sandbox, 'rollback'),
    deltaOutputPath: path.join(sourceDrift.sandbox, 'delta.json'),
    verifyStaged: async () => {},
    verifyProduction: async () => {},
  }), (error) => ['RAW_HASH_MISMATCH', 'BUNDLE_STATE_DRIFT'].includes(error.code))

  const productionDrift = await fixture()
  const productionBundle = path.join(productionDrift.sandbox, 'bundle.json')
  const productionPrepared = await prepare(productionDrift, productionBundle)
  await writeFile(path.join(productionDrift.productionRoot, 'observations', 'tsm-monthly.json'), '{}\n')
  await assert.rejects(applyReviewedStatePromotion({
    bundlePath: productionBundle,
    expectedBundleSha256: productionPrepared.bundleSha256,
    rollbackRoot: path.join(productionDrift.sandbox, 'rollback'),
    deltaOutputPath: path.join(productionDrift.sandbox, 'delta.json'),
    verifyStaged: async () => {},
    verifyProduction: async () => {},
  }), (error) => error.code === 'PRODUCTION_BASELINE_DRIFT')
})

test('CLI has no implicit command or production path', async () => {
  await assert.rejects(runReviewedStatePromotionCli([], '/workspace/project'), (error) => error.code === 'PROMOTION_USAGE_ERROR')
  await assert.rejects(runReviewedStatePromotionCli(['prepare'], '/workspace/project'), (error) => error.code === 'PROMOTION_USAGE_ERROR')
})

test('staging uses the same production contract as post-apply verification', () => {
  assert.deepEqual(productionContractArgs('/tmp/staging-root'), ['--canonical-root', '/tmp/staging-root/observations'])
})

async function lstatSafe(target) {
  try { await readFile(target); return true } catch (error) { if (error.code === 'ENOENT') return false; throw error }
}
