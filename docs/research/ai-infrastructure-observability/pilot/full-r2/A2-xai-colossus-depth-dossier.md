# Full R2 depth dossier A2 — xAI Colossus, Memphis

**Status:** `RESEARCH_ONLY_DEPTH_CLASSIFICATION_COMPLETE`

**As of / reviewed:** 2026-08-29

**Baseline:** Draft PR #6 head `f6c1bd7daf85ea827be7ce95ecf3571b3223ead0`
**Boundary:** one selected depth case; no portfolio aggregate, production, canonical, signal, UI or
final-R2 verdict effect

## 1. Result

The stable minimum identity is one Colossus compute deployment at xAI's South Memphis facility. xAI
and NVIDIA independently published that its original configuration comprised 100,000 NVIDIA Hopper
GPUs and was running AI workloads/training Grok by 2024-10-28. That configuration is
`COMMISSIONED / OPERATIONAL`, `AI_EXPLICIT`, `QUANTIFIED_LARGE`, with a 100,000-Hopper commissioned
lower bound.

The original 100k, later “combined total” 200k, the Colossus page's 180k/200k inconsistency,
“Colossus 1,” broader Memphis facilities and the one-million-GPU-by-2026 goal are overlapping or
unresolved scopes. They are not additive. Current automated rechecks of the mutable `/colossus` and
`/memphis` presentation pages returned HTTP 403, so the micro-pilot's 2026-08-29 observations remain
historical evidence with explicit version/access limitations; they are not silently refreshed.

## 2. Source and document-version registry

| ID | Class / role | Document/version and locator | Exact supported wording / claim | Eligibility / version treatment |
|---|---|---|---|---|
| XC1 | Tier-1 operator | xAI, “Series C,” dated 2024-12-23; “Colossus” bullet and following Grok 3 paragraph; retrieved 2026-08-29; disposable response SHA-256 `bef5f7fc97c84cdcfd9490f709a17707da5139d3d978206ee4def754a6f3b019` | “100,000 NVIDIA Hopper GPUs”; “fully operational in 122 days”; workloads started “19 days after the first servers were delivered”; “Soon” would double to a “combined total of 200,000”; Grok 3 “is currently training.” | Eligible for original configuration, operation and AI attribution. The 200k sentence is forward-looking at publication. |
| XC2 | Tier-1 supplier; separate publication origin | NVIDIA Newsroom, “NVIDIA Ethernet Networking Accelerates World's Largest AI Supercomputer, Built by xAI,” dated 2024-10-28; paragraphs 1–3 and forward-looking-statements section; retrieved 2026-08-29; SHA-256 `8172d4b07c1bb04bcfb6a53ffc9384f3b71b92768045df703c4ccc38cd99764c` | Cluster “comprising 100,000 NVIDIA Hopper GPUs in Memphis”; “being used to train xAI's Grok”; xAI “is in the process of doubling” to a “combined total of 200,000”; 19 days from first rack until training began. | Eligible independent corroboration for 100k operation. 200k was still a process/forward-looking statement on this date. |
| XC3 | Tier-1 operator, mutable presentation | xAI `/colossus`, micro-pilot retrieval 2026-08-29, “Our gigafactory of compute,” metrics and timeline; no committed snapshot/hash; current A2 automated recheck returned HTTP 403 | Prior packet recorded 200,000 H100 GPUs and February 2025 “Full scale / Doubled to 200K GPUs,” while the same page displayed 180K. | Historical eligible operator observation with unresolved internal quantity conflict; cannot establish a clean current 200k fact. |
| XC4 | Tier-1 operator, mutable presentation | xAI `/memphis` and `/memphis/xai`, micro-pilot retrieval 2026-08-29; current A2 automated recheck returned HTTP 403 | Memphis is home to Colossus and is connected to Grok; one million GPUs by 2026 is a goal. | Eligible for location/AI relationship and planned upper-bound wording only. |
| XC5 | Discovery/closest-tracker comparator | U.S. Data Center Atlas / IM3 public facility inventory | Facility/location record and mapping fields. | Discovery/comparison only; not substituted for project-specific capacity or lifecycle evidence. |

