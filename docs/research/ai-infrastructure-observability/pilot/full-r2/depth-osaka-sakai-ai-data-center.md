# Full R2 depth dossier — Osaka Sakai AI Data Center

**Workstream:** A1 research only

**Last verified:** 2026-08-29

**Classification:** `AI_EXPLICIT`; `UNDER_CONSTRUCTION`; `CAPACITY_BASIS_UNRESOLVED`

**Timeline treatment:** confirmed-build, verified-unquantified; no numeric AI-capacity contribution

## Source/version registry and exact audit path

Japanese originals control where later English summaries differ. The short English glosses below are
research interpretations, not committed translations.

| ID | Source / published version | Locator | Source wording retained (short excerpt) | Normalized claim and boundary |
|---|---|---|---|---|
| S1 | SoftBank + Sharp, 2024-06-07, Japanese/English joint release | https://www.softbank.jp/corp/news/press/sbkk/2024/20240607_01/ and https://www.softbank.jp/en/corp/news/press/sbkk/2024/20240607_01/ — title, first four body paragraphs | “150MW power capacity data center in 2025” | Initial agreement: reuse planned Sharp Sakai Plant area, target autumn 2024 construction and full-scale operation during 2025. Power basis is receiving capacity, not AI IT load. |
| S2 | SoftBank board resolution, 2024-12-20, Japanese | https://www.softbank.jp/corp/news/press/sbkk/2024/20241220_03/ — paragraphs 25–28 and note at 35 | “受電容量が約150メガワット規模” | Conditional decision to acquire about 450,000 m² land/840,000 m² buildings for about ¥100bn; start operation during 2026; future receiving capacity above 250 MW. Supersedes S1 schedule. |
| S3 | SoftBank purchase contract, 2025-03-14, Japanese | https://www.softbank.jp/corp/news/press/sbkk/2025/20250314_01/ — opening through industrial-cluster paragraph | “2025年3月14日にシャープと売買契約を締結” | Binding land/building purchase contract supports `CONTRACTED`; 2026 start target and about 150 MW receiving capacity retained. |
| S4 | SoftBank FY2025 Q1 investor Q&A, 2025-08-05, Japanese | https://www.softbank.jp/corp/ir/documents/presentations/fy2025/q1_investors_qa/ — question beginning “AIデータセンターへの累計設備投資計画” | “大阪府堺市に150メガワット” | Management says disclosed ¥135bn cumulative AI-data-center capex can change with Sakai/Tomakomai expansion. Aggregate capex is not allocated as project capacity or proof of completion. |
| S5 | SoftBank FY2025 results summary, 2026-05-11, Japanese | https://www.softbank.jp/corp/ir/documents/presentations/fy2025/q4_earnings_summary/ — section 5, Osaka Sakai bullets | “受電容量140MW” | Current plan describes an AX Factory AI data center with 140 MW receiving capacity capable of housing 110 ExaFLOPS. This revises the earlier approximately 150 MW descriptor; neither is AI IT load. |
| S6 | SoftBank, 2026-05-11, Japanese/English battery release | https://www.softbank.jp/corp/news/press/sbkk/2026/20260511_01/ and https://www.softbank.jp/en/corp/news/press/sbkk/2026/20260511_01/ — opening and AX/GX Factory explanation | “AI Data Center playing a central role” | The same former Sharp site is an industrial cluster: AX Factory covers AI data-center operations/hardware manufacturing; GX Factory covers batteries/solar. These are co-located layers, not additive AI data centers. |
| S7 | SoftBank News, 2026-05-12, English strategy article | https://www.softbank.jp/en/sbnews/entry/20260512_01 — Osaka Sakai section | “AI data center with a 140MW power capacity” | Strategy restatement of S5, same corporate origin. “110 ExaFLOPS” is not converted to accelerators. |
| S8 | SoftBank News, 2026-06-09, Japanese DX article | https://www.softbank.jp/sbnews/entry/20260609_01 — section headed “AI共存社会を支える” | “大阪府堺市でのAIデータセンター建設” | Later operator wording explicitly describes Sakai AI data-center construction, supporting `UNDER_CONSTRUCTION`; no commissioned tranche or date is stated. |

All URLs were public HTML read on 2026-08-29 without authentication/payment. No page bytes or
translation file were committed, and live pages expose no inspected immutable digest.

## Permitted access and legal/translation unknowns

- Manual public reading was possible. Automated access permission, robots directives, press-release
  copyright/reuse, bulk extraction, archival redistribution, and stable revision history remain
  `UNKNOWN`; footer trademark notices are not a factual-data license.
- Japanese originals were inspected for the material date, contract, construction, receiving-power,
  and AX/GX terms. English S1/S6/S7 aids discovery but does not replace S2/S3/S5/S8.
