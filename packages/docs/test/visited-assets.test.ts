// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cacheVisitedAssets } from '../client/visited-assets';

let receive: (entries: PerformanceResourceTiming[]) => void;
const disconnect = vi.fn();
const worker = Object.assign(new EventTarget(), { controller: null as object | null });
const resource = (name: string, workerStart = 0) => ({ name, workerStart }) as PerformanceResourceTiming;
const setup = () => {
  worker.controller = null;
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: worker });
  vi.stubGlobal(
    'PerformanceObserver',
    class {
      constructor(callback: (list: { getEntries(): PerformanceResourceTiming[] }) => void) {
        receive = (entries) => callback({ getEntries: () => entries });
      }
      observe() {}
      disconnect = disconnect;
    },
  );
};
afterEach(() => {
  window.dispatchEvent(new Event('pagehide'));
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, 'serviceWorker');
  vi.clearAllMocks();
});

it('fills only resources actually requested before first worker control, including late responses', async () => {
  setup();
  const fetch = vi.fn().mockResolvedValue(new Response());
  vi.stubGlobal('fetch', fetch);
  cacheVisitedAssets();
  const button = `${location.origin}/assets/button.abc.js`;
  receive([
    resource(button),
    resource('https://external.test/assets/demo.js'),
    resource(`${location.origin}/unvisited/`),
  ]);
  expect(fetch).not.toHaveBeenCalled();
  worker.controller = {};
  worker.dispatchEvent(new Event('controllerchange'));
  await vi.waitFor(() => expect(fetch).toHaveBeenCalledWith(button, { cache: 'force-cache' }));
  const font = `${location.origin}/assets/font.abc.woff2`;
  receive([
    resource(font),
    resource(button),
    resource(`${location.origin}/assets/already-controlled.js`, 1),
    resource(`${location.origin}/assets/movie.mp4`),
  ]);
  await vi.waitFor(() => expect(fetch.mock.calls.map(([url]) => url)).toEqual([button, font]));
  window.dispatchEvent(new Event('pagehide'));
  expect(disconnect).toHaveBeenCalledOnce();
});

it('bounds first-visit resource requests and continues after a network failure', async () => {
  setup();
  let rejectFirst: (error: Error) => void;
  const fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      arrayBuffer: () =>
        new Promise((_, reject) => {
          rejectFirst ??= reject;
        }),
    }),
  );
  vi.stubGlobal('fetch', fetch);
  cacheVisitedAssets();
  receive(Array.from({ length: 6 }, (_, i) => resource(`${location.origin}/assets/${i}.js`)));
  worker.controller = {};
  worker.dispatchEvent(new Event('controllerchange'));
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  expect(fetch).toHaveBeenCalledTimes(4);
  rejectFirst!(new Error('network unavailable'));
  await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
});

it('leaves already controlled visits to the worker fetch handler', () => {
  setup();
  worker.controller = {};
  const observer = vi.fn();
  vi.stubGlobal('PerformanceObserver', observer);
  cacheVisitedAssets();
  expect(observer).not.toHaveBeenCalled();
});
