import path from 'node:path'
import { ingestGoogAnnualGuidance } from './goog-guidance-lib.mjs'
const argument = (name) => { const index = process.argv.indexOf(name); return index === -1 ? undefined : process.argv[index + 1] }
try { const result = await ingestGoogAnnualGuidance({ outputRoot: argument('--output-root') ?? path.join(process.cwd(), 'data', 'ingestion'), retrievedAt: argument('--retrieved-at') ?? new Date().toISOString() }); process.stdout.write(`${JSON.stringify({ documents: result.disclosures.map((item) => item.accessionNumber ?? item.versionId), candidateCount: result.candidates.length, created: result.created, revisions: result.revisions, canonicalPath: path.relative(process.cwd(), result.canonicalPath) }, null, 2)}\n`) }
catch (error) { process.stderr.write(`GOOG guidance ingestion failed closed [${error.code ?? 'UNEXPECTED'}]: ${error.message}\n`); process.exitCode = 1 }
