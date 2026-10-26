import { expect, test, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

/**
 * `volume`, `playbackRate` and `currentTime` written in the markup reach the video.
 *
 * During upgrade their attribute callbacks run before the player has created its video, so
 * they used to be dropped. No source is needed: an unloaded video keeps its volume and rate,
 * and reports a `currentTime` set before load as its start position.
 */
const media = (page: Page) =>
  page.locator('#p').evaluate((host) => {
    const video = (host as HTMLElement & { _video: HTMLVideoElement })._video;
    return { volume: video.volume, muted: video.muted, rate: video.playbackRate, time: video.currentTime };
  });

const errors: Error[] = [];
test.beforeEach(async ({ page }) => {
  errors.length = 0;
  page.on('pageerror', (error) => errors.push(error));
  await isolatedSetup(page, DEV_SERVER, 'r-player');
});
test.afterEach(() => expect(errors).toEqual([]));

test('values written in the markup are applied to the video', async ({ page }) => {
  await mount(page, '<r-player id="p" disable-error-modal volume="30" playbackRate="1.5" currentTime="12"></r-player>');
  expect(await media(page)).toEqual({ volume: 0.3, muted: false, rate: 1.5, time: 12 });
});

test('muted wins over volume, and unmuting restores the declared volume', async ({ page }) => {
  await mount(page, '<r-player id="p" disable-error-modal muted volume="30"></r-player>');
  expect(await media(page)).toMatchObject({ volume: 0, muted: true });
  await page.locator('#p').evaluate((host) => host.removeAttribute('muted'));
  expect(await media(page)).toMatchObject({ volume: 0.3, muted: false });
});

test('values that are not usable are ignored or clamped instead of throwing', async ({ page }) => {
  await mount(
    page,
    '<r-player id="p" disable-error-modal volume="loud" playbackRate="-1" currentTime="soon"></r-player>',
  );
  expect(await media(page)).toEqual({ volume: 1, muted: false, rate: 1, time: 0 });
  await page.locator('#p').evaluate((host) => host.setAttribute('volume', '150'));
  expect((await media(page)).volume).toBe(1);
});

test('a later change still applies', async ({ page }) => {
  await mount(page, '<r-player id="p" disable-error-modal volume="30"></r-player>');
  await page.locator('#p').evaluate((host) => {
    host.setAttribute('volume', '80');
    host.setAttribute('playbackrate', '2');
  });
  expect(await media(page)).toMatchObject({ volume: 0.8, rate: 2 });
});
