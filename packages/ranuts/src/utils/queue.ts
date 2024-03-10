import type { Func } from '@/utils/memoize';
interface QuestQueueOptions {
  simultaneous: number;
  total: number;
}

type Fun = Function | Func;
export class QuestQueue {
  current: number;
  queue: Fun[];
  simultaneous: number; // 并发的请求
  executed: number;
  total: number;
  constructor({ simultaneous, total }: QuestQueueOptions) {
    this.current = 0; // 当前请求有几个
    this.queue = []; // 队列
    this.simultaneous = simultaneous; // 并发的请求数量
    this.executed = 0; // 执行了几个请求
    this.total = total; // 总共有几个请求
  }
  /**
   * @description: 传入异步函数，添加到队列并执行
   * @param {Fun} asynchronous
   * @return {*}
   */
  add = (asynchronous: Fun): void => {
    if (typeof asynchronous !== 'function') return;
    const task = () => {
      return new Promise((resolve, reject) => {
        this.current++;
        asynchronous()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.current--;
            this.running();
          });
      });
    };
    this.queue.push(task);
  };
  /**
   * @description: 执行异步函数
   * @param {*} Promise
   * @return {*}
   */
  running = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      if (this.current <= this.simultaneous && this.queue.length) {
        const task = this.queue.pop();
        if (task) {
          task()
            .then(resolve)
            .catch(reject)
            .finally(() => {
              this.executed++;
            });
        }
      } else {
        resolve({});
      }
    });
  };
  /**
   * @description: 并发执行所有的异步函数，并返回所有的结果
   * @param {*} Promise
   * @return {*}
   */
  allSettled = (): Promise<unknown> => {
    let index = 0;
    return new Promise((resolve, reject) => {
      const result: unknown[] = [];
      if (this.current < this.simultaneous && this.queue.length) {
        const task = this.queue.pop();
        index++;
        if (task) {
          task()
            .then((x: unknown) => {
              result[index] = x;
              resolve(x);
            })
            .catch((x: unknown) => {
              result[index] = x;
              reject(x);
            })
            .finally(() => {
              this.executed++;
            });
        }
      }
      if (this.executed >= this.total) {
        resolve(result);
      }
    });
  };
}
