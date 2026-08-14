import type {
  CapexDefinition,
  CapexGuidanceShape,
  CompanyCapexForwardImpliedYoYSignal,
  CompanyCapexGuidanceRevisionSignal,
  CapexGuidanceRevision,
  CapexQoQGrowth,
  CompanyCapexProfile,
  CompanyCapexTtmYoYActualSignal,
  CompanyCapexYoYActualTrendSignal,
  NormalizedCapexObservation,
} from '../types/capex'
import type { DerivedSignal } from '../types/derivedSignal'
import type { MetricObservation } from '../types/metric'
import {
  buildDerivedSignalId,
  systemGeneratedAt,
  type GeneratedAtProvider,
} from './derivedSignalIdentity'

export function normalizeCapexObservations(
  observations: MetricObservation[],
  profile: CompanyCapexProfile,
  definitions: CapexDefinition[]
): NormalizedCapexObservation[] {
  if (
    definitions.some((definition) => definition.companyTicker !== profile.companyTicker)
  ) {
    return []
  }

  const definitionsById = new Map(definitions.map((definition) => [definition.id, definition]))

  return observations.flatMap((observation): NormalizedCapexObservation[] => {
    const definitionId = observation.capexDefinitionId ?? profile.defaultCapexDefinitionId
    const definition = definitionsById.get(definitionId)
    if (
      !definition ||
      !profile.capexDefinitionIds.includes(definitionId) ||
      observation.companyTicker !== profile.companyTicker ||
      observation.unit !== profile.currencyUnit ||
      !definition.sourceIds.includes(observation.sourceId)
    ) {
      return []
    }

    if (
      observation.metric === 'CAPEX_GUIDANCE_LOW' &&
      observation.periodType === 'YEAR' &&
      observation.guidanceAsOfPeriod
    ) {
      return [{
        ...observation,
        kind: 'ANNUAL_GUIDANCE_LOW',
        targetPeriod: observation.period,
        targetPeriodType: 'YEAR',
        capexDefinitionId: definitionId,
        approximate: observation.approximate ?? false,
        sourceObservation: observation,
      }]
    }

    if (
      observation.metric === 'CAPEX_GUIDANCE_HIGH' &&
      observation.periodType === 'YEAR' &&
      observation.guidanceAsOfPeriod
    ) {
      return [{
        ...observation,
        kind: 'ANNUAL_GUIDANCE_HIGH',
        targetPeriod: observation.period,
        targetPeriodType: 'YEAR',
        capexDefinitionId: definitionId,
        approximate: observation.approximate ?? false,
        sourceObservation: observation,
      }]
    }

    if (observation.metric === 'CAPEX_GUIDANCE_POINT' && observation.guidanceAsOfPeriod) {
      return [{ ...observation, kind: 'GUIDANCE_POINT', targetPeriod: observation.period, targetPeriodType: observation.periodType === 'YEAR' ? 'YEAR' : 'QUARTER', capexDefinitionId: definitionId, approximate: observation.approximate ?? false, sourceObservation: observation }]
    }

    if (observation.metric === 'CAPEX_GUIDANCE_LOWER_BOUND' && observation.guidanceAsOfPeriod) {
      return [{ ...observation, kind: 'GUIDANCE_LOWER_BOUND', targetPeriod: observation.period, targetPeriodType: observation.periodType === 'YEAR' ? 'YEAR' : 'QUARTER', capexDefinitionId: definitionId, approximate: observation.approximate ?? false, sourceObservation: observation }]
    }

    if (observation.metric === 'CAPEX_ACTUAL' && observation.periodType === 'POINT_IN_TIME' && /^TTM-\d{4}-Q[1-4]$/.test(observation.period)) {
      return [{
        ...observation,
        kind: 'TTM_ACTUAL',
        targetPeriod: observation.period,
        targetPeriodType: 'TTM',
        capexDefinitionId: definitionId,
        approximate: observation.approximate ?? false,
        sourceObservation: observation,
      }]
    }

    if (observation.metric === 'CAPEX_ACTUAL' && observation.periodType === 'YEAR') {
      return [{
        ...observation,
        kind: 'ANNUAL_ACTUAL',
        targetPeriod: observation.period,
        targetPeriodType: 'YEAR',
        capexDefinitionId: definitionId,
        approximate: observation.approximate ?? false,
        sourceObservation: observation,
      }]
    }

    if (observation.metric === 'CAPEX_ACTUAL' && observation.periodType === 'QUARTER') {
      return [{
        ...observation,
        kind: 'QUARTERLY_ACTUAL',
        targetPeriod: observation.period,
        targetPeriodType: 'QUARTER',
        capexDefinitionId: definitionId,
        approximate: observation.approximate ?? false,
        sourceObservation: observation,
      }]
    }

    return []
  })
}

