import bubble from '@/sort/bubble'
import select from '@/sort/select'
import insert from '@/sort/insert'
import shell from '@/sort/shell'
import merge from '@/sort/merge'
import quick from '@/sort/quick'
import randomArray from '@/sort/randomArray'
import readDir from '@/functions/readDir'
import { describe, expect, it } from 'vitest'
import path, { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handing = (name: string, sort: Function) => {
    it(name, () => {
        console.time(name)
        for (let i = 0; i < 10; i++) {
            const exampleArray = randomArray()
            const result = sort(exampleArray)
            const rightResult = [...exampleArray].sort((a: number, b: number) => a - b)
            expect(result).toEqual(rightResult);
        }
        console.timeEnd(name)
    });
}
// const dirPath = resolve(__dirname, '../library/sort');



describe("sort", () => {
    // it('read-dir', async () => {
    // const param = {
    //     dirPath,
    //     ignores: ['randomArray.ts']
    // }
    // const sort = await readDir(param)
    // Object.keys(sort).forEach(key => {
    //     console.log('key--->', key, sort[key]);
    //     handing(`${key} sort`, sort[key])
    // })
    // });
    handing("bubble sort", bubble)
    handing("select sort", select)
    handing("insert sort", insert)
    handing("shell sort", shell)
    handing("merge sort", merge)
    handing("quick sort", quick)
});