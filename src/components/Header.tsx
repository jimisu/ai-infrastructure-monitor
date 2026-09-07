import type { FirstScreenView } from '../presentation/firstScreen'

interface Props {
  screen: FirstScreenView
  explanation: string
}

function asOfLabel(asOf: string) {
  return asOf === 'UNAVAILABLE' ? 'UNAVAILABLE' : asOf.slice(0, 10)
}

export function Header({ screen, explanation }: Props) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="title">AI INFRASTRUCTURE MONITOR</h1>
        <div className={`layer-badge board-status-${screen.status.toLowerCase()}`}>{screen.status}</div>
      </div>
      <p className="header-disclaimer">{screen.disclaimer}</p>
      <dl className="scan-facts">
        <div className="scan-fact">
          <dt>Board status</dt>
          <dd>{screen.status}</dd>
        </div>
        <div className="scan-fact">
          <dt>Evidence as of</dt>
          <dd>{screen.asOf === 'UNAVAILABLE' ? 'UNAVAILABLE' : <time dateTime={screen.asOf}>{asOfLabel(screen.asOf)}</time>}</dd>
        </div>
        <div className="scan-fact">
          <dt>Q3 evidence cutoff</dt>
          <dd><time dateTime={screen.evidenceCutoff}>{screen.evidenceCutoff}</time></dd>
        </div>
      </dl>
      <p className="board-explanation">{explanation}</p>
      <a className="snapshot-link" href={screen.snapshotHref}>latest.json</a>
    </header>
  )
}
