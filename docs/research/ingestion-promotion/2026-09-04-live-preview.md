# Live ingestion promotion preview — 2026-09-04

## Scope and disposition

- Branch/baseline: `local/live-ingestion-preview` at
  `526d256e2a89428842d5138face420171cb49fdd`, identical to
  `origin/ops/live-ingestion-preview-20260904` before execution.
- Authorized work: WP2 live acquisition into one disposable root and WP3 proposed-state review.
- Production promotion: not performed and not authorized.
- Disposable root: `/tmp/ai-infra-live-preview-state-sl9wD5dy`.
- Run report:
  `runs/ingestion-run-0edb45666f5a9116fe99e655afdacff804ba62fd47258b83d779841af6246469.json`
  under the disposable root.
- `SEC_USER_AGENT` was present for acquisition and its value was not printed or written to this
  report.

## Run result

| Issuer | Status | New facts | Revisions | Provenance reassertions | Unchanged | Warning |
|---|---:|---:|---:|---:|---:|---|
| TSMC | SUCCESS | 70 | 0 | 12 | 0 | — |
| META | SUCCESS | 0 | 0 | 6 | 0 | — |
| MSFT | SUCCESS | 0 | 0 | 7 | 0 | — |
| GOOG | SUCCESS | 0 | 0 | 6 | 0 | `KNOWN_HISTORICAL_SOURCE_UNAVAILABLE` |
| AMZN | SUCCESS | 2 | 0 | 0 | 0 | — |
| **Total** | **HEALTHY** | **72** | **0** | **31** | **0** | **1** |

Coverage remained `COMPLETE_WITH_MANUAL_DEPENDENCIES`: 16 required families, 5 ingested, 1 frozen,
10 manual, 0 not disclosed, and 0 missing. Baseline verification and proposed-state verification
both passed.

The GOOG warning is the existing frozen 2025-Q1 policy: the protected historical transcript was not
reacquired. It is not a failed source and did not replace the pinned frozen evidence.

## Proposed new facts

### TSMC — 70 facts

The 70 facts are two official issuer-filed Form 6-K facts per month: reported monthly revenue in
`NT$ millions` and issuer-reported YoY growth in `percent`. They comprise 68 historical facts absent
from production (34 months from 2023-03 through 2025-12) plus two facts for the newly available
2026-07 period. No YoY value breached the configured sanity range; the observed historical minimum
was -15.4% (2023-03) and maximum was 59.6% (2024-04).

| Period | Monthly revenue (NT$ millions) | Reported YoY (%) |
|---|---:|---:|
| 2023-03 | 145408 | -15.4 |
| 2023-04 | 147900 | -14.3 |
| 2023-05 | 176537 | -4.9 |
| 2023-06 | 156404 | -11.1 |
| 2023-07 | 177616 | -4.9 |
| 2023-08 | 188686 | -13.5 |
| 2023-09 | 180430 | -13.4 |
| 2023-10 | 243203 | 15.7 |
| 2023-11 | 206026 | -7.5 |
| 2023-12 | 176300 | -8.4 |
| 2024-01 | 215785 | 7.9 |
| 2024-02 | 181648 | 11.3 |
| 2024-03 | 195211 | 34.3 |
| 2024-04 | 236021 | 59.6 |
| 2024-05 | 229620 | 30.1 |
| 2024-06 | 207869 | 32.9 |
| 2024-07 | 256953 | 44.7 |
| 2024-08 | 250866 | 33.0 |
| 2024-09 | 251873 | 39.6 |
| 2024-10 | 314240 | 29.2 |
| 2024-11 | 276058 | 34.0 |
| 2024-12 | 278163 | 57.8 |
| 2025-01 | 293288 | 35.9 |
| 2025-02 | 260009 | 43.1 |
| 2025-03 | 285957 | 46.5 |
| 2025-04 | 349567 | 48.1 |
| 2025-05 | 320516 | 39.6 |
| 2025-06 | 263709 | 26.9 |
| 2025-07 | 323166 | 25.8 |
| 2025-08 | 335772 | 33.8 |
| 2025-09 | 330980 | 31.4 |
| 2025-10 | 367473 | 16.9 |
| 2025-11 | 343614 | 24.5 |
| 2025-12 | 335003 | 20.4 |
| 2026-07 | 467580 | 44.7 |

The 2026-07 facts use accession `0001046179-26-000471`, primary document
`tsm-revenue20260810.htm`, and snapshot
`raw-snapshot:live:sha256:a1c0bbe8020f34c113211b7845906c02fc82611c5a75326c3b0080fa45285c6f`.

### AMZN — 2 facts

Both facts use the existing `amzn-purchases-of-property-and-equipment` definition and the exact
`Purchases of property and equipment` row in the Consolidated Statements of Cash Flows.

