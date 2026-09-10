# Package reviewed-state promotion clean branch v0.1

## Status

`APPROVED`

## Responsible Human

`jimisu`

## Purpose

Prepare a rollback-safe delivery path for isolating the reviewed-state promotion work onto a new
local branch based directly on latest `origin/main`, without carrying the separate verified-timestamp
feature unless a concrete dependency is proven during packaging.

This plan is packaging and delivery planning only until human approval. After 2026-09-10 operator
approval, WP1-WP5 are authorized on a new local branch from current `origin/main`. This approval
does not authorize history rewriting of existing branches, push, PR, merge, deployment, live
ingestion, production prepare/apply, or canonical promotion.

After the later 2026-09-10 symlink-boundary amendment, the responsible human authorized WP6
implementation and the normal post-role delivery path for this existing branch and Draft PR #12:
after Specifier, Coder, Refactorer, and Architect pass the required local checks, the resulting
descendant commit may be pushed to the existing remote branch and the existing Draft PR description
may be updated. Force push, a new PR, marking the PR ready, merge, deployment, live ingestion,
production prepare/apply, and canonical promotion remain forbidden.

## Current Baseline Checkpoint

- Date checked: 2026-09-10.
- Branch: `main`.
- HEAD: `e87e322035ab0e1eef8ede27bb02cd9bc47a9502`.
- Remote: `origin https://github.com/jimisu/ai-infrastructure-monitor.git`.
- Latest `origin/main`: `a4b5fa74111b9970c8a348d7e6d3feaeaaf0dfdd`.
- Ahead/behind after fetch: `origin/main...main` is `0 13`.
- Local backup branch created before analysis:
  `backup/package-reviewed-state-promotion-combined-main` at
  `e87e322035ab0e1eef8ede27bb02cd9bc47a9502`.
- Worktree state before this draft: tracked files clean; expected protected untracked SwarmForge
  artifacts present: `close-swarm`, `swarm`, `swarmforge/`,
  `tasks/package-reviewed-state-promotion-clean-branch.md`, and
  `tasks/port-reviewed-state-promotion-to-current-main.md`.
- `data/ingestion` diff after verification: empty.
- `data/ingestion/observations` aggregate SHA-256 over tracked files:
  `c39f861d496cb38e2cdeba980f4595773c02d83903640793bbcf0deef580fec5`.
- Local optional dependency repair: `npm ci --cache ./tmp/npm-cache` completed successfully after
  `npm run verify:agent` initially failed because `oxlint` was absent from `node_modules`.
- Baseline verification after local dependency repair: `npm run verify:agent` passed on the current
  combined `main`; lint reported two existing Fast Refresh warnings in `src/App.tsx`; build passed;
  presentation tests passed 19/19; property tests passed 12/12; acceptance tests passed 3/3;
  ingestion tests passed 196/196; issuer downstream verifiers passed.

## Source Commits

Local `main` contains these 13 commits above latest `origin/main`:

| Commit | Subject | Packaging classification | Dependency finding |
|---|---|---:|---|
| `a9ac6d0` | Specify verified timestamp behavior | `DO_NOT_PICK` | Separate verified-timestamp specification. Not required by reviewed-state promotion. |
| `d547158` | Show last verified timestamp from verification metadata | `DO_NOT_PICK` | Presentation behavior only. Not required by reviewed-state promotion. |
| `c84b542` | Render last verified timestamp on the summary page header | `DO_NOT_PICK` | Presentation behavior only. Not required by reviewed-state promotion. |
| `57bd922` | Keep last-verified display as one parse-and-format job | `DO_NOT_PICK` | Refactors verified-timestamp presentation only. Not required by reviewed-state promotion. |
| `b41e25c` | Prove evidence dates cannot become the UTC display | `DO_NOT_PICK` | Verified-timestamp tests only. Not required by reviewed-state promotion. |
| `635dd3a` | Record verified timestamp mutation manifest | `DO_NOT_PICK` | Verified-timestamp manifest only. Not required by reviewed-state promotion. |
| `0214bbf` | Approve reviewed-state promotion plan | `DO_NOT_PICK` | Superseded by clean-branch packaging plan. Use as historical context only. |
| `0cd0609` | Merge specifier `0214bbf629` | `DO_NOT_PICK` | Merge commit joins verified-timestamp and reviewed-state plan histories; cherry-picking it would reintroduce the excluded stack. |
| `f331e11` | Port reviewed-state promotion onto current main | `PICK_WITH_ADAPTATION` | First implementation commit. Replay onto `origin/main` with package-script and current-main adaptations. |
| `9a76b9c` | Cover missing files and duplicate TSMC promotion failures | `PICK_WITH_ADAPTATION` | Depends on `f331e11` tests and transaction API. |
| `2f1571a` | Separate the promotion CLI from the reviewed-state transaction | `PICK_WITH_ADAPTATION` | Depends on `f331e11` and `9a76b9c`; adds property coverage and requires only the generic property helper, not verified-timestamp behavior. |
| `fec9381` | Keep promotion fail-closed errors as coded Error values | `PICK_WITH_ADAPTATION` | Depends on the split transaction module from `2f1571a`. |
| `e87e322` | Record soft acceptance mutation manifest | `DO_NOT_PICK` | Touches only `features/verified-timestamp.feature`. Not required by reviewed-state promotion. |

