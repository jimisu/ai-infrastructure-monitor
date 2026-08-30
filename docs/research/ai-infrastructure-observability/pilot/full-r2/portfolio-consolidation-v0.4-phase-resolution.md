# Full R2 portfolio consolidation v0.4 — phase-resolution result

**Status:** `RESEARCH_ONLY_QUALIFYING_SEED_MINIMUM_RESTORED_15_NO_AGGREGATE`

**Date:** 2026-08-30

This artifact supersedes consolidation v0.3's qualifying-population gate after separately authorized
phase-resolution research and independent review. It preserves all prior evidence, negative cases,
quantity exclusions, and non-aggregation rules.

## Resolved rows

| Case | Stable minimum unit | Lifecycle | Capacity state | Timeline treatment |
|---:|---|---|---|---|
| 9 Hyperion | Original Project Laidley under LPSC U-37425, separated from Project Evest and the later 5 GW campus expansion | `CONTRACTED_CRITICAL_POWER / UNDER_CONSTRUCTION` | `VERIFIED_UNQUANTIFIED`; campus and utility quantities excluded | Restore one project-level qualifying row; no building/commissioning inference |
| 17 Jamnagar | Meta/Reliance 168 MW first built-to-suit phase | `CONTRACTED / DEVELOPMENT` | `VERIFIED_UNQUANTIFIED`; 168 MW facility capacity excluded from AI IT load | Restore one annual-2026 contracted phase row; two-year target retains original precision |
| 22 Michigan | Green Chile Saline facility's U-21990 critical-power tranche | `CRITICAL_POWER_CONDITIONALLY_SECURED / UNDER_CONSTRUCTION / SCHEDULE_AT_RISK` | `VERIFIED_UNQUANTIFIED`; 1 GW campus and 1,383 MW electric demand excluded | Restore one contract/construction row; conditional approval and appeal remain visible |

Independent reviewer B2 returned `ACCEPT_ALL_THREE`, with only the wording guardrails carried above.

## Current population

| Population | Cases | Count |
|---|---|---:|
| Qualifying confirmed-build or commissioned rows | 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 15, 16, 17, 21, 22 | 15 |
| Numeric model-specific rows | 2, 5, 13, 21 | 4 |
| `VERIFIED_UNQUANTIFIED` qualifying rows | 1, 3, 6, 7, 9, 10, 11, 15, 16, 17, 22 | 11 |
| Other excluded or held cases | 4, 8, 12, 14, 18, 19, 20 | 7 |

`QUALIFYING_SEED_MINIMUM_RESTORED_15_AFTER_PHASE_RESOLUTION`

The 15-row minimum is restored without screening another candidate, changing the large threshold,
or admitting any facility/campus/utility MW as AI IT load. This is a population gate only. No
annual, quarterly, regional, model, or portfolio aggregate is constructed or authorized.

This artifact creates no implementation, production data, signal, scoring, threshold, UI,
PR-readiness, merge, or deployment authority.
