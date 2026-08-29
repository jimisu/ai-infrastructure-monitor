# R1 external open-source compatibility

**Status:** R1 read-only compatibility research
**Checked:** 2026-08-29
**Data handling:** Metadata, repository documentation and schemas were inspected read-only. No
external rows, snapshots or translations were committed or placed in canonical/proposed state.

License findings below are repository-level observations, not legal advice. Software and data
licenses are treated separately. Every future factual use still requires original-source
verification and a permitted access method.

| Candidate and inspected version | License / activity / origin | Useful capability | Compatibility verdict |
|---|---|---|---|
| [India Datacenter Watch](https://github.com/Ashwask/india-datacenter-watch) `26e216c32ffa0523799ee9874a7745210b9ea012` | Code MIT; README states data CC BY 4.0. Pushed 2026-07-21. Community CSV with per-row source URL and JSON Schema validation. | Facility schema, source-link validation, status vocabulary and community review are useful. | **DISCOVERY_ONLY_DATA; REFERENCE_PATTERN_ONLY software.** One row per facility/campus, one mutable URL, coarse status/year and optional IT load do not preserve source version, exact locator, phase/tranche, evidence hierarchy, corrections or AI attribution. Attribution and original-source checks remain mandatory. |
| [US Data Center Atlas](https://github.com/ballacw1742/us-data-center-atlas) `12d18d5d858685ccb11824a136fd8c48abef5410` | GitHub metadata has no detected repository license; README says site code MIT and source data ODbL. Pushed 2026-05-24. Derived from PNNL/IM3 and OpenStreetMap. | Search/map UI and a typed facility inventory. | **DISCOVERY_ONLY; LICENSE_REVIEW_REQUIRED.** Inventory fields (`id`, operator, location, sqft, layer) lack project commitment, AI attribution, capacity basis and source-version lineage. ODbL attribution/share-alike implications must be reviewed before data reuse. |
| [The Sovereign AI Tracker](https://github.com/machinelearnear/the-sovereign-ai-tracker) `31374889da6c4b4e7b78757c2d7489aa0fc12c8a` | MIT; last push 2025-08-02. Manually curated TypeScript initiative records with links, dates, status, funding and tags. | Sovereign-AI discovery vocabulary and country/initiative leads. | **DISCOVERY_ONLY.** Initiative status and funding do not prove a physical executable phase; fields do not retain exact source version/locator, project identity, capacity basis or correction history. Freshness is weaker than the actively maintained candidates. |
| [Open Infrastructure Map](https://github.com/openinframap/openinframap) `f33c6dfca1de25d9a16f1a820cc5d9227b6bda9b` | Code BSD-3-Clause; OSM-derived data has separate ODbL obligations. Pushed 2026-08-25. OSM replication into PostGIS/PostGIS with map tiles. | Mature global geospatial infrastructure rendering and OSM replication architecture. | **REFERENCE_PATTERN_ONLY; DISCOVERY_ONLY_DATA.** Location/topology is not AI attribution or build lifecycle. Mapping stack is disproportionate to R1M and OSM identity/history cannot substitute for project-specific primary evidence. |
| [Open Supply Hub](https://github.com/opensupplyhub/open-supply-hub) `0f552861de28421c0330e95488871596d484ae74` | Repository code MIT; pushed 2026-08-28. Contributor-list ingestion, geocoding, matching/conflation, review and facility search; some operation depends on Google/AWS services and credentials. | Strong reference for facility matching, alias/contributor claims, moderation and conflation. | **REFERENCE_PATTERN_ONLY.** Domain is goods-production facilities, not data-center phases. Reuse would bring a large Python/Django/PostGIS/OpenSearch service boundary and external-service requirements; its identity approach should inform later design, not be imported in R1. Data/API terms require separate review. |
| [GridStatus](https://github.com/gridstatus/gridstatus) `1cd72eb2e2dd4c23b3cc4f3f460bd4e2a4f57398` / release `v0.36.0` | BSD-3-Clause; pushed 2026-08-28. Python connectors fetch ISO/RTO/EIA data; coverage and historical retention vary; some sources need EIA/ERCOT credentials and the hosted API has separate free/paid access. | Source-specific connector, timezone, retry/testing and interconnection-queue patterns. | **REFERENCE_PATTERN_ONLY.** Useful for grid evidence acquisition, not project identity or AI attribution. Any future connector must record source terms, credentials/payment boundary and original fields; hosted API is not assumed available or licensed. |
| [PUDL](https://github.com/catalyst-cooperative/pudl) `30b2e6749c507b1173b828f6f243e1a78d959af3` / release `v2026.8.0` | Code MIT; pushed 2026-08-29. Government-source ETL, versioned raw archives/DOIs, schema/metadata and nightly outputs. Individual source/data terms still apply. | Best reference for immutable raw archives, version pinning, metadata, normalized energy schemas and reproducibility. | **REFERENCE_PATTERN_ONLY; POSSIBLE DISCOVERY/CORROBORATION DATA.** Excellent provenance architecture but no AI-project/phase lifecycle. Hundreds of tables and Python warehouse stack are not a direct TypeScript component fit; data use requires per-source semantic and license review. |
| [IM3 Open Source Data Center Atlas](https://github.com/IMMM-SFA/datacenter-atlas) `f65cf032ebb66f17b2d8aebfc453cbf82c0d3f12` | Repository metadata reports `NOASSERTION`; data release is cited by US Data Center Atlas as ODbL. Pushed 2026-03-31. Inputs include MSD-LIVE/OSM facility data and public infrastructure layers; README still marks projected data as “tbd”. | Direct underlying U.S. facility-atlas source and infrastructure-layer preparation. | **DISCOVERY_ONLY; LICENSE_AND_PROVENANCE_REVIEW_REQUIRED.** Useful to discover physical locations, but repository/license boundary and projected-data provenance are insufficient for Track B evidence. No project-specific source-version/lifecycle/AI attribution contract. |

## Cross-candidate conclusion

No inspected project combines exact source-document version and locator, deterministic
cross-announcement project/phase/tranche identity, confirmed-build evidence hierarchy, AI-specific
capacity basis, lifecycle/revision/conflict history, coverage age and decision-value verification.
Accordingly:

- external data remains discovery or corroboration input only;
- no external row can become Track B factual evidence without the original source and policy checks;
- PUDL is the strongest provenance/versioning reference;
- Open Supply Hub is the strongest identity/conflation reference;
- GridStatus is the strongest source-connector reference; and
- the three data-center/sovereign trackers and IM3 are useful competitive/discovery baselines, not
  canonical substitutes.

No private/authenticated source is required to complete R1. Future R1M source access must still check
terms, `robots.txt`, authentication/payment and automated-access restrictions before acquisition.
