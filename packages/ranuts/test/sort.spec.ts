import bubble from '@/sort/bubble'
import select from '@/sort/select'
import insert from '@/sort/insert'
import shell from '@/sort/shell'
import randomArray from '@/sort/randomArray'
import { describe, expect, it } from 'vitest'

describe("sort", () => {
    it("bubble sort", () => {
        for (let i = 0; i < 10; i++) {
            const exampleArray = randomArray()
            const result = bubble(exampleArray)
            const rightResult = [...exampleArray].sort((a: number, b: number) => a - b)
            expect(result).toEqual(rightResult);
        }
    });
    it("select sort", () => {
        for (let i = 0; i < 10; i++) {
            const exampleArray = randomArray()
            const result = select(exampleArray)
            const rightResult = [...exampleArray].sort((a: number, b: number) => a - b)
            expect(result).toEqual(rightResult);
        }
    });
    it("insert sort", () => {
        for (let i = 0; i < 10; i++) {
            const exampleArray = randomArray()
            const result = insert(exampleArray)
            const rightResult = [...exampleArray].sort((a: number, b: number) => a - b)
            expect(result).toEqual(rightResult);
        }
    });
    it("shell sort", () => {
        for (let i = 0; i < 10; i++) {
            const exampleArray = randomArray()
            const result = shell(exampleArray)
            const rightResult = [...exampleArray].sort((a: number, b: number) => a - b)
            expect(result).toEqual(rightResult);
        }
    });
});