import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

export const TSMC_MONTHLY_SOURCE = Object.freeze({
  id: 'tsmc-monthly-revenue',
  issuer: 'TSM',
  ticker: 'TSM',
  tier: 'TIER_1_OFFICIAL',
  url: 'https://investor.tsmc.com/english/monthly-revenue/2026',
  hostname: 'investor.tsmc.com',
  revenueUnit: 'NT$ millions',
  yoyUnit: 'percent',
})

const monthNumbers = new Map([
  ['jan', 1], ['feb', 2], ['mar', 3], ['apr', 4], ['may', 5], ['jun', 6],
  ['jul', 7], ['aug', 8], ['sept', 9], ['sep', 9], ['oct', 10], ['nov', 11], ['dec', 12],
])

export class IngestionError extends Error {
  constructor(code, message, details = {}) {
    super(message)
    this.name = 'IngestionError'
    this.code = code
    this.details = details
  }
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function isoTimestamp(value, field) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new IngestionError('INVALID_TIMESTAMP', `Invalid ${field}: ${value}`)
  }
  return parsed.toISOString()
}

function extensionFor(contentType) {
  return contentType.toLowerCase().includes('html') ? 'html' : 'bin'
}

export async function persistRawSnapshot({
  body,
  source = TSMC_MONTHLY_SOURCE,
  requestedUrl,
  finalUrl,
  retrievedAt,
  status,
  contentType,
  outputRoot,
  provenance,
}) {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body)
  const digest = sha256(bytes)
  const snapshotId = `raw-snapshot:sha256:${digest}`
  const extension = extensionFor(contentType)
  const rawRelativePath = path.posix.join('raw', source.issuer, `${digest}.${extension}`)
  const manifestRelativePath = path.posix.join(
    'manifests',
    source.issuer,
    `${digest}.json`
  )
  const rawPath = path.join(outputRoot, rawRelativePath)
  const manifestPath = path.join(outputRoot, manifestRelativePath)
  const snapshot = {
    snapshotId,
    sourceId: source.id,
    issuer: source.issuer,
    requestedUrl,
    finalUrl,
    retrievedAt: isoTimestamp(retrievedAt, 'retrievedAt'),
    httpStatus: status,
    contentType,
    contentLength: bytes.byteLength,
    sha256: digest,
    rawContentPath: rawRelativePath,
    ...(provenance ? { provenance } : {}),
  }

  await mkdir(path.dirname(rawPath), { recursive: true })
  await mkdir(path.dirname(manifestPath), { recursive: true })
  await writeFile(rawPath, bytes, { flag: 'wx' }).catch((error) => {
    if (error.code !== 'EEXIST') throw error
  })
  await writeFile(manifestPath, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: 'wx' })
    .catch((error) => {
      if (error.code !== 'EEXIST') throw error
    })

  return { snapshot, body: bytes.toString('utf8') }
}

export function assertExpectedSnapshot(snapshot, body, source = TSMC_MONTHLY_SOURCE) {
  if (snapshot.httpStatus !== 200) {
    throw new IngestionError('HTTP_STATUS', `Unexpected HTTP status ${snapshot.httpStatus}`)
  }
  if (!snapshot.contentType.toLowerCase().includes('text/html')) {
    throw new IngestionError('CONTENT_TYPE', `Unexpected content type ${snapshot.contentType}`)
  }

  let finalUrl
  try {
    finalUrl = new URL(snapshot.finalUrl)
  } catch {
    throw new IngestionError('FINAL_URL', 'Invalid final source URL')
  }
  if (finalUrl.hostname !== source.hostname) {
    throw new IngestionError('WRONG_HOST', `Unexpected official hostname ${finalUrl.hostname}`)
  }

  const lower = body.toLowerCase()
  const errorMarkers = [
    '<title>access denied',
    '<title>error',
    'page not found',
    'service unavailable',
    'captcha',
    'verify you are human',
  ]
  if (errorMarkers.some((marker) => lower.includes(marker))) {
    throw new IngestionError('ERROR_PAGE', 'Source returned an error or challenge page')
  }
  if (
    !lower.includes('taiwan semiconductor manufacturing company') ||
    !/20\d{2}\s+monthly revenue/i.test(body)
  ) {
    throw new IngestionError('WRONG_ISSUER', 'Expected TSMC monthly revenue document markers missing')
  }
}

