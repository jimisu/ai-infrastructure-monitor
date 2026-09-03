import { spawn } from 'node:child_process'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { orchestrateIngestion, formatRunSummary } from './ingestion-orchestrator.mjs'

function verify(args=[]) { return new Promise((resolve,reject) => { const child=spawn(process.execPath,['scripts/ingestion/verify-production-downstream.mjs',...args],{cwd:process.cwd(),stdio:'inherit'}); child.on('error',reject); child.on('exit',(code)=>code===0?resolve({productionSignals:'REGRESSION_PASSED'}):reject(Object.assign(new Error(`Downstream verification exited ${code}`),{code:'DOWNSTREAM_VERIFICATION_FAILED'}))) }) }

export function parseIngestionArguments(args = []) {
  const supported = new Set(['--dry-run', '--promote'])
  const unknown = args.filter((argument) => !supported.has(argument))
  if (unknown.length > 0) throw Object.assign(new Error(`Unsupported ingestion argument: ${unknown.join(', ')}`), { code: 'INGESTION_USAGE_ERROR' })
  const dryRunCount = args.filter((argument) => argument === '--dry-run').length
  const promoteCount = args.filter((argument) => argument === '--promote').length
  if (dryRunCount > 1 || promoteCount > 1 || (dryRunCount === 1 && promoteCount === 1)) {
    throw Object.assign(new Error('Use at most one of --dry-run or --promote'), { code: 'INGESTION_USAGE_ERROR' })
  }
  return { dryRun: promoteCount === 0 }
}

export async function runIngestAll({
  args = process.argv.slice(2),
  cwd = process.cwd(),
  orchestrate = orchestrateIngestion,
  verifyDownstream = verify,
  write = (value) => process.stdout.write(value),
  setExitCode = (value) => { process.exitCode = value },
} = {}) {
  const { dryRun } = parseIngestionArguments(args)
  const result = await orchestrate({
    outputRoot: path.join(cwd, 'data', 'ingestion'),
    dryRun,
    baselineVerificationRunner: () => verifyDownstream(),
    proposedStateVerificationRunner: (executionRoot) => verifyDownstream(['--proposed', '--canonical-root', path.join(executionRoot, 'observations')]),
  })
  write(`${formatRunSummary(result.report)}\n\nRun report: ${path.relative(cwd, result.reportPath)}\n`)
  setExitCode(result.exitCode)
  return result
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (isMain) await runIngestAll()
