import { afterEach, describe, expect, it, vi } from 'vitest';
import { isUrlCached, networkAllowsDownload, prefetchUrl, prefetchUrls, whenIdle } from '@/utils';

type Globals = Record<string, unknown>;
const g = globalThis as unknown as Globals;

/**
 * 覆盖全局对象。必须用 defineProperty：Node 里 `navigator` 是只有 getter 的访问器属性，
 * 直接赋值会抛 TypeError。
 */
const stub = (values: Globals): (() => void) => {
  const saved = Object.keys(values).map((key) => [key, Object.getOwnPropertyDescriptor(g, key)] as const);
  for (const [key, value] of Object.entries(values)) {
    Object.defineProperty(g, key, { value, configurable: true, writable: true });
  }
  return () => {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(g, key, descriptor);
      else delete g[key];
    }
  };
};

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
  vi.restoreAllMocks();
});

describe('whenIdle', () => {
  it('uses requestIdleCallback when available', () => {
    const requestIdleCallback = vi.fn();
    restore = stub({ window: { requestIdleCallback } });
    whenIdle(() => {}, { timeout: 500 });
    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 500 });
  });

  it('falls back to setTimeout where requestIdleCallback is missing', () => {
    vi.useFakeTimers();
    try {
      restore = stub({ window: {} });
      const cb = vi.fn();
      whenIdle(cb, { fallbackDelay: 100 });
      expect(cb).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(cb).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('can be cancelled before the fallback fires', () => {
    vi.useFakeTimers();
    try {
      restore = stub({ window: {} });
      const cb = vi.fn();
      whenIdle(cb, { fallbackDelay: 100 })();
      vi.advanceTimersByTime(500);
      expect(cb).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('networkAllowsDownload', () => {
  it('allows the download when nothing objects', () => {
    restore = stub({ window: {}, navigator: {} });
    expect(networkAllowsDownload()).toBe(true);
  });

  it('refuses under Data Saver', () => {
    restore = stub({ window: {}, navigator: { connection: { saveData: true } } });
    expect(networkAllowsDownload()).toBe(false);
  });

  it('refuses on a slow connection', () => {
    restore = stub({ window: {}, navigator: { connection: { effectiveType: '2g' } } });
    expect(networkAllowsDownload()).toBe(false);
    expect(networkAllowsDownload({ slowTypes: ['slow-2g'] })).toBe(true);
  });

  it('refuses when the user opted out via localStorage', () => {
    restore = stub({
      window: {},
      navigator: {},
      localStorage: { getItem: (key: string) => (key === 'off' ? '1' : null) },
    });
    expect(networkAllowsDownload({ optOutKey: 'off' })).toBe(false);
    expect(networkAllowsDownload({ optOutKey: 'other' })).toBe(true);
  });

  it('does not let a throwing localStorage block the download', () => {
    restore = stub({
      window: {},
      navigator: {},
      localStorage: {
        getItem: () => {
          throw new Error('denied');
        },
      },
    });
    expect(networkAllowsDownload({ optOutKey: 'off' })).toBe(true);
  });
});

describe('prefetch', () => {
  it('reports uncached when CacheStorage is unavailable', async () => {
    restore = stub({ window: {} });
    await expect(isUrlCached('/a.bin')).resolves.toBe(false);
  });

  it('skips the fetch when the URL is already cached', async () => {
    const fetch = vi.fn();
    restore = stub({ window: {}, caches: { match: async () => ({}) }, fetch });
    await prefetchUrl('/a.bin');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches uncached URLs with force-cache', async () => {
    const fetch = vi.fn(async () => ({}));
    restore = stub({ window: {}, caches: { match: async () => undefined }, fetch });
    await prefetchUrl('/a.bin');
    expect(fetch).toHaveBeenCalledWith('/a.bin', { cache: 'force-cache' });
  });

  it('swallows fetch failures — a prefetch must not break the caller', async () => {
    restore = stub({
      window: {},
      caches: { match: async () => undefined },
      fetch: async () => {
        throw new Error('offline');
      },
    });
    await expect(prefetchUrl('/a.bin')).resolves.toBeUndefined();
  });

  it('fetches a list serially', async () => {
    const order: string[] = [];
    const fetch = vi.fn(async (url: string) => {
      order.push(url);
      return {};
    });
    restore = stub({ window: {}, caches: { match: async () => undefined }, fetch });
    await prefetchUrls(['/a', '/b', '/c']);
    expect(order).toEqual(['/a', '/b', '/c']);
  });

  it('hands the list to a controlling service worker instead of fetching', async () => {
    const postMessage = vi.fn();
    const fetch = vi.fn();
    restore = stub({
      window: {},
      navigator: { serviceWorker: { controller: { postMessage } } },
      caches: { match: async () => undefined },
      fetch,
    });
    await prefetchUrls(['/a', '/b'], { serviceWorkerMessage: 'precache' });
    expect(postMessage).toHaveBeenCalledWith({ type: 'precache', urls: ['/a', '/b'] });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('falls back to fetching when there is no controlling service worker', async () => {
    const fetch = vi.fn(async () => ({}));
    restore = stub({
      window: {},
      navigator: { serviceWorker: { controller: null } },
      caches: { match: async () => undefined },
      fetch,
    });
    await prefetchUrls(['/a'], { serviceWorkerMessage: 'precache' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
