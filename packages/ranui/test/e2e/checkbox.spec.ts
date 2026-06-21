import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 200 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-checkbox');
});

test('checkbox — unchecked', async ({ page }) => {
  await mount(page, `<r-checkbox>Unchecked</r-checkbox>`);
  const el = page.locator('r-checkbox');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('checkbox-unchecked.png');
  await argosScreenshot(page, 'checkbox-unchecked', { element: el });
});

test('checkbox — checked', async ({ page }) => {
  await mount(page, `<r-checkbox checked="true">Checked</r-checkbox>`);
  const el = page.locator('r-checkbox');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('checkbox-checked.png');
  await argosScreenshot(page, 'checkbox-checked', { element: el });
});

test('checkbox — disabled unchecked', async ({ page }) => {
  await mount(page, `<r-checkbox disabled>Disabled</r-checkbox>`);
  const el = page.locator('r-checkbox');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('checkbox-disabled-unchecked.png');
  await argosScreenshot(page, 'checkbox-disabled-unchecked', { element: el });
});

test('checkbox — disabled checked', async ({ page }) => {
  await mount(page, `<r-checkbox disabled checked="true">Disabled checked</r-checkbox>`);
  const el = page.locator('r-checkbox');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('checkbox-disabled-checked.png');
  await argosScreenshot(page, 'checkbox-disabled-checked', { element: el });
});

test('checkbox — all variants row', async ({ page }) => {
  await mount(
    page,
    `
    <div style="display: flex; gap: 16px; align-items: center;">
      <r-checkbox>Unchecked</r-checkbox>
      <r-checkbox checked="true">Checked</r-checkbox>
      <r-checkbox disabled>Disabled</r-checkbox>
      <r-checkbox disabled checked="true">Disabled checked</r-checkbox>
    </div>
  `,
  );
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('checkbox-all-variants.png');
  await argosScreenshot(page, 'checkbox-all-variants', { element: el });
});
