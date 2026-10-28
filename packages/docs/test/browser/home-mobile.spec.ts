import { expect, test } from './fixtures';

for (const path of ['/', '/fa/']) {
  test(`the install code on ${path} scrolls inside its panel on a phone instead of being cut off`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(path);
    const panel = page.locator('.panel');
    expect(await panel.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
    for (const snippet of await page.locator('.panel .snippet').all()) {
      const box = await snippet.evaluate((element) => {
        const panelBox = element.closest('.panel')!.getBoundingClientRect();
        const own = element.getBoundingClientRect();
        return {
          inside: own.left >= panelBox.left - 1 && own.right <= panelBox.right + 1,
          scrolls: getComputedStyle(element).overflowX,
        };
      });
      expect(box).toEqual({ inside: true, scrolls: 'auto' });
    }
    // One left edge for the stacked column: the second cell is not inset past a divider that is gone.
    const starts = await page.locator('.panel .code-head').evaluateAll((heads) =>
      heads.map((head) => {
        const box = head.getBoundingClientRect();
        const style = getComputedStyle(head);
        const inset = parseFloat(style.paddingInlineStart);
        return Math.round(style.direction === 'rtl' ? box.right - inset : box.left + inset);
      }),
    );
    expect(new Set(starts).size).toBe(1);
  });
}
