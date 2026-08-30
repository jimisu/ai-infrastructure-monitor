# Full R2 maintenance simulation v0.1

**Status:** `RESEARCH_ONLY_MAINTENANCE_WITHIN_BUDGET_PROVISIONALLY`

**Date:** 2026-08-30

**Observation cutoff:** 2026-08-30

**Scope:** WP10 tabletop simulation and cost gate for the current 22-case research portfolio. This
does not refresh sources, construct an aggregate, assign the final R2 verdict, or claim measured
human analyst time or mature automation.

## Maintenance population

A quarterly pass cannot review only the 12 independently accepted rows. It must also revisit the
three review-disputed and seven other excluded/held cases because a campus, MOU, planned project,
below-threshold system, or identity-unresolved program may gain qualifying phase, construction,
contract, operating, or capacity evidence.

| Work population | Cases | Quarterly treatment |
|---|---:|---|
| Independently accepted qualifying rows | 12 | Reverify identity, lifecycle, milestones, capacity state, conflicts, and source versions |
| Disputed campus-level rows | 3 | Resolve executable phase/tranche identity or keep outside the qualifying population |
| Below-threshold comparators | 2 | Recheck configuration and any separately approved exception; ordinary threshold remains unchanged |
| Planned/MOU/negative cases | 4 | Search for eligible contract, procurement, critical-power, construction, delay, cancellation, or supersession evidence |
| Identity-unresolved case | 1 | Recheck program-to-site/phase evidence bridge without merging by assumption |
| **Total** | **22** | Full portfolio review; accepted, disputed, and excluded states remain separate |

The existing registries contain 86 labeled source locators across the five depth dossiers and seed
batches, plus seven source rows in replacement screening: 93 locators in the current tabletop
inventory. This is a maintenance workload count, not a claim that all 93 sources are independent,
durable, legally reusable, or required forever.

## Quarterly tabletop procedure

| Stage | Manual action | Automatable later | Inherently human / review-heavy |
|---|---|---|---|
| 1. Baseline | Freeze prior register, source versions, aliases, unresolved conflicts, and cutoff | File inventory and diff generation | Decide whether prior scope is still economically identical |
| 2. Reachability/version | Revisit 93 locators; record availability, revised content, publication/effective date, language, and permitted access | HTTP status, hashing, known-page change detection where permitted | Terms, same-URL semantic revision, paywall/authentication, and source-origin judgment |
| 3. Event discovery | Search official channels for construction, procurement, commissioning, delay, cancellation, or scope change | Saved official-domain queries and date filters | Determine whether silence is meaningful and whether a new item shares origin |
| 4. Claim extraction | Compare exact wording, units, date precision, capacity state, and AI attribution | Text diff and locator assistance | Unit/economic-basis interpretation and qualitative attribution |
| 5. Identity/lifecycle | Resolve party, campus, phase, system, configuration, tranche, customer, and supersession links | Candidate alias matching | Merge/split decisions and conflict preservation |
| 6. Review/correction | Independent classification of material changes and all numeric rows | Checklist generation | Disagreement severity, source independence, and fail-closed resolution |
| 7. Output/coverage | Update research rows, gaps, `last_verified_at`, stale state, and exception log | Rendering and categorical counts | Coverage claims, limitations, and product-value interpretation |

No estimate assumes that the unimplemented automation column exists.

## Representative exception-update replay

**Case:** 10, Stargate Norway / Kvandal.