XC1 and XC2 byte hashes identify the exact responses inspected, not issuer-declared immutable
editions. XC3/XC4 intentionally retain the earlier packet's version limitation rather than assigning
a hash to the 403 error body.

### Access and legal record

- XC1 and XC2 were accessed by ordinary public HTTPS GET without authentication, payment or bypass.
  XC3/XC4 returned HTTP 403 to the same permitted method during this workstream; no circumvention,
  browser impersonation or alternate credential was attempted.
- xAI `robots.txt`, retrieved 2026-08-29, allows `/` for general and named answer-engine user agents,
  disallows `/tools/`, and states content signals `ai-train=no`, `search=yes`, `ai-input=no` except
  `/bot/guides`. Robots directives are not a copyright license and the content-signal meaning for
  this research quotation is legally unresolved.
- xAI and NVIDIA pages remain copyrighted public corporate material. Quotation, automated access,
  downstream redistribution, database extraction and retention rights are not affirmatively granted
  by the evidence reviewed. Only concise claims, URLs, dates and response hashes are committed.
- The atlas/IM3 license and provenance were reviewed at R1 only as a discovery source. No external
  dataset row or snapshot is committed here.

## 3. Identity graph and deduplication

| Entity/scope | Relationship | Accounting resolution |
|---|---|---|
| South Memphis xAI facility | physical facility | Location/container; not itself a GPU tranche. |
| Colossus named cluster | physical compute deployment | One project/system identity. |
| Original 100k Hopper configuration | earlier configuration/state of Colossus | One commissioned lower-bound; supported by XC1/XC2. |
| 200k “combined total” expansion | proposed/in-progress later configuration in XC1/XC2 | Replacement/expansion state, not +200k and not +100k without completion evidence. |
| 180k and 200k on XC3 | conflicting current-page quantities at prior retrieval | Preserve conflict; do not average, choose or add. |
| “Colossus 1” | alias/possible phase name | Link unresolved; not a second system absent physical-boundary evidence. |
| Broader Memphis build/campus | parent/future facility scope | Do not merge into original cluster or add roadmap capacity. |
| One-million-GPU-by-2026 goal | roadmap upper bound | Planned, non-executable and non-aggregate-eligible. |
| xAI + NVIDIA publications | operator and supplier descriptions | Independent publications about one deployment, not two projects. |

Stable identity is reached only for the original 100k configuration. Later physical phase/tranche
boundaries remain unresolved and therefore fail closed.

## 4. Lifecycle, milestones, dates and supersession

| Event | Original date precision | Supported state transition | Treatment |
|---|---|---|---|
| First rack delivery | No calendar date; only relative duration | Pre-installation reference | Do not reverse-calculate a day. |
| Training began | By XC2 publication, 2024-10-28; “19 days” after first rack | `COMMISSIONED / OPERATIONAL` for original 100k no later than 2024-10-28 | Exact first-workload day unknown. |
| Fully operational | XC1 publication 2024-12-23; completed “in 122 days” | Corroborates original 100k operational no later than 2024-12-23 | Do not infer project start date. |
| Doubling to 200k | “in the process” 2024-10-28; “Soon” 2024-12-23 | `UNDER_EXPANSION`, planned combined total | Not commissioned at those source dates. |
| Full scale / doubled | February 2025 (month precision) on mutable XC3 at prior retrieval | Candidate later operational milestone | Quantity conflict and mutable version prevent numeric supersession. Preserve month, not invented day/quarter. |
| One million GPUs | “by 2026” goal on XC4 | `ANNOUNCED / PLANNED_UPPER_BOUND` | No executable or commissioned tranche established. |

XC1 supersedes XC2 only as a later operator statement about the same original configuration; it does
not transform XC2's prospective 200k statement into completion evidence. XC3 is later in represented
timeline but internally conflicting. No official delay, cancellation or schedule-at-risk conclusion
is supported.

## 5. AI attribution and capacity states

