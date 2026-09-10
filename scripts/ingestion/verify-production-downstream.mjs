import { build } from 'vite'
import { mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { canonicalRootResolver } from './canonical-root-resolver.mjs'

const proposed=process.argv.includes('--proposed'),rootIndex=process.argv.indexOf('--canonical-root'),rootValue=rootIndex>=0?process.argv[rootIndex+1]:null
if(rootIndex>=0&&!rootValue)throw new Error('--canonical-root requires a path')
const canonicalRoot=rootValue?path.resolve(rootValue):null
if(proposed&&!canonicalRoot)throw new Error('--proposed requires --canonical-root')
const temporary=await mkdtemp(path.join(os.tmpdir(),'production-downstream-')),entry=path.join(temporary,'entry.ts'),out=path.join(temporary,'build')
const modulePath=path.resolve(proposed?'src/ingestion/proposedStateIngestionVerification.ts':'src/ingestion/productionIngestionVerification.ts'),functionName=proposed?'verifyProposedIngestionState':'verifyProductionIngestion'
await writeFile(entry,`import { ${functionName} } from ${JSON.stringify(modulePath)}\nconsole.log(JSON.stringify(${functionName}(),null,2))\n`)
const plugins=canonicalRoot?[canonicalRootResolver(canonicalRoot)]:[]
await build({logLevel:'silent',plugins,build:{ssr:entry,outDir:out,emptyOutDir:true,rollupOptions:{output:{entryFileNames:'verify.mjs'}}}})
await import(pathToFileURL(path.join(out,'verify.mjs')).href)
