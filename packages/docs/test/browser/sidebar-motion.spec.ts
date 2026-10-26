import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });

const fillBox = (page: import('@playwright/test').Page) =>
  page.locator('.sb__hover').evaluate((fill) => {
    const box = fill.getBoundingClientRect();
    return {
      left: Math.round(box.left),
      top: Math.round(box.top),
      height: Math.round(box.height),
      opacity: getComputedStyle(fill).opacity,
    };
  });

// Persian too: there the scrollbar sits on the left, which once shifted the fill in WebKit.
for (const path of ['/ranui/', '/fa/ranui/']) {
  test(`on ${path} one hover fill follows the pointer between sidebar links and leaves with it`, async ({ page }) => {
    await page.goto(path);
    const links = page.locator('.sb__list .sb__link');
    await links.nth(2).hover();
    await expect.poll(async () => (await fillBox(page)).opacity).toBe('1');
    const second = (await links.nth(4).boundingBox())!;
    await links.nth(4).hover();
    await expect.poll(async () => (await fillBox(page)).top).toBe(Math.round(second.y));
    expect(await fillBox(page)).toMatchObject({ left: Math.round(second.x), height: Math.round(second.height) });
    await page.mouse.move(900, 450);
    await expect.poll(async () => (await fillBox(page)).opacity).toBe('0');
  });
}

test('the sidebar keeps its scroll position on the next page, with the new link in view', async ({ page }) => {
  await page.goto('/ranui/message/');
  const sidebar = page.locator('#doc-sidebar');
  const inView = () =>
    sidebar.evaluate((element) => {
      const current = element.querySelector('.sb__link[aria-current="page"]')!.getBoundingClientRect();
      const frame = element.getBoundingClientRect();
      return current.top >= frame.top && current.bottom <= frame.bottom;
    });
  // A first visit has nothing saved, so the current page's link is brought into view.
  expect(await inView()).toBe(true);
  const top = await sidebar.evaluate((element) => element.scrollTop);
  expect(top).toBeGreaterThan(0);
  await page.locator('.sb__link[href="/ranui/skeleton/"]').click();
  await page.waitForURL('**/ranui/skeleton/');
  // Firefox reports a fractional scrollTop and restores the whole pixel.
  expect(Math.abs((await sidebar.evaluate((element) => element.scrollTop)) - top)).toBeLessThanOrEqual(1);
  expect(await inView()).toBe(true);
});

test('a clicked link stays at the same height even when a group above it closes', async ({ page }) => {
  await page.goto('/ranuts/utils/random_string');
  const sidebar = page.locator('#doc-sidebar');
  // Open a second group below the current one, then follow a link inside it. On the next
  // page the current group closes and every row below it moves up.
  const group = page.locator('.sb__details:not([open]) > .sb__summary', { hasText: 'DOM Manipulation' });
  await group.scrollIntoViewIfNeeded();
  await group.click();
  const link = page.locator('.sb__link[href="/ranuts/utils/add_class_to_element"]');
  // Mid-sidebar, far enough down that the closing group's height can come off the scroll
  // offset; nearer the top it cannot, since scrollTop does not go below zero.
  await link.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  const offset = (el: HTMLElement) =>
    el.getBoundingClientRect().top - document.getElementById('doc-sidebar')!.getBoundingClientRect().top;
  const before = await link.evaluate(offset);
  await link.click();
  await page.waitForURL('**/ranuts/utils/add_class_to_element');
  const after = await sidebar.locator('.sb__link[aria-current="page"]').evaluate(offset);
  expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
});

test('pages declare a hover prefetch rule', async ({ page }) => {
  await page.goto('/ranui/');
  const rules = JSON.parse((await page.locator('script[type="speculationrules"]').textContent())!);
  expect(rules.prefetch[0].eagerness).toBe('moderate');
});

test('pages opt into a cross-page transition', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Firefox has no cross-document view transitions and drops the rule');
  await page.goto('/ranui/');
  const transition = await page.evaluate(() =>
    [...document.styleSheets].some((sheet) =>
      [...sheet.cssRules].some((rule) => rule.cssText.includes('@view-transition')),
    ),
  );
  expect(transition).toBe(true);
});
