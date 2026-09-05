import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

// Use the locked TypeScript compiler, matching the app, without another test runner.
async function loadModule(name) {
  const source = await readFile(new URL(`../../src/presentation/${name}.ts`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const { toDemandStatus } = await loadModule('demandStatus')
const { toLatestSnapshot } = await loadModule('latestSnapshot')
const base = {
  hyperscalerCapexTrend: { direction: 'POSITIVE', eligibleCount: 4, totalUniverseCount: 4, coverage: 100 },
  tsmTrend: { direction: 'ACCELERATING' },
  tsmOutlookSignal: { direction: 'POSITIVE' },
  crossCompanySignal: { direction: 'POSITIVE', alignment: 'CONFIRMED' },
}

test('dual-positive confirmed → ACCELERATING', () => {
  assert.equal(toDemandStatus(base).status, 'ACCELERATING')
})
test('full coverage but mixed/flat → STABLE, even when cross-confirmation is absent', () => {
  assert.equal(toDemandStatus({ ...base, tsmTrend: { direction: 'STABLE' }, crossCompanySignal: null }).status, 'STABLE')
})
test('each negative input → WEAKENING', () => {
  for (const override of [
    { hyperscalerCapexTrend: { ...base.hyperscalerCapexTrend, direction: 'NEGATIVE' } },
    { tsmTrend: { direction: 'DECELERATING' } },
    { tsmOutlookSignal: { direction: 'NEGATIVE' } },
  ]) assert.equal(toDemandStatus({ ...base, crossCompanySignal: null, ...override }).status, 'WEAKENING')
})
test('missing trend or incomplete coverage → INCOMPLETE before confirmation', () => {
  for (const override of [
    { tsmTrend: null },
    { hyperscalerCapexTrend: null },
    { hyperscalerCapexTrend: { ...base.hyperscalerCapexTrend, eligibleCount: 3, coverage: 75 } },
  ]) assert.equal(toDemandStatus({ ...base, ...override }).status, 'INCOMPLETE')
})
test('optional missing outlook does not imply incomplete or negative', () => {
  assert.equal(toDemandStatus({ ...base, crossCompanySignal: null, tsmOutlookSignal: undefined }).status, 'STABLE')
})
test('snapshot preserves dates and directions and explicitly marks unavailable inputs', () => {
  const snapshot = toLatestSnapshot({ asOf: '2026-07-16', status: 'INCOMPLETE', hyperscalerCapexTrend: null, tsmTrend: null, sources: [] })
  assert.equal(snapshot.asOf, '2026-07-16')
  assert.equal(snapshot.status, 'INCOMPLETE')
  assert.deepEqual(snapshot.hyperscalers, { META: 'UNAVAILABLE', MSFT: 'UNAVAILABLE', GOOG: 'UNAVAILABLE', AMZN: 'UNAVAILABLE' })
  assert.deepEqual(snapshot.tsm, { trend3m: 'UNAVAILABLE', outlook: 'UNAVAILABLE' })
  assert.equal(snapshot.confidence, 'UNAVAILABLE')
})
