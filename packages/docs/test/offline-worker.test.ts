import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, it } from 'vitest';

const origin = 'https://ran.test';
const manifest = {
  shared: ['/assets/button.hash.js', '/assets/search.hash.js'],
  locales: { en: ['/', '/guide', '/search/en.json'], zh: ['/cn/', '/search/zh.json'] },
};
const harness = (storage = new Map<string, Map<string, Response>>()) => {
  const listeners = new Map<string, (event: any) => void>();
  const downloaded: string[] = [];
  let offline = false;
  let failStorage = false;
  let slow = false;
  let peak = 0;
  let active = 0;
  const sw = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
  const workerPath = new URL('../public/offline-worker.js', import.meta.url);
  runInNewContext(sw + (existsSync(workerPath) ? readFileSync(workerPath, 'utf8') : ''), {
    VERSION: 'test',
    SERVICE_WORK_CACHE_FILE_PATHS: [],
    OFFLINE_MANIFEST: manifest,
    location: { origin },
    Response,
    ReadableStream,
    Request,
    URL,
    AbortController,
    DOMException,
    console,
    setTimeout,
    clearTimeout,
    addEventListener: (type: string, listener: (event: any) => void) => listeners.set(type, listener),
    navigator: { storage: { estimate: async () => ({ usage: 0, quota: 1e9 }) } },
    caches: {
      open: async (name: string) => {
        if (!storage.has(name)) storage.set(name, new Map());
        const cache = storage.get(name)!;
        return {
          put: async (key: string, response: Response) => {
            if (failStorage) throw new DOMException('full', 'QuotaExceededError');
            cache.set(new URL(key, origin).href, response.clone());
          },
          match: async (key: string) => cache.get(new URL(key, origin).href)?.clone(),
        };
      },
    },
    fetch: async (input: string | { url: string }, options?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.url;
      if (offline) throw new TypeError('offline');
      downloaded.push(new URL(url, origin).pathname);
      peak = Math.max(peak, ++active);
      try {
        if (slow)
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(resolve, 100);
            options?.signal?.addEventListener(
              'abort',
              () => {
                clearTimeout(timer);
                reject(options.signal!.reason);
              },
              { once: true },
            );
          });
        return new Response(url.endsWith('.js') ? 'export {}' : url.endsWith('.json') ? '{}' : '<h1>Guide</h1>');
      } finally {
        active--;
      }
    },
  });
  const send = async (type: string, lang = 'en', clientId = 'one') => {
    let pending = Promise.resolve();
    let reply: any;
    listeners.get('message')?.({
      data: { type, lang, current: '/guide' },
      source: { id: clientId, url: `${origin}/guide` },
      ports: [
        {
          postMessage: (message: any) => {
            reply = message;
          },
        },
      ],
      waitUntil: (promise: Promise<void>) => {
        pending = promise;
      },
    });
    await pending;
    return reply;
  };
  const foregroundWaits: Promise<unknown>[] = [];
  const navigate = async (url: string) => {
    let response!: Promise<Response>;
    listeners.get('fetch')!({
      request: { url: origin + url, mode: 'navigate', method: 'GET', headers: new Headers() },
      respondWith: (r: Promise<Response>) => {
        response = r;
      },
      waitUntil: (promise: Promise<unknown>) => {
        foregroundWaits.push(promise);
      },
    });
    return response;
  };
  return {
    storage,
    downloaded,
    send,
    navigate,
    waitForForeground: () => Promise.all(foregroundWaits),
    peak: () => peak,
    setOffline: () => {
      offline = true;
    },
    setSlow: () => {
      slow = true;
    },
    setFull: () => {
      failStorage = true;
    },
  };
};

it('downloads bounded batches serially, covering unvisited pages and locale search', async () => {
  const worker = harness();
  const first = await worker.send('OFFLINE_BATCH');
  expect(first?.state).toBe('working');
  expect(worker.downloaded.length).toBeLessThanOrEqual(3);
  const second = await worker.send('OFFLINE_BATCH');
  expect(second?.state).toBe('ready');
  expect(worker.peak()).toBe(1);
  expect(worker.downloaded).toContain('/search/en.json');
  expect(worker.downloaded).not.toContain('/search/zh.json');
  worker.setOffline();
  expect(await (await worker.navigate('/')).text()).toBe('<h1>Guide</h1>');
});

it('resumes after worker restart without downloading completed files again', async () => {
  const first = harness();
  await first.send('OFFLINE_BATCH');
  const restarted = harness(first.storage);
  expect((await restarted.send('OFFLINE_BATCH'))?.state).toBe('ready');
  expect(restarted.downloaded.some((url) => first.downloaded.includes(url))).toBe(false);
});

it('shares work between tabs and aborts an idle download when a reader interacts', async () => {
  const worker = harness();
  worker.setSlow();
  const first = worker.send('OFFLINE_BATCH');
  // Allow initialization to reach the first network request.
  for (let i = 0; i < 30; i++) await Promise.resolve();
  const second = await worker.send('OFFLINE_BATCH', 'en', 'two');
  expect(second?.state).toBe('busy');
  await worker.send('OFFLINE_PAUSE');
  expect((await first)?.state).toBe('paused');
  expect(worker.peak()).toBe(1);
});

it('reports network and storage failures without claiming offline readiness', async () => {
  const offline = harness();
  offline.setOffline();
  expect((await offline.send('OFFLINE_BATCH'))?.state).toBe('network');
  const full = harness();
  full.setFull();
  expect((await full.send('OFFLINE_BATCH'))?.state).toBe('storage');
});

it('yields an active idle download to a foreground navigation', async () => {
  const worker = harness();
  worker.setSlow();
  const batch = worker.send('OFFLINE_BATCH');
  for (let i = 0; i < 30; i++) await Promise.resolve();
  const foreground = worker.navigate('/guide');
  expect((await batch)?.state).toBe('paused');
  expect((await foreground).status).toBe(200);
});

it('does not restart background work while a foreground request is pending', async () => {
  const worker = harness();
  worker.setSlow();
  const navigation = worker.navigate('/guide');
  expect((await worker.send('OFFLINE_BATCH'))?.state).toBe('busy');
  await navigation;
  await worker.waitForForeground();
  expect((await worker.send('OFFLINE_BATCH'))?.state).toBe('working');
});

it('keeps media downloads ahead of offline work until the response body is consumed', async () => {
  const worker = harness();
  const media = await worker.navigate('/movie.mp4');
  expect((await worker.send('OFFLINE_BATCH'))?.state).toBe('busy');
  expect(await media.text()).toBe('<h1>Guide</h1>');
  await worker.waitForForeground();
  expect((await worker.send('OFFLINE_BATCH'))?.state).toBe('working');
});

it('reports cached readiness after reopening offline without starting a download', async () => {
  const worker = harness();
  await worker.send('OFFLINE_BATCH');
  await worker.send('OFFLINE_BATCH');
  const reopened = harness(worker.storage);
  reopened.setOffline();
  expect((await reopened.send('OFFLINE_STATUS'))?.state).toBe('ready');
  expect(reopened.downloaded).toHaveLength(0);
});
