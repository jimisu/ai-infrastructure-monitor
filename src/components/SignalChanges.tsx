import type { ImpactEvent } from '../types/signal'

interface Props {
  events: ImpactEvent[]
}

export function SignalChanges({ events }: Props) {
  return (
    <div className="what-changed-card">
      <div className="card-header">
        <h2>SIGNAL CHANGES</h2>
      </div>
      <div className="changes-list">
        {events.map((event) => (
          <div key={event.id} className="change-item">
            <span className="ticker-badge">{event.affectedCompanies[0]}</span>
            <span className="change-text">— {event.title}</span>
            <span className="change-time">
              {new Date(event.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
