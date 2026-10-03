// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

let requests: string[];
let connection: EventTarget & { saveData: boolean; effectiveType: string };
let serviceWorker: EventTarget & {
  controller: { postMessage: (message: any, ports?: any[]) => void };
  ready: Promise<void>;
};
let unmount: (() => void) | undefined;

beforeEach(() => {
  vi.useFakeTimers();
  requests = [];
  document.documentElement.lang = 'zh';
  document.body.innerHTML = '<main class="doc"></main>';
  connection = Object.assign(new EventTarget(), { saveData: false, effectiveType: '4g' });
  serviceWorker = Object.assign(new EventTarget(), {
    ready: Promise.resolve(),
    controller: {
      postMessage: (message: any, ports?: any[]) => {
        requests.push(message.type);
        if (ports)
          queueMicrotask(() =>
            ports[0].receive(
              message.type === 'OFFLINE_STATUS'
                ? { state: 'working', completed: 0, total: 10 }
                : { state: 'ready', completed: 10, total: 10 },
            ),
          );
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
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: serviceWorker });
  Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  const storage = (globalThis as unknown as { jsdom: { window: Window } }).jsdom.window.localStorage;
  storage.clear();
  vi.stubGlobal('localStorage', storage);
});
afterEach(() => {
  unmount?.();
  unmount = undefined;
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete (navigator as any).serviceWorker;
  delete (navigator as any).connection;
  delete (navigator as any).onLine;
  delete (document as any).visibilityState;
});
const mount = async () => {
  const module = await import('../client/offline.ts').catch(() => null);
  unmount = module?.mountOfflineCache();
};

it('waits for idle time after interaction and shows completed offline coverage', async () => {
  await mount();
  await vi.advanceTimersByTimeAsync(1000);
  window.dispatchEvent(new Event('pointerdown'));
  await vi.advanceTimersByTimeAsync(1000);
  expect(requests.filter((type) => type === 'OFFLINE_BATCH')).toHaveLength(0);
  await vi.advanceTimersByTimeAsync(1000);
  expect(document.querySelector('[data-offline-state="ready"]')).not.toBeNull();
  expect(document.querySelector('progress')?.value).toBe(10);
});

it('pauses on data saver and resumes when the connection policy permits', async () => {
  connection.saveData = true;
  await mount();
  await vi.advanceTimersByTimeAsync(5000);
  expect(requests.filter((type) => type === 'OFFLINE_BATCH')).toHaveLength(0);
  expect(document.querySelector('[data-offline-state="connection"]')).not.toBeNull();
  connection.saveData = false;
  connection.dispatchEvent(new Event('change'));
  await vi.advanceTimersByTimeAsync(3000);
  expect(document.querySelector('[data-offline-state="ready"]')).not.toBeNull();
});

it('keeps a reader-requested pause across page mounts', async () => {
  await mount();
  document.querySelector<HTMLButtonElement>('[data-offline-toggle]')?.click();
  unmount?.();
  await mount();
  await vi.advanceTimersByTimeAsync(5000);
  expect(document.querySelector('[data-offline-state="paused"]')).not.toBeNull();
  expect(requests.filter((type) => type === 'OFFLINE_BATCH')).toHaveLength(0);
});

it('resumes idle preparation after returning through the browser back-forward cache', async () => {
  await mount();
  window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
  window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  await vi.advanceTimersByTimeAsync(3000);
  expect(document.querySelector('[data-offline-state="ready"]')).not.toBeNull();
});

it('does not download automatically on a slow connection', async () => {
  connection.effectiveType = '3g';
  await mount();
  await vi.advanceTimersByTimeAsync(5000);
  expect(requests.filter((type) => type === 'OFFLINE_BATCH')).toHaveLength(0);
  expect(document.querySelector('[data-offline-state="connection"]')).not.toBeNull();
});

it('synchronizes a manual pause from another tab', async () => {
  await mount();
  window.dispatchEvent(new StorageEvent('storage', { key: 'ran.docs.offline.paused', newValue: 'true' }));
  await vi.advanceTimersByTimeAsync(5000);
  expect(document.querySelector('[data-offline-state="paused"]')).not.toBeNull();
  expect(requests.filter((type) => type === 'OFFLINE_BATCH')).toHaveLength(0);
});

it('uses the site’s Chinese locale tag for offline status', async () => {
  document.documentElement.lang = 'zh-CN';
  await mount();
  expect(document.querySelector('.offline-cache__title')?.textContent).toBe('离线阅读');
});

it('shows saved readiness when reopening offline, without requesting a batch', async () => {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
  serviceWorker.controller.postMessage = (message: any, ports?: any[]) => {
    requests.push(message.type);
    if (ports) queueMicrotask(() => ports[0].receive({ state: 'ready', completed: 10, total: 10 }));
  };
  await mount();
  await vi.advanceTimersByTimeAsync(3000);
  expect(document.querySelector('[data-offline-state="ready"]')).not.toBeNull();
  expect(requests.filter((type) => type === 'OFFLINE_BATCH')).toHaveLength(0);
});

it('prepares local top navigation destinations before unrelated component assets', async () => {
  document.body.innerHTML = `<nav class="nav">
    <a href="/src/ranui/">ranui</a>
    <a href="/cn/src/ranuts/">ranuts</a>
    <a href="https://edit.chaxus.com/">editor</a>
  </nav><main class="doc"></main>`;
  vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
    { name: new URL('/assets/button.hash.js', location.href).href } as PerformanceEntry,
    { name: 'https://external.test/analytics.js' } as PerformanceEntry,
  ]);
  let priority: string[] | undefined;
  const send = serviceWorker.controller.postMessage;
  serviceWorker.controller.postMessage = (message, ports) => {
    if (message.type === 'OFFLINE_BATCH') priority = message.priority;
    send(message, ports);
  };
  await mount();
  await vi.advanceTimersByTimeAsync(3000);
  expect(priority).toEqual(['/src/ranui/', '/cn/src/ranuts/', '/assets/button.hash.js']);
});
