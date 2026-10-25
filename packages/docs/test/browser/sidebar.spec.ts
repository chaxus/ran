import { test, expect } from '@playwright/test';

// The navigation is server-rendered; its layout must work before the client loads.
test.use({ javaScriptEnabled: false });

for (const variant of [
  { name: 'wide Chinese', path: '/cn/ranui/', width: 1512, height: 861, theme: 'light' },
  { name: 'short desktop', path: '/ranui/', width: 900, height: 540, theme: 'dark' },
  { name: 'Persian RTL', path: '/fa/ranui/', width: 1512, height: 861, theme: 'dark' },
] as const) {
  test(`${variant.name} keeps all components reachable while reading a long page`, async ({ page }) => {
    await page.setViewportSize({ width: variant.width, height: variant.height });
    await page.emulateMedia({ colorScheme: variant.theme, reducedMotion: 'reduce' });
    await page.goto(variant.path);
    const sidebar = page.locator('.sidebar');
    const headerBottom = await page
      .locator('.site-header')
      .evaluate((element) => element.getBoundingClientRect().bottom);
    expect(await sidebar.evaluate((element) => element.scrollHeight - element.clientHeight)).toBeGreaterThan(100);

    await page.evaluate(() => window.scrollTo(0, 700));
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(700);
    // A sticky element with its inset reset to auto scrolls out with the article.
    await expect.poll(() => sidebar.evaluate((element) => element.getBoundingClientRect().top)).toBe(headerBottom);
    const bounds = (await sidebar.boundingBox())!;
    expect(bounds.y + bounds.height).toBeCloseTo(variant.height, 0);

    await sidebar.hover();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => sidebar.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBe(700);

    const last = sidebar.locator('a').last();
    await last.focus();
    await expect(last).toBeFocused();
    const lastBounds = (await last.boundingBox())!;
    expect(lastBounds.y).toBeGreaterThanOrEqual(headerBottom);
    expect(lastBounds.y + lastBounds.height).toBeLessThanOrEqual(variant.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(variant.width);
  });
}

for (const path of ['/cn/ranui/', '/fa/ranui/']) {
  test(`the narrow drawer still opens and scrolls without a client bundle on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 720 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const sidebar = page.locator('.sidebar');
    const closed = (await sidebar.boundingBox())!;
    expect(closed.x + closed.width <= 0 || closed.x >= 390).toBe(true);
    await page.locator('.drawer__button').click();
    await expect(page.locator('#drawer')).toBeChecked();
    await expect
      .poll(async () => {
        const bounds = (await sidebar.boundingBox())!;
        return bounds.x >= 0 && bounds.x + bounds.width <= 390;
      })
      .toBe(true);
    const opened = (await sidebar.boundingBox())!;
    expect(opened.x).toBeGreaterThanOrEqual(0);
    expect(opened.x + opened.width).toBeLessThanOrEqual(390);
    expect(opened.y + opened.height).toBeCloseTo(720, 0);
    await sidebar.hover();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => sidebar.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });
}