| Period | Metric | Value | Unit |
|---|---|---:|---|
| TTM-2025-Q2 | `CAPEX_ACTUAL` | 107.656 | USD billions |
| TTM-2026-Q2 | `CAPEX_ACTUAL` | 173.028 | USD billions |

Provenance is accession `0001018724-26-000026`, primary document `amzn-20260630.htm`, snapshot
`raw-snapshot:live:sha256:c5ec80693142176b8c7bc1b8f4e20da0627478f2d9dc2e953cc12a9dcede2206`,
with the two explicit columns `Twelve Months Ended June 2025` and
`Twelve Months Ended June 2026`.

## Revisions

No revision was detected for any issuer. No active logical fact changed economic value or
observation identity.

## Record-level closeout audit

The closeout compared every disposable record absent from production with the active production
record having the same logical fact key. It checked 103 records: 72 new facts and 31 provenance
reassertions. For every record it verified period, metric definition where applicable, unit, logical
fact key, deterministic observation ID, deterministic record ID, official HTTPS evidence URL,
source-document version or accession, LIVE snapshot ID, manifest identity, and raw-content SHA-256.
All checks passed; 56 distinct LIVE manifests supported the 103 records.

The TSMC historical set is an expected backfill rather than accidental expansion:

- Its period set is exactly the 34 consecutive months from 2023-03 through 2025-12.
- Every month has exactly one `MONTHLY_REVENUE` fact in `NT$ millions` and one
  `MONTHLY_REVENUE_YOY_PERCENT` fact in `percent`.
- Every logical fact was absent from the production baseline; none collided with an active fact.
- The 34 historical documents have distinct eligible Form 6-K source versions, official SEC URLs,
  matching LIVE manifests, and validated raw hashes.
- No period outside that closed historical interval entered the backfill; 2026-07 is separately
  classified as the current newly available month.

The two AMZN facts share the validated `amzn-purchases-of-property-and-equipment` definition and
Q2 TTM comparison basis. Their logical and observation identities are distinct by period, while both
retain the same official Q2 2026 Form 10-Q accession and snapshot provenance.

## Provenance reassertions

All 31 reassertions retained the existing economic observation identity and source-document version
while adding a LIVE snapshot record from the current acquisition:

- TSMC: 12 facts for 2026-01 through 2026-06, two facts per monthly Form 6-K.
- META: 6 range-bound facts from accessions `0001628280-26-003942`,
  `0001628280-26-028526`, and `0001628280-26-050705`.
- MSFT: 7 quarterly management-total-CapEx facts from issuer fiscal 2025-Q1 through 2026-Q3.
- GOOG: 6 guidance facts from accessions `0001652044-25-000010`,
  `0001652044-25-000056`, `0001652044-25-000087`, and `0001652044-26-000012`.
- AMZN: 0 reassertions; the acquired Q2 TTM periods are new logical facts.

The disposable state contains 57 raw files and 57 manifests. These are unpromoted diagnostic and
provenance artifacts only. Re-running or promoting them was not performed.

## Downstream verification

- Committed baseline: `PASSED`.
- Disposable proposed state: `PASSED`.
- Proposed TSMC trend direction: `ACCELERATING`.
- Proposed TSMC historical/forward confirmation: `CONFIRMED`.
- Proposed hyperscaler direction/confidence: `POSITIVE` / `HIGH` with 4 eligible and 4 positive.
- Proposed cross-company alignment/confidence: `CONFIRMED` / `HIGH`.

## Production integrity and stop gate

All five production observation hashes remained byte-for-byte identical to the plan baseline, and
`git diff -- data/ingestion/observations` was empty:

- `amzn-ppe-purchases.json`: `8d0a8f40d25957d2db191a0ee47cfa852b98e04f050edd77335d0b7e23ce5e5e`
- `goog-annual-capex-guidance.json`: `72125f9adcc86d34ed54574152be64bb12d4adfde4f5c41c98906119439664ae`
- `meta-annual-capex-guidance.json`: `870b8c3275f94100fa0b831fad2b8c5b36961559bb822a46fcd0a0c010ff63dc`
- `msft-management-total-capex.json`: `3e356ae3ca2d86781212f503af132cda698520297527d202e22e21d2d914c564`
- `tsm-monthly.json`: `6d255d2ce7f3d0a944ee2b9e793d907e295b8a2c06270cbda500979c8fb3e898`

WP3 ends at `READY_FOR_CHECKPOINT_REVIEW`. This report does not recommend or authorize promotion.
WP4-WP5, production promotion, commit, push, PR, merge, and deployment were not started. The
disposable evidence root remains retained for human review.
