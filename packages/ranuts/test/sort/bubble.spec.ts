import bubble from '@/sort/bubble'
import randomArray from '@/sort/randomArray'
import { describe, expect, it } from 'vitest'

describe("bubble sort", () => {
    it("bubble sort", () => {
        for (let i = 0; i < 10; i++) {
            const exampleArray = randomArray()
            const rightResult = exampleArray.sort((a: number, b: number) => a - b)
            expect(bubble(exampleArray)).toBe(rightResult);
        }
    });
});