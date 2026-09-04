# Safe ingestion default and fixed-cohort Q4 review v0.1

## Plan metadata

- Status: `READY_FOR_FINAL_COMMIT`
- Responsible human: `jimisu` (repository owner and requesting human)
- Direction authorized: on 2026-09-03, the responsible human selected recommendations 2 and 3:
  make aggregate ingestion dry-run by default, then review only the fixed 15-case cohort next quarter.
- Approval: explicitly granted by the responsible human on 2026-09-03 for WP1-WP3 only.
- Implementation authorization: active only for WP1-WP3. WP4-WP5, production writes, commit, push,
  merge, and deployment remain unauthorized.

## Objective

Deliver two deliberately separated outcomes:

1. Make `npm run ingest:all` non-mutating by default. Production-path execution must require one
   explicit promotion flag and must remain subject to a separate human authorization each time.
2. After the 2026 Q3 observation period closes and relevant Tier-1 evidence is available, recheck the
   already frozen 15-case cohort once and record only eligible lifecycle transitions, adverse events,
   source staleness, or no material transition.

The two outcomes share a governance purpose but not an execution gate. WP1-WP3 may complete before
the Q4 evidence window. WP4-WP5 must not begin merely because the CLI safety change is approved.

## Source specifications

- Repository rules: [`../../../AGENTS.md`](../../../AGENTS.md)
- Execution-plan policy: [`../README.md`](../README.md)
- Current ingestion architecture: [`../../architecture/README.md`](../../architecture/README.md)
- Monitoring contract: [`../../ingestion-monitoring.md`](../../ingestion-monitoring.md)
- Fixed-cohort baseline: [`../../research/ai-infrastructure-observability/pilot/full-r2/lean-quarterly-transition-baseline-v0.1.md`](../../research/ai-infrastructure-observability/pilot/full-r2/lean-quarterly-transition-baseline-v0.1.md)
- Public Q3 baseline: [`../../research/ai-infrastructure-observability/productization/2026-q3-ai-build-reality-check-draft.md`](../../research/ai-infrastructure-observability/productization/2026-q3-ai-build-reality-check-draft.md)
- User-test decision boundary: [`../../research/ai-infrastructure-observability/productization/five-minute-user-test-v0.1.md`](../../research/ai-infrastructure-observability/productization/five-minute-user-test-v0.1.md)

## Baseline checkpoint

Recorded before drafting this plan on 2026-09-03:

- Branch: `delivered/q3-user-test-final`
- HEAD: `0248102bc5076cfb21996717fea60316a023ef50`
- Remote comparison: `0/0` against `origin/docs/ai-infrastructure-observability-roadmap`
- Worktree: clean
- Current CLI behavior: `scripts/ingestion/ingest-all.mjs` sets `dryRun` only when `--dry-run` is
  present; absence of the flag permits execution against `data/ingestion`.
- Monitoring workflow: explicitly supplies `--dry-run` and guards tracked production observations.
- Fixed-cohort cutoff: 2026-08-30, 15 cases, no capacity aggregate.
- Production canonical observations: unchanged by plan drafting.
- `node --test tests/ingestion/ingestionOrchestrator.test.mjs`: 19 passed, 1 failed because the local
  environment has no installed `vite` package; direct downstream verification reports
  `ERR_MODULE_NOT_FOUND: vite`. This is an environment/dependency blocker, not an observed canonical
  inconsistency.
- `git diff --check`: passed before plan drafting.

Before implementation, re-establish branch, HEAD, upstream comparison, worktree state, dependency
availability, and SHA-256 hashes of every file under `data/ingestion/observations/`.

## Authorized paths after explicit plan approval

WP1-WP3 may change only:

- `scripts/ingestion/ingest-all.mjs`
- `tests/ingestion/ingestionOrchestrator.test.mjs`, or one new focused CLI test under
  `tests/ingestion/`, if process-level CLI behavior cannot be tested cleanly in the existing file
- `README.md`
- `docs/architecture/README.md`
- `docs/ingestion-monitoring.md`
- this execution plan

WP4-WP5 may change only:

- a new versioned Q4 research ledger beside the existing fixed-cohort baseline
- a new versioned Q4 Reality Check beside the Q3 draft, but only if all 15 cases were rechecked
- this execution plan

Any other path requires a plan amendment and renewed human approval.

## Forbidden scope

- No production canonical-data write or promotion.
- No live invocation of aggregate ingestion during implementation verification.
- No change to issuer parsers, source registries, schemas, identities, provenance, coverage,
  evidence eligibility, signal semantics, thresholds, scoring, UI, or deployment.
