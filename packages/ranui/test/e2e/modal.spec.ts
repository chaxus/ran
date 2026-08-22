import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 800, height: 600 } });

const MODAL_HTML = `
  <div>
    <r-button id="open-btn" type="primary" onclick="
      const m = document.querySelector('r-modal');
      if (typeof m.open === 'function') m.open(); else m.setAttribute('open', '');
    ">Open Modal</r-button>
    <r-modal id="demo-modal" heading="Demo Modal">
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
});

test('modal — open', async ({ page }) => {
  await mount(page, MODAL_HTML);
  await page.locator('#open-btn').click();
  await page.waitForTimeout(150);
  // Modal overlays the whole viewport — screenshot the page
  await expect(page).toHaveScreenshot('modal-open.png');
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

test.describe('modal — closing attribute lifecycle', () => {
  // `close()` removes `open` synchronously, but the mask/dialog fade-and-scale
  // CSS transition keeps painting for ~0.3s more. A host page that escalates
  // z-index only while `[open]` is present (see docs' `Demo.vue`, which lifts
  // `r-modal` above its own sticky nav) would otherwise drop that escalation
  // mid-fade, and the still-visible mask repaints *under* the nav for the
  // rest of the close — reported as the mask closing "in regions" instead of
  // as one sheet. `closing` stays set for exactly that tail so a host can key
  // off `:has(r-modal[open]), :has(r-modal[closing])` instead. Needs real
  // transition timing, so this block opts out of the suite-wide reduced-motion
  // freeze (see playwright.config.ts) rather than the frozen ~0.01ms duration.
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('stays set through the close transition tail, then clears', async ({ page }) => {
    await mount(page, MODAL_HTML);
    await page.locator('#open-btn').click();
    await page.waitForTimeout(150);

    const hasClosingAttr = () =>
      page.evaluate(() => document.querySelector('r-modal')?.hasAttribute('closing') ?? false);

    expect(await hasClosingAttr()).toBe(false);

    await page.evaluate(() => (document.querySelector('r-modal') as any).close('program'));
    // Immediately after close(), the fade transition is still in flight.
    expect(await hasClosingAttr()).toBe(true);

    await page.waitForTimeout(500);
    expect(await hasClosingAttr()).toBe(false);
  });
});
