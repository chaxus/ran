import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../../build/config';

// Freeze all CSS animations and transitions for deterministic screenshots
const FREEZE_ANIMATIONS = `
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
  }
`;

test.beforeEach(async ({ page }) => {
  await page.goto(DEV_SERVER, { waitUntil: 'networkidle' });
  // Wait until at least the core custom element is registered
  await page.waitForFunction(() => customElements.get('r-button'));
  await page.addStyleTag({ content: FREEZE_ANIMATIONS });
});

test('button variants', async ({ page }) => {
  const section = page.locator('#button');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'button-variants', { element: section });
});

test('icon variants', async ({ page }) => {
  const section = page.locator('#icon');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'icon-variants', { element: section });
});

test('input variants', async ({ page }) => {
  const section = page.locator('#input');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'input-variants', { element: section });
});

test('select closed state', async ({ page }) => {
  const section = page.locator('#select');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'select-closed', { element: section });
});

test('select open dropdown', async ({ page }) => {
  const section = page.locator('#select');
  await expect(section).toBeVisible();
  // Click the first select to open its dropdown
  await page.locator('r-select').first().click();
  await page.waitForTimeout(100);
  await argosScreenshot(page, 'select-open', { element: section });
});

test('checkbox variants', async ({ page }) => {
  const section = page.locator('#checkbox');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'checkbox-variants', { element: section });
});

test('progress variants', async ({ page }) => {
  const section = page.locator('#progress');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'progress-variants', { element: section });
});

test('loading variants', async ({ page }) => {
  const section = page.locator('#loading');
  await expect(section).toBeVisible();
  // Give spinner one frame to settle into paused state
  await page.waitForTimeout(50);
  await argosScreenshot(page, 'loading-variants', { element: section });
});

test('skeleton variants', async ({ page }) => {
  const section = page.locator('#skeleton');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'skeleton-variants', { element: section });
});

test('tabs default state', async ({ page }) => {
  const section = page.locator('#tabs');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'tabs-default', { element: section });
});

test('tabs second tab active', async ({ page }) => {
  const section = page.locator('#tabs');
  await expect(section).toBeVisible();
  await page.locator('r-tab[r-key="api"]').click();
  await page.waitForTimeout(100);
  await argosScreenshot(page, 'tabs-api-active', { element: section });
});

test('popover closed', async ({ page }) => {
  const section = page.locator('#popover');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'popover-closed', { element: section });
});

test('popover open on hover', async ({ page }) => {
  const section = page.locator('#popover');
  await expect(section).toBeVisible();
  await page.locator('#popover r-button').hover();
  await page.waitForTimeout(150);
  await argosScreenshot(page, 'popover-open', { element: section });
});

test('math rendering', async ({ page }) => {
  const section = page.locator('#math');
  await expect(section).toBeVisible();
  // Wait for KaTeX to finish rendering
  await page.waitForTimeout(500);
  await argosScreenshot(page, 'math-rendering', { element: section });
});

test('radar chart', async ({ page }) => {
  const section = page.locator('#radar');
  await expect(section).toBeVisible();
  // Canvas renders synchronously after connectedCallback
  await page.waitForTimeout(100);
  await argosScreenshot(page, 'radar-chart', { element: section });
});

test('form layout', async ({ page }) => {
  const section = page.locator('#form');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'form-layout', { element: section });
});

test('modal closed state', async ({ page }) => {
  const section = page.locator('#modal');
  await expect(section).toBeVisible();
  await argosScreenshot(page, 'modal-closed', { element: section });
});

test('modal open state', async ({ page }) => {
  await page.locator('#modal r-button[type="primary"]').click();
  await page.waitForTimeout(100);
  await argosScreenshot(page, 'modal-open');
});
