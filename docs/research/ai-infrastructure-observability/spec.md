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

## 3. Scope

### In scope for research pilot

- preserve Demand Layer v1 as the hyperscaler and TSMC baseline;
- sovereign/national AI and neocloud/GPU-cloud physical-build projects;
- five cases: Middle East, Europe, Asia, U.S. government/scientific, and neocloud;
- at least one low-English-accessibility stress-test case;
- publicly disclosed defense funding may appear in the U.S. boundary case, but classified or inferred
  military activity is excluded;
- project/phase identity, source registry, lifecycle, deduplication, conflicts, AI attribution,
  coverage, unknowns, and decision value.

### Out of scope

- complete global AI demand or enterprise/defense coverage;
- paid/private intelligence, authenticated scraping, or hidden-demand estimates;
- automatic buy/sell, price target, portfolio, or beneficiary recommendations;
- production schema, canonical state, signals, or UI changes;
- changes to Demand Layer v1 semantics, identities, or history;
- Track C implementation before Track B and the value gate pass.

## 4. Requirements

### Product requirements

- **PR-001:** For each claim, state whether it is incremental, physically executable, and
  decision-relevant.
- **PR-002:** Optimize first for a long-term investor/independent researcher.
- **PR-003:** Compare pilot findings with Demand Layer v1 and ordinary headline research.
- **PR-004:** Require the product-value gate before implementation planning.
- **PR-005:** Never automate investment recommendations.

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

### Coverage and presentation

- **CV-001:** Coverage is a first-class object with availability, language, period, latency, and last
  verification date, independent of demand intensity.
- **CV-002:** Use categorical coverage states; no composite numeric coverage score without calibration
  and approval.
- **CV-003:** Aggregates and exports carry scope, coverage, evidence date, lower-bound semantics, and
  unquantified-project count.
- **CV-004:** Material totals remain visually bound to coverage context; no unlabeled headline total.
- **CV-005:** State data-as-of and evidence latency without implying continuous or complete monitoring.

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

## 5. Evidence policies to approve before pilot

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

## 6. Acceptance and negative cases

Pilot acceptance requires stable identity for at least four of five cases, a classified failure mode
for any unresolved case, credible primary evidence for at least four, auditable deduplication and
revision behavior, at least one useful scale measure for a meaningful subset, explicit unknowns, and
`VALUE_CONFIRMED`.

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

## 7. Open human decisions

1. Approve or revise the product question, primary user, and job to be done.
2. Approve sovereign AI and neocloud as first expansion channels.
3. Approve the AI-attribution and provisional Level 2 policies.
4. Decide whether and how `FUNDED` contributes to future aggregates.
5. Decide whether monetary totals are excluded from the first production proposal.
6. Set the maximum research and recurring maintenance time budget.
7. After value is proven, decide whether this remains a personal research advantage, becomes a
   public investor tool, or is tested as a commercial product.
