import { access, realpath } from 'node:fs/promises'
import path from 'node:path'

export const CANONICAL_OBSERVATION_FILES = Object.freeze([
  'tsm-monthly.json',
  'meta-annual-capex-guidance.json',
  'msft-management-total-capex.json',
  'goog-annual-capex-guidance.json',
  'amzn-ppe-purchases.json',
])
const allowed = new Set(CANONICAL_OBSERVATION_FILES)
const marker = 'data/ingestion/observations/'
function resolverError(code, message) { return Object.assign(new Error(message), { code }) }

export async function resolveCanonicalImport(source, canonicalRoot) {
  const normalized = source.replaceAll('\\', '/')
  const markerIndex = normalized.lastIndexOf(marker)
  if (markerIndex < 0) return null
  const relativeImport = normalized.slice(markerIndex + marker.length)
  if (!allowed.has(relativeImport)) throw resolverError('CANONICAL_IMPORT_REJECTED', `Canonical import is not allowed: ${relativeImport}`)
  const root = path.resolve(canonicalRoot), target = path.resolve(root, relativeImport), relative = path.relative(root, target)
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw resolverError('CANONICAL_PATH_TRAVERSAL', `Canonical import escapes supplied root: ${relativeImport}`)
  try { await access(target) } catch { throw resolverError('CANONICAL_FILE_MISSING', `Required disposable canonical file is missing: ${target}`) }
  const [realRoot, realTarget] = await Promise.all([realpath(root), realpath(target)]), realRelative = path.relative(realRoot, realTarget)
  if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) throw resolverError('CANONICAL_PATH_TRAVERSAL', `Canonical file resolves outside supplied root: ${relativeImport}`)
  return realTarget
}

export function canonicalRootResolver(canonicalRoot) {
  return { name: 'disposable-canonical-root', enforce: 'pre', resolveId(source) { return resolveCanonicalImport(source, canonicalRoot) } }
}
