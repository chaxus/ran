export type QueueTask<T = unknown> = () => Promise<T> | T;

export interface QuestQueueOptions {
  /** Maximum concurrency; `<= 0` is treated as 1 */
  simultaneous?: number;
}

interface QueueEntry {
  task: QueueTask;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

/**
 * @description: An async task queue with limited concurrency. At most `simultaneous` tasks
 * run at once, the rest wait, and each completion pulls in the next. For batch uploads or
 * batch requests — anything that must not be fired all at once.
 *
 * The queue is **FIFO**, and `add()` returns that task's own promise, so one failing task
 * only rejects its own promise instead of taking the whole queue down. (The previous
 * implementation popped LIFO, packed every task's result into a single shared promise, and
 * `add` never started anything — `running` had to be called by hand.)
 *
 * @example
 * ```ts
 * const queue = new QuestQueue({ simultaneous: 3 });
 * const results = await Promise.all(urls.map((url) => queue.add(() => fetch(url))));
 * // or wait for the whole queue to drain (failures included):
 * await queue.onIdle();
 * ```
 */
export class QuestQueue {
  /** Number of tasks currently running */
  running = 0;
  /** Number of finished tasks (failures included) */
  executed = 0;
  /** Maximum concurrency */
  simultaneous: number;

  private queue: QueueEntry[] = [];
  private idleWaiters: Array<() => void> = [];

  constructor({ simultaneous = 1 }: QuestQueueOptions = {}) {
    this.simultaneous = Math.max(1, simultaneous);
  }

  /** Number of tasks waiting to run */
  get pending(): number {
    return this.queue.length;
  }

  /** Whether the queue has drained (nothing queued, nothing running) */
  get idle(): boolean {
    return this.queue.length === 0 && this.running === 0;
  }

  /**
   * @description: Enqueue an async task and get back its own result promise. Starts
   * immediately when a slot is free.
   * @param {QueueTask<T>} task nullary function returning a promise or a plain value
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
   * @description: Enqueue a batch with `Promise.allSettled` semantics: wait for all of them,
   * report each outcome individually **in input order**, and never drop the remaining results
   * because one failed.
   * @param {QueueTask[]} tasks
   * @return {Promise<PromiseSettledResult<T>[]>}
   */
  allSettled = <T = unknown>(tasks: Array<QueueTask<T>>): Promise<Array<PromiseSettledResult<T>>> =>
    Promise.allSettled(tasks.map((task) => this.add(task)));

  /**
   * @description: Wait for the queue to drain. Resolves immediately when already empty.
   * @return {Promise<void>}
   */
  onIdle = (): Promise<void> => {
    if (this.idle) return Promise.resolve();
    return new Promise<void>((resolve) => this.idleWaiters.push(resolve));
  };

  /** @description: Drop every task that has not started (running ones are untouched); their promises reject */
  clear = (): void => {
    const dropped = this.queue.splice(0, this.queue.length);
    for (const entry of dropped) entry.reject(new Error('QuestQueue cleared'));
    this.settleIdle();
  };

  /** Pull tasks off the head while slots are free; called again after each task to keep the loop going */
  private next = (): void => {
    while (this.running < this.simultaneous && this.queue.length > 0) {
      const entry = this.queue.shift() as QueueEntry;
      this.running++;
      // Wrapped in Promise.resolve so a task that throws synchronously still lands in the
      // catch, instead of throwing back into add()'s call stack, leaving `running` never
      // decremented and every later task stuck.
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