## Scope

- Create a new local delivery branch from latest `origin/main`.
- Replay only reviewed-state promotion behavior and its direct support files.
- Preserve fail-closed behavior, immutable provenance boundaries, deterministic bundle identity,
  deterministic observation/record/signal IDs, staging verification, rollback, and transaction tests.
- Harden reviewed-state promotion path validation so existing source and production roots are
  compared by canonical real paths, output destinations are checked through their existing canonical
  parent paths before creation, and symlink aliases cannot cause rollback, delta, source, or
  production operations to write through an apparently safe lexical path into another protected root.
- Keep the current combined local `main` recoverable through the backup branch named above.
- Keep `data/ingestion` unchanged.

## Forbidden Scope

- No verified-timestamp UI, feature file, acceptance runtime, acceptance script, or presentation tests
  unless a reviewed-state promotion dependency is proven and recorded as a human decision.
- No history rewriting of existing branches.
- No deletion or modification of `close-swarm`, `swarm`, `swarmforge/`, or untracked task files.
- No push or PR update before all configured roles pass; no force push, new PR, marking PR ready,
  merge, deployment, live ingestion, production prepare/apply, `npm run ingest:all -- --promote`,
  canonical promotion, or `data/ingestion` modification.
- No schema, logical identity, observation ID, record ID, signal ID, provenance, evidence eligibility,
  financial metric definition, signal semantic, threshold, confidence, or scoring change.
- No broader path-policy redesign beyond symlink-safe enforcement for reviewed-state promotion
  transaction inputs and output destinations.
- Stop if clean isolation requires semantic redesign or production data changes.

## Authorized Future Paths

Expected reviewed-state delivery branch paths:

- `package.json`.
- `scripts/ingestion/reviewed-state-promotion.mjs`.
- `scripts/ingestion/reviewed-state-transaction.mjs`.
- `scripts/ingestion/verify-production-downstream.mjs`.
- `src/ingestion/tsmMonthlyIngestionVerification.ts`.
- `src/ingestion/amznPpeIngestionVerification.ts`.
- `tests/ingestion/proposedStateResolver.test.mjs`.
- `tests/ingestion/reviewedStatePromotion.test.mjs`.
- `tests/properties/forAll.mjs`, as a generic local property-test helper only.
- `tests/properties/reviewedStatePromotion.property.test.mjs`.
- `docs/architecture/README.md`, only for verified architecture-map updates.
- `docs/exec-plans/active/package-reviewed-state-promotion-clean-branch-v0.1.md`.

Any additional path is a plan amendment requiring human review before packaging continues.

## Packaging Work Packages

### WP1 - Branch from remote baseline

Create a new local branch directly at `origin/main`. Confirm branch, HEAD, upstream/remotes, tracked
cleanliness, protected untracked artifacts, `data/ingestion` diff, and production observation hashes.

Rollback boundary: delete only the new local delivery branch if no approved implementation commit has
been made. Do not rewrite `main` or the backup branch.

### WP2 - Replay reviewed-state implementation

Replay `f331e11`, `9a76b9c`, `2f1571a`, and `fec9381` in order with `--no-commit` or equivalent
staging review. Do not cherry-pick merge commit `0cd0609`. Exclude all verified-timestamp paths.

Adaptations expected:

- Keep `verify:agent` presentation tests from `origin/main`.
- Add only reviewed-state promotion scripts and tests.
- Add property-test support only if reviewed-state property tests remain in scope.
- Do not add `accept` or acceptance runtime files unless separately approved.

Rollback boundary: abort or reset only the new delivery branch before commit if adaptation pulls
verified-timestamp behavior or unrelated files.

### WP3 - Preserve production-contract staging behavior

