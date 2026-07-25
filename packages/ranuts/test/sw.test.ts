import { describe, expect, it, vi } from 'vitest';
import { cacheFirst, dropCachesExcept, networkFirst, precache, servePrecache } from '@/sw/index';
import type { SWScope } from '@/sw/index';

/** In-memory CacheStorage + fetch, enough to drive the strategies */
const makeScope = (options: { network?: (url: string) => Response | Promise<Response> } = {}) => {
  const stores = new Map<string, Map<string, Response>>();
  const listeners = new Set<(event: never) => void>();
  const fetched: string[] = [];

  const cacheOf = (name: string): Map<string, Response> => {
    if (!stores.has(name)) stores.set(name, new Map());
    return stores.get(name) as Map<string, Response>;
  };
  const wrap = (name: string): Cache =>
    ({
      match: async (url: string) => cacheOf(name).get(url),
      put: async (url: string, response: Response) => void cacheOf(name).set(url, response),
    }) as unknown as Cache;

  const scope: SWScope = {
    caches: {
      open: async (name: string) => wrap(name),
      match: async (url: string) => {
        for (const store of stores.values()) if (store.has(url)) return store.get(url);
        return undefined;
      },
      keys: async () => [...stores.keys()],
      delete: async (name: string) => stores.delete(name),
    } as unknown as CacheStorage,
    fetch: (async (input: string | Request) => {
      const url = typeof input === 'string' ? input : input.url;
      fetched.push(url);
      return options.network ? options.network(url) : new Response('net', { status: 200 });
    }) as unknown as typeof fetch,
    addEventListener: (_type, fn) => void listeners.add(fn),
    removeEventListener: (_type, fn) => void listeners.delete(fn),
  };

  return {
    scope,
    fetched,
    listenerCount: (): number => listeners.size,
    cached: (name: string): string[] => [...cacheOf(name).keys()],
    seed: (name: string, url: string, body: string): void => void cacheOf(name).set(url, new Response(body)),
    emit: (event: unknown): void => listeners.forEach((fn) => (fn as (e: unknown) => void)(event)),
  };
};

const req = (url: string, method = 'GET'): Request => ({ url, method }) as Request;

describe('cacheFirst', () => {
  it('serves the cached copy without touching the network', async () => {
    const h = makeScope();
    h.seed('assets', '/a.js', 'cached');
    const response = await cacheFirst(req('/a.js'), { cacheName: 'assets', scope: h.scope });
    expect(await response.text()).toBe('cached');
    expect(h.fetched).toEqual([]);
  });

  it('fetches and stores on a miss', async () => {
    const h = makeScope();
    const response = await cacheFirst(req('/a.js'), { cacheName: 'assets', scope: h.scope });
    expect(await response.text()).toBe('net');
    expect(h.fetched).toEqual(['/a.js']);
    expect(h.cached('assets')).toEqual(['/a.js']);
  });

  it('hands the caller a readable body even though a copy was cached', async () => {
    // 回归：先 await caches.open() 再 clone()，body 可能已经在流向调用方，clone 会抛
    const h = makeScope();
    const response = await cacheFirst(req('/a.js'), { cacheName: 'assets', scope: h.scope });
    await expect(response.text()).resolves.toBe('net');
  });

  it('does not cache a non-200 or a non-GET', async () => {
    const h = makeScope({ network: () => new Response('nope', { status: 404 }) });
    await cacheFirst(req('/a.js'), { cacheName: 'assets', scope: h.scope });
    expect(h.cached('assets')).toEqual([]);

    const ok = makeScope();
    await cacheFirst(req('/a.js', 'POST'), { cacheName: 'assets', scope: ok.scope });
    expect(ok.cached('assets')).toEqual([]);
  });

  it('honours a custom shouldCache', async () => {
    const h = makeScope();
    await cacheFirst(req('/a.js'), { cacheName: 'assets', scope: h.scope, shouldCache: () => false });
    expect(h.cached('assets')).toEqual([]);
  });

  it('resolves to a 408 rather than rejecting when the network is down', async () => {
    const h = makeScope({
      network: () => {
        throw new Error('offline');
      },
    });
    const response = await cacheFirst(req('/a.js'), { cacheName: 'assets', scope: h.scope });
    expect(response.status).toBe(408);
  });
});

