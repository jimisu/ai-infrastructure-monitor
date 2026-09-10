import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, realpath, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  applyReviewedStatePromotion,
  canonicalExistingPath,
  canonicalOutputPath,
  digest,
  isWithin,
  prepareReviewedStatePromotion,
  productionContractArgs,
  safeRelative,
  stableJson,
} from '../../scripts/ingestion/reviewed-state-promotion.mjs'
import { forAll, intBetween, mulberry32 } from './forAll.mjs'

const observationFiles = [
  'amzn-ppe-purchases.json',
  'goog-annual-capex-guidance.json',
  'meta-annual-capex-guidance.json',
  'msft-management-total-capex.json',
  'tsm-monthly.json',
]

function shuffle(random, values) {
  const copy = [...values]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = intBetween(random, 0, index)
    const current = copy[index]
    copy[index] = copy[swap]
    copy[swap] = current
  }
  return copy
}

function jsonLeaf(random) {
  const pick = intBetween(random, 0, 4)
  if (pick === 0) return null
  if (pick === 1) return intBetween(random, -50, 50)
  if (pick === 2) return random() < 0.5
  if (pick === 3) return `k${intBetween(random, 0, 20)}`
  return intBetween(random, 0, 1_000_000).toString(16)
}

function jsonValue(random, depth = 0) {
  if (depth > 2) return jsonLeaf(random)
  const pick = intBetween(random, 0, 3)
  if (pick === 0) return jsonLeaf(random)
  if (pick === 1) return Array.from({ length: intBetween(random, 0, 3) }, () => jsonValue(random, depth + 1))
  const keys = shuffle(random, ['a', 'b', 'c', 'd']).slice(0, intBetween(random, 0, 4))
  return Object.fromEntries(keys.map((key) => [key, jsonValue(random, depth + 1)]))
}