Keep the reviewed transaction's production-contract staging path:
`productionContractArgs(<staging-root>)` must call `verify-production-downstream.mjs --canonical-root
<staging-root>/observations`. `verify-production-downstream.mjs` must use canonical-root resolver
mode whenever `--canonical-root` is supplied.

Rollback boundary: revert verifier and transaction changes on the delivery branch.

### WP4 - Preserve expandable issuer verification

Carry only the expandable TSMC and Amazon production-verification invariants required by reviewed
promotion staging:

- TSMC manual-overlap floor, legacy ID compatibility, duplicate rejection, latest-six-month trend
  selection, and deterministic derivation.
- Amazon manual-overlap floor, no double counting, latest same-quarter TTM comparator, duplicate and
  malformed canonical rejection, and deterministic derivation.

Rollback boundary: revert issuer verifier changes and dependent resolver tests on the delivery
branch.

### WP5 - Verify and prove production data unchanged

Run the full required verification after local optional dependencies are installed. Record the exact
commands and results, including production observation hashes before and after. Confirm `data/ingestion`
has no diff.

Rollback boundary: stop without push, PR, merge, production prepare/apply, or canonical promotion if
verification fails or production data changes.

### WP6 - Harden symlink boundary validation

Approved amendment on 2026-09-10: close reviewed-state promotion path-safety gaps caused by lexical
`path.resolve` checks when a caller supplies a symlinked root or a symlinked output parent.

Behavioral contract:

- `prepareReviewedStatePromotion` and `applyReviewedStatePromotion` must canonicalize existing
  source and production roots to their filesystem real paths before root-overlap comparison and before
  persisting those roots into a promotion bundle.
- Output destinations whose final path must not already exist, including rollback root and delta
  output path, must be canonicalized by resolving the nearest existing parent real path and appending
  only the non-existing suffix.
- Source and production roots that are disjoint lexically but overlap through a symlink alias must fail
  closed with the existing coded `OVERLAPPING_ROOTS` error.
- Rollback or delta output destinations that appear outside source or production lexically but resolve
  through a symlinked parent inside source or production must fail closed with the existing coded
  `UNSAFE_OUTPUT_PATH` error.
- Ordinary non-overlapping temporary source, production, rollback, delta, bundle, review, and run
  paths must remain valid.
- The fix must not modify production canonical data, live ingestion behavior, production
  prepare/apply authorization, metric semantics, signal semantics, identity, provenance, thresholds,
  scoring, or evidence eligibility.

Required tests:

- A source-root symlink alias that targets production is rejected as overlapping production.
- A delta-output parent symlink that resolves inside production is rejected.
- A rollback-root parent symlink that resolves inside production is rejected.
- Ordinary non-overlapping temporary paths still prepare and apply successfully.

Rollback boundary: revert only the symlink-boundary transaction changes and their tests if this
requires scope outside the approved files or changes reviewed-state promotion semantics beyond
path-safety enforcement.

## Acceptance Criteria

- New delivery branch starts from latest `origin/main`, not current combined `main`.
- Backup branch `backup/package-reviewed-state-promotion-combined-main` still points at the original
  combined `main` commit.
- No verified-timestamp behavior is present on the delivery branch unless recorded as a required
  reviewed-state prerequisite.
- `npm run verify:agent` passes after local dependency installation.
- `git diff --check` passes.
- `git diff --exit-code -- data/ingestion` passes.
- Production observation aggregate hash before and after packaging is unchanged.
- Reviewed-state transaction tests and property tests pass.
- Symlink-boundary tests reject source/production aliases and output parents resolving into protected
  roots while preserving ordinary non-overlapping temporary paths.
- Presentation tests remain part of `verify:agent`.
- No live ingestion, production prepare/apply, canonical promotion, force push, new PR, marking PR
  ready, merge, deployment, or history rewrite occurs.

## Requirement Traceability

