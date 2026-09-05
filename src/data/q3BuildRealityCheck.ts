// Hand-copied from the Q3 draft and lean quarterly baseline; no live research.
// docs/research/ai-infrastructure-observability/productization/2026-q3-ai-build-reality-check-draft.md
// docs/research/ai-infrastructure-observability/pilot/full-r2/lean-quarterly-transition-baseline-v0.1.md
export const q3BuildRealityCheck = {
  evidenceCutoff: '2026-08-30',
  verdict: 'Demand is strong. Physical execution is real but uneven.',
  boundary: '15 deliberately selected public known cases, not a representative market sample. This first fixed-cohort baseline does not establish a global acceleration or deceleration rate.',
  counts: { operating: 7, building: 7, contracted: 1 },
  fullReportUrl: 'https://github.com/jimisu/ai-infrastructure-monitor/blob/main/docs/research/ai-infrastructure-observability/productization/2026-q3-ai-build-reality-check-draft.md',
  cases: [
    {
      name: 'Michigan / The Barn',
      status: 'Building; power-contract risk',
      detail: 'Construction has started. Critical-power contracts have conditional approval and remain under appeal. Campus power and contracted electric demand are not AI IT load.',
      sources: [
        { name: 'MPSC conditional approval', url: 'https://www.michigan.gov/mpsc/commission/news-releases/2025/12/18/mpsc-approves-dte-electric-energy-contracts-for-data-center' },
        { name: 'OpenAI groundbreaking', url: 'https://openai.com/index/stargate-michigan-data-center/' },
        { name: 'Michigan Attorney General appeal', url: 'https://www.michigan.gov/ag/news/press-releases/2026/04/17/ag-nessel-files-appeal-of-dtes-saline-data-center-contracts' },
      ],
    },
    {
      name: 'Osaka Sakai',
      status: 'Building; schedule revised',
      detail: 'The original 2025 operation target moved to 2026. Reported 140/150 MW figures describe receiving power, not AI IT load.',
      sources: [{ name: 'SoftBank construction description', url: 'https://www.softbank.jp/sbnews/entry/20260609_01' }],
    },
    {
      name: 'AWS Project Rainier',
      status: 'Operating; project-specific compute evidence',
      detail: 'Nearly 500,000 Trainium2 chips were reported fully operational. This is project-specific, non-NVIDIA deployment evidence; later collaboration-wide quantities are not added.',
      sources: [{ name: 'Amazon operational announcement', url: 'https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster' }],
    },
  ],
}
