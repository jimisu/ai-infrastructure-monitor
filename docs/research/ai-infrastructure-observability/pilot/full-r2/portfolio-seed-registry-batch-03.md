# Full R2 portfolio seed registry — batch 03

**Date:** 2026-08-30

**Scope:** research-only eligibility screen for portfolio candidates 16–20. This is not a verified
global timeline, complete source dossier, production proposal, or final R2 verdict.

**Observation cutoff:** 2026-08-30

## Method and access boundary

This batch used public search-index results resolving to issuer, operator, government, municipality,
regulator, development-bank, and high-quality independent reporting. Korean and Portuguese official
paths were tested alongside English; Arabic, Hindi, and Gujarati primary-source coverage remains
limited. No automated source acquisition was performed and no snapshot, translation, third-party
dataset row, or copyrighted page content was committed.

Public reachability does not establish automated-collection or redistribution permission. Site terms,
`robots.txt`, durable-version behavior, and quotation/reuse rights remain `LEGAL_ACCESS_UNKNOWN`
unless explicitly stated. A later acceptance pass must preserve an immutable version or content hash.

## Batch disposition

| Candidate | Identity used in this batch | Evidence-supported lifecycle | AI attribution | Capacity treatment | Timeline-seed disposition |
|---|---|---|---|---|---|
| SK–AWS Ulsan AI Data Center, South Korea | First 41 MW phase and 103 MW completed facility; later 1/5/15 GW expansion ambitions kept separate | `UNDER_CONSTRUCTION` from the 2025-08-29 groundbreaking | `AI_EXPLICIT` | 41 MW and 103 MW are reported facility phases, not expressly AI IT load. Later GW figures are non-binding expansion ambitions. | `VERIFIED_UNQUANTIFIED`; retain construction and 2027/2029 targets, exclude all MW/GW from primary numeric aggregate |
| Reliance Jamnagar AI infrastructure, India | Gigawatt-scale Jamnagar AI-ready campus and the later Meta 168 MW built-to-suit project linked but not merged | Campus `UNDER_CONSTRUCTION`; Meta project `CONTRACTED / DEVELOPMENT`, with executable tranche unresolved | `AI_EXPLICIT` | Gigawatt-scale and 168 MW are AI-ready/data-center capacity statements, not expressly AI IT load. No installed accelerator count is disclosed. | `VERIFIED_UNQUANTIFIED`; retain campus construction and Meta contract, exclude numeric capacity pending basis and phase resolution |
| HUMAIN / AMD / Cisco program, Saudi Arabia | Multi-year Saudi/U.S. AMD program, later AMD/Cisco JV, and reported Riyadh/Dammam sites kept separate | Program/JV `CONTRACTED_INTENT`; site construction is independently reported but not bound to the announced 100 MW phase | `AI_EXPLICIT` | 500 MW, 100 MW, and 1 GW describe overlapping program/JV ambitions. No eligible site-specific commissioned or executable AI-capacity tranche is established. | `IDENTITY_UNRESOLVED / VERIFIED_UNQUANTIFIED`; exclude from numeric aggregate until site, phase, equipment, and timing are joined by evidence |
| Microsoft / G42 / EcoCloud Olkaria, Kenya | Olkaria geothermal campus and proposed East Africa Azure region; broader $1 billion package excluded | `MOU / LETTER_OF_INTENT`, subsequently `SCHEDULE_AT_RISK`; construction and definitive agreements not established | `AI_EXPLICIT` for the digital/AI ecosystem, but exact project workload share remains unresolved | Initial 100 MW and 1 GW are proposed facility/grid scopes, not AI IT load. Payment guarantees, power scale, and final scope remain disputed. | `EXCLUDE_CONFIRMED_BUILD`; retain as MOU, power-constraint, and conflicting-current-status negative case |
| Scala AI City, Eldorado do Sul, Brazil | Eldorado do Sul campus; Charqueadas references, grid studies, and later campus phases kept separate | `PROTOCOL_OF_INTENT / POWER_CONNECTION_PATH_APPROVED`; construction not established | `AI_EXPLICIT` | 1.8 GW through 2033 and 5 GW potential are transmission-study/load envelopes; 4.75 GW is a full-build campus plan. None is eligible AI IT load. | `EXCLUDE_CONFIRMED_BUILD` pending binding power, executable phase, and construction evidence; retain Portuguese coverage row |

## Source and claim registry