function latestGuidancePair(observations: NormalizedCapexObservation[], capexDefinitionId: string) {
  const annualGuidance = observations
    .filter((observation) => observation.targetPeriodType === 'YEAR' && observation.capexDefinitionId === capexDefinitionId && (observation.kind === 'ANNUAL_GUIDANCE_LOW' || observation.kind === 'ANNUAL_GUIDANCE_HIGH'))
    .sort((a, b) =>
      a.targetPeriod.localeCompare(b.targetPeriod) ||
      a.guidanceAsOfPeriod!.localeCompare(b.guidanceAsOfPeriod!)
    )
  const latestTargetPeriod = annualGuidance.at(-1)?.targetPeriod
  if (!latestTargetPeriod) return null

  const targetGuidance = annualGuidance.filter(
    (observation) => observation.targetPeriod === latestTargetPeriod
  )
  const asOfPeriods = [...new Set(targetGuidance.map((observation) => observation.guidanceAsOfPeriod!))]
  if (asOfPeriods.length < 2) return null

  const priorAsOfPeriod = asOfPeriods.at(-2)!
  const latestAsOfPeriod = asOfPeriods.at(-1)!
  const find = (kind: NormalizedCapexObservation['kind'], asOfPeriod: string) =>
    targetGuidance.find(
      (observation) => observation.kind === kind && observation.guidanceAsOfPeriod === asOfPeriod
    )
  const priorLow = find('ANNUAL_GUIDANCE_LOW', priorAsOfPeriod)
  const priorHigh = find('ANNUAL_GUIDANCE_HIGH', priorAsOfPeriod)
  const latestLow = find('ANNUAL_GUIDANCE_LOW', latestAsOfPeriod)
  const latestHigh = find('ANNUAL_GUIDANCE_HIGH', latestAsOfPeriod)

  if (!priorLow || !priorHigh || !latestLow || !latestHigh) return null
  return { priorAsOfPeriod, latestAsOfPeriod, priorLow, priorHigh, latestLow, latestHigh }
}

export function deriveCompanyCapexGuidanceRevision(
  observations: NormalizedCapexObservation[],
  companyTicker: string,
  capexDefinitionId: string
): CapexGuidanceRevision | null {
  const pair = latestGuidancePair(observations, capexDefinitionId)
  if (!pair) return null

  const initialMidpoint = (pair.priorLow.value + pair.priorHigh.value) / 2
  const currentMidpoint = (pair.latestLow.value + pair.latestHigh.value) / 2
  const revisionPercent = ((currentMidpoint - initialMidpoint) / initialMidpoint) * 100
  const trend = revisionPercent > 0 ? 'UPWARD' : revisionPercent < 0 ? 'DOWNWARD' : 'NEUTRAL'

  return {
    period: pair.latestLow.targetPeriod,
    initialMidpoint,
    currentMidpoint,
    revisionPercent,
    trend,
    evidenceIds: [pair.priorLow.id, pair.priorHigh.id, pair.latestLow.id, pair.latestHigh.id],
    description: `${companyTicker} ${pair.latestLow.targetPeriod} CapEx guidance revised ${revisionPercent >= 0 ? '+' : ''}${revisionPercent.toFixed(1)}% from ${initialMidpoint.toFixed(2)}B as of ${pair.priorAsOfPeriod} to ${currentMidpoint.toFixed(2)}B as of ${pair.latestAsOfPeriod}.`,
  }
}

function quarterIndex(period: string): number | null {
  const match = /^(?:[A-Z]+-FY)?(\d{4})-Q([1-4])$/.exec(period)
  return match ? Number(match[1]) * 4 + Number(match[2]) - 1 : null
}

