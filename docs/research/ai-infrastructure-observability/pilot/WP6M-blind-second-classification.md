# WP6M blind second classification

**Reviewer:** responsible-human-designated Agent B
**Reviewed head:** `e3a2c4604fab8e2d794b290c0b5685dc7061a80a`
**Reviewed:** 2026-08-29
**Mode:** blind review of the two committed WP5M evidence packets; no answer key or uncommitted
classification was consulted
**Gate result:** `STOP_BEFORE_WP7M_PENDING_CLASSIFIER_COMPARISON`

This artifact applies the approved specification to the committed evidence packets only. It does not
add source discovery, normalize approximate language, authorize WP7M, or create production-eligible
facts. Source-level legal and automated-access restrictions remain those recorded in the packets.

## xAI Colossus — Memphis

| Dimension | Blind classification | Evidence boundary |
|---|---|---|
| Physical identity and scope | One physical Colossus compute deployment at the South Memphis facility, with an original 100,000-Hopper configuration and a later expansion whose exact 180,000/200,000 scope is unresolved. `Colossus 1`, broader Memphis facilities and the one-million-GPU roadmap are not separately additive projects on this record. | X2 and X3 describe the same 100,000-GPU deployment. X1's later total is a replacement/expansion claim, not 180,000 or 200,000 accelerators to add to the original 100,000. |
| Source independence | Provisional Level 2 is supportable for the original 100,000 configuration and its operational/training state: X2 is the operator and X3 is a separately published supplier source. X1/X2/X4 share the operator origin and do not manufacture additional independence. | NVIDIA has a commercial supplier relationship, so the independence conclusion is limited to separately originated corroboration of the same hardware deployment, not independent project ownership or a second demand event. |
| Lifecycle / confirmed-build evidence | Original 100,000 configuration: `OPERATIONAL`, and therefore beyond the required confirmed-build entry gate. Later expansion: physical expansion is reported by X1, but its exact completed quantity is conflicted. One-million roadmap: `ANNOUNCED` / reported plan only. | X3 says training began; X2 says fully operational. The one-million statement is expressly a goal and supplies no eligible build state by itself. |
| AI attribution | `AI_EXPLICIT`. | Operator and supplier tie the cluster to Grok/model training. No facility-power or sponsor-name inference is needed. |
| Capacity basis | 100,000 NVIDIA Hopper GPUs for the stable original configuration. Preserve H100/Hopper wording by source; perform no FLOPS or accelerator-equivalent conversion. Later page claims remain `180K_OR_200K_CONFLICT_UNRESOLVED`. | X2/X3 agree on 100,000 Hopper GPUs. X1 simultaneously presents 180K and 200K and cannot be averaged, added or silently resolved. |
| Completion milestone | Original 100,000 configuration: `COMMISSIONED`, supported no later than 2024-10-28 by active training; separately described as fully operational by 2024-12-23. Later expansion: February 2025 month-level `REPORTED_FULL_SCALE`, but capacity-specific commissioning remains unresolved because of the 180K/200K conflict. | Do not invent the first workload date from “19 days after first server delivery.” Do not convert February 2025 to a day or quarter-only exact event. |
| Capacity state | 100,000: quantified commissioned lower-bound configuration. 180K/200K: conflicted reported expanded total, excluded from numeric aggregation pending resolution. One million: non-additive reported planned upper bound only. No evidence-backed `SCHEDULE_AT_RISK` state. | Current and historical totals must not be added together. The plan is neither installed nor commissioned evidence. |
| Large threshold | `QUANTIFIED_LARGE` for the original 100,000 configuration. | Project-specific AI accelerator evidence exceeds the at-least-10,000 threshold. |
| Aggregate eligibility | Eligible only as a 100,000-Hopper commissioned lower-bound record with explicit original-configuration scope and the supported 2024 latest bound. Exclude the 180K/200K expansion and one-million plan from numeric totals. | This is not authority to create a production aggregate; it is the classification input for a separately gated prototype. |

### Material xAI conflicts retained

- X1's simultaneous 180K detailed metric and 200K full-scale claim is material to expanded-capacity
  quantity and cannot be resolved from the packet.
- The exact physical boundary between the original configuration, the expansion, `Colossus 1`, and
  broader Memphis facilities remains unresolved.
- Mutable xAI pages lack a stable source hash. This limits reproducibility of the later expansion
  claim but does not erase the dated X2/X3 corroboration for the original 100,000 configuration.

These conflicts do not invalidate the separately corroborated 100,000 commissioned lower-bound, but
they prohibit using a larger xAI value in WP7M unless later authority supplies a resolved evidence
record.

## Deutsche Telekom Industrial AI Cloud — Munich

