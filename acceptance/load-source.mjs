import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const jsxOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2023,
  jsx: ts.JsxEmit.React,
}

async function acceptanceModuleDir() {
  const dir = path.resolve('tmp/acceptance-modules')
  await mkdir(dir, { recursive: true })
  return dir
}

export async function loadPresentation(name) {
  const source = await readFile(new URL(`../src/presentation/${name}.ts`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
  })
  const file = path.join(await acceptanceModuleDir(), `presentation-${name}.mjs`)
  await writeFile(file, outputText)
  return import(pathToFileURL(file).href)
}

async function transpileJsx(source) {
  return ts.transpileModule(source, { compilerOptions: jsxOptions }).outputText
}

export async function loadHeader() {
  const dir = await acceptanceModuleDir()
  const lastVerifiedSource = await readFile(new URL('../src/components/LastVerified.tsx', import.meta.url), 'utf8')
  await writeFile(
    path.join(dir, 'LastVerified.mjs'),
    `import React from 'react'\n${await transpileJsx(lastVerifiedSource)}`
  )
  const headerSource = (await readFile(new URL('../src/components/Header.tsx', import.meta.url), 'utf8'))
    .replaceAll('import.meta.env.BASE_URL', JSON.stringify('/ai-infrastructure-monitor/'))
  const headerJs = (await transpileJsx(headerSource)).replace("from './LastVerified'", "from './LastVerified.mjs'")
  const headerFile = path.join(dir, 'Header.mjs')
  await writeFile(headerFile, `import React from 'react'\n${headerJs}`)
  return import(pathToFileURL(headerFile).href)
}
