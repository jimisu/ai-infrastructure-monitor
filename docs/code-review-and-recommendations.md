# Validated Code Review Candidates

> **Status:** Review evidence only — not an approved execution plan  
> **Reviewed:** 2026-08-21  
> **Baseline:** `1d360c2` on `main`  
> **Scope:** Read-only codebase review; this PR changes documentation only

This document records findings that were checked against the repository. It does not authorize
implementation, signal changes, canonical-data promotion, or production writes. Follow
[`AGENTS.md`](../AGENTS.md), the current
[architecture map](architecture/README.md), and the
[execution-plan policy](exec-plans/README.md). Current code, tests, schemas, and canonical state
remain authoritative.

## Review outcome

| Finding | Assessment | Priority | Recommended disposition |
|---|---|---:|---|
| Network requests have no explicit timeout | Validated | High | Design and test as a separate ingestion-reliability change |
| Transient HTTP/network failures have no retry policy | Validated | Medium | Specify retry semantics before implementation |
| Opportunity Score formula is duplicated | Validated | Low | Small isolated refactor |
| Four components appear unused | Validated with qualification | Low | Confirm imports/CSS and intent before deletion |
| Add `useMemo` to the current small opportunity list | Not justified | — | Do not implement without profiling evidence |
| Move module-scope deterministic derivation into React | Mischaracterized | — | Do not implement absent a dynamic-data requirement |
| Parallelize issuer ingestion | Unsafe without design evidence | — | Defer |
| Add an Error Boundary | General product-hardening candidate | Low | Revisit with an explicit UI failure requirement |

## Validated findings

### R1 — Network acquisition lacks an explicit timeout

**Evidence**

- [`scripts/ingestion/shared/sec-client.mjs`](../scripts/ingestion/shared/sec-client.mjs)
- [`scripts/ingestion/tsm-sec-lib.mjs`](../scripts/ingestion/tsm-sec-lib.mjs)

Both request helpers await the injected `fetchImpl` without attaching an explicit timeout signal.
A remote endpoint that does not settle can delay an ingestion run indefinitely from the
application's point of view.

**Why this matters**

This is an ingestion-availability risk. It does not currently imply incorrect financial facts,
but it can prevent a monitoring or acquisition run from reaching a deterministic result.

**Required design decisions before implementation**

- Define whether timeout applies per request, per issuer, or per run.
- Preserve caller-provided abort signals rather than silently replacing them.
- Define deterministic error codes for timeout versus other network failures.
- Decide whether SEC and issuer IR endpoints use the same timeout.
- Inject or otherwise control time in tests; do not add slow real-time tests.
- Prove timeout failure cannot promote partial or unverified canonical state.

**Disposition:** Create a separate DRAFT execution plan before changing ingestion behavior.

### R2 — No explicit retry/backoff policy exists

**Evidence**

The shared SEC request helper converts a rejected fetch directly into the supplied deterministic
ingestion error. HTTP 429 and transient 5xx responses are not retried.

**Why the direction is valid**

A bounded retry policy may improve resilience to rate limits and transient upstream failures.

**Why the original implementation sketch was removed**

Retry semantics are part of observable ingestion behavior. A safe design must decide:

- which HTTP statuses and network errors are retryable;
- maximum attempts versus number of retries;
- exponential backoff, cap, and jitter;
- numeric and HTTP-date forms of `Retry-After`;
- injected sleep/clock behavior for deterministic tests;
- preservation of final error codes and response provenance;
- how retries interact with SEC rate limits, snapshots, idempotency, and promotion.

Do not copy a generic retry loop into the client without these contracts and tests.

**Disposition:** Design alongside, or immediately after, R1 under an approved ingestion-reliability
plan.

### F1 — Opportunity Score formula is duplicated

**Evidence**

- [`src/components/CompanyTable.tsx`](../src/components/CompanyTable.tsx) computes the weighted
  score inline.
- [`src/scoring/opportunity.ts`](../src/scoring/opportunity.ts) owns
  `calculateOpportunityScore` and clamps its result to the documented 0–100 range.
- [`src/components/TodayOpportunities.tsx`](../src/components/TodayOpportunities.tsx) already uses
  the shared function.

**Assessment**

This is a maintainability and consistency issue, not a demonstrated production overflow bug.
The current inputs are intended to be 0–100. Centralizing the formula prevents future divergence.

**Disposition:** A small isolated refactor can make `CompanyTable` call
`calculateOpportunityScore`. Do not change weights or score semantics without separate
authorization.

### F2 — Four components appear unused

Candidate files:

- [`src/components/TopSignals.tsx`](../src/components/TopSignals.tsx)
- [`src/components/SignalChanges.tsx`](../src/components/SignalChanges.tsx)
- [`src/components/WhyItMatters.tsx`](../src/components/WhyItMatters.tsx)
- [`src/components/MarketSignal.tsx`](../src/components/MarketSignal.tsx)

They are not imported by the current `App.tsx`, and repository search found no active consumer.

**Qualification**

Unimported modules do not increase the current Vite bundle merely by existing. Their cost is
maintenance and ambiguity. Before deletion, verify there is no intended near-term use and identify
any CSS selectors or tests that would become dead.

**Disposition:** Optional low-priority cleanup in its own change.

## Findings not recommended for implementation

### Do not add `useMemo` for the current opportunity list without evidence

The current component maps, sorts, and slices a small in-memory demo list. `useMemo` is not a
universal React best practice and adds dependency and invalidation complexity. Revisit only if
profiling or materially larger data demonstrates a rendering bottleneck.

### Do not call module-scope derivation a side effect

[`src/App.tsx`](../src/App.tsx) derives deterministic signal and view-model values at module
initialization. These are pure computations over imported production observations, not external
side effects. Computing them once is consistent with the current static-data design.

If the application later gains live reload or stateful providers, design that data lifecycle
explicitly. Moving the same work into `useMemo` and wrapping render-time calculation in
`try/catch` is not an error-boundary design.

### Do not parallelize issuer ingestion yet

[`scripts/ingestion/ingestion-orchestrator.mjs`](../scripts/ingestion/ingestion-orchestrator.mjs)
uses a stable issuer order. Multiple issuers may access SEC endpoints, and sequential execution
simplifies rate limiting, deterministic reporting, partial-failure reasoning, and write ordering.

Require timing evidence and an explicit concurrency/rate-limit design before changing this
behavior.

### Error Boundary is a separate product decision

An Error Boundary can improve UI containment, but the review did not demonstrate a current crash
or define the desired fallback, logging, reset, and recovery behavior. Treat it as an independent
product-hardening candidate rather than coupling it to unrelated refactors.

## Suggested sequencing

These are candidates, not authorized work packages:

1. **Ingestion reliability design:** timeout contract, followed by retry/backoff semantics.
2. **Small UI consistency change:** centralize Opportunity Score calculation.
3. **Optional cleanup:** remove confirmed dead components and associated dead CSS.
4. **Deferred:** Error Boundary when UI failure requirements are defined.

Do not combine ingestion reliability and cosmetic frontend cleanup into one implementation change.

## Verification expectations

For any later authorized change:

```bash
npm run verify:agent
git diff --check
```

Also run targeted tests appropriate to the changed subsystem. `verify:agent` is a local
production-non-mutating verification command; it is not production-promotion authorization or a
CI/merge gate.

## Explicit exclusions

This review does not authorize:

- production canonical-data writes or promotion;
- live ingestion;
- signal, threshold, confidence, scoring-weight, or economic-semantic changes;
- Vertiv Phase 2;
- parallel ingestion;
- copying the removed retry implementation sketch;
- treating this document as a source of truth above current code and tests.
