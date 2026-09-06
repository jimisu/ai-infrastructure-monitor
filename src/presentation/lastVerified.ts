export type LastVerifiedDisplayStatus = 'UTC' | 'UNAVAILABLE'

export interface LastVerifiedDisplay {
  label: 'Last verified'
  displayValue: string
  displayStatus: LastVerifiedDisplayStatus
  dateTime?: string
}

export interface LastVerifiedInputs {
  verificationMetadata?: string | null
  evidenceObservations?: ReadonlyArray<{ publishedAt?: string; retrievedAt?: string }>
}

const UNAVAILABLE: LastVerifiedDisplay = {
  label: 'Last verified',
  displayValue: 'UNAVAILABLE',
  displayStatus: 'UNAVAILABLE',
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function formatUtcMinute(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`
}

export function toLastVerifiedDisplay(inputs: LastVerifiedInputs = {}): LastVerifiedDisplay {
  const metadata = inputs.verificationMetadata
  if (metadata == null || metadata === '' || metadata === 'MISSING') return UNAVAILABLE
  const date = new Date(metadata)
  if (Number.isNaN(date.getTime())) return UNAVAILABLE
  return {
    label: 'Last verified',
    displayValue: formatUtcMinute(date),
    displayStatus: 'UTC',
    dateTime: metadata,
  }
}
