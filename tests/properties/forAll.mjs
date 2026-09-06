import test from 'node:test'

export function mulberry32(seed) {
  let state = seed >>> 0
  return () => {
    state += 0x6D2B79F5
    let x = Math.imul(state ^ (state >>> 15), state | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

export function intBetween(random, min, max) {
  return min + Math.floor(random() * (max - min + 1))
}

export function forAll(name, { times = 100, seed = 1, gen }, property) {
  test(name, () => {
    const random = mulberry32(seed)
    for (let i = 0; i < times; i++) {
      property(gen(random, i), i)
    }
  })
}
