import type { Signal } from '../types/signal'

interface Props {
  signals: Signal[]
}

export function InfrastructureMomentum({ signals }: Props) {
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      compute: '#22c55e',
      memory: '#3b82f6',
      networking: '#f59e0b',
      power: '#ef4444',
      cooling: '#8b5cf6',
      datacenter: '#10b981',
    }
    return colors[category] || '#9ca3af'
  }

  const categoryNames: Record<string, string> = {
    compute: 'COMPUTE',
    memory: 'MEMORY',
    networking: 'NETWORKING',
    power: 'POWER',
    cooling: 'COOLING',
    datacenter: 'DATA CENTERS',
  }

  return (
    <div className="infrastructure-momentum-card">
      <div className="card-header">
        <h2>INFRASTRUCTURE MOMENTUM</h2>
        <p className="subtitle">30-day change acceleration</p>
      </div>
      <div className="momentum-grid">
        {signals.map((signal) => (
          <div key={signal.category} className="momentum-item">
            <div className="category-header" style={{ borderTopColor: getCategoryColor(signal.category) }}>
              <span className="category-name" style={{ color: getCategoryColor(signal.category) }}>
                {categoryNames[signal.category]}
              </span>
            </div>

            <div className="momentum-score">{signal.score}</div>

            <div className="momentum-details">
              <div className="change-badge">
                <span className="change-value">
                  {signal.change30d >= 0 ? '+' : ''}{signal.change30d}
                </span>
                <span className="change-label">/ 30D</span>
              </div>

              <div
                className="trend-indicator"
                style={{
                  color: signal.trend === 'accelerating' ? '#22c55e' : signal.trend === 'stable' ? '#f59e0b' : '#ef4444',
                }}
              >
                {signal.trend === 'accelerating' ? '↗' : signal.trend === 'stable' ? '→' : '↘'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
