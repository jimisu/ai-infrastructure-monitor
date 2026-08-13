import type { MetricObservation } from '../types/metric'
import type { Source } from '../types/source'
import { getSourceById } from '../data/sources'

/**
 * Validate a metric observation
 *
 * Ensures:
 * - Source exists
 * - Source URL is valid
 * - Published/retrieved dates are valid ISO 8601
 * - Numeric value is a valid number
 */

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateMetricObservation(
  observation: MetricObservation,
  source: Source | undefined
): ValidationResult {
  const errors: string[] = []

  // Validate source exists
  if (!source) {
    errors.push(`Source with ID "${observation.sourceId}" not found`)
  }

  // Validate source URL
  if (source && !isValidUrl(source.url)) {
    errors.push(`Invalid source URL: ${source.url}`)
  }

  // Validate publishedAt is ISO 8601
  if (!isValidISODate(observation.publishedAt)) {
    errors.push(`Invalid publishedAt date: ${observation.publishedAt}`)
  }

  // Validate retrievedAt is ISO 8601
  if (!isValidISODate(observation.retrievedAt)) {
    errors.push(`Invalid retrievedAt date: ${observation.retrievedAt}`)
  }

  // Validate numeric value
  if (typeof observation.value !== 'number' || !Number.isFinite(observation.value)) {
    errors.push(`Invalid numeric value: ${observation.value}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Simple URL validation
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Simple ISO 8601 date validation
 */
function isValidISODate(dateString: string): boolean {
  try {
    const date = new Date(dateString)
    return !Number.isNaN(date.getTime()) && dateString === date.toISOString()
  } catch {
    return false
  }
}

/**
 * Validate an array of metric observations
 */
export function validateMetricObservations(
  observations: MetricObservation[],
  sourceGetter: (id: string) => Source | undefined = getSourceById
): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>()

  for (const obs of observations) {
    const source = sourceGetter(obs.sourceId)
    const validation = validateMetricObservation(obs, source)
    results.set(obs.id, validation)
  }

  return results
}
