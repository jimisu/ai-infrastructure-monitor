# Vertiv Physical Build Commitment v0.1

Status: research and implementation specification only
Research cut-off: 2026-08-16
Issuer: Vertiv Holdings Co (`VRT`, SEC CIK `0001674101`)
Production effect: none

## 1. Objective and guardrails

This specification defines how a future ingestion pipeline could test whether hyperscaler infrastructure-spending intent is appearing in Vertiv's disclosed orders, book-to-bill, backlog, sales, and explicitly attributed AI-infrastructure demand. It does not claim that every Vertiv order, sale, or backlog dollar is AI-related and does not create a Vertiv signal.

Only Tier-1 evidence is eligible: Vertiv Investor Relations releases and presentations, Vertiv-filed SEC 8-K/10-Q/10-K documents, and a stable official Vertiv transcript if one is later published. Webcast audio, media transcripts, aggregators, and analyst estimates are not canonical substitutes.

The repository state reviewed at `69c83046c71b56f9bd350eba2d7e80b28e1de0dc` has five production ingestion pipelines, canonical schema version 2, immutable snapshots, deterministic observation identity, baseline/proposed-state verification, and coverage reporting separate from ingestion health. It contains no Vertiv ingestion, fixture, canonical observation, provider, or signal implementation. The future design below reuses those boundaries without changing existing data or signals.

## 2. Historical official-source registry

### 2.1 Document-set and classification policy

For each fiscal quarter, the production required document set is:

1. the issuer-filed SEC Form 8-K Exhibit 99.1 containing the earnings release, used as immutable economic evidence;
2. the corresponding 10-Q or 10-K, used for issuer/report-period identity and accounting-context validation; and
3. the official Vertiv IR release page, registered as a non-required discovery reference and human-readable corroboration path, not as immutable unattended transport when the same release is filed with the SEC.

The production absence gate requires only `ECONOMIC_EVIDENCE` and `PERIOD_CONTEXT`. `IR_DISCOVERY_REFERENCE` and official presentations are non-required by default. Each ingestion run need not acquire the IR page successfully; when the required SEC set is complete, IR HTTP 403, timeout, or layout drift produces only a deterministic non-fatal warning. If an IR document contains unique economic evidence absent from the SEC required set, that exact period/document must be explicitly registered under a separate required role before acquisition; the generic IR role can never imply requiredness. Required/corroborating roles are fixed before acquisition and cannot change based on retrieval success. Q4 uses the annual 10-K.

Research and production classifications are separate:

- `RESEARCH_CANDIDATE_NOT_DISCLOSED` means manual research did not find a qualifying disclosure in the inspected material. It is provisional, cannot be written to production coverage, and cannot be promoted.
- Production `NOT_DISCLOSED` requires every period-specific required document to be acquired, identity-validated, content-inspected, absence-checked for that fact family, and recorded with auditable snapshot/manifest provenance.
- If any required document is unavailable, unvalidated, uninspected, or lacks an auditable absence check, the period/family is `MISSING`, not `NOT_DISCLOSED`.

Research inspection never satisfies production acquisition.

### 2.2 Quarterly research findings

`Q` and `TTM` below are distinct quarterly and trailing-twelve-month organic-orders YoY series. These are research findings, not promotable coverage declarations.

| Fiscal period | Publication | Research findings / proposed outcomes | Retrieval/layout notes |
|---|---:|---|---|
| 2024-Q1 | 2024-04-24 | Q orders 60%; book-to-bill 1.5x; backlog amount $6.3B; reported sales 8%; explicit AI-demand wording. TTM orders are `RESEARCH_CANDIDATE_NOT_DISCLOSED`. | Business Wire duplication; organic orders explicitly exclude FX. |
| 2024-Q2 | 2024-07-24 | Q orders 57%; TTM 37%; book-to-bill 1.4x; reported/organic sales 13%/14%. Backlog is `RESEARCH_CANDIDATE_NOT_DISCLOSED`. | Quarterly and TTM values are adjacent. |
| 2024-Q3 | 2024-10-23 | Q orders ~17%; TTM ~37%; reported sales 19%. Book-to-bill/backlog are `RESEARCH_CANDIDATE_NOT_DISCLOSED`. | Approximation is material; Vertiv capacity is not customer demand. |
| 2024-Q4 | 2025-02-12 | TTM orders ~30%; reported sales 26%. Q orders, book-to-bill, backlog are `RESEARCH_CANDIDATE_NOT_DISCLOSED`. | TTM-only research finding; hyperscale/colocation is not AI-specific. |
| 2025-Q1 | 2025-04-23 | Q orders ~13%; TTM ~20%; book-to-bill ~1.4x; backlog $7.9B, ~10% sequential and 25% YoY; reported/organic sales 24%/25%. | Amount and both growth bases are separate facts. |
| 2025-Q2 | 2025-07-30 | Q orders ~15%; TTM ~11%; book-to-bill ~1.2x; backlog $8.5B; reported sales 35%. | 11% sequential orders is neither Q YoY nor TTM YoY. |
| 2025-Q3 | 2025-10-22 | Q orders ~60%; TTM 21%; book-to-bill ~1.4x; backlog $9.5B; reported/organic sales 29%/28%; explicit AI-driven-infrastructure wording. | PRNewswire duplicates and approximation variants. |
| 2025-Q4 | 2026-02-11 | Q orders ~252%; TTM ~81%; book-to-bill ~2.9x; backlog $15.0B and 109% YoY; reported/organic sales 23%/19%. | 117% sequential orders is separate; $15.0B preserves reported precision. |
| 2026-Q1 | 2026-04-22 | Reported/organic sales 30%/23%; named-project and AI-demand wording. Numeric Q/TTM orders, book-to-bill, backlog are provisional `RESEARCH_CANDIDATE_NOT_DISCLOSED`. | Manual release/presentation research only; no production absence is authorized. |
| 2026-Q2 | 2026-07-29 | Reported/organic sales 24%/18%; mixed AI/general-compute wording. Numeric Q/TTM orders, book-to-bill, backlog are provisional `RESEARCH_CANDIDATE_NOT_DISCLOSED`. | Required SEC documents remain `NOT_RUN` for production acquisition. |

### 2.3 Document-level registry

Every registered document has all required fields. The role table supplies invariant fields; the period table supplies document-specific fields. Together they form one document record.

| documentRole | required | immutableUrl rule | expectedContentType |
|---|---:|---|---|
| `IR_DISCOVERY_REFERENCE` | no | `null`; IR page is not represented as immutable | `text/html` |
| `ECONOMIC_EVIDENCE` | yes | exact accession-specific SEC exhibit URL | `text/html` |
| `PERIOD_CONTEXT` | yes | exact accession-specific SEC 10-Q/10-K URL | `text/html` |
| `PRESENTATION_CORROBORATION` | no | `null` unless issuer supplies immutable identity | `application/pdf` |

`researchInspectionStatus` is `INSPECTED`, `PARTIALLY_INSPECTED`, or `REGISTERED_ONLY`. `productionAcquisitionStatus` is `NOT_RUN` for every document because no Vertiv production pipeline exists.

