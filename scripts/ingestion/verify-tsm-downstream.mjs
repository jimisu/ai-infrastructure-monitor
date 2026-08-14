import { build } from 'vite'
import { mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'tsm-downstream-'))
const entry = path.join(temporaryDirectory, 'entry.ts')
const outputDirectory = path.join(temporaryDirectory, 'build')
const verificationModule = path.resolve('src/ingestion/tsmMonthlyIngestionVerification.ts')

await writeFile(
  entry,
  `import { verifyTsmMonthlyIngestionParity } from ${JSON.stringify(verificationModule)}\nconsole.log(JSON.stringify(verifyTsmMonthlyIngestionParity(), null, 2))\n`
)
await build({
  logLevel: 'silent',
  build: {
    ssr: entry,
    outDir: outputDirectory,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'verify.mjs' } },
  },
})
await import(pathToFileURL(path.join(outputDirectory, 'verify.mjs')).href)
