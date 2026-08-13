interface Props {
  score: number
  change30d: number
  trend: string
}

export function MarketRegime({ score, change30d, trend }: Props) {
  const getTrendColor = (t: string): string => {
    switch (t) {
      case 'accelerating':
        return '#22c55e'
      case 'stable':
        return '#f59e0b'
      case 'decelerating':
        return '#ef4444'
      default:
        return '#9ca3af'
    }
  }

  const changeClass = change30d >= 0 ? 'positive' : 'negative'
  const changeSign = change30d >= 0 ? '+' : ''

  return (
    <div className="market-regime-card">
      <div className="card-header">
        <h2>AI INFRASTRUCTURE REGIME</h2>
      </div>
      <div className="regime-display">
        <div className="score-large">{score}</div>
        <div className="regime-meta">
          <div className={`trend-badge ${getTrendColor(trend)}`} style={{ borderColor: getTrendColor(trend) }}>
            {trend.toUpperCase()}
          </div>
          <div className={`change-indicator ${changeClass}`}>
            {changeSign}{change30d} vs 30d
          </div>
        </div>
      </div>
    </div>
  )
}
