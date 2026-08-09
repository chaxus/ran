import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 400 } });

const POPOVER_HTML = `
  <div style="padding: 60px;">
    <r-popover placement="top" trigger="hover,click" arrow="true">
      <r-button>Hover or click</r-button>
      <r-content>
        <div style="padding: 8px 12px;">Popover content</div>
      </r-content>
    </r-popover>
  </div>
`;

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
});

test('popover — closed', async ({ page }) => {
  await mount(page, POPOVER_HTML);
  await expect(page.locator('r-button')).toBeVisible();
  await expect(page.locator('div').first()).toHaveScreenshot('popover-closed.png');
});

test('popover — open on hover', async ({ page }) => {
  await mount(page, POPOVER_HTML);
  const trigger = page.locator('r-button');
  await expect(trigger).toBeVisible();
  await trigger.hover();
  await page.waitForTimeout(200);
  // Popup is appended to body outside the component — capture full viewport
  await expect(page).toHaveScreenshot('popover-open.png');
});

test('popover — open on click', async ({ page }) => {
  await mount(page, POPOVER_HTML);
  const trigger = page.locator('r-button');
  await expect(trigger).toBeVisible();
  await trigger.click();
  await page.waitForTimeout(200);
  await expect(page).toHaveScreenshot('popover-click-open.png');
});

test('popover — click trigger again closes it', async ({ page }) => {
  await mount(page, POPOVER_HTML);
  const trigger = page.locator('r-button');
  const content = page.locator('.ran-popover-dropdown');
  await trigger.click();
  await expect(content).toHaveCSS('display', 'block');
  await trigger.click();
  await expect(content).toHaveCSS('display', 'none');
});

test('popover — removing the host while open also removes the portaled panel', async ({ page }) => {
  await mount(page, `<div id="host-wrap">${POPOVER_HTML}</div>`);
  const trigger = page.locator('r-button');
  await trigger.click();
  await expect(page.locator('.ran-popover-dropdown')).toHaveCSS('display', 'block');

  // Simulates an SPA route swap / conditional unmount tearing down the host
  // while its panel is open and portaled to document.body.
  await page.evaluate(() => document.getElementById('host-wrap')?.remove());

  await expect(page.locator('.ran-popover-dropdown')).toHaveCount(0);
});
