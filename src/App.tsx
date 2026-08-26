import './App.css'
import { Header } from './components/Header'
import { RealIntelligence } from './components/RealIntelligence'
import { AMZN_PRODUCTION_CAPEX_OBSERVATIONS } from './data/amznPpeObservationProvider'
import { GOOG_PRODUCTION_CAPEX_OBSERVATIONS } from './data/googCapexGuidanceObservationProvider'
import { META_PRODUCTION_CAPEX_OBSERVATIONS } from './data/metaGuidanceObservationProvider'
import { MSFT_PRODUCTION_CAPEX_OBSERVATIONS } from './data/msftCapexObservationProvider'
import { getSourcesByTicker } from './data/sources'
import { TSM_PRODUCTION_OBSERVATIONS } from './data/tsmMonthlyObservationProvider'
import { createRealIntelligenceViewModel } from './presentation/realIntelligenceViewModel'
import { deriveCurrentHyperscalerCapexTrend } from './signals/hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from './signals/hyperscalerTsmConfirmationEngine'
import { deriveTsmSignalsWithTrendConfirmation } from './signals/tsmSignalInterpreter'

const tsmResult = deriveTsmSignalsWithTrendConfirmation(TSM_PRODUCTION_OBSERVATIONS)
const hyperscalerCapexTrend = deriveCurrentHyperscalerCapexTrend()
const crossCompanySignal = deriveHyperscalerTsmConfirmation(
  hyperscalerCapexTrend,
  TSM_PRODUCTION_OBSERVATIONS
)
const productionEvidenceObservations = [
  ...META_PRODUCTION_CAPEX_OBSERVATIONS,
  ...MSFT_PRODUCTION_CAPEX_OBSERVATIONS,
  ...GOOG_PRODUCTION_CAPEX_OBSERVATIONS,
  ...AMZN_PRODUCTION_CAPEX_OBSERVATIONS,
  ...TSM_PRODUCTION_OBSERVATIONS,
]
const registeredSources = ['META', 'MSFT', 'GOOG', 'AMZN', 'TSM']
  .flatMap(getSourcesByTicker)
  .filter(
    (source, index, sources) =>
      sources.findIndex((candidate) => candidate.id === source.id) === index
  )

const realIntelligence = createRealIntelligenceViewModel({
  crossCompanySignal,
  hyperscalerCapexTrend,
  tsmOutlookSignal: tsmResult.signals.find(
    (signal) => signal.signalType === 'REVENUE_OUTLOOK_ACCELERATION'
  ),
  tsmTrend: tsmResult.trend3M,
  tsmObservations: TSM_PRODUCTION_OBSERVATIONS,
  evidenceObservations: productionEvidenceObservations,
  sources: registeredSources,
})

function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="dashboard">
        <section className="real-intelligence-section">
          <RealIntelligence intelligence={realIntelligence} />
        </section>
      </main>

      <footer className="footer">
        <p>
          Evidence-backed monitoring from registered official sources. Data is static at build time
          and may include explicitly retained manual facts. Not investment advice.
        </p>
      </footer>
    </div>
  )
}

export default App
