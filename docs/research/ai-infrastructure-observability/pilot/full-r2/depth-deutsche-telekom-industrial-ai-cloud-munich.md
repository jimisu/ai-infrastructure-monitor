# Full R2 depth dossier — Deutsche Telekom Industrial AI Cloud, Munich

**Workstream:** A1 research only

**Last verified:** 2026-08-29

**Classification:** `AI_EXPLICIT`; `COMMISSIONED`; `QUANTIFIED_LARGE` at latest version

**Timeline treatment:** 10,000 NVIDIA Blackwell GPUs commissioned no later than 2026-06-18; do not
retroactively replace the “nearly 10,000” launch observation

## Source/version registry and exact audit path

| ID | Source / published version | Locator | Source wording retained (short excerpt) | Normalized claim and boundary |
|---|---|---|---|---|
| M1 | Deutsche Telekom, 2025-06-13, “AI turbo…” | https://www.telekom.com/en/media/media-information/archive/ai-turbo-nvidia-and-deutsche-telekom-1093532 — body paragraphs on infrastructure | “will feature 10,000 GPUs” | Prospective exact design statement; announcement only. |
| M2 | NVIDIA, 2025-06-11, “NVIDIA Builds World’s First Industrial AI Cloud…” | https://nvidianews.nvidia.com/news/nvidia-builds-worlds-first-industrial-ai-cloud-to-advance-european-manufacturing — opening/product paragraph | “will feature 10,000 GPUs” | Independently published supplier-origin prospective configuration; corroborates planned AI purpose, not later commissioning. |
| M3 | German Federal Government, 2025-06-13, Chancellor/NVIDIA meeting | https://www.bundesregierung.de/breg-de/aktuelles/bundeskanzler-friedrich-merz-trifft-nvidia-ceo-jensen-huang-deutschland-mit-fuehrungsanspruch-bei-kuenstlicher-intelligenz-2354238 — section beginning “Aktuelles,” title and remarks on data centers/AI | “Rechenzentren sind das Rückgrat” | Independent government context confirms the public launch setting and policy support; it does not prove a Munich build, count, or commissioning. |
| M4 | Deutsche Telekom, 2025-11-04, “launches Industrial AI Cloud…” | https://www.telekom.com/en/media/media-information/archive/launch-industrial-ai-cloud-with-nvidia-1098706 — paragraph beginning “Currently” | “with up to 10,000 NVIDIA Blackwell GPUs” | More than 1,000 systems/servers were being installed in a completely renovated Munich data center; Q1 2026 planned go-live. Upper bound, not an installed exact count. |
| M5 | NVIDIA blog, 2025-11-04, “Deutsche Telekom and NVIDIA Launch…” | https://blogs.nvidia.com/blog/germany-industrial-ai-cloud-launch/ — opening and availability paragraphs | “set to go live in early 2026” | Supplier-origin restatement of planned availability; not operational proof. |
| M6 | Deutsche Telekom, 2026-02-04, “Germany’s first AI factory…” | https://www.telekom.com/en/media/media-information/archive/germany-s-first-ai-factory-for-industry-1101670 — dated title; opening through infrastructure paragraph | “infrastructure is built on nearly 10,000 NVIDIA Blackwell GPUs” | Official launch/operation in Munich; nearly 10,000 does not satisfy at-least-10,000 threshold at that date. |
| M7 | Deutsche Telekom German counterpart, 2026-02-04 | https://www.telekom.com/de/medien/medieninformationen/detail/deutschlands-erste-ki-fabrik-fuer-die-industrie-1101664 — corresponding title/opening/infrastructure paragraph | “knapp 10.000 NVIDIA Blackwell GPUs” | Original-language counterpart, same origin and same approximate quantity; not independent. |
| M8 | Deutsche Telekom/T-Systems, 2026-06-18, “T-Systems and SupplyOn…” | https://www.telekom.com/en/media/media-information/archive/t-systems-brings-ai-into-the-supply-chain-1105624 — paragraph beginning “Since February 2026” | “operated the facility in Munich with 10,000 NVIDIA Blackwell GPUs” | Later exact operational statement supersedes the unresolved latest quantity from M6 for current-state classification. It does not rewrite the February observation. |

All pages were live public HTML read on 2026-08-29. No bytes or translations were committed; archive
IDs and publication dates do not guarantee immutable content.

