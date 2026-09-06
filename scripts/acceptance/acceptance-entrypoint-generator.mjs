#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

if (process.argv.length !== 4) {
  process.stderr.write('usage: acceptance-entrypoint-generator <json-ir> <generated-test-output>\n')
  process.exit(2)
}

const irPath = process.argv[2]
const generatedOutput = process.argv[3]

try {
  await generate(irPath, generatedOutput)
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`)
  process.exit(1)
}

async function generate(irPath, generatedOutput) {
  const ir = JSON.parse(await readFile(irPath, 'utf8'))
  if (!ir?.name || !Array.isArray(ir.scenarios)) throw new Error(`invalid JSON IR: ${irPath}`)
  const stem = path.basename(irPath, path.extname(irPath))
  const featurePath = process.env.APS_FEATURE_PATH ?? path.posix.join('features', `${stem}.feature`)
  const generatedDir = generatedOutput
  const testFileName = `${stem}_acceptance_test.mjs`
  const testContent = `import test from 'node:test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const irPath = process.env.APS_IR_PATH ?? ${JSON.stringify(path.posix.join('tmp/acceptance-ir', `${stem}.json`))}
const { runGeneratedFeature } = await import(pathToFileURL(path.resolve('acceptance/runtime.mjs')).href)
await runGeneratedFeature(irPath, test)
`
  await mkdir(path.join(generatedDir, 'metadata'), { recursive: true })
  const testPath = path.join(generatedDir, testFileName)
  await writeFile(testPath, testContent)
  const generatedFiles = [toPosix(path.join(generatedDir, testFileName))]
  const implementationHash = hashGeneratedFiles([{ relative: generatedFiles[0], content: testContent }])
  const metadataName = metadataFileName(featurePath)
  const metadata = {
    schema_version: 1,
    feature_path: featurePath,
    ir_path: toPosix(irPath),
    implementation_hash: implementationHash,
    hash_scope: 'generated_files',
    generated_files: generatedFiles,
  }
  await writeFile(path.join(generatedDir, 'metadata', metadataName), `${JSON.stringify(metadata, null, 2)}\n`)
}

function hashGeneratedFiles(files) {
  const hash = createHash('sha256')
  for (const file of [...files].sort((left, right) => left.relative.localeCompare(right.relative))) {
    hash.update(file.relative)
    hash.update('\n')
    hash.update(file.content)
    hash.update('\n')
  }
  return `sha256:${hash.digest('hex')}`
}

function metadataFileName(featurePath) {
  return `${featurePath.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.json`
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}
