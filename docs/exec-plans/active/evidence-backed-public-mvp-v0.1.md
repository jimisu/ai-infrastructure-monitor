# Evidence-Backed Public MVP v0.1

**Status:** IN_PROGRESS
**Responsible human:** Jimisu
**Created:** 2026-08-25

This plan records an approved Checkpoint 2 scope. It does not authorize commits, pushes,
merges, deployment, live ingestion, canonical promotion, or other production
operations.

## Outcome

A user can open the default dashboard and understand within 60 seconds whether monitored AI
infrastructure demand is accelerating, stable, or weakening, then inspect the supporting TSMC,
META, MSFT, GOOG, and AMZN evidence, periods, official sources, provenance, and freshness.

The MVP presents the existing deterministic Hyperscaler CapEx trend, TSMC supply confirmation, and
cross-company confirmation. It does not reinterpret total issuer CapEx as AI-only spending or make
an investment recommendation.

## Baseline checkpoint

- Repository: `jimisu/ai-infrastructure-monitor`
- Current branch: `main`
- Current HEAD and `origin/main`: `8770e7e2790363fca254b7bf4781ef800ac71cce`
- PR #2: merged into `main` using a normal merge; merge commit
  `8770e7e2790363fca254b7bf4781ef800ac71cce`
- Worktree: only this untracked DRAFT plan. The prior unintended deletion of
  `docs/code-review-and-recommendations.md` was restored and is resolved.
- Baseline verification on the merged `main`: `npm run verify:agent` passed, including lint, build,
  170/170 ingestion tests, and all five downstream verifiers; `git diff --check` passed; and
  `git diff -- data/ingestion` was empty.
- Production canonical data was unchanged by baseline verification.
- Production inputs: ingested canonical observations under `data/ingestion/observations/` plus
  explicitly retained manual observations composed by validated providers under `src/data/`.

Checkpoint 1 is complete. Any later authorized implementation must branch from the verified
`8770e7e2790363fca254b7bf4781ef800ac71cce` main baseline and must not reuse the closed PR #2 branch.

## Scope and likely files

Authorized Checkpoint 2 outcomes; deployment remains subject to later explicit approval:

- Make Real Intelligence the only default dashboard content.
- Keep mock investment/scoring components in the repository but remove their imports, derivations,
  and rendering from the default `App` route.
- Extend the existing presentation/view-model boundary with display-ready evidence metadata; keep
  financial and signal calculations outside React.
- Replace the Vite template README with product purpose, evidence boundaries, local use,
  verification, freshness limitations, and deployment documentation.
- Add only the minimal static-host configuration selected by the responsible human.

Likely changed files:

- `src/App.tsx`
- `src/components/Header.tsx`
- `src/components/RealIntelligence.tsx`
- `src/presentation/realIntelligenceViewModel.ts`
- `src/App.css`
- `README.md`
- one focused presentation verification file if needed to prove unavailable/evidence states
- deployment configuration only after the hosting decision below

Do not delete unrelated demo components or data modules. Do not modify provider, source registry,
canonical, signal, identity, parser, threshold, scoring, or financial-definition files merely to
shape the UI.

## Mock-versus-production display boundary

- The default product renders only `RealIntelligenceViewModel` output created from existing
  production providers and verified signal engines.
- React renders labels and display-ready fields; it does not recalculate financial changes,
  breadth, direction, confidence, or evidence eligibility.
- Remove `MOCK_COMPANIES`, `MOCK_SIGNALS`, `MOCK_IMPACT_EVENTS`, AISS, Opportunity, 10X, Market
  Regime, and investment-model sections from the default `App` composition. Retain their unrelated
  component/data files without presenting them as part of the public MVP.
- Evidence display must map existing observation/signal IDs to period, publication/retrieval time,
  registered source name and URL, and available canonical provenance. If a required mapping is not
  available through a validated boundary, show `UNAVAILABLE` rather than infer it or read raw JSON
  in React.
- Label freshness as the latest evidence publication/retrieval timestamp represented by current
  data, not as live status. Do not imply scheduled updates.

## Work packages and rollback boundaries

### Checkpoint 1 — Close HTTP reliability PR separately (COMPLETED)

1. Restored the unintended documentation deletion without discarding user work.
2. PR #2 was reviewed and merged normally as
   `8770e7e2790363fca254b7bf4781ef800ac71cce`.
