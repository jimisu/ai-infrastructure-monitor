export type CohortGroupId = 'operating' | 'building' | 'contracted'

export interface FirstScreenCase {
  name: string
  group: string
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

const GROUP_IDS: Set<string> = new Set(GROUP_ORDER.map((group) => group.id))

export function toFirstScreen(inputs: FirstScreenInputs) {
  const groups = GROUP_ORDER.map(({ id, label }) => ({
    id,
    label,
    cases: inputs.cases.filter((item) => item.group === id),
  }))
  const unassigned = inputs.cases.filter((item) => !GROUP_IDS.has(item.group))
  return {
    status: inputs.status,
    asOf: inputs.asOf,
    evidenceCutoff: inputs.evidenceCutoff,
    disclaimer: inputs.disclaimer,
    snapshotHref: inputs.snapshotHref,
    groups,
    unassigned,
    countsMatch:
      unassigned.length === 0
      && groups[0].cases.length === inputs.counts.operating
      && groups[1].cases.length === inputs.counts.building
      && groups[2].cases.length === inputs.counts.contracted,
  }
}

export type FirstScreenView = ReturnType<typeof toFirstScreen>
