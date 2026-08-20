# Execution plans

Execution plans make approved, multi-step work auditable without turning research documents or
conversation history into implementation authority.

## When a plan is required

Create an execution plan before work that is any of the following:

- multi-step or operationally high-risk;
- a production canonical data change or promotion;
- an identity, provenance, revision, or canonical-schema change;
- a signal-semantic, evidence-eligibility, threshold, confidence, or scoring change; or
- a change crossing multiple architectural boundaries such as ingestion, providers, signals, and UI.

Small, isolated maintenance may proceed without a plan when its scope and verification are explicit
and it does not enter a protected area defined by the root `AGENTS.md`.

## Locations

- Put approved or pending current plans in `docs/exec-plans/active/`.
- Move closed plans to `docs/exec-plans/completed/` after recording closeout evidence.

Create these directories only when the first qualifying plan reaches that lifecycle stage. Their
absence means no plan is currently recorded there; it does not prove that an implementation exists.

## Required fields

Every plan must contain:

1. **Title** — a stable name and version.
2. **Status** — exactly one allowed lifecycle status.
3. **Owner or responsible human** — the person accountable for approvals and economic decisions.
4. **Scope** — concrete outcomes and authorized paths/systems.
5. **Forbidden scope** — adjacent data, signals, behavior, or operations that must remain unchanged.
6. **Source specifications** — links to research contracts, issues, or decisions; do not copy them.
7. **Baseline checkpoint** — branch, commit, worktree state, production boundary, and baseline results.
8. **Work packages** — ordered implementation units with dependencies and rollback boundaries.
9. **Acceptance criteria** — observable completion conditions, including fail-closed cases.
10. **Verification evidence** — commands, tests, outputs, and production-state checks.
11. **Human decisions** — unresolved and resolved economic, authorization, or policy choices.
12. **Progress log** — dated factual updates, blockers, and completed work packages.
13. **Decision log** — material choices made during execution and their rationale.
14. **Closeout result** — final commit/state, files changed, regressions, deferred work, and outcome.

## Allowed statuses

- `DRAFT`
- `BLOCKED_PENDING_HUMAN_APPROVAL`
- `APPROVED`
- `IN_PROGRESS`
- `COMPLETED`
- `SUPERSEDED`

Only the responsible human may approve a plan. `APPROVED` records that explicit human authorization;
editing the status text does not create authority. Implementation may begin only within the
human-approved scope. Production promotion still requires its own separate explicit authorization.
Change status to `IN_PROGRESS` when authorized implementation begins. Use
`BLOCKED_PENDING_HUMAN_APPROVAL` when an unresolved decision would change economic meaning, production
state, or authorized scope.

## Authority and lifecycle rules

- A research specification does not authorize implementation.
- An active plan does not prove that implementation exists.
- Production promotion remains a separate explicit authorization even when a plan is approved.
- Link to specifications and architecture evidence instead of duplicating them.
- Keep the plan current as work proceeds; do not rewrite history to hide changed assumptions.
- Mark a plan `COMPLETED` only after its acceptance criteria and verification evidence pass.
- Mark an abandoned or replaced plan `SUPERSEDED` and link to its successor.
- Use completed plans to preserve execution evidence and decisions, not as a duplicate changelog.

No active Vertiv execution plan exists. The current Vertiv document under `docs/research/` remains a
research and implementation specification with approval pending.
