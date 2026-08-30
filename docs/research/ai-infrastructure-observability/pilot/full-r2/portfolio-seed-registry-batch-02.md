# Full R2 portfolio seed registry — batch 02

**Date:** 2026-08-30

**Scope:** research-only eligibility screen for portfolio candidates 11–15. This is not a verified
global timeline, complete source dossier, production proposal, or final R2 verdict.

**Observation cutoff:** 2026-08-30

## Method and access boundary

This batch used public search-index results resolving to official issuer, operator, government,
university, municipality, or institutional pages. It performed no direct automated acquisition and
committed no source snapshot, translation, third-party dataset row, or copyrighted page content.
Finnish, German, French, and Japanese discovery paths were tested in addition to English.

Public reachability does not establish automated-collection or redistribution permission. Site terms,
`robots.txt`, durable-version behavior, and quotation/reuse rights remain `LEGAL_ACCESS_UNKNOWN`
unless explicitly stated. A later acceptance pass must preserve an immutable version or content hash.

## Batch disposition

| Candidate | Identity used in this batch | Evidence-supported lifecycle | AI attribution | Capacity treatment | Timeline-seed disposition |
|---|---|---|---|---|---|
| Nebius Mäntsälä expansion, Finland | Existing Mäntsälä site and the 25-to-75 MW expansion; later Lappeenranta site excluded | Expansion `COMMISSIONED / OPERATIONAL` no later than the 2026-03-31 issuer statement | `AI_EXPLICIT` | Up to 60,000 GPUs is a design/hosting ceiling, not an installed count. The 75 MW wording is site capacity, not established AI IT load. | `VERIFIED_UNQUANTIFIED`; retain operational expansion, exclude 60,000 and 75 MW from the primary numeric aggregate |
| Isambard-AI, Bristol | Isambard-AI phases 1–2 as one 5,448-GH200 system; Isambard 3 and the wider AIRR excluded | `COMMISSIONED / OPERATIONAL` by the 2025-07-17 launch | `AI_EXPLICIT` | 5,448 GH200 superchips is an eligible disclosed accelerator count but below the ordinary 10,000 threshold. | Exclude from ordinary large-project aggregate; retain only as a below-threshold comparator unless a human later approves `STRATEGIC_EXCEPTION` |
| JUPITER, Jülich | JUPITER Booster and Cluster modules as components of one JUPITER system; JUWELS and the modular data centre excluded | `COMMISSIONED / OPERATIONAL` by the 2025-09-05 inauguration | `AI_EXPLICIT`, while preserving broader HPC use | Official institutional material reports close to 24,000 NVIDIA GH200 chips for the Booster. Facility and cooling power are not substituted for AI IT load. | `QUANTIFIED_LARGE` candidate at approximately 24,000 GH200; eligible only as a 2025 annual commissioned observation pending exact configuration/version and independence review |
| Fluidstack AI supercomputer, France | Announced standalone French 1 GW supercomputer; Mistral deployment and broader French AI-investment announcements excluded | `MOU / ANNOUNCED`; executable site, construction, procurement, and secured project power not established | `AI_EXPLICIT` | 1 GW, nearly 500,000 processors, and post-2028 expansion are announcement/design bounds. | `EXCLUDE_CONFIRMED_BUILD`; retain as a required MOU/political-announcement negative case |
| SoftBank Tomakomai AI Data Center, Hokkaido | Tomakomai Brain DataCenter first 50 MW-scale data-hall phase; 300 MW campus maximum and Sakai excluded | `UNDER_CONSTRUCTION`; FY2026 service target remains prospective at cutoff | `AI_EXPLICIT` | SoftBank identifies 50 MW as maximum power-receiving capacity of the planned data-hall building; 300 MW is a campus completion maximum. Neither is established AI IT load. | `VERIFIED_UNQUANTIFIED`; retain first-phase construction and target, exclude 50/300 MW from primary numeric aggregate |

## Source and claim registry

