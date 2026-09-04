import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import test from 'node:test'
import { parseIngestionArguments, runIngestAll } from '../../scripts/ingestion/ingest-all.mjs'

const report = {
  issuerResults: [],
  totals: { newFacts: 0, revisions: 0, provenanceReassertions: 0, unchanged: 0, quarantined: 0, failures: 0, warnings: 0 },
  coverage: { counts: { requiredFactFamilies: 0, ingested: 0, frozen: 0, manual: 0, notDisclosed: 0, missing: 0 }, status: 'COMPLETE' },
  baselineVerification: { status: 'PASSED' },
  proposedStateVerification: { status: 'PASSED' },
  overallHealth: 'HEALTHY',
}

test('no flag and explicit dry-run both select disposable execution', () => {
  assert.deepEqual(parseIngestionArguments([]), { dryRun: true })
  assert.deepEqual(parseIngestionArguments(['--dry-run']), { dryRun: true })
})

test('--promote is the only supported production-path selection', () => {
  assert.deepEqual(parseIngestionArguments(['--promote']), { dryRun: false })
})

test('conflicting, duplicate, and unknown flags fail closed', () => {
  for (const args of [['--dry-run', '--promote'], ['--dry-run', '--dry-run'], ['--promote', '--promote'], ['--write']]) {
    assert.throws(() => parseIngestionArguments(args), (error) => error.code === 'INGESTION_USAGE_ERROR')
  }
})

test('argument validation occurs before orchestration or verification', async () => {
  let orchestrations = 0
  let verifications = 0
  await assert.rejects(runIngestAll({
    args: ['--unknown'],
    orchestrate: async () => { orchestrations += 1 },
    verifyDownstream: async () => { verifications += 1 },
  }), (error) => error.code === 'INGESTION_USAGE_ERROR')
  assert.equal(orchestrations, 0)
  assert.equal(verifications, 0)
})

test('run contract passes the selected mode and production root to the orchestrator', async () => {
  for (const [args, expectedDryRun] of [[[], true], [['--dry-run'], true], [['--promote'], false]]) {
    let received
    let exitCode
    const result = await runIngestAll({
      args,
      cwd: '/workspace/project',
      orchestrate: async (options) => { received = options; return { report, reportPath: '/workspace/project/data/ingestion/runs/report.json', exitCode: 0 } },
      verifyDownstream: async () => ({ productionSignals: 'REGRESSION_PASSED' }),
      write: () => {},
      setExitCode: (value) => { exitCode = value },
    })
    assert.equal(received.dryRun, expectedDryRun)
    assert.equal(received.outputRoot, path.join('/workspace/project', 'data', 'ingestion'))
    assert.equal(result.report, report)
    assert.equal(exitCode, 0)
  }
})

test('the real CLI rejects an unknown flag before acquisition', () => {
  const result = spawnSync(process.execPath, ['scripts/ingestion/ingest-all.mjs', '--unknown'], { cwd: process.cwd(), encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /INGESTION_USAGE_ERROR|Unsupported ingestion argument/)
  assert.doesNotMatch(result.stderr, /SOURCE_UNAVAILABLE|SEC_USER_AGENT/)
})
