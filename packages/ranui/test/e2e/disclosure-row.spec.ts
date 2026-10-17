import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

/**
 * `r-disclosure-row` is the chrome a run of tool calls reads as a list through, so the
 * assertions here are about the shape rather than the pixels: one line, a summary that
 * truncates instead of wrapping, and a control that is only a control when there is
 * something to open.
 *
 * Geometry runs across engines; visual comparison uses the pinned container
 * (see `playwright.visual.config.ts`) on both local machines and CI.
 *
 * Everything the element draws is inside a closed shadow root, so Playwright's locators
 * find none of it; assertions go through {@link insideShadow} or through the host's own box.
 */
test.describe('r-disclosure-row', () => {
  test.beforeEach(async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-disclosure-row');
  });

  test('stays on one line however long the summary is', async ({ page }) => {
    // A row that wraps stops being scannable, and scannability is the whole reason a run of
    // these is a list instead of a wall.
    await mount(
      page,
      `<div style="width: 360px">
         <r-disclosure-row id="short" heading="ls" summary="/repo"></r-disclosure-row>
         <r-disclosure-row id="long" heading="fetch_url" summary="${'https://example.com/very/long/path/'.repeat(8)}"></r-disclosure-row>
       </div>`,
    );
    const heights = await page.evaluate(() =>
      ['short', 'long'].map((id) => Math.round(document.getElementById(id)!.getBoundingClientRect().height)),
    );
    expect(heights[0]).toBe(heights[1]);
  });

  test('never pushes its container wider than the space it was given', async ({ page }) => {
    // The failure this guards is `width: 100%` plus padding without border-box, which
    // overflowed a column and clipped every line at the right edge.
    await mount(
      page,
      `<div id="box" style="width: 300px; overflow: hidden">
         <r-disclosure-row heading="fetch_url" summary="${'x'.repeat(400)}"></r-disclosure-row>
       </div>`,
    );
    const overflow = await page.evaluate(() => {
      const box = document.getElementById('box')!;
      return box.scrollWidth - box.clientWidth;
    });
    expect(overflow).toBe(0);
  });

  test('is a control only when there is something to open', async ({ page }) => {
    // A press that reveals nothing is worse than no control, so a row with no body is not a
    // control at all: no role, no tab stop, no expanded state. A focusable `aria-disabled`
    // button would still take a tab stop to say "nothing here", which is the arrangement
    // this replaced.
    const controlShape = (host: string) =>
      insideShadow(page, host, (root) => {
        const row = root.querySelector('.ran-disclosure-row');
        return {
          role: row?.getAttribute('role') ?? null,
          tabindex: row?.getAttribute('tabindex') ?? null,
          expanded: row?.getAttribute('aria-expanded') ?? null,
        };
      });

    await mount(page, `<r-disclosure-row heading="Ping"></r-disclosure-row>`);
    expect(await controlShape('r-disclosure-row')).toEqual({ role: null, tabindex: null, expanded: null });

    await mount(page, `<r-disclosure-row expandable heading="Read"><p>body</p></r-disclosure-row>`);
    expect(await controlShape('r-disclosure-row')).toEqual({ role: 'button', tabindex: '0', expanded: 'false' });
  });

  test('opens and closes on a click anywhere on the row and reveals its body', async ({ page }) => {
    // The whole row is the control, which is why the click lands on the host rather than on
    // a target inside it.
    await mount(
      page,
      `<r-disclosure-row expandable heading="Read" summary="a.ts"><p id="body">contents</p></r-disclosure-row>`,
    );
    const row = page.locator('r-disclosure-row');
    const body = page.locator('#body');
    const expectCollapsed = async () => {
      // Playwright skips native checkVisibility in WebKit, whose fallback only sees the
      // slotted paragraph's nonzero box and misses its shadow ancestor's content-visibility.
      // Ask the browser whether it renders, then also verify layout and accessibility.
      await expect.poll(() => body.evaluate((element) => element.checkVisibility())).toBe(false);
      expect(
        await insideShadow(page, 'r-disclosure-row', (root) => {
          const panel = root.querySelector<HTMLElement>('[part="body"]')!;
          const control = root.querySelector<HTMLElement>('[part="row"]')!;
          return {
            bodyHeight: panel.getBoundingClientRect().height,
            rowOnly: root.host.getBoundingClientRect().height === control.getBoundingClientRect().height,
            inert: panel.querySelector('[inert]') !== null,
          };
        }),
      ).toEqual({ bodyHeight: 0, rowOnly: true, inert: true });
    };

    await expectCollapsed();
    await row.click();
    await expect(body).toBeVisible();
    await expect.poll(() => body.evaluate((element) => element.checkVisibility())).toBe(true);
    await expect(row).toHaveAttribute('open', '');
    expect(
      await insideShadow(page, 'r-disclosure-row', (root) => root.querySelector('[part="body"] [inert]') === null),
    ).toBe(true);

    // Once open, the host's center can be in the body; keep this click on its summary row.
    await row.click({ position: { x: 8, y: 8 } });
    await expect(row).not.toHaveAttribute('open', '');
    await expectCollapsed();
  });

  test('does not open a row with nothing inside, however hard it is clicked', async ({ page }) => {
    await mount(page, `<r-disclosure-row heading="Ping"></r-disclosure-row>`);
    await page.locator('r-disclosure-row').click();
    await expect(page.locator('r-disclosure-row')).not.toHaveAttribute('open', '');
  });

  test('sets no native tooltip, whatever it is headed with', async ({ page }) => {
    // `title` is a native HTMLElement attribute and the browser renders it as a tooltip. A
    // component that used it for a heading made every row sprout a tooltip repeating the
    // text already on screen, and nothing switches that off once the attribute is set.
    await mount(page, `<r-disclosure-row heading="fetch_url" summary="https://example.com"></r-disclosure-row>`);
    await expect(page.locator('r-disclosure-row')).not.toHaveAttribute('title', /.*/);
    const insideTitle = await insideShadow(page, 'r-disclosure-row', (root) => root.querySelector('[title]') === null);
    expect(insideTitle).toBe(true);
  });

  test('renders', { tag: '@visual' }, async ({ page }) => {
    await mount(
      page,
      `<div id="column" style="width: 420px; display: flex; flex-direction: column; gap: 4px">
         <r-disclosure-row heading="读取当前时间" summary="Asia/Shanghai"></r-disclosure-row>
         <r-disclosure-row expandable heading="抓取网页" summary="https://example.com"><p>body</p></r-disclosure-row>
         <r-disclosure-row heading="写入 plan.md"></r-disclosure-row>
       </div>`,
    );
    await expect(page.locator('#column')).toHaveScreenshot('disclosure-row.png');
  });
});
