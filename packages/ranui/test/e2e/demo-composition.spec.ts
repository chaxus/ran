import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';

for (const width of [1280, 900, 360, 320]) {
  test(`demo shell and stages retain coherent proportions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${DEV_SERVER}components`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#component-select')).toBeVisible();
    const geometry = await page.evaluate(() => {
      const brand = document.querySelector('.brand span')!;
      const line = getComputedStyle(brand);
      const range = document.createRange();
      range.selectNodeContents(brand);
      const rows = Array.from(range.getClientRects()).filter((rect) => rect.width > 0);
      const titles = ['input', 'select', 'checkbox'].map((name) => {
        const card = document.querySelector(`#component-${name}`)!;
        return card.querySelector('h3')!.getBoundingClientRect().top - card.getBoundingClientRect().top;
      });
      return {
        titleOffsets: titles,
        taglineRows: line.display === 'none' ? 0 : rows.length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        controls: Array.from(document.querySelectorAll('.route-link, .topbar-actions > *, .brand strong')).map((el) => {
          const rect = el.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        }),
      };
    });
    expect(geometry.taglineRows).toBeLessThanOrEqual(1);
    expect(Math.max(...geometry.titleOffsets) - Math.min(...geometry.titleOffsets)).toBeLessThanOrEqual(1);
    expect(geometry.overflow).toBe(false);
    for (const control of geometry.controls) {
      expect(control.left).toBeGreaterThanOrEqual(0);
      expect(control.right).toBeLessThanOrEqual(width);
    }
  });
}
