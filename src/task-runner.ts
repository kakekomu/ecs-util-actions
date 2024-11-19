import { readFileSync } from 'fs'
import { Props, TaskDefinition } from './types'
import { parse } from 'dotenv'

export class TaskRunner {
  private taskDefinition: TaskDefinition | null = null
  constructor(private readonly inputs: Props) {}

  public run() {
    this.loadTaskDefinition()
    this.rewriteTaskDefinition()
  }

  private loadTaskDefinition() {
    const filecontent = readFileSync(this.inputs.task_definition_file, 'utf8')
    this.taskDefinition = JSON.parse(filecontent)
  }

  private getEnvObject() {
    return parse(readFileSync(this.inputs.env_file, 'utf8'))
  }

  private rewriteTaskDefinition() {
    if (this.isTaskDefinitionLoaded(this.taskDefinition)) {
      const env = this.getEnvObject()
      const targetContainer = this.taskDefinition.containerDefinitions.find(
        container => container.name === this.inputs.target_container
      )
      if (targetContainer) {
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
