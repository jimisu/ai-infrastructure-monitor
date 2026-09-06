import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export const decoyEvidence = [
  { publishedAt: '1999-12-31T23:59:59.000Z', retrievedAt: '2000-01-01T00:00:00.000Z' },
]

export function lastVerifiedMarkup(html) {
  const match = html.match(/<p class="last-verified"[^>]*>[\s\S]*?<\/p>/)
  if (!match) throw new Error('summary page does not contain a last-verified element')
  return match[0]
}

export function renderSummaryPage(Header, display) {
  return renderToStaticMarkup(createElement(Header, {
    asOf: decoyEvidence[0].publishedAt,
    status: 'ACCELERATING',
    explanation: 'fixture',
    lastVerified: display,
  }))
}

export function includesDecoyEvidenceDates(text) {
  return text.includes('1999-12-31') || text.includes('2000-01-01')
}
