# Contributing

Install the locked dependencies and run the required checks:

```bash
npm ci
npm run verify:agent
git diff --check
git diff -- data/ingestion
```

`verify:agent` runs lint, build, presentation tests, all ingestion tests, and downstream verification.
Builds refresh the machine-readable snapshot using the same presentation object as the dashboard.

- Read [AGENTS.md](AGENTS.md) and the [architecture map](docs/architecture/README.md) first.
- Do not promote or modify canonical data without separate, explicit human authorization.
  `data/ingestion` must have no diff for ordinary code/docs changes.
- Do not change signal thresholds, confidence rules, scoring, or economic definitions.
- For new issuers or Track B production work, open an issue first; research does not authorize implementation.
- Research papers under `docs/research/ai-infrastructure-observability/pilot/` are frozen unless
  correcting factual errors, except the living documents named in the
  [research index](docs/research/ai-infrastructure-observability/README.md).
- Keep Track B facts out of `MetricObservation` and `data/ingestion`.
- Prefer official Tier-1 sources and preserve evidence links, provenance, and deterministic IDs.
- Keep changes small and run the full verification before requesting review.
