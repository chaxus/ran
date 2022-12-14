import { describe, expect, it } from 'vitest'
import bubble from '../src/sort/bubble'
import select from '../src/sort/select'
import insert from '../src/sort/insert'
import shell from '../src/sort/shell'
import merge from '../src/sort/merge'
import quick from '../src/sort/quick'
import randomArray from '../src/sort/randomArray'
import taskEnd from '../src/utils/taskEnd'
import startTask from '../src/utils/startTask'

const handing = (name: string, sort: Function, limit: number = 1) => {
  it(name, () => {
    const taskId = startTask()
    for (let i = 0; i < limit; i++) {
      const exampleArray = randomArray()
      const result = sort(exampleArray)
      const rightResult = [...exampleArray].sort(
        (a: number, b: number) => a - b,
      )
      expect(result).toEqual(rightResult)
    }
    const time = taskEnd(taskId)
    console.log(name, time)
  })
}

describe('sort', () => {
  handing('bubble sort', bubble)
  handing('select sort', select)
  handing('insert sort', insert)
  handing('shell sort', shell)
  handing('merge sort', merge)
  handing('quick sort', quick)
})
