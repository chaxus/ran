// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, 'serviceWorker');
  Reflect.deleteProperty(document, 'visibilityState');
  window.dispatchEvent(new Event('pagehide'));
});

it('keeps reading free of offline controls while requesting idle background batches', async () => {
  vi.useFakeTimers();
  document.body.innerHTML = '<main class="doc"><article>Component documentation</article></main>';
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  const requests: unknown[] = [];
  const worker = Object.assign(new EventTarget(), {
    controller: {
      postMessage: (message: unknown, ports?: any[]) => {
        requests.push(message);
        ports?.[0].receive({ state: 'ready' });
      },
    },
    ready: Promise.resolve(),
  });
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: worker });
  vi.stubGlobal(
    'MessageChannel',
    class {
      port1 = { onmessage: null, close() {} };
      port2 = {
        close() {},
        receive: (data: unknown) => (this.port1.onmessage as ((event: unknown) => void) | null)?.({ data }),
      };
    },
  );
  await import('../client/main.ts');
  await vi.advanceTimersByTimeAsync(5000);
  expect(document.querySelector('.doc')!.textContent).toBe('Component documentation');
  expect(document.querySelector('progress, [data-offline-toggle]')).toBeNull();
  expect(requests).toContainEqual(expect.objectContaining({ type: 'OFFLINE_BATCH' }));
});
