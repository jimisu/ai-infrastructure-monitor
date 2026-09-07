export type CohortGroupId = 'operating' | 'building' | 'contracted'

export interface FirstScreenCase {
  name: string
  group: CohortGroupId
  status: string
  detail: string
  sources: { name: string; url: string }[]
}

export interface FirstScreenInputs {
  status: string
  asOf: string
  evidenceCutoff: string
  disclaimer: string
  snapshotHref: string
  counts: { operating: number; building: number; contracted: number }
  cases: FirstScreenCase[]
}

const GROUP_ORDER: { id: CohortGroupId; label: string }[] = [
  { id: 'operating', label: 'Operating' },
  { id: 'building', label: 'Building or development' },
  { id: 'contracted', label: 'Contracted without construction evidence' },
]

export function toFirstScreen(inputs: FirstScreenInputs) {
  const groups = GROUP_ORDER.map(({ id, label }) => ({
    id,
    label,
    cases: inputs.cases.filter((item) => item.group === id),
  }))
  return {
    status: inputs.status,
    asOf: inputs.asOf,
    evidenceCutoff: inputs.evidenceCutoff,
    disclaimer: inputs.disclaimer,
    snapshotHref: inputs.snapshotHref,
    groups,
    countsMatch:
      groups[0].cases.length === inputs.counts.operating
      && groups[1].cases.length === inputs.counts.building
      && groups[2].cases.length === inputs.counts.contracted,
  }
}

export type FirstScreenView = ReturnType<typeof toFirstScreen>