### 16. SK–AWS Ulsan AI Data Center, South Korea

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| UL1 | Ulsan Metropolitan City, Korean press release, 2025-06-22, https://www.ulsan.go.kr/u/rep/bbs/view.do?bbsId=BBS_0000000000000027&dataId=172896 | Korean paragraphs beginning “울산 에이아이 데이터센터” | City records the SK Telecom/AWS project, planned groundbreaking, 2027 completion target, and GPU/NPU AI purpose. The 1 GW aspiration is separate from the first facility. |
| UL2 | SK Telecom, “A Future Core Hub for AI Infrastructure: Official Launch of the SK-AWS Ulsan AI Data Center,” 2025-07-04, https://news.sktelecom.com/en/1960 | Launch and project-description sections | Operator makes the dedicated-AI purpose and partner roles explicit. Launch ceremony is not commissioning or construction evidence. |
| UL3 | Ulsan Metropolitan City, Korean groundbreaking release, 2025-08-29, https://www.ulsan.go.kr/u/rep/bbs/view.ulsan?bbsId=BBS_0000000000000027&dataId=174521&mId=001004003001000000 | Opening groundbreaking paragraphs | City reports the physical groundbreaking. Later city reporting separates a 41 MW first operation target in 2027 from 103 MW completion in 2029. |
| UL4 | SK Telecom, Korean technical commentary, 2026-06-11, https://news.sktelecom.com/226214 | Paragraph beginning “그리고 한 달 뒤인 8월 29일” | Operator restates 41 MW initial operation and 103 MW final facility plan. These are facility-scale figures and are not promoted to AI IT load. |

**Identity and aggregation guard:** Launch, groundbreaking, first operation, facility completion,
AWS customer/partner role, and later 1/5/15 GW cluster ambitions are non-additive states and scopes.

### 17. Reliance Jamnagar AI infrastructure, India

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| JM1 | Reliance Industries, chairman's statement at the 47th AGM, 2024-08-29, https://www.ril.com/sites/default/files/2024-08/Chairmans-Statement-at-47th-RILAGM.pdf | AI infrastructure section | Reliance planned gigawatt-scale AI-ready data centres in Jamnagar. This was a campus ambition, not an executable phase or eligible capacity fact. |
| JM2 | Reliance Industries, chairman's statement at the 48th AGM, 2025-08-28, https://www.ril.com/sites/default/files/reports/Chairmans-Statement-at-48th-RILAGM.pdf | “Reliance Intelligence” mission 1 | Issuer states work had begun on phased gigawatt-scale AI-ready data centres in Jamnagar. It does not resolve phase boundaries, equipment, or AI IT load. |
| JM3 | Reliance Industries exchange filing, “Reliance and Meta to Develop AI-Enabled Data Centre in Jamnagar, Gujarat,” 2026-06-10, https://www.ril.com/sites/default/files/2026-06/SE_10062026.pdf | Opening bullets and project paragraph | Reliance and Meta agreed on a 168 MW built-to-suit data centre targeted for delivery within two years. The filing supports a contract/development state but does not label 168 MW as AI IT load or establish a commissioning tranche. |

**Identity and aggregation guard:** Reliance's campus ambition, phased construction, Meta's built-to-
suit project, green-power system, inference facilities elsewhere, and partner roles are not additive.

### 18. HUMAIN / AMD / Cisco AI infrastructure, Saudi Arabia

| ID | Source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| HU1 | AMD, “AMD and HUMAIN Form Strategic, $10B Collaboration to Advance Global AI,” 2025-05-13, https://newsroom.amd.com/news/amd-and-humain-form-strategic-10b-collaboration/ | Opening agreement paragraphs | Parties announced up to 500 MW across Saudi Arabia and the United States over five years. This is a multi-site program ceiling, not one project. |
| HU2 | AMD, “AMD, Cisco and HUMAIN to Form Joint Venture to Deliver World-Leading AI Infrastructure,” 2025-11-19, https://newsroom.amd.com/news/amd-cisco-and-humain-to-form-joint-venture/ | News summary and first-phase paragraph | Proposed JV would start with a planned 100 MW Saudi deployment and expand toward 1 GW by 2030. Host site and construction identity are not supplied. |
| HU3 | Cisco, matching JV release, 2025-11-19, https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2025/m11/amd-cisco-and-humain-to-form-joint-venture-to-deliver-world-leading-ai-infrastructure.html | News summary | Supplier publication corroborates the plan but is a coordinated announcement and cannot manufacture source independence or a site identity. |
| HU4 | Reuters, “Saudi's Humain to launch data centers with US chips in early 2026,” 2025-08-25, https://www.reuters.com/world/middle-east/saudis-humain-launch-data-centers-with-us-chips-early-2026-bloomberg-news-2025-08-25/ | Opening report and CEO-attributed site paragraphs | Independent report says construction began at Riyadh and Dammam sites of up to 100 MW each. It does not bind either site to the later AMD/Cisco JV's first phase; current completion evidence remains absent. |

**Fail-closed result:** Program totals, vendor commitments, two reported sites, first-phase wording,
and future JV capacity cannot be joined into one project or summed without an explicit evidence bridge.

### 19. Microsoft / G42 / EcoCloud Olkaria, Kenya

