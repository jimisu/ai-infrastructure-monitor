# Full R2 portfolio seed registry — batch 01

**Date:** 2026-08-30

**Scope:** research-only eligibility screen for portfolio candidates 6–10 after the five depth-case
comparison. This is not a verified global timeline, numeric aggregate, production proposal, or final
R2 verdict.

**Observation cutoff:** 2026-08-30

## Method and access boundary

This batch used public search-index results that resolve to public official pages; it performed no
direct automated source acquisition. No source snapshot, translation, third-party dataset row, or
copyrighted page content was committed.
The locators below identify the publication and relevant heading or claim region; a later acceptance
pass must preserve an immutable snapshot or content hash before any production proposal.

Public reachability does not establish automated-collection or redistribution permission. Site terms,
`robots.txt`, durable-version behavior, and quotation/reuse rights remain `LEGAL_ACCESS_UNKNOWN`
unless explicitly stated. This batch therefore permits research classification only.

## Batch disposition

| Candidate | Identity used in this batch | Evidence-supported lifecycle | AI attribution | Capacity treatment | Timeline-seed disposition |
|---|---|---|---|---|---|
| Stargate Abilene, Texas | Lancium Clean Campus eight-building AI data-center program; original two-building phase and six-building expansion kept separate | First phase `COMMISSIONED / OPERATIONAL`; second phase `UNDER_CONSTRUCTION` with mid-2026 target | `AI_EXPLICIT` | 200+ MW and 1.2 GW are data-center power/campus capacity, not established AI IT load. Building designs of up to 50,000 GB200 NVL72 systems are design bounds, not installed counts. | `VERIFIED_UNQUANTIFIED`; retain phases and delivered-capacity evidence, exclude all MW/GPU design bounds from primary numeric aggregate |
| Microsoft Fairwater, Wisconsin | Mount Pleasant Fairwater facility only; distributed Fairwater network excluded | `COMMISSIONED / OPERATIONAL` by 2026-06-23 | `AI_EXPLICIT` | Official wording supports hundreds of thousands of GPUs and a later two-gigawatt scale statement, but neither supplies an exact installed accelerator count or unambiguous project-specific AI IT-load basis for this batch. | `VERIFIED_UNQUANTIFIED`; eligible lifecycle row, no numeric aggregate contribution |
| CoreWeave Lancaster, Pennsylvania | Proposed Lancaster AI data center; initial 100 MW and possible 300 MW expansion kept separate | `ANNOUNCED / FUNDED_INTENT`; no eligible construction, procurement, critical-power-secured, or operational evidence found in this batch | `AI_EXPLICIT` | Initial 100 MW and up-to-300 MW are reported facility plans. They remain non-additive planned bounds and do not establish confirmed AI IT load. | Exclude from confirmed expected capacity; retain as planned upper-bound discovery row |
| Meta Hyperion, Richland Parish, Louisiana | Hyperion campus and its construction-in-progress assets; generation projects remain separate supporting infrastructure | `UNDER_CONSTRUCTION` | `AI_EXPLICIT` at project level | Current Louisiana official page reports 5 GW of IT capacity for the expanded campus. It is a campus upper bound and must not be booked early or added to future phases; no supported commissioning tranche is established here. | `REPORTED_PLANNED_UPPER_BOUND`; **no current commissioned or primary expected-capacity aggregate contribution** until executable phase/tranche and timing are resolved |
| Stargate Norway, Kvandal near Narvik | Kvandal facility/JV; initial 230 MW and additional 290 MW ambition kept separate | `CONTRACTED`, with construction/commissioning state unresolved | `AI_EXPLICIT` | 100,000-GPU end-2026 target and 230 MW planned capacity are forward-looking. Aker later reports Microsoft contracted full site capacity plus 30,000 Vera Rubin GPUs, but this does not establish installed or commissioned capacity. | `VERIFIED_UNQUANTIFIED` confirmed contractual project; retain 100,000/30,000 and 230/290 MW as separate forward-looking evidence, exclude from current commissioned aggregate |

## Source and claim registry

