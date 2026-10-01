// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountOfflineCache } from '../client/offline.ts';

let idle: Array<() => void>;
let channels: Array<{
  port1: { onmessage: ((event: { data: unknown }) => void) | null; close: ReturnType<typeof vi.fn> };
  port2: object;
}>;
let network: {
  onLine: boolean;
  connection: { saveData: boolean; effectiveType: string };
  serviceWorker: EventTarget & { controller: { postMessage: ReturnType<typeof vi.fn> } };
};
let visibility: DocumentVisibilityState;
let ready: DocumentReadyState;
let listeners: Array<
  [EventTarget, string, EventListenerOrEventListenerObject, AddEventListenerOptions | boolean | undefined]
>;

beforeEach(() => {
  vi.useFakeTimers();
  idle = [];
  channels = [];
  visibility = 'visible';
  ready = 'loading';
  listeners = [];
  const serviceWorker = Object.assign(new EventTarget(), { controller: { postMessage: vi.fn() } });
  network = { onLine: true, connection: { saveData: false, effectiveType: '4g' }, serviceWorker };
  vi.stubGlobal('navigator', network);
  vi.stubGlobal(
    'requestIdleCallback',
    vi.fn((callback: () => void) => {
      idle.push(callback);
      return idle.length;
    }),
  );
  vi.stubGlobal(
    'MessageChannel',
    class {
      port1 = { onmessage: null as ((event: { data: unknown }) => void) | null, close: vi.fn() };
      port2 = {};
      constructor() {
        channels.push(this);
      }
    },
  );
  vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => visibility);
  vi.spyOn(document, 'readyState', 'get').mockImplementation(() => ready);
  // The mount API has no disposer, so remove each mounted listener after its test.
  for (const target of [window, document]) {
    const add = target.addEventListener.bind(target);
    vi.spyOn(target, 'addEventListener').mockImplementation((type, listener, options) => {
      listeners.push([target, type, listener, options]);
      add(type, listener, options);
    });
  }
});

afterEach(() => {
  for (const [target, type, listener, options] of listeners) target.removeEventListener(type, listener, options);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const idleBatch = async () => {
  await vi.advanceTimersByTimeAsync(2000);
  expect(idle).toHaveLength(1);
  idle.shift()!();
};
const reply = async (progress: { complete: boolean; failures?: number }) => {
  channels.at(-1)!.port1.onmessage!({ data: progress });
  await Promise.resolve();
  await Promise.resolve();
};

describe('background offline cache scheduling', () => {
  it('waits for page load, the delay, and browser idle before requesting a batch', async () => {
    mountOfflineCache();
    await vi.advanceTimersByTimeAsync(10000);
    expect(network.serviceWorker.controller.postMessage).not.toHaveBeenCalled();
    expect(idle).toHaveLength(0);
    window.dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(1999);
    expect(idle).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1);
    expect(network.serviceWorker.controller.postMessage).not.toHaveBeenCalled();
    expect(window.requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 5000 });
    idle.shift()!();
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledWith({ type: 'CACHE_OFFLINE_BATCH' }, [
      channels[0].port2,
    ]);
    await reply({ complete: true });
  });

  it.each(['saveData', 'offline', 'hidden', '2g'] as const)(
    'pauses while %s and resumes when conditions permit',
    async (condition) => {
      ready = 'complete';
      if (condition === 'saveData') network.connection.saveData = true;
      if (condition === 'offline') network.onLine = false;
      if (condition === 'hidden') visibility = 'hidden';
      if (condition === '2g') network.connection.effectiveType = '2g';
      mountOfflineCache();
      await vi.advanceTimersByTimeAsync(10000);
      expect(idle).toHaveLength(0);
      expect(network.serviceWorker.controller.postMessage).not.toHaveBeenCalled();
      network.connection.saveData = false;
      network.connection.effectiveType = '4g';
      network.onLine = true;
      visibility = 'visible';
      window.dispatchEvent(new Event('online'));
      document.dispatchEvent(new Event('visibilitychange'));
      await idleBatch();
      expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledTimes(1);
      await reply({ complete: true });
    },
  );

  it('checks conditions again when an already queued idle callback runs', async () => {
    ready = 'complete';
    mountOfflineCache();
    await vi.advanceTimersByTimeAsync(2000);
    visibility = 'hidden';
    idle.shift()!();
    expect(network.serviceWorker.controller.postMessage).not.toHaveBeenCalled();
    visibility = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
    await idleBatch();
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledTimes(1);
    await reply({ complete: true });
  });

  it('queues a new idle batch after incomplete progress and stops after complete progress', async () => {
    ready = 'complete';
    mountOfflineCache();
    await idleBatch();
    window.dispatchEvent(new Event('online'));
    await vi.advanceTimersByTimeAsync(10000);
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledTimes(1);
    expect(idle).toHaveLength(0);
    await reply({ complete: false });
    expect(channels[0].port1.close).toHaveBeenCalledOnce();
    await idleBatch();
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledTimes(2);
    await reply({ complete: true });
    window.dispatchEvent(new Event('online'));
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(120000);
    expect(idle).toHaveLength(0);
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledTimes(2);
    expect(channels[1].port1.close).toHaveBeenCalledOnce();
    // A replacement worker has a new manifest and must get its own batch.
    network.serviceWorker.dispatchEvent(new Event('controllerchange'));
    await idleBatch();
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledTimes(3);
    await reply({ complete: true });
  });
  it('ignores completion from a worker replaced while its batch was running', async () => {
    ready = 'complete';
    mountOfflineCache();
    await idleBatch();
    network.serviceWorker.dispatchEvent(new Event('controllerchange'));
    await reply({ complete: true });
    await idleBatch();
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledTimes(2);
    await reply({ complete: true });
  });

  it('uses the delayed fallback when optional browser APIs are unavailable', async () => {
    ready = 'complete';
    vi.stubGlobal('requestIdleCallback', undefined);
    delete (network as { connection?: unknown }).connection;
    mountOfflineCache();
    await vi.advanceTimersByTimeAsync(1999);
    expect(network.serviceWorker.controller.postMessage).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledOnce();
    await reply({ complete: true });
  });
  it('leaves online reading alone when service workers or message channels are unavailable', async () => {
    ready = 'complete';
    vi.stubGlobal('MessageChannel', undefined);
    mountOfflineCache();
    await vi.advanceTimersByTimeAsync(10000);
    expect(idle).toHaveLength(0);
    vi.stubGlobal('navigator', { onLine: true });
    expect(() => mountOfflineCache()).not.toThrow();
  });

  it('defers the timer fallback while the user is interacting', async () => {
    ready = 'complete';
    vi.stubGlobal('requestIdleCallback', undefined);
    mountOfflineCache();
    await vi.advanceTimersByTimeAsync(1500);
    window.dispatchEvent(new Event('keydown'));
    await vi.advanceTimersByTimeAsync(500);
    expect(network.serviceWorker.controller.postMessage).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1000);
    expect(network.serviceWorker.controller.postMessage).toHaveBeenCalledOnce();
    await reply({ complete: true });
  });
});
