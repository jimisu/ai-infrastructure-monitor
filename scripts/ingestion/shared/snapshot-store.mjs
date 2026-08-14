import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fail } from './ingestion-error.mjs'

export function sha256(value) { return createHash('sha256').update(value).digest('hex') }
function timestamp(value) { const parsed = new Date(value); if (Number.isNaN(parsed.getTime())) fail('INVALID_TIMESTAMP', 'Invalid retrievedAt'); return parsed.toISOString() }
function extension(contentType) { return contentType.toLowerCase().includes('html') ? 'html' : 'bin' }
function stableJson(value) { if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']'; if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stableJson(value[key])).join(',') + '}'; return JSON.stringify(value) }

export async function persistRawSnapshot({ body, source, retrievedAt, status, contentType, outputRoot, acquisitionMode, requestedUrl, finalUrl, acquisitionChannel, fixturePath, fixtureId, evidenceUrl, provenance = {} }) {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body), contentHash = sha256(bytes)
  if (!['LIVE', 'FIXTURE'].includes(acquisitionMode)) fail('ACQUISITION_MODE', 'Snapshot must be explicitly LIVE or FIXTURE')
  if (acquisitionMode === 'LIVE' && (!requestedUrl || !finalUrl || !acquisitionChannel)) fail('LIVE_PROVENANCE', 'LIVE snapshot acquisition metadata is incomplete')
  if (acquisitionMode === 'FIXTURE' && (!fixturePath || !fixtureId)) fail('FIXTURE_PROVENANCE', 'FIXTURE snapshot identity is incomplete')
  const documentIdentity = provenance.accessionNumber ?? evidenceUrl ?? finalUrl ?? fixtureId
  const snapshotIdentity = { acquisitionMode, issuer: source.issuer, sourceId: source.id, documentIdentity, contentHash }
  const snapshotIdentityHash = sha256(stableJson(snapshotIdentity))
  const snapshotId = 'raw-snapshot:' + acquisitionMode.toLowerCase() + ':sha256:' + snapshotIdentityHash
  const rawRelativePath = path.posix.join('raw', source.issuer, contentHash + '.' + extension(contentType))
  const manifestRelativePath = path.posix.join('manifests', source.issuer, snapshotIdentityHash + '.json')
  const snapshot = { snapshotId, acquisitionMode, sourceId: source.id, issuer: source.issuer, requestedUrl: acquisitionMode === 'LIVE' ? requestedUrl : null, finalUrl: acquisitionMode === 'LIVE' ? finalUrl : null, evidenceUrl: evidenceUrl ?? finalUrl ?? null, acquisitionChannel: acquisitionMode === 'LIVE' ? acquisitionChannel : 'FIXTURE', fixture: acquisitionMode === 'FIXTURE' ? { fixtureId, fixturePath, contentHash } : null, retrievedAt: timestamp(retrievedAt), httpStatus: status, contentType, contentLength: bytes.byteLength, sha256: contentHash, rawContentPath: rawRelativePath, manifestPath: manifestRelativePath, provenance }
  const rawPath = path.join(outputRoot, rawRelativePath), manifestPath = path.join(outputRoot, manifestRelativePath)
  await mkdir(path.dirname(rawPath), { recursive: true }); await mkdir(path.dirname(manifestPath), { recursive: true })
  await writeFile(rawPath, bytes, { flag: 'wx' }).catch((error) => { if (error.code !== 'EEXIST') throw error })
  await writeFile(manifestPath, JSON.stringify(snapshot, null, 2) + '\n', { flag: 'wx' }).catch((error) => { if (error.code !== 'EEXIST') throw error })
  return { snapshot, body: bytes.toString('utf8') }
}
