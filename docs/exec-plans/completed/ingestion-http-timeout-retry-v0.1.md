# Ingestion HTTP Timeout and Bounded Retry/Backoff v0.1

## Plan metadata

- Status: `COMPLETED`
- Responsible human: `jimisu` (repository owner and requesting human)
- Approval: explicitly granted by the responsible human on 2026-08-21 for the defined scope
- Implementation authorization: active only for the defined scope. Live ingestion and production promotion remain unauthorized.

## Objective

Add one shared HTTP transport boundary for production acquisition paths. It must bound every attempt, retry only the explicitly approved transient failures, preserve caller cancellation, consume the response body before returning, and retain deterministic final failure metadata without changing financial semantics or identity.

The helper contract is:

```js
{
  response,
  body,
  requestedUrl,
  finalUrl,
  attempts,
}
```

`body` is the completely consumed response body. `attempts` is operational metadata only and must never enter economic, observation, record, snapshot, canonical, or signal identity.

## Authoritative evidence

- Repository operating rules: [../../../AGENTS.md](../../../AGENTS.md)
- Current architecture and safeguards: [../../architecture/README.md](../../architecture/README.md)
- Execution-plan policy: [../README.md](../README.md)
- Shared SEC acquisition: [../../../scripts/ingestion/shared/sec-client.mjs](../../../scripts/ingestion/shared/sec-client.mjs)
- Snapshot persistence: [../../../scripts/ingestion/shared/snapshot-store.mjs](../../../scripts/ingestion/shared/snapshot-store.mjs)
- Atomic canonical promotion: [../../../scripts/ingestion/shared/canonical-store.mjs](../../../scripts/ingestion/shared/canonical-store.mjs)
- Orchestration reporting: [../../../scripts/ingestion/ingestion-orchestrator.mjs](../../../scripts/ingestion/ingestion-orchestrator.mjs)
- Existing ingestion tests: [../../../tests/ingestion/](../../../tests/ingestion/)

The completed read-only timeout/retry design study is supporting context. Current code, tests, and canonical contracts remain authoritative if that study conflicts with the repository.

## Baseline checkpoint

Recorded before this DRAFT was created:

- Branch: `review/code-analysis-and-recommendations`
- HEAD: `215fef6018288f202ef7cb4225f31380a01dbd9a`
- Worktree: clean
- Production canonical data: unchanged
- `npm run verify:agent`: passed
  - lint: passed
  - build: passed
  - ingestion tests: 155 passed, 0 failed
  - TSMC, AMZN, META, GOOG, and MSFT downstream verification: passed
- `git diff --check`: passed

Before implementation, re-record the implementation branch, HEAD, origin comparison, worktree state, and production canonical hashes. Do not assume this DRAFT checkpoint is the future implementation baseline.

## Current-state findings

Production acquisition currently enters through several wrappers rather than one transport policy:

- TSMC unattended discovery and immutable SEC Form 6-K acquisition use `tsm-sec-lib.mjs`.
- META uses the shared SEC client for submissions and SEC Archives documents.
- GOOG uses the shared SEC client for SEC-backed disclosures; its frozen Q1 baseline remains local and must not be remotely reacquired. A direct Alphabet IR path remains for applicable non-frozen acquisition modes.
- AMZN uses its own SEC submissions and Archives request wrapper.
- MSFT retrieves official Microsoft Investor Relations documents directly.
- The retained legacy TSMC IR collector retrieves the official monthly-revenue page directly and must join the shared transport boundary even though it is not the unattended production default.
- The orchestrator injects `fetchImpl`, but no shared timeout, retry, backoff, `Retry-After`, or caller-abort policy exists.

Existing order is acquisition/body consumption, raw snapshot persistence, parsing, validation, and canonical promotion. A failed acquisition does not promote canonical observations. In multi-document runs, successful earlier documents can leave raw snapshots before a later document fails; failed retry attempts must not add snapshots.

## Responsible-human decisions

These decisions are fixed for v0.1 and must not be changed during implementation without renewed human approval:

