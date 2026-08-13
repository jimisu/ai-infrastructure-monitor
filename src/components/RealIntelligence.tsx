import type { RealIntelligenceViewModel } from '../presentation/realIntelligenceViewModel'

interface Props {
  intelligence: RealIntelligenceViewModel | null
}

function signed(value: number, decimals: number, suffix: string): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}${suffix}`
}

export function RealIntelligence({ intelligence }: Props) {
  if (!intelligence) {
    return (
      <div className="real-intelligence-card unavailable">
        <div className="real-intelligence-header">
          <div>
            <span className="real-label">REAL INTELLIGENCE</span>
            <h2>AI INFRASTRUCTURE DEMAND</h2>
          </div>
          <span className="evidence-badge unavailable-badge">INCOMPLETE</span>
        </div>
        <p className="unavailable-message">
          UNAVAILABLE — verified demand and supply confirmation evidence is incomplete.
        </p>
      </div>
    )
  }

  const { crossCompanySignal, meta, tsmTrend, tsmOutlook, sources } = intelligence

  return (
    <div className="real-intelligence-card">
      <div className="real-intelligence-header">
        <div>
          <span className="real-label">REAL INTELLIGENCE</span>
          <h2>AI INFRASTRUCTURE DEMAND</h2>
        </div>
        <span className="evidence-badge">EVIDENCE BACKED</span>
      </div>

      <div className="real-status-row">
        <strong>{crossCompanySignal.direction}</strong>
        <span>{crossCompanySignal.confidence} CONFIDENCE</span>
      </div>

      <div className="real-intelligence-grid">
        <article className="intelligence-panel">
          <span className="panel-eyebrow">DEMAND</span>
          <h3>META CapEx Guidance Revision</h3>
          <div className="value-transition">
            ${meta.priorMidpoint.toFixed(1)}B <span>→</span> ${meta.currentMidpoint.toFixed(1)}B
          </div>
          <div className="derived-change">{signed(meta.revisionPercent, 2, '%')}</div>
          <p>Annual Meta capital expenditure guidance; no AI-only attribution is inferred.</p>
        </article>

        <article className="intelligence-panel">
          <span className="panel-eyebrow">SUPPLY CONFIRMATION</span>
          <h3>TSMC 3M Revenue Trend</h3>
          <div className="value-transition">
            {tsmTrend.previousAverage.toFixed(2)}% <span>→</span> {tsmTrend.currentAverage.toFixed(2)}%
          </div>
          <div className="derived-change">
            {signed(tsmTrend.changePercentagePoints, 2, 'pp')}
          </div>
        </article>

        <article className="intelligence-panel">
          <span className="panel-eyebrow">FORWARD OUTLOOK</span>
          <h3>TSMC Forward Revenue Outlook</h3>
          <div className="outlook-values">
            <span>Q2 actual ${tsmOutlook.actualRevenue.toFixed(1)}B</span>
            <span>Q3 guidance midpoint ${tsmOutlook.guidanceMidpoint.toFixed(1)}B</span>
          </div>
          <div className="derived-change">{signed(tsmOutlook.changePercent, 2, '%')}</div>
        </article>
      </div>

      <div className="cross-validation-row">
        <span>CROSS VALIDATION</span>
        <strong>CONFIRMED</strong>
        <span>{crossCompanySignal.evidenceObservationIds.length} factual observations</span>
      </div>

      <div className="real-sources">
        <span>Sources</span>
        {sources.map((source) => (
          <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
            {source.name}
          </a>
        ))}
      </div>
    </div>
  )
}
