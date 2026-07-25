import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOBILE_MEDIA_QUERY, matchMediaQuery, watchMediaQuery } from '@/utils';

const g = globalThis as unknown as { window?: unknown };

/** A MediaQueryList stand-in whose change event can be fired by hand */
const makeMql = (matches: boolean, legacy = false) => {
  const listeners = new Set<() => void>();
  const mql: Record<string, unknown> = {
    matches,
    set: (value: boolean): void => {
      mql.matches = value;
      listeners.forEach((fn) => fn());
    },
  };
  if (legacy) {
    mql.addListener = (fn: () => void): void => void listeners.add(fn);
    mql.removeListener = (fn: () => void): void => void listeners.delete(fn);
  } else {
    mql.addEventListener = (_type: string, fn: () => void): void => void listeners.add(fn);
    mql.removeEventListener = (_type: string, fn: () => void): void => void listeners.delete(fn);
  }
  return { mql, size: (): number => listeners.size };
};

afterEach(() => {
  delete g.window;
});

describe('matchMediaQuery', () => {
  it('returns false without a window (SSR)', () => {
    expect(matchMediaQuery(MOBILE_MEDIA_QUERY)).toBe(false);
  });

  it('returns false where matchMedia is missing', () => {
    g.window = {};
    expect(matchMediaQuery(MOBILE_MEDIA_QUERY)).toBe(false);
  });

  it('reads the current match state', () => {
    g.window = { matchMedia: () => ({ matches: true }) };
    expect(matchMediaQuery(MOBILE_MEDIA_QUERY)).toBe(true);
  });
});

describe('watchMediaQuery', () => {
  it('fires once synchronously with the current value', () => {
    const { mql } = makeMql(true);
    g.window = { matchMedia: () => mql };
    const cb = vi.fn();
    watchMediaQuery(MOBILE_MEDIA_QUERY, cb);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(true);
  });

  it('fires again on change, and stops after unsubscribe', () => {
    const { mql, size } = makeMql(false);
    g.window = { matchMedia: () => mql };
    const cb = vi.fn();
    const off = watchMediaQuery(MOBILE_MEDIA_QUERY, cb);

    (mql.set as (v: boolean) => void)(true);
    expect(cb).toHaveBeenLastCalledWith(true);
    expect(size()).toBe(1);

    off();
    expect(size()).toBe(0);
    (mql.set as (v: boolean) => void)(false);
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('falls back to addListener/removeListener on older Safari', () => {
    const { mql, size } = makeMql(false, true);
    g.window = { matchMedia: () => mql };
    const cb = vi.fn();
    const off = watchMediaQuery(MOBILE_MEDIA_QUERY, cb);
    expect(size()).toBe(1);
    (mql.set as (v: boolean) => void)(true);
    expect(cb).toHaveBeenLastCalledWith(true);
    off();
    expect(size()).toBe(0);
  });

  it('reports false and returns a no-op unsubscribe without a window', () => {
    const cb = vi.fn();
    const off = watchMediaQuery(MOBILE_MEDIA_QUERY, cb);
    expect(cb).toHaveBeenCalledWith(false);
    expect(() => off()).not.toThrow();
  });
});