| Inbound requirement | Evidence or planned control |
|---|---|
| Preserve current combined main with a local backup branch first | Completed before analysis: `backup/package-reviewed-state-promotion-combined-main` points at `e87e322035ab0e1eef8ede27bb02cd9bc47a9502`. |
| Do not delete or modify protected untracked files | Worktree audit still shows `close-swarm`, `swarm`, `swarmforge/`, and task files as untracked; this plan does not stage or edit them. |
| Determine commit-by-commit dependencies before cherry-picking | `Source Commits` classifies all 13 local-ahead commits and identifies `0cd0609` as the merge commit that must not be cherry-picked. |
| Do not include verified-timestamp behavior unless proven required | Verified-timestamp commits `a9ac6d0` through `635dd3a` and `e87e322` are `DO_NOT_PICK`; acceptance runtime and verified-timestamp feature files are excluded from future scope. |
| Preserve fail-closed behavior, provenance, deterministic IDs, rollback, and transaction tests | `Scope`, `Packaging Work Packages`, `Acceptance Criteria`, and `Required Negative Cases` require carrying the transaction, staging, rollback, provenance, deterministic bundle/ID, and focused negative-test contracts. |
| Run `npm run verify:agent` after fixing local optional dependency installation | Completed on combined `main`: initial run failed at missing `oxlint`; `npm ci --cache ./tmp/npm-cache` repaired local dependencies; rerun passed. |
| Confirm `data/ingestion` remains unchanged | Completed: `git diff --exit-code -- data/ingestion` passed and aggregate observation hash remained `c39f861d496cb38e2cdeba980f4595773c02d83903640793bbcf0deef580fec5`. |
| Stop if isolation requires semantic redesign or production data changes | `Forbidden Scope`, `Acceptance Criteria`, and `Unresolved Decisions` make semantic redesign, protected-domain changes, and production-data changes stop conditions. |
| Limit this turn to read-only inspection, plan creation, and backup branch creation | This commit adds only this DRAFT execution plan. No implementation file or production data file is modified. |
| Do not push, PR, merge, deploy, run live ingestion, production prepare/apply, or canonical promotion | No such command was run during clean-branch packaging. The symlink-boundary amendment authorizes only a normal push to the existing branch and existing Draft PR #12 description update after all roles pass; force push, new PR, ready-for-review, merge, deploy, live ingestion, production prepare/apply, and canonical promotion remain forbidden. |
| Harden reviewed-state promotion against symlinked boundary aliases | WP6 requires canonical real-path checks for existing roots and safe canonicalization for not-yet-existing output destinations, with negative tests for source-root aliases and output parent aliases into production. |

## Required Negative Cases

- Bundle hash drift.
- Review report drift.
- Run report drift.
- Production baseline drift.
- Source drift after prepare.
- Production drift after prepare.
- Manifest/raw hash mismatch.
- Raw byte-length mismatch.
- Unsafe paths and path traversal.
- Symlink escape.
- Unexpected files.
- Missing source or production observation files.
- Duplicate snapshot IDs.
- Missing baseline records.
- Mutated baseline records.
- Non-LIVE backing for new records.
- Non-observation destination collision.
- Staged production-contract failure.
- Post-apply verification failure with full rollback.
- Incomplete TSMC metric/comparator pair.
- Duplicate TSMC monthly fact.
- Incomplete Amazon same-quarter TTM pair.
- CLI missing explicit command or production path.
- Source-root symlink alias overlapping production.
- Delta-output parent symlink resolving into production.
- Rollback-root parent symlink resolving into production.
- Ordinary non-overlapping temporary output paths remain valid.

## Verification Commands

Required before reporting the clean branch ready:

```sh
npm ci --cache ./tmp/npm-cache
npm run verify:agent
git diff --check
git diff --exit-code -- data/ingestion
git status --short
```

Production hash checks before and after packaging:

```sh
git ls-files data/ingestion | xargs shasum -a 256
git ls-files data/ingestion | xargs shasum -a 256 | shasum -a 256
```

Focused checks during packaging:

```sh
node --test tests/ingestion/reviewedStatePromotion.test.mjs
node --test tests/ingestion/proposedStateResolver.test.mjs
node --test tests/properties/reviewedStatePromotion.property.test.mjs
npm run verify:ingestion
node --test tests/presentation/*.test.mjs
```

## Production-State Hash Checks

Current combined-main checkpoint:

```text
c39f861d496cb38e2cdeba980f4595773c02d83903640793bbcf0deef580fec5  -
```

The clean branch must record the same aggregate hash before and after packaging, and
`git diff --exit-code -- data/ingestion` must remain empty.

## Unresolved Decisions

- Human approval is required before creating implementation commits on the new clean branch.
- Human approval is required before any push, PR, merge, deployment, live ingestion, production
  prepare/apply, or canonical promotion.
- If reviewed-state promotion cannot be isolated without verified-timestamp behavior, semantic
  redesign, or production data changes, stop and request a human decision.
- If any schema, identity, provenance, evidence eligibility, metric definition, signal semantic,
  threshold, confidence, or scoring change appears necessary, stop and request a human decision.

## Progress Log

