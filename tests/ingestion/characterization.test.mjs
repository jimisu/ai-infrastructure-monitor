import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function readJson(path) { return JSON.parse(await readFile(path, 'utf8')) }
const characterized = (document) => document.records.map((record) => ({
  logicalFactKey: record.logicalFactKey,
  id: record.observation.id,
  period: record.observation.period,
  metric: record.observation.metric,
  value: record.observation.value,
  unit: record.observation.unit,
}))

for (const [issuer, canonicalPath, fixturePath] of [
  ['TSMC', 'data/ingestion/observations/tsm-monthly.json', 'tests/fixtures/ingestion/characterization/tsm-canonical-v1.json'],
  ['Amazon', 'data/ingestion/observations/amzn-ppe-purchases.json', 'tests/fixtures/ingestion/characterization/amzn-canonical-v1.json'],
]) {
  test(`${issuer} canonical facts, logical keys, and legacy observation IDs remain frozen`, async () => {
    assert.deepEqual(characterized(await readJson(canonicalPath)), await readJson(fixturePath))
  })
}
