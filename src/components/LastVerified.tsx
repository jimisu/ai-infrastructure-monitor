import type { LastVerifiedDisplay } from '../presentation/lastVerified'

interface Props {
  lastVerified: LastVerifiedDisplay
}

export function LastVerified({ lastVerified }: Props) {
  return (
    <p className="last-verified" data-timestamp-status={lastVerified.displayStatus}>
      {lastVerified.label}{' '}
      {lastVerified.displayStatus === 'UTC' && lastVerified.dateTime
        ? <time dateTime={lastVerified.dateTime}>{lastVerified.displayValue}</time>
        : lastVerified.displayValue}
    </p>
  )
}
