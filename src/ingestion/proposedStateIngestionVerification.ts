import { TSM_PRODUCTION_OBSERVATIONS } from '../data/tsmMonthlyObservationProvider'
import { deriveCurrentHyperscalerCapexTrend } from '../signals/hyperscalerCapexBreadthEngine'
import { deriveHyperscalerTsmConfirmation } from '../signals/hyperscalerTsmConfirmationEngine'
import { deriveTsmSignalsWithTrendConfirmation } from '../signals/tsmSignalInterpreter'

export function verifyProposedIngestionState() {
  const generatedAt = () => '2026-08-15T00:00:00.000Z'
  const tsm = deriveTsmSignalsWithTrendConfirmation(TSM_PRODUCTION_OBSERVATIONS, generatedAt)
  if (!tsm.trend3M || !tsm.confirmation) throw new Error('Proposed TSMC state cannot produce required signals')
  const hyperscaler = deriveCurrentHyperscalerCapexTrend(generatedAt)
  if (!hyperscaler) throw new Error('Proposed hyperscaler state cannot produce an aggregate')
  const cross = deriveHyperscalerTsmConfirmation(hyperscaler, TSM_PRODUCTION_OBSERVATIONS, generatedAt)
  if (!cross) throw new Error('Proposed state cannot produce cross-company confirmation')
  return { tsmTrend: tsm.trend3M.direction, tsmConfirmation: tsm.confirmation.alignment, hyperscaler: hyperscaler.direction, cross: cross.alignment }
}
