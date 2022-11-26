import { compose, Next } from '@/utils/compose'
import { describe, expect, it } from 'vitest'

type Next = () => Promise<never> | Promise<void>;

describe("utils", () => {
  it("compose: compose", async () => {
    /**
     * @description: 创建一个异步函数
     * @param {number} ms
     * @return {*}
     */
    function wait(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms || 1))
    }
    const arr: Array<Number> = []
    const stack = []

    stack.push(async (context: never, next: Next) => {
      arr.push(1)		//1
      await wait(1)
      await next()
      await wait(1)
      arr.push(6)		//6
    })

    stack.push(async (context: never, next: Next) => {
      arr.push(2) 	//2
      await wait(1)
      await next()
      await wait(1)
      arr.push(5)		//5
    })

    stack.push(async (context: never, next: Next) => {
      arr.push(3)		//3
      await wait(1)
      await next()
      await wait(1)
      arr.push(4)		//4
    })

    await compose(stack)({})
    // 最后输出数组是 [1,2,3,4,5,6]
    expect(arr).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6]))
  });
  it("compose: compose catch downstream errors", async () => {
    const arr: Array<number> = []
    const stack = []

    stack.push(async (ctx: never, next: Next) => {
      arr.push(1)
      try {
        arr.push(6)
        await next()
        arr.push(7)
      } catch (err) {
        arr.push(2)
      }
      arr.push(3)
    })

    stack.push(async (ctx: never, next: Next) => {
      arr.push(4)
      throw new Error()
    })

    await compose(stack)({})
    // 输出顺序 是 [ 1, 6, 4, 2, 3 ]
    expect(arr).toEqual([1, 6, 4, 2, 3])
  })
});