# R1 verification and protected-state report

**R1 baseline:** `c630a966b5f17ccf538771ad9e402d611ff57e88`
**Main baseline:** `a0732dc8356ac1330b51c2b29c9c37a1e80dd419`
**Branch:** `docs/ai-infrastructure-observability-roadmap`
**PR:** #6, open Draft at preflight

## WP0 authority and baseline

Issue #5 recorded `R1_AUTHORIZED_WP0_WP3_ONLY` on 2026-08-29 with all seven R0 and all seven R1-only
items approved. Authority is limited to WP0–WP3, two working days / 8–12 human hours, artifacts under
this `pilot/` directory, and documentation/research commits plus normal pushes to the existing branch
and Draft PR. WP4M, micro-pilot research, production/code/canonical/signals/UI, PR readiness, merge
and deployment remain forbidden.

Pre-existing worktree status was clean. Remote branch and PR head matched the R1 baseline; remote
`main` matched the main baseline. The PR contained six documentation files and no production/code
paths.

Protected Git tree objects at WP0:

| Path | Tree object |
|---|---|
| `data/ingestion/` | `87db0ef8d58b435679edf2e0e98fef3186a1b794` |
| `src/` | `9bcd0d7b2c965a886a5fb481f4f8deb60c17fcd3` |
| `scripts/` | `d665fff1f4b7df32f07e57097326ae3bc5cdc879` |
| `tests/` | `1d284ce8e89f2cc71842cd3d8117af6ecfa4b2c9` |

## Verification

| Check | Result |
|---|---|
| First `npm ci` attempt | Environment failure: the default `/root/.npm` cache path was unavailable after registry tarball retries; no test result was produced. |
| `npm ci --cache /tmp/ai-monitor-a-npm-cache` | Passed; 30 packages installed from the lockfile using an OS-temporary cache. |
| `npm run verify:agent` | Passed: oxlint, TypeScript/Vite build, 170/170 ingestion tests and all five downstream verification scripts. |
| `git diff --check` | Passed at pre-commit delivery verification. |
| `git diff -- data/ingestion src scripts tests` | Empty at WP0 and required to remain empty at delivery. |
| Protected tree objects | Required to remain identical to the four WP0 objects above. |

No live ingestion command was run. No production state, canonical observation, signal, threshold,
scoring, UI or external data row was changed. External inspection used public repository metadata,
documentation, schemas and licenses only; no snapshot or translation is committed.

## Reproducibility notes

External repositories are pinned by commit in the compatibility report. Repository conclusions link
to exact local paths and executable tests. An independent reviewer should re-fetch those refs,
confirm license/data-license separation, inspect the five R1 artifacts, compare protected paths with
the baseline, and rerun the completion checks before any WP4M decision.
