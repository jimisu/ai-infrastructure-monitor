import path from 'node:path'
import { ingestTsmcMonthly } from './tsm-monthly-lib.mjs'
import { ingestTsmcMonthlyFromSec } from './tsm-sec-lib.mjs'

function argument(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

const workspace = process.cwd()
const fixture = argument('--fixture')
const outputRoot = argument('--output-root') ?? path.join(workspace, 'data', 'ingestion')
const retrievedAt = argument('--retrieved-at') ?? new Date().toISOString()

try {
  const result = fixture
    ? await ingestTsmcMonthly({ outputRoot, fixturePath: path.resolve(workspace, fixture), retrievedAt })
    : await ingestTsmcMonthlyFromSec({ outputRoot, retrievedAt, reportingYear: argument('--year') })
  process.stdout.write(`${JSON.stringify({
    snapshotId: result.snapshot?.snapshotId ?? result.snapshots?.at(-1)?.snapshotId,
    candidateCount: result.candidateCount,
    created: result.created,
    revisions: result.revisions,
    canonicalPath: path.relative(workspace, result.canonicalPath),
  }, null, 2)}\n`)
} catch (error) {
  process.stderr.write(`TSMC ingestion failed closed [${error.code ?? 'UNEXPECTED'}]: ${error.message}\n`)
  if (error.details && Object.keys(error.details).length > 0) {
    process.stderr.write(`${JSON.stringify(error.details, null, 2)}\n`)
  }
  process.exitCode = 1
}
