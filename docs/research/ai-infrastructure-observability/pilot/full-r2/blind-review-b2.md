# Full R2 blind depth-dossier review B2

**Status:** `RESEARCH_ONLY_INDEPENDENT_REVIEW_COMPLETE`

**Reviewer:** Codex reviewer B2

**Reviewed checkpoint:** `5b74eb763645101fffaf7b595550aa883f3b168e`

**Review date:** 2026-08-29

**Scope:** independent review of the five depth dossiers committed at the checkpoint above against
`spec.md`, `plan.md`, and `tasks.md`. The dossiers' quoted evidence and locators are treated as review
inputs; their normalized conclusions are not presumed correct.

**Excluded:** source re-acquisition, executor-message review, portfolio aggregation, a technical or
product-value verdict, implementation, production/canonical state, signals, scoring, thresholds, UI,
PR readiness, push, merge, and deployment.

## Review rubric and severity

This review applies `EV-001`–`EV-008`, `DR-001`–`DR-016`, `CV-001`–`CV-009`, and the approved pilot
policies. In particular, source publication independence is not source origination independence;
facility, utility, system, or campus power is not AI IT load; and evidence that capacity is operating
by an observation date does not by itself establish the commissioning-event date.

| Severity | Meaning in this review |
|---|---|
| `LOW` | Wording, audit-path, or coverage qualification that does not change a case classification. |
| `MEDIUM` | Changes confidence, evidence level, or timeline treatment, but a fail-closed correction preserves the case. |
| `HIGH` | Would admit an ineligible number, duplicate, lifecycle state, or time bucket if left unresolved. |
| `BLOCKER` | Prevents a reproducible case classification under the governing specification. |

“Stop later aggregation” below means stop only the affected later aggregation step until the stated
condition is corrected. It is not a portfolio verdict.

## El Capitan, LLNL

### Independent classification

| Dimension | B2 classification |
|---|---|
| Stable identity / deduplication | `STABLE_SYSTEM_IDENTITY`. El Capitan is one named compute system. ECFM, its machine room, blades/nodes/cabinets, Tuolumne, RZAdams, LLNL/NNSA/DOE roles, and HPE/AMD roles are non-additive. |
| Lifecycle | `COMMISSIONED / OPERATIONAL` by the 2026-08-29 observation cutoff. ECFM was infrastructure-ready in 2022 and final-blade installation was complete by the December 2024 publication. The first service/commissioning date is unresolved. |
| AI attribution | `AI_EXPLICIT`. The operator ties the named system to AI/ML codes and AI-assisted analysis. |
| Eligible capacity basis | None. About 35 MW is system power, 85 MW is a supporting-infrastructure envelope, 400 kW/rack is density, and four MI300A APUs/node is an incomplete ratio. |
| Threshold state | `NOT_ESTABLISHED`. A strategic exception is plausible but is not approved and cannot be self-approved by the executor or reviewer. |
| Numeric timeline eligibility | `EXCLUDED_NUMERIC`; retain only as verified-unquantified if a later human-approved strategic exception permits inclusion. No commissioning time bucket is supported. |
| Evidence independence / coverage | Credible Tier-1 operator evidence, but all material evidence is LLNL-origin. Provisional Level 2 is `NOT_ESTABLISHED`. English coverage is `AVAILABLE_UNSTRUCTURED`; mutable HTML, incomplete hardware totals, and missing first-service evidence limit reproducibility. |
| Conflicts / supersession | No material conflict. The 1.809 benchmark and 2.88 peak exaFLOPs are different performance bases. The 35 MW, 85 MW, and rack-density figures are different scopes. Current operational evidence supersedes an installation-only current-state inference without rewriting earlier milestones. |
| Material blockers | Eligible AI-capacity basis and first-service timing are absent; strategic-exception approval is absent. These block numeric contribution, not retention as an unquantified case. |

### Agreements

B2 agrees with the dossier's identity graph, operational and AI-explicit classifications, strict
power/APU exclusions, non-additive scope treatment, absence of delay/cancellation evidence, and
strategic-exception boundary.