- No new project candidate, replacement candidate, changed 15-case membership, weakened threshold,
  cross-project capacity total, or conversion of facility/utility/receiving power into AI IT load.
- No inference that `NO_MATERIAL_TRANSITION` means demand deceleration.
- No automatic production promotion, even when the explicit CLI flag is supplied.
- No commit, push, PR state change, merge, or deployment without its separate authorization.

## Human decisions fixed by this plan

- Safe default: no flag means dry-run.
- Explicit production-path flag: `--promote`.
- `--dry-run` remains accepted as a documented compatibility flag and is mutually exclusive with
  `--promote`.
- Unknown CLI flags fail closed with a usage error before ingestion starts.
- `--promote` selects the existing production-path behavior; it does not bypass verification and it
  does not constitute human promotion authorization.
- The quarterly population remains exactly cases 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 15, 16, 17, 21,
  and 22 from the 2026-08-30 baseline.
- The next update compares against that baseline and uses only its six allowed transition categories
  and four ledger outcomes.

## Rollback-safe work packages

### WP1 — CLI contract tests

- Add process-level tests proving that no flag and `--dry-run` both select disposable state.
- Prove that `--promote` is the only route to the production-root code path.
- Prove that conflicting or unknown flags fail before any issuer runner, network request, report, or
  canonical write.
- Use injected or fixture-only runners; do not perform live acquisition.
- Rollback boundary: tests only.

### WP2 — Safe default implementation

- Parse the supported flags in `ingest-all.mjs`.
- Default to `dryRun: true`; set `dryRun: false` only for an exclusive `--promote` invocation.
- Preserve orchestrator, verification, reporting, identity, and error semantics.
- Rollback boundary: revert the entry-point change; no production state is touched.

### WP3 — Contract documentation and regression

- Update the three authorized documentation paths so every example and architecture statement
  reflects the safe default and separate promotion authorization.
- Run focused tests, full repository verification, `git diff --check`, and production observation
  hash comparison.
- Do not mark WP1-WP3 complete while dependencies are missing or any required check fails.

### WP4 — Q4 fixed-cohort evidence recheck

- Start only after 2026-09-30 and only when a separately recorded human instruction authorizes the
  research run.
- Recheck all 15 cases against official Tier-1 sources; preserve original-language and source-time
  precision where applicable.
- Record exactly one ledger outcome per case: `NO_MATERIAL_TRANSITION`, `TRANSITION`,
  `ADVERSE_EVENT`, or `SOURCE_UNAVAILABLE_OR_STALE`.
- Do not change the cohort, backfill a synthetic quarterly flow, or treat publication as transition.
- Rollback boundary: one new research-only Q4 ledger; no production consumer reads it.

### WP5 — Incremental-value comparison and stop decision

- Refresh only the contemporaneous comparison facts needed from NVIDIA public order visibility and
  the existing CSP/TSMC layer.
- Determine whether project evidence changes or materially qualifies the cheaper financial-demand
  conclusion. Lifecycle movement alone is insufficient.
- Produce `CONTINUE`, `REVISE`, or `STOP` with explicit evidence and limitations.
- A `CONTINUE` result does not authorize Vertiv, new issuers, automation, production signals, or UI.

## Acceptance criteria

### Safe ingestion default

- `npm run ingest:all` cannot address production canonical paths.
- `npm run ingest:all -- --dry-run` remains non-mutating.
- Only `npm run ingest:all -- --promote` can select the existing production-root path.
- Conflicting and unknown flags fail closed before acquisition or writes.
- Dry-run still uses disposable canonical copies and independently verifies committed baseline and
  proposed state.
- Production observation files are byte-identical before and after all tests.
- Existing workflow behavior remains dry-run-only.
- Full `npm run verify:agent` and `git diff --check` pass in an environment with installed dependencies.

### Q4 fixed-cohort review

- All and only the frozen 15 cases have one recorded outcome.
- Every transition or adverse event has a Tier-1 primary source, observation/effective date with
  original precision, prior/new state, and explicit numeric boundary.
- No capacity aggregate or economically unsupported conversion is introduced.
- `NO_MATERIAL_TRANSITION` is not interpreted as weaker demand.
- The conclusion states whether project evidence adds information beyond NVIDIA/CSP/TSMC and does
  not infer a trend from the 7/7/1 Q3 stock.

## Required verification

```sh
node --test tests/ingestion/ingestionOrchestrator.test.mjs
npm run verify:agent
git diff --check
find data/ingestion/observations -maxdepth 1 -type f -print0 | sort -z | xargs -0 sha256sum
git status --short
```

Add the exact focused CLI test command once WP1 selects the test file. No command in this plan may
perform live ingestion or production promotion.

## Unresolved authorization gates

