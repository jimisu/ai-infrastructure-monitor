# AI Infrastructure Observability Ten-Working-Day R1 + Micro-Pilot Plan v0.1

**Status:** `R1_REVIEWED_CONDITIONAL_PENDING_WP4M_DECISION`
**Responsible human:** Jimmy W. Su
**Created:** 2026-08-29
**Plan scope:** two-day R1 compatibility research plus a separately gated eight-day micro-pilot
**Plan-drafting authorization:** `GRANTED_2026-08-29`
**R1 execution authorization:** `GRANTED_WP0_WP3_ONLY_2026-08-29`
**Micro-pilot selection authorization:** `NOT_GRANTED`
**Micro-pilot research authorization:** `NOT_GRANTED`
**Full R2 authorization:** `NOT_GRANTED`
**Implementation / production / merge / deployment:** `NOT_GRANTED`

## 1. Purpose

Use at most ten working days to decide whether two real large-AI-data-center cases demonstrate enough
incremental, auditable value to justify the full R2 pilot. The program preserves the approved Track B
semantics and evidence rules while reducing breadth. It must not represent its output as a completed
R2, global capacity estimate, production proposal, or implemented product.

This plan supersedes the execution proposal in
[R1–R2 plan v0.3](./ai-infrastructure-observability-r1-r2-v0.3.md). The full R2 product target in the
specification remains deferred rather than weakened.

## 2. Authorization contract

Authorization remains staged:

1. **R1 authorization** permits WP0–WP3 only: repository characterization, external reuse review,
   documentation artifacts, verification and an R1 verdict.
2. **Micro-pilot selection authorization** permits WP4M only after R1 verdict and independent review.
3. **Micro-pilot research authorization** permits WP5M–WP8M only after Jimmy W. Su approves the two
   cases, discovery pool, remaining time budget, artifact boundary and second reviewer.

A general approval of this document authorizes R1 only. No stage authorizes the next stage by
implication. Commit and normal push authority, if granted, is limited to documentation/research
artifacts on the existing Draft PR #6 branch. PR readiness and merge remain separate.

## 3. Source specifications