- Per-attempt timeout: 15 seconds, covering fetch, redirects, and complete body consumption.
- Maximum attempts: 3 total, including the first attempt.
- Retry only transient network failures, transient body-stream failures, internal timeout, and HTTP `408`, `425`, `429`, `500`, `502`, `503`, or `504`.
- Do not retry caller abort, HTTP `403`, any other unlisted status, or validation, parser, provenance, identity, or economic-semantic failure.
- Maximum accepted `Retry-After`: 30 seconds.
- A valid `Retry-After` above 30 seconds fails closed; do not retry early.
- Preserve existing issuer-facing top-level error codes and add deterministic reason details.
- Caller cancellation uses the existing contextual error code with `reason: "CALLER_ABORTED"`; do not add a new top-level code in v0.1.
- Include the legacy TSMC IR collector in the shared transport boundary.
- Do not persist failed retry attempts as production snapshots.
- Preserve final deterministic error metadata in the run result/report.
- Do not change canonical, observation, record, snapshot, or signal identity.

## Behavioral contract

### Shared transport

Create a shared helper that:

1. Accepts a URL, normal fetch options, an optional caller `AbortSignal`, contextual error-code mapping, and injectable dependencies.
2. Creates a fresh internal timeout controller for each attempt and combines it with the caller signal without losing which signal caused termination.
3. Performs only `GET` acquisition in v0.1.
4. Consumes the full body inside the attempt timeout.
5. Returns the response metadata and body only after successful complete consumption.
6. Cleans up every timer and abort listener after each attempt.
7. Never persists snapshots or canonical data itself.

Dependencies must be injectable for deterministic tests:

- `fetchImpl`
- `sleep(ms, signal)`
- `now()`
- `random()`

An already-aborted caller signal must issue zero requests. Caller abort during fetch, body consumption, or backoff must stop immediately and must not retry.

### Backoff and `Retry-After`

- Default exponential delays before jitter: 500 ms, then 1,000 ms; cap any future exponential value at 4,000 ms.
- Apply equal jitter in the inclusive range 50% through 100% of the capped exponential delay using injected `random()`.
- For HTTP `429` or `503`, accept a valid integer-seconds or HTTP-date `Retry-After` value, calculated using injected `now()`.
- A valid non-negative `Retry-After` at or below 30 seconds replaces the jittered delay.
- Invalid, malformed, or past `Retry-After` falls back to bounded exponential jitter.
- A valid value above 30 seconds fails closed with deterministic reason `RETRY_AFTER_EXCEEDED` and does not sleep or retry.

### Deterministic failures

Keep the existing context-specific top-level code used by each caller, such as discovery-, filing-, or source-unavailability codes. Attach stable details using only applicable fields:

```js
{
  reason: "TIMEOUT" | "CALLER_ABORTED" | "RETRY_EXHAUSTED" |
    "NETWORK_ERROR" | "BODY_STREAM_ERROR" | "RETRY_AFTER_EXCEEDED",
  attempts,
  lastStatus,
  timeoutMs,
}
```

Do not serialize stack traces, elapsed wall-clock timing, random delay values, or platform-specific exception messages as deterministic reason metadata. The orchestrator must retain the final contextual code and deterministic details in issuer results and the run report.

## Authorized implementation scope

Implementation may change only the following after this plan receives explicit human approval:

- Add `scripts/ingestion/shared/http-client.mjs`.
- Modify `scripts/ingestion/shared/sec-client.mjs`.
- Modify `scripts/ingestion/tsm-sec-lib.mjs`.
- Modify `scripts/ingestion/tsm-monthly-lib.mjs`.
- Modify `scripts/ingestion/amzn-ppe-lib.mjs`.
- Modify `scripts/ingestion/meta-guidance-lib.mjs` only as needed to consume the shared return contract.
- Modify `scripts/ingestion/goog-guidance-lib.mjs`.
- Modify `scripts/ingestion/msft-capex-lib.mjs`.
- Modify `scripts/ingestion/ingestion-orchestrator.mjs` only to preserve final deterministic transport error details and pass caller cancellation.
- Add `tests/ingestion/httpClient.test.mjs`.
- Modify the corresponding existing issuer and orchestration tests under `tests/ingestion/` only where required to verify the shared boundary and unchanged behavior.

