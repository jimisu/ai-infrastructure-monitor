import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

export async function loadPresentation(name) {
  const source = await readFile(new URL(`../src/presentation/${name}.ts`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
  })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}

export async function loadLastVerifiedComponent() {
  const source = await readFile(new URL('../src/components/LastVerified.tsx', import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2023,
      jsx: ts.JsxEmit.React,
    },
  })
  const dir = path.resolve('tmp/acceptance-modules')
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, 'LastVerified.mjs')
  await writeFile(file, `import React from 'react'\n${outputText}`)
  return import(pathToFileURL(file).href)
}
