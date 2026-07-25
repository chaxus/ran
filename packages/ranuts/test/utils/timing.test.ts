import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce, throttle } from '@/utils';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('debounce', () => {
  it('runs once, after the quiet period', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d();
    d();
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes the arguments of the last call', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d('a');
    d('b');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('b');
  });

  it('preserves the call-site `this`', () => {
    // Regression: the old implementation wrapped it in an arrow function, binding `this` to
    // the module scope at definition, so calling it on an object gave undefined, not the object.
    const seen: unknown[] = [];
    const obj = {
      name: 'target',
      handler: debounce(function (this: { name: string }) {
        seen.push(this?.name);
      }, 100),
    };
    obj.handler();
    vi.advanceTimersByTime(100);
    expect(seen).toEqual(['target']);
  });

  it('cancels a pending call', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d();
    expect(d.pending()).toBe(true);
    d.cancel();
    expect(d.pending()).toBe(false);
    vi.advanceTimersByTime(500);
    expect(fn).not.toHaveBeenCalled();
  });

  it('flushes a pending call immediately', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d('x');
    d.flush();
    expect(fn).toHaveBeenCalledWith('x');
    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does nothing when flushed with nothing pending', () => {
    const fn = vi.fn();
    debounce(fn, 100).flush();
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('throttle', () => {
  it('runs immediately on the leading edge', () => {
    const fn = vi.fn();
    throttle(fn, 100)();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('collapses a burst into leading + trailing', () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t('a');
    t('b');
    t('c');
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    // The trailing call replays the last arguments
    expect(fn).toHaveBeenLastCalledWith('c');
  });

  it('runs again immediately once the window has elapsed', () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t();
    vi.advanceTimersByTime(200);
    t();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('preserves the call-site `this`', () => {
    const seen: unknown[] = [];
    const obj = {
      name: 'target',
      handler: throttle(function (this: { name: string }) {
        seen.push(this?.name);
      }, 100),
    };
    obj.handler();
    expect(seen).toEqual(['target']);
  });

  it('cancels the trailing call', () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t();
    t();
    t.cancel();
    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not touch window — usable in node / worker / SSR', () => {
    // Regression: the old implementation called window.setTimeout, throwing a ReferenceError where there is no window
    expect(typeof globalThis.window).toBe('undefined');
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t();
    t();
    expect(() => vi.advanceTimersByTime(100)).not.toThrow();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('gives two throttled functions independent windows', () => {
    // Regression: the removed generateThrottle gave every function it produced one shared
    // lastCallTime/timeoutId, so two unrelated throttled functions suppressed each other.
    const a = vi.fn();
    const b = vi.fn();
    const ta = throttle(a, 100);
    const tb = throttle(b, 100);
    ta();
    tb();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});
