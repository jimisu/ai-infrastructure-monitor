import type { SignalType } from '../types/derivedSignal'

export type GeneratedAtProvider = () => string

export const systemGeneratedAt: GeneratedAtProvider = () => new Date().toISOString()

/**
 * Build a stable identity from the signal's semantic key.
 * Evidence ordering cannot affect identity.
 */
export function buildDerivedSignalId(
  companyTicker: string,
  signalType: SignalType,
  period: string,
  evidenceObservationIds: string[]
): string {
  const identityParts = [
    companyTicker,
    signalType,
    period,
    ...[...evidenceObservationIds].sort(),
  ]

  return `derived-signal:${identityParts.map(encodeURIComponent).join(':')}`
}