| Replay step | Existing evidence | Required update behavior |
|---|---|---|
| Prior state | SN1/SN2 launch family names OpenAI as initial prospective offtaker and reports 230 MW, a further 290 MW ambition, and a 100,000-GPU target | Preserve as prior planned evidence; do not book installed or commissioned capacity |
| Material event | SN3, Aker Q1 2026 shareholder letter, reports Microsoft contracted full Kvandal capacity and adds a 30,000 Vera Rubin commitment | Record a customer/contract revision; do not overwrite the OpenAI-era version |
| Identity review | Same Kvandal facility/JV, but customer, capacity wording, model, and effective period differ | Keep one facility identity and separate versioned commitments; no duplicate project |
| Capacity review | 100,000 target, 30,000 commitment, 230 MW facility plan, and 290 MW ambition have different scopes/bases | Keep all forward-looking and non-additive; no numeric commissioned contribution |
| Lifecycle result | Contract evidence exists; construction/commissioning remains unresolved | Retain `CONTRACTED / VERIFIED_UNQUANTIFIED` |
| Review burden | Source-origin, customer supersession, accelerator model, and scope require manual judgment | Treat as representative 2–4 human-hour exception update including second review and correction |

The replay demonstrates the exception workflow using already registered evidence. It did not perform
a new live source refresh, so it is not reported as a measured future-quarter event.

## Evidence base for the effort estimate

- A1 recorded 4:08:21 agent/tool wall-clock for three first-pass depth dossiers, including 1:16
  source work, 0:59 classification, 1:05 comparison/drafting, and shared setup/verification.
- A2 recorded 16-minute overlapping agent/tool intervals for two evidence-rich cases and explicitly
  warns that they are not additive human hours.
- The current portfolio has 22 cases and 93 registered locators, with multiple mutable pages,
  coordinated release families, local-language paths, and at least eight material identity/phase
  hotspots.
- Seed-batch and consolidation work did not instrument human-equivalent task minutes. Those missing
  measurements widen the range rather than being reconstructed as precise history.

Agent/tool wall-clock is not converted directly into human analyst time. The range below is a
count-based planning estimate grounded in the observed work categories and portfolio inventory.

## Mature manual-effort estimate

| Activity | Count basis | Human planning range per quarter |
|---|---|---:|
| Baseline preparation and work queue | One portfolio | 0.5–1.0 h |
| Locator reachability, version, date, and access review | 93 locators at roughly 4–7 min average | 6.2–10.9 h |
| Local-language semantic checks | About six material case paths at 15–30 min incremental effort | 1.5–3.0 h |
| Case reclassification | 22 cases at roughly 12–20 min | 4.4–7.3 h |
| Complex identity/conflict review | About eight hotspots at 15–30 min | 2.0–4.0 h |
| Independent review and corrections | Material changes plus four numeric rows | 3.0–5.0 h |
| Research output and coverage update | One bounded release | 1.5–3.0 h |
| **Scheduled quarterly pass** |  | **19.1–34.2 h** |
| One representative material exception update | Norway replay class | **+2.0–4.0 h** |
| **Quarter with one exception** |  | **21.1–38.2 h** |

Across a 13-week quarter, the scheduled pass is approximately 1.5–2.6 human hours per week; a
quarter with one representative exception is approximately 1.6–2.9 hours per week. This is within
the approved ceiling of no more than 2–4 human hours per week, but only provisionally: the upper
range leaves limited room for multiple simultaneous events, source-access failures, or extensive
translation/correction.

## Cost gate and constraints

`MAINTENANCE_BUDGET_PROVISIONALLY_MET_WITH_FULL_22_CASE_REVIEW`

The result is not a mature cost measurement. It is an evidence-based tabletop estimate that includes
review and correction overhead and assumes no unimplemented automation. It remains credible only if:

1. the active portfolio stays near 22 cases and roughly 93 locators;
2. full review remains quarterly rather than event-continuous;
3. exception updates are reserved for material official events;
4. human review remains mandatory for identity, units, attribution, independence, and conflicts; and
5. a later real quarterly pass instruments human task time separately.

Two or more complex exception events in one quarter could move the upper range above the preferred
budget. The correct response would be a reviewed scope/cadence reduction, not silent automation or
lower evidence standards.

## Result boundary

T211's maintenance measurement is advanced but not complete because no real future-quarter full pass
has occurred, the qualifying seed is below 15 after independent review, and timeline-specific
acceptance still depends on unauthorized aggregate/output work.
No production data, signal, scoring, threshold, UI, PR-readiness, merge, or deployment authority is
created.
