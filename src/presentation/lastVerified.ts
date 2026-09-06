export type LastVerifiedDisplayStatus = 'UTC' | 'UNAVAILABLE'

export type LastVerifiedDisplay =
  | {
      label: 'Last verified'
      displayValue: 'UNAVAILABLE'
      displayStatus: 'UNAVAILABLE'
    }
  | {
      label: 'Last verified'
      displayValue: string
      displayStatus: 'UTC'
      dateTime: string
    }

export interface LastVerifiedInputs {
  verificationMetadata?: string | null
  // Evidence may be supplied; it is never a timestamp source.
  evidenceObservations?: ReadonlyArray<{ publishedAt?: string; retrievedAt?: string }>
}

const LABEL = 'Last verified' as const

const UNAVAILABLE: LastVerifiedDisplay = {
  label: LABEL,
  displayValue: 'UNAVAILABLE',
  displayStatus: 'UNAVAILABLE',
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function formatUtcMinute(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`
}

function parseVerificationMetadata(
  metadata: string | null | undefined
): { metadata: string; instant: Date } | null {
  if (metadata == null || metadata === '' || metadata === 'MISSING') return null
  const instant = new Date(metadata)
  if (Number.isNaN(instant.getTime())) return null
  return { metadata, instant }
}

export function toLastVerifiedDisplay(inputs: LastVerifiedInputs = {}): LastVerifiedDisplay {
  const parsed = parseVerificationMetadata(inputs.verificationMetadata)
  if (parsed == null) return UNAVAILABLE
  return {
    label: LABEL,
    displayValue: formatUtcMinute(parsed.instant),
    displayStatus: 'UTC',
    dateTime: parsed.metadata,
  }
}
