import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';

test('browsing the component gallery never loads external video until explicitly requested', async ({ page }) => {
  const requests: string[] = [];
  await page.route('https://test-streams.mux.dev/**', async (route) => {
    requests.push(route.request().url());
    await route.abort();
  });
  await page.goto(`${DEV_SERVER}components`);
  await expect(page.locator('#theme-toggle')).toBeVisible();
  await page.waitForTimeout(500);
  expect(requests).toEqual([]);
  await page.locator('#theme-toggle').click();
  await expect(page.locator('r-modal[heading="Playback failed"]')).toHaveCount(0);
  await page.locator('#load-player-sample').click();
  await expect.poll(() => requests.length).toBeGreaterThan(0);
  await expect(page.locator('#component-player r-player')).toHaveAttribute('src', /x36xhzz\.m3u8$/);
});
