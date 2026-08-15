import { createHash } from 'node:crypto'
import { cp, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { ingestTsmcMonthlyFromSec } from './tsm-sec-lib.mjs'
import { CURRENT_PRODUCTION_COVERAGE } from './coverage-contract.mjs'
import { ingestMetaAnnualGuidance } from './meta-guidance-lib.mjs'
import { ingestMsftManagementTotalCapex } from './msft-capex-lib.mjs'
import { ingestGoogAnnualGuidance } from './goog-guidance-lib.mjs'
import { ingestAmznPpe } from './amzn-ppe-lib.mjs'

export const ISSUER_ORDER = Object.freeze(['TSMC', 'META', 'MSFT', 'GOOG', 'AMZN'])
const canonicalFiles = Object.freeze(['tsm-monthly.json','meta-annual-capex-guidance.json','msft-management-total-capex.json','goog-annual-capex-guidance.json','amzn-ppe-purchases.json'])
const googFrozenFiles = Object.freeze([['manifests','GOOG','0a6941fd95f219193325a357a209cd5248765e662193d447a7a19f6b797ea85b.json'],['raw','GOOG','3cdd705034cd809cf911af0db442beef91e275ea9f049acf484f5662cba7bfae.html']])
const hash = (value) => createHash('sha256').update(value).digest('hex')
const duration = (started, finished) => Math.max(0, finished - started)

export function normalizeIssuerResult(issuer, raw, durationMs) {
  const candidateCount = raw.candidateCount ?? raw.candidates?.length ?? 0
  const newFacts = raw.newFacts ?? raw.created ?? 0, revisions = raw.revisions ?? 0, provenanceReassertions = raw.provenanceReassertions ?? 0
  return { issuer, status: 'SUCCESS', newFacts, revisions, provenanceReassertions, unchanged: Math.max(0, candidateCount - newFacts - provenanceReassertions), quarantined: 0, durationMs, warnings: Array.isArray(raw.warnings) ? raw.warnings : [], canonicalChanged: newFacts > 0 || provenanceReassertions > 0 || (raw.transitions ?? 0) > 0 }
}

export function failedIssuerResult(issuer, error, durationMs) { return { issuer, status: 'FAILED', newFacts: 0, revisions: 0, provenanceReassertions: 0, unchanged: 0, quarantined: 0, errorCode: error?.code ?? 'UNEXPECTED', errorMessage: error?.message ?? String(error), durationMs, canonicalChanged: false } }

export function overallHealth(issuerResults, baselineVerification, proposedStateVerification = baselineVerification) {
  if (issuerResults.some((x) => x.status === 'FAILED')) return 'PARTIAL_FAILURE'
  if (baselineVerification.status === 'FAILED' || proposedStateVerification.status === 'FAILED') return 'VERIFICATION_FAILURE'
  return 'HEALTHY'
}

export function summarizeRun({ runId, startedAt, finishedAt, dryRun, issuerResults, baselineVerification, proposedStateVerification, coverage = CURRENT_PRODUCTION_COVERAGE }) {
  const sum = (field) => issuerResults.reduce((total, item) => total + (item[field] ?? 0), 0)
  const failures = issuerResults.filter((x) => x.status === 'FAILED').length
  const warnings = issuerResults.reduce((total,item)=>total+(item.warnings?.length??0),0)
  return { schemaVersion: 4, runId, startedAt, finishedAt, dryRun, issuerOrder: [...ISSUER_ORDER], issuerResults, totals: { newFacts: sum('newFacts'), revisions: sum('revisions'), provenanceReassertions: sum('provenanceReassertions'), unchanged: sum('unchanged'), quarantined: sum('quarantined'), failures, warnings }, coverage, baselineVerification, proposedStateVerification, verification: baselineVerification, overallHealth: overallHealth(issuerResults, baselineVerification, proposedStateVerification) }
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

async function seedDryRun(productionRoot, includeFrozen) {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'ai-infra-ingestion-dry-run-'))
  await mkdir(path.join(temporary, 'observations'), { recursive: true })
  for (const file of canonicalFiles) await cp(path.join(productionRoot, 'observations', file), path.join(temporary, 'observations', file))
  if (includeFrozen) for (const segments of googFrozenFiles) { const target=path.join(temporary,...segments); await mkdir(path.dirname(target),{recursive:true}); await cp(path.join(productionRoot,...segments),target) }
  return temporary
}

