import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
});

test('outside Select and propagation-stopping controls dismiss the popover', async ({ page }) => {
  await mount(
    page,
    `
    <div style="display:flex;gap:16px;padding:60px">
      <r-popover trigger="click"><button id="info">Details</button><r-content>Information</r-content></r-popover>
      <r-select style="width:120px"><r-option value="one">One</r-option><r-option value="two">Two</r-option></r-select>
      <button id="outside">Other action</button>
    </div>
  `,
  );
  await page.locator('#info').click();
  await expect(page.locator('r-popover')).toHaveAttribute('open', '');
  await page.locator('r-select').click();
  await expect(page.locator('r-popover')).not.toHaveAttribute('open', '');
  await expect(page.locator('r-select')).toHaveAttribute('open', '');
  await page.locator('#info').click();
  await page.locator('#outside').evaluate((el) => el.addEventListener('click', (event) => event.stopPropagation()));
  await page.locator('#outside').click();
  await expect(page.locator('r-popover')).not.toHaveAttribute('open', '');
});

test('selecting in a nested portal keeps the parent disclosure open', async ({ page }) => {
  await mount(
    page,
    `
    <r-popover trigger="click" placement="bottom"><button id="info">Details</button><r-content>
      <r-select style="width:120px"><r-option value="one">One</r-option><r-option value="two">Two</r-option></r-select>
    </r-content></r-popover>
  `,
  );
  await page.locator('#info').click();
  await page.locator('r-select').click();
  await expect(page.locator('r-popover')).toHaveAttribute('open', '');
  await page.locator('r-dropdown-item').filter({ hasText: 'Two' }).click();
  await expect(page.locator('r-select')).toHaveAttribute('value', 'two');
  await expect(page.locator('r-popover')).toHaveAttribute('open', '');
  await page.locator('#info').click();
  await expect(page.locator('r-popover')).not.toHaveAttribute('open', '');
});
