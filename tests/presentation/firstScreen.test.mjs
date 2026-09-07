import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

async function loadTs(relativeFromTest) {
  const source = await readFile(new URL(relativeFromTest, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
  })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}

const { toFirstScreen } = await loadTs('../../src/presentation/firstScreen.ts')
const { q3BuildRealityCheck } = await loadTs('../../src/data/q3BuildRealityCheck.ts')
const { toLatestSnapshot } = await loadTs('../../src/presentation/latestSnapshot.ts')

const sampleCases = [
  { name: 'Operating A', group: 'operating', status: 'Operating', detail: 'Live.', sources: [{ name: 'Op source', url: 'https://example.test/op' }] },
  { name: 'Building A', group: 'building', status: 'Building', detail: 'Under way.', sources: [{ name: 'Build source', url: 'https://example.test/build' }] },
  { name: 'Contracted A', group: 'contracted', status: 'Contracted', detail: 'No construction evidence.', sources: [{ name: 'Contract source', url: 'https://example.test/contract' }] },
]

const sampleScreen = {
  status: 'ACCELERATING',
  asOf: '2026-07-30T00:00:00.000Z',
  evidenceCutoff: '2026-08-30',
  disclaimer: 'Not investment advice. Issuer CapEx is not AI-only CapEx.',
  snapshotHref: '/ai-infrastructure-monitor/latest.json',
  counts: { operating: 1, building: 1, contracted: 1 },
  cases: sampleCases,
}

test('first screen keeps board status, asOf, evidence cutoff, disclaimer, and latest.json', () => {
  const screen = toFirstScreen(sampleScreen)
  assert.equal(screen.status, 'ACCELERATING')
  assert.equal(screen.asOf, '2026-07-30T00:00:00.000Z')
  assert.equal(screen.evidenceCutoff, '2026-08-30')
  assert.equal(screen.disclaimer, 'Not investment advice. Issuer CapEx is not AI-only CapEx.')
  assert.equal(screen.snapshotHref, '/ai-infrastructure-monitor/latest.json')
  assert.match(screen.snapshotHref, /latest\.json$/)
})

test('first screen does not relabel issuer CapEx as AI CapEx or as investment advice', () => {
  const screen = toFirstScreen(sampleScreen)
  assert.doesNotMatch(screen.disclaimer, /AI-only CapEx is issuer CapEx/i)
  assert.match(screen.disclaimer, /Not investment advice/)
  assert.match(screen.disclaimer, /Issuer CapEx is not AI-only CapEx/)
  const snapshot = toLatestSnapshot({ asOf: '2026-07-16', status: 'INCOMPLETE', hyperscalerCapexTrend: null, tsmTrend: null, sources: [] })
  assert.equal(screen.disclaimer, snapshot.disclaimer)
})

test('first screen groups cases without dropping names or source links', () => {
  const screen = toFirstScreen(sampleScreen)
  assert.deepEqual(screen.groups.map((group) => group.id), ['operating', 'building', 'contracted'])
  assert.equal(screen.groups[0].label, 'Operating')
  assert.equal(screen.groups[1].label, 'Building or development')
  assert.equal(screen.groups[2].label, 'Contracted without construction evidence')
  assert.equal(screen.groups[0].cases[0].name, 'Operating A')
  assert.equal(screen.groups[1].cases[0].name, 'Building A')
  assert.equal(screen.groups[2].cases[0].name, 'Contracted A')
  for (const group of screen.groups) {
    for (const item of group.cases) {
      assert.ok(item.sources.length > 0)
      for (const source of item.sources) {
        assert.match(source.url, /^https?:\/\//)
      }
    }
  }
  assert.equal(screen.countsMatch, true)
})

test('Q3 dashboard copy lists all 15 cases in the published 7/7/1 groups with a source link each', () => {
  assert.equal(q3BuildRealityCheck.evidenceCutoff, '2026-08-30')
  assert.equal(q3BuildRealityCheck.cases.length, 15)
  const screen = toFirstScreen({
    status: 'ACCELERATING',
    asOf: '2026-07-30T00:00:00.000Z',
    evidenceCutoff: q3BuildRealityCheck.evidenceCutoff,
    disclaimer: 'Not investment advice. Issuer CapEx is not AI-only CapEx.',
    snapshotHref: '/ai-infrastructure-monitor/latest.json',
    counts: q3BuildRealityCheck.counts,
    cases: q3BuildRealityCheck.cases,
  })
  assert.deepEqual(screen.groups.map((group) => group.cases.length), [7, 7, 1])
  assert.equal(screen.countsMatch, true)
  assert.deepEqual(screen.groups[0].cases.map((item) => item.name), [
    'Munich Industrial AI Cloud',
    'xAI Colossus',
    'Stargate Abilene first phase',
    'Microsoft Fairwater Wisconsin',
    'Nebius Mäntsälä expansion',
    'JUPITER',
    'AWS Project Rainier',
  ])
  assert.deepEqual(screen.groups[1].cases.map((item) => item.name), [
    'Stargate UAE',
    'Osaka Sakai',
    'Meta Project Laidley / Hyperion',
    'SoftBank Tomakomai',
    'SK–AWS Ulsan',
    'Meta–Reliance Jamnagar first phase',
    'Michigan / The Barn',
  ])
  assert.deepEqual(screen.groups[2].cases.map((item) => item.name), ['Stargate Norway'])
  for (const item of q3BuildRealityCheck.cases) {
    assert.ok(item.sources.length > 0, `${item.name} needs a source link`)
    assert.match(item.sources[0].url, /^https:\/\//)
  }
})
