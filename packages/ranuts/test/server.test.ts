import type { Server as HttpServer } from 'node:http';
import { afterEach, describe, expect, it } from 'vitest';
import { Router, Server, body } from '@/node';

const servers: HttpServer[] = [];
async function listen(app: Server): Promise<string> {
  const server = app.listen(0, '127.0.0.1');
  servers.push(server);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected TCP address');
  return `http://127.0.0.1:${address.port}`;
}

afterEach(async () => {
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

describe('Server request contexts', () => {
  it('isolates request identity and state while another request is running', async () => {
    const app = new Server();
    let started!: () => void;
    let release!: () => void;
    const firstStarted = new Promise<void>((resolve) => {
      started = resolve;
    });
    const secondArrived = new Promise<void>((resolve) => {
      release = resolve;
    });
    app.use(async (ctx) => {
      const response = ctx.res;
      if (ctx.req.url === '/first') {
        ctx.user = 'alice';
        started();
        await secondArrived;
        response.end(JSON.stringify({ url: ctx.req.url, user: ctx.user }));
      } else {
        ctx.user = 'bob';
        release();
        response.end('second');
      }
    });
    const origin = await listen(app);
    const first = fetch(`${origin}/first`);
    await firstStarted;
    expect(await (await fetch(`${origin}/second`)).text()).toBe('second');
    expect(await (await first).json()).toEqual({ url: '/first', user: 'alice' });
  });

  it('preserves application defaults without retaining middleware state between requests', async () => {
    const app = new Server();
    app.ctx.application = 'example';
    app.use((ctx) => {
      const previous = ctx.previous ?? null;
      ctx.previous = ctx.req.url;
      ctx.res.end(JSON.stringify({ previous, application: ctx.application }));
    });
    const origin = await listen(app);
    await fetch(`${origin}/first`);
    expect(await (await fetch(`${origin}/second`)).json()).toEqual({ previous: null, application: 'example' });
    expect(app.ctx.previous).toBeUndefined();
  });

  it('routes parsed JSON bodies through the request middleware', async () => {
    const app = new Server();
    const router = new Router();
    router.post('/echo', (ctx) => ctx.res.end(JSON.stringify(ctx.request.body)));
    app.use(body());
    app.use(router.routes());
    const origin = await listen(app);
    const response = await fetch(`${origin}/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'hello' }),
    });
    expect(await response.json()).toEqual({ text: 'hello' });
  });
});
