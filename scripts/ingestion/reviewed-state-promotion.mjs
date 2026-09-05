import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import { access, cp, mkdir, mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const OBSERVATION_FILES = Object.freeze([
  'amzn-ppe-purchases.json',
  'goog-annual-capex-guidance.json',
  'meta-annual-capex-guidance.json',
  'msft-management-total-capex.json',
  'tsm-monthly.json',
])
const ALLOWED_TOP_LEVEL = new Set(['manifests', 'observations', 'raw', 'runs'])
const SHA256 = /^[a-f0-9]{64}$/

function fail(code, message, details = {}) {
  throw Object.assign(new Error(message), { code, details })
}

function digest(value) {
  return createHash('sha256').update(value).digest('hex')
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`
  return JSON.stringify(value)
}

function assertSha256(value, label) {
  if (!SHA256.test(value ?? '')) fail('INVALID_EXPECTED_HASH', `${label} must be a lowercase SHA-256`)
}

function explicitPath(value, label) {
  if (!value || typeof value !== 'string') fail('MISSING_PATH', `${label} must be supplied explicitly`)
  return path.resolve(value)
}

function safeRelative(value, label) {
  if (!value || value.includes('\\')) fail('UNSAFE_PATH', `${label} must be a non-empty POSIX relative path`, { path: value })
  const normalized = path.posix.normalize(value)
  if (normalized !== value || normalized.startsWith('../') || normalized === '..' || path.posix.isAbsolute(normalized)) {
    fail('UNSAFE_PATH', `${label} escapes its root`, { path: value })
  }
  if (!ALLOWED_TOP_LEVEL.has(normalized.split('/')[0])) fail('UNEXPECTED_FILE', `${label} is outside the promotion allowlist`, { path: value })
  return normalized
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child)
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
}

function assertSeparatedRoots(sourceRoot, productionRoot) {
  if (sourceRoot === productionRoot || isWithin(sourceRoot, productionRoot) || isWithin(productionRoot, sourceRoot)) {
    fail('OVERLAPPING_ROOTS', 'Source and production roots must be disjoint')
  }
}

async function exists(target) {
  try { await access(target); return true } catch (error) { if (error.code === 'ENOENT') return false; throw error }
}

async function hashFile(target) {
  return digest(await readFile(target))
}

async function readJson(target, label) {
  try { return JSON.parse(await readFile(target, 'utf8')) }
  catch (error) { fail('INVALID_JSON', `${label} is not valid JSON`, { path: target, cause: error.message }) }
}

async function walkFiles(root, relative = '') {
  const directory = path.join(root, relative)
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const next = relative ? path.posix.join(relative, entry.name) : entry.name
    if (entry.isSymbolicLink()) fail('UNSAFE_FILE_TYPE', 'Symlinks are forbidden in reviewed state', { path: next })
    if (entry.isDirectory()) files.push(...await walkFiles(root, next))
    else if (entry.isFile()) files.push(next)
    else fail('UNSAFE_FILE_TYPE', 'Only regular files and directories are allowed', { path: next })
  }
  return files
}

async function inventory(root) {
  const files = await walkFiles(root)
  const result = []
  for (const relativePath of files) {
    const safePath = safeRelative(relativePath, 'Disposable file')
    const metadata = await stat(path.join(root, safePath))
    result.push({ path: safePath, sha256: await hashFile(path.join(root, safePath)), bytes: metadata.size })
  }
  return result
}

function observationPath(file) {
  return path.posix.join('observations', file)
}

async function validateRunReport(target) {
  const report = await readJson(target, 'Ingestion run report')
  if (report.overallHealth !== 'HEALTHY' || report.baselineVerification?.status !== 'PASSED' || report.proposedStateVerification?.status !== 'PASSED' || report.totals?.failures !== 0) {
    fail('UNHEALTHY_RUN_REPORT', 'Reviewed ingestion run is not healthy')
  }
  return report
}

async function validateManifests(sourceRoot, fileInventory) {
  const byPath = new Map(fileInventory.map((item) => [item.path, item]))
  const bySnapshotId = new Map()
  const manifests = fileInventory.filter((item) => item.path.startsWith('manifests/'))
  for (const item of manifests) {
    const manifest = await readJson(path.join(sourceRoot, item.path), 'Snapshot manifest')
    if (manifest.manifestPath !== item.path) fail('MANIFEST_PATH_MISMATCH', 'Manifest path does not match its location', { path: item.path })
    const rawPath = safeRelative(manifest.rawContentPath, 'Manifest rawContentPath')
    if (!rawPath.startsWith('raw/')) fail('MANIFEST_RAW_PATH', 'Manifest rawContentPath must be under raw/', { path: rawPath })
    const raw = byPath.get(rawPath)
    if (!raw) fail('MISSING_RAW_CONTENT', 'Manifest raw content is absent', { manifest: item.path, rawPath })
    if (rawPath.split('/')[1] !== manifest.issuer) fail('MANIFEST_RAW_ISSUER_MISMATCH', 'Manifest raw-content issuer directory does not match manifest issuer', { manifest: item.path, rawPath })
    if (raw.sha256 !== manifest.sha256) fail('RAW_HASH_MISMATCH', 'Manifest raw-content SHA-256 does not match', { manifest: item.path, rawPath })
    if (raw.bytes !== manifest.contentLength) fail('RAW_LENGTH_MISMATCH', 'Manifest raw-content length does not match', { manifest: item.path, rawPath })
    if (!manifest.snapshotId || bySnapshotId.has(manifest.snapshotId)) fail('DUPLICATE_SNAPSHOT_ID', 'Snapshot IDs must be present and unique', { manifest: item.path })
    const snapshotHash = manifest.snapshotId.match(/^raw-snapshot:(?:live|fixture):sha256:([a-f0-9]{64})$/)?.[1]
    if (!snapshotHash || path.posix.basename(item.path, '.json') !== snapshotHash) fail('MANIFEST_IDENTITY_MISMATCH', 'Manifest filename does not match snapshot identity', { manifest: item.path })
    if (item.path.split('/')[1] !== manifest.issuer) fail('MANIFEST_ISSUER_MISMATCH', 'Manifest issuer directory does not match manifest issuer', { manifest: item.path })
    bySnapshotId.set(manifest.snapshotId, { path: item.path, manifest })
  }
  return bySnapshotId
}

async function validateObservations(sourceRoot, productionRoot, expectedProductionHashes, manifests, fileInventory) {
  const expectedPaths = OBSERVATION_FILES.map(observationPath)
  const actualPaths = fileInventory.filter((item) => item.path.startsWith('observations/')).map((item) => item.path)
  if (actualPaths.sort().join('\n') !== [...expectedPaths].sort().join('\n')) {
    fail('OBSERVATION_SET_MISMATCH', 'Reviewed state must contain exactly the five canonical observations')
  }
  if (Object.keys(expectedProductionHashes).sort().join('\n') !== [...expectedPaths].sort().join('\n')) {
    fail('BASELINE_SET_MISMATCH', 'Expected production hashes must cover exactly the five canonical observations')
  }
  for (const relativePath of expectedPaths) {
    assertSha256(expectedProductionHashes[relativePath], `Expected production hash for ${relativePath}`)
    const productionPath = path.join(productionRoot, relativePath)
    const sourcePath = path.join(sourceRoot, relativePath)
    if (!await exists(productionPath) || !await exists(sourcePath)) fail('MISSING_OBSERVATION', 'Canonical observation is missing', { path: relativePath })
    const currentHash = await hashFile(productionPath)
    if (currentHash !== expectedProductionHashes[relativePath]) fail('PRODUCTION_BASELINE_DRIFT', 'Production observation changed after review', { path: relativePath, expected: expectedProductionHashes[relativePath], actual: currentHash })
    const baseline = await readJson(productionPath, 'Production observation')
    const proposed = await readJson(sourcePath, 'Proposed observation')
    const baselineRecords = new Map((baseline.records ?? []).map((record) => [record.recordId, record]))
    const proposedRecords = new Map((proposed.records ?? []).map((record) => [record.recordId, record]))
    if (baselineRecords.size !== (baseline.records ?? []).length || proposedRecords.size !== (proposed.records ?? []).length) {
      fail('DUPLICATE_RECORD_ID', 'Canonical observations must not contain duplicate record IDs', { path: relativePath })
    }
    const baselineIds = new Set(baselineRecords.keys())
    const proposedIds = new Set(proposedRecords.keys())
    for (const recordId of baselineIds) if (!proposedIds.has(recordId)) fail('BASELINE_RECORD_REMOVED', 'Proposed state removed a baseline record', { path: relativePath, recordId })
    for (const [recordId, baselineRecord] of baselineRecords) {
      const proposedRecord = proposedRecords.get(recordId)
      const baselineContent = { ...baselineRecord, status: undefined }
      const proposedContent = { ...proposedRecord, status: undefined }
      const validTransition = baselineRecord.status === proposedRecord.status || (baselineRecord.status === 'ACTIVE' && proposedRecord.status === 'SUPERSEDED')
      if (!validTransition || stableJson(baselineContent) !== stableJson(proposedContent)) {
        fail('BASELINE_RECORD_MUTATED', 'Proposed state mutated an existing record beyond an allowed status transition', { path: relativePath, recordId })
      }
    }
    for (const record of proposed.records ?? []) {
      const sourceManifest = manifests.get(record.snapshotId)
      if (!baselineIds.has(record.recordId) && !sourceManifest) {
        fail('UNBACKED_PROPOSED_RECORD', 'New proposed record has no reviewed snapshot manifest', { path: relativePath, recordId: record.recordId, snapshotId: record.snapshotId })
      }
      if (!baselineIds.has(record.recordId) && sourceManifest.manifest.acquisitionMode !== 'LIVE') {
        fail('NON_LIVE_PROPOSED_RECORD', 'New proposed records must be backed by a reviewed LIVE snapshot', { path: relativePath, recordId: record.recordId, manifest: sourceManifest.path })
      }
    }
  }
}

async function buildDelta(sourceRoot, productionRoot, fileInventory) {
  const entries = []
  for (const item of fileInventory) {
    const destination = path.join(productionRoot, item.path)
    if (!await exists(destination)) {
      if (item.path.startsWith('manifests/')) {
        const manifest = await readJson(path.join(sourceRoot, item.path), 'New snapshot manifest')
        if (manifest.acquisitionMode !== 'LIVE') fail('NON_LIVE_MANIFEST_ADD', 'Only reviewed LIVE manifests may be added', { path: item.path })
      }
      entries.push({ ...item, action: 'ADD' })
      continue
    }
    const destinationHash = await hashFile(destination)
    if (destinationHash === item.sha256) { entries.push({ ...item, action: 'UNCHANGED' }); continue }
    if (item.path.startsWith('observations/')) { entries.push({ ...item, action: 'REPLACE', previousSha256: destinationHash }); continue }
    fail('DESTINATION_COLLISION', 'Existing non-observation file has different bytes', { path: item.path, sourceSha256: item.sha256, destinationSha256: destinationHash })
  }
  return entries
}

export async function prepareReviewedStatePromotion({
  sourceRoot,
  productionRoot,
  reviewReportPath,
  expectedReviewReportSha256,
  runReportRelativePath,
  expectedRunReportSha256,
  expectedProductionHashes,
  bundleOutputPath,
} = {}) {
  const source = explicitPath(sourceRoot, 'Source root')
  const production = explicitPath(productionRoot, 'Production root')
  const review = explicitPath(reviewReportPath, 'Review report')
  assertSeparatedRoots(source, production)
  assertSha256(expectedReviewReportSha256, 'Expected review report hash')
  assertSha256(expectedRunReportSha256, 'Expected run report hash')
  if (await hashFile(review) !== expectedReviewReportSha256) fail('REVIEW_REPORT_DRIFT', 'Reviewed report SHA-256 changed')
  const runRelative = safeRelative(runReportRelativePath, 'Run report path')
  if (!runRelative.startsWith('runs/')) fail('RUN_REPORT_PATH', 'Run report must be under runs/')
  const runPath = path.join(source, runRelative)
  if (await hashFile(runPath) !== expectedRunReportSha256) fail('RUN_REPORT_DRIFT', 'Ingestion run report SHA-256 changed')
  const runReport = await validateRunReport(runPath)
  const fileInventory = await inventory(source)
  const manifests = await validateManifests(source, fileInventory)
  await validateObservations(source, production, expectedProductionHashes, manifests, fileInventory)
  const productionInventory = await inventory(production)
  const entries = await buildDelta(source, production, fileInventory)
  const proposedByPath = new Map(productionInventory.map((item) => [item.path, item]))
  for (const item of entries) if (item.action !== 'UNCHANGED') proposedByPath.set(item.path, { path: item.path, sha256: item.sha256, bytes: item.bytes })
  const bundle = {
    schemaVersion: 1,
    sourceRoot: source,
    productionRoot: production,
    reviewReport: { path: review, sha256: expectedReviewReportSha256 },
    runReport: { path: runRelative, sha256: expectedRunReportSha256, runId: runReport.runId },
    productionObservationHashes: Object.fromEntries(Object.entries(expectedProductionHashes).sort(([a], [b]) => a.localeCompare(b))),
    productionInventory,
    sourceInventory: fileInventory,
    proposedProductionInventory: [...proposedByPath.values()].sort((a, b) => a.path.localeCompare(b.path)),
    exactDelta: entries.filter((item) => item.action !== 'UNCHANGED'),
    unchanged: entries.filter((item) => item.action === 'UNCHANGED'),
  }
  const serialized = `${stableJson(bundle)}\n`
  const bundleSha256 = digest(serialized)
  if (bundleOutputPath) {
    await mkdir(path.dirname(path.resolve(bundleOutputPath)), { recursive: true })
    await writeFile(path.resolve(bundleOutputPath), serialized, { flag: 'wx' })
  }
  return { bundle, bundleSha256, serialized }
}

async function copyDelta(sourceRoot, stagingRoot, exactDelta) {
  for (const item of exactDelta) {
    const source = path.join(sourceRoot, item.path)
    const destination = path.join(stagingRoot, item.path)
    await mkdir(path.dirname(destination), { recursive: true })
    await cp(source, destination, { force: item.action === 'REPLACE', errorOnExist: item.action === 'ADD' })
    if (await hashFile(destination) !== item.sha256) fail('STAGING_COPY_MISMATCH', 'Staged file differs from reviewed source', { path: item.path })
  }
}

export async function applyReviewedStatePromotion({
  bundlePath,
  expectedBundleSha256,
  rollbackRoot,
  deltaOutputPath,
  verifyStaged,
  verifyProduction,
} = {}) {
  assertSha256(expectedBundleSha256, 'Expected promotion bundle hash')
  const bundleTarget = explicitPath(bundlePath, 'Promotion bundle')
  const bundleBytes = await readFile(bundleTarget)
  if (digest(bundleBytes) !== expectedBundleSha256) fail('BUNDLE_HASH_MISMATCH', 'Promotion bundle SHA-256 changed')
  const bundle = await readJson(bundleTarget, 'Promotion bundle')
  if (bundle.schemaVersion !== 1) fail('BUNDLE_SCHEMA', 'Unsupported promotion bundle schema')
  const rollback = explicitPath(rollbackRoot, 'Rollback root')
  const deltaOutput = explicitPath(deltaOutputPath, 'Delta output')
  const source = path.resolve(bundle.sourceRoot)
  const production = path.resolve(bundle.productionRoot)
  assertSeparatedRoots(source, production)
  if (isWithin(production, rollback) || isWithin(production, deltaOutput) || isWithin(source, rollback) || isWithin(source, deltaOutput) || rollback === deltaOutput || isWithin(rollback, deltaOutput) || isWithin(deltaOutput, rollback)) {
    fail('UNSAFE_OUTPUT_PATH', 'Rollback and delta outputs must be separate and outside source and production')
  }
  if (await exists(rollback) || await exists(deltaOutput)) fail('OUTPUT_ALREADY_EXISTS', 'Rollback and delta outputs must not already exist')
  if (typeof verifyStaged !== 'function' || typeof verifyProduction !== 'function') fail('MISSING_VERIFIER', 'Staged and post-apply verifiers are required')
  const fresh = await prepareReviewedStatePromotion({
    sourceRoot: source,
    productionRoot: production,
    reviewReportPath: bundle.reviewReport.path,
    expectedReviewReportSha256: bundle.reviewReport.sha256,
    runReportRelativePath: bundle.runReport.path,
    expectedRunReportSha256: bundle.runReport.sha256,
    expectedProductionHashes: bundle.productionObservationHashes,
  })
  if (fresh.serialized !== bundleBytes.toString('utf8')) fail('BUNDLE_STATE_DRIFT', 'Current reviewed state no longer matches the approved bundle')
  await mkdir(path.dirname(deltaOutput), { recursive: true })
  await writeFile(deltaOutput, `${stableJson({ schemaVersion: 1, bundleSha256: expectedBundleSha256, exactDelta: bundle.exactDelta })}\n`, { flag: 'wx' })
  const parent = path.dirname(production)
  const staging = await mkdtemp(path.join(parent, `${path.basename(production)}.staging-`))
  const displaced = path.join(parent, `${path.basename(production)}.displaced-${digest(expectedBundleSha256).slice(0, 16)}`)
  let productionDisplaced = false
  try {
    await cp(production, staging, { recursive: true })
    await copyDelta(source, staging, bundle.exactDelta)
    if (stableJson(await inventory(staging)) !== stableJson(bundle.proposedProductionInventory)) fail('STAGING_INVENTORY_MISMATCH', 'Staged root does not match exact proposed inventory')
    await verifyStaged(staging)
    const finalCheck = await prepareReviewedStatePromotion({
      sourceRoot: source,
      productionRoot: production,
      reviewReportPath: bundle.reviewReport.path,
      expectedReviewReportSha256: bundle.reviewReport.sha256,
      runReportRelativePath: bundle.runReport.path,
      expectedRunReportSha256: bundle.runReport.sha256,
      expectedProductionHashes: bundle.productionObservationHashes,
    })
    if (finalCheck.bundleSha256 !== expectedBundleSha256) fail('PRE_APPLY_DRIFT', 'Reviewed state changed after staging verification')
    await cp(production, rollback, { recursive: true, errorOnExist: true })
    if (stableJson(await inventory(rollback)) !== stableJson(bundle.productionInventory)) fail('ROLLBACK_SNAPSHOT_MISMATCH', 'Rollback snapshot does not match production baseline')
    if (await exists(displaced)) fail('DISPLACED_ROOT_EXISTS', 'Internal displaced-root path already exists', { path: displaced })
    await rename(production, displaced)
    productionDisplaced = true
    await rename(staging, production)
    if (stableJson(await inventory(production)) !== stableJson(bundle.proposedProductionInventory)) fail('PRODUCTION_INVENTORY_MISMATCH', 'Promoted root does not match exact proposed inventory')
    await verifyProduction(production)
    await rm(displaced, { recursive: true, force: true })
    productionDisplaced = false
    return { bundleSha256: expectedBundleSha256, rollbackRoot: rollback, deltaOutputPath: deltaOutput, exactDelta: bundle.exactDelta }
  } catch (error) {
    if (productionDisplaced) {
      if (await exists(production)) await rm(production, { recursive: true, force: true })
      await rename(displaced, production)
      productionDisplaced = false
    }
    throw error
  } finally {
    if (await exists(staging)) await rm(staging, { recursive: true, force: true })
  }
}

function parseArguments(args) {
  const command = args[0]
  if (!['prepare', 'apply'].includes(command)) fail('PROMOTION_USAGE_ERROR', 'First argument must be prepare or apply')
  const options = {}
  for (let index = 1; index < args.length; index += 2) {
    const flag = args[index], value = args[index + 1]
    if (!flag?.startsWith('--') || value === undefined || value.startsWith('--')) fail('PROMOTION_USAGE_ERROR', `Missing value for ${flag ?? 'argument'}`)
    if (options[flag] !== undefined) fail('PROMOTION_USAGE_ERROR', `Duplicate argument: ${flag}`)
    options[flag] = value
  }
  return { command, options }
}

function required(options, name) {
  if (!options[name]) fail('PROMOTION_USAGE_ERROR', `Missing required argument: ${name}`)
  return options[name]
}

async function expectedBaselineHashes(target, expectedSha256) {
  const hashesPath = explicitPath(target, 'Expected production hashes file')
  assertSha256(expectedSha256, 'Expected production hashes file hash')
  if (await hashFile(hashesPath) !== expectedSha256) fail('BASELINE_HASH_FILE_DRIFT', 'Expected production hashes file SHA-256 changed')
  return readJson(hashesPath, 'Expected production hashes file')
}

function runVerifier(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['scripts/ingestion/verify-production-downstream.mjs', ...args], { cwd, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => code === 0 ? resolve() : reject(Object.assign(new Error(`Downstream verifier exited ${code}`), { code: 'DOWNSTREAM_VERIFICATION_FAILED' })))
  })
}

export function productionContractArgs(stagingRoot) {
  return ['--canonical-root', path.join(stagingRoot, 'observations')]
}

function assertCliProductionRoot(productionRoot, cwd) {
  const expected = path.resolve(cwd, 'data', 'ingestion')
  if (path.resolve(productionRoot) !== expected) fail('CLI_PRODUCTION_ROOT_MISMATCH', 'CLI production root must be the current repository data/ingestion path', { expected, actual: path.resolve(productionRoot) })
}

export async function runReviewedStatePromotionCli(args = process.argv.slice(2), cwd = process.cwd()) {
  const { command, options } = parseArguments(args)
  if (command === 'prepare') {
    const productionRoot = path.resolve(required(options, '--production-root'))
    assertCliProductionRoot(productionRoot, cwd)
    const result = await prepareReviewedStatePromotion({
      sourceRoot: required(options, '--source-root'),
      productionRoot,
      reviewReportPath: required(options, '--review-report'),
      expectedReviewReportSha256: required(options, '--expected-review-sha256'),
      runReportRelativePath: required(options, '--run-report'),
      expectedRunReportSha256: required(options, '--expected-run-sha256'),
      expectedProductionHashes: await expectedBaselineHashes(
        required(options, '--expected-production-hashes'),
        required(options, '--expected-production-hashes-sha256'),
      ),
      bundleOutputPath: required(options, '--bundle-out'),
    })
    process.stdout.write(`${JSON.stringify({ status: 'PREPARED', bundleSha256: result.bundleSha256, exactDeltaFiles: result.bundle.exactDelta.length }, null, 2)}\n`)
    return result
  }
  const bundlePath = required(options, '--bundle')
  const bundle = await readJson(path.resolve(bundlePath), 'Promotion bundle')
  assertCliProductionRoot(bundle.productionRoot, cwd)
  const result = await applyReviewedStatePromotion({
    bundlePath,
    expectedBundleSha256: required(options, '--expected-bundle-sha256'),
    rollbackRoot: required(options, '--rollback-root'),
    deltaOutputPath: required(options, '--delta-out'),
    verifyStaged: (stagingRoot) => runVerifier(productionContractArgs(stagingRoot), cwd),
    verifyProduction: () => runVerifier([], cwd),
  })
  process.stdout.write(`${JSON.stringify({ status: 'PROMOTED_AND_VERIFIED', bundleSha256: result.bundleSha256, rollbackRoot: result.rollbackRoot, exactDeltaFiles: result.exactDelta.length }, null, 2)}\n`)
  return result
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (isMain) runReviewedStatePromotionCli().catch((error) => {
  process.stderr.write(`Reviewed-state promotion failed closed [${error.code ?? 'UNEXPECTED'}]: ${error.message}\n`)
  process.exitCode = 1
})
