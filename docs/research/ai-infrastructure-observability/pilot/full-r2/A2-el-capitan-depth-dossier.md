# Full R2 depth dossier A2 — El Capitan, LLNL

**Status:** `RESEARCH_ONLY_DEPTH_CLASSIFICATION_COMPLETE`

**As of / reviewed:** 2026-08-29

**Baseline:** Draft PR #6 head `f6c1bd7daf85ea827be7ce95ecf3571b3223ead0`
**Boundary:** public evidence only; no classified-workload inference; no production, canonical,
signal, scoring, UI, aggregate or final-R2 effect

## 1. Result

El Capitan is one physical HPE Cray EX supercomputer in LLNL's primary machine room, distinct from
the Exascale Computing Facility Modernization (ECFM) infrastructure that supports it and from the
smaller Tuolumne and RZAdams systems. LLNL evidence supports installed hardware, completed supporting
infrastructure, live scientific use and explicit AI/ML capability. It therefore supports
`COMMISSIONED / OPERATIONAL` and `AI_EXPLICIT` for the named system.

It is **not an ordinary quantified-large AI-capacity record**. The disclosed 35 MW is system power,
not project-specific AI IT load. The disclosed architecture has four AMD MI300A APUs per node, but
the reviewed primary sources do not disclose a complete node/APU count in a claim that can be
audited here. Even if another source supplied such a count, an APU is an integrated CPU/GPU package;
this dossier will not manufacture a discrete-GPU equivalent. Classification is
`VERIFIED_UNQUANTIFIED_FOR_APPROVED_AI_CAPACITY_BASIS`. A `STRATEGIC_EXCEPTION` is plausible because
this is NNSA's first exascale system, but only Jimmy W. Su may approve it; this dossier does not.

## 2. Source and document-version registry

Hashes are SHA-256 of disposable response bytes retrieved on 2026-08-29; no response body is
committed. Dynamic presentation bytes can change without a factual revision, so the hash identifies
the inspected response, not an issuer-declared edition.

| ID | Class / role | Document and version | Exact locator | Exact supported wording / claim | Eligibility |
|---|---|---|---|---|---|
| EC1 | Tier-1 operator/government laboratory | LLNL, “El Capitan — High Performance Computing”; mutable highlight page; retrieved 2026-08-29; response hash `7fdfe20dd3ad779f4152dfd988a37cb590a7d6eb683dffada33846c41a700460` | Opening paragraphs beginning “As the National Nuclear Security Administration's first…” and “Along with stockpile stewardship…” | “NNSA's first exascale supercomputer”; benchmarked at 1.809 exaFLOPs; supports “artificial intelligence and machine learning codes” for named scientific/national-security domains. | Eligible for system identity, current use and AI attribution; FLOPS is not capacity input. |
| EC2 | Tier-1 operator/government laboratory | LLNL *Science & Technology Review*, December 2024, “Introducing El Capitan”; retrieved 2026-08-29; response hash `a3b6650f54158cbc1bbe26dd669437397a5f04d9ffe12386d1d0362b4cc6e9b1` | “Exascale Excellence”; “Accelerated Architecture”; “Custom Upgrades”; final-blade caption | Deployment spans procurement, design, installation and testing; AMD and HPE were vendor partners; MI300A APUs integrate CPU and GPU, four per compute node, and are “primed for AI-assisted data analysis”; final blade was installed. | Eligible for physical identity, installed milestone, architecture and AI capability. |
| EC3 | Same document/version as EC2 | “Custom Upgrades,” paragraphs beginning “In preparation for El Capitan…” and “The ECFM project…” | ECFM completed in 2022; it is 85 MW infrastructure capable of supporting a second exascale machine; El Capitan “requires about 35” MW and occupies over 550 m². | Eligible for infrastructure-ready and unit-bound facts; **not** AI IT load or additive project capacity. |
| EC4 | Same publisher; separate current operator page | LLNL, “Meet the machines that matter: How El Capitan keeps its cool”; retrieved 2026-08-29 | Paragraphs beginning “At Lawrence Livermore…” and “We typically stop…” | El Capitan is operating at densities of 400 kW per rack and relies on its cooling system. | Corroborates operational infrastructure; rack density is not total or AI IT load. |
| EC5 | Discovery/closest-tracker comparator | TOP500 El Capitan system listing and list methodology, current public site | System entry, benchmark/rank fields | A competent user can learn benchmark performance, rank, site, vendor and architecture. | Discovery/comparison only in this dossier; it does not establish the project's evidence chain or AI-capacity eligibility. |

### Access and legal record

- EC1–EC4 were readable without sign-in, payment or bypass through ordinary HTTPS GET. LLNL's
  `robots.txt` allows ordinary content paths and disallows administrative/search paths; none was
  used for evidence acquisition.
- LLNL pages expose “Copyright and Reuse,” “Disclaimer” and DOE vulnerability-disclosure links, but
  public availability and U.S.-government sponsorship do not prove that every page element is public
  domain or redistributable. Text quotation, images, contractor-owned material and automated bulk
  reuse remain legal unknowns. This pilot retains URLs, concise quotations and response hashes only.
- No procurement attachment, classified source, authenticated system, access control or security
  detail was requested. Classified workloads and inferred military capabilities are excluded.
- EC5 may be inspected publicly, but its dataset license, redistribution terms and field semantics
  would require a separate reuse review before import. No row was copied into repository state.

## 3. Identity graph and duplicate resolution