export async function collectOfficialHttp({
  source = TSMC_MONTHLY_SOURCE,
  outputRoot,
  retrievedAt = new Date().toISOString(),
  fetchImpl = fetch,
}) {
  const response = await fetchImpl(source.url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; AIInfrastructureMonitor/0.1; +https://investor.tsmc.com/english)',
      'accept-language': 'en-US,en;q=0.9',
      accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  })
  const body = Buffer.from(await response.arrayBuffer())
  const persisted = await persistRawSnapshot({
    body,
    source,
    requestedUrl: source.url,
    finalUrl: response.url || source.url,
    retrievedAt,
    status: response.status,
    contentType: response.headers.get('content-type') ?? '',
    outputRoot,
  })
  assertExpectedSnapshot(persisted.snapshot, persisted.body, source)
  return persisted
}

export async function snapshotFromFixture({
  fixturePath,
  source = TSMC_MONTHLY_SOURCE,
  outputRoot,
  retrievedAt,
}) {
  const body = await readFile(fixturePath)
  const persisted = await persistRawSnapshot({
    body,
    source,
    requestedUrl: source.url,
    finalUrl: source.url,
    retrievedAt,
    status: 200,
    contentType: 'text/html; charset=utf-8',
    outputRoot,
  })
  assertExpectedSnapshot(persisted.snapshot, persisted.body, source)
  return persisted
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/&#37;/gi, '%')
}

function textContent(value) {
  return decodeHtml(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim()
}

function parseNumber(raw, field, locator) {
  const normalized = raw.replace(/,/g, '').trim()
  if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) {
    throw new IngestionError('MALFORMED_NUMBER', `Malformed ${field}: ${raw}`, { locator })
  }
  const value = Number(normalized)
  if (!Number.isFinite(value)) {
    throw new IngestionError('MALFORMED_NUMBER', `Non-finite ${field}: ${raw}`, { locator })
  }
  return value
}

function publicationForMonth(year, month) {
  const releaseYear = month === 12 ? year + 1 : year
  const releaseMonth = month === 12 ? 1 : month + 1
  return new Date(Date.UTC(releaseYear, releaseMonth - 1, 10, 9)).toISOString()
}