describe('networkFirst', () => {
  it('prefers the network and refreshes the cache', async () => {
    const h = makeScope();
    h.seed('pages', '/', 'stale');
    const response = await networkFirst(req('/'), { cacheName: 'pages', scope: h.scope });
    expect(await response.text()).toBe('net');
    expect(h.fetched).toEqual(['/']);
  });

  it('falls back to the cached copy when offline', async () => {
    const h = makeScope({
      network: () => {
        throw new Error('offline');
      },
    });
    h.seed('pages', '/', 'stale');
    const response = await networkFirst(req('/'), { cacheName: 'pages', scope: h.scope });
    expect(await response.text()).toBe('stale');
  });

  it('resolves to a 408 when offline with nothing cached', async () => {
    const h = makeScope({
      network: () => {
        throw new Error('offline');
      },
    });
    const response = await networkFirst(req('/'), { cacheName: 'pages', scope: h.scope });
    expect(response.status).toBe(408);
  });
});

describe('precache', () => {
  it('stores everything it does not already have', async () => {
    const h = makeScope();
    await precache('models', ['/a', '/b'], { scope: h.scope });
    expect(h.cached('models')).toEqual(['/a', '/b']);
  });

  it('is idempotent — a second run refetches nothing', async () => {
    const h = makeScope();
    await precache('models', ['/a'], { scope: h.scope });
    await precache('models', ['/a'], { scope: h.scope });
    expect(h.fetched).toEqual(['/a']);
  });

  it('keeps going past a failure instead of aborting the batch', async () => {
    const h = makeScope({
      network: (url) => {
        if (url === '/b') throw new Error('404');
        return new Response('ok', { status: 200 });
      },
    });
    await precache('models', ['/a', '/b', '/c'], { scope: h.scope });
    expect(h.cached('models')).toEqual(['/a', '/c']);
  });
});

describe('dropCachesExcept', () => {
  it('deletes the caches not named and reports them', async () => {
    const h = makeScope();
    h.seed('old-build', '/x', 'x');
    h.seed('new-build', '/y', 'y');
    h.seed('models', '/z', 'z');
    const dropped = await dropCachesExcept(['new-build', 'models'], { scope: h.scope });
    expect(dropped).toEqual(['old-build']);
  });
});

describe('servePrecache', () => {
  it('answers a matching message and keeps the worker alive with waitUntil', async () => {
    const h = makeScope();
    servePrecache({ type: 'precache-models', cacheName: 'models', scope: h.scope });
    const waitUntil = vi.fn();
    h.emit({ data: { type: 'precache-models', urls: ['/a', '/b'] }, waitUntil });
    expect(waitUntil).toHaveBeenCalledTimes(1);
    await waitUntil.mock.calls[0][0];
    expect(h.cached('models')).toEqual(['/a', '/b']);
  });

  it('ignores messages of another type or shape', () => {
    const h = makeScope();
    servePrecache({ type: 'precache-models', cacheName: 'models', scope: h.scope });
    const waitUntil = vi.fn();
    h.emit({ data: { type: 'something-else', urls: ['/a'] }, waitUntil });
    h.emit({ data: { type: 'precache-models' }, waitUntil });
    h.emit({ data: null, waitUntil });
    expect(waitUntil).not.toHaveBeenCalled();
  });

  it('returns a stop function that removes the listener', () => {
    const h = makeScope();
    const stop = servePrecache({ type: 'precache-models', cacheName: 'models', scope: h.scope });
    expect(h.listenerCount()).toBe(1);
    stop();
    expect(h.listenerCount()).toBe(0);
  });
});
