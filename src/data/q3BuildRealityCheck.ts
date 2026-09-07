// Hand-copied from the Q3 draft and lean quarterly baseline; no live research.
// docs/research/ai-infrastructure-observability/productization/2026-q3-ai-build-reality-check-draft.md
// docs/research/ai-infrastructure-observability/pilot/full-r2/lean-quarterly-transition-baseline-v0.1.md
type Q3CohortCase = {
  name: string
  group: 'operating' | 'building' | 'contracted'
  status: string
  detail: string
  sources: { name: string; url: string }[]
}

export const q3BuildRealityCheck: {
  evidenceCutoff: string
  verdict: string
  boundary: string
  counts: { operating: number; building: number; contracted: number }
  fullReportUrl: string
  cases: Q3CohortCase[]
} = {
  evidenceCutoff: '2026-08-30',
  verdict: 'Demand is strong. Physical execution is real but uneven.',
  boundary: '15 deliberately selected public known cases, not a representative market sample. This first fixed-cohort baseline does not establish a global acceleration or deceleration rate.',
  counts: { operating: 7, building: 7, contracted: 1 },
  fullReportUrl: 'https://github.com/jimisu/ai-infrastructure-monitor/blob/main/docs/research/ai-infrastructure-observability/productization/2026-q3-ai-build-reality-check-draft.md',
  cases: [
    {
      name: 'Munich Industrial AI Cloud',
      group: 'operating',
      status: 'Operating',
      detail: 'Deutsche Telekom later stated the Munich facility is operating. Accelerator counts and facility power are not added as AI IT load.',
      sources: [{ name: 'Deutsche Telekom operating statement', url: 'https://www.telekom.com/en/media/media-information/archive/t-systems-brings-ai-into-the-supply-chain-1105624' }],
    },
    {
      name: 'xAI Colossus',
      group: 'operating',
      status: 'Operating',
      detail: 'Supplier reporting supported an operating Hopper configuration. Later larger scopes are not added to that observation.',
      sources: [{ name: 'NVIDIA Colossus networking release', url: 'https://nvidianews.nvidia.com/news/spectrum-x-ethernet-networking-xai-colossus' }],
    },
    {
      name: 'Stargate Abilene first phase',
      group: 'operating',
      status: 'Operating',
      detail: 'The first phase was reported live. The later expansion is a separate identity and is not added here.',
      sources: [{ name: 'Crusoe first-phase live announcement', url: 'https://www.crusoe.ai/resources/newsroom/crusoe-announces-flagship-abilene-data-center-is-live' }],
    },
    {
      name: 'Microsoft Fairwater Wisconsin',
      group: 'operating',
      status: 'Operating',
      detail: 'Microsoft reported the first Mount Pleasant facility fully operational. Network-wide or other Fairwater sites are not collapsed into this row.',
      sources: [{ name: 'Microsoft Mount Pleasant completion', url: 'https://news.microsoft.com/source/2026/06/23/microsoft-completes-construction-on-first-datacenter-facility-in-mount-pleasant-wisconsin/' }],
    },
    {
      name: 'Nebius Mäntsälä expansion',
      group: 'operating',
      status: 'Operating',
      detail: 'The issuer said the Mäntsälä expansion completed earlier in 2026. Site power and hosting ceilings are not treated as AI IT load.',
      sources: [{ name: 'Nebius expansion completion statement', url: 'https://nebius.com/newsroom/nebius-to-construct-310-mw-ai-factory-in-finland' }],
    },
    {
      name: 'JUPITER',
      group: 'operating',
      status: 'Operating',
      detail: 'The operator inaugurated JUPITER as an operating system. Performance figures are not converted into additive AI capacity.',
      sources: [{ name: 'Forschungszentrum Jülich inauguration', url: 'https://www.fz-juelich.de/en/news/archive/press-release/2025/ceremony-jupiter' }],
    },
    {
      name: 'AWS Project Rainier',
      group: 'operating',
      status: 'Operating; project-specific compute evidence',
      detail: 'Nearly 500,000 Trainium2 chips were reported fully operational. This is project-specific, non-NVIDIA deployment evidence; later collaboration-wide quantities are not added.',
      sources: [{ name: 'Amazon operational announcement', url: 'https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster' }],
    },
    {
      name: 'Stargate UAE',
      group: 'building',
      status: 'Building or development',
      detail: 'Construction progress was reported. The 2026 service target remains prospective, and campus or cluster power is not booked as AI IT load.',
      sources: [{ name: 'G42 construction update', url: 'https://www.prnewswire.com/news-releases/g42-provides-update-on-construction-of-stargate-uae-ai-infrastructure-cluster-302586430.html' }],
    },
    {
      name: 'Osaka Sakai',
      group: 'building',
      status: 'Building; schedule revised',
      detail: 'The original 2025 operation target moved to 2026. Reported 140/150 MW figures describe receiving power, not AI IT load.',
      sources: [{ name: 'SoftBank construction description', url: 'https://www.softbank.jp/sbnews/entry/20260609_01' }],
    },
    {
      name: 'Meta Project Laidley / Hyperion',
      group: 'building',
      status: 'Building or development',
      detail: 'A binding service agreement and construction activity were described. Campus upper bounds and supporting utility resources are not AI IT load.',
      sources: [{ name: 'Meta Richland Parish construction update', url: 'https://datacenters.atmeta.com/2026/07/deepening-our-investment-in-richland-parish-louisiana/' }],
    },
    {
      name: 'SoftBank Tomakomai',
      group: 'building',
      status: 'Building or development',
      detail: 'Municipal reporting confirms construction. The service target remains prospective, and receiving-power figures are not AI IT load.',
      sources: [{ name: 'Tomakomai municipal project profile', url: 'https://www.city.tomakomai.hokkaido.jp/files/00004100/00004199/20251027184355.pdf' }],
    },
    {
      name: 'SK–AWS Ulsan',
      group: 'building',
      status: 'Building or development',
      detail: 'The city reported a physical groundbreaking. Later facility phases and GW ambitions remain separate.',
      sources: [{ name: 'Ulsan groundbreaking release', url: 'https://www.ulsan.go.kr/u/rep/bbs/view.ulsan?bbsId=BBS_0000000000000027&dataId=174521&mId=001004003001000000' }],
    },
    {
      name: 'Meta–Reliance Jamnagar first phase',
      group: 'building',
      status: 'Building or development',
      detail: 'A binding build-and-lease filing exists. Stated facility capacity is not AI IT load, and construction start is not treated as proven by the contract alone.',
      sources: [{ name: 'Reliance–Meta exchange filing', url: 'https://www.ril.com/sites/default/files/2026-06/SE_10062026.pdf' }],
    },
    {
      name: 'Michigan / The Barn',
      group: 'building',
      status: 'Building; power-contract risk',
      detail: 'Construction has started. Critical-power contracts have conditional approval and remain under appeal. Campus power and contracted electric demand are not AI IT load.',
      sources: [
        { name: 'MPSC conditional approval', url: 'https://www.michigan.gov/mpsc/commission/news-releases/2025/12/18/mpsc-approves-dte-electric-energy-contracts-for-data-center' },
        { name: 'OpenAI groundbreaking', url: 'https://openai.com/index/stargate-michigan-data-center/' },
        { name: 'Michigan Attorney General appeal', url: 'https://www.michigan.gov/ag/news/press-releases/2026/04/17/ag-nessel-files-appeal-of-dtes-saline-data-center-contracts' },
      ],
    },
    {
      name: 'Stargate Norway',
      group: 'contracted',
      status: 'Contracted without construction evidence',
      detail: 'Aker reported a full-site Microsoft contract. That supports a contractual state, not installed hardware or construction.',
      sources: [{ name: 'Aker Q1 2026 shareholder letter', url: 'https://www.akerasa.com/investors/shareholder-letters/2026/first-quarter-2026' }],
    },
  ],
}
