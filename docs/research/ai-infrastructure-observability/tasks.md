# AI Infrastructure Observability — Proposed Task Map

**Status:** `FULL_R2_RESEARCH_ONLY_PILOT_AUTHORIZED_IN_PROGRESS`
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

Issue #5 separately authorized the full R2 research-only pilot on 2026-08-29. That grant permits the
approved research work packages only; it does not authorize implementation, production state,
signals, UI, PR Ready, merge, or deployment. Partial case completion below does not check a portfolio-
level task until all required cases and reviews satisfy it.

**Factual progress, 2026-08-29:** A1 completed first-pass evidence dossiers for Stargate UAE,
Deutsche Telekom Munich, and Osaka Sakai under `pilot/full-r2/`, including source/version locators,
identity, lifecycle, date precision, attribution, capacity state, conflicts, coverage, closest-tracker
comparison, access/legal unknowns, and instrumented wall-clock effort. A2 independently completed
the El Capitan and xAI Colossus depth dossiers. All five first-pass depth dossiers now exist. B2 then
completed a blind review, and its two medium Colossus disagreements were accepted as fail-closed
Level-1 and event-time constraints. Portfolio seed research, negative-case suite, aggregation,
maintenance simulation, and final R2 verdict remain outstanding.

**Factual progress, 2026-08-30:** Portfolio seed registry batch 01 classified candidates 6–10
(Stargate Abilene, Microsoft Fairwater Wisconsin, CoreWeave Lancaster, Meta Hyperion, and Stargate
Norway) using public official-source locators. It found lifecycle evidence but no capacity eligible
for the primary numeric aggregate: Abilene and Fairwater are operational but numeric basis remains
ineligible, Lancaster lacks confirmed-build evidence, Hyperion lacks executable phase/tranche timing,
and Norway remains contractual/forward-looking. T202–T211 remain open pending the rest of the seed,
negative cases, aggregation, maintenance simulation, and final verdict.

**Factual progress, 2026-08-30:** Portfolio seed registry batch 02 classified candidates 11–15
(Nebius Mäntsälä, Isambard-AI, JUPITER, Fluidstack France, and SoftBank Tomakomai) and exercised
Finnish, Japanese, German, and French discovery paths. JUPITER is the batch's only provisional large
commissioned numeric candidate; Isambard-AI is below threshold, Nebius and Tomakomai retain
ineligible facility/design quantities, and Fluidstack remains an MOU negative case. Exact versions,
independence review, the remaining seed, aggregation, maintenance simulation, and final verdict remain
open.

**Factual progress, 2026-08-30:** Portfolio seed registry batch 03 classified candidates 16–20
(SK–AWS Ulsan, Reliance Jamnagar, HUMAIN/AMD/Cisco, Microsoft/G42/EcoCloud Kenya, and Scala AI City)
and added Korean, Portuguese, African, and Saudi coverage. No batch-03 quantity is eligible for the
primary aggregate: Ulsan/Jamnagar capacity bases remain ineligible, HUMAIN site-to-program identity
is unresolved, Kenya remains MOU plus schedule risk, and Scala lacks binding power/construction.
All 20 selected candidates now have depth-case or seed-batch first-pass research; consolidation,
negative cases, aggregation, maintenance simulation, independent review, and final verdict remain open.

**Factual progress, 2026-08-30:** Portfolio consolidation retained 13 confirmed-build or commissioned
timeline rows, including three model-specific numeric candidates, and excluded or held seven cases
without weakening identity, threshold, or confirmed-build policy. This is below the approved minimum
of 15 qualifying projects. Result: `QUALIFYING_SEED_SHORTFALL_13_OF_15_MINIMUM`. Portfolio-level
aggregation and final R2 verdict remain blocked pending a responsible-human decision on qualifying
replacement candidates or scope-failure closeout; negative-case and coverage work may continue.