| Dimension | Blind classification | Evidence boundary |
|---|---|---|
| Physical identity and scope | One renovated Munich Tucherpark data-center deployment hosting the Industrial AI Cloud / AI factory. The cloud service, AI factory, Deutschland Stack, physical site and customer workloads are related layers, not additive projects or capacities. | D1–D3 are successive operator reports about the same deployment; D4 is the German counterpart of D3. |
| Source independence | Provisional Level 2 is **not established**. All committed factual sources are Deutsche Telekom publications; D4 is a language counterpart, not independent origination. | NVIDIA and Polarise are named participants, but the packet contains no separately reviewed participant source that agrees on scope, capacity basis and period. |
| Lifecycle / confirmed-build evidence | D1: `ANNOUNCED` prospective deployment. D2: installation underway, sufficient to establish an executable confirmed-build state but not commissioning. D3: `OPERATIONAL` on 2026-02-04. | “Will feature,” “up to,” installation, official launch and customer operation are distinct lifecycle evidence and remain separate. |
| AI attribution | `AI_EXPLICIT`. | The operator ties the deployment to AI training, inference, industrial AI and sovereign AI workloads. |
| Capacity basis | Physical NVIDIA Blackwell GPU wording only. D1's 10,000 is prospective; D2 is “up to 10,000”; D3 is “nearly 10,000.” Preserve all three raw bounds and do not normalize any to exactly 10,000. Ignore 0.5 ExaFLOPS for threshold conversion. | “Operating above one third of capacity” is service/utilization wording and does not establish a commissioned GPU fraction. |
| Completion milestone | `COMMISSIONED` on 2026-02-04 at project/service scope because D3 says the cloud officially launched, resources were available for AI applications and existing customers were operating on it. The exact commissioned accelerator count remains unresolved. | “Built over six months” does not support an invented construction-start date. D2's Q1 2026 was a planned window, superseded by the exact launch report. |
| Capacity state | Confirmed executable and later commissioned, but numeric commissioned capacity is `VERIFIED_UNQUANTIFIED_FOR_THRESHOLD`. “Up to 10,000” remains a reported planned/installation upper bound; “nearly 10,000” is an approximate operational description below an exact at-least-10,000 proof. No evidence-backed `SCHEDULE_AT_RISK` state. | The three wordings are lifecycle-sensitive revisions, not values to average or add. |
| Large threshold | `THRESHOLD_NOT_ESTABLISHED`. Do not classify `QUANTIFIED_LARGE`. | Neither “up to 10,000” nor “nearly 10,000” proves at least 10,000 installed or commissioned accelerators. The earlier exact 10,000 statement was prospective. |
| Aggregate eligibility | Excluded from the numeric large-project aggregate. It may appear as an AI-explicit commissioned but threshold-unresolved/unquantified case with its raw wording and coverage limitation. | Lack of provisional Level 2 corroboration independently reinforces the fail-closed result; it must not be repaired by treating D4 as independent. |

### Material Munich conflicts and unknowns retained

- The evidence does not establish at least 10,000 installed or commissioned accelerators; the
  prospective exact, reported upper-bound and later approximate wordings are not equivalent.
- Only one originating publisher is present, so research-only Level 2 corroboration is unmet.
- The exact boundary among the physical facility, factory infrastructure, cloud/platform layers and
  customer workloads is not fully specified, although it is sufficient to prevent additive counting.
- English/German semantic parity and stable page-version hashes remain unverified.

## Cross-case comparison and WP7M gate

| Policy dimension | xAI Colossus | Deutsche Telekom Munich |
|---|---|---|
| Physical unit | One cluster/deployment; later expansion boundary unresolved | One renovated-site deployment; service/platform layers non-additive |
| Independent corroboration | Provisional Level 2 for original 100K configuration only | Not established; one operator origin |
| Lifecycle | 100K operational/commissioned; later expansion quantity conflicted | Announced → installation → operational/commissioned |
| AI attribution | `AI_EXPLICIT` | `AI_EXPLICIT` |
| Stable numeric basis | 100,000 Hopper GPUs | None that proves at least 10,000 at commissioning |
| Threshold | `QUANTIFIED_LARGE` for original 100K | `THRESHOLD_NOT_ESTABLISHED` |
| Prototype numeric eligibility | 100,000 lower-bound record only | Excluded; unquantified/threshold-unresolved count only |

The blind classification itself is complete, but the required comparison with the independently
produced first classification has not been performed in this artifact because no answer key was
consulted. WP7M therefore remains stopped. A later comparison may proceed only by aligning the two
independent outputs, preserving every disagreement, and stopping if any material disagreement remains
about identity, the xAI 100,000 lower-bound, Munich threshold failure, milestones or aggregate
eligibility.
