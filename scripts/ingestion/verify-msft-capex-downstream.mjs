import { build } from 'vite'
import { mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const temporary=await mkdtemp(path.join(os.tmpdir(),'msft-capex-downstream-')),entry=path.join(temporary,'entry.ts'),out=path.join(temporary,'build'),modulePath=path.resolve('src/ingestion/msftCapexIngestionVerification.ts')
await writeFile(entry,`import { verifyMsftCapexIngestionParity } from ${JSON.stringify(modulePath)}\nconsole.log(JSON.stringify(verifyMsftCapexIngestionParity(),null,2))\n`)
await build({logLevel:'silent',build:{ssr:entry,outDir:out,emptyOutDir:true,rollupOptions:{output:{entryFileNames:'verify.mjs'}}}})
await import(pathToFileURL(path.join(out,'verify.mjs')).href)
