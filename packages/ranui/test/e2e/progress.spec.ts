import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 200 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-progress');
});

test('progress — 0%', async ({ page }) => {
  await mount(page, `<r-progress style="width: 400px" percent="0"></r-progress>`);
  const el = page.locator('r-progress');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('progress-0.png');
  await argosScreenshot(page, 'progress-0', { element: el });
});

test('progress — 50%', async ({ page }) => {
  await mount(page, `<r-progress style="width: 400px" percent="50"></r-progress>`);
  const el = page.locator('r-progress');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('progress-50.png');
  await argosScreenshot(page, 'progress-50', { element: el });
});

test('progress — 100%', async ({ page }) => {
  await mount(page, `<r-progress style="width: 400px" percent="100"></r-progress>`);
  const el = page.locator('r-progress');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('progress-100.png');
  await argosScreenshot(page, 'progress-100', { element: el });
});

test('progress — drag type', async ({ page }) => {
  await mount(page, `<r-progress style="width: 400px" type="drag" percent="40"></r-progress>`);
  const el = page.locator('r-progress');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('progress-drag.png');
  await argosScreenshot(page, 'progress-drag', { element: el });
});
