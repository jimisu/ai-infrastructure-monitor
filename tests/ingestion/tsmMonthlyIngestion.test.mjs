import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {
  IngestionError,
  collectOfficialHttp,
  ingestTsmcMonthly,
  parseTsmcMonthlyRevenue,
  persistRawSnapshot,
  validateTsmcCandidates,
  TSMC_MONTHLY_SOURCE,
} from '../../scripts/ingestion/tsm-monthly-lib.mjs'

const fixturePath = path.resolve(
  'tests/fixtures/ingestion/tsm/2026-monthly-revenue-jan-jun.html'
)
const retrievedAt = '2026-08-13T14:00:00.000Z'
const expected = [
  ['2026-01', 'MONTHLY_REVENUE', 401255, 'NT$ millions'],
  ['2026-01', 'MONTHLY_REVENUE_YOY_PERCENT', 36.8, 'percent'],
  ['2026-02', 'MONTHLY_REVENUE', 317657, 'NT$ millions'],
  ['2026-02', 'MONTHLY_REVENUE_YOY_PERCENT', 22.2, 'percent'],
  ['2026-03', 'MONTHLY_REVENUE', 415191, 'NT$ millions'],
  ['2026-03', 'MONTHLY_REVENUE_YOY_PERCENT', 45.2, 'percent'],
  ['2026-04', 'MONTHLY_REVENUE', 410726, 'NT$ millions'],
  ['2026-04', 'MONTHLY_REVENUE_YOY_PERCENT', 17.5, 'percent'],
  ['2026-05', 'MONTHLY_REVENUE', 416975, 'NT$ millions'],
  ['2026-05', 'MONTHLY_REVENUE_YOY_PERCENT', 30.1, 'percent'],
  ['2026-06', 'MONTHLY_REVENUE', 442680, 'NT$ millions'],
  ['2026-06', 'MONTHLY_REVENUE_YOY_PERCENT', 67.9, 'percent'],
]

async function tempRoot() {
  return mkdtemp(path.join(os.tmpdir(), 'tsm-ingestion-test-'))
}

test('failed legacy IR retry attempts create no snapshot or manifest', async () => {
  const outputRoot = await tempRoot()
  let attempts = 0
  await assert.rejects(
    collectOfficialHttp({ outputRoot, fetchImpl: async () => { attempts += 1; throw new TypeError('offline') }, transport: { sleep: async () => {} } }),
    (error) => error.code === 'SOURCE_UNAVAILABLE' && error.details.reason === 'RETRY_EXHAUSTED',
  )
  assert.equal(attempts, 3)
  assert.deepEqual(await readdir(outputRoot), [])
})

test('frozen fixture promotes exact Jan-Jun canonical facts', async () => {
  const outputRoot = await tempRoot()
  const result = await ingestTsmcMonthly({
    outputRoot,
    fixturePath,
    retrievedAt,
  })
  assert.equal(result.created, 12)
  assert.equal(result.revisions, 0)

  const active = result.document.records
    .filter((record) => record.status === 'ACTIVE')
    .map(({ observation }) => [
      observation.period,
      observation.metric,
      observation.value,
      observation.unit,
    ])
  assert.deepEqual(active, expected)
  assert.ok(result.document.records.every(
    ({ observation }) =>
      observation.companyTicker === 'TSM' &&
      observation.sourceId === 'tsmc-monthly-revenue' &&
      observation.sourceUrl === TSMC_MONTHLY_SOURCE.url
  ))
})

test('identical ingestion is idempotent', async () => {
  const outputRoot = await tempRoot()
  const first = await ingestTsmcMonthly({ outputRoot, fixturePath, retrievedAt })
  const firstIds = first.document.records.map((record) => record.observation.id)
  const second = await ingestTsmcMonthly({
    outputRoot,
    fixturePath,
    retrievedAt: '2030-01-01T00:00:00.000Z',
  })
  const secondIds = second.document.records.map((record) => record.observation.id)

  assert.equal(second.created, 0)
  assert.equal(second.revisions, 0)
  assert.equal(second.document.records.length, 12)
  assert.deepEqual(secondIds, firstIds)
})

const malformedCases = [
  {
    name: 'missing month',
    transform: (html) => html.replace(/\s*<tr><td>Mar\.<\/td>.*?<\/tr>/, ''),
    code: 'MISSING_MONTH',
  },
  {
    name: 'duplicate month',
    transform: (html) => html.replace(
      '<tr><td>Feb.</td>',
      '<tr><td>Jan.</td><td>401,255</td><td>36.8%</td></tr><tr><td>Feb.</td>'
    ),
    code: 'DUPLICATE_MONTH',
  },
  {
    name: 'malformed revenue',
    transform: (html) => html.replace('401,255', 'not-a-number'),
    code: 'MALFORMED_NUMBER',
  },
  {
    name: 'missing YoY',
    transform: (html) => html.replace('<td>36.8%</td>', '<td></td>'),
    code: 'MISSING_YOY',
  },
  {
    name: 'wrong issuer page',
    transform: (html) => html
      .replaceAll('TSMC', 'Example Corp')
      .replaceAll('Taiwan Semiconductor Manufacturing Company', 'Example Corporation')
      .replace('2026 Monthly Revenue', '2026 Revenue'),
    code: 'WRONG_ISSUER',
  },
  {
    name: 'HTTP 200 error page',
    transform: () => '<html><head><title>Error</title></head><body>Service unavailable</body></html>',
    code: 'ERROR_PAGE',
  },
  {
    name: 'unexpected table structure',
    transform: (html) => html.replace('YoY Change', 'Annual comparison'),
    code: 'TABLE_STRUCTURE',
  },
]

for (const malformed of malformedCases) {
  test(`${malformed.name} fails closed without changing canonical observations`, async () => {
    const outputRoot = await tempRoot()
    await ingestTsmcMonthly({ outputRoot, fixturePath, retrievedAt })
    const canonicalPath = path.join(outputRoot, 'observations', 'tsm-monthly.json')
    const before = await readFile(canonicalPath, 'utf8')
    const baseline = await readFile(fixturePath, 'utf8')
    const malformedPath = path.join(outputRoot, 'malformed.html')
    await writeFile(malformedPath, malformed.transform(baseline))

    await assert.rejects(
      () => ingestTsmcMonthly({
        outputRoot,
        fixturePath: malformedPath,
        retrievedAt: '2026-08-14T00:00:00.000Z',
      }),
      (error) => error instanceof IngestionError && error.code === malformed.code
    )
    assert.equal(await readFile(canonicalPath, 'utf8'), before)
  })
}

test('validator rejects duplicate semantic observations', async () => {
  const outputRoot = await tempRoot()
  const html = await readFile(fixturePath, 'utf8')
  const persisted = await persistRawSnapshot({
    body: html,
    source: TSMC_MONTHLY_SOURCE,
    requestedUrl: TSMC_MONTHLY_SOURCE.url,
    finalUrl: TSMC_MONTHLY_SOURCE.url,
    retrievedAt,
    status: 200,
    contentType: 'text/html',
    outputRoot,
  })
  const candidates = parseTsmcMonthlyRevenue(persisted.snapshot, html)
  assert.throws(
    () => validateTsmcCandidates([...candidates, candidates[0]], persisted.snapshot),
    (error) => error instanceof IngestionError && error.code === 'VALIDATION_FAILED'
  )
})
