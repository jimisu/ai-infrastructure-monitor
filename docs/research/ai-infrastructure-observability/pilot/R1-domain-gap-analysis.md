# R1 Track B domain gap analysis

**Status:** R1 research artifact; proposed contracts only
**Baseline:** PR #6 head `c630a966b5f17ccf538771ad9e402d611ff57e88`

## Why `MetricObservation` cannot represent Track B

`src/types/metric.ts` requires a numeric `value`, a company ticker, a closed financial/operating
metric name, one period/period type, unit and source. The canonical store derives logical and
observation identity from those metric fields and a numeric value. This is correct for Demand Layer
v1 and must remain unchanged.

Track B requires facts whose identity and state are not a numeric time series:

- a campus containing executable phases and independently commissioned tranches;
- multiple parties making claims about the same physical phase;
- source-document versions and exact claim locators, including conflicts and supersession;
- lifecycle evidence such as `CONTRACTED`, `PROCURED`, critical power secured and
  `UNDER_CONSTRUCTION`;
- distinct `INFRASTRUCTURE_READY`, `EQUIPMENT_INSTALLED` and `COMMISSIONED` milestones;
- original date text and earliest/latest bounds without invented precision;
- AI attribution state and capacity basis, including `VERIFIED_UNQUANTIFIED` and `AI_UNRESOLVED`;
- planned upper bound, confirmed executable, installed, commissioned and at-risk quantities that
  must not be added together; and
- cancellation, scope revision and schedule-risk history.

Encoding those as numeric observations would require invented proxy values, company attribution for
multi-party projects, loss of graph identity, or mutually incompatible states sharing a metric key.
It would violate AGENTS.md R8/R8a and the approved additive boundary. Therefore the current numeric
canonical schema and providers are **incompatible for direct Track B storage**.

## Missing contracts

| Required boundary | Current repository gap | Minimum future research contract |
|---|---|---|
| Document registry | Source/version fields exist inside issuer pipelines, not as a generic registry | Publisher, source class, URL, version/hash, publication/effective/retrieval time, locator, access method, license/terms note, translation lineage |
| Claim ledger | No generic qualitative evidence record | Exact supported claim separate from normalized interpretation, eligibility, reviewer, conflict and supersession |
| Physical identity graph | No project/campus/phase/tranche store | Stable scoped IDs, parent/child edges, alias/counterparty evidence, merge/split history and unresolved linkage |
| Lifecycle and milestones | Numeric observations do not model transitions | Evidence-backed state transition with event time/range, evidence version, prior state and fail-closed invalid transition |
| Capacity basis | Existing units describe financial/revenue metrics | Original capacity value/unit/basis, AI-attributable basis, confirmed/planned/unquantified state and non-additivity rules |
| Schedule/revision history | Canonical revision tracks numeric source changes only | Expected window at original precision, delay/risk/cancellation/scope event, source and non-destructive history |
| Track B coverage | Existing coverage is issuer/fact-family completeness | Region, language, channel, source accessibility, verification age, unknown/unquantified counts and explicit non-global scope |
| Independent review | Existing pipeline tests are deterministic but not dual-review research workflow | Reviewer identity/time, blinded classification where required, disagreement log and material-disagreement stop |

## Expected boundary

R1M can operate without implementation only by keeping structured records and any prototype entirely
under an approved disposable research workspace. A later R3 plan would need to design a new Track B
domain/store, adapters to selected acquisition primitives, validation and negative tests, and a
provider that joins Demand Layer only in Decision Intelligence. Nothing in R1 authorizes that design
or implementation.
