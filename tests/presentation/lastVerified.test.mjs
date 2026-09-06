import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import test from 'node:test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const decoyEvidence = [
  { publishedAt: '1999-12-31T23:59:59.000Z', retrievedAt: '2000-01-01T00:00:00.000Z' },
]

async function loadTs(name) {
  const source = await readFile(new URL(`../../src/presentation/${name}.ts`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
  })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}

async function loadLastVerifiedComponent() {
  const source = await readFile(new URL('../../src/components/LastVerified.tsx', import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2023,
      jsx: ts.JsxEmit.React,
    },
  })
  const dir = path.resolve('tmp/presentation-tests')
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, 'LastVerified.mjs')
  await writeFile(file, `import React from 'react'\n${outputText}`)
  return import(pathToFileURL(file).href)
}

const { toLastVerifiedDisplay } = await loadTs('lastVerified')
const { LastVerified } = await loadLastVerifiedComponent()

function renderLastVerified(display) {
  return renderToStaticMarkup(createElement(LastVerified, { lastVerified: display }))
}

test('metadata timestamp formats as UTC display', () => {
  const display = toLastVerifiedDisplay({
    verificationMetadata: '2026-09-06T15:20:30.000Z',
    evidenceObservations: decoyEvidence,
  })
  assert.equal(display.label, 'Last verified')
  assert.equal(display.displayValue, '2026-09-06 15:20 UTC')
  assert.equal(display.displayStatus, 'UTC')
  assert.equal(display.dateTime, '2026-09-06T15:20:30.000Z')
  assert.equal(display.displayValue.includes('1999'), false)
  assert.equal(display.displayValue.includes('2000-01-01'), false)
})

test('missing metadata displays UNAVAILABLE', () => {
  for (const verificationMetadata of ['MISSING', null, undefined, '']) {
    const display = toLastVerifiedDisplay({
      verificationMetadata,
      evidenceObservations: decoyEvidence,
    })
    assert.equal(display.label, 'Last verified')
    assert.equal(display.displayValue, 'UNAVAILABLE')
    assert.equal(display.displayStatus, 'UNAVAILABLE')
    assert.equal(display.dateTime, undefined)
    assert.equal(display.displayValue.includes('1999'), false)
    assert.equal(display.displayValue.includes('2000-01-01'), false)
  }
})

test('visible summary page shows metadata timestamp', () => {
  const display = toLastVerifiedDisplay({
    verificationMetadata: '2026-09-06T15:20:30.000Z',
    evidenceObservations: decoyEvidence,
  })
  const html = renderLastVerified(display)
  assert.match(html, /Last verified/)
  assert.match(html, /2026-09-06 15:20 UTC/)
  assert.match(html, /data-timestamp-status="UTC"/)
  assert.match(html, /datetime="2026-09-06T15:20:30.000Z"/i)
  assert.equal(html.includes('1999-12-31'), false)
  assert.equal(html.includes('2000-01-01'), false)
})

test('visible summary page shows unavailable state', () => {
  const display = toLastVerifiedDisplay({
    verificationMetadata: 'MISSING',
    evidenceObservations: decoyEvidence,
  })
  const html = renderLastVerified(display)
  assert.match(html, /Last verified/)
  assert.match(html, /UNAVAILABLE/)
  assert.match(html, /data-timestamp-status="UNAVAILABLE"/)
  assert.equal(html.includes('1999-12-31'), false)
  assert.equal(html.includes('2000-01-01'), false)
  assert.equal(/<time/i.test(html), false)
})
