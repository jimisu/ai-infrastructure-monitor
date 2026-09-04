# Lean quarterly transition baseline v0.1

**Status:** `RESEARCH_ONLY_FIXED_15_CASE_BASELINE_NO_CAPACITY_AGGREGATE`

**Baseline cutoff:** 2026-08-30

**Authorized scope:** fixed 15-case cohort; non-production quarterly transition ledger; comparison
with existing CSP/TSMC evidence and public NVIDIA order visibility. No candidate addition, threshold
change, cross-model capacity total, production code, signal, UI, merge, or deployment.

## Decision question

Does project-level evidence change a decision that could otherwise be made more cheaply from NVIDIA
order visibility plus the implemented CSP/TSMC Demand Layer?

This baseline does not answer acceleration or deceleration. It freezes the first comparable cohort
so later quarters can record changes without reconstructing or expanding the population.

## Allowed transition vocabulary

Each quarterly update records only evidence-backed changes in these categories:

1. `BINDING_CONTRACT`
2. `CRITICAL_POWER_SECURED`
3. `CONSTRUCTION_START`
4. `EQUIPMENT_INSTALLATION`
5. `COMMISSIONED_OPERATIONAL`
6. `DELAY_SCOPE_REDUCTION_CANCELLATION`

No new publication is itself a transition. Repeated announcements, supplier/customer names, campus
upper bounds, facility or utility power, and different accelerator generations remain non-additive.

## Cheaper comparison baseline

| Evidence layer | Baseline observation | Boundary |
|---|---|---|
| CSP CapEx | Existing deterministic engine has four eligible hyperscalers and a positive 4-of-4 breadth result with high confidence | Issuer-level total CapEx or property-and-equipment evidence; not AI-only and not project capacity |
| Meta | 2026 annual guidance moved from USD 115–135B at 2025-Q4 to USD 130–145B at 2026-Q2 | Company-wide guidance including its approved definition; no allocation to Hyperion |
| Microsoft | Management-reported quarterly total CapEx rose materially year over year through FY2026-Q3, while the YoY growth rate slowed from FY2026-Q1 through Q3 | High spending and slower growth can coexist; no project attribution |
| Google | 2025 guidance rose from about USD 75B to USD 91–93B; initial 2026 range is USD 175–185B | Purchases of property and equipment; not AI-only |
| TSMC | Jan–Jun 2026 monthly revenue momentum produced a positive 3M acceleration result; Q3 2026 revenue guidance was USD 44.6–45.8B versus Q2 actual USD 40.2B | Semiconductor supply confirmation; not attributable to one CSP or project |
| NVIDIA | FY2027 Q2 Data Center revenue was USD 89.0B, +117% YoY; management described demand as accelerating | Vendor revenue and management visibility do not prove customer-site execution |
| NVIDIA commitments | Supply/capacity commitments increased from USD 119B in the prior quarter to USD 279B at 2026-07-26, primarily memory and manufacturing facilities | Some agreements may be cancelable, reschedulable, or adjustable before firm orders |
| NVIDIA physical-build visibility | NVIDIA says land, power, and shell are a critical phase; it now supports selected customers with land/power/shell, leases, guarantees, and AI-cloud agreements | This materially overlaps a generic Track B thesis and raises the bar for incremental value |

NVIDIA sources inspected manually on 2026-08-30:

- [FY2027 Q2 results](https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/default.aspx)
- [FY2027 Q2 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm)
- [FY2027 Q2 CFO commentary](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000073/q2fy27cfocommentary.htm)

No NVIDIA source bytes are committed. Exact future reproduction depends on the linked issuer/SEC
documents remaining available.

## Fixed 15-case cohort

