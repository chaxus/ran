import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 800, height: 600 } });

const MODAL_HTML = `
  <div>
    <r-button id="open-btn" type="primary" onclick="
      const m = document.querySelector('r-modal');
      if (typeof m.open === 'function') m.open(); else m.setAttribute('open', '');
    ">Open Modal</r-button>
    <r-modal id="demo-modal" title="Demo Modal">
      <p>This is modal body content.</p>
      <r-button onclick="document.querySelector('r-modal').removeAttribute('open')">Close</r-button>
    </r-modal>
  </div>
`;

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-modal');
});

test('modal — closed (trigger only)', async ({ page }) => {
  await mount(page, MODAL_HTML);
  await expect(page.locator('#open-btn')).toBeVisible();
  await expect(page.locator('div').first()).toHaveScreenshot('modal-closed.png');
  await argosScreenshot(page, 'modal-closed', { element: page.locator('div').first() });
});

test('modal — open', async ({ page }) => {
  await mount(page, MODAL_HTML);
  await page.locator('#open-btn').click();
  await page.waitForTimeout(150);
  // Modal overlays the whole viewport — screenshot the page
  await expect(page).toHaveScreenshot('modal-open.png');
  await argosScreenshot(page, 'modal-open');
});

test('modal — title visible when open', async ({ page }) => {
  await mount(page, MODAL_HTML);
  await page.locator('#open-btn').click();
  await page.waitForTimeout(150);
  const modal = page.locator('r-modal');
  await expect(modal).toBeVisible();
  // Confirm title text is rendered in the modal header (in shadow DOM)
  const titleText = await page.evaluate(() => {
    const m = document.querySelector('r-modal') as any;
    return m?.shadowRoot?.querySelector('[part="title"], .ran-modal-title, .modal-title')?.textContent ?? '';
  });
  expect(titleText.trim()).toBe('Demo Modal');
});