| Entity | Parent / relation | Resolution |
|---|---|---|
| LLNL Livermore site | physical site | Location only; not capacity. |
| Primary machine room | facility space | Hosts El Capitan; not a second project. |
| ECFM | infrastructure project supporting machine room | Separate physical infrastructure; its 85 MW is a non-additive facility envelope. |
| El Capitan | named physical compute system | Dossier's single project/system identity. |
| El Capitan compute nodes / blades / cabinets | components of El Capitan | Components, never additive projects or phases. |
| Tuolumne | smaller unclassified sibling system | Separate system, expressly not included in El Capitan capacity. |
| RZAdams | additional unclassified system/test bed | Separate system, not included. |
| LLNL / NNSA / DOE | operator/sponsor/government chain | Institutional roles describing the same system, not independent capacity. |
| HPE / AMD | integrated-system / processor vendors | Supplier evidence can corroborate components; it does not create additional demand records. |

Stable identity is reached for the named system. Building modernization, system installation and
component procurement are linked lifecycle evidence, not three commissioned AI projects.

## 4. Lifecycle, milestones and dates

| Evidence state | Original time text and precision | Normalized conclusion | Additive? |
|---|---|---|---|
| `INFRASTRUCTURE_READY` | “Completed in 2022” (year precision) | ECFM supporting infrastructure complete sometime in 2022; no quarter/day invented. | No; enables system. |
| `EQUIPMENT_INSTALLED` | December 2024 issue; final-blade caption has no installation day | El Capitan hardware installation complete no later than publication of the December 2024 issue. | No; same system. |
| `COMMISSIONED / OPERATIONAL` | EC1 current page retrieved 2026-08-29; it describes ongoing supported work; no first-service day in reviewed text | Operational no later than 2026-08-29. Earlier exact commissioning/dedication day remains uncovered here. | One system only. |

EC2's procurement/design/installation/testing wording describes lifecycle stages but supplies no
stage dates. No `OFFICIALLY_DELAYED`, `SCHEDULE_AT_RISK`, cancellation or scope-reduction conclusion
is supported. The current operator page supersedes any earlier “installation only” inference for
current lifecycle, but it does not rewrite the original milestone dates.

## 5. AI attribution and capacity states

| Dimension | Classification | Basis / fail-closed rule |
|---|---|---|
| AI attribution | `AI_EXPLICIT` | EC1 expressly identifies AI and ML codes; EC2 identifies AI-assisted analysis. Classified workload details are neither needed nor inferred. |
| Ordinary large threshold | `NOT_ESTABLISHED` | No eligible evidence here establishes ≥50 MW AI IT load or ≥10,000 disclosed data-center AI accelerators. |
| 35 MW | `SYSTEM_POWER_NON_AGGREGABLE` | EC2 says the machine requires about 35 MW; specification threshold requires AI IT load, not system/facility power. |
| 85 MW | `PLANNED_INFRASTRUCTURE_ENVELOPE_NON_ADDITIVE` | ECFM total and support for another future exascale system; not El Capitan AI capacity. |
| MI300A count | `VERIFIED_UNQUANTIFIED` | Four APUs per node is a component ratio, not a complete system count; APUs are integrated CPU/GPU packages. |
| Strategic importance | `PROPOSED_EXCEPTION_REQUIRES_HUMAN` | NNSA-first exascale role is structural, but executor cannot approve `STRATEGIC_EXCEPTION`. |
| Numeric timeline contribution | `EXCLUDED` | No valid AI IT-load or accelerator-count basis. |

## 6. Conflict, supersession and coverage ledger

- No source conflict was found between EC1–EC4 on identity or operational state.
- `2.88` peak exaFLOPs and `1.809` benchmark exaFLOPs are different performance bases, not a
  conflict and not capacity measures.
- ECFM 85 MW, El Capitan “about 35” MW and 400 kW/rack use different scopes. They must not be added,
  normalized to AI IT load or substituted for accelerator counts.
- The reviewed set does not establish the first operational/dedication date, complete node/APU count,
  independently executable tranches, contractual acceptance date, or public procurement value.
- English official coverage is strong for system identity and architecture but weak for immutable
  versioning: EC1/EC4 are mutable HTML and no issuer content digest was exposed.
- Evidence age is zero days at review. `last_verified_at = 2026-08-29`; reverify by 2026-12-27 under
  the 120-day policy.

## 7. Closest-tracker and decision comparison

TOP500 is the closest applicable public/open system tracker. It can efficiently answer “where does
El Capitan rank and what benchmark/architecture is reported?” It does not, by itself, separate ECFM
from the machine, distinguish system power from AI IT load, preserve installed versus operational
milestones, apply this project's AI attribution rule, or prevent APU/component-ratio conversion.

Ordinary headline research would likely call El Capitan the world's fastest exascale computer and
quote a power or performance number. This dossier changes the capacity decision: **do not put 35 MW,
85 MW, 400 kW/rack or any derived APU total into the confirmed numeric AI-capacity timeline**. Retain
the system as an operational, AI-explicit, verified-unquantified scientific case pending an explicit
human strategic-exception decision. Demand Layer v1 has no project/system identity or milestone that
answers this question, so there is no CapEx-to-capacity inference.

## 8. Actual effort log

This is instrumented agent wall-clock work, not a human-equivalent estimate and not a mature
quarterly-maintenance forecast.

| UTC interval | Activity | Actual elapsed |
|---|---|---:|
| 2026-08-29 23:30–23:33 | Baseline, AGENTS, spec/plan/tasks and authorization-artifact review | 3 min |
| 2026-08-29 23:33–23:39 | Public-source discovery/acquisition and disposable hashing | 6 min |
| 2026-08-29 23:39–23:43 | Claim extraction, identity/capacity resolution and dossier drafting setup | 4 min |
| 2026-08-29 23:43–23:46 | Final edit, diff check and full repository verification | 3 min |
| **Observed A2 interval** |  | **16 min** |

No translation time was required. Baseline and verification intervals were shared with the Colossus
case and must not be summed across dossiers when estimating total A2 effort.
