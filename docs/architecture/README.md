# Current architecture map

This document maps verified current behavior. Follow its links to code and tests; do not treat it as
a substitute for executable contracts or issuer research specifications.

## Purpose

AI Infrastructure Monitor tracks evidence across this transmission chain:

compute demand
-> hyperscaler capital intent
-> physical infrastructure commitment
-> backlog/orders
-> realized deployment
-> semiconductor supply confirmation

The system preserves factual evidence separately from interpretation. It does not establish that all
issuer CapEx, revenue, orders, or backlog is AI-specific.

## Real data and presentation data

Promoted ingested canonical observations live under
[`data/ingestion/`](../../data/ingestion/). Production signal inputs may also include explicitly
retained manual factual observations under [`src/data/`](../../src/data/); validated providers compose
these sources. The dashboard also contains demo/model presentation sections; do not use those values
as production evidence. React components consume presentation/view-model outputs and must not read raw
snapshots, parser candidates, or canonical JSON directly.

## Current dependency direction

```text
official source
-> acquisition and immutable snapshot
-> semantic parser and candidate validation
-> canonical observation
-> validated provider
-> deterministic signal
-> presentation/view model
```

Acquisition and canonical promotion are implemented in [`scripts/ingestion/`](../../scripts/ingestion/).
Providers and downstream verification are under [`src/data/`](../../src/data/) and
[`src/ingestion/`](../../src/ingestion/). Signal derivation is under
[`src/signals/`](../../src/signals/); presentation code is under
[`src/presentation/`](../../src/presentation/) and [`src/components/`](../../src/components/).

## Trust boundaries

- **Official evidence:** current issuer pipelines validate registered Tier-1 issuer or regulator
  sources. Source-specific eligibility remains implemented per issuer rather than by one universal
  policy module.
- **Fixture versus live:** [`snapshot-store.mjs`](../../scripts/ingestion/shared/snapshot-store.mjs)
  requires `FIXTURE` or `LIVE` acquisition mode and mode-specific provenance. Tests use disposable
  roots and verify idempotency and fixture/live reassertion behavior.
- **Semantic versus record identity:**
  [`canonical-store.mjs`](../../scripts/ingestion/shared/canonical-store.mjs) separates logical fact
  identity and observation value identity from source-version/snapshot record identity. Some issuer
  pipelines supply compatibility identity functions, so identity implementation is not fully unified.
- **Numeric versus qualitative:** [`MetricObservation`](../../src/types/metric.ts) requires a numeric
  value. Company-specific commentary types/data remain separate, but there is no generic qualitative
  canonical store and provider boundary today.
- **Baseline versus proposed state:**
  [`verify-production-downstream.mjs`](../../scripts/ingestion/verify-production-downstream.mjs) runs
  committed production verification or redirects supported canonical imports to a disposable root
  using [`canonical-root-resolver.mjs`](../../scripts/ingestion/canonical-root-resolver.mjs).

## Directory ownership

| Path | Current responsibility |
|---|---|
| [`data/ingestion/`](../../data/ingestion/) | Production raw snapshots, manifests, and canonical observation stores. |
| [`scripts/ingestion/`](../../scripts/ingestion/) | Discovery, acquisition, parsing, validation, promotion, orchestration, monitoring, and downstream verifier entry points. |
| [`scripts/ingestion/shared/`](../../scripts/ingestion/shared/) | Shared snapshot, canonical-store, SEC-client, issuer-identity, and deterministic error utilities. |
| [`src/data/`](../../src/data/) | Source registries, factual/manual data, and validated production providers. |
| [`src/ingestion/`](../../src/ingestion/) | Provider parity and baseline/proposed downstream verification. |
| [`src/signals/`](../../src/signals/) | Deterministic company, aggregate, and cross-company derivation plus regression verification. |
| [`src/types/`](../../src/types/) | Numeric observations, CapEx contracts, sources, and signal types. |
| [`tests/fixtures/ingestion/`](../../tests/fixtures/ingestion/) | Source-shape fixtures used by ingestion tests; fixtures are not production evidence. |
| [`tests/ingestion/`](../../tests/ingestion/) | Parser, identity, provenance, coverage, orchestration, monitoring, and proposed-state tests. |
| [`docs/research/`](../research/) | Reviewed research and proposed contracts; not implementation authorization. |

