export type QueueTask<T = unknown> = () => Promise<T> | T;

export interface QuestQueueOptions {
  /** 最大并发数；`<= 0` 视为 1 */
  simultaneous?: number;
}

interface QueueEntry {
  task: QueueTask;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

/**
 * @description: 并发受限的异步任务队列。同时最多跑 `simultaneous` 个，其余排队，
 * 每完成一个就补位。用于批量上传、批量请求这类「不能一次全发出去」的场景。
 *
 * 队列**先进先出**，且 `add()` 返回该任务自己的 promise——单个任务失败只会 reject
 * 它自己的 promise，不会拖垮整条队列（此前的实现用 `pop()` 后进先出、单个 promise
 * 混装所有任务的结果，且 `add` 根本不会触发执行，必须手动调 `running`）。
 *
 * @example
 * ```ts
 * const queue = new QuestQueue({ simultaneous: 3 });
 * const results = await Promise.all(urls.map((url) => queue.add(() => fetch(url))));
 * // 或者等整条队列排空（含失败的）：
 * await queue.onIdle();
 * ```
 */
export class QuestQueue {
  /** 正在执行的任务数 */
  running = 0;
  /** 已完成（含失败）的任务数 */
  executed = 0;
  /** 最大并发数 */
  simultaneous: number;

  private queue: QueueEntry[] = [];
  private idleWaiters: Array<() => void> = [];

  constructor({ simultaneous = 1 }: QuestQueueOptions = {}) {
    this.simultaneous = Math.max(1, simultaneous);
  }

  /** 等待执行的任务数 */
  get pending(): number {
    return this.queue.length;
  }

  /** 队列是否已排空（无排队、无在执行） */
  get idle(): boolean {
    return this.queue.length === 0 && this.running === 0;
  }

  /**
   * @description: 入队一个异步任务，返回它自己的结果 promise。有空位时立即开跑。
   * @param {QueueTask<T>} task 无参函数，返回 promise 或同步值
   * @return {Promise<T>}
   */
  add = <T = unknown>(task: QueueTask<T>): Promise<T> => {
    if (typeof task !== 'function') {
      return Promise.reject(new TypeError('QuestQueue.add expects a function'));
    }
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task: task as QueueTask, resolve: resolve as (v: unknown) => void, reject });
      this.next();
    });
  };

  /**
   * @description: 批量入队，语义与 `Promise.allSettled` 一致：等全部结束，
   * 逐个返回成功/失败，**顺序与入参一致**，不会因为一个失败就丢掉其余结果。
   * @param {QueueTask[]} tasks
   * @return {Promise<PromiseSettledResult<T>[]>}
   */
  allSettled = <T = unknown>(tasks: Array<QueueTask<T>>): Promise<Array<PromiseSettledResult<T>>> =>
    Promise.allSettled(tasks.map((task) => this.add(task)));

  /**
   * @description: 等队列排空。已经空了则立即 resolve。
   * @return {Promise<void>}
   */
  onIdle = (): Promise<void> => {
    if (this.idle) return Promise.resolve();
    return new Promise<void>((resolve) => this.idleWaiters.push(resolve));
  };

  /** @description: 丢弃所有尚未开始的任务（在执行的不受影响），它们的 promise 会 reject */
  clear = (): void => {
    const dropped = this.queue.splice(0, this.queue.length);
    for (const entry of dropped) entry.reject(new Error('QuestQueue cleared'));
    this.settleIdle();
  };

  /** 有空位就从队头取任务开跑；每个任务结束后再调一次，形成补位循环 */
  private next = (): void => {
    while (this.running < this.simultaneous && this.queue.length > 0) {
      const entry = this.queue.shift() as QueueEntry;
      this.running++;
      // 用 Promise.resolve 包一层：同步抛错的任务也能走进 catch，而不是把异常
      // 抛回 add() 的调用栈、让 running 永远减不回来、后续任务全部卡死。
      Promise.resolve()
        .then(entry.task)
        .then(entry.resolve, entry.reject)
        .finally(() => {
          this.running--;
          this.executed++;
          this.settleIdle();
          this.next();
        });
    }
  };

  private settleIdle = (): void => {
    if (!this.idle) return;
    const waiters = this.idleWaiters.splice(0, this.idleWaiters.length);
    for (const resolve of waiters) resolve();
  };
}
