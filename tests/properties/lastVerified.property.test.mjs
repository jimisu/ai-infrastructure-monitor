import assert from 'node:assert/strict'
import { loadPresentation } from '../../acceptance/load-source.mjs'
import { forAll, intBetween } from './forAll.mjs'

const { toLastVerifiedDisplay } = await loadPresentation('lastVerified')

function pad(value) {
  return String(value).padStart(2, '0')
}

function utcMinute(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`
}

function signedOffset(minutes) {
  const sign = minutes >= 0 ? '+' : '-'
  const absolute = Math.abs(minutes)
  return `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`
}

function randomInstant(random, yearMin = 1970, yearMax = 2100) {
  const millis = Date.UTC(
    intBetween(random, yearMin, yearMax),
    intBetween(random, 0, 11),
    intBetween(random, 1, 28),
    intBetween(random, 0, 23),
    intBetween(random, 0, 59),
    intBetween(random, 0, 59),
    intBetween(random, 0, 999)
  )
  return new Date(millis)
}

function isoWithOffset(instant, offsetMinutes) {
  const local = new Date(instant.getTime() + offsetMinutes * 60_000)
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}T${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())}.${String(local.getUTCMilliseconds()).padStart(3, '0')}${signedOffset(offsetMinutes)}`
}

forAll('valid ISO metadata formats as matching UTC minute', {
  times: 100,
  seed: 20260906,
  gen: (random) => randomInstant(random),
}, (instant) => {
  const metadata = instant.toISOString()
  const display = toLastVerifiedDisplay({ verificationMetadata: metadata })
  assert.equal(display.label, 'Last verified')
  assert.equal(display.displayStatus, 'UTC')
  assert.equal(display.dateTime, metadata)
  assert.equal(display.displayValue, utcMinute(instant))
  assert.match(display.displayValue, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC$/)
})

forAll('offset timestamps display the UTC minute of the same instant', {
  times: 100,
  seed: 17,
  gen: (random) => ({
    instant: randomInstant(random),
    offsetMinutes: intBetween(random, -12, 14) * 60 + [0, 30, 45][intBetween(random, 0, 2)],
  }),
}, ({ instant, offsetMinutes }) => {
  const metadata = isoWithOffset(instant, offsetMinutes)
  const parsed = new Date(metadata)
  if (Number.isNaN(parsed.getTime())) return
  const display = toLastVerifiedDisplay({ verificationMetadata: metadata })
  assert.equal(display.displayStatus, 'UTC')
  assert.equal(display.dateTime, metadata)
  assert.equal(display.displayValue, utcMinute(parsed))
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
  const display = toLastVerifiedDisplay({ verificationMetadata })
  assert.equal(display.label, 'Last verified')
  assert.equal(display.displayValue, 'UNAVAILABLE')
  assert.equal(display.displayStatus, 'UNAVAILABLE')
  assert.equal(display.dateTime, undefined)
})

forAll('evidence publication and retrieval dates never become the display', {
  times: 100,
  seed: 11,
  gen: (random) => ({
    metadata: randomInstant(random, 2020, 2030).toISOString(),
    evidence: [
      {
        publishedAt: randomInstant(random, 1990, 1999).toISOString(),
        retrievedAt: randomInstant(random, 1980, 1989).toISOString(),
      },
    ],
  }),
}, ({ metadata, evidence }) => {
  const display = toLastVerifiedDisplay({
    verificationMetadata: metadata,
    evidenceObservations: evidence,
  })
  assert.equal(display.displayValue, utcMinute(new Date(metadata)))
  assert.equal(display.dateTime, metadata)
  for (const observation of evidence) {
    assert.notEqual(display.displayValue, utcMinute(new Date(observation.publishedAt)))
    assert.notEqual(display.displayValue, utcMinute(new Date(observation.retrievedAt)))
    assert.notEqual(display.dateTime, observation.publishedAt)
    assert.notEqual(display.dateTime, observation.retrievedAt)
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