## Executable safeguards

| Safeguard | Evidence |
|---|---|
| Deterministic observation/record identity and version behavior | [`canonical-store.mjs`](../../scripts/ingestion/shared/canonical-store.mjs), [`canonicalStore.test.mjs`](../../tests/ingestion/canonicalStore.test.mjs), [`characterization.test.mjs`](../../tests/ingestion/characterization.test.mjs) |
| Immutable fixture/live provenance | [`snapshot-store.mjs`](../../scripts/ingestion/shared/snapshot-store.mjs), issuer ingestion tests under [`tests/ingestion/`](../../tests/ingestion/) |
| Deterministic signal IDs with injectable generation time | [`derivedSignalIdentity.ts`](../../src/signals/derivedSignalIdentity.ts), [`signalIntegrityVerification.ts`](../../src/signals/signalIntegrityVerification.ts), and the stable-ID assertion in [`metaGuidanceIngestionVerification.ts`](../../src/ingestion/metaGuidanceIngestionVerification.ts), executed by [`verify-meta-guidance-downstream.mjs`](../../scripts/ingestion/verify-meta-guidance-downstream.mjs) in `npm run verify:ingestion` |
| Economic definition/period compatibility | [`companyCapexSignalEngine.ts`](../../src/signals/companyCapexSignalEngine.ts), issuer ingestion and signal verification files |
| Separate baseline and disposable proposed verification | [`productionIngestionVerification.ts`](../../src/ingestion/productionIngestionVerification.ts), [`proposedStateIngestionVerification.ts`](../../src/ingestion/proposedStateIngestionVerification.ts), [`proposedStateResolver.test.mjs`](../../tests/ingestion/proposedStateResolver.test.mjs) |
| Dry-run production-state isolation | [`ingestion-orchestrator.mjs`](../../scripts/ingestion/ingestion-orchestrator.mjs), [`ingestionOrchestrator.test.mjs`](../../tests/ingestion/ingestionOrchestrator.test.mjs) |
| Coverage kept separate from ingestion health | [`coverage-contract.mjs`](../../scripts/ingestion/coverage-contract.mjs), [`coverageContract.test.mjs`](../../tests/ingestion/coverageContract.test.mjs) |
| Unified agent verification | [`npm run verify:agent`](../../package.json) composes `npm run lint`, `npm run build`, and `npm run verify:ingestion`. It is production-non-mutating, but may write ignored build output and disposable temporary test files. |

Current verification commands are defined in [`package.json`](../../package.json). Use
`npm run verify:agent` for the broad composed check and issuer-specific commands for narrower feedback.

## Known gaps

- There is no universal verification-before-promotion transaction. Atomic temporary-file rename in
  the canonical store protects file replacement, but does not make downstream verification a
  prerequisite transaction for every production write.
- Aggregate ingestion is dry-run by default, including when no flag is supplied. Only the explicit
  `--promote` flag selects production paths, and that flag does not replace separate human promotion
  authorization. Unknown, duplicate, or conflicting mode flags fail before ingestion starts.
- Issuer logical-key and observation-ID implementations retain compatibility differences and are not
  fully unified behind one identity implementation.
- There is no generic qualitative canonical store/provider boundary.
- There is no repository-wide `tests/architecture/` invariant suite.

## Vertiv status

The [Vertiv Physical Build Commitment v0.1 specification](../research/vertiv-physical-build-commitment-v0.1.md)
is research and proposed implementation design only. Vertiv Phase 2 is not implemented, approval is
pending, and no Vertiv production data or signal integration is authorized.

## Proposed AI infrastructure observability expansion

The research-only [AI Infrastructure Observability specification](../research/ai-infrastructure-observability/spec.md)
and [C4 architecture roadmap](../research/ai-infrastructure-observability/plan.md) propose an additive
physical-project evidence layer for sovereign AI and neocloud demand. The proposal is blocked pending
human approval. It does not authorize repository implementation, production data, signal, or UI
changes, and Demand Layer v1 remains authoritative for its current scope.
