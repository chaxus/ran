// @vitest-environment jsdom
import { runInNewContext } from 'node:vm';
import { afterEach, expect, it, vi } from 'vitest';
import { BD_ANALYSE } from '../build/common/index.ts';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it('loads Baidu analytics after page load and an idle callback', () => {
  document.head.innerHTML = '<script></script>';
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
  let onLoad!: () => void;
  let onIdle!: () => void;
  runInNewContext(BD_ANALYSE, {
    document,
    window: {
      addEventListener: (_type: string, callback: () => void) => {
        onLoad = callback;
      },
      requestIdleCallback: (callback: () => void) => {
        onIdle = callback;
      },
    },
  });
  expect(document.querySelector('script[src]')).toBeNull();
  onLoad();
  expect(document.querySelector('script[src]')).toBeNull();
  onIdle();
  const script = document.querySelector<HTMLScriptElement>('script[src]');
  expect(script?.src).toBe('https://hm.baidu.com/hm.js?3bc20bd8070ce614078a36c686209456');
  expect(script?.async).toBe(true);
});

it('loads analytics without requestIdleCallback when the document is already complete', async () => {
  vi.useFakeTimers();
  document.head.innerHTML = '<script></script>';
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
  runInNewContext(BD_ANALYSE, { document, window: { setTimeout } });
  expect(document.querySelector('script[src]')).toBeNull();
  await vi.runAllTimersAsync();
  expect(document.querySelector('script[src]')).not.toBeNull();
});
