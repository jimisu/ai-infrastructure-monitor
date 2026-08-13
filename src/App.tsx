import './App.css'
import { Header } from './components/Header'
import { MarketRegime } from './components/MarketRegime'
import { TodayOpportunities } from './components/TodayOpportunities'
import { WhatChanged } from './components/WhatChanged'
import { InfrastructureMomentum } from './components/InfrastructureMomentum'
import { InvestmentCausalGraph } from './components/InvestmentCausalGraph'
import { CompanyTable } from './components/CompanyTable'
import { RealIntelligence } from './components/RealIntelligence'
import { MOCK_COMPANIES } from './data/companies'
import { MOCK_SIGNALS, MOCK_IMPACT_EVENTS } from './data/signals'
import { META_CAPEX_OBSERVATIONS } from './data/metaCapexMetrics'
import { TSM_METRIC_OBSERVATIONS } from './data/tsmMetrics'
import { getSourceById } from './data/sources'
import { deriveMetaCapexSignals } from './signals/metaCapexSignalInterpreter'
import { deriveTsmSignalsWithTrendConfirmation } from './signals/tsmSignalInterpreter'
import { deriveCrossCompanySignals } from './signals/crossCompanySignalInterpreter'
import { createRealIntelligenceViewModel } from './presentation/realIntelligenceViewModel'

const metaSignals = deriveMetaCapexSignals(META_CAPEX_OBSERVATIONS)
const tsmResult = deriveTsmSignalsWithTrendConfirmation(TSM_METRIC_OBSERVATIONS)
const crossCompanySignal = deriveCrossCompanySignals(
  META_CAPEX_OBSERVATIONS,
  TSM_METRIC_OBSERVATIONS
)[0]
const realIntelligence = createRealIntelligenceViewModel({
  crossCompanySignal,
  metaGuidanceSignal: metaSignals.find(
    (signal) => signal.signalType === 'CAPEX_GUIDANCE_REVISION_UP'
  ),
  tsmOutlookSignal: tsmResult.signals.find(
    (signal) => signal.signalType === 'REVENUE_OUTLOOK_ACCELERATION'
  ),
  tsmTrend: tsmResult.trend3M,
  metaObservations: META_CAPEX_OBSERVATIONS,
  tsmObservations: TSM_METRIC_OBSERVATIONS,
  sources: ['meta-ir-main', 'tsmc-ir-main']
    .map(getSourceById)
    .filter((source) => source !== undefined),
})

function App() {
  // Market signal: average of all infrastructure signals
  const marketScore = Math.round(MOCK_SIGNALS.reduce((sum, s) => sum + s.score, 0) / MOCK_SIGNALS.length)
  const marketChange30d = Math.round(MOCK_SIGNALS.reduce((sum, s) => sum + s.change30d, 0) / MOCK_SIGNALS.length)

  return (
    <div className="app-container">
      <Header />

      <main className="dashboard">
        <section className="real-intelligence-section">
          <RealIntelligence intelligence={realIntelligence} />
        </section>

        <div className="demo-model-divider">
          <span>DEMO MODEL</span>
          <strong>DEMO DATA — AISS / OPPORTUNITY / 10X / MARKET REGIME</strong>
        </div>

        <section className="market-regime-section">
          <MarketRegime score={marketScore} change30d={marketChange30d} trend="accelerating" />
        </section>

        <section className="opportunities-section">
          <TodayOpportunities companies={MOCK_COMPANIES} />
        </section>

        <section className="changes-section">
          <WhatChanged events={MOCK_IMPACT_EVENTS} />
        </section>

        <section className="momentum-section">
          <InfrastructureMomentum signals={MOCK_SIGNALS} />
        </section>

        <section className="causal-section">
          <InvestmentCausalGraph />
        </section>

        <section className="watchlist-section">
          <CompanyTable companies={MOCK_COMPANIES} />
        </section>
      </main>

      <footer className="footer">
        <p>
          Real Intelligence is evidence-backed from registered sources. Investment model sections
          remain mock/demo. Not for investment decisions. 2026 AI Infrastructure Monitor.
        </p>
      </footer>
    </div>
  )
}

export default App
