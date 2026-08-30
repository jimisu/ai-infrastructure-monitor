# Full R2 portfolio consolidation v0.1

**Status:** `RESEARCH_ONLY_CONSOLIDATED_WITH_QUALIFYING_SEED_SHORTFALL`

**Date:** 2026-08-30

**Observation cutoff:** 2026-08-30

**Scope:** consolidate the five reviewed depth cases and portfolio candidates 6–20 into one
fail-closed identity, lifecycle, capacity-disposition, and timeline-eligibility register. This does
not acquire new sources, replace excluded candidates, execute the negative-case suite, publish a
numeric aggregate, assign the final R2 verdict, or authorize implementation or production use.

## Governing carry-forward rules

1. Count a project, executable phase, or commissioning tranche once. Sponsor, customer, operator,
   supplier, campus, building, system, and program names do not create additive capacity.
2. Retain `CONTRACTED`, `PROCURED`, secured-critical-power, `UNDER_CONSTRUCTION`, or commissioned
   projects in the confirmed timeline population only when the minimum identity is stable enough not
   to multiply an unresolved scope.
3. The ordinary large threshold remains at least 50 MW of project-specific AI IT load or 10,000
   disclosed AI accelerators. Facility power, receiving power, utility supply, campus totals, design
   ceilings, performance, and monetary value do not substitute.
4. `COMMISSIONED` requires project-specific operating/service evidence. Observation bounds do not
   manufacture an earlier commissioning-event date.
5. Planned upper bounds, verified-unquantified projects, at-risk projects, below-threshold systems,
   and identity-unresolved programs stay separate from quantified confirmed expected capacity.
6. Accelerator models and generations remain separate. No equivalent-count or cross-model total is
   created.

## Consolidated register

