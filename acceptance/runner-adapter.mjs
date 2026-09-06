#!/usr/bin/env node
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import readline from 'node:readline'

const rl = readline.createInterface({ input: process.stdin })

for await (const line of rl) {
  if (line.trim() === '') continue
  let job
  try {
    job = JSON.parse(line)
  } catch (error) {
    writeResponse({
      id: '',
      outcome: 'infrastructure_error',
      output: '',
      error: `invalid job JSON: ${error instanceof Error ? error.message : error}`,
      duration: 0,
    })
    continue
  }
  const started = process.hrtime.bigint()
  try {
    const result = await runJob(job)
    writeResponse({
      id: job.id,
      outcome: result.outcome,
      output: result.output,
      error: result.error,
      duration: Number(process.hrtime.bigint() - started),
    })
  } catch (error) {
    writeResponse({
      id: job.id,
      outcome: 'infrastructure_error',
      output: '',
      error: error instanceof Error ? error.message : String(error),
      duration: Number(process.hrtime.bigint() - started),
    })
  }
}

function writeResponse(response) {
  process.stdout.write(`${JSON.stringify(response)}\n`)
}

function parseTimeout(value) {
  const text = String(value ?? '30s')
  const match = text.match(/^(\d+(?:\.\d+)?)(ms|s|m)?$/)
  if (!match) return 30_000
  const amount = Number(match[1])
  const unit = match[2] ?? 's'
  if (unit === 'ms') return amount
  if (unit === 'm') return amount * 60_000
  return amount * 1000
}

async function generatedTestFiles(generatedDir) {
  const names = await readdir(generatedDir)
  return names.filter((name) => name.endsWith('_acceptance_test.mjs')).map((name) => path.join(generatedDir, name))
}

async function runJob(job) {
  const tests = await generatedTestFiles(job.generated_dir)
  if (tests.length === 0) {
    return { outcome: 'infrastructure_error', output: '', error: `no generated tests in ${job.generated_dir}` }
  }
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['--test', ...tests], {
      cwd: process.cwd(),
      env: { ...process.env, APS_IR_PATH: job.feature_json },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let output = ''
    const timer = setTimeout(() => {
      child.kill('SIGTERM')
    }, parseTimeout(job.timeout))
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    child.on('error', (error) => {
      clearTimeout(timer)
      resolve({ outcome: 'infrastructure_error', output, error: error.message })
    })
    child.on('exit', (code, signal) => {
      clearTimeout(timer)
      if (signal) {
        resolve({ outcome: 'infrastructure_error', output, error: `runner exited with ${signal}` })
        return
      }
      if (code === 0) resolve({ outcome: 'test_success', output, error: '' })
      else resolve({ outcome: 'test_failure', output, error: '' })
    })
  })
}