### 11. Nebius Mäntsälä expansion, Finland

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| NM1 | Nebius, “Nebius to triple capacity at Finland data center to 75 MW,” 2024-10-08, https://nebius.com/newsroom/nebius-to-triple-capacity-at-finland-data-center-to-75-mw | Opening two paragraphs | Expansion would take the site to 75 MW and enable placement of up to 60,000 GPUs. Both are future capacity/design statements, not installed AI capacity. |
| NM2 | Mäntsälä municipality, “Mäntsälässä hyrrää pian yksi maailman tehokkaimmista datakeskuksista,” 2025-01-22, https://www.mantsala.fi/ajankohtaista/uutiset/mantsalassa-hyrraa-pian-yksi-maailman-tehokkaimmista-datakeskuksista/ | Finnish paragraphs beginning “Laajennuksen valmistuttua” and “Datakeskuksen laajennusosan” | Municipality reports the 75 MW/60,000-GPU plan and that expansion/GPU installation was in progress. This supports construction state but repeats operator-origin quantities. |
| NM3 | Nebius, “Nebius to construct 310 MW AI factory in Finland,” 2026-03-31, https://nebius.com/newsroom/nebius-to-construct-310-mw-ai-factory-in-finland | Paragraph describing the prior Mäntsälä expansion | Issuer states the Mäntsälä expansion to 75 MW was completed earlier in 2026. It does not state that 60,000 GPUs were installed. The separate Lappeenranta project must not be added. |

**Identity and aggregation guard:** Existing site capacity, expansion capacity, GPU hosting ceiling,
GPU installation progress, recovered heat, and the separate Lappeenranta project are non-additive.

### 12. Isambard-AI, Bristol

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| IA1 | University of Bristol, “UK's most powerful supercomputer launches in Bristol,” 2025-07-17, https://www.bristol.ac.uk/news/2025/july/isambard-launch.html | Opening launch and system-description paragraphs | Isambard-AI launched for research/industry use and is an operational AI facility. Launch date is an observation/ceremonial bound, not proof of every earlier service milestone. |
| IA2 | University of Bristol, “Lifting the lid on Isambard-AI,” 2025-06-10, https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2025/lifting-the-lid-on-isambard-ai.html | Hardware paragraph beginning “The computing power” | Phases 1–2 total 5,448 GH200 superchips across 1,362 nodes. Nodes, CPUs, GPUs, and superchips are not additive counts. |
| IA3 | UK Government, “AIRR advanced supercomputers for the UK,” mutable current page, https://www.gov.uk/government/publications/ai-research-resource/airr-advanced-supercomputers-for-the-uk | Isambard-AI subsection | Government identifies 5,448 GH200 superchips and an available public-compute service. Mutable page requires version capture; it corroborates configuration but common-origin analysis remains pending. |

**Threshold guard:** 5,448 is below the approved 10,000-accelerator ordinary threshold. Scientific
importance cannot self-authorize a strategic exception.

### 13. JUPITER, Jülich

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| JU1 | Forschungszentrum Jülich, “JUPITER — The New Dimension of Computing,” mutable current page, https://www.fz-juelich.de/en/jupiter | Current overview and exascale-result section | Operator describes JUPITER as Europe's first exascale system and an operating supercomputer. Performance is not converted into accelerator capacity. |
| JU2 | Forschungszentrum Jülich, “JUPITER — Exascale in Europe,” event page updated 2026-04-13, https://www.fz-juelich.de/en/news/events/jupiter-exascale-in-europe | Inauguration description | Inauguration occurred on 2025-09-05. This supports an annual 2025 commissioned observation, not an invented earlier quarter-level service date. |
| JU3 | Forschungszentrum Jülich, “Grand ceremony marks the launch of the Exascale supercomputer JUPITER,” 2025-09-05, https://www.fz-juelich.de/en/news/archive/press-release/2025/ceremony-jupiter | System-description paragraph beginning “At its core” | At launch the operator reported the Booster was equipped with around 24,000 NVIDIA GH200 superchips and supported AI-model training. “Around” remains approximate. |
| JU4 | EuroHPC JU, “JUPITER: Launching Europe's Exascale Era,” 2025-09-05, https://www.eurohpc-ju.europa.eu/jupiter-launching-europes-exascale-era-2025-09-05_en | “More details” section | System owner separately reports approximately 24,000 GH200 superchips and an inaugurated operational system. Common-origin analysis is still required before a Level-2 label. |
| JU5 | JSC JUPITER user documentation, mutable current page, https://apps.fz-juelich.de/jsc/hps/jupiter/ai-overview.html | “AI Workloads on JUPITER” opening | Operator documentation makes project-specific AI workload support explicit. Broader scientific/HPC use remains part of the system identity. |

