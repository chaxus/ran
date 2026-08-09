import { describe, expect, it, vi } from 'vitest';
import { QuestQueue } from '@/utils';

const defer = <T>(): { promise: Promise<T>; resolve: (v: T) => void; reject: (e: unknown) => void } => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('QuestQueue', () => {
  it('starts a task as soon as it is added', async () => {
    // Regression: add() used to only enqueue — running() had to be called by hand to start anything
    const queue = new QuestQueue({ simultaneous: 2 });
    await expect(queue.add(async () => 'done')).resolves.toBe('done');
  });

  it('resolves each task with its own result', async () => {
    const queue = new QuestQueue({ simultaneous: 2 });
    const results = await Promise.all([queue.add(async () => 1), queue.add(async () => 2), queue.add(async () => 3)]);
    expect(results).toEqual([1, 2, 3]);
  });

  it('never exceeds the concurrency limit', async () => {
    const queue = new QuestQueue({ simultaneous: 2 });
    let inFlight = 0;
    let peak = 0;
    const task = async (): Promise<void> => {
      inFlight++;
      peak = Math.max(peak, inFlight);
      await Promise.resolve();
      inFlight--;
    };
    await Promise.all(Array.from({ length: 10 }, () => queue.add(task)));
    expect(peak).toBeLessThanOrEqual(2);
    expect(queue.executed).toBe(10);
  });

  it('runs tasks first-in-first-out', async () => {
    // Regression: the old implementation used queue.pop(), making it LIFO
    const queue = new QuestQueue({ simultaneous: 1 });
    const order: number[] = [];
    await Promise.all([1, 2, 3].map((n) => queue.add(async () => void order.push(n))));
    expect(order).toEqual([1, 2, 3]);
  });

  it('backfills a slot when a task finishes', async () => {
    const queue = new QuestQueue({ simultaneous: 1 });
    const first = defer<string>();
    const started: string[] = [];
    const a = queue.add(() => {
      started.push('a');
      return first.promise;
    });
    const b = queue.add(async () => void started.push('b'));

    await Promise.resolve();
    expect(started).toEqual(['a']); // b is still queued

    first.resolve('ok');
    await Promise.all([a, b]);
    expect(started).toEqual(['a', 'b']);
  });

  it('isolates a failing task from the rest of the queue', async () => {
    const queue = new QuestQueue({ simultaneous: 1 });
    const failed = queue.add(async () => {
      throw new Error('boom');
    });
    const after = queue.add(async () => 'still running');
    await expect(failed).rejects.toThrow('boom');
    await expect(after).resolves.toBe('still running');
  });

  it('catches a task that throws synchronously without stalling the queue', async () => {
    const queue = new QuestQueue({ simultaneous: 1 });
    const bad = queue.add(() => {
      throw new Error('sync boom');
    });
    await expect(bad).rejects.toThrow('sync boom');
    await expect(queue.add(async () => 'ok')).resolves.toBe('ok');
    expect(queue.running).toBe(0);
  });

  it('reports settled results in input order via allSettled', async () => {
    const queue = new QuestQueue({ simultaneous: 2 });
    const results = await queue.allSettled([
      async () => 'a',
      async () => {
        throw new Error('nope');
      },
      async () => 'c',
    ]);
    expect(results.map((r) => r.status)).toEqual(['fulfilled', 'rejected', 'fulfilled']);
    expect(results[0]).toMatchObject({ value: 'a' });
    expect(results[2]).toMatchObject({ value: 'c' });
  });

  it('resolves onIdle when the queue drains, and immediately when already idle', async () => {
    const queue = new QuestQueue({ simultaneous: 1 });
    await expect(queue.onIdle()).resolves.toBeUndefined();

    const done = vi.fn();
    void queue.add(async () => 1);
    void queue.add(async () => 2);
    const idle = queue.onIdle().then(() => done());
    expect(done).not.toHaveBeenCalled();
    await idle;
    expect(queue.idle).toBe(true);
    expect(queue.pending).toBe(0);
  });

  it('drops queued tasks on clear without touching running ones', async () => {
    const queue = new QuestQueue({ simultaneous: 1 });
    const first = defer<string>();
    const running = queue.add(() => first.promise);
    const queued = queue.add(async () => 'never');

    queue.clear();
    await expect(queued).rejects.toThrow('cleared');

    first.resolve('finished');
    await expect(running).resolves.toBe('finished');
  });

  it('rejects a non-function task instead of silently ignoring it', async () => {
    const queue = new QuestQueue({ simultaneous: 1 });
    await expect(queue.add(undefined as never)).rejects.toThrow(TypeError);
  });

  it('treats a non-positive concurrency as 1', async () => {
    const queue = new QuestQueue({ simultaneous: 0 });
    expect(queue.simultaneous).toBe(1);
    await expect(queue.add(async () => 'ok')).resolves.toBe('ok');
  });
});