| ID | Official or independent source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| KE1 | Office of the President of Kenya, “Kenya, UAE companies sign MOU on mega data centre,” 2024-03-06, https://www.president.go.ke/partnership-with-uae-boosts-kenyas-digital-economy/ | Opening and scale paragraphs | EcoCloud and G42 signed an MOU for an initial 100 MW facility with a 1 GW ambition. MOU evidence does not satisfy confirmed build. |
| KE2 | Microsoft, “Microsoft and G42 announce $1 billion comprehensive digital ecosystem initiative for Kenya,” 2024-05-22, https://news.microsoft.com/source/2024/05/22/microsoft-and-g42-announce-1-billion-comprehensive-digital-ecosystem-initiative-for-kenya/ | Data-center subsection | Announcement describes a future G42-built Olkaria campus and says operation would follow definitive agreements. It identifies a letter of intent, not completed definitive agreements or construction. |
| KE3 | Kenya Broadcasting Corporation, “Kenya clarifies status of $1 billion Microsoft-G42 data centre project,” 2026-05-09, https://www.kbc.co.ke/kenya-clarifies-status-of-1-billion-microsoft-g42-data-centre-project/ | Government clarification section | State-linked reporting says the project had not been withdrawn, while acknowledging power-scale concerns. This prevents a cancellation label but does not establish construction or unchanged scope. |
| KE4 | Reuters, “Microsoft's African data center falters on payment demands,” 2026-05-10, https://www.reuters.com/world/africa/microsofts-african-data-center-falters-payment-demands-bloomberg-news-reports-2026-05-10/ | Opening report | Reporting describes payment-guarantee and power/scope disputes and says talks continue. Preserve `SCHEDULE_AT_RISK`; do not convert the conflict into cancellation or confirmed build. |

**Conflict guard:** “Still under discussion” and “not withdrawn” do not restore the original schedule,
power scope, or definitive-agreement assumption. The project remains non-numeric and unconfirmed.

### 20. Scala AI City, Eldorado do Sul, Brazil

| ID | Official source / version | Exact locator | Normalized claim and boundary |
|---|---|---|---|
| SC1 | Scala Data Centers, “With an initial investment of USD 500 million, Scala Data Centers and Rio Grande do Sul government sign agreement,” 2024-09-11, https://scaladatacenters.com/en/with-an-initial-investment-of-usd-500-million-scala-data-centers-and-rio-grande-do-sul-government-sign-agreement-for-largest-digital-infrastructure-project-in-the-state-of-southern-brazil/ | Opening agreement and location paragraphs | Company/state agreement identifies Eldorado do Sul and AI-oriented campus intent. It does not establish an executable phase or construction. |
| SC2 | Eldorado do Sul municipality, Portuguese release, 2024-11-21, https://www.eldorado.rs.gov.br/portal/noticias/0/3/4671/eldorado-do-sul-assina-protocolo-de-intencoes-junto-a-scala-data-centers-para-construcao-da-scala-ai-city-com-investimento-inicial-de-r-3-bilhoes | Opening protocol paragraphs | Municipality calls the instrument a protocol of intentions. Monetary value and employment claims are evidence only, not capacity or confirmed-build proof. |
| SC3 | Brazil Ministry of Mines and Energy, “MME abre caminhos para conexão de complexo de data centers à rede básica no RS,” 2025-05-13, https://www.gov.br/mme/pt-br/assuntos/noticias/mme-abre-caminhos-para-conexao-de-complexo-de-data-centers-a-rede-basica-no-rs | Opening paragraphs | Ministry recognized a technical alternative for connection to Brazil's grid. This is a connection path, not proof of a completed interconnection contract, energization, or construction. |
| SC4 | Brazil Energy Research Office, 2025 southern-grid study presentation, https://www.epe.gov.br/sites-pt/areas-de-atuacao/energia-eletrica/ArquivosGrupoEstudosTransmissao/6.2%20Apresentacao%20-%205a%20Reuni%C3%A3o%20do%20GET%20Sul%20-%202025.pdf | “SCALA AI CITY” slide | Study records 1.8 GW through 2033 and 5 GW expansion potential as load/transmission planning. These grid envelopes are not AI IT load or executable phase capacity. |

**Fail-closed result:** Protocol, government facilitation, grid study, campus masterplan, and future
phases remain separate. No identified source establishes construction or binding project power.

## Coverage and unresolved work

- This batch adds Korean and Portuguese official-source discovery plus the first African and Saudi
  screens; Arabic, Hindi, and Gujarati primary-source coverage remains incomplete.
- Ulsan and Jamnagar have physical/contractual progress but no eligible AI IT-load or accelerator
  quantity for the primary aggregate.
- HUMAIN remains a program-to-site identity failure despite reported construction at two sites.
- Kenya is a high-value schedule-risk case: MOU/letter-of-intent evidence and later disputes must be
  preserved without declaring either confirmed build or cancellation.
- Scala's technical grid path does not prove binding power or construction and remains outside
  confirmed expected capacity.
- No batch-03 case contributes a primary numeric capacity observation. No source is production-
  eligible; legal/access review, exact versions, and independent classification remain open.

## Gate result

`BATCH_03_RESEARCH_CLASSIFIED_WITH_NO_PRIMARY_NUMERIC_AGGREGATION`

This batch completes first-pass eligibility screening for candidates 16–20 and therefore all 20
selected portfolio candidates now have either depth-case or seed-batch research. It does not complete
T202–T211: portfolio consolidation, negative cases, timeline aggregation, coverage analysis,
maintenance simulation, independent review, and final verdict remain open. It does not authorize
implementation, production state, signals, UI, PR readiness, merge, or deployment.
