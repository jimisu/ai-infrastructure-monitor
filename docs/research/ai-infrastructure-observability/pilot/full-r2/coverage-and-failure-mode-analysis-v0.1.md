# Full R2 coverage and failure-mode analysis v0.1

**Status:** `RESEARCH_ONLY_COVERAGE_CHARACTERIZED_NOT_GLOBAL_COMPLETE`

**Date:** 2026-08-30

**Observation cutoff:** 2026-08-30

**Population:** 15 retained confirmed-build or commissioned rows from portfolio consolidation v0.2;
the seven excluded/held cases remain visible as negative and coverage evidence. Counts below describe
the selected research portfolio, not market share, capacity share, or a complete global inventory.

## Geographic coverage

| Analytical region | Retained rows | Excluded/held cases | Coverage finding |
|---|---:|---:|---|
| North America | 6 | 2 | Overrepresented; public English operator, government, and supplier channels are easiest to discover |
| Europe | 4 | 2 | German, Finnish, French, EU, and English paths were exercised; depth and source independence remain uneven |
| Asia | 4 | 0 | Japanese and Korean official paths were exercised; Indian local-language and phase evidence remain partial |
| Middle East | 1 | 1 | UAE qualifies unquantified; Saudi program-to-site identity remains unresolved; Arabic parity is incomplete |
| Africa | 0 | 1 | Kenya supplies a valuable MOU/schedule-risk negative case but no qualifying row |
| South America | 0 | 1 | Brazil supplies Portuguese discovery and grid-boundary evidence but no qualifying row |

The 15-row minimum is met, but Africa and South America have zero retained rows and North America
accounts for six. “Global” can therefore mean only a cross-region, publicly verified known-project
seed with explicit gaps. It cannot mean complete global capacity or representative sampling.

## Lifecycle and capacity coverage

| Dimension | Observed portfolio coverage | Limitation |
|---|---|---|
| Commissioned/operational | Munich, Colossus, Abilene first phase, Fairwater Wisconsin, Nebius expansion, JUPITER, and Rainier | Exact first-service dates and immutable versions are uneven; Abilene also contains continuing expansion |
| Under construction | UAE, Sakai, Hyperion, Tomakomai, Ulsan, Jamnagar, and Michigan | Most rows lack an eligible project-specific AI IT-load or accelerator quantity |
| Contracted | Stargate Norway | Forward customer/GPU commitments are not installed or commissioned capacity |
| Schedule risk | Kenya negative case | No qualifying retained row currently supplies an evidence-backed delay/cancellation tranche |
| Numeric accelerator basis | Munich Blackwell, Colossus Hopper, JUPITER GH200, Rainier Trainium2 | Four distinct model/time semantics; no common equivalent or total is valid |
| `VERIFIED_UNQUANTIFIED` | 11 of 15 retained rows | Confirms physical progression but cannot support a numeric capacity total |
| Below ordinary threshold | El Capitan and Isambard-AI comparators | No human `STRATEGIC_EXCEPTION` was granted |

This mix is adequate to exercise identity, lifecycle, time-precision, and unquantified-state rules.
It is weak for numeric capacity analysis: only four rows retain an accelerator quantity, and none
provides a common, additive AI IT-load basis.

## Language and source-channel coverage

| Coverage area | State | Evidence and gap |
|---|---|---|
| English | `AVAILABLE_UNSTRUCTURED` | Available for most operator, partner, regulator, government, and institutional paths; selection bias is material |
| German | `AVAILABLE_UNSTRUCTURED` | Munich and JUPITER paths exercised; exact German/English semantic parity and durable versions remain incomplete |
| Japanese | `PARTIAL` | Sakai and Tomakomai official Japanese paths exercised alongside English summaries; no committed translations or immutable snapshots |
| Korean | `PARTIAL` | Ulsan city and SK Telecom paths exercised; no complete legal/reuse or durable-version review |
| Finnish | `PARTIAL` | Mäntsälä municipality path exercised; issuer evidence remains the main lifecycle source |
| Portuguese | `PARTIAL` | Scala municipality, ministry, and grid-study paths exercised, but the case does not qualify |
| Arabic | `PARTIAL` | UAE/Saudi English partner material exists; Arabic primary-source parity remains incomplete |
| Hindi/Gujarati | `PARTIAL` | Reliance English issuer filings exist; local-language government/utility coverage remains incomplete |

No language is classified `AVAILABLE_STRUCTURED`. Public reachability did not resolve automated
access, redistribution rights, site terms, `robots.txt`, or stable document-version behavior.

## Evidence quality and reproducibility coverage

| Control | Current state | Consequence |
|---|---|---|
| Project-specific primary evidence | Present for the retained classifications | Supports research classification only |
| Provisional Level 2 | Not established for most material claims | Coordinated or common-origin partner releases cannot manufacture independence |
| Immutable source versions | Partial; many mutable HTML pages remain | Same-URL revisions cannot be reproduced reliably without later capture |
| Exact locators | Recorded at heading/claim-region level in depth and batch registries | Better than headline-only discovery, but not a production audit package |
| Legal/permitted access | Generally `LEGAL_ACCESS_UNKNOWN` | No automated acquisition or redistribution authority follows |
| `last_verified_at` | Research observations are dated 2026-08-29 or 2026-08-30 | None is stale at cutoff; future 120-day handling has not been simulated here |
| Closest-tracker comparison | Completed for five depth cases | Portfolio-wide tracker comparison remains incomplete |

## Coverage-driven failure modes

1. **False completeness:** a 15-row threshold can look global while Africa and South America have no
   retained row and English-rich North America dominates.
2. **False quantification:** 11 unquantified rows can be visually mistaken for zero capacity or be
   assigned estimates to make a chart appear complete.
3. **False independence:** partner, supplier, government, and operator pages may repeat one launch
   package even when they occupy different domains.
4. **Version drift:** mutable pages can change quantity or state while retaining the same URL.
5. **Language asymmetry:** English summaries may omit phase, unit, legal, or schedule qualifications
   present in local-language material.
6. **Lifecycle asymmetry:** public groundbreaking evidence is common; equipment acceptance,
   first-service, partial commissioning, delay, and cancellation evidence are much thinner.
7. **Capacity-basis asymmetry:** facility/grid power is frequently disclosed, while project-specific
   AI IT load is rarely disclosed.
8. **Recency asymmetry:** newly announced projects have visible launch material, while quiet projects
   may lack updates without being delayed, canceled, or demand-negative.

## Permitted presentation boundary

Any later research timeline must keep the following adjacent to the rows:

- scope: selected publicly verified known projects, not complete global capacity;
- data-as-of and `last_verified_at`;
- retained-row count and `VERIFIED_UNQUANTIFIED` count;
- region and language gaps, including zero retained rows in Africa and South America;
- model-specific quantities without cross-model sum;
- planned upper bounds, schedule-at-risk, and excluded cases separated from confirmed rows; and
- immutable-version, source-independence, and legal-access limitations.

This analysis does not create an aggregate. It only establishes what a later view would have to say
to avoid false precision and false completeness.

## Result

`CROSS_REGION_RESEARCH_COVERAGE_WITH_MATERIAL_GEOGRAPHIC_LANGUAGE_AND_REPRODUCIBILITY_GAPS`

Coverage and failure modes are now characterized for the current portfolio. T204, T206, T206A,
T208–T211, maintenance simulation, independent portfolio review, and the final R2 verdict remain
open. No implementation, production state, signal, UI, PR readiness, merge, or deployment authority
is created.
