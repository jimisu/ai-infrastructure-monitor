import path from 'node:path'
import { ingestMetaAnnualGuidance } from './meta-guidance-lib.mjs'
const argument = (name) => { const index = process.argv.indexOf(name); return index === -1 ? undefined : process.argv[index + 1] }
try { const result = await ingestMetaAnnualGuidance({ outputRoot: argument('--output-root') ?? path.join(process.cwd(), 'data', 'ingestion'), retrievedAt: argument('--retrieved-at') ?? new Date().toISOString() }); process.stdout.write(`${JSON.stringify({ accessions: result.filings.map((item) => item.accessionNumber), candidateCount: result.candidates.length, created: result.created, revisions: result.revisions, canonicalPath: path.relative(process.cwd(), result.canonicalPath) }, null, 2)}\n`) }
catch (error) { process.stderr.write(`META guidance ingestion failed closed [${error.code ?? 'UNEXPECTED'}]: ${error.message}\n`); process.exitCode = 1 }
