import { expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
function worker(
  files = [
    { url: '/', revision: 'home' },
    { url: '/guide', revision: 'guide' },
  ],
  stores = new Map<string, Map<string, Response>>([
    ['chaxus_ran_old', new Map()],
    ['other-app', new Map()],
  ]),
  version = 'test',
  legacy = false,
) {
  const handlers = new Map<string, (event: any) => void>();
  let stalled: string | undefined;
  let storageBlocked = false;
  let failures = new Set<string>();
  const requests: string[] = [];
  const cache = (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name)!;
    return {
      match: async (key: string | Request) => store.get(typeof key === 'string' ? key : key.url)?.clone(),
      put: async (key: string | Request, value: Response) => {
        store.set(typeof key === 'string' ? key : key.url, value.clone());
      },
      keys: async () => [...store.keys()].map((url) => ({ url })),
      delete: async (key: string | Request) => store.delete(typeof key === 'string' ? key : key.url),
    };
  };
  runInNewContext(script, {
    VERSION: version,
    SERVICE_WORK_CACHE_FILE_PATHS: ['/', '/offline-manifest.json'],
    Response: legacy
      ? class extends Response {
          static json = undefined as any;
        }
      : Response,
    URL,
    console,
    AbortController: legacy ? undefined : AbortController,
    setTimeout,
    clearTimeout,
    location: { origin: 'https://docs.test' },
    addEventListener: (name: string, handler: (event: any) => void) => handlers.set(name, handler),
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
    caches: {
      open: async (name: string) => {
        if (storageBlocked) throw new Error('storage denied');
        return cache(name);
      },
      keys: async () => [...stores.keys()],
      delete: async (name: string) => stores.delete(name),
    },
    fetch: async (key: string | Request) => {
      const url = typeof key === 'string' ? key : key.url;
      requests.push(url);
      if (url === stalled) return new Promise<Response>(() => {});
      if (failures.has(url)) throw new Error('offline');
      return url === '/offline-manifest.json' ? Response.json({ version, files }) : new Response(url);
    },
  });
  const run = async (name: string, fields = {}) => {
    let task: Promise<unknown> = Promise.resolve();
    let result: any;
    let response: Promise<Response> | undefined;
    handlers.get(name)!({
      ...fields,
      respondWith: (value: Promise<Response>) => {
        response = value;
      },
      waitUntil: (value: Promise<unknown>) => {
        task = value;
      },
      ports: [
        {
          postMessage: (value: unknown) => {
            result = value;
          },
        },
      ],
    });
    await task;
    return response ? await response : result;
  };
  return {
    run,
    blockStorage: () => {
      storageBlocked = true;
    },
    stores,
    requests,
    stall: (url?: string) => {
      stalled = url;
    },
    fail: (urls: string[]) => {
      failures = new Set(urls);
    },
  };
}

it('preserves old offline documents during activation and failed background caching', async () => {
  const sw = worker();
  await sw.run('install');
  sw.requests.length = 0;
  await sw.run('activate');
  expect(sw.stores.has('chaxus_ran_old')).toBe(true);
  sw.fail(['/guide']);
  const progress = await sw.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } });
  expect(progress.complete).toBe(false);
  expect(sw.stores.has('chaxus_ran_old')).toBe(true);
  sw.fail([]);
  const finished = await sw.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } });
  expect(finished.complete).toBe(true);
  expect(sw.stores.has('chaxus_ran_old')).toBe(false);
  expect(sw.stores.has('other-app')).toBe(true);
  expect(sw.requests.filter((url) => url === '/')).toHaveLength(1);
});

it('bounds background work and resumes until every resource has been cached', async () => {
  const files = Array.from({ length: 35 }, (_, i) => ({ url: `/page${i}`, revision: String(i) }));
  const sw = worker(files);
  await sw.run('install');
  sw.requests.length = 0;
  const first = await sw.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } });
  expect(first.complete).toBe(false);
  expect(first.cached).toBeGreaterThan(0);
  expect(first.cached).toBeLessThan(35);
  let progress = first;
  for (let i = 0; i < 5 && !progress.complete; i++)
    progress = await sw.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } });
  expect(progress).toMatchObject({ complete: true, cached: 35, total: 35 });
  for (const file of files) expect(sw.requests.filter((url) => url === file.url)).toHaveLength(1);
});

it('recovers from stalled downloads and persists completed progress across worker restarts', async () => {
  vi.useFakeTimers();
  try {
    const sw = worker();
    await sw.run('install');
    sw.stall('/guide');
    const running = sw.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } });
    await vi.advanceTimersByTimeAsync(30000);
    expect(await running).toMatchObject({ complete: false, failures: 1 });
    sw.stall();
    expect(await sw.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } })).toMatchObject({ complete: true });
    const restarted = worker(undefined, sw.stores);
    expect(await restarted.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } })).toMatchObject({
      complete: true,
      cached: 2,
    });
    expect(restarted.requests).toHaveLength(0);
    const updated = worker(undefined, sw.stores, 'next');
    await updated.run('install');
    updated.requests.length = 0;
    expect(await updated.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } })).toMatchObject({
      complete: true,
      cached: 2,
    });
    expect(updated.requests).toHaveLength(0);
  } finally {
    vi.useRealTimers();
  }
});

it('caches the complete corpus without Response.json or AbortController', async () => {
  const sw = worker(undefined, undefined, 'legacy', true);
  await sw.run('install');
  expect(await sw.run('message', { data: { type: 'CACHE_OFFLINE_BATCH' } })).toMatchObject({
    complete: true,
    cached: 2,
  });
});

it('serves network responses when browser storage is denied', async () => {
  const sw = worker();
  sw.blockStorage();
  const response = await sw.run('fetch', {
    request: { method: 'GET', url: 'https://docs.test/guide', mode: 'navigate' },
  });
  expect(response.status).toBe(200);
  expect(await response.text()).toBe('https://docs.test/guide');
});