export function deriveCompanyCapexQoQGrowthRates(
  observations: NormalizedCapexObservation[]
): CapexQoQGrowth[] {
  const actualsByDefinition = new Map<string, NormalizedCapexObservation[]>()
  for (const observation of observations.filter((item) => item.kind === "QUARTERLY_ACTUAL")) {
    const series = actualsByDefinition.get(observation.capexDefinitionId) ?? []
    series.push(observation)
    actualsByDefinition.set(observation.capexDefinitionId, series)
  }

  const rates: CapexQoQGrowth[] = []
  for (const [capexDefinitionId, series] of actualsByDefinition) {
    const indexed = series
      .map((observation) => ({ observation, index: quarterIndex(observation.targetPeriod) }))
      .filter((entry): entry is { observation: NormalizedCapexObservation; index: number } =>
        entry.index !== null
      )
      .sort((a, b) => a.index - b.index)

    for (let index = 1; index < indexed.length; index++) {
      const prior = indexed[index - 1]
      const current = indexed[index]
      if (current.index !== prior.index + 1) continue

      rates.push({
        period: current.observation.targetPeriod,
        capexDefinitionId,
        value: current.observation.value,
        qoqPercent:
          ((current.observation.value - prior.observation.value) / prior.observation.value) * 100,
        previousValue: prior.observation.value,
        previousPeriod: prior.observation.targetPeriod,
        evidenceIds: [prior.observation.id, current.observation.id],
      })
    }
  }

  return rates.sort((a, b) =>
    a.capexDefinitionId.localeCompare(b.capexDefinitionId) || a.period.localeCompare(b.period)
  )
}

interface FiscalQuarter {
  fiscalYear: number
  fiscalQuarter: number
}

function fiscalQuarter(period: string): FiscalQuarter | null {
  const match = /^(?:[A-Z]+-FY)?(\d{4})-Q([1-4])$/.exec(period)
  return match ? { fiscalYear: Number(match[1]), fiscalQuarter: Number(match[2]) } : null
}

export function deriveCompanyCapexYoYActualTrends(
  observations: NormalizedCapexObservation[],
  profile: CompanyCapexProfile,
  capexDefinitionId: string,
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): CompanyCapexYoYActualTrendSignal[] {
  if (!profile.capexDefinitionIds.includes(capexDefinitionId)) return []

  const actuals = observations.filter(
    (observation) =>
      observation.kind === 'QUARTERLY_ACTUAL' &&
      observation.capexDefinitionId === capexDefinitionId
  )
  const byFiscalPeriod = new Map<string, NormalizedCapexObservation>()
  for (const observation of actuals) {
    const fiscal = fiscalQuarter(observation.targetPeriod)
    if (fiscal) byFiscalPeriod.set(`${fiscal.fiscalYear}-Q${fiscal.fiscalQuarter}`, observation)
  }

  const yoyCalculations = actuals.flatMap((current) => {
    const fiscal = fiscalQuarter(current.targetPeriod)
    if (!fiscal) return []
    const priorYear = byFiscalPeriod.get(`${fiscal.fiscalYear - 1}-Q${fiscal.fiscalQuarter}`)
    if (!priorYear) return []
    return [{
      current,
      priorYear,
      fiscal,
      yoyPercent: ((current.value - priorYear.value) / priorYear.value) * 100,
    }]
  }).sort((a, b) =>
    a.fiscal.fiscalYear - b.fiscal.fiscalYear ||
    a.fiscal.fiscalQuarter - b.fiscal.fiscalQuarter
  )

  return yoyCalculations.map((calculation, index) => {
    const priorCalculation = yoyCalculations[index - 1]
    const priorIsAdjacent =
      priorCalculation !== undefined &&
      priorCalculation.fiscal.fiscalYear * 4 + priorCalculation.fiscal.fiscalQuarter ===
        calculation.fiscal.fiscalYear * 4 + calculation.fiscal.fiscalQuarter - 1
    const priorYoYPercent = priorIsAdjacent ? priorCalculation.yoyPercent : null
    const spendingDirection =
      calculation.yoyPercent > 0 ? 'POSITIVE' : calculation.yoyPercent < 0 ? 'NEGATIVE' : 'NEUTRAL'
    const growthRateTrend =
      priorYoYPercent === null
        ? 'STABLE'
        : calculation.yoyPercent > priorYoYPercent
          ? 'ACCELERATING'
          : calculation.yoyPercent < priorYoYPercent
            ? 'DECELERATING'
            : 'STABLE'
    const evidenceObservationIds = [
      ...(priorIsAdjacent
        ? [priorCalculation.priorYear.id, priorCalculation.current.id]
        : []),
      calculation.priorYear.id,
      calculation.current.id,
    ]

    return {
      id: buildDerivedSignalId(
        profile.companyTicker,
        'CAPEX_YOY_ACTUAL_TREND',
        calculation.current.targetPeriod,
        evidenceObservationIds
      ),
      signalType: 'CAPEX_YOY_ACTUAL_TREND',
      companyTicker: profile.companyTicker,
      capexDefinitionId,
      period: calculation.current.targetPeriod,
      currentValue: calculation.current.value,
      priorYearValue: calculation.priorYear.value,
      yoyPercent: calculation.yoyPercent,
      spendingDirection,
      growthRateTrend,
      priorYoYPercent,
      generatedAt: generatedAt(),
      evidenceObservationIds,
      description: `${profile.companyTicker} ${calculation.current.targetPeriod} CapEx was ${calculation.yoyPercent >= 0 ? '+' : ''}${calculation.yoyPercent.toFixed(1)}% year over year; spending direction ${spendingDirection.toLowerCase()} and growth-rate trend ${growthRateTrend.toLowerCase()}.`,
    }
  })
}

