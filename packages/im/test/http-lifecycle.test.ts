import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { afterEach, expect, it, vi } from 'vitest';
import IMController from '@/app/controllers/im';
import { createContext } from '@/app/lib/context';

const servers: Server[] = [];
const listen = async (server: Server): Promise<string> => {
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected TCP address');
  return `http://127.0.0.1:${address.port}`;
};
const app = () =>
  createServer((req, res) => {
    void createContext(req, res, {}).then((ctx) => new IMController().dialog(ctx));
  });

afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve) => {
          server.closeAllConnections();
          server.close(() => resolve());
        }),
    ),
  );
});

it('streams the complete demo after the POST body has finished', async () => {
  vi.stubEnv('IM_API_KEY', '');
  const origin = await listen(app());
  const response = await fetch(origin, { method: 'POST', body: JSON.stringify({ question: 'hi' }) });
  const body = await response.text();
  expect(body).toContain('春江');
  expect(body).toContain('data: [DONE]');
}, 10_000);

it('keeps the live response open after the POST body has finished', async () => {
  const expected = 'data: {"choices":[{"delta":{"content":"你好"}}]}\n\ndata: [DONE]\n\n';
  const upstream = await listen(
    createServer((req, res) => {
      req.resume();
      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        setImmediate(() => res.end(expected));
      });
    }),
  );
  vi.stubEnv('IM_API_KEY', 'test-key');
  vi.stubEnv('IM_BASE_URL', upstream);
  const origin = await listen(app());
  const response = await fetch(origin, { method: 'POST', body: JSON.stringify({ question: 'hi' }) });
  expect(await response.text()).toBe(expected);
});

it('cancels the upstream stream when the client disconnects', async () => {
  let disconnected!: () => void;
  const closed = new Promise<void>((resolve) => {
    disconnected = resolve;
  });
  const upstream = await listen(
    createServer((req, res) => {
      req.resume();
      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        res.write('data: first\n\n');
        res.on('close', disconnected);
      });
    }),
  );
  vi.stubEnv('IM_API_KEY', 'test-key');
  vi.stubEnv('IM_BASE_URL', upstream);
  const origin = await listen(app());
  const response = await fetch(origin, { method: 'POST', body: '{}' });
  const reader = response.body!.getReader();
  expect((await reader.read()).done).toBe(false);
  await reader.cancel();
  await closed;
});
