import { describe, expect, it, vi } from 'vitest';
import { createSignal, isEqual, memoize, once, subscribers } from '@/utils';

describe('createSignal', () => {
  it('reads and writes', () => {
    const [get, set] = createSignal(0);
    expect(get()).toBe(0);
    set(5);
    expect(get()).toBe(5);
  });

  it('notifies subscribers on change and skips no-op writes', () => {
    const event = 'signal-test-basic';
    const cb = vi.fn();
    subscribers.tap(event, cb);
    const [, set] = createSignal(0, { subscriber: event });
    set(1);
    set(1);
    set(2);
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('updates with equals: true — it means "use the default comparison", not "always equal"', () => {
    // Regression: `true` used to mean "always equal", so an { equals: true } signal never updated at all
    const [get, set] = createSignal(0, { equals: true });
    set(1);
    expect(get()).toBe(1);
  });

  it('always notifies with equals: false, even for a deep-equal value', () => {
    // Regression: the old implementation layered a cloneDeep + isEqual deep comparison on top
    // of `equals`, so equals:false ("always notify") stopped working for a deeply equal object
    const event = 'signal-test-always';
    const cb = vi.fn();
    subscribers.tap(event, cb);
    const [, set] = createSignal({ a: 1 }, { subscriber: event, equals: false });
    set({ a: 1 });
    set({ a: 1 });
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('uses reference equality by default — a fresh but deep-equal object is a change', () => {
    const event = 'signal-test-ref';
    const cb = vi.fn();
    subscribers.tap(event, cb);
    const [, set] = createSignal({ a: 1 }, { subscriber: event });
    set({ a: 1 });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('supports opt-in deep comparison via equals: isEqual', () => {
    const event = 'signal-test-deep';
    const cb = vi.fn();
    subscribers.tap(event, cb);
    const [, set] = createSignal({ a: 1 }, { subscriber: event, equals: isEqual });
    set({ a: 1 });
    expect(cb).not.toHaveBeenCalled();
    set({ a: 2 });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('honours a custom comparator', () => {
    const [get, set] = createSignal(0, { equals: (prev, next) => Math.abs(prev - next) < 10 });
    set(5);
    expect(get()).toBe(0); // within 10, so treated as equal
    set(50);
    expect(get()).toBe(50);
  });

  it('does not require a subscriber', () => {
    const [get, set] = createSignal('a');
    expect(() => set('b')).not.toThrow();
    expect(get()).toBe('b');
  });
});

describe('once', () => {
  it('evaluates once and reuses the result', () => {
    const fn = vi.fn(() => ({ id: 1 }));
    const lazy = once(fn);
    expect(lazy()).toBe(lazy());
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('ignores arguments after the first call', () => {
    const lazy = once((n: number) => n * 2);
    expect(lazy(2)).toBe(4);
    expect(lazy(100)).toBe(4);
  });

  it('returns a non-function value as-is', () => {
    expect(once(42 as unknown)()).toBe(42);
  });

  it('caches undefined too, rather than re-running', () => {
    const fn = vi.fn(() => undefined);
    const lazy = once(fn);
    lazy();
    lazy();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('is what memoize now aliases', () => {
    expect(memoize).toBe(once);
  });
});
