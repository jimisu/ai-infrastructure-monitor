import type { ImpactEvent } from '../types/signal'

interface Props {
  events: ImpactEvent[]
}

export function WhatChanged({ events }: Props) {
  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high':
        return '#ef4444'
      case 'medium':
        return '#f59e0b'
      case 'low':
        return '#3b82f6'
      default:
        return '#9ca3af'
    }
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className="what-changed-card">
      <div className="card-header">
        <h2>WHAT CHANGED?</h2>
        <p className="subtitle">New information affecting your watchlist</p>
      </div>
      <div className="events-list">
        {sortedEvents.map((event) => (
          <div key={event.id} className="event-item" data-impact={event.impact}>
            <div className="event-header">
              <div className="event-title-row">
                <span className="event-title">{event.title}</span>
                <span
                  className="impact-badge"
                  style={{ backgroundColor: getImpactColor(event.impact), opacity: 0.2 }}
                >
                  <span style={{ color: getImpactColor(event.impact) }}>
                    {event.impact.toUpperCase()}
                  </span>
                </span>
              </div>
              <p className="event-description">{event.description}</p>
            </div>

            <div className="event-meta">
              <span className="source">{event.source}</span>
              <span className="timestamp">
                {new Date(event.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="affected-companies">
              <span className="affected-label">→</span>
              <div className="tickers">
                {event.affectedCompanies.map((ticker) => (
                  <span key={ticker} className="affected-ticker">
                    {ticker}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
