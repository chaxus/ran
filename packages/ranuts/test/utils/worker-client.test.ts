import { describe, expect, it, vi } from 'vitest';
import { WorkerClient } from '@/utils';
import type { WorkerClientOptions } from '@/utils';

interface Req {
  type: string;
  payload?: unknown;
}
interface Res {
  operationId: number;
  type: string;
  payload?: unknown;
  progress?: number;
  message?: string;
}

/** A minimal Worker stand-in: records what it receives and lets the test post responses back by hand */
class FakeWorker {
  static instances: FakeWorker[] = [];
  sent: Array<Req & { operationId: number }> = [];
  terminated = false;
  onmessage: ((event: MessageEvent<Res>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;

  constructor() {
    FakeWorker.instances.push(this);
  }
  postMessage(data: Req & { operationId: number }): void {
    this.sent.push(data);
  }
  terminate(): void {
    this.terminated = true;
  }
  reply(response: Res): void {
    this.onmessage?.({ data: response } as MessageEvent<Res>);
  }
  crash(message: string): void {
    this.onerror?.({ message } as ErrorEvent);
  }
}

type ClientOptions = Omit<WorkerClientOptions<Res, number>, 'create'>;

const makeClient = (
  options: Partial<ClientOptions> = {},
): { client: WorkerClient<Req, Res, number>; worker: () => FakeWorker } => {
  FakeWorker.instances = [];
  const client = new WorkerClient<Req, Res, number>({
    create: () => new FakeWorker() as unknown as Worker,
    ...options,
  });
  return { client, worker: (): FakeWorker => FakeWorker.instances[FakeWorker.instances.length - 1] };
};

describe('WorkerClient', () => {
  it('creates the worker lazily, on first send', () => {
    const { client } = makeClient();
    expect(client.active).toBe(false);
    void client.send({ type: 'ping' });
    expect(client.active).toBe(true);
    expect(FakeWorker.instances).toHaveLength(1);
  });

  it('stamps an incrementing operationId onto each request', () => {
    const { client, worker } = makeClient();
    void client.send({ type: 'a' });
    void client.send({ type: 'b' });
    expect(worker().sent).toEqual([
      { type: 'a', operationId: 1 },
      { type: 'b', operationId: 2 },
    ]);
  });

  it('routes each response back to its own request, regardless of order', async () => {
    const { client, worker } = makeClient();
    const first = client.send({ type: 'a' });
    const second = client.send({ type: 'b' });
    // Out-of-order replies: answer the second request first
    worker().reply({ operationId: 2, type: 'result', payload: 'B' });
    worker().reply({ operationId: 1, type: 'result', payload: 'A' });
    await expect(first).resolves.toMatchObject({ payload: 'A' });
    await expect(second).resolves.toMatchObject({ payload: 'B' });
    expect(client.pendingCount).toBe(0);
  });

  it('forwards progress messages without settling the request', async () => {
    const { client, worker } = makeClient();
    const onProgress = vi.fn();
    const promise = client.send({ type: 'load' }, onProgress);
    worker().reply({ operationId: 1, type: 'progress', progress: 40 });
    worker().reply({ operationId: 1, type: 'progress', progress: 80 });
    expect(onProgress.mock.calls).toEqual([[40], [80]]);
    expect(client.pendingCount).toBe(1);
    worker().reply({ operationId: 1, type: 'loaded' });
    await expect(promise).resolves.toMatchObject({ type: 'loaded' });
  });

  it('rejects on an error response, carrying the message through', async () => {
    const { client, worker } = makeClient();
    const promise = client.send({ type: 'load' });
    worker().reply({ operationId: 1, type: 'error', message: 'model missing' });
    await expect(promise).rejects.toThrow('model missing');
  });

  it('rejects every in-flight request when the worker crashes', async () => {
    const { client, worker } = makeClient();
    const first = client.send({ type: 'a' });
    const second = client.send({ type: 'b' });
    worker().crash('boom');
    await expect(first).rejects.toThrow('boom');
    await expect(second).rejects.toThrow('boom');
    expect(client.pendingCount).toBe(0);
  });

  it('terminates and rejects in-flight work on dispose, then rebuilds on next send', async () => {
    const { client, worker } = makeClient();
    const promise = client.send({ type: 'a' });
    const first = worker();
    client.dispose();
    await expect(promise).rejects.toThrow('worker disposed');
    expect(first.terminated).toBe(true);
    expect(client.active).toBe(false);

    void client.send({ type: 'b' });
    expect(FakeWorker.instances).toHaveLength(2);
  });

  it('ignores a late response for an already-settled request', async () => {
    const { client, worker } = makeClient();
    const promise = client.send({ type: 'a' });
    worker().reply({ operationId: 1, type: 'result' });
    await promise;
    expect(() => worker().reply({ operationId: 1, type: 'result' })).not.toThrow();
  });

  it('times out a request without killing the worker', async () => {
    vi.useFakeTimers();
    try {
      const { client, worker } = makeClient({ timeout: 100 });
      const promise = client.send({ type: 'slow' });
      vi.advanceTimersByTime(101);
      await expect(promise).rejects.toThrow(/timed out/);
      expect(worker().terminated).toBe(false);
      expect(client.active).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('honours custom progress/error predicates', async () => {
    const { client, worker } = makeClient({
      isProgress: (r: Res) => r.type === 'tick',
      getProgress: (r: Res) => (r.payload as number) ?? 0,
      isError: (r: Res) => r.type === 'nope',
      getErrorMessage: () => 'custom failure',
    });
    const onProgress = vi.fn();
    const promise = client.send({ type: 'go' }, onProgress);
    worker().reply({ operationId: 1, type: 'tick', payload: 7 });
    expect(onProgress).toHaveBeenCalledWith(7);
    worker().reply({ operationId: 1, type: 'nope' });
    await expect(promise).rejects.toThrow('custom failure');
  });
});
