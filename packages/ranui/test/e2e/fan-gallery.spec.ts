import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

const CARDS = ['A', 'B', 'C', 'D', 'E']
  .map(
    (label) =>
      `<button style="width:120px;height:160px;border:1px solid #ccc;border-radius:12px;background:#fff">${label}</button>`,
  )
  .join('');

/** Each child's rotation in degrees, as the browser currently paints it. */
const rotations = (page: import('@playwright/test').Page) =>
  page.$$eval('#fan > *', (items) =>
    items.map((item) => {
      const { a, b } = new DOMMatrix(getComputedStyle(item).transform);
      return Math.round((Math.atan2(b, a) * 180) / Math.PI);
    }),
  );

test.describe('with motion', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test.beforeEach(async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-fan-gallery');
  });

  test('lies stacked below the fold and fans out once it scrolls into view', async ({ page }) => {
    await mount(page, `<div style="height:150vh"></div><r-fan-gallery id="fan" spread="40">${CARDS}</r-fan-gallery>`);
    expect(await rotations(page)).toEqual([0, 0, 0, 0, 0]);
    await page.locator('#fan').scrollIntoViewIfNeeded();
    await expect.poll(() => rotations(page)).toEqual([-20, -10, 0, 10, 20]);
  });

  test('a pointer over a child turns its neighbours aside and the fan closes back when it leaves', async ({ page }) => {
    await mount(page, `<r-fan-gallery id="fan" spread="40" style="margin-top:80px">${CARDS}</r-fan-gallery>`);
    await expect.poll(() => rotations(page)).toEqual([-20, -10, 0, 10, 20]);
    await page.locator('#fan > button').nth(2).hover();
    await expect.poll(() => rotations(page)).toEqual([-24, -14, 0, 14, 24]);
    await page.mouse.move(0, 0);
    await expect.poll(() => rotations(page)).toEqual([-20, -10, 0, 10, 20]);
  });
});

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('is open from the start, even off screen, and never transitions', async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-fan-gallery');
    await mount(page, `<div style="height:150vh"></div><r-fan-gallery id="fan" spread="40">${CARDS}</r-fan-gallery>`);
    expect(await rotations(page)).toEqual([-20, -10, 0, 10, 20]);
    const durations = await page.$$eval('#fan > *', (items) =>
      items.map((item) => getComputedStyle(item).transitionDuration),
    );
    expect(durations.every((value) => value === '0s')).toBe(true);
  });
});

test('focus lifts a child the same way a pointer does', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-fan-gallery');
  await mount(page, `<r-fan-gallery id="fan" spread="40" style="margin-top:80px">${CARDS}</r-fan-gallery>`);
  // WebKit does not Tab to buttons by default, so focus the child directly.
  await page.locator('#fan > button').first().focus();
  await expect.poll(() => rotations(page)).toEqual([-20, -6, 4, 14, 24]);
});
