import { test, expect } from '@playwright/test';
import { demoSetup } from '../helpers';

test.beforeEach(async ({ page }) => {
  await demoSetup(page, 'r-colorpicker');
});

test('colorpicker default appearance', async ({ page }) => {
  const section = page.locator('#component-colorpicker');
  await expect(section).toBeVisible();
  // Give the canvas time to fully render
  await page.waitForTimeout(200);
  await expect(section).toHaveScreenshot('colorpicker-default.png');
});

test('colorpicker panel open', async ({ page }) => {
  // Click the first colorpicker swatch to open the panel
  await page.locator('#component-colorpicker r-colorpicker').first().click();
  await page.waitForTimeout(300);
  // Screenshot the panel itself, not the page. The panel is portaled out of the component,
  // so a full-page shot was the easy way to capture it — but it also captured everything else
  // on the demo route, including the live-stream player still decoding frames, and so differed
  // by ~28k pixels between two runs of the same code.
  const panel = page.locator('.ran-color-picker-inner').first();
  await expect(panel).toBeVisible();
  // The saturation area and alpha checkerboard are <canvas>, and canvas rasterisation is not
  // bit-identical run to run (~100px of a 10k-pixel panel). A small allowance keeps this a
  // real gate — a genuine regression to this panel moves far more than 200 pixels.
  await expect(panel).toHaveScreenshot('colorpicker-panel-open.png', { maxDiffPixels: 200 });
});

test('colorpicker rgba value', async ({ page }) => {
  const pickers = page.locator('#component-colorpicker r-colorpicker');
  // Second colorpicker has value="rgba(255,0,0,0.5)"
  const second = pickers.nth(1);
  await expect(second).toBeVisible();
  await page.waitForTimeout(200);
  await expect(second).toHaveScreenshot('colorpicker-rgba.png');
});
