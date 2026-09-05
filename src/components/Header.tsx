import type { DemandBoardStatus } from '../presentation/demandStatus'

interface Props { asOf: string; status: DemandBoardStatus; explanation: string }

export function Header({ asOf, status, explanation }: Props) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="title">AI INFRASTRUCTURE MONITOR</h1>
        <div className={`layer-badge board-status-${status.toLowerCase()}`}>{status}</div>
      </div>
      <p className="subtitle">Data as of {asOf === 'UNAVAILABLE' ? 'UNAVAILABLE' : <time dateTime={asOf}>{asOf.slice(0, 10)}</time>} · Static build-time evidence</p>
      <p className="board-explanation">{explanation}</p>
      <a className="snapshot-link" href={`${import.meta.env.BASE_URL}latest.json`}>Machine-readable snapshot</a>
    </header>
  )
}