### Disagreements

No conclusion-level disagreement. B2 makes explicit that same-publisher LLNL pages do not establish
provisional Level 2. Severity `LOW`; **not material enough to stop later aggregation** if the case
remains unquantified and Level 1.

## xAI Colossus, Memphis

### Independent classification

| Dimension | B2 classification |
|---|---|
| Stable identity / deduplication | `STABLE_ORIGINAL_CONFIGURATION`; later expansion scope is `UNRESOLVED`. The original 100,000-Hopper configuration is one state of one Colossus deployment. The 180,000, combined-total 200,000, “Colossus 1,” broader Memphis scope, and one-million goal cannot be added. |
| Lifecycle | Original configuration `COMMISSIONED / OPERATIONAL` by the 2024-10-28 observation. The first-workload date is unresolved. The 200,000 state was prospective/in progress in XC1/XC2; XC3 is a conflicted candidate later state, not a clean superseding fact. |
| AI attribution | `AI_EXPLICIT` for the original configuration and later stated plans. |
| Eligible capacity basis | 100,000 physical NVIDIA Hopper GPUs is an eligible project-specific AI-accelerator count for the original configuration. No eligible AI IT-load basis is established. |
| Threshold state | Original configuration `QUANTIFIED_LARGE`; later expansion `CONFLICTED_CURRENT_TOTAL`; one-million goal `PLANNED_UPPER_BOUND`. |
| Numeric timeline eligibility | The 100,000-Hopper figure is eligible as a commissioned lower-bound fact. It is **not** eligible for a commissioning-event year/quarter merely because it was observed operating by 2024-10-28. Later 180,000/200,000 values and the one-million goal are numerically excluded. |
| Evidence independence / coverage | XC1 is eligible Tier-1 operator evidence and XC2 is eligible supplier corroboration. The dossier does not demonstrate independent origination of the shared 100,000/19-day claims, so provisional Level 2 is `NOT_ESTABLISHED`. XC1/XC2 have response hashes; mutable XC3/XC4 lack a committed version and were access-limited on recheck. |
| Conflicts / supersession | Preserve XC3's 180,000/200,000 conflict and H100/Hopper wording difference. XC1 does not convert XC2's prospective 200,000 statement into completion evidence. Historical, combined-total, and roadmap figures remain non-additive. |
| Material blockers | The commissioning-event date, later physical tranche boundaries, current expanded total/model, permitted re-verification path for XC3/XC4, and Level 2 independence are unresolved. They block event-date bucketing and later expansion totals, not the Level 1 original 100,000 commissioned fact. |

### Agreements

B2 agrees that the original 100,000-Hopper configuration is one commissioned, AI-explicit,
quantified-large lower bound; that combined totals are not increments; and that every later numeric
state must fail closed.

### Disagreements

| ID | Dossier position | B2 finding | Severity | Stop later aggregation? |
|---|---|---|---|---|
| `B2-XC-01` | xAI and NVIDIA “independently published” the original configuration. | Separate publishers and roles do not demonstrate independent origination. The matching 100,000 and 19-day claims could share one project disclosure; Level 2 is not established without common-origin analysis. | `MEDIUM` | **No**, if retained as Level 1. **Yes** before any Level 2 label or conclusion. |
| `B2-XC-02` | Include 100,000 Hopper as commissioned no later than 2024-10-28. | Agree as an as-of lower-bound fact, but not as a supported commissioning event in a 2024 year/quarter bucket. The evidence excerpt gives an observation bound, not the event's original date. | `MEDIUM` | **No** for as-of commissioned stock. **Yes** before any commissioning-flow year/quarter allocation. |

These are the review's only substantive dossier disagreements. Both have bounded fail-closed
resolutions and do not require rejecting the original configuration.

## Deutsche Telekom Industrial AI Cloud, Munich

### Independent classification