## Permitted access and legal unknowns

- M1–M8 were publicly readable without authentication or payment. German and English page parity was
  manually checked only for the material M6/M7 quantity phrase; no translation artifact was retained.
- Robots retrieval, automated access permission, copyright/reuse, stable version history, press-image
  rights, bulk quotation, and downstream redistribution remain `UNKNOWN`. Footer legal links are not a
  factual-data license.
- Later ingestion requires fresh permitted-method review and disposable version preservation.

## Identity graph and deduplication

| Entity/layer | Relation | Accounting treatment |
|---|---|---|
| Renovated Munich Tucherpark data center | physical site, reported 10,700 m² | One physical deployment; building area is not capacity. |
| Industrial AI Cloud / AI factory | infrastructure/service hosted at site | Same deployment, not a second project. |
| Deutschland Stack / SAP layer | platform/software ecosystem | Non-additive service layer. |
| NVIDIA systems and Polarise | technology and data-center partners | Roles, not separate capacity. |
| Siemens, SupplyOn, SOOFI and other users | workloads/customers | Usage evidence; not separate projects or capacity. |

## Lifecycle, milestones, and original date precision

| Evidence date | State/event | Original time text | Precision retained |
|---|---|---|---|
| 2025-06-11/13 | `ANNOUNCED` | implementation “by 2026” | No invented month/quarter. |
| 2025-11-04 | `EQUIPMENT_INSTALLATION_UNDERWAY` | “Q1 2026” / “early 2026” | Quarter/range only. |
| 2026-02-04 | `COMMISSIONED` / `OPERATIONAL` | “officially launching … today” | Exact publication/launch date; “built over six months” is not converted into a start date. |
| 2026-06-18 | current operational capacity revision | “Since February 2026” | Exact 10,000 is established no later than publication; not backdated to 2026-02-04. |

## AI attribution, capacity basis, and states

- `AI_EXPLICIT`: every project source ties the infrastructure to industrial AI training/inference,
  simulation, robotics, language models, or AI applications.
- M1’s 10,000 planned exact, M4’s “up to 10,000” installation ceiling, M6/M7’s “nearly
  10,000” launch quantity, and M8’s exact 10,000 operational quantity are four versioned states.
- M8 supports the strict 10,000-accelerator threshold and `QUANTIFIED_LARGE` current state. Original
  unit/generation is 10,000 NVIDIA Blackwell GPUs; no H100-equivalent or ExaFLOPS conversion is used.
- The “above one third of capacity” statement at launch is utilization/service wording and is never
  multiplied by the GPU count. The one-billion-euro partnership and 0.5 ExaFLOPS are not capacity
  proxies.

## Conflicts, supersession, independence, and coverage

- The micro-pilot’s February conclusion (`THRESHOLD_NOT_ESTABLISHED`) was correct for M6. M8 is a
  later source version that changes the current conclusion; history is retained rather than overwritten.
- There is no numeric contradiction once lifecycle/version is preserved: planned exact → installation
  upper bound → launch approximate → later operational exact. Treating all four as one timeless fact
  would create a conflict.
- M2 independently supports planned configuration and AI purpose; M8’s exact operational count remains
  operator-origin. A customer’s reported use can corroborate operation, but no independently originated
  source located here states the same exact operational count and physical scope. Provisional Level 2
  for **exact current capacity** therefore remains `NOT_ESTABLISHED`; the Level 1 primary-source fact is
  sufficient for research classification but production remains unauthorized.
- Coverage is `AVAILABLE_UNSTRUCTURED` for German/English operator and supplier HTML. Permit/utility,
  equipment acceptance, exact DGX-versus-RTX composition, installed/available distinction, and immutable
  page versions remain unavailable or unknown. German search was required; English-only work would have
  missed parity confirmation but not the later exact update.

## Closest-tracker comparison and decision increment

The closest reviewed open-source comparator remains *The Sovereign AI Tracker*. Repository search on
2026-08-29 found no Munich/Industrial AI Cloud row; its initiative-level schema would not preserve the
exact/up-to/nearly/exact sequence, site/service deduplication, or the 2026-06 supersession. An ordinary
launch headline supports “nearly 10,000,” while the dossier changes the current research decision to
10,000 commissioned Blackwell GPUs no later than 2026-06-18, without backdating it or adding versions.
That version-aware threshold transition is the material increment.
