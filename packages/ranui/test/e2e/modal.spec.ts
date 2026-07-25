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

  // Two things this test used to get wrong, both stemming from the same assumption that
  // r-modal behaves like a plain element:
  //
  // 1. `expect(page.locator('r-modal')).toBeVisible()` can never pass. `:host` is
  //    `position: static` with no dimensions of its own — the dialog is a `position: fixed`
  //    child *inside* the shadow root — so the host box is 0×0 and Playwright correctly
  //    reports it hidden. Assert on the shadow content instead.
  // 2. `m.shadowRoot` is always `null` here: ranui attaches **closed** shadow roots, so the
  //    property is not the way in. Components expose the root as `_shadowDom`.
  const state = await page.evaluate(() => {
    const m = document.querySelector('r-modal') as (HTMLElement & { _shadowDom?: ShadowRoot }) | null;
    const root = m?._shadowDom;
    const dialogRoot = root?.querySelector('.ran-modal-root') as HTMLElement | null;
    const title = root?.querySelector('[part="title"], .ran-modal-title, .modal-title');
    return {
      opened: dialogRoot?.hasAttribute('open') ?? false,
      visibility: dialogRoot ? getComputedStyle(dialogRoot).visibility : null,
      title: title?.textContent?.trim() ?? '',
    };
  });

  expect(state.opened).toBe(true);
  expect(state.visibility).toBe('visible');
  expect(state.title).toBe('Demo Modal');
});