function reorderObject(random, value) {
  if (Array.isArray(value)) return value.map((item) => reorderObject(random, item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(shuffle(random, Object.keys(value)).map((key) => [key, reorderObject(random, value[key])]))
  }
  return value
}

async function json(target, value) {
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`)
}

async function promotionFixture() {
  const sandbox = await mkdtemp(path.join(os.tmpdir(), 'reviewed-promotion-property-'))
  const sourceRoot = path.join(sandbox, 'reviewed')
  const productionRoot = path.join(sandbox, 'production')
  const reviewReportPath = path.join(sandbox, 'review.md')
  const runReportRelativePath = 'runs/reviewed-run.json'
  const snapshotHash = 'a'.repeat(64)
  const snapshotId = `raw-snapshot:live:sha256:${snapshotHash}`
  const raw = Buffer.from('<html>official evidence</html>')
  const rawHash = digest(raw)
  const rawRelativePath = `raw/TSM/${rawHash}.html`
  const manifestRelativePath = `manifests/TSM/${snapshotHash}.json`
  const baselineDocument = { schemaVersion: 2, pipelineId: 'test', issuer: 'TSM', sourceId: 'test', latestSnapshotIds: [], records: [] }
  for (const file of observationFiles) {
    await json(path.join(productionRoot, 'observations', file), baselineDocument)
    await json(path.join(sourceRoot, 'observations', file), baselineDocument)
  }
  await json(path.join(sourceRoot, 'observations', 'tsm-monthly.json'), {
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
  })
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
  await json(path.join(sourceRoot, runReportRelativePath), {
    schemaVersion: 4,
    runId: `ingestion-run:sha256:${'b'.repeat(64)}`,
    overallHealth: 'HEALTHY',
    totals: { failures: 0 },
    baselineVerification: { status: 'PASSED' },
    proposedStateVerification: { status: 'PASSED' },
  })
  await writeFile(reviewReportPath, '# Reviewed\n')
  const expectedProductionHashes = Object.fromEntries(await Promise.all(observationFiles.map(async (file) => {
    const relativePath = `observations/${file}`
    return [relativePath, digest(await readFile(path.join(productionRoot, relativePath)))]
  })))
  return {
    sandbox,
    sourceRoot,
    productionRoot,
    reviewReportPath,
    expectedReviewReportSha256: digest(await readFile(reviewReportPath)),
    runReportRelativePath,
    expectedRunReportSha256: digest(await readFile(path.join(sourceRoot, runReportRelativePath))),
    expectedProductionHashes,
  }
}

const noop = async () => {}

function applyArgs(prepared, bundlePath, rollbackRoot, deltaOutputPath) {
  return {
    bundlePath,
    expectedBundleSha256: prepared.bundleSha256,
    rollbackRoot,
    deltaOutputPath,
    verifyStaged: noop,
    verifyProduction: noop,
  }
}

forAll('stableJson is independent of object key insertion order', {
  times: 100,
  seed: 20260910,
  gen: (random) => jsonValue(random),
}, (value) => {
  const reordered = reorderObject(mulberry32(Number.parseInt(digest(stableJson(value)).slice(0, 8), 16)), value)
  assert.equal(stableJson(value), stableJson(reordered))
})

forAll('digest is deterministic 64-char lowercase hex', {
  times: 100,
  seed: 3,
  gen: (random) => jsonValue(random),
}, (value) => {
  const bytes = stableJson(value)
  const first = digest(bytes)
  const second = digest(bytes)
  assert.equal(first, second)
  assert.match(first, /^[a-f0-9]{64}$/)
})

forAll('safeRelative rejects traversal, separators, and non-allowlisted roots', {
  times: 100,
  seed: 11,
  gen: (random, i) => {
    const sentinels = ['../secret', '/tmp/x', 'unexpected.txt', 'obs\\win', '..', 'observations/../raw/x', '']
    if (i < sentinels.length) return sentinels[i]
    const prefix = ['..', '/abs', 'tmp', 'observations/../x'][intBetween(random, 0, 3)]
    return `${prefix}/${intBetween(random, 1, 99)}`
  },
}, (value) => {
  assert.throws(() => safeRelative(value, 'path'), (error) => ['UNSAFE_PATH', 'UNEXPECTED_FILE'].includes(error.code))
})

forAll('safeRelative returns already-normalized allowlisted paths', {
  times: 50,
  seed: 13,
  gen: (random) => {
    const root = ['manifests', 'observations', 'raw', 'runs'][intBetween(random, 0, 3)]
    const leaf = `${intBetween(random, 1, 99)}.json`
    return `${root}/TSM/${leaf}`
  },
}, (value) => {
  assert.equal(safeRelative(value, 'path'), value)
})

forAll('isWithin is reflexive and rejects siblings', {
  times: 50,
  seed: 17,
  gen: (random) => {
    const parent = path.resolve(os.tmpdir(), `within-${intBetween(random, 1, 1000)}`)
    return {
      parent,
      child: path.join(parent, `child-${intBetween(random, 1, 20)}`),
      sibling: path.resolve(os.tmpdir(), `sibling-${intBetween(random, 1, 1000)}`),
    }
  },
}, ({ parent, child, sibling }) => {
  assert.equal(isWithin(parent, parent), true)
  assert.equal(isWithin(parent, child), true)
  if (sibling !== parent && !sibling.startsWith(`${parent}${path.sep}`)) {
    assert.equal(isWithin(parent, sibling), false)
  }
})

forAll('productionContractArgs always point at staging observations', {
  times: 40,
  seed: 19,
  gen: (random) => path.resolve(os.tmpdir(), `staging-${intBetween(random, 1, 5000)}`),
}, (stagingRoot) => {
  assert.deepEqual(productionContractArgs(stagingRoot), ['--canonical-root', path.join(stagingRoot, 'observations')])
})

forAll('prepare bundle hash is idempotent and key-order invariant', {
  times: 8,
  seed: 23,
  gen: async (random) => ({ random, state: await promotionFixture() }),
}, async ({ random, state }) => {
  const first = await prepareReviewedStatePromotion(state)
  const second = await prepareReviewedStatePromotion(state)
  assert.equal(first.bundleSha256, second.bundleSha256)
  const shuffledHashes = Object.fromEntries(shuffle(random, Object.entries(state.expectedProductionHashes)))
  const reordered = await prepareReviewedStatePromotion({ ...state, expectedProductionHashes: shuffledHashes })
  assert.equal(reordered.bundleSha256, first.bundleSha256)
  const sourcePaths = first.bundle.sourceInventory.map((item) => item.path).sort()
  const partitioned = [...first.bundle.exactDelta, ...first.bundle.unchanged].map((item) => item.path).sort()
  assert.deepEqual(partitioned, sourcePaths)
  assert.equal(first.bundle.exactDelta.length + first.bundle.unchanged.length, first.bundle.sourceInventory.length)
})

forAll('canonicalExistingPath of a symlink alias equals the target real path', {
  times: 12,
  seed: 29,
  gen: async (random) => {
    const sandbox = await mkdtemp(path.join(os.tmpdir(), 'canonical-existing-'))
    const target = path.join(sandbox, `target-${intBetween(random, 1, 50)}`)
    await mkdir(target)
    const alias = path.join(sandbox, `alias-${intBetween(random, 1, 50)}`)
    await symlink(target, alias)
    return { alias, target }
  },
}, async ({ alias, target }) => {
  assert.equal(await canonicalExistingPath(alias, 'alias'), await realpath(target))
})

forAll('canonicalOutputPath joins missing segments onto the real parent', {
  times: 12,
  seed: 31,
  gen: async (random) => {
    const sandbox = await mkdtemp(path.join(os.tmpdir(), 'canonical-output-'))
    const realParent = path.join(sandbox, `real-${intBetween(random, 1, 50)}`)
    await mkdir(realParent)
    const parentAlias = path.join(sandbox, `parent-${intBetween(random, 1, 50)}`)
    await symlink(realParent, parentAlias)
    const segments = Array.from({ length: intBetween(random, 1, 3) }, () => `seg-${intBetween(random, 1, 20)}`)
    return { parentAlias, realParent, segments }
  },
}, async ({ parentAlias, realParent, segments }) => {
  const canonical = await canonicalOutputPath(path.join(parentAlias, ...segments), 'output')
  assert.equal(canonical, path.join(await realpath(realParent), ...segments))
})

forAll('prepare rejects a root alias that resolves onto the other root', {
  times: 8,
  seed: 37,
  gen: async (random) => ({
    state: await promotionFixture(),
    aliasSource: random() < 0.5,
    aliasName: `overlap-${intBetween(random, 1, 200)}`,
  }),
}, async ({ state, aliasSource, aliasName }) => {
  const alias = path.join(state.sandbox, aliasName)
  if (aliasSource) {
    await symlink(state.productionRoot, alias)
    await assert.rejects(prepareReviewedStatePromotion({ ...state, sourceRoot: alias }), (error) => error.code === 'OVERLAPPING_ROOTS')
  } else {
    await symlink(state.sourceRoot, alias)
    await assert.rejects(prepareReviewedStatePromotion({ ...state, productionRoot: alias }), (error) => error.code === 'OVERLAPPING_ROOTS')
  }
})

forAll('apply rejects an output whose parent aliases a protected root', {
  times: 8,
  seed: 41,
  gen: async (random) => ({
    state: await promotionFixture(),
    intoProduction: random() < 0.5,
    aliasDelta: random() < 0.5,
    aliasName: `out-parent-${intBetween(random, 1, 200)}`,
  }),
}, async ({ state, intoProduction, aliasDelta, aliasName }) => {
  const bundlePath = path.join(state.sandbox, 'bundle.json')
  const prepared = await prepareReviewedStatePromotion({ ...state, bundleOutputPath: bundlePath })
  const aliasParent = path.join(state.sandbox, aliasName)
  await symlink(intoProduction ? state.productionRoot : state.sourceRoot, aliasParent)
  const rollbackRoot = aliasDelta ? path.join(state.sandbox, 'rollback') : path.join(aliasParent, 'rollback')
  const deltaOutputPath = aliasDelta ? path.join(aliasParent, 'delta.json') : path.join(state.sandbox, 'delta.json')
  await assert.rejects(
    applyReviewedStatePromotion(applyArgs(prepared, bundlePath, rollbackRoot, deltaOutputPath)),
    (error) => error.code === 'UNSAFE_OUTPUT_PATH',
  )
})

forAll('disjoint root aliases persist real paths and nested outputs still apply', {
  times: 6,
  seed: 43,
  gen: async (random) => ({
    state: await promotionFixture(),
    nest: `out-${intBetween(random, 1, 50)}/n${intBetween(random, 1, 20)}`,
  }),
}, async ({ state, nest }) => {
  const sourceAlias = path.join(state.sandbox, 'reviewed-alias')
  const productionAlias = path.join(state.sandbox, 'production-alias')
  await symlink(state.sourceRoot, sourceAlias)
  await symlink(state.productionRoot, productionAlias)
  const prepared = await prepareReviewedStatePromotion({
    ...state,
    sourceRoot: sourceAlias,
    productionRoot: productionAlias,
    bundleOutputPath: path.join(state.sandbox, nest, 'bundle.json'),
  })
  assert.equal(prepared.bundle.sourceRoot, await realpath(state.sourceRoot))
  assert.equal(prepared.bundle.productionRoot, await realpath(state.productionRoot))
  const result = await applyReviewedStatePromotion(applyArgs(
    prepared,
    path.join(state.sandbox, nest, 'bundle.json'),
    path.join(state.sandbox, nest, 'rollback'),
    path.join(state.sandbox, nest, 'delta.json'),
  ))
  assert.equal(result.bundleSha256, prepared.bundleSha256)
  assert.equal(isWithin(prepared.bundle.productionRoot, result.rollbackRoot), false)
  assert.equal(isWithin(prepared.bundle.sourceRoot, result.deltaOutputPath), false)
})
