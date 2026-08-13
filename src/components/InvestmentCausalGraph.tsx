export function InvestmentCausalGraph() {
  return (
    <div className="causal-graph-card">
      <div className="card-header">
        <h2>INVESTMENT CAUSAL GRAPH</h2>
        <p className="subtitle">How upstream demand propagates through the supply chain</p>
      </div>

      <div className="causal-graph">
        {/* Root cause */}
        <div className="graph-node root-node">
          <div className="node-label">Hyperscaler CapEx ↑</div>
        </div>

        <div className="graph-arrow">↓</div>

        {/* Primary impact */}
        <div className="graph-node primary-node">
          <div className="node-label">AI Cluster Buildout</div>
        </div>

        <div className="graph-arrow">↓</div>

        {/* Secondary impacts - three columns */}
        <div className="graph-layer three-column">
          <div className="graph-node secondary-node">
            <div className="node-label-small">Compute</div>
            <div className="companies">
              <span className="company-badge">NVDA</span>
            </div>
          </div>

          <div className="graph-node secondary-node">
            <div className="node-label-small">Networking</div>
            <div className="companies">
              <span className="company-badge">ANET</span>
              <span className="company-badge">COHR</span>
            </div>
          </div>

          <div className="graph-node secondary-node">
            <div className="node-label-small">Power</div>
            <div className="companies">
              <span className="company-badge">VRT</span>
              <span className="company-badge">ETN</span>
            </div>
          </div>
        </div>

        <div className="graph-arrow">↓</div>

        {/* Tertiary - compute supply chain */}
        <div className="graph-layer one-column">
          <div className="graph-node supply-node">
            <div className="node-label-small">GPU/ASIC Design & Advanced Packaging</div>
            <div className="companies">
              <span className="company-badge">TSMC</span>
            </div>
            <div className="node-sublabel">Advanced Nodes + Advanced Packaging</div>
          </div>
        </div>

        <div className="graph-arrow">↓</div>

        {/* Final impacts */}
        <div className="graph-layer two-column">
          <div className="graph-node tertiary-node">
            <div className="node-label-small">Memory</div>
            <div className="companies">
              <span className="company-badge">MU</span>
            </div>
          </div>

          <div className="graph-node tertiary-node">
            <div className="node-label-small">Cooling & Density</div>
            <div className="companies">
              <span className="company-badge">VRT</span>
              <span className="company-badge">MOD</span>
            </div>
          </div>
        </div>

        {/* Impact explanation */}
        <div className="graph-explanation">
          <strong>Investment implication:</strong> Hyperscaler CapEx triggers synchronized demand across
          compute, networking, and power. TSMC acts as a supply-side confirmation signal: accelerating demand
          for advanced nodes and packaging validates AI compute buildout is real and accelerating.
        </div>
      </div>
    </div>
  )
}
