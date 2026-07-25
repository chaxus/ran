import { test, expect } from '@playwright/test';
import { demoSetup } from '../helpers';

test.beforeEach(async ({ page }) => {
  await demoSetup(page, 'r-button');
});

test('button variants', async ({ page }) => {
  const section = page.locator('#component-button');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('button-variants.png');
});

test('icon variants', async ({ page }) => {
  const section = page.locator('#component-icon');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('icon-variants.png');
});

test('input variants', async ({ page }) => {
  const section = page.locator('#component-input');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('input-variants.png');
});

test('select closed state', async ({ page }) => {
  const section = page.locator('#component-select');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('select-closed.png');
});

test('select open dropdown', async ({ page }) => {
  const section = page.locator('#component-select');
  await expect(section).toBeVisible();
  // Click the first select to open its dropdown
  await section.locator('r-select').first().click();
  await page.waitForTimeout(100);
  await expect(section).toHaveScreenshot('select-open.png');
});

test('checkbox variants', async ({ page }) => {
  const section = page.locator('#component-checkbox');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('checkbox-variants.png');
});

test('progress variants', async ({ page }) => {
  const section = page.locator('#component-progress');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('progress-variants.png');
});

test('loading variants', async ({ page }) => {
  const section = page.locator('#component-loading');
  await expect(section).toBeVisible();
  // Give spinner one frame to settle into paused state
  await page.waitForTimeout(50);
  await expect(section).toHaveScreenshot('loading-variants.png');
});

test('skeleton variants', async ({ page }) => {
  const section = page.locator('#component-skeleton');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('skeleton-variants.png');
});

test('tabs default state', async ({ page }) => {
  const section = page.locator('#component-tabs');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('tabs-default.png');
});

test('tabs second tab active', async ({ page }) => {
  const section = page.locator('#component-tabs');
  await expect(section).toBeVisible();
  await section.locator('r-tab[r-key="api"]').click();
  await page.waitForTimeout(100);
  await expect(section).toHaveScreenshot('tabs-api-active.png');
});

test('popover closed', async ({ page }) => {
  const section = page.locator('#component-popover');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('popover-closed.png');
});

test('popover open on hover', async ({ page }) => {
  const section = page.locator('#component-popover');
  await expect(section).toBeVisible();
  await section.locator('r-button').hover();
  await page.waitForTimeout(150);
  await expect(section).toHaveScreenshot('popover-open.png');
});

test('math rendering', async ({ page }) => {
  const section = page.locator('#component-math');
  await expect(section).toBeVisible();
  // Wait for KaTeX to finish rendering
  await page.waitForTimeout(500);
  await expect(section).toHaveScreenshot('math-rendering.png');
});

test('radar chart', async ({ page }) => {
  const section = page.locator('#component-radar');
  await expect(section).toBeVisible();
  // Canvas renders synchronously after connectedCallback
  await page.waitForTimeout(100);
  await expect(section).toHaveScreenshot('radar-chart.png');
});

test('form layout', async ({ page }) => {
  const section = page.locator('#component-form');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('form-layout.png');
});

test('modal closed state', async ({ page }) => {
  const section = page.locator('#component-modal');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('modal-closed.png');
});

test('modal opens from the demo trigger', async ({ page }) => {
  // Functional only — deliberately no screenshot.
  //
  // The dialog is `position: fixed` inside r-modal's *closed* shadow root, so no page locator
  // can reach it and the assertion has to be a full-page shot. That drags the whole demo route
  // into frame; masking the live HLS player fixed chromium and Google Chrome but not the
  // narrow Mobile Chrome viewport, where other content sits behind the backdrop. Chasing each
  // one is not worth it: the modal's appearance is already covered deterministically by
  // `modal — open` in test/e2e/modal.spec.ts, which mounts it in an isolated body.
  const host = page.locator('#demo-modal');
  await page.locator('#component-modal r-button[type="primary"]').click();
  await page.waitForTimeout(100);
  await expect(host).toHaveAttribute('open', '');
});
