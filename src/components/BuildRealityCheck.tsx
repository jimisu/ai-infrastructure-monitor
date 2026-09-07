import { q3BuildRealityCheck as report } from '../data/q3BuildRealityCheck'
import type { FirstScreenView } from '../presentation/firstScreen'

interface Props {
  screen: FirstScreenView
}

export function BuildRealityCheck({ screen }: Props) {
  return (
    <section className="build-reality-check" aria-labelledby="build-reality-title">
      <span className="panel-eyebrow">FIXED-COHORT RESEARCH · EVIDENCE CUTOFF {report.evidenceCutoff}</span>
      <h2 id="build-reality-title">2026 Q3 build reality check</h2>
      <p className="build-verdict">{report.verdict}</p>
      <dl className="build-counts">
        <div><dt>Operating</dt><dd>{report.counts.operating}</dd></div>
        <div><dt>Building or development</dt><dd>{report.counts.building}</dd></div>
        <div><dt>Contracted without construction evidence</dt><dd>{report.counts.contracted}</dd></div>
      </dl>
      <div className="cohort-groups">
        {screen.groups.map((group) => (
          <section className="cohort-group" key={group.id} aria-labelledby={`cohort-${group.id}`}>
            <h3 id={`cohort-${group.id}`}>{group.label} <span>{group.cases.length}</span></h3>
            <ul className="cohort-table">
              {group.cases.map((item) => (
                <li className="cohort-row" key={item.name}>
                  <div className="cohort-name">
                    <strong>{item.name}</strong>
                    <small>{item.status}</small>
                  </div>
                  <p>{item.detail}</p>
                  <ul className="cohort-sources">
                    {item.sources.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} target="_blank" rel="noreferrer">{source.name}</a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p>{report.boundary}</p>
      <a href={report.fullReportUrl} target="_blank" rel="noreferrer">Read the full 15-case table and research limitations →</a>
    </section>
  )
}
