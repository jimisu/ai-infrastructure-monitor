import type { DerivedSignal } from '../types/derivedSignal'
import type { CompanyCapexAvailability, HyperscalerCapexTrend, HyperscalerTicker } from '../types/hyperscalerCapexTrend'
import type { HyperscalerTsmConfirmation } from '../types/hyperscalerTsmConfirmation'
import type { MetricName, MetricObservation } from '../types/metric'
import type { Source } from '../types/source'
import type { Trend3M } from '../signals/tsmSignalInterpreter'

const METRIC_LABELS: Record<MetricName, string> = {
  MONTHLY_REVENUE: 'Monthly revenue',
  MONTHLY_REVENUE_YOY_PERCENT: 'Monthly revenue YoY',
  MONTHLY_REVENUE_MOM_PERCENT: 'Monthly revenue MoM',
  QUARTERLY_REVENUE: 'Quarterly revenue',
  HPC_REVENUE: 'HPC revenue',
  GROSS_MARGIN: 'Gross margin',
  OPERATING_MARGIN: 'Operating margin',
  REVENUE_GUIDANCE_LOW: 'Revenue guidance low',
  REVENUE_GUIDANCE_HIGH: 'Revenue guidance high',
  CAPEX_GUIDANCE_LOW: 'CapEx guidance low',
  CAPEX_GUIDANCE_HIGH: 'CapEx guidance high',
  CAPEX_GUIDANCE_POINT: 'CapEx guidance',
  CAPEX_GUIDANCE_LOWER_BOUND: 'CapEx guidance lower bound',
  CAPEX_ACTUAL: 'Reported CapEx',
}

const CONTRIBUTION_TITLES: Record<HyperscalerTicker | 'TSM', string> = {
  META: 'Annual CapEx guidance revision evidence',
  MSFT: 'Management-total CapEx trend',
  GOOG: 'CapEx guidance and prior-actual evidence',
  AMZN: 'Property and equipment investment trend',
  TSM: 'Monthly revenue growth and forward outlook',
}

export interface RealIntelligenceEvidence {
  observationId: string
  ticker: string
  displayTicker: string
  metric: MetricName
  metricLabel: string
  valueLabel: string
  period: string
  periodType: MetricObservation['periodType']
  guidanceAsOfPeriod?: string
  publishedAt: string
  publishedLabel: string
  retrievedAt: string
  sourceId: string
  sourceName: string
  sourceTier: Source['tier']
  documentUrl: string
}

interface ContributionSummary {
  ticker: HyperscalerTicker | 'TSM'
  displayTicker: string
  role: 'DEMAND' | 'SUPPLY CONFIRMATION'
  title: string
  status: CompanyCapexAvailability
  period: string
  evidenceCount: number
  evidenceCountLabel: string
}

interface TechnicalSignalDetails {
  id: string
  generatedAt: string
  contributingSignalIds: string[]
  evidenceCount: number
  sourceCount: number
}

export interface RealIntelligenceViewModel {
  crossCompanySignal: HyperscalerTsmConfirmation
  demandSummary: {
    title: 'AI Infrastructure Demand'
    direction: HyperscalerTsmConfirmation['direction']
    confirmation: HyperscalerTsmConfirmation['alignment']
    confidence: HyperscalerTsmConfirmation['confidence']
    companiesConfirmingDemandLabel: string
    supplyConfirmation: 'TSMC' | 'UNAVAILABLE'
    explanation: string
  }
  crossSummary: {
    demandSide: string
    supplySide: string
    result: string
    confidence: HyperscalerTsmConfirmation['confidence']
  }
  contributions: ContributionSummary[]
  crossValidation: {
    alignment: HyperscalerTsmConfirmation['alignment']
    confidence: HyperscalerTsmConfirmation['confidence']
    evidenceCount: number
  }
  hyperscaler: {
    direction: HyperscalerCapexTrend['direction']
    confidence: HyperscalerCapexTrend['confidence']
    coverageLabel: string
    positiveBreadthLabel: string
    companies: Array<{
      ticker: HyperscalerTicker
      status: CompanyCapexAvailability
      asOfPeriod: string
      primarySignalId?: string
      evidenceCount: number
    }>
    evidenceCount: number
  }
  tsmTrend: {
    direction: Trend3M['direction']
    period: string
    previousAverageLabel: string
    currentAverageLabel: string
    changeLabel: string
  }
  tsmOutlook: {
    status: 'FORWARD GUIDANCE'
    baselinePeriod: string
    outlookPeriod: string
    previousQuarterActualLabel: string
    guidanceRangeLabel: string
    guidanceMidpointLabel: string
    impliedSequentialGrowthLabel: string
  }
  freshness: {
    latestPublishedAt: string
    latestPublishedLabel: string
    latestRetrievedAt: string
  }
  evidenceGroups: Array<{
    ticker: HyperscalerTicker | 'TSM'
    displayTicker: string
    observations: RealIntelligenceEvidence[]
  }>
  technical: {
    aggregate: TechnicalSignalDetails
    cross: TechnicalSignalDetails
    observations: RealIntelligenceEvidence[]
  }
  sources: Source[]
}

