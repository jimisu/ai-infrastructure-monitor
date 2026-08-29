# WP7M priority negative-case results

| # | Negative case | Test input | Expected fail-closed behavior | Result |
|---:|---|---|---|---|
| 1 | Announcement without executable evidence | Telekom D1 future 10,000-GPU announcement | Do not classify commissioned at D1 | PASS — commissioning begins only at D3 launch evidence |
| 2 | Repeated announcement | xAI operator and NVIDIA supplier describe original 100k | One deployment, corroborating sources, not two projects | PASS |
| 3 | Campus/phase duplication | xAI 100k, 180k/200k, one-million roadmap | Do not add configurations or roadmap | PASS — only 100k lower-bound retained |
| 4 | Facility power substituted for AI IT load | Memphis power/turbine context | Do not infer MW AI capacity | PASS — no MW value produced |
| 5 | Unsupported AI share | Any mixed site/service scope not bound to physical AI hardware | Remain unresolved; no allocated AI fraction | PASS — no inferred share |
| 6 | Invented date precision | xAI February 2025/full-scale and unknown first workload day | Preserve month/unknown; no invented day/quarter | PASS |
| 7 | Planned, installed and commissioned added | Munich 10k future, up-to-10k installing, nearly-10k launch | Preserve states; never add or normalize | PASS — threshold remains unresolved |
| 8 | Discovery tracker substituted for original source | Any external tracker row | Tracker may discover only; original evidence required | PASS — prototype uses committed official-source packets only |

No skipped case is reported as passing. Clearly bounded evidence mutations were unnecessary because the two selected cases naturally exercised the required failure modes.