| # | Consolidated minimum identity | Region | Current lifecycle | Identity state | Capacity disposition | Timeline treatment |
|---:|---|---|---|---|---|---|
| 1 | Stargate UAE 1 GW cluster; first reported 200 MW retained as unresolved tranche | Middle East | `UNDER_CONSTRUCTION` | `STABLE_CLUSTER / TRANCHE_UNRESOLVED` | No eligible AI IT-load or installed-accelerator quantity | Retain `VERIFIED_UNQUANTIFIED`; calendar-year 2026 target only |
| 2 | Deutsche Telekom Industrial AI Cloud at Munich Tucherpark | Europe | `COMMISSIONED / OPERATIONAL` | `STABLE_DEPLOYMENT` | 10,000 NVIDIA Blackwell GPUs, Level 1 | Retain numeric annual-2026 commissioned-capacity row; no narrower quarter |
| 3 | Osaka Sakai AI Data Center at former Sharp site | Asia | `UNDER_CONSTRUCTION` | `STABLE_PROJECT / PHASE_UNRESOLVED` | Receiving-power and ExaFLOPS values excluded | Retain `VERIFIED_UNQUANTIFIED`; no commissioning date |
| 4 | El Capitan compute system at LLNL | North America | `COMMISSIONED / OPERATIONAL` | `STABLE_SYSTEM` | Ordinary threshold not established; supporting power and incomplete APU ratio excluded | Exclude from ordinary large-project timeline absent human `STRATEGIC_EXCEPTION` |
| 5 | xAI Colossus original 100,000-Hopper configuration, Memphis | North America | `COMMISSIONED / OPERATIONAL` | `STABLE_ORIGINAL_CONFIGURATION / EXPANSION_UNRESOLVED` | 100,000 Hopper as commissioned as-of lower bound, Level 1 | Retain as-of stock row; no commissioning-flow year or quarter; later totals excluded |
| 6 | Stargate Abilene eight-building program, with original two-building phase separated | North America | First phase `COMMISSIONED`; expansion `UNDER_CONSTRUCTION` | `STABLE_PROGRAM / PHASES_SEPARATED` | Facility/campus power and design-system ceilings excluded | Retain phases as `VERIFIED_UNQUANTIFIED`; no numeric contribution |
| 7 | Microsoft Fairwater Mount Pleasant facility, Wisconsin | North America | `COMMISSIONED / OPERATIONAL` | `STABLE_FACILITY / NETWORK_EXCLUDED` | Non-exact GPU wording and network/facility power excluded | Retain `VERIFIED_UNQUANTIFIED`; operational by 2026-06-23 observation |
| 8 | CoreWeave Lancaster proposed AI data center | North America | `ANNOUNCED / FUNDED_INTENT` | `STABLE_PROPOSAL / EXPANSION_SEPARATED` | 100/300 MW planned facility bounds excluded | Exclude from confirmed timeline; planned-discovery row only |
| 9 | Meta Hyperion campus, Richland Parish | North America | `UNDER_CONSTRUCTION` | `STABLE_CAMPUS / EXECUTABLE_PHASE_UNRESOLVED` | 5 GW campus IT-capacity upper bound not booked to a phase | Retain confirmed-build campus as `VERIFIED_UNQUANTIFIED`; upper bound separate |
| 10 | Stargate Norway Kvandal facility/JV | Europe | `CONTRACTED` | `STABLE_FACILITY / CUSTOMER_AND_TRANCHE_UNRESOLVED` | 230/290 MW and 100,000/30,000 GPU forward quantities remain non-additive | Retain `VERIFIED_UNQUANTIFIED`; no commissioned contribution |
| 11 | Nebius Mäntsälä 25-to-75 MW expansion | Europe | `COMMISSIONED / OPERATIONAL` | `STABLE_SITE_EXPANSION` | 60,000-GPU hosting ceiling and site MW excluded | Retain `VERIFIED_UNQUANTIFIED`; operational expansion, no numeric contribution |
| 12 | Isambard-AI phases 1–2 as one 5,448-GH200 system | Europe | `COMMISSIONED / OPERATIONAL` | `STABLE_SYSTEM` | Eligible disclosed count but below 10,000 threshold | Exclude from ordinary large-project timeline; below-threshold comparator only |
| 13 | JUPITER system; Booster and Cluster treated as components | Europe | `COMMISSIONED / OPERATIONAL` | `STABLE_SYSTEM` | Approximately 24,000 NVIDIA GH200, exact version and Level 2 pending | Provisionally retain annual-2025 numeric row; no invented narrower date or exact count |
| 14 | Fluidstack standalone French AI supercomputer proposal | Europe | `MOU / ANNOUNCED` | `STABLE_PROPOSAL / SITE_UNRESOLVED` | 1 GW and processor figures are announcement/design bounds | Exclude from confirmed timeline; MOU negative case |
| 15 | SoftBank Tomakomai first data-hall phase | Asia | `UNDER_CONSTRUCTION` | `STABLE_PROJECT / CAMPUS_SEPARATED` | 50 MW receiving capacity and 300 MW campus maximum excluded | Retain `VERIFIED_UNQUANTIFIED`; FY2026 target only |
| 16 | SK–AWS Ulsan first 41 MW phase and 103 MW facility | Asia | `UNDER_CONSTRUCTION` | `STABLE_FACILITY / PHASES_SEPARATED` | Facility MW and later GW ambitions excluded | Retain `VERIFIED_UNQUANTIFIED`; 2027 first-operation and 2029 completion targets separate |
| 17 | Reliance Jamnagar AI-ready campus; Meta 168 MW built-to-suit linked but separate | Asia | Campus `UNDER_CONSTRUCTION`; Meta project `CONTRACTED / DEVELOPMENT` | `STABLE_CAMPUS / EXECUTABLE_TRANCHE_UNRESOLVED` | Gigawatt-scale and 168 MW data-center capacity not proven as AI IT load | Retain `VERIFIED_UNQUANTIFIED`; no numeric contribution |
| 18 | HUMAIN/AMD/Cisco multi-site program and reported Riyadh/Dammam sites | Middle East | Program/JV `CONTRACTED_INTENT`; site construction independently reported | `PROGRAM_TO_SITE_IDENTITY_UNRESOLVED` | 100/500/1,000 MW scopes overlap and are not site-bound | Exclude from confirmed portfolio row until program, site, phase, and equipment are bridged |
| 19 | Microsoft/G42/EcoCloud Olkaria proposed campus | Africa | `MOU / LETTER_OF_INTENT`; `SCHEDULE_AT_RISK` | `STABLE_PROPOSAL / FINAL_SCOPE_UNRESOLVED` | 100 MW/1 GW proposal scopes excluded; power and payment terms disputed | Exclude from confirmed timeline; retain MOU/risk/conflict negative case |
| 20 | Scala AI City, Eldorado do Sul | South America | `PROTOCOL_OF_INTENT / POWER_CONNECTION_PATH_APPROVED` | `STABLE_CAMPUS_PROPOSAL / PHASE_UNRESOLVED` | 1.8/4.75/5 GW grid and campus envelopes excluded | Exclude from confirmed timeline pending binding power and construction |

