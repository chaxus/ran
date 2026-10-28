import { expect, test } from './fixtures';

const ICONS = '.bento .caps-ico';

/** How many of the capability icons are moving right now, and whether any is see-through. */
const strip = (page: import('@playwright/test').Page) =>
  page.$$eval(ICONS, (icons) => ({
    moving: icons.filter((icon) => icon.getAnimations().length > 0).length,
    faded: icons.some((icon) => getComputedStyle(icon).opacity !== '1'),
  }));

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
});

test('the landing icons rise as their group scrolls in, and never fade', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  expect(await strip(page)).toEqual({ moving: 0, faded: false });
  await page.locator('.bento').scrollIntoViewIfNeeded();
  await expect.poll(async () => (await strip(page)).moving).toBeGreaterThan(0);
  expect((await strip(page)).faded).toBe(false);
  await expect.poll(async () => (await strip(page)).moving).toBe(0);
});

test('a group already on screen at load does not move', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1280, height: 4000 });
  await page.goto('/');
  await page.waitForTimeout(300);
  expect(await strip(page)).toEqual({ moving: 0, faded: false });
});

test('nothing moves under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.bento').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  expect(await strip(page)).toEqual({ moving: 0, faded: false });
});
