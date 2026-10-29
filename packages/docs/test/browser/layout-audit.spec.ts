import { test, expect } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      value: Object.assign(new EventTarget(), { saveData: true }),
      configurable: true,
    });
  });
});

test.describe('native global navigation', () => {
  test.use({ javaScriptEnabled: false, hasTouch: true });
  for (const prefix of ['', '/cn', '/ja', '/ko', '/de', '/es', '/pt', '/fa']) {
    test(`all main destinations remain keyboard reachable on ${prefix || 'English'} home`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 720 });
      await page.emulateMedia({ colorScheme: ['/de', '/pt', '/fa'].includes(prefix) ? 'dark' : 'light' });
      await page.goto(`${prefix}/`);
      // A closed off-canvas menu must not expose invisible Tab stops.
      const language = page.locator('.langs__summary');
      await language.focus();
      await page.keyboard.press('Tab');
      expect(await page.locator('.sidebar').evaluate((element) => element.contains(document.activeElement))).toBe(
        false,
      );
      const toggle = page.locator('#drawer');
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(toggle).toBeChecked();
      const navigation = page.locator('.sidebar .mobile-nav');
      await expect(navigation).toBeVisible();
      const destinations = [
        `${prefix}/design/`,
        `${prefix}/ranui/`,
        `${prefix}/ranuts/`,
        `${prefix}/agents/`,
        // Secondary destinations follow the product ones, set apart in the drawer.
        'https://edit.chaxus.com/',
      ];
      expect(
        await navigation.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
      ).toEqual(destinations);
      await navigation.locator('a').first().focus();
      for (const destination of destinations) {
        const link = navigation.locator(`a[href="${destination}"]`);
        await expect(link).toBeFocused();
        await expect(link).toBeInViewport();
        await page.keyboard.press('Tab');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(toggle).not.toBeChecked();
      await language.focus();
      await page.keyboard.press('Tab');
      expect(await page.locator('.sidebar').evaluate((element) => element.contains(document.activeElement))).toBe(
        false,
      );
      await page.setViewportSize({ width: 1512, height: 861 });
      await expect(page.locator('.sidebar')).toBeHidden();
      expect(
        await page.locator('.landing').evaluate((element) => element.getBoundingClientRect().width),
      ).toBeGreaterThan(1000);
    });
  }
});

for (const width of [320, 900]) {
  test(`prose and demo grids fit their actual column at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 720 });
    for (const path of ['/ranuts/choosing/', '/cn/ranui/loading/', '/cn/ranui/glass/', '/cn/ranui/preview/']) {
      await page.goto(path);
      if (path.includes('loading')) await page.waitForFunction(() => customElements.get('r-loading'));
      if (path.includes('glass')) await page.waitForFunction(() => customElements.get('r-glass'));
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth), { message: path })
        .toBeLessThanOrEqual(width);
      for (const selector of ['.gp', '.gp-grid', '.gp-tiles', '.loading-gallery']) {
        for (const element of await page.locator(selector).all()) {
          expect(
            await element.evaluate((node) => node.scrollWidth - node.clientWidth),
            path + selector,
          ).toBeLessThanOrEqual(1);
        }
      }
    }
  });
}

for (const prefix of ['/cn', '/fa']) {
  test(`the language menu remains usable in a short touch viewport on ${prefix}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 320 });
    await page.goto(`${prefix}/ranui/`);
    await page.locator('.langs__summary').click();
    const menu = page.locator('.langs__list');
    expect(await menu.evaluate((element) => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(320);
    expect(await menu.evaluate((element) => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0);
    await menu.locator('a').last().focus();
    await expect(menu.locator('a').last()).toBeInViewport();
  });
}

test('both outline copies reflect the current heading', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('/cn/ranui/');
  await page.locator('.prose h2').nth(1).scrollIntoViewIfNeeded();
  const id = await page.locator('.prose h2').nth(1).getAttribute('id');
  await page.evaluate((target) => document.getElementById(target!)!.scrollIntoView({ block: 'start' }), id);
  await expect.poll(() => page.locator('.toc__link[data-active]').count()).toBe(2);
  const targets = await page
    .locator('.toc__link[data-active]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(new Set(targets).size).toBe(1);
});

test('a failed client request leaves the complete landing content readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.route('**/assets/docs.*.js', (route) => route.abort());
  await page.goto('/cn/');
  expect(await page.locator('.reveal').count()).toBeGreaterThan(5);
  for (const section of await page.locator('.reveal').all()) await expect(section).toHaveCSS('opacity', '1');
  await page.locator('#drawer').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('.sidebar .mobile-nav')).toBeVisible();
});

for (const motion of ['reduce', 'no-preference'] as const) {
  test(`headline remains readable without decorative entrance motion (${motion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: motion });
    await page.setViewportSize({ width: 1280, height: 800 });
    for (const path of ['/', '/cn/', '/fa/']) {
      await page.goto(path);
      const words = await page.locator('.headline .word-in').evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element);
          const range = document.createRange();
          range.selectNodeContents(element);
          const text = range.getBoundingClientRect();
          const clip = element.parentElement!.getBoundingClientRect();
          return {
            animation: style.animationName,
            opacity: style.opacity,
            transform: style.transform,
            visible: text.width > 0 && text.height > 0 && text.top >= clip.top - 1 && text.bottom <= clip.bottom + 1,
          };
        }),
      );
      expect(words.length).toBeGreaterThan(0);
      for (const word of words)
        expect(word).toEqual({ animation: 'none', opacity: '1', transform: 'none', visible: true });
    }
  });
}

// The row of figures rises digit by digit as it scrolls in, and each figure reads correctly
// at every moment of it: only transforms move, nothing fades or waits.
test('the home figures rise into place without ever showing a wrong value', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto('/');
  const stats = page.locator('.stats');
  const before = await stats.locator('.stat-num').allTextContents();
  await stats.evaluate((element) => {
    (window as unknown as { samples: string[][] }).samples = [];
    const sample = () => {
      (window as unknown as { samples: string[][] }).samples.push(
        [...element.querySelectorAll('.stat-num')].map((num) => num.textContent ?? ''),
      );
      if (performance.now() < 30_000) requestAnimationFrame(sample);
    };
    sample();
    element.scrollIntoView({ block: 'center' });
  });
  // The digits move as they arrive.
  await expect
    .poll(() => stats.evaluate((element) => element.getAnimations({ subtree: true }).length))
    .toBeGreaterThan(0);
  const moving = await stats.evaluate((element) =>
    element.getAnimations({ subtree: true }).map((animation) => {
      const frames = (animation.effect as KeyframeEffect).getKeyframes();
      return frames.every((frame) => frame.opacity === undefined) && frames.some((frame) => frame.transform !== 'none');
    }),
  );
  expect(moving.every(Boolean)).toBe(true);
  await expect.poll(() => stats.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  const samples = await page.evaluate(() => (window as unknown as { samples: string[][] }).samples);
  expect(samples.length).toBeGreaterThan(3);
  for (const sample of samples) expect(sample).toEqual(before);
});
