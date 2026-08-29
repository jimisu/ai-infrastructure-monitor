# R1 repository reuse matrix

**Status:** R1 research artifact; no implementation or production authorization
**Repository baseline:** `c630a966b5f17ccf538771ad9e402d611ff57e88`
**Main baseline:** `a0732dc8356ac1330b51c2b29c9c37a1e80dd419`
**Reviewed:** 2026-08-29

This matrix characterizes the implemented Demand Layer v1 contracts against the proposed Track B
research boundary. Compatibility means suitability for a disposable research pilot; it does not
authorize code reuse, schema changes, canonical promotion, or production integration.

| Contract | Verified behavior and evidence | Track B classification | Constraint / protected-state implication |
|---|---|---|---|
| Immutable snapshot and manifest | `scripts/ingestion/shared/snapshot-store.mjs` hashes bytes, requires explicit `LIVE` or `FIXTURE`, separates mode provenance, and writes content-addressed raw/manifest files without overwriting. Issuer tests exercise idempotency and fail-closed acquisition. | **Reuse behind a new adapter** | The mechanics fit official project documents, but the current identity assumes an issuer/source and does not model claim locators, translation lineage, terms checks, or project/phase linkage. R1/R1M may only copy the pattern in disposable state; no write to `data/ingestion/`. |
| Canonical store and revision chain | `scripts/ingestion/shared/canonical-store.mjs` separates logical fact, value-bearing observation, source version/snapshot record, active/superseded state, and atomic replacement. `tests/ingestion/canonicalStore.test.mjs` covers A→A, A→B, A→B→A, reassertion, and duplicate prevention. | **Reference pattern only** | Revision mechanics are useful, but the default identity is numeric metric-centric and one active record per logical key. Reusing it directly would collapse non-additive lifecycle, conflict, schedule and tranche semantics and would mutate a protected production contract. |
| Source/document identity | Snapshot provenance, issuer-specific `sourceDocumentVersionId`, `snapshotId`, and source locator are preserved through promotion; `tests/ingestion/characterization.test.mjs` freezes existing identities. | **Reuse behind a new adapter** | Track B needs a generic document registry with publisher, version/hash, locator, access policy, translation lineage and correction history. Existing issuer-specific IDs must remain unchanged. |
| HTTP transport | `scripts/ingestion/shared/http-client.mjs` supports GET only, bounded timeout/retry/backoff, caller abort, limited retry statuses, bounded `Retry-After`, and deterministic failure details. `tests/ingestion/httpClient.test.mjs` covers these boundaries. | **Direct reuse for permitted GET acquisition, later implementation only** | It does not decide legality, terms, robots, authentication/payment boundaries, source eligibility, document identity or content validation. Those gates must precede any future call; R1 performs no acquisition integration. |
| Coverage contract | `scripts/ingestion/coverage-contract.mjs` makes required fact families explicit and separates `PRESENT`, `NOT_DISCLOSED`, and `MISSING`; tests prove missing cannot masquerade as coverage. | **Reference pattern only** | Current coverage is issuer/fact-family based. Track B needs search-region/language/channel coverage, verified/unquantified/unresolved counts, evidence age and non-global disclaimers without modifying Demand Layer coverage. |
| Disposable proposed-state resolver | `scripts/ingestion/canonical-root-resolver.mjs` allowlists five production canonical filenames and rejects traversal, symlink escape and missing files. `tests/ingestion/proposedStateResolver.test.mjs` proves baseline/proposed independence. | **Reference pattern only** | The isolation pattern is strong, but its exact allowlist and TypeScript-provider imports are Demand Layer-specific. Track B research should use its own disposable artifact root, not extend this production resolver during R1/R1M. |
| Ingestion orchestrator | `scripts/ingestion/ingestion-orchestrator.mjs` runs issuers deterministically, retains partial failures, verifies baseline and proposed state separately, and uses an OS-temp copy for dry runs. `tests/ingestion/ingestionOrchestrator.test.mjs` verifies isolation and health semantics. | **Reference pattern only** | Hard-coded issuer order, five canonical files, and run-report semantics are not project/phase research contracts. Reuse would require an independently approved adapter or later implementation plan. |
| SEC/source connectors | Issuer libraries and `shared/sec-client.mjs` validate source-specific discovery, official URLs and document provenance. | **Reference pattern only** | Useful examples of source-specific fail-closed connectors; they do not provide generic project-source discovery. Connector eligibility remains source-specific and cannot be generalized by assumption. |
| Validated providers | `src/data/*ObservationProvider.ts` validates exact canonical envelopes, identities, ranges and duplicates before returning `MetricObservation[]`. | **Incompatible for direct Track B reuse** | Providers require existing numeric canonical schemas. React must not read raw Track B research. A future Track B provider is a new boundary requiring R3 authorization. |
| Unified verification | `npm run verify:agent` composes lint, TypeScript/Vite build, all ingestion tests and downstream verification. | **Direct reuse as repository completion guardrail** | It verifies existing behavior and protected-state stability, not future Track B semantics. R1 uses it only to prove documentation work did not regress the repository. |

## Reuse conclusion

The repository has reusable acquisition, provenance, failure, revision, coverage, isolation and
verification **patterns**. Only the existing completion guardrail is directly reusable during R1.
The HTTP client and snapshot mechanics are plausible later adapter inputs, but implementation is not
authorized and neither supplies Track B policy by itself. Canonical storage, providers, coverage and
orchestration cannot be directly reused without semantic substitution or changes to protected
Demand Layer v1 contracts.
