const LEGAL_TOKEN_EQUIVALENTS = Object.freeze(new Map([
  ['CO', 'COMPANY'], ['COMPANY', 'COMPANY'],
  ['LTD', 'LIMITED'], ['LIMITED', 'LIMITED'],
  ['INC', 'INC'], ['INCORPORATED', 'INC'],
]))

export function normalizeSecRegistrantName(value) {
  return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim().split(/\s+/)
    .filter(Boolean).map((token) => LEGAL_TOKEN_EQUIVALENTS.get(token) ?? token).join(' ')
}

export function matchesSecIssuerIdentity(submissions, { cik, ticker, legalName }) {
  return String(submissions?.cik ?? '').padStart(10, '0') === cik
    && Array.isArray(submissions?.tickers) && submissions.tickers.includes(ticker)
    && normalizeSecRegistrantName(submissions?.name) === normalizeSecRegistrantName(legalName)
}
