# Agent Guide

## Repository authority

[R1] Treat the current repository—code, tests, schemas, and canonical state—as authoritative.
When documentation conflicts with verified behavior, inspect the implementation and tests, report
the conflict, and do not silently choose the more convenient interpretation.

## Project purpose

[R2] Monitor evidence across this transmission chain:

compute demand
-> hyperscaler capital intent
-> physical infrastructure commitment
-> backlog/orders
-> realized deployment
-> semiconductor supply confirmation

Preserve the economic meaning and evidence boundary of every stage. Do not turn this project into
an investment recommendation or claim that total infrastructure spending is AI-specific without
explicit issuer disclosure.

## Non-negotiable data principles

[R3] Prefer official Tier-1 issuer, regulator, and investor-relations sources.
[R4] Fail closed instead of inferring, carrying forward, or synthesizing missing financial facts.
[R5] Extract by semantic anchors and validated context; do not depend on the nth numeric cell.
[R6] Build fixtures from faithful official wording and layout, including known source drift.
[R7] Preserve immutable provenance and deterministic observation, record, and signal IDs. Keep
acquisition time out of economic identity.
[R8] Never substitute economically different metrics, definitions, periods, units, or reporting bases.
[R8a] Never encode qualitative commentary or attribution as a numeric `MetricObservation`, and never
invent a numeric proxy for qualitative evidence.
[R9] Validate committed production baseline and disposable proposed canonical state separately.
[R10] Never promote production canonical data during research or parser development without explicit
authorization.
[R11] Before changing a production signal, require evidence that the proposed data adds incremental
information through historical lead/lag analysis. Preserve the signal until the evidence and its
economic interpretation receive human review.

## Source-of-truth hierarchy

Use current code and tests for executable behavior. Use canonical schemas and production canonical
data for recorded facts, identities, and provenance. Use an explicitly approved active execution plan
for authorized scope, a research specification for reviewed proposed contracts, architecture docs for
navigation, and historical handoffs or conversations for context only. If code and canonical state
conflict, stop and report the inconsistency; do not rewrite either side by assumption.

## Repository map

[R12] Start architecture navigation at `docs/architecture/README.md`. Verify claims against code/tests.
[R13] Read issuer and metric research contracts under `docs/research/`. Treat them as proposed unless
their status says implemented and verification confirms it.
[R14] Read approved implementation scope under `docs/exec-plans/active/` when present. If no active
plan exists, do not infer that a researched phase is approved.
[R15] Find executable behavior in `scripts/ingestion/`, `src/ingestion/`, `src/signals/`, `src/types/`,
and `tests/ingestion/`. Read `package.json` for current commands.
[R16] Find project-local skills under `.agents/skills/` and their installation manifest in
`skills-lock.json`.

## Required workflow

[W1] Inspect branch, HEAD, remotes, worktree status, repository structure, and relevant history.
[W1a] Preserve pre-existing worktree changes. If they overlap the requested scope or their ownership
is unclear, stop and report the conflict. Never stage unrelated changes.
[W2] Read the relevant specification, implementation, fixtures, providers, and regression tests.
[W3] Run existing baseline verification appropriate to the scope before changing behavior.
[W4] State the planned scope, forbidden scope, assumptions, and unresolved human decisions.
[W5] Implement against fixtures or a disposable proposed state where ingestion/canonical data is
involved. Do not use production canonical paths as a development workspace.
[W6] For general code changes, run `npm run verify:agent` before reporting complete. It currently
composes lint, build, complete ingestion tests, and downstream verification. Use narrower
issuer-specific checks during development when useful, and run `git diff --check` separately.
[W7] Report changed files, verification results, production/provenance impact, and human decisions.

Common completion commands currently include:

- `npm run verify:agent`
- `git diff --check`

Choose additional issuer-specific commands from `package.json`.

## Protected areas

[P1] Obtain explicit authorization before promoting or modifying production canonical data.
[P2] Obtain explicit authorization before changing signal semantics or evidence eligibility.
[P3] Obtain explicit authorization before changing thresholds, confidence rules, scoring, or ranking.
[P4] Obtain explicit economic review before substituting, combining, or comparing metric definitions.
[P5] Obtain explicit authorization before destructive Git operations. Never force-push, rewrite
history, or discard user work by assumption.

## Project-local skills

[S1] Use `grill-me` when the user explicitly requests a focused design interview.
[S2] Use `grill-with-docs` when the user explicitly requests an interview that also captures domain
terms or qualifying decisions; expect repository documentation writes.
[S3] Use `grilling` when asked to stress-test a plan or decision through iterative questions.
[S4] Use `domain-modeling` when resolving canonical terminology, updating a domain glossary, or
recording a qualifying architectural decision.
[S5] Use `handoff` when asked to prepare a continuation artifact; write it only to the OS temporary
directory as the skill requires.

Read the selected `SKILL.md` before using a skill. Do not invoke writing skills during read-only work.
