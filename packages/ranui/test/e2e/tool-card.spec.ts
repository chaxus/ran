import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup } from './helpers';

/**
 * Mounts a card and drives it through its property API.
 *
 * Set through properties rather than markup because that is how a conversation drives it,
 * and because `call` / `result` are objects with no attribute form.
 *
 * @param page The page under test.
 * @param cards One `{ call, result, status }` per card to mount.
 */
async function mountCards(
  page: import('@playwright/test').Page,
  cards: readonly { call: unknown; result?: unknown; status?: string }[],
): Promise<void> {
  await page.evaluate((list) => {
    document.body.innerHTML =
      '<div id="column" style="width: 420px; display: flex; flex-direction: column; gap: 4px"></div>';
    const column = document.getElementById('column')!;
    for (const entry of list) {
      const card = document.createElement('r-tool-card') as HTMLElement & {
        call: unknown;
        result: unknown;
        status: string;
      };
      column.appendChild(card);
      card.call = entry.call;
      if (entry.status !== undefined) card.status = entry.status;
      if (entry.result !== undefined) card.result = entry.result;
    }
  }, cards);
}

/**
 * Everything a card draws lives in a closed shadow root, so Playwright's locators find none
 * of it; assertions go through {@link insideShadow} or through the host's own box.
 */
test.describe('r-tool-card', () => {
  test.beforeEach(async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-tool-card');
  });

  test('is visible, even though everything it draws lives in a shadow root', async ({ page }) => {
    // The regression this exists for: a `:empty { display: none }` rule in a consumer hid
    // every tool call, because a custom element that renders entirely into its shadow root
    // has no light-DOM children and so matches `:empty` while drawing a full line.
    await mountCards(page, [{ call: { card: 'generic', title: '读取当前时间', summary: 'Asia/Shanghai' } }]);
    const box = await page.locator('r-tool-card').boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(0);
    expect(box?.width ?? 0).toBeGreaterThan(100);
    // The title is two shadow roots deep — the card slots it into `r-disclosure-row`, which
    // has a closed root of its own — so `textContent` does not reach it. The row's own
    // attribute is the observable seam, and it is what the card writes.
    expect(
      await insideShadow(page, 'r-tool-card', (root) =>
        root.querySelector('r-disclosure-row')?.getAttribute('heading'),
      ),
    ).toBe('读取当前时间');
  });

  test('is a row, not a box: a run of calls costs one line each', async ({ page }) => {
    await mountCards(page, [
      { call: { card: 'generic', title: 'one', summary: 'a' } },
      { call: { card: 'generic', title: 'two', summary: 'b' } },
      { call: { card: 'generic', title: 'three', summary: 'c' } },
    ]);
    const heights = await page.evaluate(() =>
      [...document.querySelectorAll('r-tool-card')].map((n) => Math.round(n.getBoundingClientRect().height)),
    );
    // Every collapsed call is the same single line, and that line is a line — not a card.
    expect(new Set(heights).size).toBe(1);
    expect(heights[0]).toBeLessThanOrEqual(28);
  });

  test('starts collapsed and opens onto an IN/OUT body', async ({ page }) => {
    await mountCards(page, [
      {
        call: { card: 'generic', title: 'Read', summary: 'src/a.ts', input: { path: 'src/a.ts' } },
        result: { card: 'generic', content: 'line one' },
        status: 'success',
      },
    ]);
    const collapsed = (await page.locator('r-tool-card').boundingBox())?.height ?? 0;
    await page.locator('r-tool-card').click();
    const opened = (await page.locator('r-tool-card').boundingBox())?.height ?? 0;
    expect(opened).toBeGreaterThan(collapsed);

    const labels = await insideShadow(page, 'r-tool-card', (root) =>
      [...root.querySelectorAll('.ran-tool-card-io-label')].map((node) => node.textContent),
    );
    expect(labels).toEqual(['IN', 'OUT']);
    expect(await insideShadow(page, 'r-tool-card', (root) => root.textContent ?? '')).toContain('line one');
  });

  test('offers no control for a call with nothing inside', async ({ page }) => {
    await mountCards(page, [{ call: { card: 'generic', title: 'Ping' } }]);
    const before = (await page.locator('r-tool-card').boundingBox())?.height ?? 0;
    await page.locator('r-tool-card').click();
    const after = (await page.locator('r-tool-card').boundingBox())?.height ?? 0;
    expect(after).toBe(before);
    await expect(page.locator('r-tool-card')).not.toHaveAttribute('open', '');
  });

  test('renders each lifecycle state', async ({ page }) => {
    await mountCards(page, [
      { call: { card: 'generic', title: '读取当前时间', summary: 'Asia/Shanghai' }, status: 'running' },
      {
        call: { card: 'generic', title: '抓取网页', summary: 'https://example.com' },
        result: { card: 'generic', content: 'Example Domain' },
        status: 'success',
      },
      {
        call: { card: 'generic', title: '抓取网页', summary: 'https://nope.invalid' },
        result: { card: 'generic', content: 'getaddrinfo ENOTFOUND' },
        status: 'error',
      },
    ]);
    await expect(page.locator('#column')).toHaveScreenshot('tool-card-states.png');
  });

  test('renders a diff body', async ({ page }) => {
    await mountCards(page, [
      {
        call: {
          card: 'diff',
          title: '写入 plan.md',
          summary: '先做 token 统计',
          diffs: [{ path: 'plan.md', oldText: '先做工具调用\n再做统计\n', newText: '先做 token 统计\n再做统计\n' }],
        },
        status: 'success',
      },
    ]);
    await page.locator('r-tool-card').click();
    await expect(page.locator('#column')).toHaveScreenshot('tool-card-diff.png');
  });
});
