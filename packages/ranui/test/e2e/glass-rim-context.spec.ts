import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

/**
 * The WebGL rim survives a lost context. Browsers drop WebGL contexts under memory
 * pressure, on GPU resets and when too many are open; without handling, the rim's program
 * and buffers are gone for good and the highlight silently disappears.
 */
test.beforeEach(async ({ page }) => {
  // Keep the rim on its WebGL backend, the one under test.
  await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
  await isolatedSetup(page, DEV_SERVER, 'r-glass');
  await mount(page, '<r-glass id="g" rim radius="20" style="display:block;width:200px;height:120px">x</r-glass>');
});

/** Pixels the rim draws on its next frame, sampled before the browser composites them away. */
const drawnPixels = (page: import('@playwright/test').Page, radius: string) =>
  page.evaluate((radius) => {
    const glass = document.querySelector('#g') as HTMLElement & { radius: string; _shadowDom: ShadowRoot };
    const canvas = glass._shadowDom.querySelector('canvas.ran-glass-rim') as HTMLCanvasElement;
    glass.radius = radius;
    const copy = document.createElement('canvas');
    copy.width = canvas.width;
    copy.height = canvas.height;
    const context = copy.getContext('2d')!;
    context.drawImage(canvas, 0, 0);
    const { data } = context.getImageData(0, 0, copy.width, copy.height);
    let drawn = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i]! > 0) drawn++;
    return drawn;
  }, radius);

test('the rim draws again after its WebGL context is lost and restored', async ({ page }) => {
  expect(await drawnPixels(page, '21')).toBeGreaterThan(0);
  const restored = await page.evaluate(async () => {
    const glass = document.querySelector('#g') as HTMLElement & { _shadowDom: ShadowRoot };
    const canvas = glass._shadowDom.querySelector('canvas.ran-glass-rim') as HTMLCanvasElement;
    const lose = canvas.getContext('webgl')!.getExtension('WEBGL_lose_context')!;
    const lost = new Promise((resolve) => canvas.addEventListener('webglcontextlost', resolve, { once: true }));
    lose.loseContext();
    await lost;
    // Restoring is only valid once the loss has been fully dispatched.
    await new Promise((resolve) => setTimeout(resolve, 0));
    const restored = new Promise<boolean>((resolve) => {
      canvas.addEventListener('webglcontextrestored', () => resolve(true), { once: true });
      setTimeout(() => resolve(false), 2000);
    });
    lose.restoreContext();
    return restored;
  });
  expect(restored, 'the browser restored the context').toBe(true);
  expect(await drawnPixels(page, '22')).toBeGreaterThan(0);
});
