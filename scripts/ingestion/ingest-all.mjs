import { spawn } from 'node:child_process'
import path from 'node:path'
import { orchestrateIngestion, formatRunSummary } from './ingestion-orchestrator.mjs'

const dryRun = process.argv.includes('--dry-run')
function verify(args=[]) { return new Promise((resolve,reject) => { const child=spawn(process.execPath,['scripts/ingestion/verify-production-downstream.mjs',...args],{cwd:process.cwd(),stdio:'inherit'}); child.on('error',reject); child.on('exit',(code)=>code===0?resolve({productionSignals:'REGRESSION_PASSED'}):reject(Object.assign(new Error(`Downstream verification exited ${code}`),{code:'DOWNSTREAM_VERIFICATION_FAILED'}))) }) }
const result = await orchestrateIngestion({ outputRoot:path.join(process.cwd(),'data','ingestion'), dryRun, baselineVerificationRunner:()=>verify(), proposedStateVerificationRunner:(executionRoot)=>verify(['--proposed','--canonical-root',path.join(executionRoot,'observations')]) })
process.stdout.write(`${formatRunSummary(result.report)}\n\nRun report: ${path.relative(process.cwd(),result.reportPath)}\n`)
process.exitCode = result.exitCode
