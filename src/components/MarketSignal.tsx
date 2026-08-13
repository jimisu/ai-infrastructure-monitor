import type { MarketSignal } from '../types/signal'

interface Props {
  signal: MarketSignal
}

export function MarketSignalComponent({ signal }: Props) {
  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'accelerating':
        return '#00ff00'
      case 'stable':
        return '#ffaa00'
      case 'decelerating':
        return '#ff3333'
      default:
        return '#888'
    }
  }

  return (
    <div className="market-signal-card">
      <div className="card-header">
        <h2>AI Infrastructure Market Signal</h2>
      </div>
      <div className="signal-display">
        <div className="score-box">
          <div className="score-value">{signal.score}</div>
          <div className="score-label">/ 100</div>
        </div>
        <div className="trend-info">
          <div
            className="trend-badge"
            style={{ borderColor: getTrendColor(signal.trend) }}
          >
            <span style={{ color: getTrendColor(signal.trend) }}>
              {signal.trend.toUpperCase()}
            </span>
          </div>
          <div className="timestamp">
            Last updated: {new Date(signal.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
