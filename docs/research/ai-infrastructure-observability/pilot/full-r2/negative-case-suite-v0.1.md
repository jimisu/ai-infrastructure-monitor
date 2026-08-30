# Full R2 required negative-case suite v0.1

**Status:** `RESEARCH_ONLY_ALL_REQUIRED_NEGATIVE_CASES_EXECUTED`

**Date:** 2026-08-30

**Observation cutoff:** 2026-08-30

**Scope:** execute every required negative test in specification §7 against the consolidated
research portfolio. This is a classification exercise over existing evidence and bounded mutations;
it does not acquire sources, construct an aggregate, assign the final R2 verdict, or authorize
implementation or production use.

## Result semantics

- `PASS_OBSERVED`: at least one portfolio case naturally contains the adverse input and the
  consolidation preserved the required fail-closed result.
- `PASS_BOUNDED_MUTATION`: the adverse interpretation was applied to an existing case even though the
  portfolio does not contain that exact real-world event; the approved rule rejects the mutation.
- A pass means only that the research representation handled this test. It does not establish an
  executable architecture test, production eligibility, source completeness, or mature maintenance.

No skipped test is reported as passing.

## Evidence, lifecycle, attribution, and source tests

| # | Required negative test | Portfolio input or bounded mutation | Required behavior | Result |
|---:|---|---|---|---|
| 1 | MOU without funding or binding contract | 14 Fluidstack France; 19 Kenya Olkaria | Keep outside confirmed-build population and exclude all proposal quantities | `PASS_OBSERVED` |
| 2 | Political rename or repeated announcement of the same investment | 1 Stargate UAE launch family; 16 Ulsan launch and groundbreaking | Preserve one project and versioned lifecycle events; do not multiply announcements | `PASS_OBSERVED` |
| 3 | Campus total confused with first-phase or AI-specific capacity | 1 UAE 5 GW/1 GW/200 MW; 9 Hyperion 5 GW; 15 Tomakomai 300/50 MW | Keep campus bounds non-additive and phases unresolved or separate | `PASS_OBSERVED` |
| 4 | MW, MWac, MWdc, IT load, or utility supply confused | 15 Tomakomai receiving power; 20 Scala grid envelopes; 22 Michigan service load | Exclude power figures unless project-specific AI IT-load basis is explicit | `PASS_OBSERVED` |
| 5 | Inconsistent local-currency/USD conversion | Mutate 20 Scala's separately reported R$3 billion and USD 500 million values into an unsupported conversion comparison | Preserve each source currency/value as evidence; do not convert, reconcile, or use as capacity | `PASS_BOUNDED_MUTATION` |
| 6 | Company aggregate CapEx allocated to one project | Mutate Demand Layer v1 issuer CapEx into any Track B project row | Reject the allocation; Track B remains independent and project-specific | `PASS_BOUNDED_MUTATION` |
| 7 | Customer or sponsor identity substituted for AI attribution | 18 HUMAIN supplier/JV roles and site reports; 10 Norway changing customer | Require project-specific AI wording; party identity cannot bridge unresolved site/phase scope | `PASS_OBSERVED` |
| 8 | Multiple articles originating from one release | 1 UAE coordinated launch family; 18 AMD/Cisco coordinated JV releases | Treat as one origin family; do not manufacture provisional Level 2 | `PASS_OBSERVED` |
| 9 | Supplier backlog accepted without counterforce analysis | Mutate a supplier backlog statement into confirmed project demand | Reject it from Track B lifecycle/capacity; incentives, cancellation, double ordering, and non-AI scope remain unresolved | `PASS_BOUNDED_MUTATION` |
| 10 | Delayed project classified as canceled | 19 Kenya power/payment dispute and continuing talks | Preserve `SCHEDULE_AT_RISK`; do not infer cancellation | `PASS_OBSERVED` |
| 11 | Same URL serving a revised document | Mutate a registered mutable URL into a later changed response without a new URL | Preserve observation/version uncertainty; later wording cannot silently overwrite prior state | `PASS_BOUNDED_MUTATION`; an actual two-version same-URL pair remains `NOT_DEMONSTRATED` |
| 12 | Absence of new evidence treated as deceleration | 8 Lancaster and 20 Scala lack later eligible build evidence | Record unknown/no eligible transition; do not infer demand deceleration, delay, or cancellation | `PASS_OBSERVED` |
| 13 | English-rich case selection overstating global feasibility | Six retained North American rows; no retained African or South American row | Disclose geographic/language bias and zero qualifying coverage; no complete-global claim | `PASS_OBSERVED` |