- No durable translation or snapshot exists. Later reviewer reproducibility requires fresh original-
  language retrieval and a disposable hash/snapshot under an approved permitted method.

## Identity graph and deduplication

| Entity/layer | Relation | Accounting treatment |
|---|---|---|
| Former Sharp Sakai LCD plant | acquired land/building/power/cooling estate | Physical site, not capacity and not a separate data center. |
| Osaka Sakai AI Data Center | conversion within the acquired site | One project; current phase boundaries are not publicly resolved. |
| AX Factory | industrial cluster centered on AI DC operations and AI hardware manufacturing | Overlapping functional layer, not an additional data center. |
| GX Factory | co-located battery/solar manufacturing | Separate industrial use; exclude from AI-compute capacity. |
| 140/150 MW receiving supply and >250 MW future supply | site/project power descriptors across versions | Non-additive reported bounds; not AI IT load. |
| SoftBank / Sharp | buyer-operator and seller/former owner | Parties to one site transaction, not duplicate projects. |

## Lifecycle, milestones, and original date precision

| Evidence date | Supported state/event | Original time text | Precision retained |
|---|---|---|---|
| 2024-06-07 | `ANNOUNCED` / agreement under discussion | autumn 2024 construction; “in 2025” operation | Year/season only; later superseded. |
| 2024-12-20 | conditional board approval; `OFFICIALLY_REVISED_SCHEDULE` | operation “during 2026” | S1’s 2025 target is retained as superseded, not silently deleted. |
| 2025-03-14 | `CONTRACTED` (real-estate purchase) | operation “during 2026” | Contract is physical-site commitment, not equipment procurement. |
| 2026-05-11/12 | scope/capacity revision; construction/preparation continuing | no narrower operation date | 140 MW receiving and 110 ExaFLOPS capable-of-housing are planned states. |
| 2026-06-09 | `UNDER_CONSTRUCTION` | no commissioning date stated | No quarter/date invented within 2026. |
| 2026-08-29 cutoff | no official operational/AI-compute service evidence located | latest operation target remains 2026 | `COMMISSIONED` unsupported. |

## AI attribution, capacity basis, and states

- `AI_EXPLICIT`: S1–S8 tie the project to generative-AI development, AI-related business, sovereign
  cloud/compute, and AI infrastructure operations.
- The original 150 MW, later about 150 MW, future above 250 MW, and current 140 MW are explicitly or
  contextually receiving/power capacity. None is project-specific AI IT load. They do not satisfy the
  50 MW threshold and are excluded from numeric AI-capacity aggregation.
- 110 ExaFLOPS is a planned capability that the facility can house. Converting it to GPU count or
  equivalent compute is prohibited. No project-specific accelerator count was located.
- Current numeric state is `VERIFIED_UNQUANTIFIED`; the project is not zero capacity. Reported power
  bounds remain visible outside the numeric AI IT-load aggregate.

## Conflicts, supersession, independence, and coverage

- Schedule: S2 explicitly revises S1’s 2025 operation target to during 2026. This is a schedule
  revision, not cancellation; no official delay reason or narrower date is stated.
- Capacity descriptor: S5’s 140 MW is the latest plan against earlier approximately 150 MW. Preserve
  both versions; do not average, add, or assume a 10 MW scope reduction in AI IT load.
- Scope: future >250 MW is a receiving-supply upper plan after acquisition (not the initial phase),
  while AX/GX uses overlap the acquired estate. Phase/tranche boundaries remain unresolved.
- S1–S8 are overwhelmingly SoftBank-origin, even where Sharp jointly issued S1. Contract and
  construction facts have primary support, but provisional Level 2 is `NOT_ESTABLISHED` for current
  construction, capacity basis, or commissioning. Local-government, utility, permit, contractor, and
  equipment-partner evidence was not located in this pass.
- Coverage is `AVAILABLE_UNSTRUCTURED` for Japanese operator/IR HTML and `PARTIAL` in English.
  Construction permits, utility agreement, energization, equipment procurement/installation,
  commissioned service, and exact phase plan remain `UNKNOWN`.

## Closest-tracker comparison and decision increment

The closest public facility listing located was Datacenters.com’s Sakai facility page; the closest
reviewed open-source semantic comparator is *The Sovereign AI Tracker*, whose repository search found
no Sakai row on 2026-08-29. A facility listing can surface location, development status, and headline
power, but not the 2025→2026 schedule supersession, 150→140 MW receiving-power revision, AX/GX/site
deduplication, or the failure to prove AI IT load. The dossier therefore changes the usable result
from an apparent 140–150 MW future AI-capacity record to an under-construction but numeric-excluded
case with explicit schedule and scope history.
