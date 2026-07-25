import { describe, expect, it, vi } from 'vitest';
import { singleFlight } from '@/utils';

describe('singleFlight', () => {
  it('runs the function once and shares the result', async () => {
    const fn = vi.fn(async () => 'value');
    const ready = singleFlight(fn);
    const [a, b, c] = await Promise.all([ready(), ready(), ready()]);
    expect([a, b, c]).toEqual(['value', 'value', 'value']);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('shares the in-flight promise with concurrent callers', async () => {
    let resolve!: (v: number) => void;
    const fn = vi.fn(() => new Promise<number>((r) => (resolve = r)));
    const ready = singleFlight(fn);
    const first = ready();
    const second = ready();
    expect(fn).toHaveBeenCalledTimes(1);
    resolve(7);
    expect(await first).toBe(7);
    expect(await second).toBe(7);
  });

  it('does not cache a rejection — a transient failure stays retryable', async () => {
    let attempt = 0;
    const ready = singleFlight(async () => {
      attempt++;
      if (attempt === 1) throw new Error('network blip');
      return 'ok';
    });
    await expect(ready()).rejects.toThrow('network blip');
    await expect(ready()).resolves.toBe('ok');
    expect(attempt).toBe(2);
  });

  it('reports whether it has started and can be reset', async () => {
    const fn = vi.fn(async () => 1);
    const ready = singleFlight(fn);
    expect(ready.started).toBe(false);
    await ready();
    expect(ready.started).toBe(true);
    ready.reset();
    expect(ready.started).toBe(false);
    await ready();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