## Population disposition

| Population | Cases | Count | Permitted use |
|---|---|---:|---|
| Confirmed-build or commissioned rows retained in the research timeline | 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 15, 16, 17 | 13 | Timeline rows with numeric and unquantified states kept separate |
| Ordinary numeric candidates | 2, 5, 13 | 3 | Model-specific observations only; no cross-model sum |
| Confirmed/operational but ordinary large threshold not met | 4, 12 | 2 | Comparator or separately approved strategic exception only |
| No confirmed-build eligibility | 8, 14, 19, 20 | 4 | Planned/negative/discovery records only |
| Identity prevents a stable confirmed project row | 18 | 1 | Conflict/coverage record only until resolved |

The 13 retained rows are not a claim of 13 numerically quantified projects. Ten of them are
`VERIFIED_UNQUANTIFIED`; only three retain an accelerator quantity, and those quantities have
different model and time semantics.

## Numeric non-aggregation matrix

| Case | Quantity | Model/generation | Time semantic | Allowed presentation | Prohibited presentation |
|---|---:|---|---|---|---|
| xAI Colossus | 100,000 | NVIDIA Hopper, exact model unresolved in accepted wording | Operating by 2024-10-28 observation | Commissioned as-of lower-bound stock | 2024 commissioning flow, Level 2, or later expansion total |
| Munich Industrial AI Cloud | 10,000 | NVIDIA Blackwell | Exact current state established in 2026; annual placement only | Annual-2026 commissioned-capacity row | Narrower quarter or retrospective launch-date count |
| JUPITER | approximately 24,000 | NVIDIA GH200 Grace Hopper | Operational/inaugurated in 2025 | Provisional annual-2025 row with approximation marker | Exact 24,000, cross-model equivalent, or Level 2 before review |

No portfolio-wide accelerator sum is produced. Adding Hopper, Blackwell, and GH200 would erase model
generation and time semantics and would violate the approved policy even though all are accelerators.

## Identity and deduplication decisions

- One campus is not automatically one executable phase. Hyperion, Sakai, Jamnagar, and Scala retain
  unresolved phase boundaries rather than multiplying buildings or future tranches.
- A service, facility, and distributed network are separate identities. Munich is one deployment;
  Wisconsin Fairwater is not the global Fairwater network.
- A customer, sponsor, supplier, operator, and owner do not create separate projects. This prevents
  double counting across Stargate, AWS/SK, Microsoft/G42, and HUMAIN vendor announcements.
- Historical and current quantities are versioned, not added. Colossus 100,000/180,000/200,000,
  Norway customer changes, and Ulsan expansion ambitions remain separate states.
- System components are non-additive. JUPITER Booster/Cluster and Isambard nodes/superchips are each
  consolidated into one system identity.

## Qualifying-seed gate

The approved Full R2 target requires approximately 15–25 qualifying timeline projects. This
consolidation retains only 13 of the selected 20 as confirmed-build or commissioned rows. The shortfall
is not repaired by admitting:

- El Capitan or Isambard-AI without an approved threshold exception;
- Lancaster, Fluidstack, Kenya, or Scala without confirmed-build evidence; or
- HUMAIN without a stable site/phase identity.

Gate result:

`QUALIFYING_SEED_SHORTFALL_13_OF_15_MINIMUM`

This blocks completion of the portfolio-level timeline and final R2 verdict. It does not invalidate
the 13 retained rows or the negative-case value of the seven excluded/held cases. Resolving the gap
requires a new responsible-human decision to authorize at least two qualifying replacement candidates
or to stop Full R2 with a scope-failure verdict. The executor may not weaken the 15-project minimum.

## Remaining authorized research that does not resolve the shortfall

- Execute the negative-case suite against the existing 20 cases.
- Produce coverage and failure-mode analysis without claiming a qualifying global seed.
- Preserve actual effort and run a bounded maintenance simulation on the retained rows.
- Obtain independent review of consolidation and any later artifacts.

Numeric portfolio aggregation and final closeout must remain blocked until the qualifying-seed
decision is resolved.

## Consolidation result

`IDENTITIES_AND_DISPOSITIONS_CONSOLIDATED_FAIL_CLOSED`

This artifact is research-only. It creates no canonical identity, production data, signal, scoring,
threshold, UI, PR-readiness, merge, or deployment authority.
