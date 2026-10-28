import { expect, test } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
});

test('the glass specimen loads only when its section nears the viewport', async ({ page }) => {
  // On a phone the specimen sits well past the loader's 400px look-ahead.
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const top = await page.locator('.proof-glass').evaluate((cell) => cell.getBoundingClientRect().top);
  expect(top).toBeGreaterThan(667 + 400);
  await page.waitForLoadState('networkidle');
  expect(await page.evaluate(() => !!customElements.get('r-glass'))).toBe(false);
  await page.locator('.proof-glass').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => !!customElements.get('r-glass'))).toBe(true);
});

test('nothing in the glass specimen loops, so there is nothing to pause or reduce', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('.proof-glass').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => !!customElements.get('r-glass'))).toBe(true);
  await page.waitForTimeout(500);
  const running = await page.locator('.proof-glass r-glass').evaluate((host) => {
    const root = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
    return root.getAnimations().filter((animation) => animation.playState === 'running').length;
  });
  expect(running).toBe(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the specimen label still reads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.proof-glass figcaption')).toBeVisible();
    await expect(page.locator('.proof-pane code')).toHaveText('<r-glass>');
  });
});