export function deriveCompanyCapexSignals(
  observations: NormalizedCapexObservation[],
  profile: CompanyCapexProfile,
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): DerivedSignal[] {
  const signals: DerivedSignal[] = []
  const revision = deriveCompanyCapexGuidanceRevision(observations, profile.companyTicker, profile.defaultCapexDefinitionId)

  if (revision && revision.revisionPercent !== 0) {
    const signalType = revision.revisionPercent > 0
      ? 'CAPEX_GUIDANCE_REVISION_UP' as const
      : 'CAPEX_GUIDANCE_REVISION_DOWN' as const
    signals.push({
      id: buildDerivedSignalId(profile.companyTicker, signalType, revision.period, revision.evidenceIds),
      companyTicker: profile.companyTicker,
      signalType,
      direction: revision.revisionPercent > 0 ? 'POSITIVE' : 'NEGATIVE',
      magnitude: revision.revisionPercent,
      unit: 'percent',
      confidence: 'HIGH',
      period: revision.period,
      generatedAt: generatedAt(),
      evidenceObservationIds: revision.evidenceIds,
      description: revision.description.replace(' revised ', ' midpoint revised '),
      capexDefinitionId: profile.defaultCapexDefinitionId,
    })
  }

  for (const rate of deriveCompanyCapexQoQGrowthRates(observations)) {
    const signalType = rate.qoqPercent >= 0
      ? 'CAPEX_QOQ_ACCELERATION' as const
      : 'CAPEX_QOQ_DECELERATION' as const
    signals.push({
      id: buildDerivedSignalId(profile.companyTicker, signalType, rate.period, rate.evidenceIds),
      companyTicker: profile.companyTicker,
      signalType,
      direction: rate.qoqPercent > 0 ? 'POSITIVE' : rate.qoqPercent < 0 ? 'NEGATIVE' : 'NEUTRAL',
      magnitude: rate.qoqPercent,
      unit: 'percent',
      confidence: 'HIGH',
      period: rate.period,
      generatedAt: generatedAt(),
      evidenceObservationIds: rate.evidenceIds,
      description: `${profile.companyTicker} ${rate.period} CapEx ${rate.value.toFixed(2)}B, ${rate.qoqPercent >= 0 ? '+' : ''}${rate.qoqPercent.toFixed(1)}% vs ${rate.previousPeriod} ${rate.previousValue.toFixed(2)}B.`,
      capexDefinitionId: rate.capexDefinitionId,
    })
  }

  return signals
}


interface AnnualGuidanceSnapshot {
  targetPeriod: string
  asOfPeriod: string
  value: number
  shape: CapexGuidanceShape
  approximate: boolean
  evidenceIds: string[]
}