If implementation requires any other path, stop and request an explicit plan/scope amendment before editing it.

## Forbidden scope

- Live ingestion or any network acquisition during implementation verification.
- Production canonical promotion or modification of `data/ingestion/`.
- Changes to source registries, factual values, parsers, validators, economic definitions, comparability rules, coverage semantics, observations, providers, signal semantics, deterministic IDs, thresholds, scoring, dashboard, or Vertiv Phase 2.
- Changes to `package.json`, dependencies, CI, monitoring presentation, or unrelated documentation.
- Persisting individual failed attempts as raw snapshots or manifests.
- Treating retry counts, delays, timeout timing, or transport errors as economic evidence.
- Automatic fallback to third-party or alternate sources.

## Rollback-safe work packages

### WP1 — Shared transport contract and unit tests

- Add the helper and isolated deterministic tests using only injected fetch, sleep, clock, and random functions.
- Do not connect any issuer.
- Verify timeout ownership, full-body consumption, retry classification, bounded delay, `Retry-After`, caller abort, cleanup, and final error shape.
- Rollback boundary: delete the new helper and its new unit test; no existing behavior has changed.

### WP2 — Shared SEC client migration

- Route shared SEC submissions and Archives requests through the helper.
- Preserve existing headers, SEC fair-access User-Agent behavior, URL/provenance validation, and issuer-facing error codes.
- Run META and GOOG focused fixture tests after each migration.
- Rollback boundary: revert only the shared SEC client integration; WP1 remains independently testable.

### WP3 — Remaining issuer acquisition migration

- Migrate TSMC SEC, AMZN SEC, MSFT IR, GOOG direct IR where applicable, and legacy TSMC IR.
- Preserve every source URL, content-type gate, final-URL gate, parser input, and snapshot provenance field.
- Confirm each collector persists only the final successfully consumed body.
- Rollback boundary: migrate and verify one acquisition module at a time.

### WP4 — Cancellation and run-report metadata

- Thread an optional caller signal through orchestration into issuer acquisition.
- Preserve the existing contextual issuer-facing error code and add deterministic reason details to failed issuer results and serialized run reports.
- Do not change health, coverage, warning, or promotion semantics.
- Rollback boundary: revert orchestration metadata/signal plumbing without reverting issuer transport behavior.

### WP5 — Full regression and production-state comparison

- Run targeted transport/issuer tests, then all repository verification.
- Compare production canonical files byte-for-byte or by recorded SHA-256 against the pre-implementation baseline.
- Verify identity outputs and fixture/live provenance behavior remain unchanged.
- Do not run live acquisition or promotion.

## Acceptance criteria

- Every listed production and retained legacy acquisition path uses the shared transport boundary for live HTTP requests.
- Each attempt times out after 15 seconds across headers, redirects, and full body consumption.
- No operation performs more than 3 attempts.
- Only the approved network/body/timeout/status failures are retried.
- Caller abort is immediate, uses the contextual code plus `CALLER_ABORTED`, and is never retried.
- HTTP `403`, unlisted statuses, and all parser/validation/provenance/identity/economic failures make exactly one attempt.
- Bounded equal-jitter backoff and `Retry-After` behavior match the approved contract.
- A `Retry-After` above 30 seconds fails closed without sleeping or retrying early.
- Failed attempts create no raw snapshot, manifest, candidate, canonical record, or revision.
- A later-document failure leaves production canonical files byte-identical to baseline.
- A retry that eventually succeeds produces one eligible final snapshot and the same observations, records, signals, and deterministic IDs as a first-attempt success.
- Re-running successful fixture ingestion remains idempotent and creates no duplicate semantic observations.
- Final run reports retain deterministic contextual failure code and reason details.
- `attempts` appears only in operational return/report metadata and never in identity input.
- Existing fixture/live provenance separation and all downstream outputs remain unchanged.

## Required negative tests

