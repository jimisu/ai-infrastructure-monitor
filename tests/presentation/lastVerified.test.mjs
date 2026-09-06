import assert from 'node:assert/strict'
import test from 'node:test'
import { loadHeader, loadPresentation } from '../../acceptance/load-source.mjs'
import {
  decoyEvidence,
  includesDecoyEvidenceDates,
  lastVerifiedMarkup,
  renderSummaryPage,
} from '../../acceptance/summary-page.mjs'

const { toLastVerifiedDisplay } = await loadPresentation('lastVerified')
const { readVerificationMetadata } = await loadPresentation('verificationMetadata')
const { Header } = await loadHeader()

function displayFrom(verificationMetadata) {
  return toLastVerifiedDisplay({
    verificationMetadata,
    evidenceObservations: decoyEvidence,
  })
}

function assertNoDecoyDates(text) {
  assert.equal(includesDecoyEvidenceDates(text), false)
}

test('metadata timestamp formats as UTC display', () => {
  const display = displayFrom('2026-09-06T15:20:30.000Z')
  assert.equal(display.label, 'Last verified')
  assert.equal(display.displayValue, '2026-09-06 15:20 UTC')
  assert.equal(display.displayStatus, 'UTC')
  assert.equal(display.dateTime, '2026-09-06T15:20:30.000Z')
  assertNoDecoyDates(display.displayValue)
})

test('missing metadata displays UNAVAILABLE', () => {
  for (const verificationMetadata of ['MISSING', null, undefined, '']) {
    const display = displayFrom(verificationMetadata)
    assert.equal(display.label, 'Last verified')
    assert.equal(display.displayValue, 'UNAVAILABLE')
    assert.equal(display.displayStatus, 'UNAVAILABLE')
    assert.equal(display.dateTime, undefined)
    assertNoDecoyDates(display.displayValue)
  }
})

test('unparseable metadata displays UNAVAILABLE', () => {
  const display = displayFrom('not-a-timestamp')
  assert.equal(display.displayValue, 'UNAVAILABLE')
  assert.equal(display.displayStatus, 'UNAVAILABLE')
  assert.equal(display.dateTime, undefined)
})

test('production verification metadata fail-closes when no timestamp is recorded', () => {
  assert.equal(readVerificationMetadata(), null)
  const display = displayFrom(readVerificationMetadata())
  assert.equal(display.displayValue, 'UNAVAILABLE')
  assert.equal(display.displayStatus, 'UNAVAILABLE')
})

test('visible summary page shows metadata timestamp', () => {
  const display = displayFrom('2026-09-06T15:20:30.000Z')
  const html = renderSummaryPage(Header, display)
  const verified = lastVerifiedMarkup(html)
  assert.match(html, /AI INFRASTRUCTURE MONITOR/)
  assert.match(verified, /Last verified/)
  assert.match(verified, /2026-09-06 15:20 UTC/)
  assert.match(verified, /data-timestamp-status="UTC"/)
  assert.match(verified, /datetime="2026-09-06T15:20:30.000Z"/i)
  assertNoDecoyDates(verified)
})

test('visible summary page shows unavailable state', () => {
  const display = displayFrom('MISSING')
  const html = renderSummaryPage(Header, display)
  const verified = lastVerifiedMarkup(html)
  assert.match(html, /AI INFRASTRUCTURE MONITOR/)
  assert.match(verified, /Last verified/)
  assert.match(verified, /UNAVAILABLE/)
  assert.match(verified, /data-timestamp-status="UNAVAILABLE"/)
  assertNoDecoyDates(verified)
  assert.equal(/<time/i.test(verified), false)
})
