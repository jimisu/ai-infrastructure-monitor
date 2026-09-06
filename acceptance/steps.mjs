import { readFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { lastVerifiedMarkup, loadHeader, loadPresentation } from './load-source.mjs'

const decoyEvidence = [
  { publishedAt: '1999-12-31T23:59:59.000Z', retrievedAt: '2000-01-01T00:00:00.000Z' },
]

function exampleValue(example, name) {
  if (!Object.hasOwn(example, name)) throw new Error(`missing example value ${name}`)
  return example[name]
}

function fail(message) {
  throw new Error(message)
}

const handlers = [
  {
    pattern: /^the AI Infrastructure Monitor summary page is rendered from the presentation view model$/,
    run(world) {
      world.renderFromViewModel = true
    },
  },
  {
    pattern: /^existing verification metadata has <([A-Za-z0-9_]+)>$/,
    run(world, example, [name]) {
      world.verificationMetadata = exampleValue(example, name)
    },
  },
  {
    pattern: /^the summary page is opened$/,
    async run(world) {
      if (!world.renderFromViewModel) fail('summary page must be rendered from the presentation view model')
      const { toLastVerifiedDisplay } = await loadPresentation('lastVerified')
      const { Header } = await loadHeader()
      const display = toLastVerifiedDisplay({
        verificationMetadata: world.verificationMetadata,
        evidenceObservations: decoyEvidence,
      })
      const html = renderToStaticMarkup(createElement(Header, {
        asOf: decoyEvidence[0].publishedAt,
        status: 'ACCELERATING',
        explanation: 'fixture',
        lastVerified: display,
      }))
      world.page = {
        display,
        html,
        lastVerifiedHtml: lastVerifiedMarkup(html),
      }
    },
  },
  {
    pattern: /^the page displays "Last verified" as <([A-Za-z0-9_]+)>$/,
    run(world, example, [name]) {
      const expected = exampleValue(example, name)
      if (!world.page?.html.includes('AI INFRASTRUCTURE MONITOR')) fail('summary page was not opened')
      if (!world.page?.lastVerifiedHtml.includes('Last verified')) fail('summary page does not display Last verified')
      if (!world.page.lastVerifiedHtml.includes(expected)) fail(`summary page display ${world.page.display.displayValue} != ${expected}`)
    },
  },
  {
    pattern: /^the timestamp display status is <([A-Za-z0-9_]+)>$/,
    run(world, example, [name]) {
      const expected = exampleValue(example, name)
      if (world.page?.display.displayStatus !== expected) {
        fail(`timestamp display status ${world.page?.display.displayStatus} != ${expected}`)
      }
      if (!world.page.lastVerifiedHtml.includes(`data-timestamp-status="${expected}"`)) {
        fail('timestamp display status is not visible on the summary page')
      }
    },
  },
  {
    pattern: /^evidence publication and retrieval dates are not timestamp sources$/,
    run(world) {
      const verified = world.page?.lastVerifiedHtml ?? ''
      if (verified.includes('1999-12-31') || verified.includes('2000-01-01')) {
        fail('evidence publication or retrieval dates were used as the timestamp source')
      }
    },
  },
  {
    pattern: /^signal calculations and production datasets are unchanged$/,
    async run() {
      const lastVerifiedSource = await readFile(new URL('../src/presentation/lastVerified.ts', import.meta.url), 'utf8')
      if (lastVerifiedSource.includes("from '../signals") || lastVerifiedSource.includes("from '../data") || lastVerifiedSource.includes('data/ingestion')) {
        fail('last verified timestamp must not read signals or production datasets')
      }
      const { toDemandStatus } = await loadPresentation('demandStatus')
      const status = toDemandStatus({
        hyperscalerCapexTrend: { direction: 'POSITIVE', eligibleCount: 4, totalUniverseCount: 4, coverage: 100 },
        tsmTrend: { direction: 'ACCELERATING' },
        tsmOutlookSignal: { direction: 'POSITIVE' },
        crossCompanySignal: { direction: 'POSITIVE', alignment: 'CONFIRMED' },
      })
      if (status.status !== 'ACCELERATING') fail('signal calculations changed')
    },
  },
  {
    pattern: /^the last verified timestamp behavior is implemented$/,
    async run(world) {
      world.toLastVerifiedDisplay = (await loadPresentation('lastVerified')).toLastVerifiedDisplay
      world.Header = (await loadHeader()).Header
      if (typeof world.toLastVerifiedDisplay !== 'function' || typeof world.Header !== 'function') {
        fail('last verified timestamp behavior is not implemented')
      }
    },
  },
  {
    pattern: /^repository verification is run$/,
    async run(world) {
      world.verification = await runNodeTest('tests/presentation/lastVerified.test.mjs')
    },
  },
  {
    pattern: /^unit coverage proves the metadata timestamp and missing metadata paths$/,
    run(world) {
      const output = world.verification?.output ?? ''
      if (world.verification?.code !== 0) fail('unit coverage failed')
      if (!output.includes('metadata timestamp formats as UTC display')) fail('missing unit coverage for the metadata timestamp path')
      if (!output.includes('missing metadata displays UNAVAILABLE')) fail('missing unit coverage for the missing metadata path')
    },
  },
  {
    pattern: /^end-to-end coverage proves the visible summary page timestamp and unavailable state$/,
    run(world) {
      const output = world.verification?.output ?? ''
      if (world.verification?.code !== 0) fail('end-to-end coverage failed')
      if (!output.includes('visible summary page shows metadata timestamp')) fail('missing end-to-end coverage for the visible timestamp')
      if (!output.includes('visible summary page shows unavailable state')) fail('missing end-to-end coverage for the unavailable state')
    },
  },
]

function runNodeTest(file) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env }
    delete env.NODE_TEST_CONTEXT
    const child = spawn(process.execPath, ['--test', '--test-reporter', 'tap', file], { cwd: process.cwd(), env })
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    child.on('error', reject)
    child.on('exit', (code) => resolve({ code: code ?? 1, output }))
  })
}

export async function dispatchStep(step, example, world) {
  const matches = handlers.flatMap((handler) => {
    const match = step.text.match(handler.pattern)
    return match ? [{ handler, match }] : []
  })
  if (matches.length === 0) fail(`unsupported step: ${step.text}`)
  if (matches.length > 1) fail(`ambiguous step: ${step.text}`)
  const [{ handler, match }] = matches
  await handler.run(world, example, match.slice(1))
}
