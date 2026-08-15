import assert from 'node:assert/strict'
import { cp, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { CANONICAL_OBSERVATION_FILES, resolveCanonicalImport } from '../../scripts/ingestion/canonical-root-resolver.mjs'

const root=()=>mkdtemp(path.join(os.tmpdir(),'canonical-resolver-test-'))
async function seed(){const directory=await root();for(const file of CANONICAL_OBSERVATION_FILES)await cp(path.join('data/ingestion/observations',file),path.join(directory,file));return directory}
function verifier(args=[]){return new Promise((resolve)=>{const child=spawn(process.execPath,['scripts/ingestion/verify-production-downstream.mjs',...args],{cwd:process.cwd(),stdio:'ignore'});child.on('exit',(code)=>resolve(code));child.on('error',()=>resolve(-1))})}

test('all five exact canonical imports resolve to complete absolute paths under system tmp',async()=>{const directory=await seed();for(const file of CANONICAL_OBSERVATION_FILES){const resolved=await resolveCanonicalImport('../../data/ingestion/observations/'+file,directory);assert.equal(resolved,path.join(directory,file));assert.ok(resolved.startsWith(os.tmpdir()+path.sep));assert.ok(!resolved.startsWith(path.join(process.cwd(),'tmp')+path.sep))}})
test('non-canonical modules are ignored and traversal-shaped canonical imports are rejected',async()=>{const directory=await seed();assert.equal(await resolveCanonicalImport('../../src/App.tsx',directory),null);await assert.rejects(()=>resolveCanonicalImport('../../data/ingestion/observations/../secret.json',directory),(error)=>error.code==='CANONICAL_IMPORT_REJECTED')})
test('missing canonical file fails closed deterministically',async()=>{const directory=await root();await assert.rejects(()=>resolveCanonicalImport('../../data/ingestion/observations/tsm-monthly.json',directory),(error)=>error.code==='CANONICAL_FILE_MISSING'&&error.message.includes(path.join(directory,'tsm-monthly.json')))})
test('canonical symlink escaping supplied root is rejected',async()=>{const directory=await root(),outside=path.join(await root(),'outside.json');await writeFile(outside,'{}');await symlink(outside,path.join(directory,'tsm-monthly.json'));await assert.rejects(()=>resolveCanonicalImport('../../data/ingestion/observations/tsm-monthly.json',directory),(error)=>error.code==='CANONICAL_PATH_TRAVERSAL')})
test('all five providers consume disposable files and baseline remains independent',async()=>{const directory=await seed();assert.equal(await verifier(),0);assert.equal(await verifier(['--proposed','--canonical-root',directory]),0);for(const file of CANONICAL_OBSERVATION_FILES){const target=path.join(directory,file),original=await readFile(target,'utf8'),document=JSON.parse(original);document.issuer='BROKEN';await writeFile(target,JSON.stringify(document));assert.notEqual(await verifier(['--proposed','--canonical-root',directory]),0,file+' was not read from disposable root');await writeFile(target,original)}assert.equal(await verifier(['--proposed','--canonical-root',directory]),0)})
