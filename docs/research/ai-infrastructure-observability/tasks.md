# AI Infrastructure Observability — Proposed Task Map

**Status:** `PROPOSED_NOT_AUTHORIZED`
**Specification:** [spec.md](./spec.md)
**Architecture roadmap:** [plan.md](./plan.md)

These tasks are a GitHub tracking map. Creating an issue does not authorize execution.

## Milestone R0 — Specification decision

- [ ] **T001:** Review primary user, job to be done, product-value gate (`PR-001`–`PR-005`).
- [ ] **T002:** Approve or revise AI-attribution policy (`DR-005`, `EV-008`).
- [ ] **T003:** Approve provisional Level 2 independence protocol (`EV-005`).
- [ ] **T004:** Decide `FUNDED`, monetary aggregates, pilot budget, and maintenance budget.
- [ ] **T005:** Record human approval, rejection, or narrowed pilot scope (`GV-001`, `GV-002`).

## Milestone R1 — Repository compatibility

- [ ] **T101:** Characterize current source/snapshot/document-version contracts (`EV-002`, `EV-003`).
- [ ] **T102:** Characterize canonical identity/idempotency/revision behavior (`DR-001`, `DR-009`, `AR-004`).
- [ ] **T103:** Characterize coverage and proposed-state boundaries (`CV-001`, `AR-003`).
- [ ] **T104:** Identify qualitative evidence and architecture-invariant gaps (`AR-001`, `AR-007`).
- [ ] **T105:** Produce compatibility verdict; stop on semantic mismatch (`GV-003`).

## Milestone R2 — Five-case pilot

- [ ] **T201:** Select five representative cases including one low-English-accessibility case.
- [ ] **T202:** Build source/version registries and exact audit paths (`EV-001`–`EV-004`).
- [ ] **T203:** Resolve project/phase identities and cross-party duplicates (`DR-001`, `DR-002`).
- [ ] **T204:** Build lifecycle, supersession, unit, conflict, attribution, and coverage records.
- [ ] **T205:** Execute all required negative cases in `spec.md`.
- [ ] **T206:** Compare each result with Demand Layer v1 and headline research (`PR-003`).
- [ ] **T207:** Record technical GO/NO-GO and product-value verdict (`PR-004`).

## Milestone R3 — Domain and fixtures

- [ ] **T301:** Draft deterministic project/phase/observation/source identities.
- [ ] **T302:** Draft evidence, conflict, lifecycle, coverage, and absence contracts.
- [ ] **T303:** Create faithful fixtures and acceptance/negative tests.
- [ ] **T304:** Draft a repository execution plan; obtain separate implementation approval.

## Milestones R4–R5 — Ingestion and production proposal

- [ ] **T401:** Implement two or three approved Tier-1 ingestion paths in disposable state.
- [ ] **T402:** Verify idempotency, revisions, deduplication, conflicts, attribution, and coverage.
- [ ] **T403:** Run full repository guardrails and protected-state comparison.
- [ ] **T501:** Draft production promotion, rollback, and coverage-bound presentation plan.
- [ ] **T502:** Obtain separate production, signal, and UI decisions; do not infer authorization.

## Milestones R6–R7 — Track C, conditional

- [ ] **T601:** Define bottleneck taxonomy and source hierarchy (`TC-001`, `TC-002`).
- [ ] **T602:** Define company-specific exposure and financial-transmission evidence (`TC-003`, `TC-004`).
- [ ] **T603:** Define counterforce and negative-case requirements (`TC-005`).
- [ ] **T701:** Research five to ten approved companies and record unsupported causal gaps.
- [ ] **T702:** Produce Track C research-only feasibility verdict.

## Issue contract

Every implementation or research issue must contain:

- requirement IDs;
- prerequisite gate and dependencies;
- exact authorized scope and forbidden adjacent scope;
- deliverables and acceptance criteria;
- evidence/verification method;
- production and rollback impact;
- unresolved human decisions; and
- explicit statement that issue creation does not itself grant execution authority.