### 6. Stargate Abilene, Texas

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| AB1 | Crusoe, “Crusoe Expands AI Data Center Campus in Abilene to 1.2 Gigawatts,” 2025-03-18, https://crusoe.ai/newsroom/crusoe-expands-ai-data-center-campus-in-abilene-to-1-2-gigawatts | Opening paragraphs beginning “construction has begun” and “Crusoe began constructing” | Six-building second phase was under construction; eight-building campus planned for 1.2 GW total power capacity. Initial two-building phase was 200+ MW with a first-half-2025 energization target. Capacity wording is not accepted as AI IT load. |
| AB2 | Crusoe / Blue Owl / Primary Digital Infrastructure, “Enter Second Phase of $15 Billion Joint Venture,” 2025-05-21, https://crusoe.ai/newsroom/crusoe-blue-owl-capital-and-primary-digital-infrastructure-enter-joint-venture/ | Paragraphs beginning “Under the terms of the joint venture” and “The eight buildings are designed” | Funding and active construction corroborate second-phase executability. Up-to-50,000 GB200 NVL72 systems per building is a design capability, not an installed accelerator fact. |
| AB3 | Crusoe, “Crusoe announces flagship Abilene data center is live,” 2025-09-30, https://www.crusoe.ai/resources/newsroom/crusoe-announces-flagship-abilene-data-center-is-live | Opening paragraph | First phase was operating on Oracle Cloud Infrastructure by publication. This is a commissioning/operational observation bound, not the original service date. |
| AB4 | Oracle, “Abilene, Texas Data Center,” mutable current page, https://www.oracle.com/data-centers/abilene/ | “Construction Timeline and Delivery” and current delivered-capacity statement | AI workloads are live and Oracle reports a delivered share of total capacity. Mutable page requires a captured version before later reuse; percentage delivery must not be converted into MW without an eligible common basis. |

**Identity and aggregation guard:** The original campus, first phase, six-building expansion, later
adjacent Microsoft campus, and broader Stargate program are not one additive quantity. The later
900 MW Microsoft campus is outside this candidate identity and must not revise the original eight-
building record by assumption.

### 7. Microsoft Fairwater, Wisconsin

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| FW1 | Microsoft, “Inside the world’s most powerful AI datacenter,” 2025-09-18, https://blogs.microsoft.com/blog/2025/09/18/inside-the-worlds-most-powerful-ai-datacenter/ | Opening Wisconsin/Fairwater paragraphs and facility-description section | Mount Pleasant is purpose-built for AI and contains three large buildings. “Hundreds of thousands” is not an exact accelerator count and does not support the 10,000-count threshold numerically. |
| FW2 | Microsoft, “Made in Wisconsin,” 2025-09-18, https://blogs.microsoft.com/on-the-issues/2025/09/18/made-in-wisconsin-the-worlds-most-powerful-ai-datacenter/ | Paragraph beginning “We are on track” | Construction and an early-2026 online target were reported. The statement is superseded for current lifecycle by FW3. |
| FW3 | Microsoft Source, “Microsoft completes construction on first datacenter facility in Mount Pleasant, Wisconsin,” 2026-06-23, https://news.microsoft.com/source/2026/06/23/microsoft-completes-construction-on-first-datacenter-facility-in-mount-pleasant-wisconsin/ | Opening two paragraphs | First facility was fully operational by publication after equipment startup in April. Publication supplies an operational observation bound, not a precise first-service date. |
| FW4 | Microsoft FY2026 Q1 earnings call, 2025-10-29, https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q1 | Infrastructure remarks mentioning Fairwater | Microsoft said Wisconsin would go online in 2026 and “scale to two gigawatts.” The wording does not establish that 2 GW is current commissioned AI IT load or one executable tranche. |

**Identity and aggregation guard:** Wisconsin Fairwater is not the entire distributed Fairwater
superfactory, the Atlanta site, or Microsoft’s global capacity addition. Network-level chip or power
statements cannot be assigned to Wisconsin without project-specific evidence.

### 8. CoreWeave Lancaster, Pennsylvania

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| LC1 | CoreWeave investor release, “CoreWeave Announces Multi-Billion Dollar Commitment to AI Infrastructure in Pennsylvania,” 2025-07-15, https://investors.coreweave.com/news/news-details/2025/CoreWeave-Announces-Multi-Billion-Dollar-Commitment-to-AI-Infrastructure-in-Pennsylvania/default.aspx | Opening announcement and paragraph describing initial capacity | Operator announced intent to commit up to USD 6 billion to equip an initial 100 MW AI data center with possible expansion to 300 MW. “Intent to commit” and planned capacity do not establish confirmed-build entry. |
| LC2 | CoreWeave, “Building Pennsylvania Into the Mid-Atlantic AI Hub,” 2025-07-15, https://www.coreweave.com/blog/building-pennsylvania-into-the-mid-atlantic-ai-hub | Paragraphs beginning “That’s why CoreWeave” and “With room to grow” | AI attribution is explicit; 300 MW is an expansion ceiling. This same-origin operator publication is not independent evidence and does not cure lifecycle eligibility. |
| LC3 | CoreWeave Q3 2025 results, 2025-11-10, https://investors.coreweave.com/news/news-details/2025/CoreWeave-Reports-Strong-Third-Quarter-2025-Results/ | Operational-highlight bullet referring to Lancaster | Later issuer reporting still describes intent to commit, not eligible construction or procurement evidence. |