**Factual progress, 2026-08-30:** Responsible-human authorization permitted screening at most four
replacement candidates to add at least two qualifying rows, without weakening the 15-project minimum
or beginning aggregation. Screening stopped after the first two candidates both qualified: AWS
Project Rainier is an operational, model-specific Trainium2 row and Stargate Michigan / The Barn is
an under-construction `VERIFIED_UNQUANTIFIED` row. The retained population is now 15 and the result is
`QUALIFYING_SEED_MINIMUM_MET_15`. No aggregate was started; T208 and T210 remain open, while existing
negative-case and coverage work may continue. This initial count was subsequently superseded by the
independent portfolio review recorded below.

**Factual progress, 2026-08-30:** The Full R2 negative-case suite executed all 25 required tests in
specification §7. Independent review corrected the classification to 16 observed portfolio
conditions and nine bounded adverse
interpretations where the exact event was absent. All preserved the required fail-closed result at
the research-representation level; this does not substitute for future R3 executable tests. Coverage
analysis initially described 15 consolidation-designated rows and material limits; the independent
review below corrects the qualifying population to at most 12. Local-language coverage remains
partial, and immutable versions, source independence, and legal-access review remain incomplete. No
aggregate or final verdict was started.

**Factual progress, 2026-08-30:** Mandatory independent portfolio review returned
`MATERIAL_DISAGREEMENT`. Cases 9 Hyperion, 17 Jamnagar, and 22 Michigan have campus-level identities
with executable phases/tranches unresolved and cannot remain in the qualifying phase-based timeline.
The fail-closed population is at most 12, not 15. Two of four replacement-screening slots were used,
but only Rainier qualifies after review; the two remaining slots cannot close a three-row shortfall.
Further screening, phase-resolution research, aggregation, and final verdict are stopped pending a
new responsible-human decision. WP10 tabletop maintenance estimates 19.1–34.2 human hours per
scheduled quarter, or 21.1–38.2 hours with one representative exception event; T211 remains open
because no real future-quarter pass occurred.

**Factual progress, 2026-08-30:** Jimmy W. Su authorized phase-resolution research only for cases 9,
17, and 22. Research separated original Project Laidley under LPSC U-37425 from Project Evest and the
later Hyperion expansion; isolated Meta/Reliance's explicit 168 MW Jamnagar first built-to-suit
phase; and identified Green Chile's U-21990 conditionally secured critical-power tranche while
preserving Michigan's active appeal as `SCHEDULE_AT_RISK`. Independent reviewer B2 returned
`ACCEPT_ALL_THREE` with no BLOCKER/HIGH/MEDIUM findings. All three remain
`VERIFIED_UNQUANTIFIED`; facility, campus, utility, and contracted-demand MW stay excluded. The
qualifying population returns to 15. No candidate, threshold, or aggregate was added.

- [x] **T202-A2:** Register source versions, exact locators, permitted-access results and legal
  unknowns for El Capitan and xAI Colossus only.
- [x] **T203-A2:** Resolve stable minimum identities and non-additive component/configuration scopes
  for those two cases.
- [x] **T204-A2:** Record lifecycle, milestones, original date precision, AI attribution, capacity
  bases/states, conflicts, supersession and coverage for those two cases.
- [x] **T206A-A2:** Compare each A2 case with its closest applicable public/open tracker and record
  the incremental decision effect.
- [x] **T211-A2-effort:** Record actual A2 research wall-clock intervals without extrapolating a
  global maintenance cost.
- [x] **T204-B2-review:** Independently classify all five depth dossiers, compare disagreements, and
  carry forward the accepted Colossus evidence-level and commissioning-time constraints without
  assigning a portfolio verdict.
- [x] **T204-B2-portfolio-review:** Independently review the consolidated portfolio, negative suite,
  and coverage claims. Review completed 2026-08-30 with material disagreement and fail-closed
  correction from 15 to at most 12 qualifying rows.

The separately gated R1M micro-pilot does not check or satisfy R2 pilot research below. Issue #5's
later full-R2 research-only authorization is the execution authority; the earlier portfolio proposal
did not grant that authority by itself.

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
- [x] **T205:** Execute all required negative cases in `spec.md`. Research-representation suite
  completed 2026-08-30 with 16 observed cases and nine bounded mutations after independent review;
  future R3 executable fixtures/tests remain separately gated.
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
