import { TaskRunner } from '../src/task-runner'
import { Props, TaskDefinition } from '../src/types'
import { readFileSync } from 'fs'
import { parse } from 'dotenv'

jest.mock('fs')
jest.mock('dotenv')

describe('TaskRunner', () => {
  const mockReadFileSync = readFileSync as jest.MockedFunction<
    typeof readFileSync
  >
  const mockParse = parse as jest.MockedFunction<typeof parse>

  const mockTaskDefinition = {
    containerDefinitions: [
      {
        name: 'app',
        image: 'old-image',
        environment: []
      }
    ]
  }

  const mockEnv = {
    KEY1: 'value1',
    KEY2: 'value2'
  }

  const inputs: Props = {
    task_definition_file: 'task.json',
    env_file: 'env',
    target_container: 'app',
    image: 'new-image'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockReadFileSync.mockImplementation((filePath: any) => {
      if (filePath === inputs.task_definition_file) {
        return JSON.stringify(mockTaskDefinition)
      }
      if (filePath === inputs.env_file) {
        return 'KEY1=value1\nKEY2=value2'
      }
      return ''
    })
    mockParse.mockReturnValue(mockEnv)
  })

  it('should load and rewrite task definition', () => {
    const taskRunner = new TaskRunner(inputs)
    taskRunner.run()

    expect(mockReadFileSync).toHaveBeenCalledWith(
      inputs.task_definition_file,
      'utf8'
    )
    expect(mockReadFileSync).toHaveBeenCalledWith(inputs.env_file, 'utf8')
    expect(mockParse).toHaveBeenCalledWith('KEY1=value1\nKEY2=value2')

    const expectedTaskDefinition = {
      containerDefinitions: [
        {
          name: 'app',
          image: 'new-image',
          environment: [
            { name: 'KEY1', value: 'value1' },
            { name: 'KEY2', value: 'value2' }
          ]
        }
      ]
    }

    expect(taskRunner['taskDefinition']).toEqual(expectedTaskDefinition)
  })

  it('should throw an error if task definition is not loaded', () => {
    const taskRunner = new TaskRunner(inputs)
    taskRunner['taskDefinition'] = null

    expect(() => taskRunner['rewriteTaskDefinition']()).toThrow(
      'task definition is not loaded'
    )
  })
})
