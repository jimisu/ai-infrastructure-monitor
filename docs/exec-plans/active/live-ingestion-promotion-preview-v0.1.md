# Live ingestion promotion preview v0.1

## Plan metadata

- Status: `BLOCKED_PENDING_HUMAN_APPROVAL`
- Responsible human: `jimisu` (repository owner and requesting human)
- Approval: on 2026-09-04, the responsible human authorized drafting this plan and executing WP1-WP3.
- On 2026-09-04, the responsible human separately authorized committing and normally pushing only
  this plan checkpoint. Production promotion, WP4-WP5, PR creation or update, deployment, live
  ingestion, and every non-plan modification remain unauthorized.

## Objective

Acquire current evidence through the five existing production issuer pipelines into a disposable
canonical root, verify both committed and proposed states, and produce a fact-by-fact review of new
facts, revisions, and provenance before any production promotion decision.

This preview is evidence collection only. It must not modify production observations, raw snapshots,
manifests, providers, signals, or the deployed site.

## Source specifications

- Repository rules: [`../../../AGENTS.md`](../../../AGENTS.md)
- Execution-plan policy: [`../README.md`](../README.md)
- Architecture map: [`../../architecture/README.md`](../../architecture/README.md)
- Monitoring contract: [`../../ingestion-monitoring.md`](../../ingestion-monitoring.md)
- Safe-default plan: [`safe-ingestion-default-and-fixed-cohort-q4-v0.1.md`](safe-ingestion-default-and-fixed-cohort-q4-v0.1.md)
- Aggregate entry point: [`../../../scripts/ingestion/ingest-all.mjs`](../../../scripts/ingestion/ingest-all.mjs)
- Orchestrator: [`../../../scripts/ingestion/ingestion-orchestrator.mjs`](../../../scripts/ingestion/ingestion-orchestrator.mjs)

## Baseline checkpoint

- Repository: `jimisu/ai-infrastructure-monitor`
- Isolated branch: `ops/live-ingestion-preview-20260904`
- HEAD and `origin/main`: `c5dfa6dd4e180d4d9d4c550e64caadde3a69efcf`
- Ahead/behind: `0/0`
- Worktree: clean before this plan was created
- Production observation files: five tracked canonical JSON files under
  `data/ingestion/observations/`
- Production hashes before any live acquisition:
  - `amzn-ppe-purchases.json`: `8d0a8f40d25957d2db191a0ee47cfa852b98e04f050edd77335d0b7e23ce5e5e`
  - `goog-annual-capex-guidance.json`: `72125f9adcc86d34ed54574152be64bb12d4adfde4f5c41c98906119439664ae`
  - `meta-annual-capex-guidance.json`: `870b8c3275f94100fa0b831fad2b8c5b36961559bb822a46fcd0a0c010ff63dc`
  - `msft-management-total-capex.json`: `3e356ae3ca2d86781212f503af132cda698520297527d202e22e21d2d914c564`
  - `tsm-monthly.json`: `6d255d2ce7f3d0a944ee2b9e793d907e295b8a2c06270cbda500979c8fb3e898`
- Required SEC identification: `SEC_USER_AGENT` is absent from this execution environment. The code
  requires an application identity plus a monitored email address and fails closed when it is absent.

## Authorized scope

WP1-WP3 may:

- create and update this plan;
- install locked dependencies and run non-mutating repository verification;
- create one task-specific temporary directory outside the repository;
- copy the five production observation files and the required frozen GOOG source records into that
  temporary directory;
- perform live acquisition only through the existing TSMC, META, MSFT, GOOG, and AMZN ingestion
  implementations, with every write redirected to the temporary directory;
- run baseline and proposed-state downstream verification;
- create `docs/research/ingestion-promotion/2026-09-04-live-preview.md` containing the reviewed delta;
  and
- retain no sensitive `SEC_USER_AGENT` value in output, logs, plan text, or repository files.

Ignored acquisition artifacts under the temporary directory are diagnostic evidence only. They are
not production state and are not authorized for commit or promotion.

## Forbidden scope

- Do not invoke `npm run ingest:all -- --promote` against the repository.
- Do not write under production `data/ingestion/observations`, `raw`, or `manifests`.
- Do not change parsers, source registries, schemas, identities, provenance rules, providers,
  signals, thresholds, scoring, UI, workflows, or deployment.
- Do not infer or supply a personal contact email for `SEC_USER_AGENT`.
- Do not bypass a failed source, replace an unavailable official document, carry a fact forward, or
  relabel `MISSING` as `NOT_DISCLOSED`.
- Do not open or update a PR, merge, deploy, run live ingestion, or promote production canonical
  data. The only delivery exception is the separately authorized commit and normal push of this plan
  file.
- Do not start WP4-WP5 from a healthy preview alone.

## Rollback-safe work packages

### WP1 — Baseline and safeguards

1. Confirm exact `origin/main`, clean isolated worktree, and `0/0` relationship.
2. Record SHA-256 for every production observation.
3. Install locked dependencies and run `npm run verify:agent` and `git diff --check`.
4. Confirm `SEC_USER_AGENT` presence without printing its value.

Rollback boundary: no live request or canonical write; only this plan may be modified.

### WP2 — Live acquisition into disposable state

1. Start only after a valid task-scoped `SEC_USER_AGENT` is present.
2. Create one explicit temporary root with `mktemp -d`.
3. Seed the five observations plus the frozen GOOG source records required by the existing pipeline.
4. Run the five existing issuer pipelines in their fixed production order with `--output-root`
   pointing only to the temporary root and a shared retrieval timestamp.
