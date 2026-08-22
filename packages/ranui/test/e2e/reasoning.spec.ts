import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

/**
 * Everything the element draws lives in a closed shadow root — and the row heading it has
 * one of its own — so assertions go through {@link insideShadow} or the host's box.
 */
test.describe('r-reasoning', () => {
  test.beforeEach(async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-reasoning');
  });

  test('is headed with the same row a tool call uses', async ({ page }) => {
    // One disclosure language per transcript. The two used to look nothing alike.
    await mount(page, `<div id="column" style="width: 420px"><r-reasoning></r-reasoning></div>`);
    const heading = await insideShadow(page, 'r-reasoning', (root) => root.querySelector('r-disclosure-row') !== null);
    expect(heading).toBe(true);
  });

  test('stays on one line while collapsed, however long the thinking is', async ({ page }) => {
    await mount(page, `<div id="column" style="width: 420px"><r-reasoning></r-reasoning></div>`);
    await page.evaluate(() => {
      const block = document.querySelector('r-reasoning') as HTMLElement & { content: string; streaming: boolean };
      block.streaming = false;
      block.content = Array.from({ length: 40 }, (_, i) => `推理的第 ${i} 行，写得相当长一些以便撑开宽度`).join('\n');
    });
    const height = (await page.locator('r-reasoning').boundingBox())?.height ?? 0;
    expect(height).toBeLessThanOrEqual(28);
  });

  test('opens while thinking and closes when it stops, unless the reader intervenes', async ({ page }) => {
    await mount(page, `<div id="column" style="width: 420px"><r-reasoning></r-reasoning></div>`);
    const setStreaming = (value: boolean) =>
      page.evaluate((v) => {
        (document.querySelector('r-reasoning') as HTMLElement & { streaming: boolean }).streaming = v;
      }, value);

    await setStreaming(true);
    await expect(page.locator('r-reasoning')).toHaveAttribute('open', '');
    await setStreaming(false);
    await expect(page.locator('r-reasoning')).not.toHaveAttribute('open', '');

    // The reader's own gesture takes the automatic behaviour off the table for good.
    await page.locator('r-reasoning').click();
    await expect(page.locator('r-reasoning')).toHaveAttribute('open', '');
    await setStreaming(true);
    await setStreaming(false);
    await expect(page.locator('r-reasoning')).toHaveAttribute('open', '');
  });

  test('renders', async ({ page }) => {
    await mount(page, `<div id="column" style="width: 420px; display: flex; flex-direction: column; gap: 12px"></div>`);
    await page.evaluate(() => {
      const column = document.getElementById('column')!;
      const make = (label: string, streaming: boolean, duration: number | null) => {
        const block = document.createElement('r-reasoning') as HTMLElement & {
          content: string;
          streaming: boolean;
          label: string;
          duration: number | null;
        };
        column.appendChild(block);
        block.label = label;
        block.duration = duration;
        block.streaming = streaming;
        block.content = '先看小数部分\n0.9 比 0.11 大\n所以 9.9 更大';
        return block;
      };
      make('思考过程', true, null);
      make('思考过程', false, 4200);
    });
    await expect(page.locator('#column')).toHaveScreenshot('reasoning.png');
  });
});
