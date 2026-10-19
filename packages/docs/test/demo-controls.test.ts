// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { mountDemos } from '../client/home';
import { renderGlassPlayground } from '../build/components';
import { LOCALES } from '../build/langs/locales';

let resize: ResizeObserverCallback;
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  document.body.innerHTML = renderGlassPlayground(LOCALES.find((locale) => locale.dir === '')!);
  const stage = document.querySelector<HTMLElement>('.gp-stage')!;
  const glass = document.querySelector<HTMLElement>('.gp-glass')!;
  Object.defineProperties(stage, { clientWidth: { configurable: true, value: 500 }, clientHeight: { value: 320 } });
  Object.defineProperties(glass, {
    offsetWidth: { get: () => Math.min(500, Number.parseInt(glass.style.width)) },
    offsetHeight: { value: 100 },
  });
  glass.setPointerCapture = vi.fn();
  glass.releasePointerCapture = vi.fn();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
  mountDemos();
});
afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const pointer = (target: Element, type: string, x: number, y: number) => {
  target.dispatchEvent(
    Object.assign(new Event(type, { bubbles: true }), { pointerId: 1, button: 0, clientX: x, clientY: y }),
  );
};

it('moves glass with pointer and arrows, bounds movement and resets its position', () => {
  const glass = document.querySelector<HTMLElement>('.gp-glass')!;
  pointer(glass, 'pointerdown', 20, 20);
  pointer(glass, 'pointermove', 70, 50);
  pointer(glass, 'pointerup', 70, 50);
  expect(glass.style.left).toBe('50px');
  expect(glass.style.top).toBe('30px');
  glass.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  expect(glass.style.left).toBe('60px');
  pointer(glass, 'pointerdown', 20, 20);
  pointer(glass, 'pointermove', 900, 900);
  pointer(glass, 'pointercancel', 900, 900);
  expect(glass.style.left).toBe('200px');
  expect(glass.style.top).toBe('220px');
  document.querySelector<HTMLButtonElement>('[data-reset]')!.click();
  expect(glass.style.left).toBe('0px');
  expect(glass.style.top).toBe('0px');
});

it('reclamps glass when its stage shrinks', () => {
  const glass = document.querySelector<HTMLElement>('.gp-glass')!;
  pointer(glass, 'pointerdown', 0, 0);
  pointer(glass, 'pointermove', 200, 200);
  pointer(glass, 'pointerup', 200, 200);
  Object.defineProperty(document.querySelector('.gp-stage'), 'clientWidth', { value: 320 });
  resize?.([], {} as ResizeObserver);
  expect(glass.style.left).toBe('20px');
});

it('copies the selected glass width and flags', async () => {
  const width = document.querySelector<HTMLInputElement>('[data-param="width"]')!;
  width.value = '400';
  document.querySelector<HTMLInputElement>('[data-flag="sheen"]')!.checked = true;
  document.querySelector<HTMLInputElement>('[data-flag="interactive"]')!.checked = true;
  width.dispatchEvent(new Event('input', { bubbles: true }));
  const button = document.querySelector<HTMLButtonElement>('[data-copy-code]')!;
  button.click();
  await Promise.resolve();
  await Promise.resolve();
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('style="width:400px"'));
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining(' sheen interactive'));
});

it('restores Copy after repeated clicks', async () => {
  const button = document.querySelector<HTMLButtonElement>('[data-copy-code]')!;
  button.click();
  await Promise.resolve();
  await Promise.resolve();
  button.click();
  await Promise.resolve();
  await Promise.resolve();
  await vi.advanceTimersByTimeAsync(1700);
  expect(button.textContent).toBe('Copy');
});
