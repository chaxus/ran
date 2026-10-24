import { test, expect } from '@playwright/test';
import { activeTabPainted, clickTabHeader, demoSetup, popupCaptureBounds, settlePainted } from '../helpers';

test.beforeEach(async ({ page }) => {
  await demoSetup(page, 'r-button');
});

test('button variants', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-button');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('button-variants.png');
});

test('icon variants', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-icon');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('icon-variants.png');
});

test('input variants', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-input');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('input-variants.png');
});

test('select closed state', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-select');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('select-closed.png');
});

test('select open dropdown', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-select');
  await expect(section).toBeVisible();
  await section.evaluate((node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const select = section.locator('r-select').first();
  await select.evaluate((node) => {
    node.addEventListener('after-show', () => node.setAttribute('data-test-after-show', ''), { once: true });
  });
  await select.click();
  const popup = `#${await select.getAttribute('aria-controls')}`;
  await expect(page.locator(popup)).toBeVisible();
  await expect(page.locator(popup).locator('r-dropdown-item')).toHaveCount(3);
  await expect(page.locator(popup).locator('r-dropdown-item').last()).toBeVisible();
  await expect(select).toHaveAttribute('data-test-after-show', '');
  await expect(page).toHaveScreenshot('select-open.png', {
    clip: await popupCaptureBounds(page, '#component-select', popup),
  });
});

test('checkbox variants', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-checkbox');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('checkbox-variants.png');
});

test('progress variants', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-progress');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('progress-variants.png');
});

test('loading variants', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-loading');
  await expect(section).toBeVisible();
  // Give spinner one frame to settle into paused state
  await page.waitForTimeout(50);
  await expect(section).toHaveScreenshot('loading-variants.png');
});

test('skeleton variants', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-skeleton');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('skeleton-variants.png');
});

test('tabs default state', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-tabs');
  await expect(section).toBeVisible();
  await settlePainted(page, '#component-tabs r-tabs', activeTabPainted);
  await expect(section).toHaveScreenshot('tabs-default.png');
});

test('tabs second tab active', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-tabs');
  await expect(section).toBeVisible();
  await clickTabHeader(page, '#component-tabs r-tabs', 'api');
  await expect(section.locator('r-tabs')).toHaveAttribute('active', 'api');
  await settlePainted(page, '#component-tabs r-tabs', activeTabPainted);
  await expect(section).toHaveScreenshot('tabs-api-active.png');
});

test('popover closed', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-popover');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('popover-closed.png');
});

test('popover opens by hover or touch', { tag: '@visual' }, async ({ page, hasTouch }) => {
  const section = page.locator('#component-popover');
  await expect(section).toBeVisible();
  await section.evaluate((node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const popover = section.locator('r-popover');
  await popover.evaluate((node) => {
    node.addEventListener('after-show', () => node.setAttribute('data-test-after-show', ''), { once: true });
  });
  const trigger = section.locator('r-button');
  if (hasTouch) await trigger.tap();
  else await trigger.hover();
  await expect(popover).toHaveAttribute('open', '');
  const popup = '.ran-popover-dropdown:not([style*="display: none"])';
  await expect(page.locator(popup)).toBeVisible();
  // Visibility precedes the positioning frame and entrance transform. Measure
  // the capture only after the component reports its final painted geometry.
  await expect(popover).toHaveAttribute('data-test-after-show', '');
  await page.evaluate(() => {
    // A screenshot must not resize the viewport and invalidate its own portal crop.
    document.documentElement.dataset.captureResizes = '0';
    window.addEventListener('resize', () => {
      document.documentElement.dataset.captureResizes = String(
        Number(document.documentElement.dataset.captureResizes) + 1,
      );
    });
  });
  await expect(page).toHaveScreenshot('popover-open.png', {
    clip: await popupCaptureBounds(page, '#component-popover', popup),
  });
  await expect(page.locator('html')).toHaveAttribute('data-capture-resizes', '0');
});

test('math rendering', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-math');
  await expect(section).toBeVisible();
  // Wait for KaTeX to finish rendering
  await page.waitForTimeout(500);
  await expect(section).toHaveScreenshot('math-rendering.png');
});

test('radar chart', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-radar');
  await expect(section).toBeVisible();
  // Canvas renders synchronously after connectedCallback
  await page.waitForTimeout(100);
  await expect(section).toHaveScreenshot('radar-chart.png');
});

test('form layout', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-form');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('form-layout.png');
});

test('modal closed state', { tag: '@visual' }, async ({ page }) => {
  const section = page.locator('#component-modal');
  await expect(section).toBeVisible();
  await expect(section).toHaveScreenshot('modal-closed.png');
});

test('modal opens from the demo trigger', async ({ page, hasTouch }) => {
  // Functional only — deliberately no screenshot.
  //
  // The dialog is `position: fixed` inside r-modal's *closed* shadow root, so no page locator
  // can reach it and the assertion has to be a full-page shot. That drags the whole demo route
  // into frame; masking the live HLS player fixed chromium and Google Chrome but not the
  // narrow Mobile Chrome viewport, where other content sits behind the backdrop. Chasing each
  // one is not worth it: the modal's appearance is already covered deterministically by
  // `modal — open` in test/e2e/modal.spec.ts, which mounts it in an isolated body.
  const host = page.locator('#demo-modal');
  const trigger = page.locator('#component-modal r-button[type="primary"]');
  // Use the device's native input: synthetic mouse focus on mobile WebKit can
  // resize text above the trigger between pointerdown and pointerup.
  if (hasTouch) await trigger.tap();
  else await trigger.click();
  await expect(host).toHaveAttribute('open', '');
});