| Dimension | B2 classification |
|---|---|
| Stable identity / deduplication | `STABLE_DEPLOYMENT_IDENTITY`. The renovated Tucherpark site and Industrial AI Cloud/AI factory are one physical deployment; software layers, vendors, partners, and users are non-additive. |
| Lifecycle | `COMMISSIONED / OPERATIONAL` on 2026-02-04. The exact 10,000-GPU current state is established no later than 2026-06-18; it is not retroactively substituted for the launch observation. |
| AI attribution | `AI_EXPLICIT`. The project-specific sources tie the deployment to AI training/inference and industrial AI applications. |
| Eligible capacity basis | 10,000 NVIDIA Blackwell GPUs in M8 is an eligible project-specific AI-accelerator count. Planned exact, “up to,” “nearly,” and later exact statements remain versioned separately. |
| Threshold state | `QUANTIFIED_LARGE` at the M8 current state. The M6 launch state alone was `THRESHOLD_NOT_ESTABLISHED`. |
| Numeric timeline eligibility | Eligible for an annual 2026 commissioned-capacity view. The supplied excerpts do not justify a narrower exact commissioning date for all 10,000; B2 would not place the exact count into a quarter-level commissioning-flow bucket without resolving M8's “Since February” scope. |
| Evidence independence / coverage | Exact current capacity is Level 1 operator evidence; provisional Level 2 is `NOT_ESTABLISHED`. Supplier evidence independently supports the planned design and AI purpose, not M8's exact operational state. German/English operator coverage is `AVAILABLE_UNSTRUCTURED`; immutable versions and equipment-acceptance detail are absent. |
| Conflicts / supersession | Planned 10,000 → up to 10,000 during installation → nearly 10,000 at launch → exact 10,000 later is a versioned sequence, not an additive series. M8 changes the current state but does not overwrite M6. |
| Material blockers | Level 2 and quarter-level timing of the exact count remain unresolved. They do not block the Level 1 annual-2026 numeric classification. |

### Agreements

B2 agrees with the stable site/service identity, operational and AI-explicit classifications,
current strict-threshold pass, version history, non-additive quantities, and Level 2 limitation.

### Disagreements

No conclusion-level disagreement. The annual-only treatment above is an explicit aggregation guard,
not a rejection of the dossier's “no later than 2026-06-18” wording. Severity `LOW`; **not material
enough to stop later annual aggregation**, but quarter-level event allocation must fail closed.

## Osaka Sakai AI Data Center

### Independent classification

| Dimension | B2 classification |
|---|---|
| Stable identity / deduplication | `STABLE_PROJECT_IDENTITY / PHASE_UNRESOLVED`. The former Sharp plant, Osaka Sakai project, and overlapping AX Factory layer are one project/site graph; GX Factory is a separate non-compute use. Independently executable AI phases/tranches are not resolved. |
| Lifecycle | `UNDER_CONSTRUCTION` by the 2026-06-09 operator publication. The 2025 operation target is superseded by “during 2026”; no commissioning is established. The real-estate purchase is a binding site commitment, not equipment procurement. |
| AI attribution | `AI_EXPLICIT`. |
| Eligible capacity basis | None. 140/150 MW and future greater-than-250 MW are receiving/power descriptors, not AI IT load. 110 ExaFLOPS is not convertible to an accelerator count. |
| Threshold state | `NOT_ESTABLISHED`; current capacity state `VERIFIED_UNQUANTIFIED`. |
| Numeric timeline eligibility | `EXCLUDED_NUMERIC`. Retain as an under-construction unquantified project count only. No quarter or commissioning date is supported. |
| Evidence independence / coverage | Tier-1 operator/IR evidence supports identity, AI purpose, contract, revision, and construction. Material sources are overwhelmingly SoftBank-origin, so Level 2 is `NOT_ESTABLISHED`. Japanese coverage is `AVAILABLE_UNSTRUCTURED`, English `PARTIAL`; immutable versions, permits, utility, equipment, and phase plans are missing. |
| Conflicts / supersession | The 2025→2026 schedule and approximately 150→140 MW receiving-power change are preserved revisions. Greater-than-250 MW is a later upper plan, not the initial phase. No values are additive and no receiving-power revision is reinterpreted as AI IT-load reduction. |
| Material blockers | Phase/tranche boundary, eligible AI capacity basis, equipment/energization evidence, and commissioning evidence are absent. These block numeric aggregation but not unquantified confirmed-build treatment. |

