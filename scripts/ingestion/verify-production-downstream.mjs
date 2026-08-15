import { build } from 'vite'
import { mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const proposed=process.argv.includes('--proposed'),rootIndex=process.argv.indexOf('--canonical-root'),canonicalRoot=rootIndex>=0?path.resolve(process.argv[rootIndex+1]):null
if(proposed&&!canonicalRoot)throw new Error('--proposed requires --canonical-root')
const temporary=await mkdtemp(path.join(os.tmpdir(),'production-downstream-')),entry=path.join(temporary,'entry.ts'),out=path.join(temporary,'build')
const modulePath=path.resolve(proposed?'src/ingestion/proposedStateIngestionVerification.ts':'src/ingestion/productionIngestionVerification.ts'),functionName=proposed?'verifyProposedIngestionState':'verifyProductionIngestion'
await writeFile(entry,`import { ${functionName} } from ${JSON.stringify(modulePath)}\nconsole.log(JSON.stringify(${functionName}(),null,2))\n`)
const files=['tsm-monthly.json','meta-annual-capex-guidance.json','msft-management-total-capex.json','goog-annual-capex-guidance.json','amzn-ppe-purchases.json']
const alias=proposed?files.map((file)=>({find:new RegExp(`data/ingestion/observations/${file.replaceAll('.','\\.')}$`),replacement:path.join(canonicalRoot,file)})):[]
await build({logLevel:'silent',resolve:{alias},build:{ssr:entry,outDir:out,emptyOutDir:true,rollupOptions:{output:{entryFileNames:'verify.mjs'}}}})
await import(pathToFileURL(path.join(out,'verify.mjs')).href)
