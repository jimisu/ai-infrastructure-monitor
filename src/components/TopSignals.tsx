import type { Signal } from '../types/signal'

interface Props {
  signals: Signal[]
}

export function TopSignals({ signals }: Props) {
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      compute: '#00ff00',
      memory: '#00ddff',
      networking: '#ffaa00',
      power: '#ff3333',
      cooling: '#7700ff',
      datacenter: '#00ff99',
    }
    return colors[category] || '#888'
  }

  return (
    <div className="top-signals-card">
      <div className="card-header">
        <h2>Top Infrastructure Signals</h2>
      </div>
      <div className="signals-grid">
        {signals.map((signal) => (
          <div key={signal.category} className="signal-item">
            <div className="signal-category" style={{ color: getCategoryColor(signal.category) }}>
              {signal.category.charAt(0).toUpperCase() + signal.category.slice(1)}
            </div>
            <div className="signal-score">{signal.score}</div>
            <div className="signal-description">{signal.description}</div>
            <div className="signal-source">Source: {signal.source}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
