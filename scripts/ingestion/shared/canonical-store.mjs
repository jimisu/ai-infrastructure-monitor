import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { sha256 } from './snapshot-store.mjs'

export const CANONICAL_IDENTITY_FIELDS = Object.freeze([
  'issuer', 'companyTicker', 'metric', 'capexDefinitionId', 'period', 'periodType',
  'semanticRole', 'guidanceAsOfPeriod', 'guidanceShape', 'unit', 'sourceId',
])

function valueAt(candidate, field) {
  return candidate[field] ?? null
}

export function canonicalIdentity(candidate, fields = CANONICAL_IDENTITY_FIELDS) {
  return fields.map((field) => [field, valueAt(candidate, field)])
}

export function canonicalLogicalFactKey(candidate, fields = CANONICAL_IDENTITY_FIELDS) {
  return canonicalIdentity(candidate, fields).map(([field, value]) => `${field}=${value ?? ''}`).join('|')
}

export function canonicalObservationId(candidate, fields = CANONICAL_IDENTITY_FIELDS) {
  return `metric-observation:v2:sha256:${sha256(JSON.stringify([canonicalIdentity(candidate, fields), ['value', candidate.value]]))}`
}

function sourceVersion(candidate) {
  return candidate.sourceDocumentVersionId ?? candidate.snapshotId
}

function cloneRecord(record) {
  return { ...record, observation: { ...record.observation } }
}

function normalizedRecordId(record) {
  return record.recordId ?? `canonical-record:sha256:${sha256(`${record.observation.id}|${record.sourceDocumentVersionId ?? record.snapshotId}|${record.snapshotId}`)}`
}

export function buildCanonicalPromotion({
  existingDocument,
  candidates,
  snapshotIds,
  pipelineId,
  issuer,
  sourceId,
  logicalFactKey = canonicalLogicalFactKey,
  observationId = canonicalObservationId,
  toObservation,
  envelope = {},
}) {
  const records = (existingDocument?.records ?? []).map(cloneRecord)
  let created = 0
  let revisions = 0
  let transitions = 0

  for (const candidate of candidates) {
    const key = logicalFactKey(candidate)
    const id = observationId(candidate)
    const version = sourceVersion(candidate)
    const recordId = `canonical-record:sha256:${sha256(`${id}|${version}|${candidate.snapshotId}`)}`
    if (records.some((record) => normalizedRecordId(record) === recordId)) continue

    const active = records.find((record) => record.logicalFactKey === key && record.status === 'ACTIVE')
    if (active) {
      active.status = 'SUPERSEDED'
      transitions++
      if (active.observation.id !== id || active.observation.value !== candidate.value) revisions++
    }
    const observation = toObservation(candidate, id)
    records.push({
      recordId,
      sourceDocumentVersionId: version,
      logicalFactKey: key,
      snapshotId: candidate.snapshotId,
      sourceLocator: candidate.sourceLocator,
      status: 'ACTIVE',
      supersedesRecordId: active ? normalizedRecordId(active) : null,
      supersedesObservationId: active?.observation.id ?? null,
      observation,
    })
    created++
  }

  records.sort((a, b) => a.observation.period.localeCompare(b.observation.period) || a.observation.metric.localeCompare(b.observation.metric) || String(a.sourceDocumentVersionId ?? a.snapshotId).localeCompare(String(b.sourceDocumentVersionId ?? b.snapshotId)))
  return {
    document: {
      schemaVersion: 2,
      pipelineId,
      issuer,
      sourceId,
      latestSnapshotIds: [...new Set(snapshotIds)],
      ...envelope,
      records,
    },
    created,
    revisions,
    transitions,
  }
}

export async function promoteCanonicalAtomically(options) {
  let existingDocument = null
  try { existingDocument = JSON.parse(await readFile(options.canonicalPath, 'utf8')) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  const result = buildCanonicalPromotion({ ...options, existingDocument })
  await mkdir(path.dirname(options.canonicalPath), { recursive: true })
  const temporaryPath = `${options.canonicalPath}.tmp-${process.pid}`
  await writeFile(temporaryPath, `${JSON.stringify(result.document, null, 2)}\n`)
  await rename(temporaryPath, options.canonicalPath)
  return result
}
