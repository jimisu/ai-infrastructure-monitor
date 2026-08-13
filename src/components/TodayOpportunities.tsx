import type { Company } from '../types/company'
import { calculateOpportunityScore } from '../scoring/opportunity'

interface Props {
  companies: Company[]
}

interface CompanyWithOpportunity extends Company {
  opportunityScore: number
}

export function TodayOpportunities({ companies }: Props) {
  // Calculate opportunity scores and sort
  const opportunitiesWithScores: CompanyWithOpportunity[] = companies.map((company) => ({
    ...company,
    opportunityScore: calculateOpportunityScore({
      aiss: company.aiss,
      tenxScore: company.tenxScore,
      valuationAttractiveness: company.valuationAttractiveness,
      signalMomentum: company.signalMomentum,
    }),
  }))

  const topOpportunities = opportunitiesWithScores
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 5)

  const getReasoningText = (company: CompanyWithOpportunity): string => {
    if (company.opportunityScore >= 85) {
      return `${company.infrastructureLayer} demand accelerating while valuation offers asymmetric upside.`
    } else if (company.opportunityScore >= 75) {
      return `Strong fundamentals with ${company.infrastructureLayer} positioning in a high-growth cycle.`
    } else {
      return `${company.infrastructureLayer} opportunity with favorable risk/reward profile.`
    }
  }

  return (
    <div className="opportunities-card">
      <div className="card-header">
        <h2>TODAY'S OPPORTUNITIES</h2>
        <p className="subtitle">Top 5 ranked by investment potential</p>
      </div>
      <div className="opportunities-list">
        {topOpportunities.map((opportunity) => (
          <div key={opportunity.ticker} className="opportunity-item">
            <div className="opportunity-header">
              <div className="ticker-score">
                <span className="ticker-large">{opportunity.ticker}</span>
                <span className="opportunity-score">{opportunity.opportunityScore}</span>
              </div>
              <div className="layer-label">{opportunity.infrastructureLayer}</div>
            </div>

            <div className="opportunity-metrics">
              <div className="metric">
                <span className="label">AISS</span>
                <span className="value">{opportunity.aiss}</span>
              </div>
              <div className="metric">
                <span className="label">10X</span>
                <span className="value">{opportunity.tenxScore}</span>
              </div>
              <div className="metric">
                <span className="label">Valuation</span>
                <span className="value">{opportunity.valuationAttractiveness}</span>
              </div>
              <div className="metric">
                <span className="label">Momentum</span>
                <span className="value">{opportunity.signalMomentum}</span>
              </div>
            </div>

            <div className="reasoning">
              <span className="why-label">WHY NOW</span>
              <p>{getReasoningText(opportunity)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
