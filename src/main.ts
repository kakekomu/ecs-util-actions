import * as core from '@actions/core'
import * as io from '@actions/io'
import { rmSync, writeFileSync } from 'fs'
import { parseArgs } from './parse-args'
import { TaskRunner } from './task-runner'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputs = parseArgs()
    const taskRunner = new TaskRunner(inputs)
    const rewrittenTaskDefinition = taskRunner.run()
    const toWriteJson = JSON.stringify(rewrittenTaskDefinition, null, 4)
    writeFileSync(inputs.task_definition_file, toWriteJson)
    await io.cp(inputs.task_definition_file, inputs.env_file, { recursive: true, force: true })
    rmSync(inputs.task_definition_file)
    core.debug(`Output: ${toWriteJson}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
