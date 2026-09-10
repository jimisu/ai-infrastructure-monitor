import { spawn } from 'node:child_process'
import { realpath } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  applyReviewedStatePromotion,
  assertSha256,
  explicitPath,
  fail,
  hashFile,
  prepareReviewedStatePromotion,
  productionContractArgs,
  readJson,
} from './reviewed-state-transaction.mjs'

export {
  applyReviewedStatePromotion,
  assertSeparatedRoots,
  assertSha256,
  digest,
  explicitPath,
  hashFile,
  inventory,
  isWithin,
  prepareReviewedStatePromotion,
  productionContractArgs,
  readJson,
  safeRelative,
  stableJson,
} from './reviewed-state-transaction.mjs'

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

async function assertCliProductionRoot(productionRoot, cwd) {
  const expected = await realpath(path.resolve(cwd, 'data', 'ingestion'))
  const resolved = path.resolve(productionRoot)
  let actual
  try {
    actual = await realpath(resolved)
  } catch (error) {
    if (error.code === 'ENOENT') fail('CLI_PRODUCTION_ROOT_MISMATCH', 'CLI production root must be the current repository data/ingestion path', { expected, actual: resolved })
    throw error
  }
  if (actual !== expected) fail('CLI_PRODUCTION_ROOT_MISMATCH', 'CLI production root must be the current repository data/ingestion path', { expected, actual })
}

export async function runReviewedStatePromotionCli(args = process.argv.slice(2), cwd = process.cwd()) {
  const { command, options } = parseArguments(args)
  if (command === 'prepare') {
    const productionRoot = path.resolve(required(options, '--production-root'))
    await assertCliProductionRoot(productionRoot, cwd)
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
  await assertCliProductionRoot(bundle.productionRoot, cwd)
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
