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

The deployable static output is written to `dist/`. A public hosting target will be selected in the MVP deployment checkpoint; no host-specific configuration is committed yet.

## Verification

Run the unified production-non-mutating verification before reporting general code changes complete:

```bash
npm run verify:agent
git diff --check
```

`verify:agent` runs lint, build, the complete ingestion test suite, and downstream verification. It does not run live ingestion or production promotion.

See [AGENTS.md](AGENTS.md) for repository operating rules and [the architecture map](docs/architecture/README.md) for source-of-truth boundaries.
