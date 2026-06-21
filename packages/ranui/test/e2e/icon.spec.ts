import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 200 } });

// Icons available after the dev server boots: home, setting, loading, lock, arrow-down

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-icon');
});

test('icon — size variants', async ({ page }) => {
  await mount(page, `
    <div style="display: flex; gap: 16px; align-items: center;">
      <r-icon name="home" size="16"></r-icon>
      <r-icon name="home" size="24"></r-icon>
      <r-icon name="home" size="32"></r-icon>
      <r-icon name="home" size="48"></r-icon>
    </div>
  `);
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('icon-sizes.png');
  await argosScreenshot(page, 'icon-sizes', { element: el });
});

test('icon — custom color', async ({ page }) => {
  await mount(page, `
    <div style="display: flex; gap: 16px; align-items: center;">
      <r-icon name="setting" size="28" color="#1890ff"></r-icon>
      <r-icon name="setting" size="28" color="#52c41a"></r-icon>
      <r-icon name="setting" size="28" color="#ff4d4f"></r-icon>
    </div>
  `);
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('icon-colors.png');
  await argosScreenshot(page, 'icon-colors', { element: el });
});

test('icon — spin', async ({ page }) => {
  await mount(page, `<r-icon name="loading" size="32" spin></r-icon>`);
  const el = page.locator('r-icon');
  await expect(el).toBeVisible();
  // Animation is frozen by FREEZE_ANIMATIONS — screenshot captures a static frame
  await expect(el).toHaveScreenshot('icon-spin.png');
  await argosScreenshot(page, 'icon-spin', { element: el });
});