3. Synchronized local `main` with `origin/main` and verified ahead/behind `0/0`.
4. Passed `npm run verify:agent` and `git diff --check`; confirmed an empty
   `git diff -- data/ingestion`.

Rollback boundary: no MVP implementation exists; PR #2 remains a separate completed merge.

### Checkpoint 2 — Production-backed dashboard and README (COMPLETED)

1. Make the current Real Intelligence experience the default and remove demo sections from the
   default composition without deleting their modules.
2. Present one prominent overall direction and confidence, four hyperscaler company statuses, TSMC
   supply evidence, and the five-company source/evidence trail already carried by engine
   outputs. Preserve `UNAVAILABLE` and incomplete states.
3. Expose periods, observation/signal identifiers or equivalent audit locators, official source
   links, publication/retrieval timestamps, and a clear “data as of” label through the view model.
4. Update header/footer language so no demo, investment, live-update, or AI-only-CapEx claim remains.
5. Replace `README.md` with product-specific local build, verification, data/provenance boundaries,
   limitations, and static-deployment instructions.
6. Verify desktop and narrow mobile layouts without introducing a new UI framework or dependency.

Rollback boundary: one UI/README checkpoint that can be reverted without touching ingestion,
canonical data, providers, or signals.

### Checkpoint 3 — Static deployment and final verification

1. Apply the minimal configuration for the human-selected static host, using the existing Vite
   build output and no server-side runtime.
2. Verify direct asset loading and the configured base path on the selected host.
3. Run all verification and production-state comparisons, record screenshots or manual viewport
   evidence, and obtain separate authorization before commit, push, PR, merge, or deployment.

Rollback boundary: deployment configuration is isolated from the dashboard checkpoint and can be
removed without changing product semantics.

## Acceptance criteria

- The initial viewport names the overall demand direction and confidence and explains the demand
  plus supply-confirmation relationship without investment language.
- META, MSFT, GOOG, AMZN, and TSMC evidence is inspectable from the default experience; each item
  preserves its issuer-native period, official source, evidence identity/provenance available at
  the provider boundary, and publication/retrieval freshness.
- All displayed conclusions and numbers originate from current providers, signals, trends, and the
  presentation view model; React contains no financial or scoring calculations.
- Missing cross-confirmation or evidence renders an explicit `UNAVAILABLE` / `INCOMPLETE` state.
- Mock/scoring sections are absent from the default dashboard and no mock value is presented as
  production evidence; their unrelated source modules are not deleted.
- README accurately documents that data is static at build time, mixes promoted ingested and
  explicitly retained manual facts, and is not live ingestion or investment advice.
- A clean production build can be served as static files on the chosen host.
- Existing deterministic IDs, values, signals, thresholds, scoring semantics, canonical files, and
  provider parity remain unchanged.

## Negative cases

- Missing aggregate, TSMC trend, outlook, or cross-confirmation must not produce a positive/default
  conclusion or fabricated freshness.
- Missing source/provenance mapping must not be replaced by an unregistered link or raw-JSON access
  from React.
- An `UNAVAILABLE` issuer must not be counted or displayed as neutral.
- Manual facts must not be relabeled ingested; fixture provenance must not be presented as live.
- Total issuer CapEx must not be labeled AI CapEx, and qualitative commentary must not become a
  numeric observation.
- Static-host base-path failure, broken source link rendering, overflow, or unreadable evidence on
  a narrow viewport blocks deployment.
- Any diff under `data/ingestion/`, provider/signal identity changes, or altered downstream outputs
  blocks the MVP checkpoint pending separate authorization.

## Desktop and mobile checks

- Desktop: current Chromium-class browser at 1440×900; overall conclusion visible without scanning
  demo content, evidence/source links keyboard reachable, and no horizontal overflow.
- Mobile: 375×812 and 390×844; cards stack in a meaningful order, company/evidence labels do not
  clip, source links wrap, and conclusion plus freshness remains understandable without hover.
- Both: verify loading, incomplete-data presentation, focus visibility, readable contrast, and
  external-link behavior. Record manual evidence; do not add a browser-test dependency in v0.1.

## Verification

At every implementation checkpoint:

```bash
npm run verify:agent
git diff --check
git diff -- data/ingestion
git status --short
```

For the final static artifact:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

The preview command is local and must not be confused with deployment. Inspect the complete diff
against the recorded post-PR-#2 main baseline and confirm that no live ingestion or promotion ran.

