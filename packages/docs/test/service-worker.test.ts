import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, it } from 'vitest';

it('keeps installation alive until every precache response is stored', async () => {
  const listeners = new Map<string, (event: unknown) => void>();
  const cached: string[] = [];
  let finish!: () => void;
  const ready = new Promise<void>((resolve) => {
    finish = resolve;
  });
  runInNewContext(readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
    VERSION: 'test',
    SERVICE_WORK_CACHE_FILE_PATHS: ['/a.js', '/b.js'],
    addEventListener: (type: string, listener: (event: unknown) => void) => listeners.set(type, listener),
    skipWaiting() {},
    clients: { matchAll: async () => [] },
    caches: {
      open: async () => ({
        put: async (url: string) => {
          cached.push(url);
        },
      }),
    },
    fetch: async () => {
      await ready;
      return new Response('asset');
    },
    Response,
    URL,
    console,
  });
  let installing!: Promise<void>;
  listeners.get('install')!({
    waitUntil: (promise: Promise<void>) => {
      installing = promise;
    },
  });
  let settled = false;
  void installing.then(() => {
    settled = true;
  });
  for (let i = 0; i < 10; i++) await Promise.resolve();
  const finishedEarly = settled;
  finish();
  await installing;
  expect(finishedEarly).toBe(false);
  expect(cached.sort()).toEqual(['/a.js', '/b.js']);
});

it('leaves third-party requests, range downloads and large media to the browser', () => {
  const listeners = new Map<string, (event: unknown) => void>();
  runInNewContext(readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
    VERSION: 'test',
    SERVICE_WORK_CACHE_FILE_PATHS: [],
    addEventListener: (type: string, listener: (event: unknown) => void) => listeners.set(type, listener),
    location: { origin: 'https://ran.test' },
    URL,
    Response,
    console,
  });
  const intercepted: string[] = [];
  for (const [url, range] of [
    ['https://external.test/a.js', false],
    ['https://ran.test/movie.mp4', false],
    ['https://ran.test/a.js', true],
  ] as const) {
    listeners.get('fetch')!({
      request: { url, method: 'GET', headers: new Headers(range ? { Range: 'bytes=0-10' } : {}) },
      respondWith: () => intercepted.push(url),
      waitUntil() {},
    });
  }
  expect(intercepted).toEqual([]);
});

it('bounds concurrent precache downloads and preserves unrelated caches', async () => {
  const listeners = new Map<string, (event: unknown) => void>();
  let active = 0;
  let peak = 0;
  const deleted: string[] = [];
  runInNewContext(readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
    VERSION: 'test',
    SERVICE_WORK_CACHE_FILE_PATHS: Array.from({ length: 12 }, (_, i) => `/${i}.js`),
    addEventListener: (type: string, listener: (event: unknown) => void) => listeners.set(type, listener),
    skipWaiting() {},
    clients: { matchAll: async () => [], claim: async () => {} },
    caches: {
      open: async () => ({ put: async () => {} }),
      keys: async () => ['chaxus_ran_old', 'chaxus_ran_test', 'chaxus_ran_documents', 'chaxus_ran_assets', 'other-app'],
      delete: async (name: string) => {
        deleted.push(name);
      },
    },
    fetch: async () => {
      peak = Math.max(peak, ++active);
      await new Promise<void>((resolve) => setImmediate(resolve));
      active--;
      return new Response('asset');
    },
    Response,
    URL,
    console,
  });
  let pending!: Promise<void>;
  const event = {
    waitUntil: (promise: Promise<void>) => {
      pending = promise;
    },
  };
  listeners.get('install')!(event);
  await pending;
  expect(peak).toBeLessThanOrEqual(4);
  listeners.get('activate')!(event);
  await pending;
  expect(deleted).toEqual(['chaxus_ran_old']);
});

it('keeps the initially opened document available offline across worker updates', async () => {
  const storage = new Map<string, Map<string, Response>>();
  let offline = false;
  const url = 'https://ran.test/guide/';
  for (const version of ['first', 'second']) {
    const listeners = new Map<string, (event: any) => void>();
    runInNewContext(readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
      VERSION: version,
      SERVICE_WORK_CACHE_FILE_PATHS: [],
      addEventListener: (type: string, listener: (event: any) => void) => listeners.set(type, listener),
      skipWaiting() {},
      clients: { matchAll: async () => [{ url }], claim: async () => {} },
      location: { origin: 'https://ran.test' },
      caches: {
        open: async (name: string) => {
          if (!storage.has(name)) storage.set(name, new Map());
          const cache = storage.get(name)!;
          return {
            put: async (key: string, response: Response) => {
              cache.set(key, response.clone());
            },
            match: async (key: string) => cache.get(key)?.clone(),
          };
        },
        keys: async () => [...storage.keys()],
        delete: async (name: string) => storage.delete(name),
      },
      fetch: async () => {
        if (offline) throw new Error('offline');
        return new Response('<h1>Guide</h1>', { headers: { 'Content-Type': 'text/html' } });
      },
      Response,
      URL,
      console,
    });
    let pending!: Promise<void>;
    const event = {
      waitUntil: (promise: Promise<void>) => {
        pending = promise;
      },
    };
    listeners.get('install')!(event);
    await pending;
    listeners.get('activate')!(event);
    await pending;
    let asset!: Promise<Response>;
    const assetEvent = {
      ...event,
      request: { url: 'https://ran.test/assets/docs.old.js', method: 'GET', headers: new Headers() },
      respondWith: (promise: Promise<Response>) => {
        asset = promise;
      },
    };
    listeners.get('fetch')!(assetEvent);
    expect((await asset).status).toBe(200);
    await pending;
    offline = true;
    let response!: Promise<Response>;
    listeners.get('fetch')!({
      ...event,
      request: { url, method: 'GET', mode: 'navigate', headers: new Headers() },
      respondWith: (promise: Promise<Response>) => {
        response = promise;
      },
    });
    expect(await (await response).text()).toBe('<h1>Guide</h1>');
    listeners.get('fetch')!(assetEvent);
    expect((await asset).status).toBe(200);
  }
});
