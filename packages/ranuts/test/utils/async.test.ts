import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TimeoutError, deferred, delay, withTimeout, withTimeoutFallback } from '@/utils/async';

describe('deferred', () => {
  it('resolves from outside the executor', async () => {
    const d = deferred<number>();
    setTimeout(() => d.resolve(7), 0);
    await expect(d.promise).resolves.toBe(7);
  });

  it('rejects from outside the executor', async () => {
    const d = deferred<number>();
    d.reject(new Error('nope'));
    await expect(d.promise).rejects.toThrow('nope');
  });
});

describe('withTimeout', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('passes through a value that arrives in time', async () => {
    const promise = withTimeout(Promise.resolve('ok'), 1000);
    await expect(promise).resolves.toBe('ok');
  });

  it('passes through a rejection that arrives in time', async () => {
    const promise = withTimeout(Promise.reject(new Error('inner')), 1000);
    await expect(promise).rejects.toThrow('inner');
  });

  it('rejects with a TimeoutError past the deadline', async () => {
    const promise = withTimeout(new Promise(() => {}), 1000);
    const assertion = expect(promise).rejects.toBeInstanceOf(TimeoutError);
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it('uses the supplied message', async () => {
    const promise = withTimeout(new Promise(() => {}), 50, { message: 'save timed out' });
    const assertion = expect(promise).rejects.toThrow('save timed out');
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
  });

  it('calls onTimeout so the caller can tear the work down', async () => {
    const onTimeout = vi.fn();
    const promise = withTimeout(new Promise(() => {}), 50, { onTimeout });
    const assertion = expect(promise).rejects.toBeInstanceOf(TimeoutError);
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
    expect(onTimeout).toHaveBeenCalledOnce();
  });

  it('clears the timer on the fast path', async () => {
    // The naive Promise.race version leaves this timer pending, which keeps a Node process
    // alive for the full deadline and fires into whatever runs next.
    await withTimeout(Promise.resolve('ok'), 10_000);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the timer when the inner promise rejects', async () => {
    await expect(withTimeout(Promise.reject(new Error('x')), 10_000)).rejects.toThrow('x');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not call onTimeout when the work finishes first', async () => {
    const onTimeout = vi.fn();
    await withTimeout(Promise.resolve(1), 1000, { onTimeout });
    await vi.advanceTimersByTimeAsync(2000);
    expect(onTimeout).not.toHaveBeenCalled();
  });
});

describe('withTimeoutFallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves the fallback past the deadline', async () => {
    const promise = withTimeoutFallback(new Promise<string>(() => {}), 100, 'cached');
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBe('cached');
  });

  it('still propagates a real rejection', async () => {
    await expect(withTimeoutFallback(Promise.reject(new Error('boom')), 100, 'cached')).rejects.toThrow('boom');
  });

  it('prefers the real value when it arrives in time', async () => {
    await expect(withTimeoutFallback(Promise.resolve('fresh'), 100, 'cached')).resolves.toBe('fresh');
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('delay', () => {
  it('resolves after the given time', async () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    void delay(100).then(spy);
    await vi.advanceTimersByTimeAsync(99);
    expect(spy).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(spy).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
