# AI Infrastructure Observability — Product and Evidence Specification

**Status:** `DRAFT`
**Responsible human:** Jimmy Su
**Date:** 2026-08-27
**Implementation authorization:** `NOT_GRANTED`
**Production-write authorization:** `NOT_GRANTED`

## 1. Purpose

Define a verifiable product for distinguishing repeated AI-infrastructure announcements from
incremental physical commitments, tracking their progression, and identifying where real deployment
constraints are forming or moving.

This specification does not authorize research execution, schema changes, ingestion, production
promotion, signals, UI implementation, merge, or deployment.

## 2. Product value

### Problem

Public evidence is fragmented across budgets, procurement, permits, utilities, financing, company
filings, construction updates, and supplier disclosures. The same project is repeatedly announced by
different parties, while announced, funded, contracted, procured, constructed, and operational
capacity are routinely conflated.

### Primary user

A serious long-term investor or independent researcher who follows AI infrastructure without an
institutional data team. Jimmy is the initial design partner. Secondary users may later include small
investment teams, industry analysts, corporate strategy teams, journalists, and policy researchers.

### Job to be done

> When a material AI-infrastructure or supplier claim appears, determine whether it represents
> incremental and physically executable demand, what lifecycle transition occurred, which constraint
> it may tighten, what remains unknown, and which beneficiary conclusions are unsupported.

### Highest-priority product output — confirmed AI capacity timeline

The highest-priority product output is a coverage-bound timeline of publicly verified, large AI data
center phases worldwide. Its core question is:

> How much large-scale AI compute capacity is expected to become commissioned in each future year or
> quarter, which projects are most likely to arrive on time, and where capacity concentration may
> move physical-infrastructure bottlenecks?

The primary completion point is `COMMISSIONED`: project-specific primary evidence states that the
phase is operational or has begun providing AI compute. The system also preserves earlier
`INFRASTRUCTURE_READY` and `EQUIPMENT_INSTALLED` milestones because buildings, power/cooling readiness,
accelerator installation, and usable compute routinely occur at different times.

Only a phase supported by `CONTRACTED`, `PROCURED`, secured critical power, or
`UNDER_CONSTRUCTION` evidence enters the confirmed-build timeline. `ANNOUNCED`, ordinary MOU, funded
vision, or political commitment may remain discoverable but cannot enter confirmed expected capacity.

The default large-project threshold is either:

- at least 50 MW of project-specifically attributable AI IT load; or
- at least 10,000 disclosed data-center AI accelerators.

Facility power, utility supply, campus total, MWac, or MWdc does not satisfy the 50 MW threshold
unless eligible evidence establishes the AI IT-load basis. Accelerator generations remain separate;
the system does not manufacture H100-equivalent counts or theoretical-FLOPS conversions.

A human may approve `STRATEGIC_EXCEPTION` only when confirmed-build evidence exists and the phase is a
national compute backbone, frontier-model training facility, material new supply-chain node, or is
otherwise capable of materially changing regional capacity. The record must preserve the reviewer,
reason, and evidence; importance inferred from press attention is insufficient.

The timeline is global in search and presentation scope but means **publicly verified known
projects**, not a claim of complete global capacity. Every output carries coverage, language and
regional gaps, evidence date, and verification age.

### Differentiated value

The product is not a larger news feed or a claim about complete global demand. Its differentiated
asset is a version-aware, deduplicated, auditable evidence chain:

```text
source document version
-> physical project and phase
-> lifecycle progression
-> supported capacity bound or explicit unknown
-> constraint evidence
-> named-company exposure only when independently supported
```

### Product-value gate

Before implementation is recommended, a five-case research pilot must improve at least two real
decisions by doing one or more of the following:

- reject a repeated, non-incremental, or non-binding announcement;
- identify a lifecycle transition, delay, cancellation, or scope reduction;
- prevent cross-party duplicate counting;
- identify a bottleneck migration not visible in hyperscaler CapEx;
- expose a missing causal link in a named-company beneficiary thesis; or
- change research priority, confidence, or monitoring cadence.

The responsible human assigns exactly one verdict:

