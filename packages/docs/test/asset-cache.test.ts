import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, it } from 'vitest';

const origin = 'https://ran.test';
const url = `${origin}/assets/docs.hash.js`;
const load = async (failure: 'open' | 'match' | 'put' | 'network' | 'none') => {
  const listeners = new Map<string, (event: any) => void>();
  const writes: Promise<unknown>[] = [];
  let requests = 0;
  runInNewContext(readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
    VERSION: 'current',
    location: { origin },
    URL,
    Response,
    console: { log() {} },
    addEventListener: (type: string, listener: (event: any) => void) => listeners.set(type, listener),
    caches: {
      open: async () => {
        if (failure === 'open') throw new Error('cache unavailable');
        return {
          match: async () => {
            if (failure === 'match') throw new Error('cache read failed');
            return undefined;
          },
          put: async () => {
            if (failure === 'put') throw new DOMException('full', 'QuotaExceededError');
          },
        };
      },
    },
    fetch: async () => {
      requests++;
      if (failure === 'network') throw new TypeError('offline');
      return new Response('export const available = true;', { headers: { 'Content-Type': 'text/javascript' } });
    },
  });
  let result!: Promise<Response>;
  listeners.get('fetch')!({
    request: new Request(url),
    respondWith: (response: Promise<Response>) => {
      result = response;
    },
    waitUntil: (write: Promise<unknown>) => writes.push(write),
  });
  const response = await result;
  await Promise.all(writes);
  return { response, requests };
};

it.each(['open', 'match'] as const)('loads scripts from a healthy network when cache %s fails', async (failure) => {
  const { response, requests } = await load(failure);
  expect(response.status).toBe(200);
  expect(response.headers.get('Content-Type')).toBe('text/javascript');
  expect(await response.text()).toBe('export const available = true;');
  expect(requests).toBe(1);
});

it('does not repeat a healthy network request when the cache write fails', async () => {
  const { response, requests } = await load('put');
  expect(await response.text()).toBe('export const available = true;');
  expect(requests).toBe(1);
});

it('returns a network error when an uncached asset cannot be fetched', async () => {
  const { response, requests } = await load('network');
  expect(response.status).toBe(408);
  expect(requests).toBe(1);
});