| Period | documentRole | documentIdentity | officialUrl | researchInspectionStatus | productionAcquisitionStatus |
|---|---|---|---|---|---|
| 2024-Q1 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2024-q1` | [IR](https://investors.vertiv.com/news/news-details/2024/Vertiv-Reports-60-Organic-Orders-Growth-8-Net-Sales-Growth-in-First-Quarter-Updates-Full-Year-2024-Outlook/default.aspx) | INSPECTED | NOT_RUN |
| 2024-Q1 | ECONOMIC_EVIDENCE | `0001628280-24-017513:EX-99.1:q12024exhibit991vrt042424.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828024017513/q12024exhibit991vrt042424.htm) | PARTIALLY_INSPECTED | NOT_RUN |
| 2024-Q1 | PERIOD_CONTEXT | `0001628280-24-018417:10-Q:vrt-20240331.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828024018417/vrt-20240331.htm) | REGISTERED_ONLY | NOT_RUN |
| 2024-Q2 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2024-q2` | [IR](https://investors.vertiv.com/news/news-details/2024/Vertiv-Reports-57-Organic-Orders-Growth-13-Net-Sales-Growth-and-63-Operating-Profit-Growth-in-Second-Quarter-Raises-Full-Year-2024-Outlook/default.aspx) | INSPECTED | NOT_RUN |
| 2024-Q2 | ECONOMIC_EVIDENCE | `0001628280-24-032675:EX-99.1:q22024exhibit991vrt072424.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828024032675/q22024exhibit991vrt072424.htm) | REGISTERED_ONLY | NOT_RUN |
| 2024-Q2 | PERIOD_CONTEXT | `0001628280-24-033173:10-Q:vrt-20240630.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828024033173/vrt-20240630.htm) | REGISTERED_ONLY | NOT_RUN |
| 2024-Q3 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2024-q3` | [IR](https://investors.vertiv.com/news/news-details/2024/Vertiv-Reports-Strong-Third-Quarter-2024-Results-and-Raises-Full-Year-Guidance/default.aspx) | INSPECTED | NOT_RUN |
| 2024-Q3 | ECONOMIC_EVIDENCE | `0001628280-24-043343:EX-99.1:q32024exhibit991vrt102324.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828024043343/q32024exhibit991vrt102324.htm) | REGISTERED_ONLY | NOT_RUN |
| 2024-Q3 | PERIOD_CONTEXT | `0001628280-24-043698:10-Q:vrt-20240930.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828024043698/vrt-20240930.htm) | REGISTERED_ONLY | NOT_RUN |
| 2024-Q4 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2024-q4` | [IR](https://investors.vertiv.com/news/news-details/2025/Vertiv-Reports-Strong-Fourth-Quarter-2024-Results/default.aspx) | INSPECTED | NOT_RUN |
| 2024-Q4 | ECONOMIC_EVIDENCE | `0001628280-25-005006:EX-99.1:exhibit991vrt02122025.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828025005006/exhibit991vrt02122025.htm) | REGISTERED_ONLY | NOT_RUN |
| 2024-Q4 | PERIOD_CONTEXT | `0001628280-25-005905:10-K:vrt-20241231.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828025005905/vrt-20241231.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q1 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2025-q1` | [IR](https://investors.vertiv.com/news/news-details/2025/Vertiv-Reports-Strong-First-Quarter-2025-Results/) | INSPECTED | NOT_RUN |
| 2025-Q1 | ECONOMIC_EVIDENCE | `0001628280-25-018915:EX-99.1:q12025exhibit991vrt042325.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828025018915/q12025exhibit991vrt042325.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q1 | PERIOD_CONTEXT | `0001628280-25-019372:10-Q:vrt-20250331.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828025019372/vrt-20250331.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q2 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2025-q2` | [IR](https://investors.vertiv.com/news/news-details/2025/Vertiv-Reports-Strong-Orders-Sales-and-EPS-Growth-Raises-Full-Year-Guidance/) | INSPECTED | NOT_RUN |
| 2025-Q2 | ECONOMIC_EVIDENCE | `0001674101-25-000006:EX-99.1:q22025exhibit991vrt7302025.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000167410125000006/q22025exhibit991vrt7302025.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q2 | PERIOD_CONTEXT | `0001674101-25-000008:10-Q:vrt-20250630.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000167410125000008/vrt-20250630.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q3 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2025-q3` | [IR](https://investors.vertiv.com/news/news-details/2025/Vertiv-Reports-Strong-Third-Quarter-Results-including-Organic-Orders-60-Diluted-EPS-122-Adjusted-EPS-63-Raises-2025-Guidance/) | INSPECTED | NOT_RUN |
| 2025-Q3 | ECONOMIC_EVIDENCE | `0001674101-25-000020:EX-99.1:q32025exhibit991vrt10222025.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000167410125000020/q32025exhibit991vrt10222025.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q3 | PERIOD_CONTEXT | `0001674101-25-000024:10-Q:vrt-20250930.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000167410125000024/vrt-20250930.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q3 | PRESENTATION_CORROBORATION | `vrt-presentation-2025-q3` | [PDF](https://s205.q4cdn.com/554782763/files/doc_financials/2025/q3/Vertiv-Third-Quarter-2025-Results-Presentation.pdf) | INSPECTED | NOT_RUN |
| 2025-Q4 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2025-q4` | [IR](https://investors.vertiv.com/news/news-details/2026/Vertiv-Reports-Strong-Fourth-Quarter-with-Organic-Orders-Growth-of-252-and-Diluted-EPS-Growth-of-200-Adjusted-Diluted-EPS-37/) | INSPECTED | NOT_RUN |
| 2025-Q4 | ECONOMIC_EVIDENCE | `0001674101-26-000006:EX-99.1:exhibit991vrt02112026.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000167410126000006/exhibit991vrt02112026.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q4 | PERIOD_CONTEXT | `0001674101-26-000008:10-K:vrt-20251231.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000167410126000008/vrt-20251231.htm) | REGISTERED_ONLY | NOT_RUN |
| 2025-Q4 | PRESENTATION_CORROBORATION | `vrt-presentation-2025-q4` | [PDF](https://s205.q4cdn.com/554782763/files/doc_financials/2025/q4/Vertiv_Fourth-Quarter-2025-Results-Presentation.pdf) | INSPECTED | NOT_RUN |
| 2026-Q1 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2026-q1` | [IR](https://investors.vertiv.com/news/news-details/2026/Vertiv-Reports-Strong-First-Quarter-with-Diluted-EPS-Growth-of-136-Adjusted-Diluted-EPS-Growth-of-83-Raises-Full-Year-Guidance/default.aspx) | INSPECTED | NOT_RUN |
| 2026-Q1 | ECONOMIC_EVIDENCE | `0001628280-26-026379:EX-99.1:q12026exhibit991vrt04222026.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828026026379/q12026exhibit991vrt04222026.htm) | PARTIALLY_INSPECTED | NOT_RUN |
| 2026-Q1 | PERIOD_CONTEXT | `0001628280-26-026556:10-Q:vrt-20260331.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828026026556/vrt-20260331.htm) | REGISTERED_ONLY | NOT_RUN |
| 2026-Q1 | PRESENTATION_CORROBORATION | `vrt-presentation-2026-q1` | [PDF](https://s205.q4cdn.com/554782763/files/doc_financials/2026/q1/Vertiv-First-Quarter-2026-Results-Presentation.pdf) | INSPECTED | NOT_RUN |
| 2026-Q2 | IR_DISCOVERY_REFERENCE | `vrt-ir-release-2026-q2` | [IR](https://investors.vertiv.com/news/news-details/2026/Vertiv-Reports-Strong-Second-Quarter-2026-with-Diluted-EPS-Growth-of-53-Adjusted-Diluted-EPS-Growth-of-60-Raises-Full-Year-2026-Guidance-Across-All-Key-Metrics/default.aspx) | INSPECTED | NOT_RUN |
| 2026-Q2 | ECONOMIC_EVIDENCE | `0001628280-26-050323:EX-99.1:q22026exhibit991vrt07292026.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828026050323/q22026exhibit991vrt07292026.htm) | REGISTERED_ONLY | NOT_RUN |
| 2026-Q2 | PERIOD_CONTEXT | `0001628280-26-050609:10-Q:vrt-20260630.htm` | [SEC](https://www.sec.gov/Archives/edgar/data/1674101/000162828026050609/vrt-20260630.htm) | REGISTERED_ONLY | NOT_RUN |

The registry intentionally does not invent missing presentation URLs. Newly found presentations remain corroborating until registered. Production discovery must validate [SEC submissions for CIK 0001674101](https://data.sec.gov/submissions/CIK0001674101.json), issuer, accession, form, filing/report dates, primary/evidence document, and immutable archive URL.

### 2.4 Wording and layout drift

- 2024 releases commonly use Business Wire HTML and “organic orders (excluding foreign exchange).” Later releases use `~` and “approximately” more heavily.
- Repeated headline, bullet, prose, and presentation text supplies corroborating locators, not additional observations.
- A quarter can disclose both Q and TTM orders, TTM only, or neither. Absence never permits conversion or carry-forward.
- Backlog amount and one or more growth comparisons can coexist in one sentence.
- Reported and organic net-sales growth can coexist with different percentages.
- PDF extraction must preserve page and semantic heading, not PDF token order.
- Starting in 2026-Q1, manual research found no numeric orders/backlog/book-to-bill in the release while qualitative pipeline language remained. This is provisional research evidence, not production absence and not zero.

## 3. Canonical schema and identity compatibility

This is a proposed Phase 2 design only. No type or schema is changed in this research phase.

### 3.1 Compatibility decision

The current repository `MetricObservation` is numeric: `value: number`; its `MetricName` does not yet include VRT metrics, and its `PeriodType` is limited to `MONTH | QUARTER | YEAR | POINT_IN_TIME`. Therefore:

- Numeric Vertiv facts will extend `MetricName` with the numeric VRT metric IDs and add the required optional semantic fields without changing existing observations.
- Fiscal-quarter facts use existing `QUARTER` and `YYYY-Qn`.
- TTM facts use existing `POINT_IN_TIME` for backward-compatible storage, a period such as `TTM-2025-Q4`, and mandatory `measurementWindow: TRAILING_TWELVE_MONTHS`. Phase 2 must reject a TTM candidate lacking both markers. Adding a new common `TRAILING_TWELVE_MONTHS` period type is deferred because it would broaden the shared schema unnecessarily.
- Backlog as-of facts use existing `POINT_IN_TIME`, an explicit `asOfDate`, and a period such as `2025-12-31`.
- Qualitative `VrtAttributionEvidence` is a separate canonical evidence type and provider collection. It must never be cast to, embedded as the value of, or returned as a numeric `MetricObservation`.
- Existing providers and observations remain valid without VRT fields. Backward-compatibility tests must build every current provider, verify all existing observation/signal IDs byte-for-byte, and prove old canonical-v2 documents still validate.

Conceptual numeric extension:

```ts
type VrtNumericObservation = MetricObservation & {
  metric: VrtNumericMetricName;
  seriesId: string;
  comparisonBasis?: "YOY" | "SEQUENTIAL";
  comparisonPeriod?: string;
  measurementBasis?: "ORGANIC" | "REPORTED";
  measurementWindow?: "FISCAL_QUARTER" | "TRAILING_TWELVE_MONTHS" | "AS_OF_DATE";
  asOfDate?: string;
  approximate?: boolean;
  reportedText: string;
  reportedScale: "PERCENT" | "RATIO_X" | "USD_MILLIONS" | "USD_BILLIONS";
  reportedPrecision: number;
};
```

Conceptual qualitative type:

```ts
type VrtAttributionEvidence = {
  id: string;
  companyTicker: "VRT";
  assertionDefinitionVersion: "vrt-ai-attribution-v1";
  assertionType: "DEMAND" | "ORDERS" | "PIPELINE" | "PROJECT" | "PRODUCT" | "CAPACITY";
  scope: VrtAttributionScope;
  subject: VrtAttributionSubject;
  relationship: VrtAttributionRelationship;
  stableEventOrFiscalPeriod: string;
  normalizedAssertion: string;
};
```

Source-document version, snapshot identity, locator, and excerpt hash remain on the enclosing canonical record/provenance, not in either payload's economic identity.

### 3.2 Approximation and reported precision

The parser stores these separately:

- normalized numeric `value`;
- `approximate: true` only when official wording explicitly uses `~`, “approximately,” “about,” or an approved equivalent;
- exact `reportedText`;
- `reportedScale`; and
- `reportedPrecision`, the number of displayed decimal places at the reported scale.

`$15.0 billion` has one decimal place of issuer-reported precision. In the absence of an explicit approximation word, `approximate` remains false, but that does not claim the underlying economic amount is unrounded. Calculations may not add precision beyond the disclosure. No backlog growth may be calculated from rounded backlog amounts; only an issuer-reported growth fact is eligible.

### 3.3 Three-layer deterministic identity

The design follows `scripts/ingestion/shared/canonical-store.mjs`:

1. **`logicalFactKey` — economic fact identity only.** It includes issuer/ticker, metric, series ID, period/as-of or TTM window, comparison basis and comparison period when applicable, measurement basis, unit, and economic-definition version. It excludes value and all acquisition/provenance fields.
2. **`observation.id` — semantic observation identity.** It is a deterministic hash of the ordered logical identity plus normalized economic value, normalized unit, and explicit lexical approximation semantic. Retrieval time and candidate ordering are excluded.
3. **`recordId` — evidence-record identity.** Existing canonical v2 computes it from observation ID, source-document version, and snapshot ID. This is where a particular acquisition is distinguished.

The following are prohibited in a numeric `logicalFactKey` or numeric `observation.id`: `sourceDocumentVersionId`, `snapshotId`, source locator, URL position, and excerpt hash. They belong only to record provenance. A same-version/same-snapshot re-fetch creates nothing. The same source-document version with a new snapshot and unchanged semantics is a provenance reassertion, not a new fact or revision. A distinct later source-document version is not a same-version provenance reassertion under current canonical v2. VRT v0.1 must select the registered authoritative document version for each period/fact and treat other documents as corroborating locators rather than re-ingesting historical restatements. Any future multi-version restatement policy requires a separate canonical-accounting decision. If the same immutable document identity returns different bytes/hash, `VRT_SOURCE_VERSION_CONFLICT` takes priority and the candidates fail/quarantine before any revision path. An economic revision requires a legally distinct, registered new source-document version. Phase 2 must not modify shared canonical-store semantics without separate review.

Custom VRT identity fields are required because the current default canonical identity does not include `seriesId`, `comparisonBasis`, `comparisonPeriod`, `measurementBasis`, `measurementWindow`, or `asOfDate`. `reportedText`, `reportedScale`, `reportedPrecision`, formatting, and presentation fidelity are explicitly excluded from logical and observation identity. They remain payload/evidence metadata.

### 3.4 Independent qualitative canonical evidence store

Qualitative attribution never enters numeric `buildCanonicalPromotion()`. Phase 2 uses three independent disposable/production artifacts:

- numeric canonical: `data/ingestion/observations/vrt-physical-build.json`;
- qualitative canonical: `data/ingestion/evidence/vrt-ai-attribution.json`; and
- atomic disclosure ledger: `data/ingestion/coverage/vrt-period-disclosures.json`.

The qualitative document has its own proposed schema:

```ts
type VrtAttributionCanonical = {
  schemaVersion: 1;
  pipelineId: "vrt-ai-attribution";
  issuer: "VRT";
  records: Array<{
    recordId: string;
    assertionKey: string;
    assertionId: string;
    sourceDocumentVersionId: string;
    snapshotId: string;
    sourceLocator: VrtSourceLocator;
    excerptHash: string;
    status: "ACTIVE" | "SUPERSEDED";
    assertion: VrtAttributionEvidence;
  }>;
};
```

Its independent promotion function must implement:

- **assertion identity:** deterministic hash of the semantic assertion key only; no publication/provenance fields;
- **provenance record identity:** deterministic hash of assertion ID, source-document version, snapshot ID, locator, and excerpt hash;
- **append:** a new semantic assertion creates one active assertion record;
- **idempotency:** the same provenance record creates nothing;
- **reassertion:** a different fixture/live snapshot or official document record supporting the same semantic assertion adds provenance without creating a new economic assertion;
- **semantic revision:** a materially changed scope, subject, relationship, or stable event period is a distinct assertion, not a silent overwrite;
- **conflict:** the same provenance identity supporting incompatible normalized semantics fails/quarantines before promotion;
- **ordering:** records sort deterministically by stable event/fiscal period, assertion ID, source-document version, snapshot ID, then record ID.

The qualitative store has an independent validator, promotion function, and provider. It uses the same raw snapshot trust boundary but never calls numeric `buildCanonicalPromotion()`. Fixture and live snapshots remain distinct exactly as in section 7. Production and proposed-state paths are resolved from the supplied canonical root; tests write only disposable roots. The numeric provider reads only the numeric canonical file, while the qualitative provider reads only the qualitative evidence file. Fake numeric values and TypeScript `as` casts that bypass either schema are prohibited.

Backward-compatibility verification must prove that introducing this independent store changes no existing canonical schema-v2 document, provider output, observation ID, or signal ID.

## 4. Fact contracts

All numeric contracts use the three-layer identity model in section 3. The listed logical keys contain economic semantics only. Observation IDs add normalized value, normalized unit, and explicit lexical approximation semantic. Reported representation and provenance fields do not alter economic identity.

### 4.1 `VRT_ORGANIC_ORDERS_GROWTH_QUARTERLY_YOY`

- **Economic meaning:** issuer-reported organic order growth for one fiscal quarter versus the same prior-year fiscal quarter.
- **Value/unit:** numeric percentage; explicit approximation and reported precision preserved separately.
- **Period:** `YYYY-Qn`, `QUARTER`, `YOY`; series `vrt-organic-orders-growth-quarterly-yoy`.
- **Acceptable wording:** named-quarter organic orders plus explicit prior-year/YoY comparison.
- **Required evidence:** one unambiguous semantic fact tied to VRT, fiscal quarter, organic orders, and YoY.
- **Logical key:** `VRT|VRT_ORGANIC_ORDERS_GROWTH_QUARTERLY_YOY|vrt-organic-orders-growth-quarterly-yoy|YYYY-Qn|YOY|comparison-quarter|ORGANIC|PERCENT|definition-version`.
- **Missing behavior:** production `NOT_DISCLOSED` only after the complete period document gate; otherwise `MISSING`. Manual absence is `RESEARCH_CANDIDATE_NOT_DISCLOSED`.
- **Prohibited substitutions:** TTM, sequential, YTD, pipeline/regional orders, sales, book-to-bill, or values derived from TTM.

### 4.2 `VRT_ORGANIC_ORDERS_GROWTH_TTM_YOY`

- **Economic meaning:** issuer-reported organic order growth for the trailing twelve months ended at a stated date/quarter versus the prior comparable TTM.
- **Value/unit:** numeric percentage with approximation/precision preserved.
- **Period:** `TTM-YYYY-Qn`, `POINT_IN_TIME`, mandatory `measurementWindow: TRAILING_TWELVE_MONTHS`, `YOY`; series `vrt-organic-orders-growth-ttm-yoy`.
- **Acceptable wording:** explicit `TTM`/“trailing twelve-month,” organic orders, and prior comparable TTM.
- **Required evidence:** TTM end period and comparison window must be unambiguous.
- **Logical key:** `VRT|VRT_ORGANIC_ORDERS_GROWTH_TTM_YOY|vrt-organic-orders-growth-ttm-yoy|TTM-end|TRAILING_TWELVE_MONTHS|YOY|prior-TTM|ORGANIC|PERCENT|definition-version`.
- **Missing behavior:** same production gate as quarterly.
- **Prohibited substitutions:** quarterly, sequential, YTD or annual orders, rolling calculations, and any TTM-to-quarter conversion.

### 4.3 `VRT_BOOK_TO_BILL`

- **Economic meaning:** issuer-disclosed ratio of orders booked to revenue billed for the expressly stated measurement window.
- **Value/unit:** positive numeric `RATIO_X`; approximation/precision preserved.
- **Period:** official window only; `QUARTER` only when “in/for the quarter” is explicit.
- **Logical key:** `VRT|VRT_BOOK_TO_BILL|vrt-book-to-bill-{window}|period|measurement-window|RATIO_X|definition-version`.
- **Required evidence:** book-to-bill anchor, ratio, and unique window in one semantic block.
- **Missing behavior:** production `NOT_DISCLOSED` only after the complete period document gate; an unstated window is `MISSING`.
- **Prohibited substitutions:** independently dividing orders by sales, backlog ratios, guidance, or carry-forward.

### 4.4 `VRT_BACKLOG`

This family contains three non-interchangeable series:

1. `VRT_BACKLOG_AMOUNT` / `vrt-backlog-amount`: issuer-reported backlog balance at an as-of date, numeric currency amount.
2. `VRT_BACKLOG_GROWTH_YOY` / `vrt-backlog-growth-yoy`: issuer-reported percentage change versus an explicit prior-year comparison period.
3. `VRT_BACKLOG_GROWTH_SEQUENTIAL` / `vrt-backlog-growth-sequential`: issuer-reported percentage change versus an explicit immediately preceding period.

Required logical identities are:

```text
VRT|VRT_BACKLOG_AMOUNT|vrt-backlog-amount|as-of-date|AS_OF_DATE|currency-unit|definition-version
VRT|VRT_BACKLOG_GROWTH_YOY|vrt-backlog-growth-yoy|as-of-date|YOY|comparison-period|PERCENT|definition-version
VRT|VRT_BACKLOG_GROWTH_SEQUENTIAL|vrt-backlog-growth-sequential|as-of-date|SEQUENTIAL|comparison-period|PERCENT|definition-version
```

Each growth identity must include series ID, as-of period/date, comparison basis, comparison period, and unit. One sentence may yield separate amount, YoY, and sequential candidates only when each is explicit. `$15.0 billion` preserves its reported text, scale, and one-decimal precision; it does not imply unrounded exactness. A qualitative “record backlog” is supporting commentary only. Revenue, remaining performance obligations, pipeline, bookings, and parser-computed growth are prohibited substitutes. The parser must never calculate an undisclosed growth rate from one or more backlog amounts.

### 4.5 `VRT_NET_SALES_GROWTH`

- **Economic meaning:** issuer-reported actual net-sales YoY growth, with basis explicit.
- **Value/unit:** numeric percentage for the disclosed actual fiscal quarter or actual full year.
- **Separate identities:** `vrt-net-sales-growth-reported-yoy` with `REPORTED`, and `vrt-net-sales-growth-organic-yoy` with `ORGANIC`.
- **Logical key:** `VRT|VRT_NET_SALES_GROWTH|seriesId|actual-period|periodType|YOY|measurementBasis|PERCENT|definition-version`.
- **Required evidence:** actual-results context, period, YoY comparator, and basis.
- **Missing behavior:** either basis may be independently `NOT_DISCLOSED` after the production gate.
- **Prohibited substitutions:** one basis for the other; quarterly for full year; actual for guidance; guidance for actual; segment/acquisition contribution; orders growth; or growth calculated from rounded sales when the issuer reports a percentage.

### 4.6 `VRT_AI_ATTRIBUTION`

Qualitative attribution is `VrtAttributionEvidence` in the independent qualitative store, not a numeric `MetricObservation`.

Closed scope taxonomy:

| Scope | Eligible as `VRT_AI_ATTRIBUTION` | Meaning |
|---|---:|---|
| `AI_EXPLICIT` | yes | Vertiv explicitly links the assertion to AI/AI infrastructure without a broader mixed scope. |
| `AI_AND_GENERAL_COMPUTE_MIXED` | yes, mixed only | Vertiv combines AI and general compute; never normalize to AI-only. |
| `HYPERSCALE_COLOCATION_NON_AI_SPECIFIC` | no | Hyperscale/colocation without explicit AI; supporting commentary only. |
| `GENERAL_DATA_CENTER_NON_AI_SPECIFIC` | no | Generic data-center/high-density wording without explicit AI; supporting commentary only. |
| `NAMED_AI_PROJECT` | yes | A named project explicitly described by Vertiv as AI-related. |
| `AI_PRODUCT_OR_CAPACITY` | yes | A product or Vertiv capacity action explicitly linked to AI applications; it does not prove customer orders/backlog are AI-specific. |

Closed subject taxonomy:

- `AI_INFRASTRUCTURE_DEMAND`
- `AI_AND_GENERAL_COMPUTE_DEMAND`
- `HYPERSCALE_COLOCATION_DEMAND`
- `GENERAL_DATA_CENTER_DEMAND`
- `NAMED_AI_PROJECT`
- `AI_PRODUCT_OR_CAPACITY`

Closed relationship taxonomy:

- `SUPPORTS_ORDERS`
- `SUPPORTS_BACKLOG`
- `SUPPORTS_SALES`
- `SUPPORTS_PIPELINE`
- `DRIVES_CAPACITY_EXPANSION`
- `DESCRIBES_MARKET_DEMAND`
- `OTHER_QUALITATIVE_LINK`

`OTHER_QUALITATIVE_LINK` is not a permissive fallback: it is eligible only when an approved fixture/contract explicitly maps the wording and subject. Unknown, conflicting, or ambiguous subject/relationship mappings fail closed with `VRT_AI_ATTRIBUTION_UNSUPPORTED`.

The semantic assertion key is:

```text
VRT|assertionDefinitionVersion|normalizedScope|normalizedSubject|normalizedRelationship|stableEventOrFiscalPeriod
```

`assertionDefinitionVersion` begins at `vrt-ai-attribution-v1`. `stableEventOrFiscalPeriod` is the fiscal period of the asserted economic activity, or a stable named-event date when the assertion is event-specific. Publication date is provenance only. Publication date, source-document version, excerpt hash, locator, URL, and snapshot ID are prohibited from assertion key/ID.

Synonym normalization is a checked-in, versioned mapping from exact semantic anchors to the closed scope/subject/relationship values. Word order, active/passive voice, punctuation, and approved synonyms do not change identity. The parser cannot invent a new vocabulary value. Different official documents that restate the same normalized assertion for the same stable event/fiscal period must produce the same assertion ID and multiple provenance records. A parity fixture must prove this using materially different official wording.

Required evidence is exact Vertiv-authored wording with an explicit eligible AI anchor, subject, relationship, stable period/event, and auditable original excerpt. Mixed wording remains mixed. Company-wide orders, backlog, and sales remain company-wide. Generic supplier-category inference, media/analyst statements, customer statements not adopted by Vertiv, and numeric allocation from qualitative language are prohibited. An absent attribution is not negative attribution.

## 5. Parser semantics and validation

### 5.1 Extraction pipeline

Use the existing trust boundary: official discovery -> immutable raw snapshot/manifest -> candidates -> validation -> deterministic identity -> disposable proposed state -> verification -> explicit promotion. Signal and React code must never read candidates or snapshots directly.

Semantic extraction must:

1. normalize HTML text nodes, non-breaking spaces, Unicode dashes, PDF line wrapping, and table header spans without discarding headings;
2. locate issuer, fiscal period, and metric anchors;
3. bind a number only within the smallest sentence, bullet, table row/column, or headed block that contains its metric and period/comparison anchors;
4. require exactly one semantic candidate for a logical fact, while recognizing identical bullet/prose repetitions as duplicate evidence;
5. parse sign, value, scale, ratio suffix, approximation marker, period, comparison basis, and measurement basis together; and
6. retain URL, accession/document identity, HTML selector or PDF page/heading, and excerpt hash.

The parser must never use “the Nth numeric cell.” Tables require semantic row labels and normalized column identities. PDF extraction requires page/heading anchors and a layout-fidelity fixture or quarantine.

### 5.2 Metric-specific uniqueness and bounds

| Metric | Required unique anchors | Range/unit checks | Ambiguity handling |
|---|---|---|---|
| Quarterly orders YoY | `organic orders` + named quarter + prior-year/YoY | finite percentage; explicit `%`; broad sanity bound `-100%` to `+1000%`, with 2025-Q4 252% retained | Reject if TTM/sequential scope can bind the same number or two unequal quarterly candidates remain. |
| TTM orders YoY | `TTM`/`trailing twelve-month` + `organic orders` + end/comparison period | finite percentage, explicit `%`; same sanity bound | Reject absent TTM end period or if a quarterly value is the only candidate. |
| Book-to-bill | `book-to-bill` + explicit measurement window | finite ratio `>0` and `<=10`; explicit `x`/ratio wording | Reject if period is missing or multiple unequal ratios bind. Never calculate. |
| Backlog amount | `backlog` + currency amount + as-of/end-of-period anchor | positive; currency and million/billion scale explicit | Reject ambiguous currency/scale/date. Do not bind nearby backlog-growth number as amount. |
| Backlog growth | `backlog` + change term + comparator | percentage and YoY/sequential basis explicit; `>=-100%` and `<=1000%` | Reject if comparison basis is absent; amount and growth remain separate candidates. |
| Net-sales growth | `net sales` or `organic net sales` + quarter/comparator | percentage; reported/organic basis explicit; `>=-100%` and `<=1000%` | Reject if one number could describe both reported and organic series. |
| AI attribution | explicit AI term + subject + relationship | text only; no numeric derivation | Reject generic data-center language, unattributed third-party language, or ambiguous subject/scope. |

Bounds detect parsing errors, not economic plausibility thresholds. A value inside a bound is not automatically valid; all semantic gates still apply.

## 6. Fail-closed, outcome, and coverage behavior

### 6.1 Deterministic error codes

The existing `IngestionError(code, message, details)` accepts deterministic string codes, so Phase 2 uses the `VRT_*` namespace without creating a second error framework.

| Code | Trigger |
|---|---|
| `VRT_DISCOVERY_UNAVAILABLE` | official discovery cannot be completed |
| `VRT_DOCUMENT_RESPONSE` | required document unavailable or wrong content type |
| `VRT_DOCUMENT_PROVENANCE` | issuer/CIK/accession/form/document/date/URL conflict |
| `VRT_PERIOD_MISMATCH` | document and extracted fiscal period conflict |
| `VRT_SOURCE_VERSION_CONFLICT` | same registered document identity has inconsistent immutable bytes |
| `VRT_AMBIGUOUS_METRIC` | multiple unequal semantic candidates survive |
| `VRT_DUPLICATE_SEMANTIC_FACT` | one logical key has conflicting values |
| `VRT_ORDERS_PERIOD_AMBIGUOUS` | Q, TTM, YTD, or sequential window unresolved |
| `VRT_ORDERS_BASIS_AMBIGUOUS` | organic/comparison basis unresolved |
| `VRT_BOOK_TO_BILL_PERIOD_AMBIGUOUS` | ratio window absent |
| `VRT_BACKLOG_FACT_AMBIGUOUS` | amount, YoY, and sequential facts cannot be separated |
| `VRT_BACKLOG_UNIT_AMBIGUOUS` | currency/scale absent |
| `VRT_NET_SALES_BASIS_AMBIGUOUS` | reported/organic or actual/guidance basis unresolved |
| `VRT_AI_ATTRIBUTION_UNSUPPORTED` | AI link inferred, generic, or not Vertiv-authored |
| `VRT_MALFORMED_NUMBER` | sign/value/percent/ratio/currency parse incomplete |
| `VRT_VALUE_OUT_OF_RANGE` | validation sanity bound exceeded |
| `VRT_SOURCE_LOCATOR_MISSING` | evidence cannot be audited |
| `VRT_IDENTITY_CONFLICT` | deterministic identity collision with different semantics |
| `VRT_REQUIRED_FACT_UNACCOUNTED` | required period/family has no valid disclosure outcome |

### 6.2 Error/outcome mapping

| Condition | Candidate action | Issuer ingestion health | Period ledger | Warning |
|---|---|---|---|---|
| Parser/semantic/provenance failure in a required document | reject/quarantine affected candidates; no partial promotion | `FAILED` with deterministic `VRT_*` code | `MISSING` | no |
| Ambiguous or conflicting candidate | quarantine all candidates for that logical fact | `FAILED` | `MISSING` | no |
| Required acquisition incomplete | emit no fact and no absence claim | `FAILED` | `MISSING` | no |
| Complete required set, valid fact present | validate/promote candidate in proposed root | `SUCCESS` | `PRESENT` | no |
| Complete required set, no qualifying disclosure after auditable absence check | emit no numeric observation; record disclosure outcome | `SUCCESS` | production `NOT_DISCLOSED` | no |
| Optional corroborating document unavailable while required set is complete | no candidate from that document | `SUCCESS` | determined only by required set | deterministic non-fatal warning |
| Manual research absence | no runtime candidate/outcome | not applicable | forbidden from production ledger | research-only `RESEARCH_CANDIDATE_NOT_DISCLOSED` |

A warning cannot make failed ingestion healthy and cannot upgrade `MISSING` to `NOT_DISCLOSED`. `NOT_DISCLOSED` is not a numeric observation, neutral/zero direction, or manual research label.

### 6.3 Atomic period disclosure ledger

Phase 2 uses one pipeline-local source of truth:

```text
VRT | atomicFactSeries | period -> PRESENT | NOT_DISCLOSED | MISSING | NOT_APPLICABLE
```

Atomic series are:

1. `VRT_ORGANIC_ORDERS_GROWTH_QUARTERLY_YOY`
2. `VRT_ORGANIC_ORDERS_GROWTH_TTM_YOY`
3. `VRT_BOOK_TO_BILL`
4. `VRT_BACKLOG_AMOUNT`
5. `VRT_BACKLOG_GROWTH_YOY`
6. `VRT_BACKLOG_GROWTH_SEQUENTIAL`
7. `VRT_NET_SALES_GROWTH_REPORTED`
8. `VRT_NET_SALES_GROWTH_ORGANIC`
9. `VRT_AI_ATTRIBUTION`

Each ledger entry contains issuer, atomic series, period, applicability, requiredness, disclosure outcome, required document identities, and their acquired, identity-validated, content-inspected, absence-checked, and provenance-recorded flags. Production `NOT_DISCLOSED` requires every flag for every required source to be true.

Applicability/requiredness is a checked-in matrix, not inferred from whether a parser found a value:

| Atomic series | Applicable period shape | Initial required horizon |
|---|---|---|
| Quarterly orders YoY | each registered fiscal quarter | 2024-Q1 through latest registered quarter |
| TTM orders YoY | each registered fiscal quarter whose contract requires a TTM disclosure check | explicitly enumerated periods; no automatic assumption |
| Book-to-bill | each explicitly enumerated fiscal quarter | explicitly enumerated periods |
| Backlog amount | each explicitly enumerated quarter-end | explicitly enumerated periods |
| Backlog growth YoY | only periods explicitly registered for YoY comparison tracking | explicitly enumerated periods |
| Backlog growth sequential | only periods explicitly registered for sequential comparison tracking | explicitly enumerated periods |
| Net-sales growth reported | each registered actual-results quarter | 2024-Q1 through latest registered quarter |
| Net-sales growth organic | only periods explicitly registered for organic-growth tracking | explicitly enumerated periods |
| AI attribution | each registered disclosure period checked for eligible attribution | 2024-Q1 through latest registered quarter |

The concrete period lists must be checked into the Phase 2 registry before ingestion. A non-applicable series/period receives `NOT_APPLICABLE`, never `NOT_DISCLOSED` or `MISSING`, and does not participate in reduction. Advancing any horizon requires explicit official discovery and registry review, never date arithmetic.

The existing coverage contract remains the only family-level reporting contract. Its entries are a pure deterministic projection of the atomic ledger and cannot be manually maintained. Each atomic series maps to exactly one declared family. Projection truth table:

| Applicable atomic outcomes for a family | family disclosureOutcome | coverageMode | sourceCheck |
|---|---|---|---|
| any `MISSING` | `MISSING` | `MISSING` | `FAILED` |
| all applicable outcomes `NOT_DISCLOSED` | `NOT_DISCLOSED` | `null` | `SUCCESSFUL` |
| at least one `PRESENT`, all remaining applicable outcomes `PRESENT` or valid `NOT_DISCLOSED` | `PRESENT` | `INGESTED` | `SUCCESSFUL` |
| no applicable outcomes | fail contract configuration | none | `FAILED` |

`NOT_APPLICABLE` entries are excluded before reduction. Historical `PRESENT` can never hide a latest-period `MISSING`. The reducer validates issuer, atomic-series-to-family mapping, required horizon, uniqueness, and ledger completeness. A supplied family summary that differs from the pure projection fails closed; run reporting consumes only the computed projection.

Required reducer tests cover: backlog amount present with required YoY growth missing; reported sales present with required organic sales missing; latest period missing; mixed present/not-disclosed; all not-disclosed; non-applicable series/period; duplicate ledger key; and ledger/family-summary mismatch.

## 7. Fixture and verification plan

Fixtures must be structurally faithful extracts of official layout, not idealized sentences. Fixture provenance and live provenance are distinct:

- `fixtureSha256` hashes fixture bytes; live `snapshotSha256` hashes acquired official bytes.
- Fixture manifests use `acquisitionMode: FIXTURE`; live manifests use `acquisitionMode: LIVE`.
- Fixtures write only to disposable test roots and can never be seeded into or promoted to production canonical paths.
- A fixture may simulate the same `sourceDocumentVersionId` as the registered live document for parity testing, but its snapshot ID/hash must identify fixture bytes and must not impersonate a live snapshot.
- Fixture -> live with the same logical fact, normalized value/unit, lexical approximation semantic, and source-document version must be a provenance reassertion: `newFacts=0`, `revisions=0`, stable observation ID.

### 7.1 Mandatory transition fixtures

- **2024-Q1:** reproduce headline/bullet/prose duplication, `1.5x`, `$6.3 billion`, “organic orders (excluding foreign exchange),” 60% Q YoY, and explicit AI wording. TTM may become production `NOT_DISCLOSED` only in a complete multi-document fixture bundle.
- **2025-Q3:** reproduce ~60% Q, 21% TTM, ~1.4x quarterly book-to-bill, $9.5B backlog, 29% reported/28% organic sales, and AI-driven-infrastructure wording. Prove approximation, window, and basis survive.
- **2025-Q4:** reproduce ~252% Q YoY, 117% sequential, ~81% TTM, ~2.9x, $15.0B, 109% backlog YoY, and 23%/19% reported/organic sales. Prove Q/TTM/sequential separation, reported precision, separate backlog facts, and qualitative-only AI evidence.

### 7.2 Additional and negative fixtures

Positive layout coverage includes 2024-Q2 adjacent Q/TTM and 13%/14% sales; 2024-Q3 approximation; 2024-Q4 TTM-only; 2025-Q1 backlog amount plus two comparisons; 2025-Q2 Q/sequential/TTM in one block; and complete 2026-Q1/Q2 document bundles before any production absence assertion.

Required negative fixtures include:

- remove YoY wording and retain only 117% sequential: emit no quarterly-YoY observation;
- retain TTM wording/value only: emit no quarterly observation;
- use generic data-center, hyperscale, or colocation wording without explicit AI: emit no `VRT_AI_ATTRIBUTION`;
- provide rounded backlog amount without issuer-reported growth: emit amount only and no growth;
- SEC EX-99.1 and 10-Q/10-K complete with IR HTTP 403: valid production `NOT_DISCLOSED` remains possible and IR failure is a deterministic non-fatal warning;
- required SEC document failure with IR success: ledger is `MISSING` and issuer ingestion fails;
- omit/fail any required document: production `NOT_DISCLOSED` is forbidden and ledger is `MISSING`;
- wrong issuer/period, missing unit/window/basis, conflicting duplicates, PDF token reordering, unsupported AI inference, fixture/live hash confusion, and out-of-range values: fail closed.

### 7.3 Identity, coverage, and regression assertions

- Q and TTM never share metric ID, series ID, period representation, logical key, parser path, or fixture expectation.
- Q YoY, sequential, YTD, and TTM comparison bases cannot collide.
- Backlog amount, YoY growth, and sequential growth have distinct identities and no derived growth.
- Reported/organic and quarterly/full-year actual sales cannot collide with guidance.
- Candidate ordering and retrieval time do not affect semantic IDs.
- Same accession/version and same snapshot are idempotent.
- Same version with different fixture/live snapshots and identical semantics is a provenance reassertion.
- `$15 billion` and `$15.0 billion`, when logical semantics, normalized value/unit, and lexical approximation are equal, have the same observation ID, `newFacts=0`, and `revisions=0`; their representation metadata remains on their respective evidence records.
- Same immutable document identity with changed bytes/hash fails as `VRT_SOURCE_VERSION_CONFLICT` before revision accounting.
- A legal economic revision requires a distinct registered source-document version; shared A→B→A and same-version idempotency regression tests remain unchanged.
- Source-document version, snapshot, locator, and excerpt hash never alter numeric logical/observation identity.
- Period-ledger outcomes cannot hide a required `MISSING`.
- All current production observations and deterministic signal IDs remain byte-for-byte unchanged.

### 7.4 First-run baseline/proposed-state verification

The first Vertiv dry-run follows this order:

1. Baseline verification continues to require only the existing five issuers and reads only production canonical state.
2. The disposable root is seeded with existing production canonical files but does not require or copy a production VRT canonical seed.
3. The VRT runner creates proposed numeric canonical output, qualitative attribution evidence, and the atomic disclosure ledger only in that disposable root.
4. Proposed-state verification reads all three disposable VRT stores plus the disposable copies of existing canonical data.
5. A VRT proposed failure fails proposed-state verification but does not rewrite, weaken, or change the independent baseline verification result.
6. Promotion is prohibited unless issuer ingestion, baseline verification, and proposed-state verification all pass and no required ledger entry is `MISSING`.
7. Promotion remains a separate, explicit operation; a successful dry-run does not promote.

## 8. Proposed implementation/change plan (phase 2, not performed)

Minimum files consistent with the current repository:

| Proposed file | Responsibility |
|---|---|
| `scripts/ingestion/vrt-physical-build-lib.mjs` | Source registry, document eligibility, numeric parsing, normalization, validation, logical keys, and candidates. |
| `scripts/ingestion/vrt-ai-attribution-lib.mjs` | Closed-taxonomy qualitative parsing, synonym normalization, assertion validation, and provenance candidates. |
| `scripts/ingestion/shared/qualitative-evidence-store.mjs` | Independent deterministic qualitative append/idempotency/reassertion/conflict/promotion semantics; never calls numeric canonical promotion. |
| `scripts/ingestion/vrt-period-disclosure-ledger.mjs` | Atomic applicability matrix, ledger validation, and pure family-coverage projection. |
| `scripts/ingestion/ingest-vrt-physical-build.mjs` | CLI using existing SEC client, snapshot store, canonical store, disposable-root, and promotion gates. |
| `tests/fixtures/ingestion/vrt-physical-build/` | Immutable-document manifests and faithful official HTML/PDF text-layout fixtures for all registered periods. |
| `tests/ingestion/vrtPhysicalBuildIngestion.test.mjs` | Numeric contract, IR/SEC source policy, parser, provenance, precision parity, idempotency, and transition tests. |
| `tests/ingestion/vrtAiAttributionIngestion.test.mjs` | Closed-taxonomy, cross-document assertion parity, qualitative promotion, conflict, ordering, fixture/live, and isolation tests. |
| `tests/ingestion/vrtPeriodDisclosureLedger.test.mjs` | Applicability matrix, atomic completeness, projection truth table, mismatch, and latest-period missing tests. |
| `data/ingestion/observations/vrt-physical-build.json` | Future numeric canonical-v2 output only after separately approved promotion. |
| `data/ingestion/evidence/vrt-ai-attribution.json` | Future independent qualitative canonical evidence; never read by the numeric provider. |
| `data/ingestion/coverage/vrt-period-disclosures.json` | Future atomic period disclosure ledger and sole input to VRT family coverage projection. |
| `src/types/vrtPhysicalBuild.ts` | Numeric observation extension and atomic disclosure-ledger types; documents compatibility with existing `MetricObservation`, `MetricName`, and `PeriodType`. |
| `src/types/vrtAttributionEvidence.ts` | Independent qualitative assertion, closed taxonomy, and provenance-record types. |
| `src/data/vrtSources.ts` | Tier-1 source definitions and stable official URLs. |
| `src/data/vrtPhysicalBuildObservationProvider.ts` | Numeric-only validated provider for `vrt-physical-build.json`; it cannot read qualitative records. |
| `src/data/vrtAttributionEvidenceProvider.ts` | Qualitative-only validated provider for `vrt-ai-attribution.json`; it cannot return `MetricObservation`. |
| `src/ingestion/vrtPhysicalBuildIngestionVerification.ts` | Numeric canonical/schema backward compatibility, three-layer identity, period ledger, and deterministic-ID verification. |
| `src/ingestion/vrtAttributionEvidenceVerification.ts` | Qualitative schema, assertion parity, provenance reassertion, deterministic ordering, and numeric-store isolation verification. |
| `scripts/ingestion/verify-vrt-physical-build-downstream.mjs` | Production-vs-disposable verification and proof existing outputs are unchanged. |

Small modifications later required:

- `package.json`: add `ingest:vrt-physical-build` and `verify:ingest:vrt-physical-build`.
- `scripts/ingestion/ingestion-orchestrator.mjs` and `ingest-all.mjs`: register VRT as an independent issuer pipeline only after standalone verification.
- `scripts/ingestion/coverage-contract.mjs`: add six family-level VRT summaries derived from the VRT period ledger; never place `RESEARCH_CANDIDATE_NOT_DISCLOSED` in production coverage and never let historical `PRESENT` hide a required-period `MISSING`.
- `scripts/ingestion/monitoring-summary.mjs`: display VRT ingestion health separately from coverage.
- `src/ingestion/proposedStateIngestionVerification.ts`: proposed mode reads disposable VRT numeric canonical, qualitative evidence, and atomic ledger through canonical-root resolution; any required artifact missing fails proposed verification.
- `scripts/ingestion/verify-production-downstream.mjs`: baseline mode remains five-issuer production verification; proposed mode resolves the disposable root and asserts all existing outputs/IDs are unchanged.

No `src/signals/*`, dashboard, Hyperscaler CapEx, Hyperscaler x TSMC, threshold, or scoring file belongs in phase 2.

Suggested verification commands after implementation:

```text
node --test tests/ingestion/vrtPhysicalBuildIngestion.test.mjs
npm run verify:ingest:vrt-physical-build
npm run verify:ingestion
npm run verify:ingest:orchestration
node scripts/ingestion/verify-production-downstream.mjs
npm run lint
npm run build
git diff --check
```

## 9. Evidence gaps and decisions

### 9.1 Economic-semantic questions requiring human approval before signals

1. **Net-sales basis:** this specification preserves reported and organic growth as separate series. A later signal must choose one or explicitly use both; it must not silently mix them.
2. **Backlog scope:** Vertiv's disclosed backlog is a company-wide balance, not an AI backlog. Whether it can support a physical-build signal alongside separate AI attribution requires an explicit evidence-combination rule and cannot be inferred by the parser.
3. **AI attribution use:** the closed factual scope taxonomy prevents semantic collapse, but a later signal still needs a human-approved rule for whether and how eligible scopes contribute; no threshold or score is proposed here.
4. **Organic-orders definition continuity:** 2024 explicitly says “excluding foreign exchange”; later disclosures use “organic” and acquisitions become relevant. Cross-period comparison requires versioned issuer definition evidence or a reviewed continuity decision.

These questions do not prevent factual ingestion because the facts remain separate and retain wording. They do prevent economic aggregation or signal design without human approval.

### 9.2 Evidence/acquisition gaps

- No stable official text earnings-call transcript was found. Webcast replays are time-limited and should not enter v0.1 canonical ingestion.
- The future implementation must retrieve, identity-validate, inspect, absence-check, and hash every period-specific required document before finalizing `NOT_DISCLOSED`, especially 2024-Q2 through Q4 and 2026-Q1/Q2. Corroborating presentations are not automatically required. This research registry does not treat manual/search absence as canonical proof.
- PDF presentations require an approved deterministic text/layout extraction method and fidelity fixtures; if that cannot be guaranteed, use them only as corroboration and rely on the SEC HTML exhibit for canonical numeric facts.
- The official meaning and calculation methodology of “organic orders” and book-to-bill is not fully defined in every quarterly release. Store the exact available definition/version; never manufacture a denominator or normalize across a definition break.
- Backlog currency is presumed USD only where the official document explicitly supplies `$` and scale. Do not infer currency from issuer domicile.

## 10. Self-review: highest financial-semantic risks

1. **Conflating orders windows or comparison bases.** Quarterly YoY, quarterly sequential, and TTM YoY often occur in the same paragraph. A loose parser would create a convincing but economically false trend.
2. **Turning company-wide demand into AI demand.** Vertiv explicitly discusses AI, but its orders, backlog, and sales also cover general compute, regions, technologies, and customers. Numeric facts must remain company-wide unless Vertiv discloses an AI-specific number.
3. **Treating non-disclosure as deterioration.** 2026 releases omit numeric orders/backlog/book-to-bill while continuing qualitative pipeline discussion. `NOT_DISCLOSED`, `MISSING`, zero, and negative direction are four different states.

## 11. Research conclusion

Official evidence supports a factual physical-build-commitment layer: Vertiv has disclosed quarterly and TTM organic-orders growth, quarterly book-to-bill, backlog, sales growth, and explicit but differently scoped AI-infrastructure attribution. The evidence does **not** support labeling all Vertiv demand as AI, estimating undisclosed quarters, or combining TTM and quarterly orders. The safest next phase is an SEC-exhibit-first, fail-closed issuer pipeline with faithful IR/SEC fixtures and no signal integration until the economic questions above are approved.