5. Stop on any issuer failure for promotion purposes, while retaining completed issuer evidence for
   diagnosis. Never retry outside the existing bounded HTTP policy.

Rollback boundary: delete the explicit temporary root after the report is complete; production is
unchanged throughout.

### WP3 — Proposed-state review and stop

1. Verify committed baseline and the disposable proposed canonical root independently.
2. Diff every observation by logical fact, value identity, source record, period, unit, definition,
   accession/version, evidence URL, snapshot hash, and retrieval mode.
3. Classify every difference as `NEW_FACT`, `REVISION`, `PROVENANCE_REASSERTION`, `UNCHANGED`, or
   `FAILED_SOURCE` using current code semantics.
4. Write the review report with exact issuer totals, source failures, warnings, downstream results,
   production before/after hashes, and the temporary-root disposal status.
5. Set this plan to `BLOCKED_PENDING_HUMAN_APPROVAL` and stop. The report must not recommend
   promotion when any source or proposed-state verification failed.

Rollback boundary: report-only repository changes; no production mutation.

### WP4 — Production promotion (not authorized)

- Re-establish main and canonical hashes immediately before promotion.
- Promote only the exact reviewed delta using the existing explicit production path.
- Abort if live evidence differs from the approved preview.

### WP5 — Post-promotion verification and delivery (not authorized)

- Run full verification, compare canonical hashes and reviewed facts, and record rollback evidence.
- Commit, push, deploy, and public verification each remain separate authorization boundaries.

## Acceptance criteria

### WP1-WP3

- Baseline `npm run verify:agent` and `git diff --check` pass.
- All live writes are confined to one explicit temporary root.
- The five production observation hashes are identical before and after acquisition and review.
- Each existing issuer is attempted exactly once through its current production implementation.
- Baseline and proposed-state downstream verification are recorded separately.
- Every proposed change has exact economic identity and immutable source provenance.
- Any missing SEC identification, source failure, invalid provenance, parser ambiguity, or failed
  downstream check blocks promotion.
- The report explicitly ends at the human approval gate; WP4-WP5 remain unstarted.

## Negative cases

- A missing or malformed `SEC_USER_AGENT` prevents WP2 from starting.
- A temporary path that resolves inside the repository is rejected.
- A production observation hash change at any point stops execution and is reported as a blocker.
- A partial issuer run cannot be described as healthy or promotion-ready.
- A new filing whose metric definition or period is incompatible is not promoted or normalized into
  an existing fact.
- Equivalent values from a different source version remain provenance reassertions rather than new
  economic facts.
- The disposable root is not treated as production merely because the production ingestion code ran
  against it.

## Required verification

```sh
npm ci
npm run verify:agent
git diff --check
find data/ingestion/observations -maxdepth 1 -type f -print0 | sort -z | xargs -0 sha256sum
git diff --exit-code -- data/ingestion/observations
git status --short
```

WP2 must additionally record the explicit disposable root, issuer command exit statuses, disposable
observation hashes, baseline verifier result, proposed-state verifier result, and a structured diff.
The `SEC_USER_AGENT` value itself must never be printed.

## Human decisions

Resolved:

- WP1-WP3 are approved for execution.
- Only disposable live acquisition is allowed.
- The actual production delta requires a new human decision after review.

Blocked:

- A valid task-scoped `SEC_USER_AGENT` is not available in this environment. The responsible human
  must arrange it through a secure environment configuration or run the existing GitHub Actions
  `Ingestion Monitor` with its configured secret and provide the resulting report/artifact.

## Progress log

- 2026-09-04: Responsible human authorized plan drafting and WP1-WP3 only.
- 2026-09-04: Isolated worktree created from merged `origin/main` at `c5dfa6d`; initial worktree was
  clean and upstream comparison was `0/0`.
- 2026-09-04: Recorded all five production observation hashes. They match the previously verified
  pre-promotion baseline.
- 2026-09-04: Preflight found `SEC_USER_AGENT` absent. No live request was made and WP2 did not start.
- 2026-09-04: WP1 completed. `npm ci` installed 30 locked packages using a task-specific writable
  cache. `npm run verify:agent` passed lint, build, all 176 ingestion tests, and all five downstream
  verifiers. `git diff --check` passed, the production observation diff remained empty, and all five
  production hashes remained exactly equal to the recorded baseline.
- 2026-09-04: Responsible human authorized a plan-only checkpoint commit and normal push. Live
  ingestion, production promotion, all non-plan modifications, PR creation or update, merge, and
  deployment remain unauthorized.

## Decision log

- Preserve the proposed canonical root long enough for fact-by-fact review rather than relying only
  on aggregate counts from `ingest:all`, whose internal dry-run root is deleted at completion.
- Run existing issuer implementations against a task-specific disposable output root; never modify
  production code merely to preserve preview artifacts.
- Treat SEC identification as a mandatory acquisition contract, not a value to infer from repository
  ownership or conversation history.

## Closeout result

`BLOCKED_PENDING_HUMAN_APPROVAL`: WP1 is complete and healthy. WP2-WP3 are blocked before the first
live request because `SEC_USER_AGENT` is unavailable, so no proposed-delta report exists yet. WP4-WP5,
production promotion, live ingestion, PR creation or update, merge, and deployment are unstarted and
unauthorized. This plan-only checkpoint is authorized for commit and normal push; it does not expand
the execution scope.
