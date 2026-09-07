# impro-dashboard

任務：讓公開儀表板更好掃，不動任何經濟意義。

目標（全部都要滿足才算完成）
1. 首屏 5 秒內能看到：當前 board 狀態、asOf / 證據截止日、一句「這不是投資建議／總 CapEx ≠ AI CapEx」。
2. Q3 15 案摘要（營運 / 興建或開發 / 僅簽約）不要埋在長文後面；用清楚分組或短表，每案保留來源連結。
3. latest.json 的入口在首屏看得到（文字連結即可）。
4. 手機寬度可讀：狀態與日期不被擠掉。

禁止
- 改 data/ingestion、signal、threshold、confidence、scoring、ranking
- live ingestion、workflow_dispatch、部署 Pages、force-push
- 把總 CapEx 寫成 AI CapEx，或推論缺失財報數字
- 大重構、換框架、改套件版號（與本任務無關的 lockfile 不要動）

必做
- 先讀 AGENTS.md、README、現有 presentation / dashboard 程式與測試
- 先跑一次 npm run verify:agent 當基線
- 只改 UI／文案／presentation 測試
- 完成前再跑 npm run verify:agent 與 git diff --check
- git diff -- data/ingestion 必須是空的
- 回報：改了哪些檔、驗證輸出、人類還要決定什麼

驗收
- npm run verify:agent 通過
- npm run dev 時首屏能同時看到狀態、日期、免責、Q3 分組、latest.json 連結
