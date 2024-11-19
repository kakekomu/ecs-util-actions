import * as core from '@actions/core'
import { parseArgs } from '../src/parse-args'

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let getInputMock: jest.SpiedFunction<typeof core.getInput>

describe('parseArgs', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  })

  it('parses inputs correctly', () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'env':
          return 'production'
        case 'json':
          return '{"key": "value"}'
        case 'regex':
          return '^[A-Za-z]+$'
        default:
          return ''
      }
    })

    const result = parseArgs()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Parsing inputs ...')
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      'Inputs: {"env":"production","json":{"key":"value"},"regex":"^[A-Za-z]+$"}'
    )
    expect(result).toEqual({
      env: 'production',
      json: { key: 'value' },
      regex: '^[A-Za-z]+$'
    })
  })
})
