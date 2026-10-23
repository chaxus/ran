import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';

test('demo theme action follows system preference and explicit theme changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(`${DEV_SERVER}components`);
  const toggle = page.locator('#theme-toggle');
  await expect(toggle).toHaveText('☀  Light');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-ran-theme', 'light');
  await expect(toggle).toHaveText('☾  Dark');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-ran-theme', 'dark');
  await expect(toggle).toHaveText('☀  Light');
  // Public theme changes originating outside this button must update its action too.
  await page.evaluate(async () => {
    const control = document.createElement('r-theme-switch') as HTMLElement & { value: string };
    document.body.append(control);
    control.value = 'system';
    control.remove();
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-ran-theme', 'light');
  await expect(toggle).toHaveText('☾  Dark');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(toggle).toHaveText('☀  Light');
  await page.evaluate(async () => {
    const control = document.createElement('r-theme-switch') as HTMLElement & { value: string };
    document.body.append(control);
    control.value = 'light';
    control.remove();
  });
  await expect(toggle).toHaveText('☾  Dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(toggle).toHaveText('☾  Dark');
});

test('theme switching keeps narrow header geometry and applies palette immediately', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.goto(`${DEV_SERVER}components`);
  const header = page.locator('.topbar');
  const toggle = page.locator('#theme-toggle');
  const before = await header.boundingBox();
  const buttonBefore = await toggle.boundingBox();
  await toggle.click();
  await expect(toggle).toHaveText('☀  Light');
  expect((await header.boundingBox())?.height).toBe(before?.height);
  expect((await toggle.boundingBox())?.width).toBe(buttonBefore?.width);
  const paletteDurations = await page.evaluate(() =>
    ['body', '.route-link', '.nav-link', '.lang-switch', '#theme-toggle'].map(
      (selector) => getComputedStyle(document.querySelector(selector)!).transitionDuration,
    ),
  );
  expect(paletteDurations.every((duration) => duration.split(',').every((value) => parseFloat(value) === 0))).toBe(
    true,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('body').evaluate((el) => getComputedStyle(el).transitionDuration)).toBe('0s');
});