- `VALUE_CONFIRMED` — at least two decisions materially improved and benefit justifies continuation;
- `VALUE_PLAUSIBLE_BUT_UNPROVEN` — useful structure without demonstrated decision improvement; or
- `NO_INCREMENTAL_VALUE` — mainly restates public news or Demand Layer v1.

Only `VALUE_CONFIRMED` may support a recommendation to draft an implementation execution plan.

## 3. Open-source landscape and product boundary

An initial repository scan on 2026-08-27 found useful adjacent open-source systems but no mature
project that combines project-specific source versioning, physical-phase identity, deterministic
deduplication, commitment lifecycle, bottleneck evidence, and decision-value verification.

| Project | Useful existing capability | Boundary relative to this specification |
|---|---|---|
| [India Datacenter Watch](https://github.com/Ashwask/india-datacenter-watch) | Sourced facility records, operational/construction/proposed status, schema validation, link checking, community review | No retained source-document version, cross-announcement deduplication, commitment evidence hierarchy, or auditable project-phase progression |
| [US Data Center Atlas](https://github.com/ballacw1742/us-data-center-atlas) | Searchable map built from the PNNL/IM3 open data-center atlas | Primarily a facility inventory; not a commitment or bottleneck lifecycle ledger |
| [The Sovereign AI Tracker](https://github.com/machinelearnear/the-sovereign-ai-tracker) | National AI initiatives, status, funding fields, timelines, and links | Initiative-level curation rather than physical-project accounting and versioned evidence |
| [Open Infrastructure Map](https://github.com/openinframap/openinframap) | Mature global geospatial infrastructure presentation based on OpenStreetMap | Infrastructure location, not AI attribution, commitment progression, or investment causality |
| [Open Supply Hub](https://github.com/opensupplyhub/open-supply-hub) | Facility identity, matching/conflation, review, and global search | Reusable identity pattern, but not an AI/data-center commitment system |
| [GridStatus](https://github.com/gridstatus/gridstatus) | Source-specific ISO/RTO/EIA acquisition including grid and interconnection data | Reusable source-connector pattern, but not physical AI-project identity or lifecycle |
| [PUDL](https://github.com/catalyst-cooperative/pudl) | Public-energy data normalization, provenance, schemas, and quality controls | Reusable data-engineering reference, but not AI build commitment intelligence |

This proposal must not differentiate itself by merely publishing a data-center map, facility count,
source-link directory, or manually curated news list. Those capabilities already exist and are not
sufficient justification for a new maintained system.

The proposed differentiated boundary is:

> A reviewable physical-build evidence ledger that preserves exact source versions, accounts for one
> real project or executable phase once, proves lifecycle transitions, expresses conflicts and
> unknowns, and records whether the new evidence changes a decision.

### Reuse-before-build policy

R1 and R2 must evaluate whether existing open-source data, schemas, source connectors, identity
patterns, geospatial components, or validation approaches can be reused legally and semantically.
Reuse requires license compatibility, provenance retention, data-definition compatibility, freshness
assessment, and independent verification against the original source. An external tracker is a
discovery or corroboration aid unless its evidence satisfies this specification; it is never
automatically canonical.

### Competitive value test

For each pilot case, the decision log must state what a competent user could already learn from the
closest existing open-source tracker or public facility atlas. Track B adds value only when it
provides at least one material capability those references do not provide, such as document-version
verification, deterministic cross-party deduplication, project-phase resolution, supported lifecycle
transition, conflict preservation, or a decision-changing negative finding.

If the pilot mainly republishes, reformats, or summarizes existing trackers, the product verdict is
`NO_INCREMENTAL_VALUE` even when the output is accurate and visually superior.

## 4. Scope

### In scope for research pilot

- preserve Demand Layer v1 as the hyperscaler and TSMC baseline;
- sovereign/national AI and neocloud/GPU-cloud physical-build projects;
- a global timeline seed of approximately 15–25 material confirmed projects, including all
  still-uncommissioned qualifying phases found in scope and qualifying phases commissioned on or
  after 2024-01-01;
- five of those cases studied in evidence-ledger depth: Middle East, Europe, Asia, U.S.
  government/scientific, and neocloud;
- at least one low-English-accessibility stress-test case;
- publicly disclosed defense funding may appear in the U.S. boundary case, but classified or inferred
  military activity is excluded;
- project/phase identity, source registry, lifecycle, deduplication, conflicts, AI attribution,
  completion milestones, commissioning tranches, capacity, schedule risk, coverage, unknowns, and
  decision value;
- quarterly manual portfolio re-verification, with exception updates for material official
  cancellation, delay, scope revision, or commissioning events.

### Out of scope

- complete global AI demand or enterprise/defense coverage;
- paid/private intelligence, authenticated scraping, or hidden-demand estimates;
- automatic buy/sell, price target, portfolio, or beneficiary recommendations;
- production schema, canonical state, signals, or UI changes;
- changes to Demand Layer v1 semantics, identities, or history;
- conversion of company CapEx into project capacity or attribution of aggregate CapEx to one project;
- a claim that the timeline represents complete global AI capacity;
- model-derived completion dates, AI shares, MW, accelerator equivalents, or FLOPS;
- Track C implementation before Track B and the value gate pass.

## 5. Requirements

### Product requirements

- **PR-001:** For each claim, state whether it is incremental, physically executable, and
  decision-relevant.
- **PR-002:** Optimize first for a long-term investor/independent researcher.
- **PR-003:** Compare pilot findings with Demand Layer v1 and ordinary headline research.
- **PR-004:** Require the product-value gate before implementation planning.
- **PR-005:** Never automate investment recommendations.
- **PR-006 — Reuse before build:** Evaluate applicable open-source datasets, components, and
  validation patterns before proposing new equivalents.
- **PR-007 — Competitive increment:** Demonstrate decision-relevant capability beyond a sourced
  facility map, initiative directory, or news tracker.
- **PR-008 — Confirmed capacity timeline:** Make the coverage-bound expected commissioned-capacity
  timeline the highest-priority product output; derive schedule and regional concentration views from
  the same verified evidence.
- **PR-009 — Dual pilot:** Validate evidence-ledger depth with five cases and timeline coverage and
  aggregation value with approximately 15–25 cross-region projects.

### Evidence and verification

- **EV-001 — Tier-1-first:** Canonical eligibility starts with official issuer, regulator,
  government, utility, procurement, financing, permitting, or operator evidence.
- **EV-002 — Audit path:** Every factual conclusion resolves to the exact document version and a page,
  table, section, selector, paragraph, or equivalent locator.
- **EV-003 — Version preservation:** Preserve document identity, retrieval time, immutable snapshot or
  content hash, revision, and supersession.
- **EV-004 — Claim separation:** Preserve source wording separately from normalized fact,
  interpretation, and decision impact.
- **EV-005 — Independence:** Detect common origin and repetition; multiple URLs are not automatically
  independent evidence.
- **EV-006 — Conflict visibility:** Retain incompatible values/definitions with reasons; never average
  or silently select them.
- **EV-007 — Reproducibility:** Another reviewer following the same policy and evidence obtains the
  same identity, attribution, lifecycle, deduplication, and capacity-bound result.
- **EV-008 — Verification procedure:** Provide a reviewer-verifiable trail and escalate ambiguous AI
  attribution, identity merge, lifecycle transition, or financial transmission.

### Domain and data

- **DR-001 — Physical identity:** Physical project and independently executable phase are primary
  entities.
- **DR-002 — Deduplication:** Government, sponsor, operator, customer, and supplier evidence for one
  phase must not multiply demand.
- **DR-003 — Lifecycle:** Keep `ANNOUNCED`, `FUNDED`, `CONTRACTED`, `PROCURED`,
  `UNDER_CONSTRUCTION`, `OPERATIONAL`, `DELAYED`, `CANCELED`, and `UNKNOWN` distinct.
- **DR-004 — Incremental observation:** Record what changed from the previous verified state.
- **DR-005 — AI attribution:** Require project-specific primary evidence. General data-center wording,
  sponsor identity, job postings, or model inference are insufficient.
- **DR-006 — Unit integrity:** Preserve original and normalized currency/date basis and distinguish MW,
  MWac, MWdc, IT load, utility supply, accelerator count, campus, and phase capacity.
- **DR-007 — Bounds:** Prefer confirmed lower bounds, reported upper bounds, and unquantified verified
  counts over fabricated estimates.
- **DR-008 — Unknowns:** Missing public evidence is not zero demand, cancellation, delay, or
  deceleration.
- **DR-009 — Revision:** New document versions may revise observations without duplicating the
  project.
- **DR-010 — Confirmed-build eligibility:** Admit a phase to the confirmed timeline only with eligible
  `CONTRACTED`, `PROCURED`, critical-power-secured, or `UNDER_CONSTRUCTION` evidence.
- **DR-011 — Completion milestones:** Preserve reported time text, precision, earliest/latest bounds,
  and separate `INFRASTRUCTURE_READY`, `EQUIPMENT_INSTALLED`, and `COMMISSIONED` milestones. Never
  narrow a year, half-year, or range to an invented date or quarter.
- **DR-012 — Large-project classification:** Classify `QUANTIFIED_LARGE` only when project-specific
  evidence establishes at least 50 MW AI IT load or 10,000 AI accelerators. Preserve accelerator
  model/generation and original units without equivalent-compute conversion.
- **DR-013 — Phase and tranche accounting:** A campus is not an executable phase. Account for each
  independently executable phase and commissioning tranche once; retain campus total only as a
  non-additive reported planned upper bound.
- **DR-014 — Capacity states:** Keep confirmed executable, installed, commissioned, schedule-at-risk,
  reported planned upper bound, `VERIFIED_UNQUANTIFIED`, and `AI_UNRESOLVED` capacity distinct.
  Unquantified and unresolved capacity never enters numeric AI-capacity aggregates.
- **DR-015 — Schedule and scope events:** Preserve `OFFICIALLY_DELAYED`, evidence-backed
  `SCHEDULE_AT_RISK`, scope increase/reduction, cancellation, and supersession as separate reviewable
  events. Cancellation remains in history but is removed from current expected capacity.
- **DR-016 — Strategic exception:** Require confirmed-build evidence, a defined structural-impact
  criterion, human approval, rationale, and source trail; strategic exceptions remain unquantified
  unless eligible capacity evidence exists.

### Coverage and presentation

- **CV-001:** Coverage is a first-class object with availability, language, period, latency, and last
  verification date, independent of demand intensity.
- **CV-002:** Use categorical coverage states; no composite numeric coverage score without calibration
  and approval.
- **CV-003:** Aggregates and exports carry scope, coverage, evidence date, lower-bound semantics, and
  unquantified-project count.
- **CV-004:** Material totals remain visually bound to coverage context; no unlabeled headline total.
- **CV-005:** State data-as-of and evidence latency without implying continuous or complete monitoring.
- **CV-006:** The primary timeline aggregates only quantified confirmed expected capacity. Mark the
  at-risk subset visually, present planned upper bounds separately, and show unquantified project
  counts without assigning estimated capacity.
- **CV-007:** A year-level disclosure may enter an annual bucket; half-year or ranged disclosures stay
  ranged or unallocated in quarter views. Never distribute capacity across quarters by assumption.
- **CV-008:** Preserve site, city/administrative area, country, and analytical region. Geographic
  presentation must not replace the timeline as the primary product output.
- **CV-009:** Perform full manual re-verification quarterly, allow exception updates for material
  official events, display `last_verified_at`, and mark a record `STALE` after 120 days.

### Architecture and operations

- **AR-001:** Separate research candidates, factual evidence, interpretation, signals, and
  presentation.
- **AR-002:** Demand Layer v1 remains unchanged by this specification.
- **AR-003:** Use faithful fixtures and disposable proposed state before any production write.
- **AR-004:** Same source version and semantics are idempotent.
- **AR-005:** Unsupported source, identity, unit, attribution, lifecycle, or causal linkage fails
  closed with a reason.
- **AR-006:** A future Track B layer must be removable without corrupting existing data or signals.
- **AR-007:** Future implementation requires negative tests, repository completion guardrails, and
  protected-state comparison.
- **AR-008:** External open-source data remains discovery/corroboration input until license,
  provenance, semantic compatibility, freshness, and original-source verification pass.
- **AR-009:** Track B is an additive project/phase evidence store, not an extension of numeric
  `MetricObservation`. It may reuse acquisition, immutable snapshot, document-version, provenance,
  coverage, proposed-state, HTTP, and verification infrastructure only after R1 compatibility passes.
- **AR-010:** Demand Layer v1 and Track B facts join only in Decision Intelligence after each layer is
  independently validated. Track B must not rewrite CapEx, TSMC, canonical, or existing signal
  history, and the presentation layer must not recompute timeline semantics from raw evidence.

### Track C

- **TC-001:** Track C planning requires an approved stable Track B baseline and `VALUE_CONFIRMED`.
- **TC-002:** Preserve separate evidence for project progression, component need, constraint, supplier
  exposure, and financial transmission.
- **TC-003:** Industry scarcity does not prove a named-company order or benefit.
- **TC-004:** Financial transmission requires company-specific evidence for timing, recognition,
  currency, cancellation, concentration, margins, and valuation uncertainty.
- **TC-005:** Represent supply expansion, substitution, bargaining power, double ordering, and
  inventory correction.

### Governance

- **GV-001:** Draft, approve, research, implement, promote, commit, push, PR, merge, and deploy are
  separate authorities.
- **GV-002:** Record decisions, rejected alternatives, evidence, and responsible human.
- **GV-003:** Stop for unclear baseline, incompatible provenance/identity, inaccessible required data,
  untestable acceptance, a new policy choice, or absent incremental value.
- **GV-004:** Approved work packages must map to GitHub issues carrying requirement IDs,
  dependencies, acceptance criteria, forbidden scope, and gate status.

## 6. Evidence policies to approve before pilot

### AI attribution

- `AI_EXPLICIT`: a project-specific primary source explicitly names AI training/inference, AI
  accelerators, an AI-compute system/service, or a government/scientific AI program tied to the
  facility or procurement.
- `AI_PARTIAL`: only a documented portion of mixed-use capacity is AI-specific; only that portion is
  attributable.
- `AI_UNRESOLVED`: AI is plausible but not proven project-specifically.
- `NOT_AI_SPECIFIC`: the source supports general cloud, colocation, enterprise, HPC, or data-center
  capacity without explicit AI evidence; this does not claim AI will never run there.

AI may draft and apply candidates; the responsible human approves policy, and a human reviews
ambiguous classifications.

### Provisional Level 2 corroboration

Research-only Level 2 requires at least two independently originated sources, at least one
project-specific primary source, agreement on project/phase, fact, capacity basis, and time period,
plus documented independence analysis. Repetition cannot manufacture corroboration. Level 2 remains
production-ineligible without later approval.

### Coverage categories

Use `AVAILABLE_STRUCTURED`, `AVAILABLE_UNSTRUCTURED`, `PARTIAL`, `DELAYED`, `INACCESSIBLE`, or
`UNKNOWN`, with source class, covered period, language, last verification date, and note.

### Timeline aggregation policy

- `COMMISSIONED` requires project-specific primary evidence that the applicable phase is operational
  or providing AI compute. Building completion, power/cooling readiness, and equipment installation
  remain earlier milestones.
- Partial commissioning is recorded as dated tranches. A 100 MW phase commissioning 25 MW and later
  75 MW contributes those amounts at their supported times, while phase total remains 100 MW.
- Reported future accelerator deployment and verified installed/commissioned accelerators remain
  separate and are never added together.
- Current views use the latest supported version while preserving prior values and effective periods;
  revisions generate explicit scope-change events rather than overwriting history.
- Mixed cloud/AI facilities without a supported AI share are `AI_UNRESOLVED`. Investment amount is
  not a capacity proxy.

## 7. Acceptance and negative cases

### Ten-working-day micro-pilot boundary

A separately authorized ten-working-day program may complete R1 and then test two depth cases with a
5–8-project discovery pool. It is an early feasibility and incremental-value gate, not the dual R2
pilot required by `PR-009`. It cannot claim global coverage, R2 completion, mature quarterly
maintenance, or implementation readiness. All evidence, identity, attribution, unit, time-precision,
provenance, independent-review, protected-state and fail-closed rules remain unchanged.

The micro-pilot may demonstrate only one material decision improvement and two timeline capabilities
as directional evidence. A positive micro-pilot result authorizes nothing automatically; Jimmy W. Su
must separately decide whether to stop, repeat a narrowed research exercise, or authorize the full
R2 portfolio-selection gate.

Pilot acceptance requires stable identity for at least four of five depth cases, a classified failure mode
for any unresolved case, credible primary evidence for at least four, auditable deduplication and
revision behavior, a 15–25-project global timeline seed, explicit unknowns, measured quarterly
maintenance effort, and `VALUE_CONFIRMED`.

Product-value acceptance also requires a competitor baseline for every case and at least two pilot
findings whose decision value could not be obtained by merely viewing the identified open-source
trackers. A better visual presentation, a larger unsourced list, or aggregation without new evidence
semantics does not satisfy this criterion.

The timeline pilot must additionally demonstrate at least three of the following:

- prevent cross-party or campus/phase duplicate capacity;
- separate reported planned upper bounds from confirmed executable capacity;
- expose a supported schedule risk, cancellation, or scope revision;
- present annual/quarterly capacity without manufacturing date precision;
- reveal a material evidence difference unavailable from the closest existing tracker.

Required negative tests include:

- MOU without funding or binding contract;
- political rename or repeated announcement of the same investment;
- campus total confused with first-phase or AI-specific capacity;
- MW/MWac/MWdc/IT-load/utility-supply confusion;
- inconsistent local-currency/USD conversion;
- company aggregate CapEx allocated to one project;
- customer/sponsor identity substituted for AI attribution;
- multiple articles originating from one release;
- supplier backlog accepted without incentive, cancellation, double-ordering, or non-AI analysis;
- delayed project classified as canceled;
- same URL serving a revised document;
- absence of new evidence treated as deceleration; and
- English-rich case selection overstating global feasibility.
- existing open-source tracker rows copied without original-source re-verification;
- facility-map or initiative-directory output incorrectly claimed as differentiated intelligence;
- external dataset license, attribution, freshness, or semantic limitations ignored; and
- visual or record-count improvement mistaken for decision improvement;
- building completion treated as commissioned AI compute;
- annual or half-year completion narrowed to an invented quarter or date;
- different accelerator generations converted to an unsupported common equivalent;
- planned, installed, commissioned, or at-risk capacity added together;
- phased capacity counted once at campus level and again by phase or tranche;
- unquantified or AI-unresolved capacity assigned a numeric estimate;
- utility/facility power substituted for AI IT load; and
- a canceled phase removed from history or retained in current expected capacity.

## 8. Open human decisions

1. Approve or revise the product question, primary user, and job to be done.
2. Approve sovereign AI and neocloud as first expansion channels.
3. Approve the AI-attribution and provisional Level 2 policies.
4. Decide whether and how `FUNDED` contributes to future aggregates.
5. Decide whether monetary totals are excluded from the first production proposal.
6. Set the maximum research and recurring maintenance time budget.
7. After value is proven, decide whether this remains a personal research advantage, becomes a
   public investor tool, or is tested as a commercial product.
8. Approve or revise the open-source landscape, reuse-before-build policy, and differentiated product
   boundary in Section 3.

## 9. Human decisions recorded for this draft

On 2026-08-27, Jimmy W. Su confirmed the product semantics in the highest-priority timeline section,
`PR-008`–`PR-009`, `DR-010`–`DR-016`, `CV-006`–`CV-009`, and `AR-009`–`AR-010`. This approval
authorizes documentation updates to PR #6 and Issue #5 only. It does not authorize R1 or R2 execution,
implementation, production writes, UI changes, PR readiness, merge, or deployment.
