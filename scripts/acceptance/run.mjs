#!/usr/bin/env node
import { mkdir, readdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const features = (await readdir('features')).filter((name) => name.endsWith('.feature')).sort()
if (features.length === 0) {
  process.stderr.write('no feature files in features/\n')
  process.exit(1)
}

await mkdir('tmp/acceptance-ir', { recursive: true })
await mkdir('acceptance/generated', { recursive: true })

for (const feature of features) {
  const stem = feature.replace(/\.feature$/, '')
  const featurePath = path.posix.join('features', feature)
  const irPath = path.join('tmp/acceptance-ir', `${stem}.json`)
  run('gherkin-parser', [featurePath, irPath])
  run(process.execPath, ['scripts/acceptance/acceptance-entrypoint-generator.mjs', irPath, 'acceptance/generated'], {
    env: { ...process.env, APS_FEATURE_PATH: featurePath },
  })
}

const irFiles = (await readdir('tmp/acceptance-ir')).filter((name) => name.endsWith('.json')).sort()
if (irFiles.length !== 1) {
  process.stderr.write('normal acceptance currently runs one feature IR at a time via APS_IR_PATH\n')
  process.exit(1)
}

const generatedTests = (await readdir('acceptance/generated'))
  .filter((name) => name.endsWith('_acceptance_test.mjs'))
  .map((name) => path.join('acceptance/generated', name))
if (generatedTests.length === 0) {
  process.stderr.write('acceptance-entrypoint-generator wrote no test entry points\n')
  process.exit(1)
}

run(process.execPath, ['--test', ...generatedTests], {
  env: { ...process.env, APS_IR_PATH: path.join('tmp/acceptance-ir', irFiles[0]) },
})

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
