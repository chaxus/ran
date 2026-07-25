import { describe, expect, it, vi } from 'vitest';
import { WorkerClient, serveWorker } from '@/utils';

interface Req {
  operationId: number;
  type: string;
  payload?: unknown;
}

/** A scope stand-in that both `serveWorker` listens on and the test posts into */
const makeScope = () => {
  const listeners = new Set<(event: MessageEvent) => void>();
  const posted: Array<Record<string, unknown>> = [];
  return {
    scope: {
      addEventListener: (_type: 'message', fn: (event: MessageEvent) => void) => void listeners.add(fn),
      removeEventListener: (_type: 'message', fn: (event: MessageEvent) => void) => void listeners.delete(fn),
      postMessage: (message: unknown) => void posted.push(message as Record<string, unknown>),
    },
    posted,
    listenerCount: (): number => listeners.size,
    send: (data: unknown): void => listeners.forEach((fn) => fn({ data } as MessageEvent)),
  };
};

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('serveWorker', () => {
  it('echoes the operationId back on the reply', async () => {
    const { scope, posted, send } = makeScope();
    serveWorker<Req>(() => ({ type: 'result', value: 42 }), { scope });
    send({ operationId: 7, type: 'compute' });
    await flush();
    expect(posted).toEqual([{ type: 'result', value: 42, operationId: 7 }]);
  });

  it('keeps concurrent requests apart', async () => {
    const { scope, posted, send } = makeScope();
    serveWorker<Req>(async (request) => ({ type: 'result', echo: request.operationId }), { scope });
    send({ operationId: 1, type: 'a' });
    send({ operationId: 2, type: 'b' });
    await flush();
    expect(posted.map((p) => [p.operationId, p.echo])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  it('streams progress without settling the request', async () => {
    const { scope, posted, send } = makeScope();
    serveWorker<Req, object, number>(
      async (_request, { progress }) => {
        progress(30);
        progress(80);
        return { type: 'done' };
      },
      { scope },
    );
    send({ operationId: 3, type: 'load' });
    await flush();
    expect(posted).toEqual([
      { type: 'progress', progress: 30, operationId: 3 },
      { type: 'progress', progress: 80, operationId: 3 },
      { type: 'done', operationId: 3 },
    ]);
  });

  it('turns a rejected promise into an error envelope', async () => {
    const { scope, posted, send } = makeScope();
    serveWorker<Req>(
      async () => {
        throw new Error('model missing');
      },
      { scope },
    );
    send({ operationId: 4, type: 'load' });
    await flush();
    expect(posted).toEqual([{ type: 'error', message: 'model missing', operationId: 4 }]);
  });

  it('catches a synchronous throw instead of letting it escape the listener', async () => {
    // Regression guard: a sync throw inside onmessage would reach the worker's error handler,
    // which carries no operationId — so the client could only fail every in-flight request.
    const { scope, posted, send } = makeScope();
    serveWorker<Req>(
      () => {
        throw new Error('sync boom');
      },
      { scope },
    );
    expect(() => send({ operationId: 5, type: 'x' })).not.toThrow();
    await flush();
    expect(posted).toEqual([{ type: 'error', message: 'sync boom', operationId: 5 }]);
  });

  it('stringifies a non-Error rejection', async () => {
    const { scope, posted, send } = makeScope();
    serveWorker<Req>(async () => Promise.reject('plain string'), { scope });
    send({ operationId: 6, type: 'x' });
    await flush();
    expect(posted[0]).toMatchObject({ type: 'error', message: 'plain string' });
  });

  it('ignores messages that carry no operationId', async () => {
    const { scope, posted, send } = makeScope();
    const handler = vi.fn(() => ({ type: 'result' }));
    serveWorker<Req>(handler, { scope });
    send({ type: 'some-framework-ping' });
    send(null);
    await flush();
    expect(handler).not.toHaveBeenCalled();
    expect(posted).toEqual([]);
  });

  it('wraps a non-object return value', async () => {
    const { scope, posted, send } = makeScope();
    serveWorker<Req>(() => 'plain' as unknown as object, { scope, resultType: 'value' });
    send({ operationId: 8, type: 'x' });
    await flush();
    expect(posted).toEqual([{ type: 'value', result: 'plain', operationId: 8 }]);
  });

  it('returns a stop function that removes the listener', () => {
    const { scope, listenerCount } = makeScope();
    const stop = serveWorker<Req>(() => ({}), { scope });
    expect(listenerCount()).toBe(1);
    stop();
    expect(listenerCount()).toBe(0);
  });

  it('is a no-op where there is no scope to listen on', () => {
    expect(() => serveWorker(() => ({}), { scope: undefined })()).not.toThrow();
  });
});

describe('serveWorker ↔ WorkerClient round trip', () => {
  /** Wire a client and a server together through a pair of in-memory scopes */
  const connect = () => {
    const toWorker = makeScope();
    let clientOnMessage: ((event: MessageEvent) => void) | null = null;

    serveWorker<Req, object, number>(
      async (request, { progress }) => {
        if (request.type === 'load') {
          progress(50);
          return { type: 'loaded', device: 'wasm' };
        }
        if (request.type === 'fail') throw new Error('nope');
        return { type: 'result', echo: request.payload };
      },
      {
        scope: {
          ...toWorker.scope,
          // Replies travel back into the client's onmessage
          postMessage: (message: unknown) => clientOnMessage?.({ data: message } as MessageEvent),
        },
      },
    );

    const fakeWorker = {
      postMessage: (data: unknown) => toWorker.send(data),
      terminate: () => {},
      set onmessage(fn: (event: MessageEvent) => void) {
        clientOnMessage = fn;
      },
      set onerror(_fn: unknown) {},
    };

    return new WorkerClient<{ type: string; payload?: unknown }, never, number>({
      create: () => fakeWorker as unknown as Worker,
    });
  };

  it('resolves a request end to end, progress included', async () => {
    const client = connect();
    const onProgress = vi.fn();
    const response = await client.send({ type: 'load' }, onProgress);
    expect(onProgress).toHaveBeenCalledWith(50);
    expect(response).toMatchObject({ type: 'loaded', device: 'wasm' });
  });

  it('routes each reply to its own caller', async () => {
    const client = connect();
    const [a, b] = await Promise.all([
      client.send({ type: 'echo', payload: 'A' }),
      client.send({ type: 'echo', payload: 'B' }),
    ]);
    expect(a).toMatchObject({ echo: 'A' });
    expect(b).toMatchObject({ echo: 'B' });
  });

  it('surfaces a handler failure as a rejection on the client', async () => {
    const client = connect();
    await expect(client.send({ type: 'fail' })).rejects.toThrow('nope');
  });
});
