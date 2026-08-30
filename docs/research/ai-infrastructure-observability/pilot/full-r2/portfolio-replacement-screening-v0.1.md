# Full R2 portfolio replacement screening v0.1

**Status:** `SUPERSEDED_BY_INDEPENDENT_REVIEW_ONE_OF_TWO_QUALIFIES`

**Date:** 2026-08-30

**Observation cutoff:** 2026-08-30

**Authorization:** screen at most four new candidates to add at least two qualifying timeline rows.
Do not weaken the 15-project minimum and do not begin aggregation. Existing negative-case and
coverage work may continue within the authorized research-only boundary.

## Independent-review correction

The initial screen stopped after treating candidates 21 and 22 as qualifying. Independent portfolio
review later found that candidate 22 is a campus-level identity with executable phase/tranche
unresolved and therefore does not satisfy `DR-001`, `DR-010`, and `DR-013`. Candidate 21 remains a
provisional system/project-level row with physical topology explicitly unresolved.

`REPLACEMENT_SCREENING_ONE_QUALIFYING_OF_TWO_SCREENED`

No third or fourth candidate was screened before the review correction. Two authorized screening
slots remain, but they cannot repair the corrected three-row portfolio shortfall by themselves. A
new responsible-human decision is required before further screening. This result does not authorize
a numeric aggregate, final R2 verdict, implementation, production data, signals, UI, PR readiness,
merge, or deployment.

## Candidate 21 — AWS Project Rainier

### Minimum identity and evidence

**Minimum identity:** AWS Project Rainier, a distributed United States AI compute cluster used by
Anthropic. It is not represented as one campus or building because Amazon states that it spans
multiple data centers and does not enumerate their physical boundaries in the accepted evidence.

| Source | Version/locator | Accepted observation | Boundary |
|---|---|---|---|
| Amazon, “AWS activates Project Rainier” | Published 2025-10-29; <https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster> | Fully operational; nearly half a million Trainium2 chips; Anthropic already running workloads | Primary project-specific operating and quantity evidence |
| Amazon Q4 2025 results | 2026 results release; <https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/> | Describes Project Rainier as an operational AI compute cluster with more than 500,000 Trainium2 chips | Later company observation; wording is not silently combined with the earlier count |
| Anthropic, Amazon compute collaboration update | Published 2026-04-20; <https://www.anthropic.com/news/anthropic-amazon-compute?invite=1> | Confirms launched collaboration and Anthropic use of Trainium capacity | “Over one million” applies to the broader collaboration and is not assigned to Rainier |

### Classification

| Field | Fail-closed classification |
|---|---|
| Lifecycle | `COMMISSIONED / OPERATIONAL` by 2025-10-29 observation |
| AI attribution | `AI_EXPLICIT` |
| Identity | `STABLE_DISTRIBUTED_CLUSTER / PHYSICAL_TOPOLOGY_UNRESOLVED` |
| Capacity | Nearly 500,000 Trainium2 chips; Level 1 project-specific company disclosure |
| Threshold | `QUANTIFIED_LARGE` |
| Timeline treatment | Retain a 2025 commissioned-as-of numeric row; do not invent a narrower commissioning event |

The later 500,000-plus wording is retained as a versioned observation, not added to the earlier
quantity. The Anthropic collaboration-wide total is excluded from the project row. Trainium2 also
remains a model-specific quantity and is not converted into, or summed with, GPU generations.

## Candidate 22 — Stargate Michigan / The Barn

### Minimum identity and evidence

**Minimum identity:** The Barn, the Stargate Michigan data-center campus in Saline Township,
Michigan. OpenAI, Oracle, Related Digital, Walbridge, and Green Chile Ventures roles do not create
additive project identities.

| Source | Version/locator | Accepted observation | Boundary |
|---|---|---|---|
| OpenAI, “Stargate Michigan data center breaks ground” | Published 2026-06-01; <https://openai.com/index/stargate-michigan-data-center/> | OpenAI and partners broke ground on The Barn, described as a 1 GW Stargate AI data-center campus in Saline | Primary construction and AI-attribution evidence |
| OpenAI, “Expanding Stargate to Michigan” | Published 2025-10-30; <https://openai.com/index/expanding-stargate-to-michigan/> | More-than-1-GW campus announcement; construction expected in early 2026 | Earlier planned state, superseded for lifecycle by the groundbreaking |
| Michigan Public Service Commission | Published 2026-03-27; <https://www.michigan.gov/mpsc/commission/news-releases/2026/03/27/mpsc-goes-big-on-batteries> | Approved service contracts for a 1,383 MW Saline Township data center developed by Green Chile Ventures | Utility/service quantity; not established as AI IT load |
| Michigan Public Service Commission | Published 2026-08-27; <https://www.michigan.gov/mpsc/commission/news-releases/2026/08/27/mpsc-approves-siting-settlement-on-ingham-county-solar-project> | Connects Green Chile Ventures, Oracle, OpenAI, and Related Digital and records contract protections | Identity corroboration; no eligible accelerator or AI IT-load quantity |

### Classification

| Field | Fail-closed classification |
|---|---|
| Lifecycle | `UNDER_CONSTRUCTION` from 2026-06-01 groundbreaking |
| AI attribution | `AI_EXPLICIT` |
| Identity | `STABLE_CAMPUS / PHASE_AND_TRANCHE_UNRESOLVED` |
| Capacity | 1 GW campus and 1,383 MW utility/service figures are ineligible capacity bases |
| Threshold | `NOT_YET_QUALIFYING`; campus identity does not resolve an executable phase/tranche |
| Timeline treatment | Exclude from the qualifying population pending stable confirmed phase identity; no commissioning date or numeric contribution |

The two power figures have different issuers and economic meanings. Neither is treated as AI IT
load, and they are not reconciled, averaged, or added.

## Screening disposition

| Candidate | Qualifying row | Numeric state | Reason |
|---|---|---|---|
| 21 — AWS Project Rainier | Yes | Model-specific accelerator count | Operational evidence and project-specific Trainium2 quantity exceed the existing threshold |
| 22 — Stargate Michigan / The Barn | No | Campus-level construction evidence | Executable phase/tranche identity remains unresolved |

One of two screened replacement rows qualifies after independent review. No threshold was weakened
and no aggregate was begun.
