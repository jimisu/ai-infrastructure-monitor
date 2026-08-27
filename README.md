# AI Infrastructure Monitor

AI Infrastructure Monitor is an evidence-backed dashboard for answering one question quickly: is AI infrastructure demand accelerating, stable, or weakening?

The default experience combines existing production signal outputs across the demand-to-supply chain:

```text
hyperscaler capital intent (META, MSFT, GOOG, AMZN)
                         +
TSMC historical revenue momentum and forward outlook
                         ↓
AI infrastructure demand confirmation
```

## What the dashboard shows

- The current cross-company direction, alignment, and confidence.
- Hyperscaler CapEx breadth and the status of META, MSFT, GOOG, and AMZN.
- TSMC three-month revenue momentum and forward revenue outlook.
- Periods, publication and retrieval timestamps, observation identifiers, and links to registered official sources.
- An explicit incomplete state when required verified evidence is unavailable.

The dashboard does not claim that all issuer CapEx is AI CapEx. It provides factual monitoring, not investment advice.

## Data boundary

The UI consumes existing validated provider and signal-engine outputs; it does not calculate financial signals in React.

Promoted ingested canonical observations live under `data/ingestion/`. Production inputs may also include explicitly retained manual factual observations under `src/data/`, composed through validated providers. The browser receives a static build-time dataset: opening the dashboard does not run live ingestion.

Research, fixtures, candidate observations, quarantine output, and raw snapshots are not production dashboard inputs.

## Local development

Requirements: Node.js and npm.

```bash
npm ci
npm run dev
```

Vite prints the local development URL. To create and preview the static build:

```bash
npm run build
npm run preview
```

The deployable static output is written to `dist/`. The public MVP is configured for GitHub Pages at
<https://jimisu.github.io/ai-infrastructure-monitor/> using the project base path
`/ai-infrastructure-monitor/`.

### GitHub Pages deployment

Deployment is intentionally manual in MVP v0.1. The pinned GitHub Pages workflow can be started only
through `workflow_dispatch`; its deployment jobs fail closed unless the selected ref is exactly
`refs/heads/main`. Merging or pushing to `main` does not deploy automatically.

The workflow installs locked dependencies, runs `npm run verify:agent`, builds `dist/`, and uploads
only that verified static artifact. Deployment does not run live ingestion or production canonical
promotion, and the published dashboard contains the same static build-time data described above.

Rollback is isolated from product and data semantics: revert the hosting configuration through a
reviewed PR or manually redeploy a last known-good `main` commit. If necessary, disable GitHub Pages
in repository Settings. Do not rewrite Git history or alter canonical data during rollback.

## Verification

Run the unified production-non-mutating verification before reporting general code changes complete:

```bash
npm run verify:agent
git diff --check
```

`verify:agent` runs lint, build, the complete ingestion test suite, and downstream verification. It does not run live ingestion or production promotion.

See [AGENTS.md](AGENTS.md) for repository operating rules and [the architecture map](docs/architecture/README.md) for source-of-truth boundaries.

## License and data rights

Original source code and original project documentation are licensed under the
[MIT License](LICENSE) unless a file states otherwise.

Third-party source documents, issuer and regulatory disclosures, quotations, trademarks, adapted
source-shape fixtures, and other externally sourced materials are excluded from the MIT License and
remain subject to their original rights and terms. Structured observations, provenance records, and
compiled research data are not licensed for redistribution unless explicitly stated otherwise.

See [NOTICE.md](NOTICE.md) for the complete license scope, data-rights boundary, source-material
treatment, and attribution terms.

## Research-use disclaimer

This project is provided for research, educational, and evidence-tracking purposes only. It does not
provide investment, financial, legal, tax, accounting, or other professional advice and does not
recommend buying, selling, or holding any security.

Evidence and derived outputs may be incomplete, delayed, revised, unavailable, or incorrect. Verify
material conclusions against the linked original source and current document version before relying
on them.
