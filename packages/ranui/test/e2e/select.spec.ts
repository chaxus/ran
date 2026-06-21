import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 400 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
});

// ── with value ──────────────────────────────────────────────────────────────

test('select — with value', async ({ page }) => {
  await mount(page, `
    <div id="popup-root"></div>
    <r-select id="sel" style="width: 200px" defaultValue="lucy"
      getPopupContainerId="popup-root" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
      <r-option value="tom">Tom</r-option>
    </r-select>
  `);
  const el = page.locator('#sel');
  await expect(el).toBeVisible();
  await page.waitForTimeout(50);

  await expect(el).toHaveScreenshot('select-with-value.png');
  await argosScreenshot(page, 'select-with-value', { element: el });

  // Selected text must be vertically centred inside the trigger.
  // This assertion fails when selection-item lacks align-items/line-height centering.
  // Screenshots above are created first so baseline generation always works.
  const centering = await page.evaluate(() => {
    const host = document.querySelector('#sel') as any;
    const root = host?.shadowRoot;
    const container = root?.querySelector('.selection') as HTMLElement | null;
    const item = root?.querySelector('.selection-item') as HTMLElement | null;
    if (!container || !item) return null;
    const range = document.createRange();
    range.selectNodeContents(item);
    const textBox = range.getBoundingClientRect();
    const cBox = container.getBoundingClientRect();
    const textMid = textBox.top + textBox.height / 2;
    const containerMid = cBox.top + cBox.height / 2;
    return { diff: Math.abs(textMid - containerMid) };
  });

  expect(centering).not.toBeNull();
  expect(centering!.diff).toBeLessThanOrEqual(3);
});

// ── placeholder (no value) ──────────────────────────────────────────────────

test('select — placeholder', async ({ page }) => {
  await mount(page, `
    <div id="popup-root"></div>
    <r-select style="width: 200px" getPopupContainerId="popup-root" trigger="click">
      <r-option value="apple">Apple</r-option>
      <r-option value="banana">Banana</r-option>
    </r-select>
  `);
  const el = page.locator('r-select');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('select-placeholder.png');
  await argosScreenshot(page, 'select-placeholder', { element: el });
});

// ── showSearch ───────────────────────────────────────────────────────────────

test('select — showSearch', async ({ page }) => {
  await mount(page, `
    <div id="popup-root"></div>
    <r-select style="width: 200px" showSearch getPopupContainerId="popup-root" trigger="click">
      <r-option value="apple">Apple</r-option>
      <r-option value="banana">Banana</r-option>
      <r-option value="grape">Grape</r-option>
    </r-select>
  `);
  const el = page.locator('r-select');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('select-show-search.png');
  await argosScreenshot(page, 'select-show-search', { element: el });
});

// ── disabled ─────────────────────────────────────────────────────────────────

test('select — disabled', async ({ page }) => {
  await mount(page, `
    <r-select style="width: 200px" disabled defaultValue="lucy">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
    </r-select>
  `);
  const el = page.locator('r-select');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('select-disabled.png');
  await argosScreenshot(page, 'select-disabled', { element: el });
});

// ── open dropdown ─────────────────────────────────────────────────────────────

test('select — open dropdown', async ({ page }) => {
  await mount(page, `
    <div id="popup-root" style="position: relative; min-height: 4px;"></div>
    <r-select style="width: 200px" defaultValue="lucy"
      getPopupContainerId="popup-root" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
      <r-option value="tom">Tom</r-option>
    </r-select>
  `);
  await page.locator('r-select').click();
  await page.waitForTimeout(350);
  await expect(page).toHaveScreenshot('select-open.png');
  await argosScreenshot(page, 'select-open');
});
