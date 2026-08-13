import './App.css'
import { Header } from './components/Header'
import { MarketRegime } from './components/MarketRegime'
import { TodayOpportunities } from './components/TodayOpportunities'
import { WhatChanged } from './components/WhatChanged'
import { InfrastructureMomentum } from './components/InfrastructureMomentum'
import { InvestmentCausalGraph } from './components/InvestmentCausalGraph'
import { CompanyTable } from './components/CompanyTable'
import { MOCK_COMPANIES } from './data/companies'
import { MOCK_SIGNALS, MOCK_IMPACT_EVENTS } from './data/signals'

function App() {
  // Market signal: average of all infrastructure signals
  const marketScore = Math.round(MOCK_SIGNALS.reduce((sum, s) => sum + s.score, 0) / MOCK_SIGNALS.length)
  const marketChange30d = Math.round(MOCK_SIGNALS.reduce((sum, s) => sum + s.change30d, 0) / MOCK_SIGNALS.length)

  return (
    <div className="app-container">
      <Header />

      <main className="dashboard">
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
        <p>All data is mock/demo. Not for investment decisions. 2026 AI Infrastructure Monitor.</p>
      </footer>
    </div>
  )
}

export default App
