# Full R2 portfolio consolidation v0.3 — independent-review correction

**Status:** `RESEARCH_ONLY_QUALIFYING_SEED_SHORTFALL_12_OF_15_AFTER_REVIEW`

**Date:** 2026-08-30

This correction supersedes only the qualifying-population gate in consolidation v0.2. All source,
quantity, non-aggregation, and historical classification records remain preserved.

## Accepted review correction

Independent reviewer B2 found that cases 9 Hyperion, 17 Jamnagar, and 22 Michigan use campus-level
minimum identities while executable phases/tranches remain unresolved. Confirmed campus activity is
not sufficient for the phase-based timeline required by `DR-001`, `DR-010`, and `DR-013`.

| Case | Prior treatment | Corrected treatment |
|---:|---|---|
| 9 Hyperion | Retained `VERIFIED_UNQUANTIFIED` campus under construction | Exclude from qualifying count until one executable confirmed phase/tranche has stable identity |
| 17 Jamnagar | Retained campus construction plus linked Meta contract | Exclude; split and resolve the campus and separate Meta built-to-suit project before either can qualify |
| 22 Michigan | Retained campus groundbreaking | Exclude from qualifying count until one executable confirmed phase/tranche has stable identity |

Case 21 Rainier remains provisionally retained at system/project level because project-specific
operational evidence and a Trainium2 quantity exist. Its distributed physical topology remains
explicitly unresolved and no phase-complete claim is made.

## Corrected population

| Population | Cases | Count |
|---|---|---:|
| Accepted qualifying rows | 1, 2, 3, 5, 6, 7, 10, 11, 13, 15, 16, 21 | 12 |
| Numeric model-specific rows | 2, 5, 13, 21 | 4 |
| Accepted `VERIFIED_UNQUANTIFIED` rows | 1, 3, 6, 7, 10, 11, 15, 16 | 8 |
| Review-disputed campus rows | 9, 17, 22 | 3 |
| Other excluded or held cases | 4, 8, 12, 14, 18, 19, 20 | 7 |

`QUALIFYING_SEED_SHORTFALL_12_OF_15_AFTER_INDEPENDENT_REVIEW`

## Authorization consequence

The replacement authorization allowed at most four screens. Two were screened; after correction,
only Rainier qualifies. At most two screening slots remain, while the corrected portfolio needs
three additional qualifying rows. The existing authorization therefore cannot mathematically close
the gap. No additional candidate is screened and no aggregate is started.

A responsible-human decision is required to choose one of the following without weakening policy:

1. authorize a new bounded replacement screen large enough to find at least three qualifying rows;
2. authorize phase-resolution research for cases 9, 17, and/or 22 with exact minimum identities; or
3. stop Full R2 with a scope-failure result.

This correction creates no implementation, production data, signal, scoring, threshold, UI,
PR-readiness, merge, or deployment authority.
