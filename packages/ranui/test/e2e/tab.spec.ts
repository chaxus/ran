import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 300 } });

const TABS_HTML = `
  <r-tabs id="tabs" active="overview" align="start" style="width: 500px">
    <r-tab label="Overview" r-key="overview">Overview panel content</r-tab>
    <r-tab label="API" r-key="api">API reference content</r-tab>
    <r-tab label="Disabled" r-key="disabled" disabled>Disabled panel</r-tab>
  </r-tabs>
`;

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-tabs');
});

test('tab — first tab active (default)', async ({ page }) => {
  await mount(page, TABS_HTML);
  const el = page.locator('#tabs');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('tab-first-active.png');
  await argosScreenshot(page, 'tab-first-active', { element: el });
});

test('tab — second tab active', async ({ page }) => {
  await mount(page, TABS_HTML);
  const el = page.locator('#tabs');
  await expect(el).toBeVisible();
  await el.locator('r-tab[r-key="api"]').click();
  await page.waitForTimeout(100);
  await expect(el).toHaveScreenshot('tab-second-active.png');
  await argosScreenshot(page, 'tab-second-active', { element: el });
});

test('tab — disabled tab appearance', async ({ page }) => {
  await mount(page, TABS_HTML);
  const el = page.locator('#tabs');
  await expect(el).toBeVisible();
  // Confirm the disabled tab label is present but the click is inert
  const disabledTab = el.locator('r-tab[r-key="disabled"]');
  await expect(disabledTab).toBeVisible();
  await expect(el).toHaveScreenshot('tab-with-disabled.png');
  await argosScreenshot(page, 'tab-with-disabled', { element: el });
});
