import type { RealIntelligenceViewModel } from '../presentation/realIntelligenceViewModel'

import type { toLatestSnapshot } from '../presentation/latestSnapshot'
import type { toDemandStatus } from '../presentation/demandStatus'

interface Props {
  intelligence: RealIntelligenceViewModel | null
  board: ReturnType<typeof toDemandStatus>
  snapshot: ReturnType<typeof toLatestSnapshot>
}

export function RealIntelligence({ intelligence, board, snapshot }: Props) {
  if (!intelligence) return (
    <div className="real-intelligence-card unavailable">
      <div className="real-intelligence-header"><div><span className="real-label">REAL INTELLIGENCE</span><h2>AI INFRASTRUCTURE DEMAND</h2></div><span className="evidence-badge unavailable-badge">{board.status}</span></div>
      <p className="unavailable-message">{board.explanation}</p>
      <p>The detailed positive-confirmation view is unavailable. Available input directions are shown below.</p>
      <dl className="interpretation-facts">
        {Object.entries(snapshot.hyperscalers).map(([ticker, direction]) => <div key={ticker}><dt>{ticker}</dt><dd>{direction}</dd></div>)}
        <div><dt>TSMC three-month trend</dt><dd>{snapshot.tsm.trend3m}</dd></div>
        <div><dt>TSMC outlook</dt><dd>{snapshot.tsm.outlook}</dd></div>
      </dl>
      <div className="real-sources"><span>Official evidence documents</span>{snapshot.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name}</a>)}</div>
    </div>
  )

  const {
    demandSummary,
    crossSummary,
    contributions,
    crossValidation,
    hyperscaler,
    tsmTrend,
    tsmOutlook,
    freshness,
    evidenceGroups,
    technical,
    sources,
  } = intelligence

  return (
    <div className="real-intelligence-card">
      <div className="real-intelligence-header">
        <div><span className="real-label">REAL INTELLIGENCE</span><h2>AI INFRASTRUCTURE DEMAND</h2></div>
        <span className="evidence-badge">EVIDENCE BACKED</span>
      </div>

      <section className="interpretation-card demand-interpretation" aria-label="Demand aggregate summary">
        <span className="panel-eyebrow">DEMAND AGGREGATE</span>
        <h3>{demandSummary.title}</h3>
        <div className="interpretation-status">
          <strong>{demandSummary.direction}</strong>
          <span>{demandSummary.confirmation}</span>
          <span>{demandSummary.confidence} CONFIDENCE</span>
        </div>
        <dl className="interpretation-facts">
          <div><dt>Companies confirming demand</dt><dd>{demandSummary.companiesConfirmingDemandLabel}</dd></div>
          <div><dt>Supply confirmation</dt><dd>{demandSummary.supplyConfirmation}</dd></div>
          <div><dt>Coverage</dt><dd>{hyperscaler.coverageLabel}</dd></div>
          <div><dt>Positive breadth</dt><dd>{hyperscaler.positiveBreadthLabel}</dd></div>
        </dl>
        <p>{demandSummary.explanation}</p>
        <div className="freshness-line">Data published through <time dateTime={freshness.latestPublishedAt}>{freshness.latestPublishedLabel}</time>{' · '}static build-time dataset</div>
      </section>

      <section className="interpretation-card cross-interpretation" aria-label="Cross-signal confirmation">
        <span className="panel-eyebrow">CROSS-SIGNAL CONFIRMATION</span>
        <h3>Demand and semiconductor supply are aligned</h3>
        <div className="relationship-rows">
          <div><span>Demand side</span><p>{crossSummary.demandSide}</p></div>
          <div><span>Supply side</span><p>{crossSummary.supplySide}</p></div>
          <div><span>Result</span><p>{crossSummary.result}</p></div>
          <div><span>Confidence</span><strong>{crossSummary.confidence}</strong></div>
        </div>
      </section>

      <section className="company-contributions" aria-labelledby="company-contributions-title">
        <div className="section-heading">
          <span className="panel-eyebrow">CONTRIBUTING SIGNALS</span>
          <h3 id="company-contributions-title">Company signal summaries</h3>
        </div>
        <div className="contribution-grid">
          {contributions.map((contribution) => (
            <article className="contribution-card" key={contribution.ticker}>
              <div><strong>{contribution.displayTicker}</strong><span>{contribution.role}</span></div>
              <h4>{contribution.title}</h4>
              <b className={`company-capex-${contribution.status.toLowerCase()}`}>{contribution.status}</b>
              <small className="contribution-period">{contribution.period}</small>
              <small className="fact-count">{contribution.evidenceCountLabel}</small>
            </article>
          ))}
        </div>
        <p className="semantic-boundary">Hyperscaler facts are issuer-level total CapEx or property-and-equipment evidence; they are not relabeled as AI-only CapEx. TSMC is separate semiconductor supply confirmation and is not attributed to any specific hyperscaler.</p>
        <div className="real-intelligence-grid supply-grid">
          <article className="intelligence-panel"><span className="panel-eyebrow">TSMC HISTORY</span><h3>3M Revenue Trend</h3><div className="value-transition">{tsmTrend.previousAverageLabel} <span>→</span> {tsmTrend.currentAverageLabel}</div><div className="derived-change">{tsmTrend.changeLabel}</div><p>{tsmTrend.direction} · {tsmTrend.period}</p></article>
          <article className="intelligence-panel forward-guidance-panel">
            <div className="outlook-heading"><span className="panel-eyebrow">TSMC FORWARD OUTLOOK</span><strong>{tsmOutlook.status}</strong></div>
            <h3>Revenue Guidance</h3>
            <div className="period-comparison">
              <div><span>BASELINE · {tsmOutlook.baselinePeriod}</span><small>Previous-quarter actual</small><b>{tsmOutlook.previousQuarterActualLabel}</b></div>
              <div><span>OUTLOOK · {tsmOutlook.outlookPeriod}</span><small>Revenue guidance range</small><b>{tsmOutlook.guidanceRangeLabel}</b></div>
            </div>
            <dl className="outlook-summary">
              <div><dt>Guidance midpoint</dt><dd>{tsmOutlook.guidanceMidpointLabel}</dd></div>
              <div><dt>Implied sequential growth</dt><dd>{tsmOutlook.impliedSequentialGrowthLabel}</dd></div>
            </dl>
          </article>
        </div>
      </section>

      <section className="supporting-evidence" aria-labelledby="supporting-evidence-title">
        <div className="section-heading">
          <span className="panel-eyebrow">EVIDENCE TRACE</span>
          <h3 id="supporting-evidence-title">{technical.cross.evidenceCount} supporting factual observations</h3>
        </div>
        {evidenceGroups.map((group) => (
          <section className="company-evidence-group" key={group.ticker}>
            <h4>{group.displayTicker}</h4>
            <div className="evidence-list">
              {group.observations.map((item) => (
                <article className="evidence-item" key={item.observationId}>
                  <div className="evidence-item-heading"><span>{item.metricLabel}</span><b>{item.valueLabel}</b></div>
                  <dl><div><dt>Period</dt><dd>{item.period} · {item.periodType}</dd></div>{item.guidanceAsOfPeriod && <div><dt>Guidance as of</dt><dd>{item.guidanceAsOfPeriod}</dd></div>}<div><dt>Published</dt><dd><time dateTime={item.publishedAt}>{item.publishedLabel}</time></dd></div></dl>
                  <a href={item.documentUrl} target="_blank" rel="noreferrer">{item.sourceName} · {item.sourceTier}</a>
                </article>
              ))}
            </div>
          </section>
        ))}
        <div className="real-sources"><span>Official sources</span>{sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.name}</a>)}</div>
      </section>

      <details className="technical-details">
        <summary>Technical details</summary>
        <div className="technical-grid">
          <section>
            <h4>Demand aggregate</h4>
            <dl>
              <div><dt>Signal ID</dt><dd><code>{technical.aggregate.id}</code></dd></div>
              <div><dt>Generated at</dt><dd>{technical.aggregate.generatedAt}</dd></div>
              <div><dt>Evidence</dt><dd>{technical.aggregate.evidenceCount} observations · {technical.aggregate.sourceCount} sources</dd></div>
            </dl>
            <h5>Contributing company signal IDs</h5>
            <ul>{technical.aggregate.contributingSignalIds.map((id) => <li key={id}><code>{id}</code></li>)}</ul>
          </section>
          <section>
            <h4>Cross signal</h4>
            <dl>
              <div><dt>Signal ID</dt><dd><code>{technical.cross.id}</code></dd></div>
              <div><dt>Generated at</dt><dd>{technical.cross.generatedAt}</dd></div>
              <div><dt>Confirmation</dt><dd>{crossValidation.alignment} · {crossValidation.confidence}</dd></div>
              <div><dt>Evidence</dt><dd>{technical.cross.evidenceCount} observations · {technical.cross.sourceCount} sources</dd></div>
            </dl>
            <h5>Contributing signal IDs</h5>
            <ul>{technical.cross.contributingSignalIds.map((id) => <li key={id}><code>{id}</code></li>)}</ul>
          </section>
          <section className="technical-observations">
            <h4>Observation provenance</h4>
            <ul className="technical-observation-list">
              {technical.observations.map((item) => (
                <li key={item.observationId}>
                  <strong>{item.displayTicker} · {item.metricLabel} · {item.period}</strong>
                  <dl>
                    <div><dt>Observation ID</dt><dd><code>{item.observationId}</code></dd></div>
                    <div><dt>Published ISO</dt><dd><code>{item.publishedAt}</code></dd></div>
                    <div><dt>Retrieved ISO</dt><dd><code>{item.retrievedAt}</code></dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </details>
    </div>
  )
}
