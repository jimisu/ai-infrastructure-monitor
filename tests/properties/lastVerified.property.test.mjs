import assert from 'node:assert/strict'
import { loadPresentation } from '../../acceptance/load-source.mjs'
import { decoyEvidence } from '../../acceptance/summary-page.mjs'
import { forAll, intBetween } from './forAll.mjs'

const { toLastVerifiedDisplay } = await loadPresentation('lastVerified')

function pad(value) {
  return String(value).padStart(2, '0')
}

function utcMinute(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`
}

function randomInstant(random) {
  const millis = Date.UTC(
    intBetween(random, 1970, 2100),
    intBetween(random, 0, 11),
    intBetween(random, 1, 28),
    intBetween(random, 0, 23),
    intBetween(random, 0, 59),
    intBetween(random, 0, 59),
    intBetween(random, 0, 999)
  )
  return new Date(millis)
}

function randomEvidence(random) {
  return [
    {
      publishedAt: randomInstant(random).toISOString(),
      retrievedAt: randomInstant(random).toISOString(),
    },
  ]
}

forAll('valid ISO metadata formats as matching UTC minute', {
  times: 100,
  seed: 20260906,
  gen: (random) => randomInstant(random),
}, (instant) => {
  const metadata = instant.toISOString()
  const display = toLastVerifiedDisplay({
    verificationMetadata: metadata,
    evidenceObservations: decoyEvidence,
  })
  assert.equal(display.label, 'Last verified')
  assert.equal(display.displayStatus, 'UTC')
  assert.equal(display.dateTime, metadata)
  assert.equal(display.displayValue, utcMinute(instant))
  assert.match(display.displayValue, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC$/)
})

forAll('missing or unparseable metadata is UNAVAILABLE', {
  times: 100,
  seed: 7,
  gen: (random, i) => {
    const sentinels = ['MISSING', null, undefined, '', 'not-a-timestamp', 'zzz', '2026-99-99']
    if (i < sentinels.length) return sentinels[i]
    return `invalid-${intBetween(random, 1, 1_000_000)}`
  },
}, (verificationMetadata) => {
  if (verificationMetadata && !Number.isNaN(new Date(verificationMetadata).getTime()) && verificationMetadata !== 'MISSING') {
    return
  }
  const display = toLastVerifiedDisplay({ verificationMetadata, evidenceObservations: decoyEvidence })
  assert.equal(display.label, 'Last verified')
  assert.equal(display.displayValue, 'UNAVAILABLE')
  assert.equal(display.displayStatus, 'UNAVAILABLE')
  assert.equal(display.dateTime, undefined)
})

forAll('evidence publication and retrieval dates never become the display', {
  times: 100,
  seed: 11,
  gen: (random) => ({
    metadata: randomInstant(random).toISOString(),
    evidence: randomEvidence(random),
  }),
}, ({ metadata, evidence }) => {
  const display = toLastVerifiedDisplay({
    verificationMetadata: metadata,
    evidenceObservations: evidence,
  })
  for (const observation of evidence) {
    assert.equal(display.displayValue.includes(observation.publishedAt), false)
    assert.equal(display.displayValue.includes(observation.retrievedAt), false)
    assert.equal(display.dateTime === observation.publishedAt, false)
    assert.equal(display.dateTime === observation.retrievedAt, false)
  }
})

forAll('display conversion is idempotent and minute-order preserving', {
  times: 50,
  seed: 13,
  gen: (random) => [randomInstant(random), randomInstant(random)],
}, ([left, right]) => {
  const leftDisplay = toLastVerifiedDisplay({ verificationMetadata: left.toISOString() })
  const leftAgain = toLastVerifiedDisplay({ verificationMetadata: left.toISOString() })
  assert.deepEqual(leftDisplay, leftAgain)
  const rightDisplay = toLastVerifiedDisplay({ verificationMetadata: right.toISOString() })
  const leftMinute = Math.floor(left.getTime() / 60_000)
  const rightMinute = Math.floor(right.getTime() / 60_000)
  if (leftMinute === rightMinute) {
    assert.equal(leftDisplay.displayValue, rightDisplay.displayValue)
  } else {
    assert.equal(leftDisplay.displayValue < rightDisplay.displayValue, leftMinute < rightMinute)
  }
})