- [Product and evidence specification](../../research/ai-infrastructure-observability/spec.md)
- [C4 architecture roadmap](../../research/ai-infrastructure-observability/plan.md)
- [Task map](../../research/ai-infrastructure-observability/tasks.md)
- [Architecture map](../../architecture/README.md)
- [Issue #5](https://github.com/jimisu/ai-infrastructure-monitor/issues/5)
- [Draft PR #6](https://github.com/jimisu/ai-infrastructure-monitor/pull/6)

The source documents govern semantics. Any need to change confirmed-build eligibility, AI
attribution, capacity basis, date precision, identity, aggregation or evidence policy is a stop
condition and requires a new human decision.

## 4. Baseline and rollback boundary

Documentation baseline before this revision:

- PR #6 head: `197cfa0534495ee5f2ff5a9e421b191e5c84b458`;
- `main`: `a0732dc8356ac1330b51c2b29c9c37a1e80dd419`;
- PR #6: open, Draft and mergeable;
- production/code paths changed: none.

The executor must re-fetch and record the actual baseline before WP0. Demand Layer v1, canonical
observations, signal semantics, scoring, thresholds, UI and deployment are protected rollback
boundaries. Micro-pilot artifacts must remain disposable and removable without migration or history
rewrite.

## 5. Scope

The ten-day program may produce:

- the five R1 deliverables defined in the superseded v0.3 plan;
- an independent R1 review;
- two depth-case dossiers;
- a 5–8-project discovery-only pool;
- disposable structured research records and a non-production timeline prototype;
- a second-review classification comparison;
- results for eight priority negative cases;
- a closest-tracker comparison, one potential decision improvement and two timeline capabilities;
- measured research effort and a micro-pilot verdict.

The two cases should include one evidence-rich neocloud or large AI-campus case and one sovereign-AI
or low-English-accessibility case where feasibility screening supports it. Failure to find the second
type is recorded as a coverage/access result; it must not be replaced by invented evidence.

## 6. Forbidden scope

- no claim that 5–8 discovery candidates form a verified or globally representative timeline;
- no claim that two cases satisfy the five-case/15–25-project R2 acceptance criteria;
- no production code, schema, canonical data, signal, scoring, threshold or UI changes;
- no live ingestion or copied external dataset in repository production paths;
- no CapEx-to-MW, investment-to-capacity, unsupported AI-share or accelerator-equivalent inference;
- no outreach, publication, community recruitment or social-channel work;
- no automatic R2, R3, implementation, PR-readiness, merge or deployment authorization.

## 7. Work packages and budget

| Day | Work package | Maximum | Deliverable / gate |
|---:|---|---:|---|
| 1 | WP0–WP1 | 1 day | authority/baseline plus repository reuse matrix |
| 2 | WP2–WP3 | 1 day | external compatibility, gap analysis and R1 verdict |
| 3 | Independent R1 review + WP4M | 1 day | reviewed verdict and proposed two cases/pool; return for authorization |
| 4–6 | WP5M — Evidence and identity | 3 days | two source/version and identity dossiers |
| 7 | WP6M — Classification review | 1 day | second-review comparison and conflict log |
| 8 | WP7M — Timeline prototype | 1 day | coverage-bound, non-production output |
| 9 | WP8M — Value/cost evaluation | 1 day | competitor, decision-value and actual-effort record |
| 10 | WP9M — Closeout | 1 day | verdict and next-step recommendation |

Ten working days is a hard ceiling. Waiting or blocked access does not extend it. Reduce the discovery
pool within 5–8 or stop; never weaken evidence rules, reduce the two depth cases after research
authorization, or claim skipped work passed.

### WP0–WP3 — R1

Follow the R1 actions and deliverables in v0.3: re-establish authority and protected baseline;
characterize repository contracts; evaluate all named external candidates with an honest depth
classification; and issue exactly one R1 compatibility verdict. Low-direct-relevance candidates may
be `REFERENCE_PATTERN_ONLY`, but none may be silently omitted.

Before WP4M, a human or model instance that did not produce the R1 verdict must inspect its evidence,
repository references and protected-state comparison. Unresolved material disagreement stops.

### WP4M — Feasibility screen and selection

Screen candidates for two hours maximum before selection. Record official-source availability,
access restrictions, expected project/phase identity challenge, AI attribution and capacity basis.
Propose two depth cases and a 5–8-project discovery pool. Selection itself does not authorize dossier
research. Jimmy W. Su must approve both cases and name the second classifier before WP5M.

### WP5M — Evidence and identity dossiers

For both cases, preserve source origin and lineage, version/hash when available, locator, exact claim,
project/campus/phase/tranche relationship, lifecycle, completion milestones, original date precision,
AI attribution, capacity basis, schedule/revision events, conflicts and coverage gaps. Record source
terms, robots/auth/payment boundaries and the permitted access method before acquisition. Temporary
downloads/translations remain outside the repository unless separately approved.

### WP6M — Independent classification comparison

The second reviewer applies the same policy without seeing an answer key. Compare project identity,
source independence, lifecycle, AI attribution, capacity state, completion milestone, time precision
and aggregation eligibility. Retain disagreements; material unresolved disagreement stops the
timeline prototype.

### WP7M — Timeline and negative cases

Produce only a coverage-bound prototype for the two verified cases. The discovery pool is not an
aggregate. Test at least these eight cases:

1. MOU/political announcement without executable evidence;
2. repeated government/operator/customer/vendor announcement;
3. campus total added again through phase/tranche;
4. facility or utility power substituted for AI IT load;
5. unsupported AI share assigned to mixed use;
6. year/half-year narrowed to an invented quarter/date;
7. planned, installed, commissioned or at-risk capacity added together; and
8. discovery-tracker row accepted without original-source verification.

Negative cases may use real exclusions or clearly labeled disposable mutations. They need not occur
naturally, but skipped cases cannot pass.

### WP8M–WP9M — Value, cost and closeout

Compare each case with the closest tracker and ordinary headline research. Record at most directional
evidence for one material decision improvement and two of the five timeline capabilities in the full
specification. Log actual discovery, acquisition, translation, extraction, identity, review,
correction and output effort. Do not extrapolate a mature quarterly cost from two cases as fact.

Assign exactly one verdict:

- `MICRO_PILOT_VALUE_DEMONSTRATED`;
- `MICRO_PILOT_VALUE_PLAUSIBLE`;
- `MICRO_PILOT_BLOCKED_BY_PUBLIC_EVIDENCE`; or
- `MICRO_PILOT_NOT_INCREMENTALLY_USEFUL`.

Only the first verdict supports returning to Jimmy W. Su to consider full R2 portfolio-selection.
It authorizes nothing automatically.

## 8. Acceptance criteria

R1 acceptance remains as defined by v0.3. The micro-pilot completes only when:

- both approved cases have exact source/version/locator and source-lineage records;
- project/phase/tranche identity and duplicate handling are explicit;
- AI attribution, capacity basis, completion and date precision fail closed;
- a second reviewer completed the classification comparison;
- all eight priority negative cases have recorded results;
- the prototype carries scope, data-as-of, coverage and non-global disclaimers;
- closest-tracker comparison and actual human effort are recorded;
- protected production/code paths match the baseline; and
- the closeout explicitly states that R2 was not completed.

Failure of a criterion produces a blocked or incomplete closeout, not a pass.

## 9. Verification

Minimum repository evidence:

```bash
git status --short --branch
git log -5 --oneline --decorate
git diff --check
git diff --name-only <baseline>...HEAD
git diff -- data/ingestion src scripts tests
npm run verify:agent
```

Research verification includes structured-record validation, deterministic rerun of both cases,
duplicate/aggregation checks, source-access audit, source-version/locator audit, independent review,
eight negative-case results and protected-state comparison. A skipped, blocked or manually substituted
test cannot be reported as passing.

## 10. Stop conditions

Stop for unclear authorization/baseline/artifact ownership; production-path change; inaccessible or
prohibited core evidence; unstable identity; unsupported AI attribution/capacity conversion; invented
precision; material reviewer disagreement; new schema or policy decision; time ceiling; generic map
or news-feed output; no incremental value; or any request to cross a forbidden boundary.

## 11. Human decisions still required

Before R1:

1. Explicitly authorize WP0–WP3 only, the two-day ceiling, artifact path and documentation
   commit/push boundary.

Before WP4M:

2. Review the R1 verdict and independent review; authorize selection only.

Before WP5M:

3. Approve the two cases, discovery pool, remaining seven-day budget, temporary-data boundary and
   second reviewer.

Full R2, implementation, production, PR readiness, merge and deployment remain deferred.

## 12. Progress and decision log

| Date | Event | Status / rationale |
|---|---|---|
| 2026-08-29 | Ten-day plan drafting authorized | Replace the infeasible 23-day execution proposal without weakening evidence semantics |
| 2026-08-29 | Documentation checkpoint | Pending verification and delivery to Draft PR #6; execution remains unauthorized |
| 2026-08-29 | WP0 | Completed | Issue #5 records all R0 and R1-only approvals; baseline `c630a966b5f17ccf538771ad9e402d611ff57e88`, clean worktree, protected path trees recorded |
| 2026-08-29 | WP1 | Completed | Repository reuse matrix and domain gap analysis characterize acquisition, provenance, identity, coverage, proposed-state and verification contracts against code/tests |
| 2026-08-29 | WP2 | Completed | Seven named candidates plus the directly underlying IM3 atlas have pinned legal, provenance, semantic and freshness findings; no external data was ingested |
| 2026-08-29 | WP3 | Completed | Verdict `R1_COMPATIBLE_WITH_REVIEWED_CONSTRAINTS`; protected paths unchanged; separate WP4M authorization remains required |
| 2026-08-29 | Independent R1 review | Conditional | No BLOCKER/HIGH; R1-only diff check passes; full-PR pre-existing whitespace and unavailable exact human-time instrumentation retained as accepted limitations |

## 13. Closeout result

`R1_COMPATIBLE_WITH_REVIEWED_CONSTRAINTS`

R1 began from PR head `c630a966b5f17ccf538771ad9e402d611ff57e88` and `main`
`a0732dc8356ac1330b51c2b29c9c37a1e80dd419`. Its five deliverables are under
`docs/research/ai-infrastructure-observability/pilot/`. No source dossier, case selection, timeline
aggregation, production/code change or external-data commit was performed. The independent R1 review returned `CONDITIONAL` with no BLOCKER/HIGH findings. Its two MEDIUM closeout limitations are preserved in the verification report and independent-review artifact. Exact human effort was not instrumented and cannot be reconstructed without invention; this limitation is explicitly accepted. WP4M remains unauthorized.

Closeout must record exact baseline/head, artifacts, sources, verification results, protected-state
comparison, reviewer disagreements, time spent, failed/deferred work and responsible-human next-step
decision.
