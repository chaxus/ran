import { describe, expect, it } from 'vitest';
import type { Next } from '../../src/utils/compose';
import { compose } from '../../src/utils/compose';

describe('utils', () => {
  it('compose: compose', async () => {
    /**
     * @description: 创建一个异步函数
     * @param {number} ms
     * @return {*}
     */
    function wait(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms || 1));
    }
    const arr: Array<number> = [];
    const stack = [];

    stack.push(async (_context: unknown, next: Next) => {
      arr.push(1); //1
      await wait(1);
      await next();
      await wait(1);
      arr.push(6); //6
    });

    stack.push(async (_context: unknown, next: Next) => {
      arr.push(2); //2
      await wait(1);
      await next();
      await wait(1);
      arr.push(5); //5
    });

    stack.push(async (_context: unknown, next: Next) => {
      arr.push(3); //3
      await wait(1);
      await next();
      await wait(1);
      arr.push(4); //4
    });

    await compose(stack)({});
    // 最后输出数组是 [1,2,3,4,5,6]
    expect(arr).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6]));
  });
  it('compose: compose catch downstream errors', async () => {
    const arr: Array<number> = [];
    const stack = [];

    stack.push(async (_ctx: unknown, next: Next) => {
      arr.push(1);
      try {
        arr.push(6);
        await next();
        arr.push(7);
      } catch (err) {
        console.log('err', err);
        arr.push(2);
      }
      arr.push(3);
    });

    stack.push(async (_ctx: unknown, _next: Next) => {
      arr.push(4);
      throw new Error();
    });

    await compose(stack)({});
    // 输出顺序 是 [ 1, 6, 4, 2, 3 ]
    expect(arr).toEqual([1, 6, 4, 2, 3]);
  });
});
