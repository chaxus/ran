import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 300 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-skeleton');
});

test('skeleton — default', async ({ page }) => {
  await mount(page, `<r-skeleton style="width: 400px"></r-skeleton>`);
  const el = page.locator('r-skeleton');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('skeleton-default.png');
});

test('skeleton — custom height', async ({ page }) => {
  await mount(page, `<r-skeleton style="width: 400px; height: 24px"></r-skeleton>`);
  const el = page.locator('r-skeleton');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('skeleton-custom-height.png');
});

test('skeleton — stacked', async ({ page }) => {
  await mount(
    page,
    `
    <div style="display: flex; flex-direction: column; gap: 8px; width: 400px;">
      <r-skeleton></r-skeleton>
      <r-skeleton style="height: 24px"></r-skeleton>
      <r-skeleton style="height: 16px; width: 60%"></r-skeleton>
    </div>
  `,
  );
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('skeleton-stacked.png');
});