| Scope | AI attribution | Capacity basis/state | Timeline treatment |
|---|---|---|---|
| Original configuration | `AI_EXPLICIT` | 100,000 physical NVIDIA Hopper GPUs; `COMMISSIONED`; `QUANTIFIED_LARGE` | Include one 100,000-Hopper commissioned lower bound, no later than 2024-10-28. |
| Later expansion | `AI_EXPLICIT` | 180k/200k total configuration conflict; exact model wording also differs (H100 vs Hopper); `CONFLICTED_CURRENT_TOTAL` | Exclude numeric increment and total until a stable exact source resolves scope, model and operational state. |
| One-million goal | `AI_EXPLICIT_PLAN` | planned upper bound, physical phases and executable evidence unresolved | Exclude from confirmed capacity; show only as non-additive plan. |
| Memphis facility power/generation | `NOT_EVALUATED_AS_AI_IT_LOAD` | facility/utility/environmental evidence is a different basis | Never substitute for AI IT MW. |

Hopper is a generation family and H100 a model. The dossier preserves each source's wording and does
not convert between generations, FLOPS or “equivalent GPUs.”

## 6. Conflict, coverage and negative-case record

- XC3's 180k and 200k values are an unresolved within-origin conflict. XC1/XC2 support 200k only as a
  future combined total at their dates; they do not resolve XC3's later operational quantity.
- “100k original + 200k doubled” is rejected: 200k is a combined configuration total, not an
  incremental 200k tranche. “100k + 180k + 200k + 1m” is rejected as historical-state and plan
  duplication.
- The public record reviewed does not identify independently executable expansion phases,
  per-building GPU allocation, an authoritative completion acceptance document, or a valid AI IT MW.
- Operator coverage is strong but mutable; supplier corroboration is strong for the original 100k.
  Utility, permitting, air-emissions and local-government evidence were not needed to establish the
  original system and are not used to infer compute capacity. Their omission is a later-phase
  coverage gap.
- English coverage only. `last_verified_at = 2026-08-29`; XC1/XC2 evidence age zero days. XC3/XC4
  require a permitted manual or alternative-official-source recheck before reuse and should be
  treated as access-limited, not silently current.

## 7. Closest-tracker and decision comparison

The U.S. Data Center Atlas / IM3 is the closest applicable public facility tracker. It can tell a
competent user that a data-center facility exists at a location and supply inventory/geospatial
context. Ordinary operator/supplier headlines supply spectacular GPU totals. Neither, without the
ledger treatment here, proves whether those totals are historical configurations, combined totals,
completed tranches or a campus roadmap.

The decision improvement is concrete: retain **one** commissioned 100,000-Hopper record, reject the
tempting additive interpretation of 100k/180k/200k/1m, and withhold all later numeric capacity until
scope and operational state are resolved. Demand Layer v1 may show aggregate hyperscaler demand and
TSMC supply confirmation, but it has no Colossus phase identity; no CapEx or semiconductor signal is
used to fill this evidence gap.

## 8. Actual effort log

This dossier reuses the committed micro-pilot packet as disclosed; it does not pretend that reused
research was newly performed. Durations are observed agent wall clock, not human-equivalent or
mature quarterly-maintenance estimates.

| UTC interval | Activity | Actual elapsed |
|---|---|---:|
| 2026-08-29 23:30–23:34 | Baseline, authorization and prior-pilot review | 4 min |
| 2026-08-29 23:34–23:40 | XC1/XC2 retrieval, disposable hashing, robots/access recheck | 6 min |
| 2026-08-29 23:40–23:43 | Identity, lifecycle, conflict and tracker comparison | 3 min |
| 2026-08-29 23:43–23:46 | Final edit, diff check and full repository verification | 3 min |
| **Observed A2 interval** |  | **16 min** |

No translation time was required. Current XC3/XC4 access failure was logged as coverage rather than
time spent bypassing it. Baseline and verification intervals were shared with the El Capitan case
and must not be summed across dossiers when estimating total A2 effort.