## Forbidden scope

- Vertiv Phase 2, Eaton, or any new issuer.
- New signals, thresholds, rankings, AISS, Opportunity, 10X, confidence, scoring, or economic
  semantics.
- Authentication, database, backend API, scheduled ingestion, alerting, or mobile application.
- Live ingestion, canonical promotion, or changes to canonical data, identity, provenance, parsers,
  providers, financial definitions, or source eligibility.
- Unnecessary component deletion, architecture cleanup, new dependencies, or deployment before the
  hosting decision and explicit authorization.

## Human decisions and approvals

Deployment selection is explicitly deferred to Checkpoint 3. At that checkpoint, choose exactly one
minimal static host and URL/base-path model (GitHub Pages, Cloudflare Pages, or another explicitly
named static host). Do not add configuration until the responsible human selects it and authorizes
any external deployment/account action.

Still required:

1. Approval for each implementation commit/push/PR action.
2. At Checkpoint 3, selection and authorization of the static host and any GitHub/workflow or
   external-account write.
3. Separate approval to merge or deploy the MVP.

Production canonical promotion and live ingestion remain forbidden and are not implied by any plan
status.

## Progress log

- 2026-08-25 — DRAFT created from repository inspection; no MVP implementation started.
- 2026-08-25 — Checkpoint 1 completed: PR #2 merged normally, local `main` synchronized, unintended
  deletion resolved, baseline verification passed, and production canonical diff remained empty.
- 2026-08-25 — Responsible human approved the plan and authorized Checkpoint 2 implementation;
  static-host selection remains deferred to Checkpoint 3.
- 2026-08-25 — Checkpoint 2 implementation completed on `feat/evidence-backed-public-mvp`;
  local view-model and static-preview smoke checks passed, `npm run verify:agent` passed with 170/170
  ingestion tests and all five downstream verifiers, `git diff --check` passed, and canonical hashes
  remained unchanged. Manual desktop/mobile browser inspection remains pending because no browser
  binary is available in this container.
- 2026-08-25 — Approved presentation follow-up replaced primary composite IDs with human-readable
  demand and cross-confirmation cards, five typed company contribution summaries, company-grouped
  factual evidence, and collapsed technical metadata. Focused view-model assertions passed; full
  verification again passed with 170/170 ingestion tests, all five downstream verifiers, an empty
  canonical diff, and unchanged production observation hashes.
- 2026-08-26 — Approved TSMC forward-outlook presentation now distinguishes the `2026-Q2`
  actual baseline from the `2026-Q3` guidance range and midpoint, labels `+12.44%` as implied QoQ
  sequential growth, and marks the card `FORWARD GUIDANCE`. Focused typed-field assertions and full
  verification passed; canonical data and downstream semantics remained unchanged.

- 2026-08-26 — Final presentation readability pass removed observation IDs and exact timestamps from
  primary evidence cards while preserving all immutable IDs and ISO provenance in collapsed technical
  details. Human-readable publication dates, consistent TSMC labels and USD-billion formatting,
  improved secondary contrast, and a non-wrapping TSMC fact count were verified. Focused assertions,
  `npm run verify:agent` (170/170 ingestion tests and all five downstream verifiers), and
  `git diff --check` passed; the canonical diff was empty and production observation hashes were
  unchanged. Desktop/mobile visual acceptance remains pending.

- 2026-08-26 — Responsible human completed manual visual acceptance for Checkpoint 2. Desktop
  full-page review and a 393px-wide Mobile Safari responsive export passed. Primary evidence cards
  showed no observation IDs; technical details were collapsed by default; expanded immutable IDs
  wrapped without horizontal overflow. The demand aggregate, cross signal, company contributions,
  TSMC forward outlook, evidence cards, and official sources all passed visual review. Checkpoint 2
  is `COMPLETED`; the overall plan remains `IN_PROGRESS` pending Checkpoint 3 hosting. Company
  filtering and collapsible evidence groups are optional future improvements, not MVP blockers.

## Decision log

- Use the existing production provider/signal/view-model chain; no financial-semantic changes.
- Keep demo modules in the repository while removing them from the default product composition.
- Defer deployment configuration until the responsible human chooses the static host.
- Treat company filtering and collapsible evidence groups as optional follow-ups, not MVP blockers.

## Closeout result

Not applicable while status is `IN_PROGRESS`.
