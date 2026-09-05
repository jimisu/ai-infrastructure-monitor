import { q3BuildRealityCheck as report } from '../data/q3BuildRealityCheck'

export function BuildRealityCheck() {
  return (
    <section className="build-reality-check" aria-labelledby="build-reality-title">
      <span className="panel-eyebrow">FIXED-COHORT RESEARCH · EVIDENCE CUTOFF {report.evidenceCutoff}</span>
      <h2 id="build-reality-title">2026 Q3 build reality check</h2>
      <p className="build-verdict">{report.verdict}</p>
      <p>{report.boundary}</p>
      <dl className="build-counts">
        <div><dt>Operating</dt><dd>{report.counts.operating}</dd></div>
        <div><dt>Building or development</dt><dd>{report.counts.building}</dd></div>
        <div><dt>Contracted without construction evidence</dt><dd>{report.counts.contracted}</dd></div>
      </dl>
      <div className="build-case-list">
        {report.cases.map((item) => (
          <article className="build-case" key={item.name}>
            <div><h3>{item.name}</h3><strong>{item.status}</strong></div>
            <div><p>{item.detail}</p><ul>{item.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a></li>)}</ul></div>
          </article>
        ))}
      </div>
      <a href={report.fullReportUrl} target="_blank" rel="noreferrer">Read the full 15-case table and research limitations →</a>
    </section>
  )
}