function annualGuidanceSnapshots(
  observations: NormalizedCapexObservation[],
  capexDefinitionId: string
): AnnualGuidanceSnapshot[] {
  const groups = new Map<string, NormalizedCapexObservation[]>()
  for (const observation of observations) {
    if (
      observation.targetPeriodType !== 'YEAR' ||
      observation.capexDefinitionId !== capexDefinitionId ||
      !observation.guidanceAsOfPeriod ||
      !['GUIDANCE_POINT', 'ANNUAL_GUIDANCE_LOW', 'ANNUAL_GUIDANCE_HIGH'].includes(observation.kind)
    ) continue
    const key = `${observation.targetPeriod}|${observation.guidanceAsOfPeriod}`
    const group = groups.get(key) ?? []
    group.push(observation)
    groups.set(key, group)
  }

  return [...groups.values()].flatMap((group): AnnualGuidanceSnapshot[] => {
    const point = group.filter((item) => item.kind === 'GUIDANCE_POINT')
    const lows = group.filter((item) => item.kind === 'ANNUAL_GUIDANCE_LOW')
    const highs = group.filter((item) => item.kind === 'ANNUAL_GUIDANCE_HIGH')
    const first = group[0]

    if (point.length === 1 && lows.length === 0 && highs.length === 0) {
      return [{
        targetPeriod: first.targetPeriod,
        asOfPeriod: first.guidanceAsOfPeriod!,
        value: point[0].value,
        shape: point[0].approximate ? 'APPROXIMATE_POINT' : 'POINT',
        approximate: point[0].approximate,
        evidenceIds: [point[0].id],
      }]
    }
    if (point.length === 0 && lows.length === 1 && highs.length === 1 && lows[0].value <= highs[0].value) {
      return [{
        targetPeriod: first.targetPeriod,
        asOfPeriod: first.guidanceAsOfPeriod!,
        value: (lows[0].value + highs[0].value) / 2,
        shape: 'RANGE',
        approximate: lows[0].approximate || highs[0].approximate,
        evidenceIds: [lows[0].id, highs[0].id],
      }]
    }
    return []
  }).sort((a, b) =>
    a.targetPeriod.localeCompare(b.targetPeriod) || a.asOfPeriod.localeCompare(b.asOfPeriod)
  )
}

export function deriveCompanyCapexGuidanceRevisionChain(
  observations: NormalizedCapexObservation[],
  profile: CompanyCapexProfile,
  capexDefinitionId: string,
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): CompanyCapexGuidanceRevisionSignal[] {
  if (!profile.capexDefinitionIds.includes(capexDefinitionId)) return []

  const byTarget = new Map<string, AnnualGuidanceSnapshot[]>()
  for (const snapshot of annualGuidanceSnapshots(observations, capexDefinitionId)) {
    const target = byTarget.get(snapshot.targetPeriod) ?? []
    target.push(snapshot)
    byTarget.set(snapshot.targetPeriod, target)
  }

  const signals: CompanyCapexGuidanceRevisionSignal[] = []
  for (const snapshots of byTarget.values()) {
    for (let index = 1; index < snapshots.length; index++) {
      const prior = snapshots[index - 1]
      const current = snapshots[index]
      const revisionPercent = ((current.value - prior.value) / prior.value) * 100
      if (revisionPercent === 0) continue
      const signalType = revisionPercent > 0
        ? 'CAPEX_GUIDANCE_REVISION_UP' as const
        : 'CAPEX_GUIDANCE_REVISION_DOWN' as const
      const evidenceObservationIds = [...prior.evidenceIds, ...current.evidenceIds]

      signals.push({
        id: buildDerivedSignalId(
          profile.companyTicker,
          signalType,
          current.targetPeriod,
          evidenceObservationIds
        ),
        signalType,
        companyTicker: profile.companyTicker,
        capexDefinitionId,
        period: current.targetPeriod,
        priorGuidanceAsOfPeriod: prior.asOfPeriod,
        guidanceAsOfPeriod: current.asOfPeriod,
        priorValue: prior.value,
        currentValue: current.value,
        priorGuidanceShape: prior.shape,
        currentGuidanceShape: current.shape,
        revisionPercent,
        approximate: prior.approximate || current.approximate,
        generatedAt: generatedAt(),
        evidenceObservationIds,
        description: `${profile.companyTicker} ${current.targetPeriod} CapEx guidance changed ${revisionPercent >= 0 ? '+' : ''}${revisionPercent.toFixed(2)}% from ${prior.value.toFixed(2)}B as of ${prior.asOfPeriod} to ${current.value.toFixed(2)}B as of ${current.asOfPeriod}${prior.approximate || current.approximate ? '; comparison includes approximate guidance' : ''}.`,
      })
    }
  }
  return signals
}

