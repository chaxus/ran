import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, it } from 'vitest';

const origin = 'https://ran.test';
const path = '/src/ranuts/migration/';
const url = origin + path;
const stateUrl = `${origin}/__offline__/state.json`;
const html = (body: string, version?: string) =>
  new Response(body, {
    headers: { 'Content-Type': 'text/html', ...(version ? { 'X-Ran-Docs-Version': version } : {}) },
  });
const harness = (outcome: number | 'redirect' | 'offline') => {
  const documents = new Map([[url, html('old migration guide', 'previous')]]);
  const state = new Map([[stateUrl, new Response(JSON.stringify({ done: [path] }))]]);
  const caches = new Map([
    ['chaxus_ran_documents', documents],
    ['chaxus_ran_current', state],
  ]);
  const listeners = new Map<string, (event: any) => void>();
  let offline = false;
  let claimed = false;
  runInNewContext(
    readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8') +
      '\n' +
      readFileSync(new URL('../public/offline-worker.js', import.meta.url), 'utf8'),
    {
      VERSION: 'current',
      SERVICE_WORK_CACHE_FILE_PATHS: [],
      OFFLINE_MANIFEST: { shared: [], deferred: [], locales: { en: [path] } },
      location: { origin },
      URL,
      Response,
      ReadableStream,
      AbortController,
      DOMException,
      Date,
      setTimeout,
      clearTimeout,
      navigator: { storage: {} },
      console: { log() {} },
      clients: {
        matchAll: async () => [{ url }],
        claim: async () => {
          claimed = true;
        },
      },
      addEventListener: (type: string, listener: (event: any) => void) => listeners.set(type, listener),
      caches: {
        open: async (name: string) => {
          if (!caches.has(name)) caches.set(name, new Map());
          const cache = caches.get(name)!;
          return {
            match: async (key: string) => cache.get(key)?.clone(),
            put: async (key: string, response: Response) => {
              cache.set(key, response.clone());
            },
            delete: async (key: string) => cache.delete(key),
          };
        },
        keys: async () => [...caches.keys()],
        delete: async (name: string) => caches.delete(name),
      },
      fetch: async () => {
        if (offline || outcome === 'offline') throw new TypeError('offline');
        if (outcome === 'redirect') {
          const response = html('redirect destination');
          Object.defineProperty(response, 'redirected', { value: true });
          return response;
        }
        return outcome === 200 ? html('updated guide') : new Response('unavailable', { status: outcome });
      },
    },
  );
  return {
    documents,
    state,
    claimed: () => claimed,
    warm: async (event: 'install' | 'activate') => {
      const waits: Promise<unknown>[] = [];
      listeners.get(event)!.call({ skipWaiting() {} }, { waitUntil: (work: Promise<unknown>) => waits.push(work) });
      await Promise.all(waits);
    },
    navigateOffline: async () => {
      offline = true;
      let result!: Promise<Response>;
      const waits: Promise<unknown>[] = [];
      listeners.get('fetch')!({
        request: { url, method: 'GET', mode: 'navigate', headers: new Headers() },
        respondWith: (response: Promise<Response>) => {
          result = response;
        },
        waitUntil: (work: Promise<unknown>) => waits.push(work),
      });
      const response = await result;
      await Promise.all(waits);
      return response;
    },
  };
};

for (const event of ['install', 'activate'] as const) {
  it.each([404, 410, 'redirect'] as const)(`${event} invalidates a saved route after %s`, async (outcome) => {
    const worker = harness(outcome);
    await worker.warm(event);
    expect(worker.documents.has(url)).toBe(false);
    expect(await worker.state.get(stateUrl)!.clone().json()).toEqual({ done: [] });
    expect((await worker.navigateOffline()).status).toBe(408);
    if (event === 'activate') expect(worker.claimed()).toBe(true);
  });

  it.each([503, 'offline'] as const)(`${event} preserves saved documents during %s failure`, async (outcome) => {
    const worker = harness(outcome);
    await worker.warm(event);
    expect(await worker.documents.get(url)!.clone().text()).toBe('old migration guide');
    expect(await worker.state.get(stateUrl)!.clone().json()).toEqual({ done: [path] });
    expect(await (await worker.navigateOffline()).text()).toBe('old migration guide');
  });

  it(`${event} stores valid updated HTML with the current deployment version`, async () => {
    const worker = harness(200);
    await worker.warm(event);
    const saved = worker.documents.get(url)!;
    expect(await saved.clone().text()).toBe('updated guide');
    expect(saved.headers.get('X-Ran-Docs-Version')).toBe('current');
  });
}
