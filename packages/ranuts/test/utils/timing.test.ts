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
    // 回归：旧实现用箭头函数包裹，this 在定义处绑死为模块作用域，
    // 挂在对象上调用时拿到的是 undefined 而不是该对象。
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
    // 尾部补的是最后一次的参数
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
    // 回归：旧实现调 window.setTimeout，无 window 的环境下直接抛 ReferenceError
    expect(typeof globalThis.window).toBe('undefined');
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t();
    t();
    expect(() => vi.advanceTimersByTime(100)).not.toThrow();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('gives two throttled functions independent windows', () => {
    // 回归：已删除的 generateThrottle 让它产出的所有函数共享一份 lastCallTime/timeoutId，
    // 于是两个互不相干的节流函数会互相压制。
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