export function deriveCompanyCapexForwardImpliedYoYGrowth(
  observations: NormalizedCapexObservation[],
  profile: CompanyCapexProfile,
  capexDefinitionId: string,
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): CompanyCapexForwardImpliedYoYSignal | null {
  if (!profile.capexDefinitionIds.includes(capexDefinitionId)) return null

  const snapshots = annualGuidanceSnapshots(observations, capexDefinitionId)
    .filter((snapshot) => /^\d{4}$/.test(snapshot.targetPeriod))
    .sort((a, b) =>
      Number(a.targetPeriod) - Number(b.targetPeriod) ||
      a.asOfPeriod.localeCompare(b.asOfPeriod)
    )
  const guidance = snapshots.at(-1)
  if (!guidance) return null

  const priorActualPeriod = String(Number(guidance.targetPeriod) - 1)
  const priorActuals = observations.filter(
    (observation) =>
      observation.kind === 'ANNUAL_ACTUAL' &&
      observation.targetPeriod === priorActualPeriod &&
      observation.capexDefinitionId === capexDefinitionId
  )
  if (priorActuals.length !== 1 || priorActuals[0].value === 0) return null

  const priorActual = priorActuals[0]
  const impliedYoYPercent = ((guidance.value - priorActual.value) / priorActual.value) * 100
  const evidenceObservationIds = [priorActual.id, ...guidance.evidenceIds]

  return {
    id: buildDerivedSignalId(
      profile.companyTicker,
      'CAPEX_FORWARD_IMPLIED_YOY_GROWTH',
      guidance.targetPeriod,
      evidenceObservationIds
    ),
    signalType: 'CAPEX_FORWARD_IMPLIED_YOY_GROWTH',
    companyTicker: profile.companyTicker,
    capexDefinitionId,
    period: guidance.targetPeriod,
    guidanceAsOfPeriod: guidance.asOfPeriod,
    priorActualPeriod,
    guidanceMidpoint: guidance.value,
    priorActualValue: priorActual.value,
    impliedYoYPercent,
    direction: impliedYoYPercent > 0 ? 'POSITIVE' : impliedYoYPercent < 0 ? 'NEGATIVE' : 'NEUTRAL',
    guidanceShape: guidance.shape,
    approximate: guidance.approximate || priorActual.approximate,
    generatedAt: generatedAt(),
    evidenceObservationIds,
    description: `${profile.companyTicker} ${guidance.targetPeriod} CapEx guidance ${guidance.shape === 'RANGE' ? 'midpoint ' : ''}${guidance.value.toFixed(2)}B implies ${impliedYoYPercent >= 0 ? '+' : ''}${impliedYoYPercent.toFixed(2)}% versus ${priorActualPeriod} actual CapEx ${priorActual.value.toFixed(2)}B.`,
  }
}


interface TtmPeriod {
  year: number
  quarter: number
}

function ttmPeriod(period: string): TtmPeriod | null {
  const match = /^TTM-(\d{4})-Q([1-4])$/.exec(period)
  return match ? { year: Number(match[1]), quarter: Number(match[2]) } : null
}

export function deriveCompanyCapexTtmYoYActualTrends(
  observations: NormalizedCapexObservation[],
  profile: CompanyCapexProfile,
  capexDefinitionId: string,
  generatedAt: GeneratedAtProvider = systemGeneratedAt
): CompanyCapexTtmYoYActualSignal[] {
  if (!profile.capexDefinitionIds.includes(capexDefinitionId)) return []

  const actuals = observations.filter(
    (observation) =>
      observation.kind === 'TTM_ACTUAL' &&
      observation.capexDefinitionId === capexDefinitionId
  )
  const byPeriod = new Map(actuals.map((observation) => [observation.targetPeriod, observation]))

  return actuals.flatMap((current): CompanyCapexTtmYoYActualSignal[] => {
    const currentPeriod = ttmPeriod(current.targetPeriod)
    if (!currentPeriod) return []
    const priorPeriod = `TTM-${currentPeriod.year - 1}-Q${currentPeriod.quarter}`
    const prior = byPeriod.get(priorPeriod)
    if (!prior || prior.value === 0) return []

    const yoyPercent = ((current.value - prior.value) / prior.value) * 100
    const spendingDirection =
      yoyPercent > 0 ? 'POSITIVE' : yoyPercent < 0 ? 'NEGATIVE' : 'NEUTRAL'
    const evidenceObservationIds = [prior.id, current.id]

    return [{
      id: buildDerivedSignalId(
        profile.companyTicker,
        'CAPEX_TTM_YOY_ACTUAL_TREND',
        current.targetPeriod,
        evidenceObservationIds
      ),
      signalType: 'CAPEX_TTM_YOY_ACTUAL_TREND',
      companyTicker: profile.companyTicker,
      capexDefinitionId,
      period: current.targetPeriod,
      currentValue: current.value,
      priorYearValue: prior.value,
      yoyPercent,
      spendingDirection,
      generatedAt: generatedAt(),
      evidenceObservationIds,
      description: `${profile.companyTicker} ${current.targetPeriod} CapEx was ${yoyPercent >= 0 ? '+' : ''}${yoyPercent.toFixed(2)}% year over year using the same TTM definition.`,
    }]
  }).sort((a, b) => a.period.localeCompare(b.period))
}
