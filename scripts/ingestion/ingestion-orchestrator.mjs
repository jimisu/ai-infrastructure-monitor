import { createHash } from 'node:crypto'
import { cp, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { ingestTsmcMonthlyFromSec } from './tsm-sec-lib.mjs'
import { ingestMetaAnnualGuidance } from './meta-guidance-lib.mjs'
import { ingestMsftManagementTotalCapex } from './msft-capex-lib.mjs'
import { ingestGoogAnnualGuidance } from './goog-guidance-lib.mjs'
import { ingestAmznPpe } from './amzn-ppe-lib.mjs'

export const ISSUER_ORDER = Object.freeze(['TSMC', 'META', 'MSFT', 'GOOG', 'AMZN'])
const canonicalFiles = Object.freeze(['tsm-monthly.json','meta-annual-capex-guidance.json','msft-management-total-capex.json','goog-annual-capex-guidance.json','amzn-ppe-purchases.json'])
const hash = (value) => createHash('sha256').update(value).digest('hex')
const duration = (started, finished) => Math.max(0, finished - started)

export function normalizeIssuerResult(issuer, raw, durationMs) {
  const candidateCount = raw.candidateCount ?? raw.candidates?.length ?? 0
  const newFacts = raw.created ?? 0, revisions = raw.revisions ?? 0
  return { issuer, status: 'SUCCESS', newFacts, revisions, unchanged: Math.max(0, candidateCount - newFacts), quarantined: 0, durationMs, canonicalChanged: newFacts > 0 || (raw.transitions ?? 0) > 0 }
}

export function failedIssuerResult(issuer, error, durationMs) { return { issuer, status: 'FAILED', newFacts: 0, revisions: 0, unchanged: 0, quarantined: 0, errorCode: error?.code ?? 'UNEXPECTED', errorMessage: error?.message ?? String(error), durationMs, canonicalChanged: false } }

export function overallHealth(issuerResults, verification) {
  if (issuerResults.some((x) => x.status === 'FAILED')) return 'PARTIAL_FAILURE'
  if (verification.status === 'FAILED') return 'VERIFICATION_FAILURE'
  return 'HEALTHY'
}

export function summarizeRun({ runId, startedAt, finishedAt, dryRun, issuerResults, verification }) {
  const sum = (field) => issuerResults.reduce((total, item) => total + item[field], 0)
  const failures = issuerResults.filter((x) => x.status === 'FAILED').length
  return { schemaVersion: 1, runId, startedAt, finishedAt, dryRun, issuerOrder: [...ISSUER_ORDER], issuerResults, totals: { newFacts: sum('newFacts'), revisions: sum('revisions'), unchanged: sum('unchanged'), quarantined: sum('quarantined'), failures }, verification, overallHealth: overallHealth(issuerResults, verification) }
}

export function createProductionIssuerRunners({ outputRoot, retrievedAt, fetchImpl = fetch, secUserAgent = process.env.SEC_USER_AGENT }) {
  return {
    TSMC: () => ingestTsmcMonthlyFromSec({ outputRoot, retrievedAt, fetchImpl, secUserAgent }),
    META: () => ingestMetaAnnualGuidance({ outputRoot, retrievedAt, fetchImpl, secUserAgent }),
    MSFT: () => ingestMsftManagementTotalCapex({ outputRoot, retrievedAt, fetchImpl }),
    GOOG: () => ingestGoogAnnualGuidance({ outputRoot, retrievedAt, fetchImpl, secUserAgent }),
    AMZN: () => ingestAmznPpe({ outputRoot, retrievedAt, fetchImpl, secUserAgent }),
  }
}

async function seedDryRun(productionRoot) {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'ai-infra-ingestion-dry-run-'))
  await mkdir(path.join(temporary, 'observations'), { recursive: true })
  for (const file of canonicalFiles) await cp(path.join(productionRoot, 'observations', file), path.join(temporary, 'observations', file))
  return temporary
}

export function runReportFilename(report) { const match = /^ingestion-run:sha256:([a-f0-9]{64})$/.exec(report?.runId ?? ''); if (!match) throw new Error('Invalid deterministic ingestion run ID'); return `ingestion-run-${match[1]}.json` }

export async function persistRunReport(report, outputRoot) {
  const directory = path.join(outputRoot, 'runs'); await mkdir(directory, { recursive: true })
  const target = path.join(directory, runReportFilename(report)), temporary = `${target}.tmp-${process.pid}`
  await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`); await rename(temporary, target); return target
}

export async function orchestrateIngestion({ outputRoot = path.join(process.cwd(),'data','ingestion'), dryRun = false, issuerRunners, issuerRunnerFactory, verificationRunner, now = () => new Date(), persistReport = true, fetchImpl = fetch, secUserAgent = process.env.SEC_USER_AGENT } = {}) {
  const started = now(), startedAt = started.toISOString(), executionRoot = dryRun ? await seedDryRun(outputRoot) : outputRoot
  const runners = issuerRunners ?? issuerRunnerFactory?.(executionRoot) ?? createProductionIssuerRunners({ outputRoot: executionRoot, retrievedAt: startedAt, fetchImpl, secUserAgent })
  const issuerResults = []
  try {
    for (const issuer of ISSUER_ORDER) { const began = now().getTime(); try { const raw = await runners[issuer](); issuerResults.push(normalizeIssuerResult(issuer, raw, duration(began, now().getTime()))) } catch (error) { issuerResults.push(failedIssuerResult(issuer, error, duration(began, now().getTime()))) } }
    let verification
    try { const details = await verificationRunner(); verification = { status: 'PASSED', details: details ?? null } } catch (error) { verification = { status: 'FAILED', errorCode: error?.code ?? 'VERIFICATION_FAILED', errorMessage: error?.message ?? String(error) } }
    const finishedAt = now().toISOString(), identity = JSON.stringify({ startedAt, dryRun, issuerResults, verification })
    const report = summarizeRun({ runId: `ingestion-run:sha256:${hash(identity)}`, startedAt, finishedAt, dryRun, issuerResults, verification })
    const reportPath = persistReport ? await persistRunReport(report, outputRoot) : null
    return { report, reportPath, exitCode: report.overallHealth === 'HEALTHY' ? 0 : 1 }
  } finally { if (dryRun) await rm(executionRoot, { recursive: true, force: true }) }
}

export function formatRunSummary(report) {
  const lines = ['AI INFRASTRUCTURE INGESTION','']
  for (const item of report.issuerResults) lines.push(`${item.issuer.padEnd(6)} ${item.status}${item.errorCode ? ` [${item.errorCode}]` : ''}`)
  lines.push('',`New facts       ${report.totals.newFacts}`,`Revisions       ${report.totals.revisions}`,`Unchanged       ${report.totals.unchanged}`,`Quarantined     ${report.totals.quarantined}`,`Failures        ${report.totals.failures}`,'',`Verification: ${report.verification.status}`,'',`Overall:`,` ${report.overallHealth}`)
  return lines.join('\n')
}