- 2026-09-10: Operator approved this DRAFT plan for Coder WP1-WP5, authorized recording status
  `APPROVED`, and authorized local commits on a new isolated branch from current verified
  `origin/main`. Combined-main backup remains `e87e322`. Verified-timestamp commits, merge
  `0cd0609`, and manifest `e87e322` stay excluded. Push, PR, merge, deployment, live ingestion,
  production prepare/apply, and canonical promotion remain unauthorized.
- 2026-09-10: Created local branch `package/reviewed-state-promotion-clean-branch` at
  `origin/main` (`a4b5fa7`). Replayed `f331e11`, `9a76b9c`, `2f1571a`, and `fec9381` by adapting
  their end-state onto that base. Kept origin/main presentation tests in `verify:agent`; added
  `verify:properties` for reviewed-state property tests; did not add acceptance runtime or
  verified-timestamp files. `npm run verify:agent` passed (13 presentation, 7 property, 196
  ingestion). `git diff --check` passed. `git diff --exit-code -- data/ingestion` passed. Aggregate
  `data/ingestion` hash remained
  `c39f861d496cb38e2cdeba980f4595773c02d83903640793bbcf0deef580fec5`. Backup branch still
  `e87e322`. No push, PR, merge, live ingestion, or production prepare/apply.
- 2026-09-10: Created local backup branch
  `backup/package-reviewed-state-promotion-combined-main` at
  `e87e322035ab0e1eef8ede27bb02cd9bc47a9502` before analysis.
- 2026-09-10: Fetched `origin` and confirmed latest `origin/main` is
  `a4b5fa74111b9970c8a348d7e6d3feaeaaf0dfdd`; current local `main` is 13 commits ahead.
- 2026-09-10: Classified the first six commits and `e87e322` as verified-timestamp work to exclude;
  classified merge commit `0cd0609` as not cherry-pickable for clean packaging.
- 2026-09-10: Ran `npm ci --cache ./tmp/npm-cache` to repair local dependency installation after
  `oxlint` was missing from `node_modules`.
- 2026-09-10: Ran `npm run verify:agent`; it passed on the combined tree. Confirmed
  `git diff --exit-code -- data/ingestion` was empty and production observation aggregate hash was
  unchanged.
- 2026-09-10: Drafted this clean-branch packaging plan and added requirement-to-evidence
  traceability during handoff retry audit. No implementation files or production data were modified.
- 2026-09-10: Operator approved the narrow symlink-boundary hardening amendment for reviewed-state
  promotion. Added WP6 and acceptance criteria requiring canonical real-path root comparison, safe
  canonicalization for not-yet-existing outputs through existing parents, existing coded Error values,
  and negative coverage for symlink aliases into protected roots.
- 2026-09-10: Retry audit found the earlier clean-branch push/PR prohibition conflicted with the new
  operator-approved post-role delivery path. Clarified that after all configured roles pass, the
  descendant commit may be pushed to the existing remote branch and existing Draft PR #12 may be
  updated; force push, new PR, marking ready, merge, deployment, live ingestion, production
  prepare/apply, and canonical promotion remain forbidden.

## Decision Log

- 2026-09-10: Operator chose packaging path B and authorized WP1-WP5 on a new local branch from
  `origin/main`, with local git_handoff continuing through Coder, Refactorer, and Architect without
  another routine approval.
- 2026-09-10: Use a backup branch instead of rewriting current `main`, because the task explicitly
  forbids history rewriting and requires preserving the combined state.
- 2026-09-10: Do not cherry-pick `0cd0609`, because it is a merge commit whose first parent is the
  verified-timestamp stack and whose second parent is the plan-only reviewed-state commit.
- 2026-09-10: Treat `tests/properties/forAll.mjs` as a portable generic test helper only if needed by
  reviewed-state property tests; this does not justify importing verified-timestamp properties.
- 2026-09-10: Exclude acceptance runtime and `features/verified-timestamp.feature` because reviewed
  promotion has no proven runtime dependency on verified-timestamp acceptance behavior.
- 2026-09-10: Do not add Gherkin acceptance files for this amendment because the approved file list is
  limited to the reviewed-state transaction, its tests, the active plan, and architecture notes if
  verified behavior changes.
- 2026-09-10: Treat the existing Draft PR #12 update as delivery metadata, not production promotion;
  the project still requires the configured role chain and local verification before any push.

## Closeout Placeholder

To be completed after the configured role chain and symlink-boundary amendment implementation. Record
final branch, commits, files changed, verification output, production hash comparison,
production/provenance impact, deferred work, existing PR #12 update status, and final outcome. Do not
mark this plan `COMPLETED` until the clean branch exists and acceptance criteria pass.
