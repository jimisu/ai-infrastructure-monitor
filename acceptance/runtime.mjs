import { readFile } from 'node:fs/promises'
import { dispatchStep } from './steps.mjs'

export function expandExecutions(ir) {
  return ir.scenarios.flatMap((scenario, scenarioIndex) => {
    const examples = scenario.examples.length > 0 ? scenario.examples : [{}]
    return examples.map((example, exampleIndex) => ({
      name: `${scenario.name}/example_${exampleIndex + 1}`,
      scenarioIndex,
      exampleIndex,
      example,
      steps: [...(ir.background ?? []), ...scenario.steps],
    }))
  })
}

async function runExecution(execution) {
  const world = {}
  for (const step of execution.steps) {
    await dispatchStep(step, execution.example, world)
  }
}

export async function runGeneratedFeature(irPath, test) {
  const ir = JSON.parse(await readFile(irPath, 'utf8'))
  for (const execution of expandExecutions(ir)) {
    test(execution.name, async () => {
      await runExecution(execution)
    })
  }
}