**Aggregation guard:** Booster, Cluster, nodes, GH200 chips, exaFLOPS, modular data-centre power,
and cooling envelopes describe different scopes or units. Only the disclosed GH200 basis is a
candidate numeric contribution, and only once.

### 14. Fluidstack AI supercomputer, France

| ID | Source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| FL1 | Fluidstack-origin release distributed by Business Wire, “Fluidstack to Build 1GW AI Supercomputer in France,” 2025-02-10, https://www.businesswire.com/news/home/20250210579531/en/Fluidstack-to-Build-1GW-AI-Supercomputer-in-France | Opening bullets and project description | The company announced an MOU with the French government, €10 billion initial investment, 1 GW design and nearly 500,000 processors. This is announcement evidence, not a binding construction/procurement fact. |
| FL2 | Data Center Dynamics, “GPU cloud provider Fluidstack signs MoU for 1GW AI supercomputer in France,” 2025-02-18, https://www.datacenterdynamics.com/en/news/gpu-cloud-provider-fluidstack-signs-mou-for-1gw-ai-supercomputer-in-france/ | Headline and opening paragraphs | Independent reporting confirms the instrument was an MOU and repeats the proposed 2026 operation claim. It does not establish executable phase evidence. |

**Fail-closed result:** No identified official project page establishes a bounded site, construction,
procurement, or secured project-specific power at the cutoff. Keep all quantities outside confirmed
expected capacity and preserve this case for the MOU negative test.

### 15. SoftBank Tomakomai AI Data Center, Hokkaido

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| TM1 | SoftBank integrated-report CEO message, FY2024, https://www.softbank.jp/en/corp/ir/documents/integrated_reports/fy2024/miyakawa/ | Tomakomai paragraph | Operator reports a 300 MW completion maximum, a 50 MW opening scale, and FY2026 target. These are prospective power descriptors, not commissioned AI IT load. |
| TM2 | SoftBank, “Delivering Next-generation Social Infrastructure to Support a Society that Coexists with AI,” mutable current page, https://www.softbank.jp/en/corp/sustainability/materiality/next-gen-infra/ | FY2026 target and footnote 1 | Operator targets FY2026 operation of a 50 MW-scale AI data center and defines 50 MW as maximum receiving capacity of the planned data-hall building. This expressly blocks AI IT-load substitution. |
| TM3 | Tomakomai municipality, company-location profile for SoftBank / IDC Frontier, 2025 publication PDF, https://www.city.tomakomai.hokkaido.jp/files/00004100/00004199/20251027184355.pdf | Japanese “北海道苫小牧AIデータセンターの特徴” section | Municipality identifies the project as an AI-specialized data center under construction and describes the Brain DataCenter role. It supplies non-English local corroboration but no eligible accelerator or AI IT-load quantity. |

**Identity and timing guard:** First-phase data hall, full campus maximum, Brain DataCenter service,
IDC Frontier role, renewable-power plan, and Sakai project are separate facts. FY2026 must remain a
fiscal-year target until an eligible operational source appears.

## Coverage and unresolved work

- This batch covers Europe and Japan and exercises Finnish, Japanese, German, and French discovery;
  exact translations and immutable source versions remain outstanding.
- JUPITER is the only batch case provisionally capable of contributing a large commissioned
  accelerator quantity. Its approximate configuration and Level-2 independence still require review.
- Isambard-AI is operational and AI-explicit but below the ordinary threshold.
- Nebius Mäntsälä and Tomakomai remain numeric-excluded because facility/receiving capacity and design
  ceilings cannot substitute for installed accelerators or AI IT load.
- Fluidstack France remains an MOU/announcement negative case and is excluded from confirmed build.
- No source in this batch is production-eligible; legal/access review and version capture remain open.

## Gate result

`BATCH_02_RESEARCH_CLASSIFIED_WITH_ONE_PROVISIONAL_NUMERIC_CANDIDATE`

This batch advances WP5–WP8 screening for candidates 11–15 and improves non-English discovery
coverage. It does not complete T202–T211, does not establish a global total, and does not authorize
implementation, production state, signals, UI, PR readiness, merge, or deployment.