export function parseTsmcMonthlyRevenue(snapshot, html, source = TSMC_MONTHLY_SOURCE) {
  assertExpectedSnapshot(snapshot, html, source)

  const yearMatches = [...html.matchAll(/(?:<[^>]+>\s*)?(20\d{2})\s+Monthly Revenue/gi)]
  const years = [...new Set(yearMatches.map((match) => Number(match[1])))]
  if (years.length !== 1) {
    throw new IngestionError('REPORTING_YEAR', 'Expected exactly one monthly-revenue reporting year')
  }
  const year = years[0]

  const tables = [...html.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)]
    .map((match) => match[0])
    .filter((table) => {
      const text = textContent(table).toLowerCase()
      return text.includes('month') && text.includes('net revenue') && text.includes('yoy change')
    })
  if (tables.length !== 1) {
    throw new IngestionError(
      'TABLE_STRUCTURE',
      `Expected exactly one monthly revenue table, found ${tables.length}`
    )
  }
  if (!/in millions of new taiwan dollars/i.test(textContent(html))) {
    throw new IngestionError('UNIT_MARKER', 'Expected New Taiwan dollar millions unit marker')
  }

  const rows = [...tables[0].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
  const parsedRows = []
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const cells = [...rows[rowIndex][1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map((match) => textContent(match[1]))
    if (cells.length === 0) continue

    const monthToken = cells[0].replace(/\./g, '').trim().toLowerCase()
    const month = monthNumbers.get(monthToken)
    if (!month) continue

    const locator = {
      table: `${year} Monthly Revenue`,
      row: rowIndex + 1,
      monthLabel: cells[0],
    }
    const revenueRaw = cells[1]?.trim() ?? ''
    const yoyRaw = cells[2]?.trim() ?? ''
    if (!revenueRaw && !yoyRaw) continue
    if (!revenueRaw) {
      throw new IngestionError('MISSING_REVENUE', `Missing revenue for ${cells[0]}`, { locator })
    }
    if (!yoyRaw) {
      throw new IngestionError('MISSING_YOY', `Missing YoY for ${cells[0]}`, { locator })
    }
    if (!yoyRaw.endsWith('%')) {
      throw new IngestionError('MALFORMED_YOY', `Malformed YoY for ${cells[0]}: ${yoyRaw}`, { locator })
    }

    parsedRows.push({
      month,
      revenue: parseNumber(revenueRaw, 'monthly revenue', locator),
      yoy: parseNumber(yoyRaw.slice(0, -1), 'reported YoY', locator),
      locator,
    })
  }

  if (parsedRows.length === 0) {
    throw new IngestionError('NO_DATA', 'No completed monthly rows found')
  }
  const seenMonths = new Set()
  for (let index = 0; index < parsedRows.length; index++) {
    const row = parsedRows[index]
    if (seenMonths.has(row.month)) {
      throw new IngestionError('DUPLICATE_MONTH', `Duplicate month ${row.month}`)
    }
    seenMonths.add(row.month)
    if (row.month !== index + 1) {
      throw new IngestionError('MISSING_MONTH', 'Completed monthly rows are not chronological and consecutive')
    }
  }

  return parsedRows.flatMap((row) => {
    const period = `${year}-${String(row.month).padStart(2, '0')}`
    const common = {
      issuer: source.issuer,
      companyTicker: source.ticker,
      period,
      periodType: 'MONTH',
      sourceId: source.id,
      sourceUrl: snapshot.finalUrl,
      publishedAt: publicationForMonth(year, row.month),
      retrievedAt: snapshot.retrievedAt,
      snapshotId: snapshot.snapshotId,
    }
    return [
      {
        ...common,
        candidateType: 'NUMERIC_METRIC',
        metric: 'MONTHLY_REVENUE',
        value: row.revenue,
        unit: source.revenueUnit,
        sourceLocator: { ...row.locator, column: 'Net Revenue' },
        originalText: `${row.locator.monthLabel} | ${row.revenue}`,
      },
      {
        ...common,
        candidateType: 'NUMERIC_METRIC',
        metric: 'MONTHLY_REVENUE_YOY_PERCENT',
        value: row.yoy,
        unit: source.yoyUnit,
        sourceLocator: { ...row.locator, column: 'YoY Change' },
        originalText: `${row.locator.monthLabel} | ${row.yoy}%`,
      },
    ]
  })
}

export function logicalFactKey(candidate) {
  return [
    candidate.companyTicker,
    candidate.metric,
    candidate.periodType,
    candidate.period,
    candidate.unit,
    candidate.sourceId,
  ].join('|')
}

export function immutableObservationId(candidate) {
  const identity = [
    logicalFactKey(candidate),
    String(candidate.value),
  ].join('|')
  return `metric-observation:sha256:${sha256(identity)}`
}

export function validateTsmcCandidates(candidates, snapshot, source = TSMC_MONTHLY_SOURCE) {
  const errors = []
  if (source.id !== 'tsmc-monthly-revenue' || source.tier !== 'TIER_1_OFFICIAL') {
    errors.push('Source is not the registered Tier-1 TSMC monthly source')
  }
  if (snapshot.sourceId !== source.id || snapshot.issuer !== source.issuer) {
    errors.push('Snapshot source attribution mismatch')
  }
  try {
    if (new URL(snapshot.finalUrl).hostname !== source.hostname) errors.push('Unexpected hostname')
  } catch {
    errors.push('Invalid final URL')
  }

  const seen = new Set()
  let previousPeriod = ''
  for (const candidate of candidates) {
    if (candidate.candidateType !== 'NUMERIC_METRIC') errors.push('Unexpected candidate type')
    if (candidate.issuer !== 'TSM' || candidate.companyTicker !== 'TSM') errors.push('Wrong issuer')
    if (!['MONTHLY_REVENUE', 'MONTHLY_REVENUE_YOY_PERCENT'].includes(candidate.metric)) {
      errors.push(`Unexpected metric ${candidate.metric}`)
    }
    const expectedUnit =
      candidate.metric === 'MONTHLY_REVENUE' ? source.revenueUnit : source.yoyUnit
    if (candidate.unit !== expectedUnit) errors.push(`Invalid unit for ${candidate.metric}`)
    if (!/^20\d{2}-(0[1-9]|1[0-2])$/.test(candidate.period)) errors.push('Invalid month')
    if (candidate.periodType !== 'MONTH') errors.push('Invalid period type')
    if (typeof candidate.value !== 'number' || !Number.isFinite(candidate.value)) {
      errors.push('Invalid numeric value')
    }
    if (
      candidate.sourceId !== source.id ||
      candidate.sourceUrl !== snapshot.finalUrl ||
      candidate.snapshotId !== snapshot.snapshotId
    ) errors.push('Invalid source attribution')
    try {
      isoTimestamp(candidate.publishedAt, 'publishedAt')
      isoTimestamp(candidate.retrievedAt, 'retrievedAt')
    } catch (error) {
      errors.push(error.message)
    }
    if (!candidate.sourceLocator?.table || !candidate.sourceLocator?.column) {
      errors.push('Missing source locator')
    }

    const key = logicalFactKey(candidate)
    if (seen.has(key)) errors.push(`Duplicate semantic observation ${key}`)
    seen.add(key)

    if (candidate.metric === 'MONTHLY_REVENUE') {
      if (previousPeriod && candidate.period <= previousPeriod) {
        errors.push('Monthly observations are not chronological')
      }
      previousPeriod = candidate.period
    }
  }

  const periods = new Map()
  for (const candidate of candidates) {
    const metrics = periods.get(candidate.period) ?? new Set()
    metrics.add(candidate.metric)
    periods.set(candidate.period, metrics)
  }
  for (const [period, metrics] of periods) {
    if (metrics.size !== 2) errors.push(`Incomplete month ${period}`)
  }

  if (errors.length > 0) {
    throw new IngestionError('VALIDATION_FAILED', 'Candidate validation failed', { errors })
  }
  return candidates
}

export function promoteCandidate(candidate) {
  return {
    logicalFactKey: logicalFactKey(candidate),
    snapshotId: candidate.snapshotId,
    sourceLocator: candidate.sourceLocator,
    status: 'ACTIVE',
    supersedesObservationId: null,
    observation: {
      id: immutableObservationId(candidate),
      companyTicker: candidate.companyTicker,
      metric: candidate.metric,
      value: candidate.value,
      unit: candidate.unit,
      period: candidate.period,
      periodType: candidate.periodType,
      publishedAt: candidate.publishedAt,
      retrievedAt: candidate.retrievedAt,
      sourceId: candidate.sourceId,
      sourceUrl: candidate.sourceUrl,
    },
  }
}

export function buildPromotion(existingDocument, candidates, snapshot) {
  const current = existingDocument?.records ?? []
  const records = current.map((record) => ({
    ...record,
    observation: { ...record.observation },
  }))
  let created = 0
  let revisions = 0

  for (const candidate of candidates) {
    const proposed = promoteCandidate(candidate)
    if (records.some((record) => record.observation.id === proposed.observation.id)) continue

    const active = records.find(
      (record) => record.logicalFactKey === proposed.logicalFactKey && record.status === 'ACTIVE'
    )
    if (active) {
      active.status = 'SUPERSEDED'
      proposed.supersedesObservationId = active.observation.id
      revisions++
    }
    records.push(proposed)
    created++
  }

  records.sort((a, b) =>
    a.observation.period.localeCompare(b.observation.period) ||
    a.observation.metric.localeCompare(b.observation.metric) ||
    a.observation.id.localeCompare(b.observation.id)
  )

  return {
    document: {
      schemaVersion: 1,
      issuer: 'TSM',
      sourceId: TSMC_MONTHLY_SOURCE.id,
      latestSnapshotId: snapshot.snapshotId,
      records,
    },
    created,
    revisions,
  }
}

export async function promoteAtomically({
  candidates,
  snapshot,
  canonicalPath,
}) {
  let existing = null
  try {
    existing = JSON.parse(await readFile(canonicalPath, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const result = buildPromotion(existing, candidates, snapshot)
  await mkdir(path.dirname(canonicalPath), { recursive: true })
  const temporaryPath = `${canonicalPath}.tmp-${process.pid}`
  await writeFile(temporaryPath, `${JSON.stringify(result.document, null, 2)}\n`)
  await rename(temporaryPath, canonicalPath)
  return result
}

export async function ingestTsmcMonthly({
  outputRoot,
  fixturePath,
  retrievedAt = new Date().toISOString(),
  source = TSMC_MONTHLY_SOURCE,
  fetchImpl,
}) {
  const persisted = fixturePath
    ? await snapshotFromFixture({ fixturePath, source, outputRoot, retrievedAt })
    : await collectOfficialHttp({ source, outputRoot, retrievedAt, fetchImpl })

  const candidates = parseTsmcMonthlyRevenue(persisted.snapshot, persisted.body, source)
  validateTsmcCandidates(candidates, persisted.snapshot, source)
  const canonicalPath = path.join(outputRoot, 'observations', 'tsm-monthly.json')
  const promotion = await promoteAtomically({
    candidates,
    snapshot: persisted.snapshot,
    canonicalPath,
  })
  return {
    snapshot: persisted.snapshot,
    candidateCount: candidates.length,
    canonicalPath,
    ...promotion,
  }
}