**Fail-closed result:** Keep Lancaster outside confirmed expected capacity until an eligible source
establishes construction, critical power, procurement, or another approved confirmed-build state.

### 9. Meta Hyperion, Richland Parish, Louisiana

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| HY1 | Louisiana Economic Development, “Meta Selects Northeast Louisiana,” 2024-12-04, https://www.opportunitylouisiana.gov/news/meta-selects-northeast-louisiana-as-site-of-10-billion-artificial-intelligence-optimized-data-center-governor-jeff-landry-calls-investment-a-new-chapter-for-state | Project description and paragraph stating site work begins in December | Project is explicitly AI-optimized and site work was scheduled to begin in December 2024, with construction continuing through 2030. Later sources are required for current status. |
| HY2 | Meta, “Meta Announces Joint Venture With Funds Managed by Blue Owl Capital to Develop Hyperion Data Center,” 2025-10-21, https://about.fb.com/news/2025/10/meta-blue-owl-capital-develop-hyperion-data-center/ | Opening transaction description and paragraph describing contributed assets | Binding JV financing and contributed construction-in-progress assets establish active development/construction. USD amounts are evidence only and must not be converted into capacity. |
| HY3 | Louisiana Economic Development, “Meta Data Center in Louisiana,” mutable current project page, https://www.opportunitylouisiana.gov/data-center/meta | Opening project summary | State page describes the project as currently being built and reports an expanded campus of nearly 10 million square feet and 5 GW of IT capacity. Mutable page requires version capture before later promotion. |

**Identity and aggregation guard:** Hyperion campus capacity is a non-additive campus upper bound.
The campus, individual data-center buildings, supporting generation/transmission, construction-in-
progress assets, and future AI training clusters require separate identities and tranches.

### 10. Stargate Norway, Kvandal near Narvik

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| SN1 | OpenAI, “Introducing Stargate Norway,” 2025-07-31, https://openai.com/index/introducing-stargate-norway/ | Paragraphs describing ownership/build roles, 230 MW, additional 290 MW, and 100,000-GPU target | Nscale would design/build, Nscale/Aker JV was expected to own, and OpenAI was an initial prospective offtaker. The 230 MW and 100,000-GPU figures are planned targets; 290 MW is a separate ambition. |
| SN2 | Nscale, “Nscale, Aker and OpenAI to establish Stargate Norway,” 2025-07-31, https://www.nscale.com/press-releases/stargate-norway-nscale-aker-openai | Opening announcement and capacity paragraph | Same launch supplies operator/developer wording but may share origin with SN1. It does not independently establish construction or commissioning. |
| SN3 | Aker, Q1 2026 shareholder letter, 2026-05-08, https://www.akerasa.com/investors/shareholder-letters/2026/first-quarter-2026 | Norway / Kvandal discussion | Aker reports Microsoft contracted full Kvandal capacity and added 30,000 Vera Rubin GPUs to an existing commitment. This supports a contractual state, not installed hardware or commissioning. Customer change must be preserved rather than silently treating the OpenAI launch description as current. |

**Identity and aggregation guard:** The OpenAI launch, Nscale/Aker JV, Microsoft contract, initial
230 MW facility, additional 290 MW ambition, 100,000-GPU target, and incremental 30,000-GPU customer
commitment overlap but are not automatically additive.

## Coverage and unresolved work

- Batch geography is North America-heavy: four candidates in North America and one in Europe.
- All reviewed sources were English-accessible; this batch does not improve low-English coverage.
- Exact source hashes, immutable snapshots, complete site-terms review, and `robots.txt` review remain
  outstanding. No source is production-eligible.
- Abilene and Fairwater supply commissioned/operational rows without eligible numeric AI capacity.
- Lancaster remains outside confirmed-build eligibility.
- Hyperion requires executable phase and commissioning-tranche resolution before any primary timeline
  aggregation.
- Stargate Norway requires construction and service evidence; contractual GPU quantities remain
  forward-looking.

## Gate result

`BATCH_01_RESEARCH_CLASSIFIED_WITH_NO_PRIMARY_NUMERIC_AGGREGATION`

This batch advances WP5–WP8 source, identity, lifecycle, and timeline screening for candidates 6–10.
It does not complete T202–T211, does not establish 15 qualifying projects, and does not authorize a
portfolio aggregate, implementation, production state, signals, UI, PR readiness, merge, or
deployment.
