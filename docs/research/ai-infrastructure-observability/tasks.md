# AI Infrastructure Observability — Proposed Task Map

**Status:** `R2_PORTFOLIO_SELECTION_PROPOSED_PILOT_NOT_AUTHORIZED`
**Specification:** [spec.md](./spec.md)
**Architecture roadmap:** [plan.md](./plan.md)

These tasks are a GitHub tracking map. Creating an issue does not authorize execution.

## Milestone R0 — Specification decision

- [x] **T001:** Review primary user, job to be done, product-value gate (`PR-001`–`PR-005`).
- [x] **T001A:** Review the open-source landscape and approve the evidence-ledger differentiation
  boundary (`PR-006`, `PR-007`).
- [x] **T001B:** Approve reuse-before-build policy and legal/semantic qualification requirements
  (`AR-008`).
- [x] **T002:** Approve or revise AI-attribution policy (`DR-005`, `EV-008`).
- [x] **T003:** Approve provisional Level 2 independence protocol (`EV-005`).
- [x] **T004:** Decide `FUNDED`, monetary aggregates, pilot budget, and maintenance budget.
- [x] **T005:** Record human approval, rejection, or narrowed pilot scope (`GV-001`, `GV-002`).
- [x] **T006:** Approve the highest-priority confirmed large-AI-capacity timeline semantics and its
  additive integration boundary with Demand Layer v1 (`PR-008`, `AR-009`, `AR-010`). Documentation
  approval only; R1/R2 execution and implementation remain unauthorized.

## Milestone R1 — Repository compatibility

- [x] **T101:** Characterize current source/snapshot/document-version contracts (`EV-002`, `EV-003`).
- [x] **T102:** Characterize canonical identity/idempotency/revision behavior (`DR-001`, `DR-009`, `AR-004`).
- [x] **T103:** Characterize coverage and proposed-state boundaries (`CV-001`, `AR-003`).
- [x] **T104:** Identify qualitative evidence and architecture-invariant gaps (`AR-001`, `AR-007`).
- [x] **T105:** Produce compatibility verdict; stop on semantic mismatch (`GV-003`).
- [x] **T106:** Evaluate Open Infrastructure Map, Open Supply Hub, GridStatus, PUDL, and applicable
  data-center/sovereign-AI trackers for reusable data, schemas, connectors, identity patterns, license,
  attribution, freshness, and provenance compatibility (`PR-006`, `AR-008`).
- [x] **T107:** Produce an explicit reuse matrix for acquisition, immutable snapshots, document
  versioning, provenance, coverage, proposed-state isolation, HTTP and verification infrastructure;
  identify why existing numeric `MetricObservation` cannot represent project/phase/tranche semantics
  without changing Demand Layer v1 (`AR-009`, `AR-010`).

## Milestone R1M — Ten-working-day micro-pilot, separately gated

- [x] **TM01:** Complete R1 WP0–WP3 within two working days and obtain an independent review before
  micro-pilot case selection.
- [x] **TM02:** Propose two evidence-testable depth cases and a 5–8-project discovery-only pool; use one
  evidence-rich neocloud/AI-campus case and one sovereign-AI or low-English-accessibility case where
  feasible. WP4M proposal and responsible-human approval of both cases and the six-project pool were
  completed 2026-08-29.
- [x] **TM03:** Build disposable source/version, project/phase/tranche, lifecycle, AI-attribution,
  capacity-basis and schedule records for the two cases. Evidence-only packets completed 2026-08-29.
- [x] **TM04:** Obtain a second classification review and retain disagreements as explicit conflicts.
  Blind second classification completed 2026-08-29; classifier comparison and material-disagreement
  resolution remain pending before WP7M.
- [x] **TM05:** Test at least eight priority negative cases: non-executable announcement, repeated
  announcement, campus/phase duplication, facility-power substitution, unsupported AI share,
  invented date precision, state aggregation and discovery-tracker substitution.
- [x] **TM06:** Produce a coverage-bound non-production timeline prototype without a global-total
  claim and compare it with the closest existing tracker.
- [x] **TM07:** Measure actual effort and assign exactly one micro-pilot verdict; do not claim R2 pass,
  mature maintenance cost, implementation readiness or production eligibility.

## Milestone R2 — Dual research pilot

Only R2 portfolio selection has been authorized. Completion of the separately gated R1M micro-pilot
does not check or satisfy R2 pilot research below, and the portfolio proposal does not authorize it.

- [x] **T201:** Propose exactly five representative depth cases, including one
  low-English-accessibility case, for responsible-human approval. The 2026-08-29 proposal covers
  Middle East, Europe/sovereign, Asia/low-English, U.S. government/scientific and neocloud channels;
  no dossier or final classification was created.
- [x] **T201A:** Propose a 20-project cross-region candidate seed with shallow official-source,
  independent-source, language, access, identity/capacity and feasibility screening. This is a
  discovery seed, not a verified timeline or aggregate.
- [ ] **T202:** Build source/version registries and exact audit paths (`EV-001`–`EV-004`).
- [ ] **T203:** Resolve project/phase identities and cross-party duplicates (`DR-001`, `DR-002`).
- [ ] **T204:** Build lifecycle, supersession, unit, conflict, attribution, and coverage records.
- [ ] **T205:** Execute all required negative cases in `spec.md`.
- [ ] **T206:** Compare each result with Demand Layer v1 and headline research (`PR-003`).
- [ ] **T206A:** Compare each result with the closest applicable open-source tracker and record the
  incremental lifecycle, deduplication, versioning, conflict, or decision value (`PR-007`).
- [ ] **T207:** Record technical GO/NO-GO and product-value verdict (`PR-004`).
- [ ] **T208:** Build a research-only global timeline seed of approximately 15–25 qualifying projects,
  including uncommissioned phases and qualifying phases commissioned since 2024-01-01 (`PR-008`,
  `PR-009`).
- [ ] **T209:** Record project/phase/campus identity, separate completion milestones and commissioning
  tranches, original date precision, AI IT-load or accelerator basis, and confirmed/planned/
  unquantified/unresolved states (`DR-010`–`DR-016`).
- [ ] **T210:** Produce annual and range-safe quarterly views with at-risk marking, separate planned
  upper bounds, unquantified counts, geographic hierarchy, coverage gaps and `last_verified_at`
  (`CV-006`–`CV-009`).
- [ ] **T211:** Measure quarterly manual re-verification effort and test the timeline-specific
  acceptance criteria; stop if at least three required incremental capabilities are not demonstrated.

## Milestone R3 — Domain and fixtures

- [ ] **T301:** Draft deterministic project/phase/tranche/observation/source identities.
- [ ] **T302:** Draft evidence, conflict, lifecycle, milestone, capacity-state, schedule, coverage, and
  absence contracts.
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