1. Approve this plan and authorize WP1-WP3 implementation.
2. Separately authorize the WP4 Q4 research run after 2026-09-30.
3. Separately authorize any production promotion.
4. Separately authorize commit and push after completed verification.

## Progress log

- 2026-09-03: Responsible human selected recommendations 2 and 3.
- 2026-09-03: Current code, tests, architecture, fixed-cohort baseline, branch, remote comparison, and
  worktree inspected. Confirmed unsafe no-flag aggregate-ingestion behavior and an environment-only
  baseline-test blocker caused by missing dependencies.
- 2026-09-03: Plan drafted; implementation not started.
- 2026-09-03: Responsible human approved the plan and authorized WP1-WP3. WP4-WP5 remain deferred
  pending separate Q4 authorization. Implementation started.
- 2026-09-03: WP1 completed. Added six focused CLI contract tests covering the no-flag default,
  explicit dry-run compatibility, exclusive `--promote`, fail-closed invalid arguments, validation
  before orchestration/verification, injected run-mode propagation, and real-process rejection before
  acquisition. All six pass.
- 2026-09-03: WP2 completed. `ingest-all.mjs` now defaults to dry-run and selects the existing
  production path only for an exclusive `--promote` argument. No ingestion or production write ran.
- 2026-09-03: WP3 documentation changes completed in the authorized README, architecture map, and
  monitoring contract. `git diff --check` and JavaScript syntax checks pass.
- 2026-09-03: Full verification remains incomplete. The complete ingestion test command reports
  173 passed and 3 failed; all three failures spawn the downstream verifier and fail because `vite`
  is unavailable. `npm ci` could not restore dependencies because this environment returned corrupt
  registry tarballs and could not use its default cache path. The partial ignored `node_modules`
  directory created by that attempt was moved to `/tmp/aim-r2-partial-node_modules-20260903`.
- 2026-09-03: Production observation hashes after tests exactly match the five pre-implementation
  hashes. WP3 and plan closeout remain pending a successful `npm run verify:agent` in an environment
  with locked dependencies available.
- 2026-09-04: Verification resumed at remote checkpoint
  `1c5818449d1623d0be7911d50603a1e2dff6e1cb`. The branch was already up to date at `0/0` against
  `origin/docs/ai-infrastructure-observability-roadmap`, and the worktree was clean before
  verification. `npm ci` installed the locked dependencies successfully with zero reported
  vulnerabilities. `npm run verify:agent` passed lint, build, all 176 ingestion tests, and all five
  downstream verifiers. `git diff --check` passed.
- 2026-09-04: Production observation files remained byte-identical to both the pre-implementation
  commit `0248102bc5076cfb21996717fea60316a023ef50` and the verified checkpoint. Recorded SHA-256 values:
  `amzn-ppe-purchases.json` `8d0a8f40d25957d2db191a0ee47cfa852b98e04f050edd77335d0b7e23ce5e5e`;
  `goog-annual-capex-guidance.json` `72125f9adcc86d34ed54574152be64bb12d4adfde4f5c41c98906119439664ae`;
  `meta-annual-capex-guidance.json` `870b8c3275f94100fa0b831fad2b8c5b36961559bb822a46fcd0a0c010ff63dc`;
  `msft-management-total-capex.json` `3e356ae3ca2d86781212f503af132cda698520297527d202e22e21d2d914c564`;
  and `tsm-monthly.json` `6d255d2ce7f3d0a944ee2b9e793d907e295b8a2c06270cbda500979c8fb3e898`.
  WP1-WP3 are complete and ready for the separately authorized final commit. WP4-WP5 remain
  unauthorized and unstarted.
- 2026-09-04: Responsible human authorized committing this WP1-WP3 closeout record and pushing it
  normally to `origin/docs/ai-infrastructure-observability-roadmap` for Draft PR #6. WP4-WP5,
  merge, deployment, live ingestion, and production promotion remain unauthorized.

## Decision log

- 2026-09-03: Separate the immediate CLI safety work from the future quarterly research gate so
  approval or completion of one cannot silently authorize the other.
- 2026-09-03: Use `--promote`, not an inverse opt-out name, to make production-path intent explicit.
- 2026-09-03: Keep `--dry-run` for compatibility while making it redundant with the new default.

## Closeout result

`READY_FOR_FINAL_COMMIT`: WP1-WP3 implementation, documentation, and mandatory verification are
complete at checkpoint `1c5818449d1623d0be7911d50603a1e2dff6e1cb`. No production data changed;
all five observation-file hashes match the pre-implementation baseline. WP4-WP5 remain unauthorized
and unstarted. Commit and normal push of this closeout record are authorized; merge and deployment
remain unauthorized.