export function runReportFilename(report) { const match = /^ingestion-run:sha256:([a-f0-9]{64})$/.exec(report?.runId ?? ''); if (!match) throw new Error('Invalid deterministic ingestion run ID'); return `ingestion-run-${match[1]}.json` }

export async function persistRunReport(report, outputRoot) {
  const directory = path.join(outputRoot, 'runs'); await mkdir(directory, { recursive: true })
  const target = path.join(directory, runReportFilename(report)), temporary = `${target}.tmp-${process.pid}`
  await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`); await rename(temporary, target); return target
}

export async function orchestrateIngestion({ outputRoot = path.join(process.cwd(),'data','ingestion'), dryRun = false, issuerRunners, issuerRunnerFactory, verificationRunner, baselineVerificationRunner = verificationRunner, proposedStateVerificationRunner = verificationRunner, now = () => new Date(), persistReport = true, fetchImpl = fetch, secUserAgent = process.env.SEC_USER_AGENT } = {}) {
  const started = now(), startedAt = started.toISOString(), executionRoot = dryRun ? await seedDryRun(outputRoot, !issuerRunners && !issuerRunnerFactory) : outputRoot
  const runners = issuerRunners ?? issuerRunnerFactory?.(executionRoot) ?? createProductionIssuerRunners({ outputRoot: executionRoot, retrievedAt: startedAt, fetchImpl, secUserAgent })
  const issuerResults = []
  try {
    for (const issuer of ISSUER_ORDER) { const began = now().getTime(); try { const raw = await runners[issuer](); issuerResults.push(normalizeIssuerResult(issuer, raw, duration(began, now().getTime()))) } catch (error) { issuerResults.push(failedIssuerResult(issuer, error, duration(began, now().getTime()))) } }
    const runVerification=async(runner,...args)=>{try { const details=await runner(...args); return {status:'PASSED',details:details??null} } catch(error) { return {status:'FAILED',errorCode:error?.code??'VERIFICATION_FAILED',errorMessage:error?.message??String(error)} }}
    const proposedStateVerification=await runVerification(proposedStateVerificationRunner,executionRoot)
    const baselineVerification=await runVerification(baselineVerificationRunner)
    const finishedAt = now().toISOString(), identity = JSON.stringify({ startedAt, dryRun, issuerResults, coverage: CURRENT_PRODUCTION_COVERAGE, baselineVerification, proposedStateVerification })
    const report = summarizeRun({ runId: `ingestion-run:sha256:${hash(identity)}`, startedAt, finishedAt, dryRun, issuerResults, coverage: CURRENT_PRODUCTION_COVERAGE, baselineVerification, proposedStateVerification })
    const reportPath = persistReport ? await persistRunReport(report, outputRoot) : null
    return { report, reportPath, exitCode: report.overallHealth === 'HEALTHY' ? 0 : 1 }
  } finally { if (dryRun) await rm(executionRoot, { recursive: true, force: true }) }
}

export function formatRunSummary(report) {
  const lines = ['AI INFRASTRUCTURE INGESTION','']
  for (const item of report.issuerResults) { const warnings=(item.warnings??[]).map((warning)=>warning.code).join(','); lines.push(`${item.issuer.padEnd(6)} ${item.status}${item.errorCode ? ` [${item.errorCode}]` : ''}${warnings ? ` [${warnings}]` : ''}`) }
  lines.push('',`New facts       ${report.totals.newFacts}`,`Revisions       ${report.totals.revisions}`,`Reassertions    ${report.totals.provenanceReassertions ?? 0}`,`Unchanged       ${report.totals.unchanged}`,`Quarantined     ${report.totals.quarantined}`,`Failures        ${report.totals.failures}`,`Warnings        ${report.totals.warnings ?? 0}`,'',`Coverage`,`Required fact families   ${report.coverage.counts.requiredFactFamilies}`,`INGESTED                 ${report.coverage.counts.ingested}`,`FROZEN                   ${report.coverage.counts.frozen}`,`MANUAL                   ${report.coverage.counts.manual}`,`NOT_DISCLOSED            ${report.coverage.counts.notDisclosed}`,`MISSING                  ${report.coverage.counts.missing}`,`Coverage status: ${report.coverage.status}`,'',`Baseline verification: ${report.baselineVerification.status}`,`Proposed-state verification: ${report.proposedStateVerification.status}`,'',`Overall:`,` ${report.overallHealth}`)
  return lines.join('\n')
}
