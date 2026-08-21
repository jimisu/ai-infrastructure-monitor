import type { Company } from '../types/company'
import { calculateOpportunityScore } from '../scoring/opportunity'

interface Props {
  companies: Company[]
}

export function CompanyTable({ companies }: Props) {
  const getTrendColor = (trend: string): string => {
    switch (trend) {
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

  return (
    <div className="company-table-card">
      <div className="card-header">
        <h2>FULL COMPANY WATCHLIST</h2>
      </div>
      <table className="company-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Infrastructure Layer</th>
            <th>AISS</th>
            <th>30D Change</th>
            <th>10X Score</th>
            <th>Opportunity Score</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.ticker}>
              <td className="ticker-cell">
                <strong>{company.ticker}</strong>
              </td>
              <td>{company.infrastructureLayer}</td>
              <td>
                <div className="score-cell">{company.aiss}</div>
              </td>
              <td>
                <span className="change-value">
                  {company.aissChange30d >= 0 ? '+' : ''}{company.aissChange30d}
                </span>
              </td>
              <td>
                <strong className="score-cell">{company.tenxScore}</strong>
              </td>
              <td>
                <strong className="opportunity-score">
                  {calculateOpportunityScore({
                    aiss: company.aiss,
                    tenxScore: company.tenxScore,
                    valuationAttractiveness: company.valuationAttractiveness,
                    signalMomentum: company.signalMomentum,
                  })}
                </strong>
              </td>
              <td>
                <span
                  className="trend-pill"
                  style={{ color: getTrendColor(company.trend) }}
                >
                  {company.trend.charAt(0).toUpperCase() + company.trend.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
