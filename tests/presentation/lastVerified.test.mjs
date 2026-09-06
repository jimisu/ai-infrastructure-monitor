import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { lastVerifiedMarkup, loadHeader, loadPresentation } from '../../acceptance/load-source.mjs'

const decoyEvidence = [
  { publishedAt: '1999-12-31T23:59:59.000Z', retrievedAt: '2000-01-01T00:00:00.000Z' },
]

const { toLastVerifiedDisplay } = await loadPresentation('lastVerified')
const { readVerificationMetadata } = await loadPresentation('verificationMetadata')
const { Header } = await loadHeader()

function renderSummaryPage(display) {
  return renderToStaticMarkup(createElement(Header, {
    asOf: decoyEvidence[0].publishedAt,
    status: 'ACCELERATING',
    explanation: 'fixture',
    lastVerified: display,
  }))
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

test('production verification metadata fail-closes when no timestamp is recorded', () => {
  assert.equal(readVerificationMetadata(), null)
  const display = toLastVerifiedDisplay({
    verificationMetadata: readVerificationMetadata(),
    evidenceObservations: decoyEvidence,
  })
  assert.equal(display.displayValue, 'UNAVAILABLE')
  assert.equal(display.displayStatus, 'UNAVAILABLE')
})

test('visible summary page shows metadata timestamp', () => {
  const display = toLastVerifiedDisplay({
    verificationMetadata: '2026-09-06T15:20:30.000Z',
    evidenceObservations: decoyEvidence,
  })
  const html = renderSummaryPage(display)
  const verified = lastVerifiedMarkup(html)
  assert.match(html, /AI INFRASTRUCTURE MONITOR/)
  assert.match(verified, /Last verified/)
  assert.match(verified, /2026-09-06 15:20 UTC/)
  assert.match(verified, /data-timestamp-status="UTC"/)
  assert.match(verified, /datetime="2026-09-06T15:20:30.000Z"/i)
  assert.equal(verified.includes('1999-12-31'), false)
  assert.equal(verified.includes('2000-01-01'), false)
})

test('visible summary page shows unavailable state', () => {
  const display = toLastVerifiedDisplay({
    verificationMetadata: 'MISSING',
    evidenceObservations: decoyEvidence,
  })
  const html = renderSummaryPage(display)
  const verified = lastVerifiedMarkup(html)
  assert.match(html, /AI INFRASTRUCTURE MONITOR/)
  assert.match(verified, /Last verified/)
  assert.match(verified, /UNAVAILABLE/)
  assert.match(verified, /data-timestamp-status="UNAVAILABLE"/)
  assert.equal(verified.includes('1999-12-31'), false)
  assert.equal(verified.includes('2000-01-01'), false)
  assert.equal(/<time/i.test(verified), false)
})
