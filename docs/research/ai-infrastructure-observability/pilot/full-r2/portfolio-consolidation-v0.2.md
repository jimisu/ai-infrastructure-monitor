# Full R2 portfolio consolidation v0.2 — replacement delta

**Status:** `RESEARCH_ONLY_QUALIFYING_SEED_MINIMUM_MET_AGGREGATE_NOT_STARTED`

**Date:** 2026-08-30

**Observation cutoff:** 2026-08-30

This delta preserves every identity, classification, exclusion, quantity boundary, and
non-aggregation rule in [portfolio consolidation v0.1](./portfolio-consolidation-v0.1.md). It adds
only the two replacement rows authorized after the v0.1 shortfall. The underlying screen and source
boundaries are recorded in
[portfolio replacement screening v0.1](./portfolio-replacement-screening-v0.1.md).

## Added rows

| # | Consolidated minimum identity | Region | Current lifecycle | Identity state | Capacity disposition | Timeline treatment |
|---:|---|---|---|---|---|---|
| 21 | AWS Project Rainier distributed United States AI compute cluster | North America | `COMMISSIONED / OPERATIONAL` | `STABLE_DISTRIBUTED_CLUSTER / PHYSICAL_TOPOLOGY_UNRESOLVED` | Nearly 500,000 Trainium2 chips by 2025-10-29 observation, Level 1 | Retain annual-2025 commissioned-as-of numeric row; no narrower event date or collaboration-wide count |
| 22 | The Barn / Stargate Michigan campus, Saline Township | North America | `UNDER_CONSTRUCTION` | `STABLE_CAMPUS / PHASE_AND_TRANCHE_UNRESOLVED` | Campus and utility/service MW excluded from AI IT-load basis | Retain annual-2026 `VERIFIED_UNQUANTIFIED` confirmed-build row; no commissioning date |

## Updated population disposition

| Population | Cases | Count | Permitted use |
|---|---|---:|---|
| Confirmed-build or commissioned rows retained in the research timeline | v0.1 cases 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 15, 16, 17; plus 21, 22 | 15 | Timeline rows with numeric and unquantified states kept separate |
| Ordinary numeric candidates | 2, 5, 13, 21 | 4 | Model-specific observations only; no cross-model sum |
| Confirmed/operational but ordinary large threshold not met | 4, 12 | 2 | Comparator or separately approved strategic exception only |
| No confirmed-build eligibility | 8, 14, 19, 20 | 4 | Planned/negative/discovery records only |
| Identity prevents a stable confirmed project row | 18 | 1 | Conflict/coverage record only until resolved |

Eleven of the 15 retained rows are `VERIFIED_UNQUANTIFIED`. Four retain accelerator quantities with
different model and time semantics. This count is a qualifying timeline population, not a count of
numerically quantified projects.

## Numeric non-aggregation addition

| Case | Quantity | Model/generation | Time semantic | Allowed presentation | Prohibited presentation |
|---|---:|---|---|---|---|
| AWS Project Rainier | Nearly 500,000 | AWS Trainium2 | Fully operational by 2025-10-29 observation | Annual-2025 commissioned-as-of Level-1 row | Collaboration-wide one-million figure, exact commissioning date, GPU equivalent, or cross-model total |

The v0.1 non-aggregation matrix remains controlling for Colossus, Munich, and JUPITER. No sum of
Hopper, Blackwell, GH200, and Trainium2 is produced.

## Qualifying-seed gate

The two accepted replacement rows raise the confirmed-build or commissioned population from 13 to
15 without changing the existing threshold or admitting planned-only evidence.

`QUALIFYING_SEED_MINIMUM_MET_15`

This resolves only the v0.1 population shortfall. The replacement-screening authorization expressly
prohibits beginning aggregate work, so this checkpoint creates no annual or quarterly aggregate and
does not complete T208 or T210. Negative-case and coverage work may continue under their existing
research-only authority.

## Consolidation result

`REPLACEMENT_ROWS_CONSOLIDATED_FAIL_CLOSED_NO_AGGREGATE`

This artifact creates no canonical identity, production data, signal, scoring, threshold, UI,
PR-readiness, merge, or deployment authority.
