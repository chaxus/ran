import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { afterEach, expect, it, vi } from 'vitest';

const url = 'https://ran.test/guide/';
const html = (body: string, version?: string) =>
  new Response(body, {
    headers: { 'Content-Type': 'text/html', ...(version ? { 'X-Ran-Docs-Version': version } : {}) },
  });
const flush = async () => {
  for (let i = 0; i < 40; i++) await Promise.resolve();
};
const harness = (cached?: Response, unavailableStorage = false) => {
  const listeners = new Map<string, (event: any) => void>();
  const waits: Promise<unknown>[] = [];
  let finish!: (response: Response) => void;
  let fail!: (error: Error) => void;
  const network = new Promise<Response>((resolve, reject) => {
    finish = resolve;
    fail = reject;
  });
  const documents = new Map<string, Response>(cached ? [[url, cached]] : []);
  runInNewContext(readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
    VERSION: 'current',
    SERVICE_WORK_CACHE_FILE_PATHS: [],
    location: { origin: 'https://ran.test' },
    addEventListener: (type: string, listener: (event: any) => void) => listeners.set(type, listener),
    caches: {
      open: async () => {
        if (unavailableStorage) throw new Error('storage unavailable');
        return {
          match: async (key: string) => documents.get(key)?.clone(),
          put: async (key: string, response: Response) => {
            documents.set(key, response.clone());
          },
          delete: async (key: string) => documents.delete(key),
        };
      },
    },
    fetch: () => network,
    Response,
    Headers,
    URL,
    console,
    setTimeout,
    clearTimeout,
  });
  let response!: Promise<Response>;
  listeners.get('fetch')!({
    request: { url, method: 'GET', mode: 'navigate', headers: new Headers() },
    respondWith: (result: Promise<Response>) => {
      response = result;
    },
    waitUntil: (work: Promise<unknown>) => {
      waits.push(work);
    },
  });
  return { response, finish, fail, documents, settled: () => Promise.all(waits) };
};
afterEach(() => vi.useRealTimers());

it('shows current-deploy HTML without waiting for the network and refreshes it in the background', async () => {
  const worker = harness(html('cached', 'current'));
  let shown: string | undefined;
  void worker.response.then(async (response) => {
    shown = await response.text();
  });
  await flush();
  const immediate = shown;
  worker.finish(html('updated'));
  await worker.response;
  await worker.settled();
  expect(immediate).toBe('cached');
  const stored = worker.documents.get(url)!;
  expect(await stored.clone().text()).toBe('updated');
  expect(stored.headers.get('X-Ran-Docs-Version')).toBe('current');
});

it('prefers a quick network response over HTML from an earlier deploy', async () => {
  const worker = harness(html('old', 'previous'));
  worker.finish(html('new'));
  expect(await (await worker.response).text()).toBe('new');
  await worker.settled();
  expect(worker.documents.get(url)!.headers.get('X-Ran-Docs-Version')).toBe('current');
});

it('falls back to legacy HTML within 800ms while a slow refresh continues', async () => {
  vi.useFakeTimers();
  const worker = harness(html('legacy'));
  let shown: string | undefined;
  void worker.response.then(async (response) => {
    shown = await response.text();
  });
  await flush();
  expect(shown).toBeUndefined();
  await vi.advanceTimersByTimeAsync(800);
  const fallback = shown;
  worker.finish(html('new'));
  await worker.response;
  await worker.settled();
  expect(fallback).toBe('legacy');
  expect(await worker.documents.get(url)!.clone().text()).toBe('new');
});

it('serves saved HTML on network failure', async () => {
  const worker = harness(html('saved', 'previous'));
  worker.fail(new TypeError('offline'));
  expect(await (await worker.response).text()).toBe('saved');
  await worker.settled();
});

it('preserves saved HTML when the server returns an error', async () => {
  const worker = harness(html('saved', 'previous'));
  worker.finish(new Response('unavailable', { status: 503 }));
  expect(await (await worker.response).text()).toBe('saved');
  await worker.settled();
  expect(await worker.documents.get(url)!.clone().text()).toBe('saved');
});

it('waits for the network when a page has never been cached', async () => {
  const worker = harness();
  worker.finish(html('first visit'));
  expect(await (await worker.response).text()).toBe('first visit');
  await worker.settled();
  expect(worker.documents.get(url)!.headers.get('X-Ran-Docs-Version')).toBe('current');
});

it('keeps network navigation working when cache storage is unavailable', async () => {
  const worker = harness(undefined, true);
  worker.finish(html('network page'));
  expect(await (await worker.response).text()).toBe('network page');
  await worker.settled();
});

it('removes cached pages that have been deleted on the server', async () => {
  const worker = harness(html('deleted page', 'previous'));
  worker.finish(new Response('not found', { status: 404 }));
  expect((await worker.response).status).toBe(404);
  await worker.settled();
  expect(worker.documents.has(url)).toBe(false);
});

it('does not turn a followed redirect into a cached page at the original URL', async () => {
  const worker = harness(html('old page', 'previous'));
  const redirected = html('destination');
  Object.defineProperty(redirected, 'redirected', { value: true });
  worker.finish(redirected);
  expect(await worker.response).toBe(redirected);
  await worker.settled();
  expect(worker.documents.has(url)).toBe(false);
});

it('returns a network error when offline and no saved page exists', async () => {
  const worker = harness();
  worker.fail(new TypeError('offline'));
  expect((await worker.response).status).toBe(408);
  await worker.settled();
});