### Agreements

B2 agrees with the project/site graph, under-construction and AI-explicit classifications, schedule
and power-version history, receiving-power/ExaFLOPS exclusions, Level 2 failure, and coverage gaps.

### Disagreements

No conclusion-level disagreement. Severity `LOW`; **not material enough to stop later aggregation**
if the case contributes no numeric capacity and unresolved phases are not multiplied.

## Stargate UAE

### Independent classification

| Dimension | B2 classification |
|---|---|
| Stable identity / deduplication | `STABLE_CLUSTER_IDENTITY / INITIAL_TRANCHE_BOUNDARY_UNRESOLVED`. The 5 GW campus contains the 1 GW Stargate UAE cluster, whose first reported 200 MW is a tranche; these scopes and the parties' roles are non-additive. |
| Lifecycle | `UNDER_CONSTRUCTION` from the later developer/operator-origin update. The June 2025 Reuters item supports a historical `SCHEDULE_AT_RISK` research flag, not an official delay. Later construction and export approval are subsequent events, not commissioning. |
| AI attribution | `AI_EXPLICIT`. |
| Eligible capacity basis | None. The 5 GW, 1 GW, and 200 MW descriptors are not expressly AI IT load. The up-to-35,000-Blackwell-equivalent export authorization is a G42 recipient ceiling, not project-specific procurement, installation, or commissioning. |
| Threshold state | `NOT_ESTABLISHED`; current numeric state `VERIFIED_UNQUANTIFIED`. |
| Numeric timeline eligibility | `EXCLUDED_NUMERIC`. Retain the under-construction project/tranche as unquantified and keep the 2026 target at calendar-year precision. |
| Evidence independence / coverage | U1–U4 are one coordinated launch family. U5 is operator/developer origin. U7 independently establishes only an export authorization ceiling. Level 2 is `NOT_ESTABLISHED` for physical phase capacity, construction corroboration, or commissioning schedule. English corporate/government coverage is `AVAILABLE_UNSTRUCTURED`; Arabic parity, permits, interconnection, EPC, financing, delivery, and commissioning are unknown. |
| Conflicts / supersession | The Reuters risk report limits an executable reading of the May launch; later construction supersedes announcement-only lifecycle, and later export approval resolves only the fact of authorization. None establishes site allocation or commissioning. No direct numeric conflict is resolved by addition or selection. |
| Material blockers | Exact phase/tranche boundary, MW basis, project-specific accelerator procurement, independent construction corroboration, and commissioning evidence are absent. These block numeric aggregation but not unquantified confirmed-build treatment. |

### Agreements

B2 agrees with the campus/cluster/tranche deduplication, common-origin launch analysis,
under-construction and AI-explicit classifications, MW and export-ceiling exclusions, retained
schedule-risk history, Level 2 failure, and coverage gaps.

### Disagreements

No conclusion-level disagreement. Severity `LOW`; **not material enough to stop later aggregation**
if all reported capacity remains non-numeric and non-additive.

## Disagreement disposition and later-aggregation stop boundary

Only `B2-XC-01` and `B2-XC-02` are substantive disagreements. Neither blocks later aggregation when
the evidence is carried forward fail-closed:

- Colossus remains Level 1 rather than Level 2;
- its original 100,000-Hopper quantity may be retained as commissioned as-of evidence, but not placed
  into a commissioning-event year/quarter without a supported event-time bound;
- its later 180,000/200,000 and one-million states remain excluded;
- El Capitan, Sakai, and Stargate UAE remain numerically excluded; and
- Munich may enter an annual 2026 view, while quarter-level placement of the exact 10,000 remains
  unresolved.

Later aggregation **must stop for correction** if it violates any of those boundaries. The presence
of the disagreements alone is not a portfolio-level stop condition, and this artifact does not make
an R2 technical, value, or aggregation verdict.
