import bubble from '@/sort/bubble'
import select from '@/sort/select'
import insert from '@/sort/insert'
import shell from '@/sort/shell'
import merge from '@/sort/merge'
import quick from '@/sort/quick'
import randomArray from '@/sort/randomArray'
import taskEnd from '@/functions/taskEnd'
import startTask from '@/functions/startTask'
import { describe, expect, it } from 'vitest'


const handing = (name: string, sort: Function, limit: number = 1) => {
    it(name, () => {
        const task = startTask()
        for (let i = 0; i < limit; i++) {
            const exampleArray = randomArray()
            const result = sort(exampleArray)
            const rightResult = [...exampleArray].sort((a: number, b: number) => a - b)
            expect(result).toEqual(rightResult);
        }
        const time = taskEnd(task)
        console.log(name,time);
    });
}

describe("sort", () => {
    handing("bubble sort", bubble)
    handing("select sort", select)
    handing("insert sort", insert)
    handing("shell sort", shell)
    handing("merge sort", merge)
    handing("quick sort", quick)
});