// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, 'serviceWorker');
});

it('keeps reading free of offline controls and automatic download requests', async () => {
  vi.useFakeTimers();
  document.body.innerHTML = '<main class="doc"><article>Component documentation</article></main>';
  const requests: unknown[] = [];
  const worker = Object.assign(new EventTarget(), {
    controller: { postMessage: (message: unknown) => requests.push(message) },
    ready: Promise.resolve(),
  });
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: worker });
  vi.stubGlobal(
    'MessageChannel',
    class {
      port1 = { onmessage: null, close() {} };
      port2 = { close() {} };
    },
  );
  await import('../client/main.ts');
  await vi.advanceTimersByTimeAsync(5000);
  expect(document.querySelector('.doc')!.textContent).toBe('Component documentation');
  expect(document.querySelector('progress, [data-offline-toggle]')).toBeNull();
  expect(requests).toEqual([]);
});
