import * as core from '@actions/core'
import { Props } from './types'

export const parseArgs = (): Props => {
  core.debug('Parsing inputs ...')
  const inputs: Props = {
    env_file: core.getInput('env_file'),
    task_definition_file: core.getInput('task_definition_file'),
    image: core.getInput('image'),
    target_container: core.getInput('target_container')
  }
  core.debug(`Inputs: ${JSON.stringify(inputs)}`)
  return inputs
}
