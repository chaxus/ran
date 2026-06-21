import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 200 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-loading');
});

for (const name of ['rotate', 'stretch', 'dot', 'circle-line'] as const) {
  test(`loading — ${name}`, async ({ page }) => {
    await mount(page, `<r-loading name="${name}"></r-loading>`);
    const el = page.locator('r-loading');
    await expect(el).toBeVisible();
    await page.waitForTimeout(50); // one frame after animation freeze
    await expect(el).toHaveScreenshot(`loading-${name}.png`);
    await argosScreenshot(page, `loading-${name}`, { element: el });
  });
}

test('loading — all types row', async ({ page }) => {
  await mount(page, `
    <div style="display: flex; gap: 24px; align-items: center;">
      <r-loading name="rotate"></r-loading>
      <r-loading name="stretch"></r-loading>
      <r-loading name="dot"></r-loading>
      <r-loading name="circle-line"></r-loading>
    </div>
  `);
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await page.waitForTimeout(50);
  await expect(el).toHaveScreenshot('loading-all.png');
  await argosScreenshot(page, 'loading-all', { element: el });
});