- Timeout waiting for response headers.
- Timeout during body-stream consumption.
- Transient network failure followed by success.
- Transient body-stream failure followed by success.
- Three exhausted network, timeout, and body-stream attempts.
- Each retryable status: `408`, `425`, `429`, `500`, `502`, `503`, `504`.
- HTTP `403` and representative unlisted `4xx`/`5xx` statuses perform no retry.
- Caller signal already aborted before acquisition: zero fetch calls.
- Caller abort during fetch, body read, and backoff: immediate exit and no further attempt.
- Valid `Retry-After` integer seconds and HTTP date at or below 30 seconds.
- Invalid and past `Retry-After`: bounded jitter fallback.
- `Retry-After` above 30 seconds: deterministic fail-closed result, no sleep, no retry.
- Jitter lower/upper boundaries and exponential cap using deterministic random values.
- Timer/listener cleanup after success and every failure path.
- Parser, validation, provenance, identity, and economic-semantic failures cannot re-enter transport retry.
- Contextual error code remains issuer-specific while reason details remain stable.
- A failed first/second attempt leaves no snapshot; final success leaves exactly one.
- Failure on a later document leaves production canonical state unchanged even if prior documents were acquired.
- Retrying cannot create duplicate records, revisions, or identity drift.
- Fixture acquisition remains network-free and cannot be labeled live.

## Verification commands

No live ingestion command is permitted. Run in this order:

```sh
node --test tests/ingestion/httpClient.test.mjs
node --test tests/ingestion/tsmSecIngestion.test.mjs
node --test tests/ingestion/tsmMonthlyIngestion.test.mjs
node --test tests/ingestion/metaGuidanceIngestion.test.mjs
node --test tests/ingestion/googGuidanceIngestion.test.mjs
node --test tests/ingestion/googFrozenBaseline.test.mjs
node --test tests/ingestion/msftCapexIngestion.test.mjs
node --test tests/ingestion/amznPpeIngestion.test.mjs
node --test tests/ingestion/ingestionOrchestrator.test.mjs
npm run verify:agent
git diff --check
```

Before and after the suite, hash every tracked file under `data/ingestion/observations/` and compare the sets exactly. Also compare deterministic observation, record, snapshot, and signal ID assertions already covered by issuer and downstream verification. Any production canonical difference fails acceptance.

## Human decisions still required

- The responsible human explicitly approved this implementation scope on 2026-08-21; that approval did not authorize live ingestion or production promotion.
- Any expansion beyond the exact authorized paths or behavior requires explicit human approval and a plan amendment.
- Production promotion and live ingestion require separate explicit authorization and remain forbidden even after implementation approval.

No financial, source-selection, parser, or economic-semantic decision is delegated to implementation.

## Progress log

- 2026-08-21: DRAFT created from the completed read-only design and a fresh repository/code/test inspection.
- 2026-08-21: Baseline `npm run verify:agent` passed with 155/155 ingestion tests and all downstream verification; `git diff --check` passed; production state remained unchanged.
- 2026-08-21: Responsible human explicitly approved implementation of the defined scope; status changed to `IN_PROGRESS`.
- 2026-08-21: WP1-WP5 completed. Final `npm run verify:agent` passed: lint, build, 170/170 ingestion tests, and all five downstream verifiers. `git diff --check` passed. Production canonical SHA-256 hashes were identical before and after.

## Decision log

- 2026-08-21: Responsible-human timeout, retry classification, attempt limit, `Retry-After`, cancellation, provenance, reporting, and identity decisions recorded without modification.
- 2026-08-21: Selected a shared body-owning transport helper so body-stream failures and timeout scope are governed by the same attempt contract.
- 2026-08-21: Kept retries outside persistence and parsers to prevent failed attempts from becoming evidence and semantic failures from becoming retryable.

## Closeout

- Result: implementation completed in the approved worktree scope; changes remain uncommitted.
- Implementation state: shared timeout and bounded retry/backoff active across all registered acquisition paths, including legacy TSMC IR.
- Production canonical state: unchanged; all five observation-file SHA-256 hashes match the pre-implementation baseline.
- Promotion/live ingestion: not performed and not authorized.
- Verification: lint, build, 170/170 ingestion tests, downstream verification, and `git diff --check` passed.
- Deferred work: none within v0.1 scope.