| # | Stable minimum unit | Baseline state | Latest supported event bound | Numeric boundary | Next-quarter material trigger |
|---:|---|---|---|---|---|
| 1 | Stargate UAE 1 GW cluster; initial tranche unresolved | `UNDER_CONSTRUCTION` | Construction progress reported 2025-10-16; 2026 target remains prospective | 5 GW campus, 1 GW cluster, and 200 MW tranche not booked as AI IT load | Equipment installation, service start, schedule revision, or export/procurement constraint |
| 2 | Deutsche Telekom Industrial AI Cloud, Munich | `COMMISSIONED / OPERATIONAL` | Exact 10,000 Blackwell operating statement observed 2026-06-18 | One annual-2026 Blackwell observation; no cross-model sum | Utilization/service evidence, expansion as a separate tranche, or scope reduction |
| 3 | Osaka Sakai AI Data Center | `UNDER_CONSTRUCTION` | Construction wording observed 2026-06-09; earlier 2025 operation target revised to 2026 | 140/150/>250 MW receiving-power versions and ExaFLOPS excluded | Operation, equipment installation, another schedule revision, or cancellation |
| 5 | xAI Colossus original 100,000-Hopper configuration | `COMMISSIONED / OPERATIONAL` | Operating 100,000-Hopper lower bound observed 2024-10-28 | Later 180,000/200,000/one-million scopes not added | Separately bounded expansion, retirement, utilization evidence, or scope change |
| 6 | Stargate Abilene original two-building phase; expansion separate | First phase `COMMISSIONED`; expansion `UNDER_CONSTRUCTION` | First phase live by 2025-09-30 observation | Campus/facility power and delivered percentages excluded | Another building/tranche commissioned, delay, or phase-specific contraction |
| 7 | Microsoft Fairwater Mount Pleasant, Wisconsin | `COMMISSIONED / OPERATIONAL` | Operational by 2026-06-23 observation | Non-exact GPU language and facility/network power excluded | Expansion, utilization evidence, or project-specific schedule/scope change |
| 9 | Original Project Laidley under LPSC U-37425 | `CONTRACTED_CRITICAL_POWER / UNDER_CONSTRUCTION` | Binding 15-year service agreement and construction described 2026-02-25 | Hyperion 5 GW campus, Project Evest, and utility resources excluded | Power-contract revision, project-specific delay, equipment installation, or operation |
| 10 | Stargate Norway Kvandal facility | `CONTRACTED` | Microsoft full-site contract and 30,000 Rubin commitment reported 2026-05-08 | 230/290 MW and 100,000/30,000 accelerator commitments remain forward and non-additive | Construction, equipment delivery, customer revision, delay, or cancellation |
| 11 | Nebius Mäntsälä 25-to-75 MW expansion | `COMMISSIONED / OPERATIONAL` | Issuer said expansion completed earlier in 2026, observed 2026-03-31 | 75 MW site capacity and 60,000-GPU hosting ceiling excluded | Installed/active configuration evidence, utilization, or separate expansion |
| 13 | JUPITER system | `COMMISSIONED / OPERATIONAL` | Inaugurated 2025-09-05 with approximately 24,000 GH200 | Approximation and model retained; components not added | Configuration revision, retirement, or material operating restriction |
| 15 | SoftBank Tomakomai first data-hall phase | `UNDER_CONSTRUCTION` | Municipal 2025 publication confirms construction; FY2026 remains the service target | 50 MW receiving capacity and 300 MW campus maximum excluded | Operation, equipment installation, target revision, or cancellation |
| 16 | SK–AWS Ulsan first phase; later facility phases separate | `UNDER_CONSTRUCTION` | Groundbreaking 2025-08-29; 2027 first-operation and 2029 completion targets retained | 41/103 MW facility phases and later GW ambitions excluded | Power/equipment contract, phase operation, schedule revision, or cancellation |
| 17 | Meta/Reliance Jamnagar first 168 MW built-to-suit phase | `CONTRACTED / DEVELOPMENT` | Binding build/lease filing 2026-06-10 with delivery within two years | 168 MW facility capacity excluded from AI IT load | Construction start, power milestone, equipment installation, target revision, or cancellation |
| 21 | AWS Project Rainier distributed Trainium2 cluster | `COMMISSIONED / OPERATIONAL` | Nearly 500,000 Trainium2 fully operational by 2025-10-29 observation | Later 500,000-plus and collaboration-wide one-million statements not added | Project-bounded expansion, utilization, retirement, or customer scope change |
| 22 | Green Chile Saline facility U-21990 secured-power tranche | `CRITICAL_POWER_CONDITIONALLY_SECURED / UNDER_CONSTRUCTION / SCHEDULE_AT_RISK` | Conditional power approval 2025-12-18; construction 2026-06-01; appeal active 2026-08-07 | 1 GW campus and 1,383 MW electric demand excluded | Appeal disposition, contract revision, construction delay, equipment installation, or operation |

## Baseline stock, not a trend

| State at cutoff | Cases | Count |
|---|---|---:|
| Commissioned/operational | 2, 5, 6, 7, 11, 13, 21 | 7 |
| Under construction/development, including conditional power risk | 1, 3, 9, 15, 16, 17, 22 | 7 |
| Contracted without supported construction | 10 | 1 |

These counts are case states, not capacity and not acceleration. Historical event discovery is
uneven, so this version does not manufacture quarterly flow counts from the selected evidence.

## Next-quarter ledger

For each case, append only one of:

| Field | Required content |
|---|---|
| `NO_MATERIAL_TRANSITION` | Sources rechecked; no eligible lifecycle or adverse event found; never call this demand deceleration |
| `TRANSITION` | Prior state, new state, effective/observation date, original time precision, primary source, and boundary |
| `ADVERSE_EVENT` | Delay, scope reduction, cancellation, appeal/regulatory change, or evidence conflict without unsupported causal attribution |
| `SOURCE_UNAVAILABLE_OR_STALE` | Preserve prior state as historical; do not silently carry it forward as newly verified |

The quarterly comparison may count cases by transition category after all 15 are reviewed. It may
not sum accelerator generations or convert facility, utility, campus, or receiving power into AI IT
load.
