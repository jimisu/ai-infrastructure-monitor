# Full R2 independent portfolio review v0.1

**Reviewer:** isolated Codex B2

**Review status:** `MATERIAL_DISAGREEMENT`

**Date:** 2026-08-30

**Boundary:** read-only independent review of committed research artifacts. The reviewer did not
acquire new evidence, edit the classifications, construct an aggregate, or assign a final product
verdict.

## Findings

| Severity | IDs | Finding | Required correction |
|---|---|---|---|
| `HIGH` | Cases 9, 17, 22 | Hyperion, Jamnagar, and Michigan were counted as qualifying rows while their retained identities are campus-level and executable phases/tranches remain unresolved. Case 17 also combines a separate Meta built-to-suit project within the row. This conflicts with `DR-001`, `DR-010`, and `DR-013`. | Resolve each to one independently executable confirmed phase with stable identity, or remove it from the qualifying population. Until then, `QUALIFYING_SEED_MINIMUM_MET_15` is unsupported; fail-closed count is at most 12. |
| `MEDIUM` | Case 21 | Rainier is a distributed cluster with unresolved physical topology. Operational project-specific Trainium2 evidence permits provisional system/project-level retention, not a claim of completed physical-phase identity. | Preserve the topology limitation and do not present the row as phase-complete. |
| `MEDIUM` | NC-05, NC-11, NC-14, NC-16, NC-18 | These were labeled `PASS_OBSERVED`, but the adverse condition was not naturally present. | Re-execute as bounded mutations. NC-11's real same-URL two-version condition remains not demonstrated. Correct suite count to 16 observed and nine mutations. |

## Accepted numeric classifications

| Case | Accepted boundary |
|---|---|
| 2 Munich | 10,000 Blackwell; annual 2026 only |
| 5 Colossus | 100,000 Hopper commissioned-as-of stock; no commissioning-flow bucket |
| 13 JUPITER | Approximately 24,000 GH200; annual 2025 with approximation retained |
| 21 Rainier | Nearly 500,000 Trainium2; annual-2025 commissioned-as-of |

No cross-model sum or unsupported equivalent conversion appears.

## Coverage review

The earlier regional, lifecycle, and capacity counts were arithmetically accurate for consolidation
v0.2's stated 15-row population, and its geographic, language, immutable-version, independence, and
legal-access limitations were candid. Those counts nevertheless inherited the HIGH eligibility
error. Removing cases 9, 17, and 22 leaves at most 12 qualifying rows: four North American, four
European, three Asian, and one Middle Eastern; eight are `VERIFIED_UNQUANTIFIED` and four numeric.

## Review result

`PORTFOLIO_REQUIRES_HUMAN_GATE_DECISION_AFTER_FAIL_CLOSED_CORRECTION`

This review remains research-only. It constructs no aggregate, assigns no final R2/product verdict,
and grants no implementation, production, canonical-data, signal, UI, PR-ready, merge, or deployment
authority.
