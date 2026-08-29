# AI Infrastructure Observability R1–R2 Research Execution Plan v0.3

**Status:** `SUPERSEDED`
**Responsible human:** Jimmy W. Su  
**Created:** 2026-08-27  
**Updated:** 2026-08-29  
**Plan scope:** R1 repository/reuse compatibility and R2 research-only dual pilot  
**R1 authorization:** `NOT_GRANTED`  
**R2 portfolio-selection authorization:** `NOT_GRANTED`  
**R2 pilot authorization:** `NOT_GRANTED`  
**Implementation authorization:** `NOT_GRANTED`  
**Production-write authorization:** `NOT_GRANTED`  
**Merge authorization:** `NOT_GRANTED`

**Superseded by:** [AI Infrastructure Observability Ten-Working-Day R1 + Micro-Pilot Plan v0.1](./ai-infrastructure-observability-ten-day-micro-pilot-v0.1.md)

This version is retained as the reviewed full R1–R2 plan. On 2026-08-29, Jimmy W. Su approved a
documentation-only scope revision because only ten working days were available. The successor keeps
the product semantics but replaces the 23-day R2 execution proposal with a non-R2 micro-pilot. This
status change does not authorize execution, production work, PR readiness, merge, or deployment.

## 1. Purpose

Execute a bounded research program that determines whether AI Infrastructure Monitor can add a
credible, maintainable Track B physical-build layer to the implemented Demand Layer v1.

The proposed highest-priority output is a coverage-bound timeline of publicly verified, large AI data
center phases showing expected commissioned capacity by supported year or range-safe quarter,
schedule risk, regional concentration, and relevant physical bottlenecks.

This plan does not authorize implementation. It is designed for human and external AI review before
any R1 or R2 work begins.

## 2. Approval contract

This plan has two independent authorization gates. Approval must state the authorized stage
explicitly. A general statement such as “approve this plan” authorizes R1 only; it never authorizes
R2 by implication.

### R1 approval contract

Explicit R1 approval would authorize only:

1. read-only repository characterization for R1;
2. read-only inspection of applicable open-source projects, licenses, schemas, and public sources;
3. creation of the R1 documentation and disposable compatibility artifacts in §7; and
4. production of the R1 compatibility verdict.

R1 approval does not authorize portfolio discovery, case selection, source-dossier construction,
manual project research, timeline aggregation, or any other R2 work.

### R2 separate authorization contracts

R2 has two gates after R1. Neither is granted by R1 approval.

`R2 portfolio-selection authorization` permits WP4 only and requires:

1. WP3 produces a reviewed R1 compatibility verdict;
2. Jimmy W. Su separately authorizes WP4 after reviewing that verdict; and
3. the discovery boundaries, exact artifact root, selection budget, and external-data restrictions
   are recorded.

`R2 pilot authorization` permits WP5–WP11 only and additionally requires:

1. WP4 produces the proposed 15–25-project portfolio and five depth cases;
2. Jimmy W. Su approves the selected portfolio, cases, R2 time budget, and maintenance budget; and
3. the mandatory second reviewer is identified and accepts the review responsibility.

Only R2 pilot authorization permits source-dossier construction, manual research of the five depth
cases and approximately 15–25 timeline projects, timeline aggregation, and technical, product-value,
coverage, or maintenance-cost verdicts.

Neither R1 nor R2 approval would authorize:

- production code, schema, canonical data, provider, signal, scoring, threshold, or UI changes;
- live ingestion into repository production paths;
- copying external datasets into canonical or production state;
- R3 domain/fixture implementation, R4 live ingestion, or R5 production promotion;
- commits, pushes, PR readiness, merge, deployment, or publication unless separately granted; or
- automatic investment recommendations.

External review by Claude or another model is advisory. Only Jimmy W. Su may approve this plan and
authorize execution. A document status or reviewer statement cannot create authority by itself.

## 3. Source specifications and tracking

