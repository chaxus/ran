import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

/** A source the browser rejects at once, so the error path runs without the network. */
const BROKEN = 'data:video/mp4;base64,AAAA';

const panelState = (page: import('@playwright/test').Page) =>
  page.locator('#p').evaluate((host) => {
    const root = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
    const panel = root.querySelector('[part="error"]') as HTMLElement;
    const play = root.querySelector('.ran-player-play-btn') as HTMLElement;
    return { shown: !panel.hidden, playGlyph: getComputedStyle(play).display !== 'none' };
  });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-player');
  await mount(page, `<r-player id="p" src="${BROKEN}" style="display:block;width:640px;height:300px"></r-player>`);
});

test('a playback failure shows on the player, not in a page-blocking dialog', async ({ page }) => {
  await expect.poll(async () => (await panelState(page)).shown).toBe(true);
  expect(await panelState(page)).toEqual({ shown: true, playGlyph: false });
  expect(await page.locator('r-modal').count()).toBe(0);
});

test('Retry takes Space without toggling playback, and clears the panel', async ({ page }) => {
  await expect.poll(async () => (await panelState(page)).shown).toBe(true);
  const plays = await page.locator('#p').evaluate((host) => {
    const player = host as HTMLElement & { _shadowDom: ShadowRoot; _video: HTMLVideoElement };
    (window as unknown as { __plays: number }).__plays = 0;
    const video = player._video;
    const original = video.play.bind(video);
    video.play = () => {
      (window as unknown as { __plays: number }).__plays += 1;
      return original().catch(() => undefined);
    };
    (player._shadowDom.querySelector('[part="error-retry"]') as HTMLButtonElement).focus();
    return 0;
  });
  expect(plays).toBe(0);
  await page.keyboard.press('Space');
  expect(await page.evaluate(() => (window as unknown as { __plays: number }).__plays)).toBe(0);
  // The retry reloads the same broken source, so the panel comes back for the new attempt.
  await expect.poll(async () => (await panelState(page)).shown).toBe(true);
});
