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
  // It starts inset from the stage's corner, at 24px.
  pointer(glass, 'pointerdown', 20, 20);
  pointer(glass, 'pointermove', 70, 50);
  pointer(glass, 'pointerup', 70, 50);
  expect(glass.style.left).toBe('74px');
  expect(glass.style.top).toBe('54px');
  glass.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  expect(glass.style.left).toBe('84px');
  pointer(glass, 'pointerdown', 20, 20);
  pointer(glass, 'pointermove', 900, 900);
  pointer(glass, 'pointercancel', 900, 900);
  expect(glass.style.left).toBe('160px');
  expect(glass.style.top).toBe('220px');
  document.querySelector<HTMLButtonElement>('[data-reset]')!.click();
  expect(glass.style.left).toBe('24px');
  expect(glass.style.top).toBe('24px');
});
it('reclamps glass when its stage shrinks', () => {
  const glass = document.querySelector<HTMLElement>('.gp-glass')!;
  pointer(glass, 'pointerdown', 0, 0);
  pointer(glass, 'pointermove', 200, 200);
  pointer(glass, 'pointerup', 200, 200);
  Object.defineProperty(document.querySelector('.gp-stage'), 'clientWidth', { value: 400 });
  resize?.([], {} as ResizeObserver);
  expect(glass.style.left).toBe('60px');
});
it('a material writes only the values that differ from it', async () => {
  const material = document.querySelector<HTMLSelectElement>('[data-param="material"]')!;
  material.value = 'clear';
  material.dispatchEvent(new Event('input', { bubbles: true }));
  const blur = document.querySelector<HTMLInputElement>('[data-param="blur"]')!;
  expect(blur.value).toBe('2');
  const glass = document.querySelector<HTMLElement>('.gp-glass')!;
  expect(glass.getAttribute('material')).toBe('clear');
  expect(glass.hasAttribute('blur')).toBe(false);
  blur.value = '10';
  blur.dispatchEvent(new Event('input', { bubbles: true }));
  expect(glass.getAttribute('blur')).toBe('10');
  expect(document.querySelector('.gp-code code')!.textContent).toContain('<r-glass material="clear" blur="10"');
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
it('a scene tile shows its picture on the stage, and reset brings back the first', () => {
  const stage = document.querySelector<HTMLImageElement>('[data-scene]')!;
  const paper = document.querySelector<HTMLInputElement>('input[name="gp-scene"][value="paper"]')!;
  paper.checked = true;
  paper.dispatchEvent(new Event('change', { bubbles: true }));
  expect(stage.src).toMatch(/\/glass\/paper\.svg$/);
  document.querySelector<HTMLButtonElement>('[data-reset]')!.click();
  expect(stage.src).toMatch(/\/glass\/aurora\.svg$/);
});