- [Product and evidence specification](../../research/ai-infrastructure-observability/spec.md)
- [C4 architecture roadmap](../../research/ai-infrastructure-observability/plan.md)
- [Proposed task map](../../research/ai-infrastructure-observability/tasks.md)
- [Architecture map](../../architecture/README.md)
- [Issue #5](https://github.com/jimisu/ai-infrastructure-monitor/issues/5)
- [Draft PR #6](https://github.com/jimisu/ai-infrastructure-monitor/pull/6)

The specifications define product and evidence semantics. This plan governs only the ordered R1–R2
execution. If a proposed action conflicts with the specification, stop and return to the responsible
human instead of silently altering either document.

## 4. Authoritative baseline checkpoint

### Repository baseline

- Repository: `jimisu/ai-infrastructure-monitor`
- Proposed-plan branch: `docs/ai-infrastructure-observability-roadmap`
- Remote PR #6 head inspected before this correction:
  `4969a740e636880dfd0f700fa6b4963494009885`
- Remote `main` at the last fetch:
  `a0732dc8356ac1330b51c2b29c9c37a1e80dd419`
- PR #6: open, Draft, mergeable, five documentation files changed.
- Production paths changed by PR #6: none.

The executor must re-fetch and record the actual branch, `main`, worktree, PR, and production baseline
immediately before R1 begins. A changed baseline does not automatically invalidate the plan, but any
semantic, architectural, or production-state change affecting R1 must stop execution for review.

### Implemented system baseline

Demand Layer v1 currently provides:

- official-source ingestion for TSMC, META, MSFT, GOOG, and AMZN;
- immutable fixture/live snapshots and acquisition provenance;
- version-aware canonical numeric observations;
- deterministic observation, record, and signal identities;
- validated provider boundaries;
- deterministic hyperscaler breadth and hyperscaler × TSMC confirmation;
- coverage separated from ingestion health;
- disposable proposed-state verification; and
- the composed `npm run verify:agent` guardrail.

Known relevant gaps include:

- no generic qualitative canonical evidence store;
- existing `MetricObservation` requires numeric values and cannot safely represent project graphs;
- issuer identity implementations are not fully unified;
- no repository-wide architecture-invariant suite; and
- no approved project/phase/tranche store or physical-capacity timeline provider.

### Rollback boundary

Demand Layer v1, current production canonical observations, signal semantics, and UI are the rollback
boundary. R1–R2 must remain removable documentation and disposable research artifacts. Removing
Track B research must require no rewrite of existing history or signals.

## 5. Approved product semantics to preserve

Every work package must preserve these already confirmed semantics:

1. The core output is a global known-project commissioned-capacity timeline; schedule and regional
   concentration are derived from the same evidence.
2. Confirmed timeline entry requires eligible `CONTRACTED`, `PROCURED`, secured critical power, or
   `UNDER_CONSTRUCTION` evidence.
3. Primary completion is `COMMISSIONED`; preserve earlier `INFRASTRUCTURE_READY` and
   `EQUIPMENT_INSTALLED` milestones.
4. Preserve original time text, precision, and earliest/latest range. Do not invent dates or quarters.
5. Large means at least 50 MW project-specifically attributable AI IT load or 10,000 disclosed AI
   accelerators.
6. Accelerator models/generations remain separate. Do not manufacture equivalent counts or FLOPS.
7. Campus, executable phase, and commissioning tranche are separate identities and accounting units.
8. Confirmed executable, installed, commissioned, at-risk, planned upper bound,
   `VERIFIED_UNQUANTIFIED`, and `AI_UNRESOLVED` states are non-interchangeable.
9. `STRATEGIC_EXCEPTION` requires confirmed-build evidence, structural importance, human approval,
   rationale, reviewer, and source trail.
10. Official delay, `SCHEDULE_AT_RISK`, scope revision, cancellation, and supersession are distinct.
11. Numeric aggregates contain only quantified confirmed expected capacity. Planned upper bounds are
    separate; unquantified projects are counts only.
12. Global means publicly verified known projects with explicit coverage gaps, not complete global
    capacity.
13. The intended maintenance cadence is quarterly full re-verification, exception updates for
    material official events, and `STALE` after 120 days.
14. R2 uses approximately 15–25 timeline projects and five evidence-ledger depth cases.

Any finding that requires changing these semantics is a stop condition, not an executor discretion.

### Approval provenance

These semantics were approved by Jimmy W. Su through the 2026-08-27 focused design interview and are
recorded in:

- [specification §9](../../research/ai-infrastructure-observability/spec.md#9-human-decisions-recorded-for-this-draft),
  covering `PR-008`–`PR-009`, `DR-010`–`DR-016`, `CV-006`–`CV-009`, and `AR-009`–`AR-010`;
- [C4 roadmap decision log](../../research/ai-infrastructure-observability/plan.md#10-decision-log);
  and
- [Issue #5 approved timeline checklist](https://github.com/jimisu/ai-infrastructure-monitor/issues/5).

This provenance approves product semantics for the draft. It does not authorize R1, R2,
implementation, production writes, commit, push, PR readiness, merge, or deployment.

## 6. Architecture and integration boundary

The approved dependency direction is:

```text
official project-specific source
-> acquisition and immutable document version
-> claim and locator
-> project / executable phase identity
-> lifecycle, milestone and capacity evidence
-> commissioning tranche and schedule state
-> coverage-bound physical capacity timeline
-> Decision Intelligence comparison with Demand Layer v1
```

Demand Layer v1 remains authoritative for hyperscaler capital intent and TSMC supply confirmation.
Track B is a separate project/phase factual layer. The two layers join only in Decision Intelligence
after independent validation.

The following shortcuts are prohibited:

- encode project evidence as the existing numeric `MetricObservation` without an approved R3 design;
- infer project MW, AI share, completion, or phase allocation from company CapEx;
- treat a company, sponsor, GPU vendor, or customer name as AI attribution;
- read raw research artifacts directly from React;
- change existing signal semantics to consume Track B during R1 or R2; or
- treat a discovery tracker as canonical evidence.

## 7. Deliverables

### R1 deliverables

1. `R1-repository-reuse-matrix.md`
2. `R1-external-open-source-compatibility.md`
3. `R1-domain-gap-analysis.md`
4. `R1-verification-and-protected-state-report.md`
5. `R1-compatibility-verdict.md`

The verdict must be exactly one of:

- `R1_COMPATIBLE_FOR_RESEARCH_PILOT`
- `R1_COMPATIBLE_WITH_REVIEWED_CONSTRAINTS`
- `R1_BLOCKED_NEW_HUMAN_DECISION`
- `R1_NOT_COMPATIBLE`

### R2 deliverables

1. approved case-selection register;
2. source/document-version registry;
3. five depth-case dossiers;
4. approximately 15–25-project timeline research dataset;
5. project/phase/campus/tranche identity register;
6. lifecycle, completion milestone, capacity-state, revision, and schedule-event ledger;
7. annual and range-safe quarterly timeline output;
8. country/region concentration and coverage report;
9. open-source competitor baseline for every depth case;
10. negative-case and reproducibility report;
11. maintenance-time log and quarterly-cost estimate;
12. decision-value log; and
13. R2 technical and product-value verdict.

R2 deliverables remain outside production paths and must be clearly labeled research-only.

## 8. Artifact location and data-handling rules

Before R1 begins, the responsible human must approve the exact research artifact directory. The
recommended repository location is:

```text
docs/research/ai-infrastructure-observability/pilot/
```

Large raw downloads, temporary translations, extraction scratch files, or unreviewed copied datasets
must not be committed there. Use an OS temporary directory or another explicitly approved disposable
workspace. If an immutable source snapshot becomes necessary for reproducibility, record the legal,
license, size, attribution, and repository-impact decision before adding it.

Every factual research record must preserve:

- source URL and publisher;
- source class and eligibility;
- document title, publication/effective date, retrieval time, version/hash when available;
- page, paragraph, table, selector, or equivalent locator;
- exact supported claim separated from normalized interpretation;
- original date, capacity, unit, currency, and precision;
- project, campus, phase, and tranche linkage status;
- AI attribution state;
- reviewer and review time;
- conflict, supersession, missing-data, and coverage notes; and
- whether the record is discovery-only, corroborating, or eligible factual evidence.

## 9. Work packages

### WP0 — Approval and execution preflight

**Objective:** Establish authority and a reproducible starting point.

**Dependencies:** This plan reviewed; responsible human approval not yet granted.

**Actions:**

1. Record Claude/external review findings without treating them as authoritative.
2. Resolve every BLOCKER/HIGH review finding or document its explicit rejection and rationale.
3. Obtain explicit responsible-human approval for R1 only. R2 remains separately gated after WP3.
4. Record permitted artifact paths, R1 time budget, commit/push authority, and external-data
   restrictions. Record the R2 maintenance budget as approved or explicitly unresolved; an
   unresolved R2 budget does not authorize or block R1 but must be closed before R2 pilot approval.
5. Re-fetch `main`, PR #6, branch, worktree, and relevant repository instructions.
6. Record baseline SHA, worktree status, PR changed files, and production path hashes/diff.
7. Run baseline verification appropriate to read-only research planning.

**Acceptance:** Authority is unambiguous; worktree ownership is resolved; all unresolved decisions
that could alter R1 scope are closed.

**Stop:** No explicit approval, dirty overlapping worktree, stale incompatible baseline, or unclear
artifact ownership.

### WP1 — Characterize reusable repository contracts

**Objective:** Determine what can be reused without changing existing semantics.

**Actions:**

1. Inspect snapshot, manifest, canonical-store, source identity, coverage, proposed-state resolver,
   HTTP client, orchestrator, and verification contracts plus their tests.
2. Characterize inputs, outputs, identities, mutation boundaries, failure behavior, and fixture/live
   provenance for each component.
3. Record compatibility for:
   - direct reuse;
   - reuse behind a new adapter;
   - reference pattern only;
   - incompatible for Track B; or
   - unresolved human decision.
4. Prove why existing `MetricObservation` either can or cannot represent each required Track B fact
   without semantic substitution.
5. Identify missing qualitative evidence, project graph, revision, lifecycle, schedule, and capacity
   contracts.

**Deliverable:** Repository reuse matrix and domain gap analysis.

**Acceptance:** Every candidate component has evidence-backed compatibility, test references, and a
clear protected-state implication. No implementation is performed.

**Stop:** Reuse would change an existing deterministic identity, production schema, provenance
meaning, or signal behavior.

### WP2 — Evaluate external open-source reuse candidates

**Objective:** Avoid rebuilding existing capabilities while preserving evidence requirements.

**Candidates:** India Datacenter Watch, US Data Center Atlas, Sovereign AI Tracker, Open
Infrastructure Map, Open Supply Hub, GridStatus, PUDL, and any newly discovered direct competitor.

**Actions:**

1. Record repository, version/release, license, update cadence, maintainer activity, data origin,
   schema, identity model, geographic coverage, and known limitations.
2. Separate software-component reuse from data reuse.
3. Test whether provenance, original-source locator, AI attribution, project/phase identity, date
   precision, capacity basis, freshness, and correction history survive reuse.
4. Identify discovery-only datasets and components suitable for architecture reference.
5. Do not ingest external rows into proposed canonical state.

**Deliverable:** External open-source compatibility report.

**Acceptance:** Each candidate has a legal/semantic/freshness verdict and an original-source
verification requirement.

**Stop:** License ambiguity, missing provenance, incompatible capacity semantics, or dependency on
private/authenticated access needed for the pilot.

### WP3 — R1 verification and compatibility verdict

**Objective:** Decide whether R2 can begin without implementation.

**Actions:**

1. Confirm R1 changed only authorized documentation/research artifacts.
2. Compare protected production paths against WP0 baseline.
3. Run `git diff --check` and relevant read-only or characterization checks.
4. Document reusable contracts, expected new Track B boundary, unresolved risks, and stop conditions.
5. Assign exactly one R1 verdict.

**Acceptance:** The verdict is reproducible and states whether R2 can operate entirely in disposable
research state.

**Independent review:** Before R2 portfolio selection can be authorized, a human or model instance
that did not produce the R1 verdict must inspect the R1 evidence, repository references, protected-
state comparison, and unresolved risks. Preserve the independent review and any disagreement in the
R1 closeout; reviewer agreement is not required, but unresolved material disagreement is a stop
condition.

**Gate:** R2 cannot begin automatically. Return the R1 verdict and independent review to Jimmy W. Su
for separate R2 authorization.

### WP4 — Select the R2 portfolio

**Objective:** Select a bounded set capable of testing evidence depth and timeline aggregation.

**Actions:**

1. Build a discovery pool from official sources and qualified discovery aids.
2. Select approximately 15–25 projects across Middle East, Europe, Asia, U.S.
   government/scientific, and neocloud channels.
3. Include uncommissioned qualifying phases and qualifying phases commissioned since 2024-01-01.
4. Select five depth cases, including at least one low-English-accessibility case.
5. Include positive and negative/stress cases: phased campus, mixed-use AI attribution, schedule risk,
   revised source, and unquantified confirmed build where feasible.
6. Record inclusion/exclusion reason and expected evidence challenge for every candidate.
7. Before selecting a source-dependent candidate, pre-screen whether its required evidence is
   publicly accessible without authentication, payment, access-control circumvention, or a prohibited
   collection method. Record unresolved access restrictions as a selection risk.

**Acceptance:** Portfolio is regionally varied, evidence-testable, not biased toward English-rich
cases, and does not claim statistical or global completeness.

**Gate:** WP4 requires separate R2 portfolio-selection authorization after WP3. WP5 cannot begin until
Jimmy W. Su then grants R2 pilot authorization, approves the selected five depth cases and timeline
scope, and records the identity and acceptance of the mandatory second reviewer. Missing any one of
these conditions returns the plan to `BLOCKED_PENDING_HUMAN_APPROVAL`.

### WP5 — Build source and identity registries

**Objective:** Establish exact evidence and prevent duplicate project accounting.

**Actions:**

1. Before acquisition, record the applicable site terms, `robots.txt` where relevant, authentication
   or payment requirements, automated-access restrictions, redistribution constraints, and the
   permitted research access method. Never bypass access controls or use an access method prohibited
   by the source.
2. If automated access is prohibited or unclear, use permitted manual inspection, find an eligible
   alternative official source, or exclude the source/case with a coverage reason. Do not silently
   downgrade to an unofficial source.
3. Register eligible Tier-1 source documents and discovery-only sources separately.
4. Preserve versions, hashes, retrieval times, locators, language, and translation method.
5. Resolve sponsor, operator, customer, utility, government, campus, project, phase, and tranche
   relationships.
6. Record aliases, match evidence, parent/child relations, conflicts, and unresolved merges.
7. Detect government/operator/customer/vendor repetition of one underlying project.

**Acceptance:** At least four of five depth cases have stable project/phase identity; unresolved cases
have a classified failure mode. Every acquired source has a recorded permitted access method and no
access control was bypassed. No capacity is aggregated before identity review.

**Stop:** Stable identity cannot be reached for four depth cases or resolution requires private data.

### WP6 — Classify lifecycle, AI attribution, completion, and capacity

**Objective:** Convert eligible evidence into reproducible research records without inventing facts.

**Actions:**

1. Apply lifecycle eligibility and confirmed-build entry rules.
2. Apply `AI_EXPLICIT`, `AI_PARTIAL`, `AI_UNRESOLVED`, and `NOT_AI_SPECIFIC`.
3. Preserve `INFRASTRUCTURE_READY`, `EQUIPMENT_INSTALLED`, and `COMMISSIONED` separately.
4. Preserve original time text and precision; record earliest/latest bounds.
5. Classify AI IT load, facility power, utility supply, MWac/MWdc, accelerator count/model, campus
   total, phase capacity, and tranche capacity without substitution.
6. Apply `QUANTIFIED_LARGE`, `VERIFIED_UNQUANTIFIED`, `AI_UNRESOLVED`, or documented exclusion.
7. Escalate every proposed `STRATEGIC_EXCEPTION` to Jimmy W. Su; the executor cannot self-approve it.
8. Preserve planned upper bound separately from confirmed executable and commissioned capacity.

**Acceptance:** A second reviewer following the evidence and policy obtains the same classifications
for the depth cases, or disagreements are explicit conflicts.

**Stop:** Most cases lack project-specific AI attribution, capacity bases cannot be distinguished, or
manual inference becomes necessary for core output.

### WP7 — Record revisions, schedule events, and commissioning tranches

**Objective:** Produce an auditable expected-capacity timeline.

**Actions:**

1. Record document supersession and effective periods without deleting prior evidence.
2. Record scope increase/reduction and cancellation as explicit events.
3. Separate `OFFICIALLY_DELAYED` from evidence-backed `SCHEDULE_AT_RISK`.
4. Require permit, utility, construction, equipment, or missed-milestone evidence for at-risk status.
5. Record partial commissioning as dated/ranged tranches; do not book the whole phase early.
6. Remove canceled capacity from current expected totals while retaining history.

**Acceptance:** Every timeline change resolves to source evidence, project/phase identity, effective
time, and prior state.

### WP8 — Produce coverage-bound timeline and concentration views

**Objective:** Test the highest-priority output without production UI implementation.

**Actions:**

1. Aggregate only quantified confirmed expected capacity.
2. Mark the at-risk subset without adding it as separate capacity.
3. Present planned upper bounds separately and unquantified projects as counts.
4. Place year-level evidence in annual views; keep half-year/range evidence unallocated or ranged in
   quarter views.
5. Preserve site, city/administrative area, country, and analytical region.
6. Display `data_as_of`, coverage gaps, languages, project count, unquantified count, and verification
   age with every material output.
7. Mark records `STALE` after 120 days; do not imply real-time monitoring.

**Acceptance:** No campus/phase/tranche duplicates, false date precision, unsupported unit conversion,
or unlabeled global-total claim appears in outputs.

### WP9 — Competitive and decision-value evaluation

**Objective:** Determine whether the system adds value beyond existing trackers and Demand Layer v1.

**Actions:**

1. For each depth case, record what a competent user learns from the closest open-source tracker.
2. Compare Track B results with Demand Layer v1 and ordinary headline research.
3. Record whether Track B rejects repetition, proves progression, exposes delay/scope change, prevents
   duplicate capacity, or reveals a bottleneck not visible in CapEx.
4. Record decisions or research priorities changed and the counterfactual without Track B.
5. Require at least two material decision improvements.
6. Require at least three timeline capabilities:
   - duplicate-capacity prevention;
   - planned versus executable separation;
   - schedule risk/cancellation/scope revision;
   - range-safe annual/quarterly presentation; or
   - material evidence unavailable from the closest tracker.

**Acceptance:** Evidence supports the claimed incremental value; visual polish and record count do not
qualify.

### WP10 — Maintenance simulation and cost gate

**Objective:** Estimate whether one person can maintain the product quarterly.

**Actions:**

1. Log discovery, acquisition, translation, extraction, identity resolution, review, correction, and
   output time separately.
2. Simulate one quarterly re-verification pass for the selected portfolio where feasible.
3. Record exception-update effort for at least one material event or representative replay.
4. Estimate mature quarterly and average weekly effort, identifying automatable versus inherently
   human review.
5. Compare measured effort with the human-approved maintenance budget.

**Acceptance:** Estimate is evidence-based, includes review/correction overhead, and does not assume
unimplemented automation.

**Stop:** Maintenance exceeds the approved budget without a separately reviewed scope reduction.

### WP11 — R2 closeout and recommendation

**Objective:** Deliver an auditable decision without implementing Track B.

**Actions:**

1. Run all acceptance and negative cases.
2. Compare protected paths with baseline.
3. Record completeness, failures, unknowns, maintenance cost, and limitations.
4. Assign technical verdict:
   - `TRACK_B_RESEARCH_FEASIBLE`;
   - `TRACK_B_RESEARCH_FEASIBLE_WITH_CONSTRAINTS`;
   - `TRACK_B_BLOCKED_NEW_DECISION`; or
   - `TRACK_B_NOT_FEASIBLE`.
5. Jimmy W. Su assigns product verdict:
   - `VALUE_CONFIRMED`;
   - `VALUE_PLAUSIBLE_BUT_UNPROVEN`; or
   - `NO_INCREMENTAL_VALUE`.
6. Recommend one of: stop, repeat a narrowed pilot, draft R3 execution plan, or retain manual research
   only.

**Acceptance:** Closeout includes exact artifacts, verification, protected-state comparison,
decision-value evidence, deferred work, and responsible-human verdict.

**Gate:** Even `VALUE_CONFIRMED` does not authorize R3, implementation, production, signals, UI,
commit, push, merge, or deployment.

## 10. Acceptance criteria

R1 passes only when:

- current repository contracts are characterized against code and tests;
- every reuse candidate has a compatibility and protected-state verdict;
- external candidates have legal, provenance, semantic, and freshness verdicts;
- the required new project/phase/tranche boundary is explicit;
- R2 can run without production writes; and
- an independent reviewer who did not produce the R1 verdict has reviewed the R1 evidence before any
  R2 portfolio-selection authorization; and
- no unresolved decision changes economic meaning or authorized scope.

R2 passes only when:

- approximately 15–25 projects form a coverage-labeled timeline seed;
- at least four of five depth cases have stable identity and credible primary evidence;
- every factual conclusion has exact document-version and locator evidence;
- project/phase/tranche deduplication and revision history are auditable;
- AI attribution, unit basis, capacity state, completion milestone, and time precision fail closed;
- annual/quarterly outputs contain no invented precision or double counting;
- competitor baseline exists for every depth case;
- at least two decisions materially improve;
- at least three timeline-specific capabilities are demonstrated;
- quarterly maintenance effort is measured and within the approved budget;
- required negative cases pass; and
- every `STRATEGIC_EXCEPTION` has a separate logged approval by Jimmy W. Su, and no exception was
  proposed and approved by the same executor acting alone;
- the mandatory second reviewer was assigned before WP5 and completed the depth-case comparison,
  with disagreements retained as explicit conflicts; and
- Jimmy W. Su assigns `VALUE_CONFIRMED`.

Failure of any mandatory criterion prevents a recommendation to draft R3.

## 11. Required negative cases

The pilot must explicitly test and document at least:

1. MOU or political announcement without executable evidence;
2. funded vision treated as confirmed expected capacity;
3. repeated government/operator/customer/vendor announcements of one project;
4. campus total counted again through phases;
5. full phase booked before partial commissioning tranches;
6. facility or utility power substituted for AI IT load;
7. mixed cloud/AI capacity assigned an unsupported AI share;
8. different accelerator generations converted into a synthetic equivalent;
9. annual/half-year completion narrowed to an invented quarter/date;
10. building completion treated as commissioned AI compute;
11. planned, installed, commissioned, or at-risk capacity added together;
12. unquantified capacity assigned a numeric estimate;
13. investment amount converted into MW;
14. scope revision overwritten instead of versioned;
15. canceled capacity deleted from history or retained in current expected total;
16. same URL serving a revised document;
17. multiple URLs originating from one release treated as independent;
18. discovery-tracker row accepted without original-source verification;
19. inaccessible/low-English evidence silently excluded from coverage; and
20. stale records presented as current or continuous monitoring.

## 12. Verification plan

### R1 commands and evidence

The executor must select exact commands after re-establishing the baseline, but minimum evidence is:

```bash
git status --short --branch
git log -5 --oneline --decorate
git diff --check
git diff --name-only <baseline>...HEAD
git diff -- data/ingestion
npm run verify:agent
```

`npm run verify:agent` is required before any R1 closeout that creates a repository checkpoint. If the
work remains purely uncommitted documentation and the responsible human authorizes a narrower check,
the deviation and rationale must be recorded.

### R2 research verification

R2 must include:

- schema or structured-record validation for disposable research data;
- duplicate identity and aggregation checks;
- deterministic rerun comparison for all five depth cases;
- manual second-review comparison;
- capacity reconciliation by project, phase, tranche, year/range, country, and region;
- explicit confirmed/planned/unquantified/unresolved reconciliation;
- source link/version/locator audit;
- source-access legality and permitted-method audit;
- coverage and stale-state audit;
- negative-case results; and
- protected-path comparison against WP0 baseline.

No test result may be described as passing if it was skipped, blocked by environment, or replaced by
manual inspection.

## 13. Time and resource budget proposed for approval

| Work package | Proposed elapsed budget | Human effort target |
|---|---:|---:|
| WP0 | 0.5 day | 1–2 hours |
| WP1–WP3 / R1 | 2 working days maximum | 8–12 hours |
| WP4 portfolio selection | 2 working days maximum | 6–8 hours |
| WP5–WP7 depth research | 12 working days maximum | 35–50 hours |
| WP8–WP9 timeline/value analysis | 6 working days maximum | 18–26 hours |
| WP10 maintenance simulation | 2 working days maximum | 6–8 hours |
| WP11 closeout | 1 working day maximum | 4–6 hours |
| R2 total | 23 working days maximum, within 5 weeks | approximately 69–98 hours |

The R2 total is a hard ceiling. Work-package estimates must be replanned downward rather than
extending the five-week limit. Waiting time caused by source unavailability does not authorize more
human effort or elapsed time; return for a scope decision when the ceiling would be exceeded.

Required checkpoints:

- after R1 verdict, before R2 authorization;
- after portfolio selection, before full research;
- after the first two depth cases, before completing the remaining three; and
- before final value verdict.

Proposed mature maintenance threshold for human approval:

- quarterly full review consistent with an average of no more than 2–4 human hours per week; and
- exception updates reserved for material official cancellation, delay, scope, or commissioning
  events.

If the pilot indicates higher recurring effort, stop and propose a narrower portfolio or cadence.

## 14. Stop conditions

Stop immediately and return to the responsible human if:

- authorization, branch, artifact ownership, or worktree ownership is unclear;
- repository baseline conflicts with the specification or this plan;
- a new schema, identity, production, signal, threshold, or UI decision becomes necessary;
- most cases lack project-specific AI attribution;
- stable identity cannot be established for at least four depth cases;
- core verification requires paid/private/inaccessible data;
- the required access method violates applicable site terms, `robots.txt`, authentication/payment
  boundaries, automated-access restrictions, or another source access control;
- unit or capacity definitions cannot be reconciled without inference;
- an external license or source term blocks intended reuse;
- the timeline becomes a manually scored news feed or generic facility map;
- coverage language cannot prevent false global completeness;
- maintenance exceeds the approved budget;
- acceptance criteria are untestable;
- production paths change unexpectedly;
- a requested `STRATEGIC_EXCEPTION` lacks explicit human approval; or
- value is merely plausible or duplicative.

## 15. Rollback and recovery

R1–R2 must be recoverable by removing their documentation and disposable research artifacts. They
must not require canonical migration, backfill, signal reversal, or UI rollback.

For every checkpoint:

- record the exact baseline and head;
- stage only authorized files;
- preserve unrelated user work;
- never force-push, rebase shared history, or reset by assumption;
- do not delete original source/version evidence to resolve conflicts;
- retain superseded research conclusions with reasons; and
- verify protected production paths remain identical.

If partial research fails, retain the failure evidence and mark the work package blocked; do not
rewrite the plan to imply completion.

## 16. Human decisions required before approval

Claude should identify omissions or contradictions, but Jimmy W. Su must decide:

1. Approve R1 only? R2 portfolio selection cannot be authorized until the WP3 verdict exists, and the
   R2 pilot cannot be authorized until WP4 and its second-reviewer gate are complete.
2. Is the R1 maximum two working days accepted?
3. Is the R2 maximum of 23 working days within five weeks / 69–98 human hours accepted?
4. Is the mature maintenance threshold of approximately 2–4 human hours per week accepted?
5. Is `FUNDED` excluded from confirmed capacity and retained only as a separate state?
6. Are global monetary totals excluded from the first production proposal?
7. Are sovereign AI and neocloud the approved first expansion channels?
8. Is the provisional Level 2 independence protocol approved for research only?
9. Is `docs/research/ai-infrastructure-observability/pilot/` the approved committed-artifact path?
10. May R1/R2 use temporary local source snapshots and translations that are not committed?
11. What commit/push/PR authority, if any, is granted for research artifacts?
12. Who performs the mandatory second review of the five depth cases? This may remain unresolved for
    R1 but must be resolved before WP5.

Any unanswered item that changes execution scope keeps this plan
`BLOCKED_PENDING_HUMAN_APPROVAL`.

## 17. Claude review checklist

Claude should review the current repository and classify each finding as `BLOCKER`, `HIGH`, `MEDIUM`,
or `LOW`. The review should answer:

### Scope and authority

- Does the plan accidentally authorize implementation, production, merge, or deployment?
- Are R1, R2, R3, production promotion, commit/push, and merge authorities separated?
- Are responsible-human decisions explicit?

### Architecture

- Is Track B additive and removable?
- Does the plan preserve Demand Layer v1 and avoid CapEx-to-MW inference?
- Are reuse candidates and new domain boundaries separated?
- Is Decision Intelligence the only planned join between independently validated layers?

### Evidence and domain semantics

- Can the rules prevent campus/phase/tranche double counting?
- Are AI IT load, facility power, utility supply, accelerator count, and planned upper bounds distinct?
- Are completion milestones, date precision, revision, cancellation, and schedule risk testable?
- Can `VERIFIED_UNQUANTIFIED`, `AI_UNRESOLVED`, and `STRATEGIC_EXCEPTION` fail closed?

### Feasibility and product value

- Can 15–25 projects and five depth cases be researched within the budget?
- Are coverage and maintenance-cost claims measurable?
- Does the value gate distinguish a real evidence ledger from a better map or news tracker?
- Are stop conditions early enough to avoid wasting the five-week pilot?

### Verification and rollback

- Are acceptance and negative cases sufficient and observable?
- Are production and protected-state comparisons adequate?
- Can failed or partial work be rolled back without corrupting evidence history?

Claude should not approve implementation. Recommended final review verdicts are:

- `APPROVE_R1_PLAN_ONLY`
- `APPROVE_R1_WITH_REQUIRED_CHANGES`
- `NOT_READY_FOR_R1_APPROVAL`

R2 should remain separately gated after the R1 compatibility verdict.

## 18. Progress log

| Date | Work package | Status | Evidence / note |
|---|---|---|---|
| 2026-08-27 | Plan drafting v0.1 | Completed | Initial detailed R1–R2 plan drafted; no execution authorized |
| 2026-08-27 | External review remediation v0.2 | Completed | Separated R1/R2 authority, added approval provenance, strategic-exception acceptance, and second-reviewer gate; no execution authorized |
| 2026-08-28 | Repository-connected review remediation v0.3 | Completed | Reconciled R2 budget, added source-access legality and independent R1 review gates, and clarified unresolved R2 budget ordering; no execution authorized |
| 2026-08-28 | WP0 | Blocked | External review findings incorporated; awaiting explicit responsible-human R1 authorization |

## 19. Decision log

| Date | Decision | Owner | Approval evidence | Rationale |
|---|---|---|---|---|
| 2026-08-27 | Preserve Demand Layer v1 and add Track B separately | Jimmy W. Su | spec `AR-009`–`AR-010`; Issue #5 approved checklist | Avoid rewriting implemented financial and supply-confirmation semantics |
| 2026-08-27 | Make confirmed commissioned-capacity timeline the highest-priority Track B output | Jimmy W. Su | spec `PR-008`; Issue #5 approved checklist | Connect capital intent to physically executable and realized compute capacity |
| 2026-08-27 | Use 50 MW AI IT load or 10,000 accelerators as default large threshold | Jimmy W. Su | spec `DR-012`; Issue #5 approved checklist | Focus the bounded product on materially large projects while preserving unit integrity |
| 2026-08-27 | Use five depth cases plus approximately 15–25 timeline projects | Jimmy W. Su | spec `PR-009`; Issue #5 approved checklist | Test evidence depth and aggregation value separately |
| 2026-08-27 | Require quarterly manual review and 120-day stale state | Jimmy W. Su | spec `CV-009`; Issue #5 approved checklist | Match a maintainable research cadence without claiming real-time monitoring |
| 2026-08-27 | Keep R1 and R2 execution unauthorized in this draft | Jimmy W. Su | this plan §2; external-review remediation | Claude review and explicit staged human approval are still required |

## 20. Closeout result

`NOT_STARTED`

Closeout must eventually record:

- final plan status and responsible-human verdict;
- R1/R2 exact baseline and final commits or artifact state;
- exact files and external sources inspected;
- verification commands and results;
- protected production-state comparison;
- failed, deferred, and superseded work;
- maintenance measurement;
- technical and product-value verdicts; and
- whether a separate R3 plan is recommended.