interface Inputs {
  crossCompanySignal?: HyperscalerTsmConfirmation | null
  hyperscalerCapexTrend?: HyperscalerCapexTrend | null
  tsmOutlookSignal?: DerivedSignal
  tsmTrend: Trend3M | null
  tsmObservations: MetricObservation[]
  evidenceObservations: MetricObservation[]
  sources: Source[]
}

function signed(value: number, decimals: number, suffix: string): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}${suffix}`
}

function displayTicker(ticker: string): string {
  return ticker === 'TSM' ? 'TSMC' : ticker
}

function formatPublishedDate(value: string): string | null {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function formatObservationValue(observation: MetricObservation): string {
  const prefix = observation.approximate ? '~' : ''
  if (observation.unit === 'USD billion' || observation.unit === 'USD billions') {
    const value = observation.companyTicker === 'TSM'
      ? observation.value.toFixed(1)
      : observation.value.toFixed(3).replace(/\.0+$|(\.\d*?)0+$/, '$1')
    return `${prefix}$${value}B`
  }
  if (observation.unit === 'percent') return `${prefix}${observation.value.toFixed(2)}%`
  return `${prefix}${observation.value.toLocaleString('en-US')} ${observation.unit}`
}

function latestIso(values: string[]): string | null {
  const valid = values.filter((value) => !Number.isNaN(Date.parse(value))).sort()
  return valid.at(-1) ?? null
}

export function createRealIntelligenceViewModel(inputs: Inputs): RealIntelligenceViewModel | null {
  const { crossCompanySignal, hyperscalerCapexTrend, tsmOutlookSignal, tsmTrend } = inputs
  if (!crossCompanySignal || !hyperscalerCapexTrend || !tsmOutlookSignal || !tsmTrend) return null

  const tsmEvidence = inputs.tsmObservations.filter((observation) =>
    tsmOutlookSignal.evidenceObservationIds.includes(observation.id)
  )
  const actualRevenue = tsmEvidence.find((observation) => observation.metric === 'QUARTERLY_REVENUE')
  const guidanceLow = tsmEvidence.find((observation) => observation.metric === 'REVENUE_GUIDANCE_LOW')
  const guidanceHigh = tsmEvidence.find((observation) => observation.metric === 'REVENUE_GUIDANCE_HIGH')
  if (!actualRevenue || !guidanceLow || !guidanceHigh) return null
  if (
    guidanceLow.period !== guidanceHigh.period ||
    guidanceLow.period !== tsmOutlookSignal.period ||
    guidanceLow.unit !== 'USD billion' ||
    guidanceHigh.unit !== guidanceLow.unit ||
    actualRevenue.unit !== guidanceLow.unit
  ) return null

  const evidenceById = new Map<string, MetricObservation>()
  for (const observation of inputs.evidenceObservations) {
    if (evidenceById.has(observation.id)) return null
    evidenceById.set(observation.id, observation)
  }

  const sourcesById = new Map(inputs.sources.map((source) => [source.id, source]))
  const evidence = crossCompanySignal.evidenceObservationIds.flatMap((observationId) => {
    const observation = evidenceById.get(observationId)
    if (!observation) return []
    const source = sourcesById.get(observation.sourceId)
    const publishedLabel = formatPublishedDate(observation.publishedAt)
    if (!source || source.tier !== 'TIER_1_OFFICIAL' || !publishedLabel) return []
    return [{
      observationId,
      ticker: observation.companyTicker,
      displayTicker: displayTicker(observation.companyTicker),
      metric: observation.metric,
      metricLabel: METRIC_LABELS[observation.metric],
      valueLabel: formatObservationValue(observation),
      period: observation.period,
      periodType: observation.periodType,
      guidanceAsOfPeriod: observation.guidanceAsOfPeriod,
      publishedAt: observation.publishedAt,
      publishedLabel,
      retrievedAt: observation.retrievedAt,
      sourceId: source.id,
      sourceName: source.name,
      sourceTier: source.tier,
      documentUrl: observation.sourceUrl,
    }]
  })
  if (evidence.length !== crossCompanySignal.evidenceObservationIds.length) return null

  const latestPublishedAt = latestIso(evidence.map((item) => item.publishedAt))
  const latestRetrievedAt = latestIso(evidence.map((item) => item.retrievedAt))
  if (!latestPublishedAt || !latestRetrievedAt) return null
  const latestPublishedLabel = formatPublishedDate(latestPublishedAt)
  if (!latestPublishedLabel) return null

  const participation = new Map(
    hyperscalerCapexTrend.participatingCompanies.map((company) => [company.companyTicker, company])
  )
  const universe: HyperscalerTicker[] = ['META', 'MSFT', 'GOOG', 'AMZN']
  const companies = universe.map((ticker) => {
    const company = participation.get(ticker)
    const status: CompanyCapexAvailability = company?.direction ?? 'UNAVAILABLE'
    return {
      ticker,
      status,
      asOfPeriod: company?.asOfPeriod ?? 'UNAVAILABLE',
      primarySignalId: company?.primarySignalId,
      evidenceCount: evidence.filter((item) => item.ticker === ticker).length,
    }
  })

  const confirmingCompanies = companies
    .filter((company) => company.status === 'POSITIVE')
    .map((company) => company.ticker)
  const tsmStatus: CompanyCapexAvailability = crossCompanySignal.supplyInput.direction
  const contributions: ContributionSummary[] = [
    ...companies.map((company) => ({
      ticker: company.ticker,
      displayTicker: displayTicker(company.ticker),
      role: 'DEMAND' as const,
      title: CONTRIBUTION_TITLES[company.ticker],
      status: company.status,
      period: company.asOfPeriod,
      evidenceCount: company.evidenceCount,
      evidenceCountLabel: `${company.evidenceCount} facts`,
    })),
    {
      ticker: 'TSM',
      displayTicker: 'TSMC',
      role: 'SUPPLY CONFIRMATION',
      title: CONTRIBUTION_TITLES.TSM,
      status: tsmStatus,
      period: `${crossCompanySignal.supplyInput.historicalPeriod} / ${crossCompanySignal.supplyInput.forwardPeriod}`,
      evidenceCount: evidence.filter((item) => item.ticker === 'TSM').length,
      evidenceCountLabel: `${evidence.filter((item) => item.ticker === 'TSM').length} facts`,
    },
  ]

  const evidenceGroupOrder: Array<HyperscalerTicker | 'TSM'> = [...universe, 'TSM']
  const evidenceGroups = evidenceGroupOrder.map((ticker) => ({
    ticker,
    displayTicker: displayTicker(ticker),
    observations: evidence
      .filter((item) => item.ticker === ticker)
      .sort((left, right) =>
        left.period.localeCompare(right.period) || left.metric.localeCompare(right.metric)
      ),
  }))
  if (evidenceGroups.some((group) => group.observations.length === 0)) return null

  const aggregateEvidenceIds = new Set(hyperscalerCapexTrend.evidenceObservationIds)
  const aggregateEvidence = evidence.filter((item) => aggregateEvidenceIds.has(item.observationId))
  if (aggregateEvidence.length !== aggregateEvidenceIds.size) return null
  const aggregateSourceCount = new Set(aggregateEvidence.map((item) => item.sourceId)).size
  const sourceIds = new Set(evidence.map((item) => item.sourceId))

  return {
    crossCompanySignal,
    demandSummary: {
      title: 'AI Infrastructure Demand',
      direction: crossCompanySignal.direction,
      confirmation: crossCompanySignal.alignment,
      confidence: crossCompanySignal.confidence,
      companiesConfirmingDemandLabel: confirmingCompanies.length > 0
        ? confirmingCompanies.join(', ')
        : 'UNAVAILABLE',
      supplyConfirmation: tsmStatus === 'POSITIVE' ? 'TSMC' : 'UNAVAILABLE',
      explanation: crossCompanySignal.description,
    },
    crossSummary: {
      demandSide: `${confirmingCompanies.length} hyperscalers (${confirmingCompanies.join(', ')}) show positive issuer-level infrastructure investment signals.`,
      supplySide: 'TSMC historical revenue momentum and forward revenue outlook confirm semiconductor demand.',
      result: `Cross-company demand confirmation is ${crossCompanySignal.direction.toLowerCase()}.`,
      confidence: crossCompanySignal.confidence,
    },
    contributions,
    crossValidation: {
      alignment: crossCompanySignal.alignment,
      confidence: crossCompanySignal.confidence,
      evidenceCount: crossCompanySignal.evidenceObservationIds.length,
    },
    hyperscaler: {
      direction: hyperscalerCapexTrend.direction,
      confidence: hyperscalerCapexTrend.confidence,
      coverageLabel: `${hyperscalerCapexTrend.eligibleCount} / ${hyperscalerCapexTrend.totalUniverseCount}`,
      positiveBreadthLabel: `${hyperscalerCapexTrend.positiveCount} / ${hyperscalerCapexTrend.eligibleCount}`,
      companies,
      evidenceCount: hyperscalerCapexTrend.evidenceObservationIds.length,
    },
    tsmTrend: {
      direction: tsmTrend.direction,
      period: tsmTrend.currentPeriod.period,
      previousAverageLabel: `${tsmTrend.previousPeriod.avgYoY.toFixed(2)}%`,
      currentAverageLabel: `${tsmTrend.currentPeriod.avgYoY.toFixed(2)}%`,
      changeLabel: signed(tsmTrend.magnitude, 2, 'pp'),
    },
    tsmOutlook: {
      status: 'FORWARD GUIDANCE',
      baselinePeriod: actualRevenue.period,
      outlookPeriod: guidanceLow.period,
      previousQuarterActualLabel: `$${actualRevenue.value.toFixed(1)}B`,
      guidanceRangeLabel: `$${guidanceLow.value.toFixed(1)}B–$${guidanceHigh.value.toFixed(1)}B`,
      guidanceMidpointLabel: `$${((guidanceLow.value + guidanceHigh.value) / 2).toFixed(1)}B`,
      impliedSequentialGrowthLabel: `${signed(tsmOutlookSignal.magnitude, 2, '%')} QoQ`,
    },
    freshness: { latestPublishedAt, latestPublishedLabel, latestRetrievedAt },
    evidenceGroups,
    technical: {
      aggregate: {
        id: hyperscalerCapexTrend.id,
        generatedAt: hyperscalerCapexTrend.generatedAt,
        contributingSignalIds: [...hyperscalerCapexTrend.underlyingCompanySignalIds],
        evidenceCount: hyperscalerCapexTrend.evidenceObservationIds.length,
        sourceCount: aggregateSourceCount,
      },
      cross: {
        id: crossCompanySignal.id,
        generatedAt: crossCompanySignal.generatedAt,
        contributingSignalIds: [...crossCompanySignal.underlyingSignalIds],
        evidenceCount: crossCompanySignal.evidenceObservationIds.length,
        sourceCount: sourceIds.size,
      },
      observations: evidenceGroups.flatMap((group) => group.observations),
    },
    sources: inputs.sources.filter((source) => sourceIds.has(source.id)),
  }
}
