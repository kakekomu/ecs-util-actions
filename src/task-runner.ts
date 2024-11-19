import * as core from '@actions/core'
import { readFileSync } from 'fs'
import { Props, TaskDefinition } from './types'
import { parse } from 'dotenv'

export class TaskRunner {
  private taskDefinition: TaskDefinition | null = null
  constructor(private readonly inputs: Props) {
    core.debug(`Inputs: ${JSON.stringify(inputs)}`)
  }

  public run() {
    this.loadTaskDefinition()
    return this.rewriteTaskDefinition()
  }

  private loadTaskDefinition() {
    core.debug(
      `Loading task definition from ${this.inputs.task_definition_file}`
    )
    const filecontent = readFileSync(this.inputs.task_definition_file, 'utf8')
    this.taskDefinition = JSON.parse(filecontent)
    core.debug(`Task definition: ${JSON.stringify(this.taskDefinition)}`)
  }

  private getEnvObject() {
    core.debug(`Loading env file from ${this.inputs.env_file}`)
    return parse(readFileSync(this.inputs.env_file, 'utf8'))
  }

  private rewriteTaskDefinition() {
    if (this.isTaskDefinitionLoaded(this.taskDefinition)) {
      core.debug(`Rewriting task definition`)
      const env = this.getEnvObject()
      const targetContainer = this.taskDefinition.containerDefinitions.find(
        container => container.name === this.inputs.target_container
      )
      if (targetContainer) {
        core.debug(`Rewriting target container ${this.inputs.target_container}`)
        targetContainer.environment = Object.entries(env).map(
          ([key, value]) => ({ name: key, value })
        )
        targetContainer.image = this.inputs.image
      }
    }
    return this.taskDefinition
  }

  private isTaskDefinitionLoaded(
    value: TaskDefinition | null
  ): value is TaskDefinition {
    if (!value) {
      throw new Error('task definition is not loaded')
    }
    return true
  }
}
