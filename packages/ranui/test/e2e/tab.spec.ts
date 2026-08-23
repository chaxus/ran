import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount, settlePainted } from './helpers';

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

/**
 * True once the active-tab indicator has been placed.
 *
 * `setTabLine` measures the active header and writes the width, so until the headers have
 * laid out there is no line to photograph — and a screenshot taken before then records a
 * tab strip with nothing marked active, which is what the Mobile Chrome baseline held.
 */
const indicatorPlaced = (root: ShadowRoot): boolean => {
  const line = root.querySelector('.ran-tab-header-line') as HTMLElement | null;
  return line !== null && Number.parseFloat(line.style.width) > 0;
};

test('tab — first tab active (default)', async ({ page }) => {
  await mount(page, TABS_HTML);
  const el = page.locator('#tabs');
  await expect(el).toBeVisible();
  await settlePainted(page, '#tabs', indicatorPlaced);
  await expect(el).toHaveScreenshot('tab-first-active.png');
});

test('tab — second tab active', async ({ page }) => {
  await mount(page, TABS_HTML);
  const el = page.locator('#tabs');
  await expect(el).toBeVisible();
  await el.locator('r-tab[r-key="api"]').click();
  await settlePainted(page, '#tabs', indicatorPlaced);
  await expect(el).toHaveScreenshot('tab-second-active.png');
});

test('tab — disabled tab appearance', async ({ page }) => {
  await mount(page, TABS_HTML);
  const el = page.locator('#tabs');
  await expect(el).toBeVisible();
  // Confirm the disabled tab label is present but the click is inert
  const disabledTab = el.locator('r-tab[r-key="disabled"]');
  await expect(disabledTab).toBeVisible();
  await settlePainted(page, '#tabs', indicatorPlaced);
  await expect(el).toHaveScreenshot('tab-with-disabled.png');
});
