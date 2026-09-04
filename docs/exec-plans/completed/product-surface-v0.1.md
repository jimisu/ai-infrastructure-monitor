# Product surface v0.1

## Plan metadata

- Status: `COMPLETED`
- Responsible human: `jimisu` (repository owner and requesting human)
- Approval: explicitly granted on 2026-09-04 to draft and execute this plan.
- Commit, push, merge, deployment, live ingestion, and production promotion remain unauthorized.

## Objective

Make the existing production dashboard easier to recognize and open from GitHub without changing
product behavior or evidence semantics:

1. capture one real screenshot of the deployed production page;
2. show it near the top of `README.md` with the verified live URL; and
3. set concise GitHub repository description, topics, and homepage metadata if the connected GitHub
   capability supports those writes.

## Baseline checkpoint

- Detached worktree HEAD: `f0e4ee545c2e653b0983aac279346b451042e867`
- Source branch: `origin/docs/ai-infrastructure-observability-roadmap`
- Worktree: clean before plan creation
- Production URL: `https://jimisu.github.io/ai-infrastructure-monitor/`
- Browser verification on 2026-09-04: page loaded with title `AI Infrastructure Monitor`; visible
  production state was `POSITIVE / CONFIRMED / HIGH CONFIDENCE`, coverage `4 / 4`, positive breadth
  `4 / 4`, and data published through `Jul 30, 2026`.
- Repository metadata before execution: description `null`, homepage `null`, topics empty.
- Production canonical data: out of scope and unchanged.

## Scope

Authorized repository paths:

- `README.md`
- `docs/assets/ai-infrastructure-monitor-production-2026-09-04.jpg`
- this plan

Authorized external metadata for `jimisu/ai-infrastructure-monitor`:

- Description: `Evidence-backed monitor for AI infrastructure demand across hyperscaler CapEx and TSMC supply signals.`
- Homepage: `https://jimisu.github.io/ai-infrastructure-monitor/`
- Topics: `ai-infrastructure`, `capex`, `tsmc`, `hyperscaler`, `sec-filings`, `dashboard`

## Forbidden scope

- No UI, CSS, React, signal, scoring, threshold, schema, identity, provenance, canonical data,
  ingestion, workflow, deployment, or package metadata changes.
- No synthetic, local, preview, or mock screenshot.
- No screenshot editing that changes the displayed production state.
- No new machine-readable output.
- No commit, push, PR state change, merge, deployment, live ingestion, or production promotion.

## Work packages

### WP1 — Verify and capture production

- Open the exact public URL in a real browser.
- Confirm title, visible state, coverage, evidence badge, and data date.
- Capture the current viewport once and save the same bytes as the README asset.

### WP2 — README surface

- Add the screenshot near the top of `README.md`.
- Add a direct live-dashboard link.
- Preserve the existing evidence boundary and Q3 Reality Check framing.

### WP3 — Repository metadata

- Update only the approved description, homepage, and topics through the connected GitHub capability.
- If that capability does not expose repository-metadata writes, record the blocker and do not use
  browser UI as a fallback.

### WP4 — Verification and handoff

- Confirm the image exists and is decodable.
- Check the README image path and live link.
- Run `git diff --check` and compare protected-path status.
- Report any metadata capability blocker and leave all files uncommitted.

## Acceptance criteria

- Screenshot bytes came from the verified production URL and decode as a JPEG.
- README renders a repository-relative screenshot and links to the exact verified production URL.
- Existing product/evidence wording remains materially unchanged.
- Repository metadata equals the approved values, or the unavailable write capability is explicitly
  recorded without browser fallback.
- No forbidden path changed.
- `git diff --check` passes and the worktree contains only the three authorized paths.

## Verification

```sh
file docs/assets/ai-infrastructure-monitor-production-2026-09-04.jpg
git diff --check
git status --short
git diff --name-only
git diff -- data/ingestion src .github package.json
```

No full code verification is required because no executable or production-data file is authorized
to change.

## Progress log

- 2026-09-04: Plan drafting and execution explicitly authorized.
- 2026-09-04: Clean `f0e4ee5` baseline established in an isolated detached worktree.
- 2026-09-04: Production page loaded successfully in the cloud browser and its visible state was
  verified before capture.
- 2026-09-04: Captured the production viewport and preserved the exact JPEG bytes at
  `docs/assets/ai-infrastructure-monitor-production-2026-09-04.jpg`; SHA-256 is
  `444526885286488c0d737978b133a7d4205d417a14c0568cb666224cfe01fada`.
- 2026-09-04: Added the verified live-dashboard link and repository-relative production screenshot
  near the top of `README.md` without changing its evidence-boundary language.
- 2026-09-04: Repository metadata write was blocked: the connected GitHub capability does not
  expose repository-settings writes, `gh` is unavailable, and no task-scoped GitHub token is
  configured. Per the approved boundary, browser UI was not used as a fallback.
- 2026-09-04: `git diff --check` passed, the protected-path diff was empty, and the worktree
  contained only the three authorized paths.
- 2026-09-04: The responsible human subsequently authorized testing and a local commit, but not a
  push. `npm ci` passed with an isolated writable cache. `npm run verify:agent` then passed lint,
  build, all `176/176` ingestion tests, and all five downstream verifiers.

## Decision log

- Use the first production viewport rather than a full-page evidence-trace image so GitHub readers
  see the current conclusion, coverage, and publication date without losing readability.
- Keep repository metadata descriptive rather than promotional; do not claim AI-only CapEx or
  investment value.

## Closeout result

`COMPLETED_WITH_EXTERNAL_METADATA_BLOCKED`

- WP1 and WP2 completed: the live production surface was verified, captured, and added to the
  README with its public URL.
- WP3 could not be applied because no available task capability can write repository description,
  homepage, or topics. The approved values remain recorded in this plan for a later authorized
  settings update.
- WP4 completed: the image is a decodable `1348 x 926` JPEG, its source and repository copy hashes
  match, README references are present, `git diff --check` passes, and protected paths are unchanged.
- The initial execution stopped without a commit as required. A later explicit authorization permits
  packaging these same three paths into one local commit. Push, PR state change, merge, deployment,
  live ingestion, and production promotion remain unauthorized and were not performed.
