import { appendFile, readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function classifyMonitoringReport(report) {
  if (report?.overallHealth === 'PARTIAL_FAILURE' || (report?.totals?.failures ?? 0) > 0) return 'INGESTION FAILURE'
  if (report?.overallHealth === 'VERIFICATION_FAILURE' || report?.baselineVerification?.status === 'FAILED' || report?.proposedStateVerification?.status === 'FAILED' || report?.verification?.status === 'FAILED') return 'VERIFICATION FAILURE'
  if ((report?.totals?.revisions ?? 0) > 0) return 'REVISION DETECTED'
  if ((report?.totals?.newFacts ?? 0) > 0) return 'NEW FACTS DETECTED'
  if ((report?.totals?.warnings ?? 0) > 0) return 'KNOWN SOURCE WARNING'
  return 'NO CHANGE'
}

export function renderMonitoringSummary(report) {
  const status = classifyMonitoringReport(report), lines = ['# AI Infrastructure Monitor','',`**Status: ${status}**`,'','| Issuer | Result |','|---|---|']
  for (const item of report.issuerResults ?? []) { const warnings=(item.warnings??[]).map((warning)=>warning.code).join(', '); lines.push(`| ${item.issuer} | ${item.status}${item.errorCode ? ` — ${item.errorCode}` : ''}${warnings ? ` — ${warnings}` : ''} |`) }
  lines.push('','| Run metric | Count |','|---|---:|',`| New facts | ${report.totals?.newFacts ?? 0} |`,`| Revisions | ${report.totals?.revisions ?? 0} |`,`| Provenance reassertions | ${report.totals?.provenanceReassertions ?? 0} |`,`| Quarantined | ${report.totals?.quarantined ?? 0} |`,`| Failures | ${report.totals?.failures ?? 0} |`,`| Warnings | ${report.totals?.warnings ?? 0} |`,'',`**Baseline verification:** ${report.baselineVerification?.status ?? report.verification?.status ?? 'UNKNOWN'}`,`**Proposed-state verification:** ${report.proposedStateVerification?.status ?? report.verification?.status ?? 'UNKNOWN'}`,`**Overall health:** ${report.overallHealth ?? 'UNKNOWN'}`,'','Monitoring is dry-run only; no production canonical observations are promoted by this workflow.')
  return `${lines.join('\n')}\n`
}

export async function latestRunReport(runsDirectory) {
  const files = (await readdir(runsDirectory)).filter((file) => file.endsWith('.json'))
  if (!files.length) throw new Error('No ingestion run report found')
  const entries = await Promise.all(files.map(async (file) => ({ file, modified: (await stat(path.join(runsDirectory,file))).mtimeMs })))
  entries.sort((a,b)=>b.modified-a.modified||a.file.localeCompare(b.file))
  const reportPath=path.join(runsDirectory,entries[0].file)
  return { reportPath, report: JSON.parse(await readFile(reportPath,'utf8')) }
}

async function main() {
  const runsDirectory=process.argv[2]??path.join(process.cwd(),'data','ingestion','runs'),summaryPath=process.env.GITHUB_STEP_SUMMARY
  const {reportPath,report}=await latestRunReport(runsDirectory),summary=renderMonitoringSummary(report)
  process.stdout.write(`${summary}\nRun report: ${reportPath}\n`)
  if(summaryPath)await appendFile(summaryPath,summary)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error)=>{process.stderr.write(`Monitoring summary failed: ${error.message}\n`);process.exitCode=1})
