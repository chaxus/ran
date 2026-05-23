import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../../build/config';

test.beforeEach(async ({ page }) => {
  await page.goto(DEV_SERVER, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => customElements.get('r-colorpicker'));
});

test('colorpicker default appearance', async ({ page }) => {
  const section = page.locator('#colorpicker');
  await expect(section).toBeVisible();
  // Give the canvas time to fully render
  await page.waitForTimeout(200);
  await argosScreenshot(page, 'colorpicker-default', { element: section });
});

test('colorpicker panel open', async ({ page }) => {
  // Click the first colorpicker swatch to open the panel
  await page.locator('r-colorpicker').first().click();
  await page.waitForTimeout(300);
  // Canvas panel should now be visible; screenshot the whole page to capture the overlay
  await argosScreenshot(page, 'colorpicker-panel-open');
});

test('colorpicker rgba value', async ({ page }) => {
  const pickers = page.locator('r-colorpicker');
  // Second colorpicker has value="rgba(255,0,0,0.5)"
  const second = pickers.nth(1);
  await expect(second).toBeVisible();
  await page.waitForTimeout(200);
  await argosScreenshot(page, 'colorpicker-rgba', { element: second });
});
