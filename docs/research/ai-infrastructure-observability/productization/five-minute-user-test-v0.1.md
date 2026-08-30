# Five-Minute User Test v0.1

**Status:** PREPARATION_COMPLETE / AWAITING_HUMAN_SESSIONS

**Test object:** [2026 Q3 AI Build Reality Check](2026-q3-ai-build-reality-check-draft.md)

**Sample:** three anonymous participants

**Scope:** comprehension, verification behavior, decision relevance, and reuse/share intent only

This test evaluates whether the existing one-page brief delivers useful evidence within five
minutes. It does not authorize new research, product changes, publication, or implementation.

## Participant screen

Recruit three people who meet at least two of these conditions:

- holds or actively follows TSMC, NVIDIA, or another AI-supply-chain company;
- reads earnings reports, industry commentary, or AI-bubble discussions;
- makes personal investment or industry judgments without a paid institutional data terminal; or
- wants to distinguish demand headlines from physical-build evidence.

Record only a participant code and broad profile. Do not record a name, account, exact holdings,
portfolio size, or contact details in this document.

## Moderator rules

1. Send or show only the Reality Check page.
2. Say: 「請用你平常看一篇產業文章的方式閱讀；五分鐘後我會問五個問題。」
3. Do not explain the product, define terminology, point to links, or mention the expected answer.
4. Start a five-minute timer when the participant begins reading.
5. Observe whether the participant opens an official-source link or shares/copies the page without
   prompting.
6. At five minutes, hide or close the page before asking Questions 1–3. Reopen it for Questions 4–5
   if the participant asks.
7. Record the participant's meaning faithfully. Do not upgrade a vague answer to a pass.

## Five questions

Ask these questions in order without follow-up hints:

1. 「用一句話說，這個專案在解決什麼問題？」
2. 「這一季最重要的結論是什麼？」
3. 「哪一個案例告訴你 NVIDIA、CSP 或台積電的需求訊號沒有告訴你的事情？」
4. 「你剛才有沒有主動打開原始來源？為什麼？」
5. 「下一季如果更新同樣這 15 個案子，你會再看或轉傳給別人嗎？你會在什麼情況下這樣做？」

After Question 5, ask one diagnostic prompt only:

> 「哪一段最難懂，或最像內部研究文件而不像給你看的成果？」

Do not ask whether the participant “likes” the page. The test measures demonstrated understanding
and behavior, not politeness or general approval.

## Scoring key

| Measure | Pass condition | Fail examples |
|---|---|---|
| Problem comprehension | Says the page checks whether strong AI demand is becoming real, executable infrastructure | Says only “it tracks NVIDIA,” “it predicts stocks,” or “it lists data centers” |
| Current conclusion | Says demand is strong and physical execution is real, but project-level progress/risk is uneven | Says global buildout is proven to be accelerating or gives only one project fact |
| Incremental evidence | Correctly explains one of Michigan power-contract risk, Sakai schedule revision, or Rainier non-NVIDIA operational evidence | Merely names a project or repeats the 7/7/1 counts |
| Verification behavior | Opens at least one official-source link before being asked | Says sources matter but opens none |
| Reuse/share intent | Names a concrete next-quarter trigger, decision, person, or discussion where the update would be used | Gives an unqualified polite “maybe” or “looks useful” |

## Anonymous result sheet

Use `Y`, `N`, or `P` (partial) for scored items. Quote only short phrases needed to justify the score.

| Field | P1 | P2 | P3 |
|---|---|---|---|
| Broad profile; which screen conditions apply |  |  |  |
| Q1 problem comprehension |  |  |  |
| Q1 evidence phrase |  |  |  |
| Q2 current conclusion |  |  |  |
| Q2 evidence phrase |  |  |  |
| Q3 incremental evidence |  |  |  |
| Case named and meaning stated |  |  |  |
| Opened an official source without prompting |  |  |  |
| Source opened, if any |  |  |  |
| Concrete reuse/share intent |  |  |  |
| Trigger or audience named |  |  |  |
| Hardest passage |  |  |  |
| Other observed confusion |  |  |  |

## Decision rule

Evaluate the three completed sessions once. Do not reinterpret the thresholds after seeing results.

### CONTINUE

Choose `CONTINUE` only when all four conditions pass:

- at least 2 of 3 participants pass problem comprehension;
- at least 2 of 3 pass the current conclusion;
- at least 1 of 3 opens an official source without prompting; and
- at least 1 of 3 both explains incremental evidence and names a concrete reuse/share context.

Continue means run the already proposed next quarterly update on the same 15-project cohort. It does
not authorize new candidates, automation, UI work, or production signals.

### REVISE

Choose `REVISE` when `CONTINUE` is not met, but at least 2 of 3 participants can explain either the
problem or the current conclusion after five minutes.

Revise only wording, information order, or technical-language translation. Use the “hardest passage”
responses to select the smallest change. Do not answer comprehension failure by adding research,
projects, metrics, or features. A revised page requires a separately authorized retest.

### STOP

Choose `STOP` when either condition is true:

- fewer than 2 of 3 participants can explain both the product problem and the current conclusion; or
- nobody demonstrates verification behavior, incremental-evidence understanding, or a concrete
  reuse/share context.

Stop means do not run the project-level quarterly layer. Preserve the existing research as a closed
artifact; do not turn the failed test into a broader build.

## Closeout record

Complete this section only after all three human sessions:

- **Session dates:**
- **Aggregate passes:** problem `__/3`; conclusion `__/3`; incremental evidence `__/3`; source open
  `__/3`; reuse/share `__/3`
- **Decision:** `CONTINUE / REVISE / STOP`
- **Evidence for decision:**
- **Smallest authorized next step:**
- **Actions explicitly not authorized:** research, candidate expansion, README/product edits, code,
  UI, signals, commit, push, merge, and deployment
