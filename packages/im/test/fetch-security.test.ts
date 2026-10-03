import { IncomingMessage } from 'node:http';
import * as http from 'node:http';
import * as https from 'node:https';
import * as dns from 'node:dns/promises';
import { Socket } from 'node:net';
import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import IMController from '@/app/controllers/im';
import type { Context } from '@/app/types/index';

vi.mock('node:dns/promises', () => ({ lookup: vi.fn() }));
vi.mock('node:http', async (original) => ({ ...(await original<typeof http>()), request: vi.fn() }));

vi.mock('node:https', async (original) => ({ ...(await original<typeof https>()), request: vi.fn() }));

const responses: IncomingMessage[] = [];
const response = (status: number, body: string, headers = {}): IncomingMessage => {
  const incoming = new IncomingMessage(new Socket());
  incoming.statusCode = status;
  incoming.headers = headers;
  incoming.push(Buffer.from(body));
  incoming.push(null);
  responses.push(incoming);
  return incoming;
};
const run = async (url: string): Promise<{ text?: string; error?: string }> => {
  let result = '';
  const ctx = {
    request: { body: { url } },
    res: {
      writeHead() {},
      end(body: string) {
        result = body;
      },
    },
  } as unknown as Context;
  await new IMController().fetch(ctx);
  return JSON.parse(result);
};

beforeEach(() => {
  vi.mocked(dns.lookup).mockImplementation(async () => [{ address: '93.184.216.34', family: 4 }] as never);
  vi.mocked(http.request).mockImplementation(((...args: unknown[]) => {
    const callback = args[args.length - 1] as (res: IncomingMessage) => void;
    const req = Object.assign(new EventEmitter(), {
      end() {
        callback(responses.shift()!);
      },
    });
    return req;
  }) as typeof http.request);
  vi.mocked(https.request).mockImplementation(vi.mocked(http.request).getMockImplementation()! as typeof https.request);
  vi.stubGlobal('fetch', async () => new Response('upstream text'));
});
afterEach(() => {
  responses.splice(0).forEach((res) => res.destroy());
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it('refuses a public hostname resolving to a private address', async () => {
  vi.mocked(dns.lookup).mockImplementation(async () => [{ address: '127.0.0.1', family: 4 }] as never);
  expect(await run('http://example.com/')).toHaveProperty('error');
});

it('rejects a redirect to an internal host before connecting to it', async () => {
  response(302, '', { location: 'http://127.0.0.1/private' });
  expect(await run('http://example.com/')).toHaveProperty('error');
});

it('limits decoded response bytes even when the text contains multibyte characters', async () => {
  const body = '你'.repeat(100_000);
  response(200, body);
  vi.stubGlobal('fetch', async () => new Response(body));
  const result = await run('http://example.com/');
  expect(result.error).toBeUndefined();
  expect(Buffer.byteLength(result.text!)).toBeLessThanOrEqual(200_000);
  expect(result.text).not.toContain('\uFFFD');
});

it('follows a public relative redirect and returns its page', async () => {
  response(302, '', { location: '/next' });
  response(200, 'next page');
  expect(await run('http://example.com/')).toEqual({ text: 'next page' });
});

it('stops redirect loops', async () => {
  for (let i = 0; i < 6; i++) response(302, '', { location: '/again' });
  expect(await run('http://example.com/')).toHaveProperty('error');
});

it('pins HTTPS connections to the validated IP and retains the original TLS identity', async () => {
  response(200, 'secure page');
  expect(await run('https://example.com:8443/path')).toEqual({ text: 'secure page' });
  const [url, options] = vi.mocked(https.request).mock.calls[0] as unknown as [URL, https.RequestOptions];
  expect(url.port).toBe('8443');
  expect(options.hostname).toBe('93.184.216.34');
  expect(options.servername).toBe('example.com');
  expect(options.headers).toHaveProperty('host', 'example.com:8443');
  expect(options.agent).toBe(false);
  expect(options.rejectUnauthorized).not.toBe(false);
});

it('propagates TLS verification failures without retrying an insecure connection', async () => {
  vi.mocked(https.request).mockImplementation((() => {
    const req = Object.assign(new EventEmitter(), {
      end() {
        queueMicrotask(() => req.emit('error', new Error('certificate hostname mismatch')));
      },
    });
    return req;
  }) as unknown as typeof https.request);
  expect(await run('https://example.com/')).toHaveProperty('error');
  expect(https.request).toHaveBeenCalledTimes(1);
  expect(http.request).not.toHaveBeenCalled();
});