## External-data and differentiation tests

| # | Required negative test | Portfolio input or bounded mutation | Required behavior | Result |
|---:|---|---|---|---|
| 14 | Open-source tracker row copied without original-source re-verification | Mutate a closest-tracker comparison row into factual portfolio evidence | Reject the row; use trackers for discovery/comparison only and require original sources | `PASS_BOUNDED_MUTATION` |
| 15 | Facility map or initiative directory claimed as differentiated intelligence | TOP500, U.S. Data Center Atlas, and sovereign/facility tracker comparisons | Credit existing discovery value; claim increment only for evidence versioning, identity, lifecycle, conflict, or negative disposition | `PASS_OBSERVED` |
| 16 | External dataset license, attribution, freshness, or semantic limits ignored | Mutate an R1 external reuse candidate into accepted evidence without its recorded limitations | Keep outside committed factual state until all reuse checks pass | `PASS_BOUNDED_MUTATION` |
| 17 | Visual or record-count improvement mistaken for decision improvement | Mutate the 15-row minimum or a larger list into a value claim | Reject list size as product-value evidence; decision improvements remain separately gated | `PASS_BOUNDED_MUTATION` |

## Timeline, identity, and capacity-state tests

| # | Required negative test | Portfolio input or bounded mutation | Required behavior | Result |
|---:|---|---|---|---|
| 18 | Building completion treated as commissioned AI compute | Mutate construction/building-readiness evidence for 3 Sakai or 15 Tomakomai into commissioned AI service | Reject commissioning; require project-specific operating/service evidence | `PASS_BOUNDED_MUTATION` |
| 19 | Annual or half-year completion narrowed to invented quarter/date | 1 UAE 2026 target; 15 Tomakomai FY2026; 16 Ulsan 2027/2029 | Preserve source precision and leave quarter unallocated | `PASS_OBSERVED` |
| 20 | Accelerator generations converted to unsupported common equivalent | 2 Blackwell, 5 Hopper, 13 GH200, and 21 Trainium2 | Preserve model/generation and prohibit equivalent-count conversion | `PASS_OBSERVED` |
| 21 | Planned, installed, commissioned, or at-risk capacity added together | 5 Colossus configurations; 10 Norway commitments; 19 Kenya at-risk proposal | Keep states and versions non-additive | `PASS_OBSERVED` |
| 22 | Phased capacity counted at campus level and again by phase/tranche | 1 UAE; 6 Abilene; 9 Hyperion; 17 Jamnagar | Count a stable executable phase once; retain campus upper bounds separately | `PASS_OBSERVED` |
| 23 | Unquantified or AI-unresolved capacity assigned a numeric estimate | Eleven retained `VERIFIED_UNQUANTIFIED` rows and 18 HUMAIN identity failure | Keep as counts/coverage records only; create no numeric estimate | `PASS_OBSERVED` |
| 24 | Utility/facility power substituted for AI IT load | 3 Sakai, 9 Hyperion, 15 Tomakomai, 16 Ulsan, 20 Scala, and 22 Michigan | Exclude facility, receiving, grid, and service power from AI IT-load quantities | `PASS_OBSERVED` |
| 25 | Canceled phase removed from history or retained in current expected capacity | Mutate a current confirmed row with an evidence-backed cancellation event | Preserve historical row/event but remove canceled quantity from current expected state | `PASS_BOUNDED_MUTATION` |

Specification §7 contains 25 bullet tests. All 25 were executed: 16 against naturally observed
portfolio conditions and nine as bounded adverse interpretations of existing records. No result
requires lowering the large-project threshold or admitting an excluded quantity.

## Failure-mode findings

The most frequent observed failure modes are not lack of AI branding. They are:

1. campus/program wording without an executable phase or commissioning tranche;
2. facility, receiving, grid, or service power presented beside AI language but not established as
   AI IT load;
3. coordinated partner releases mistaken for independent corroboration;
4. current mutable pages without immutable version capture;
5. planned, installed, commissioned, and later-expanded quantities describing the same system at
   different times; and
6. English-accessible official sources producing a false sense of geographic completeness.

The suite therefore supports the existing fail-closed policy. It does not demonstrate that these
rules are automated, and it does not close the version-capture, legal-access, or source-independence
gaps.

## Gate result

`REQUIRED_NEGATIVE_CASE_SUITE_PASSED_AT_RESEARCH_REPRESENTATION_LEVEL`

T205 may be marked complete for Full R2 research. R3 executable fixtures and negative tests remain a
separate, unauthorized implementation stage. Aggregate construction and the final R2 verdict were
not started.
