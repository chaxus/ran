// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { mountIdlePrefetch } from '../client/idle-prefetch.ts';

let requests: string[];
let reply: string;
let connection: EventTarget & { saveData: boolean; effectiveType: string };
let worker: EventTarget & { controller: { postMessage: (message: any, ports?: any[]) => void } };
let stop: (() => void) | undefined;
beforeEach(() => {
  vi.useFakeTimers();
  requests = [];
  reply = 'ready';
  document.body.innerHTML = '<main class="doc">Documentation</main>';
  connection = Object.assign(new EventTarget(), { saveData: false, effectiveType: '4g' });
  worker = Object.assign(new EventTarget(), {
    controller: {
      postMessage: (message: any, ports?: any[]) => {
        requests.push(message.type);
        if (ports && reply !== 'pending') queueMicrotask(() => ports[0].receive({ state: reply }));
      },
    },
  });
  vi.stubGlobal(
    'MessageChannel',
    class {
      port1 = { onmessage: null as ((event: any) => void) | null, close() {} };
      port2 = { receive: (data: any) => this.port1.onmessage?.({ data }), close() {} };
    },
  );
  vi.stubGlobal('requestIdleCallback', (callback: () => void) => setTimeout(callback, 1));
  vi.stubGlobal('cancelIdleCallback', (id: number) => clearTimeout(id));
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: worker });
  Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});
afterEach(() => {
  stop?.();
  stop = undefined;
  vi.useRealTimers();
  vi.unstubAllGlobals();
  for (const key of ['serviceWorker', 'connection', 'onLine']) Reflect.deleteProperty(navigator, key);
  Reflect.deleteProperty(document, 'visibilityState');
});
const mount = () => {
  stop = mountIdlePrefetch();
};
const batches = () => requests.filter((type) => type === 'OFFLINE_BATCH').length;

it('waits until interaction settles, downloads silently, and stops after completion', async () => {
  await mount();
  await vi.advanceTimersByTimeAsync(1000);
  window.dispatchEvent(new Event('pointerdown'));
  await vi.advanceTimersByTimeAsync(1000);
  expect(batches()).toBe(0);
  await vi.advanceTimersByTimeAsync(1000);
  expect(batches()).toBe(1);
  await vi.advanceTimersByTimeAsync(60000);
  expect(batches()).toBe(1);
  expect(document.body.innerHTML).toBe('<main class="doc">Documentation</main>');
});

it.each(['hidden', 'offline', 'save-data', 'slow'])('waits for %s policy to permit idle downloads', async (policy) => {
  if (policy === 'hidden') Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
  if (policy === 'offline') Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
  if (policy === 'save-data') connection.saveData = true;
  if (policy === 'slow') connection.effectiveType = '3g';
  await mount();
  await vi.advanceTimersByTimeAsync(5000);
  expect(batches()).toBe(0);
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  connection.saveData = false;
  connection.effectiveType = '4g';
  document.dispatchEvent(new Event('visibilitychange'));
  connection.dispatchEvent(new Event('change'));
  window.dispatchEvent(new Event('online'));
  await vi.advanceTimersByTimeAsync(3000);
  expect(batches()).toBe(1);
});

it('interrupts active work on interaction and resumes through another idle grant', async () => {
  reply = 'pending';
  await mount();
  await vi.advanceTimersByTimeAsync(2000);
  expect(batches()).toBe(1);
  window.dispatchEvent(new Event('keydown'));
  expect(requests).toContain('OFFLINE_PAUSE');
  reply = 'ready';
  await vi.advanceTimersByTimeAsync(3000);
  expect(batches()).toBe(2);
});

it('suspends in the back-forward cache and resumes when the page returns', async () => {
  await mount();
  window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
  await vi.advanceTimersByTimeAsync(5000);
  expect(batches()).toBe(0);
  window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  await vi.advanceTimersByTimeAsync(3000);
  expect(batches()).toBe(1);
});

it('backs off after network failures and stops on storage exhaustion', async () => {
  reply = 'network';
  await mount();
  await vi.advanceTimersByTimeAsync(2000);
  expect(batches()).toBe(1);
  await vi.advanceTimersByTimeAsync(29000);
  expect(batches()).toBe(1);
  reply = 'storage';
  await vi.advanceTimersByTimeAsync(2000);
  expect(batches()).toBe(2);
  await vi.advanceTimersByTimeAsync(60000);
  expect(batches()).toBe(2);
});

it('starts a new deploy after worker control changes, but releases listeners when disposed', async () => {
  await mount();
  await vi.advanceTimersByTimeAsync(2000);
  worker.dispatchEvent(new Event('controllerchange'));
  await vi.advanceTimersByTimeAsync(2000);
  expect(batches()).toBe(2);
  stop?.();
  worker.dispatchEvent(new Event('controllerchange'));
  window.dispatchEvent(new Event('online'));
  await vi.advanceTimersByTimeAsync(5000);
  expect(batches()).toBe(2);
});

it('yields when the reader scrolls a nested non-bubbling reading surface', async () => {
  reply = 'pending';
  const scroller = document.createElement('div');
  document.querySelector('.doc')!.append(scroller);
  await mount();
  await vi.advanceTimersByTimeAsync(2000);
  expect(batches()).toBe(1);
  scroller.dispatchEvent(new Event('scroll', { bubbles: false }));
  expect(requests).toContain('OFFLINE_PAUSE');
  reply = 'ready';
  await vi.advanceTimersByTimeAsync(3000);
  expect(batches()).toBe(2);
});
