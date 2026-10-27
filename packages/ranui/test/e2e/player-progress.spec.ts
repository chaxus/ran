import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount, insideShadow } from './helpers';

/** A short recording already in the repository, served by the dev server from the file system. */
const VIDEO = `/@fs${fileURLToPath(new URL('../evidence/2026-10-22-components/content-normal.webm', import.meta.url))}`;

const dotOffset = (page: import('@playwright/test').Page) =>
  insideShadow(page, '#player', (root) => {
    const video = root.querySelector('video')!;
    const dot = root.querySelector('[class*="progress-dot"]') as HTMLElement;
    const track = dot.parentElement!.getBoundingClientRect().width;
    return {
      x: new DOMMatrixReadOnly(getComputedStyle(dot).transform).e,
      at: (video.currentTime / video.duration) * track,
    };
  });

test('the progress dot follows playback without measuring the track every frame, and follows a resize', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')!;
    const state = window as unknown as { widthReads: number };
    state.widthReads = 0;
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        state.widthReads++;
        return width.get!.call(this);
      },
    });
  });
  await isolatedSetup(page, DEV_SERVER, 'r-player');
  await mount(page, `<r-player id="player" style="display:block;width:600px" src="${VIDEO}"></r-player>`);
  const ready = await expect
    .poll(() => insideShadow(page, '#player', (root) => root.querySelector('video')!.readyState), { timeout: 5000 })
    .toBeGreaterThan(1)
    .then(() => true)
    .catch(() => false);
  test.skip(!ready, 'This engine cannot play the webm fixture');

  await insideShadow(page, '#player', (root) => {
    const video = root.querySelector('video')!;
    video.muted = true;
    return video.play();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => ((window as unknown as { widthReads: number }).widthReads = 0));
  await page.waitForTimeout(800);
  // While playing, the dot moves every frame; it used to read the track's width each time.
  expect(await page.evaluate(() => (window as unknown as { widthReads: number }).widthReads)).toBe(0);
  await insideShadow(page, '#player', (root) => root.querySelector('video')!.pause());

  // The last frame before the pause may still be in flight.
  await expect
    .poll(async () => {
      const { x, at } = await dotOffset(page);
      return Math.abs(x - at) < 2;
    })
    .toBe(true);
  // Paused, nothing redraws the dot on its own: the track's new width has to reach it.
  await page.evaluate(() => (document.getElementById('player')!.style.width = '400px'));
  await expect
    .poll(async () => {
      const { x, at } = await dotOffset(page);
      return Math.abs(x - at) < 2;
    })
    .toBe(true);
});
