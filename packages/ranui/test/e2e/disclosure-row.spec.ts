import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

/**
 * `r-disclosure-row` is the chrome a run of tool calls reads as a list through, so the
 * assertions here are about the shape rather than the pixels: one line, a summary that
 * truncates instead of wrapping, and a control that is only a control when there is
 * something to open.
 *
 * The geometric assertions matter more than the screenshot — visual comparison is
 * macOS-local (see `playwright.config.ts`), while these run everywhere including CI.
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
    // A press that reveals nothing is worse than no control, so the row says so rather than
    // silently doing nothing.
    await mount(page, `<r-disclosure-row heading="Ping"></r-disclosure-row>`);
    expect(
      await insideShadow(page, 'r-disclosure-row', (root) =>
        root.querySelector('.ran-disclosure-row')?.getAttribute('aria-disabled'),
      ),
    ).toBe('true');

    await mount(page, `<r-disclosure-row expandable heading="Read"><p>body</p></r-disclosure-row>`);
    expect(
      await insideShadow(page, 'r-disclosure-row', (root) =>
        root.querySelector('.ran-disclosure-row')?.getAttribute('aria-disabled'),
      ),
    ).toBeNull();
  });

  test('opens on a click anywhere on the row and reveals its body', async ({ page }) => {
    // The whole row is the control, which is why the click lands on the host rather than on
    // a target inside it.
    await mount(
      page,
      `<r-disclosure-row expandable heading="Read" summary="a.ts"><p id="body">contents</p></r-disclosure-row>`,
    );
    await expect(page.locator('#body')).toBeHidden();
    await page.locator('r-disclosure-row').click();
    await expect(page.locator('#body')).toBeVisible();
    await expect(page.locator('r-disclosure-row')).toHaveAttribute('open', '');
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

  test('renders', async ({ page }) => {
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
