export function WhyItMatters() {
  return (
    <div className="why-matters-card">
      <div className="card-header">
        <h2>Why It Matters</h2>
      </div>
      <div className="causal-chain">
        <div className="chain-stage">
          <div className="stage-title">Hyperscaler CapEx</div>
          <div className="stage-icon">↓</div>
        </div>
        <div className="chain-stage">
          <div className="stage-title">GPU Deployment</div>
          <div className="stage-icon">↓</div>
        </div>
        <div className="chain-stage">
          <div className="stage-title">Rack Power Density</div>
          <div className="stage-icon">↓</div>
        </div>
        <div className="chain-stage">
          <div className="stage-title">Networking + Power + Cooling Demand</div>
          <div className="stage-icon">↓</div>
        </div>
        <div className="chain-stage">
          <div className="stage-title final">Infrastructure Beneficiaries</div>
        </div>
      </div>
      <div className="implications">
        <p>
          <strong>The implication:</strong> AI infrastructure supply chain companies are
          experiencing synchronized secular demand acceleration. This creates asymmetric
          upside potential for companies with durable competitive advantages and pricing power.
        </p>
      </div>
    </div>
  )
}
