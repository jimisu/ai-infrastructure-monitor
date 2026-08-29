# R1 compatibility verdict

## Verdict

`R1_COMPATIBLE_WITH_REVIEWED_CONSTRAINTS`

The repository and inspected open-source landscape support a separately authorized, disposable
research pilot **without implementation**, provided every constraint below is preserved. This
verdict does not authorize WP4M, case selection, source-dossier research, R1M, R2, implementation,
production writes, PR readiness, merge or deployment.

## Basis

1. Existing repository contracts demonstrate useful patterns for immutable snapshots, source
   versions, revisions, bounded HTTP acquisition, fail-closed coverage, disposable proposed-state
   verification and deterministic completion checks.
2. Existing `MetricObservation`, canonical providers and issuer orchestration cannot safely store or
   serve Track B facts. A direct reuse would substitute semantics and breach the protected Demand
   Layer v1 boundary.
3. A research-only pilot can instead use removable structured documents in an approved disposable
   workspace, independently verify original sources, and leave all production paths unchanged.
4. External candidates provide complementary patterns and discovery aids, but none satisfies the
   complete Track B evidence/identity/lifecycle contract. No external row is canonical by default.

## Reviewed constraints

- Keep Demand Layer v1, canonical observations, identities, providers, signals, scoring, thresholds
  and UI byte-for-byte outside the research change.
- Do not extend or encode Track B into `MetricObservation` or the current canonical store.
- Treat India Datacenter Watch, US Data Center Atlas/IM3, Sovereign AI Tracker and OpenInfraMap data
  as discovery aids only until original-source verification and license/provenance review pass.
- Use PUDL, Open Supply Hub and GridStatus as architecture/reference patterns only unless a later
  plan explicitly approves a bounded component and its dependencies.
- Before any future source acquisition, record terms, `robots.txt` where relevant,
  authentication/payment restrictions, automation restrictions and permitted method.
- Keep temporary source files/translations in OS disposable storage; commit none without a separate
  legal/license/size/provenance decision.
- Preserve original capacity/date units and precision, non-additive states, unknowns and conflicts;
  fail closed rather than infer AI share, phase allocation or CapEx-to-MW.
- Obtain independent review of this R1 evidence and protected-state comparison. Unresolved material
  disagreement stops. Even a positive review authorizes nothing automatically.

## Unresolved items that do not block R1 closeout

- The exact future Track B schema, identity algorithm, store, adapters and provider are R3 design
  decisions and remain unauthorized.
- External dataset terms and API/access constraints must be evaluated per selected source; repository
  software licenses alone are insufficient.
- The mature maintenance budget and mandatory later-stage second reviewer remain deferred gates.
- The ten-day plan's authorization text says WP5M–WP8M while its budget and Issue #5 include WP9M;
  this must be clarified before any micro-pilot research authorization, not during R1.

## Required next gate

An independent reviewer who did not produce this verdict must inspect the repository references,
external compatibility evidence, protected-state comparison and unresolved risks. The responsible
human may consider WP4M selection only after that review and a separate explicit authorization.

## Independent review result

The mandatory independent review returned `CONDITIONAL` with no BLOCKER or HIGH findings. It independently reproduced the repository verification, protected-tree comparison, and external pinned-ref checks. The review identified two retained MEDIUM closeout limitations: the full PR has pre-existing trailing whitespace outside the R1 delta, and exact human effort was not instrumented. These limitations do not change the R1 compatibility verdict, but they are preserved rather than silently converted into passing evidence. WP4M remains unauthorized pending a separate responsible-human decision.
