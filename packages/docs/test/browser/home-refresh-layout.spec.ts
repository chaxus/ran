import { expect, test } from './fixtures';

/**
 * Refresh flash: FOUC plates must not stack on Declarative Shadow DOM hosts.
 * Before the fix, `r-button:not(:defined)` padding sat on top of the DSD
 * `.ran-btn-content` box (50px → 32px on upgrade) and shifted the home hero ~18px.
 */
test('home invite button is 32px with DSD before and after upgrade', async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const wire = await page.request.get('/');
  const html = await wire.text();
  expect(html).toMatch(/r-button class="example__submit"[^>]*data-ran-dsd/);
  expect(html).toMatch(/r-button class="example__submit"[\s\S]*?shadowrootmode="closed"/);

  // First paint without the client bundle: DSD must already be the upgraded size.
  await context.route('**/*', (route) => {
    if (route.request().resourceType() === 'script' && new URL(route.request().url()).pathname.startsWith('/assets/')) {
      return route.abort();
    }
    return route.continue();
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const before = await page.evaluate(() => {
    const btn = document.querySelector('.example__submit');
    const example = document.querySelector('.example');
    const hero = document.querySelector('.hero-copy');
    const box = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { h: Math.round(r.height), y: Math.round(r.top) };
    };
    return {
      defined: Boolean(customElements.get('r-button')),
      btn: box(btn),
      example: box(example),
      hero: box(hero),
    };
  });
  expect(before.defined).toBe(false);
  expect(before.btn?.h).toBe(32);

  await context.unrouteAll({ behavior: 'ignoreErrors' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => customElements.get('r-button'));
  const after = await page.evaluate(() => {
    const btn = document.querySelector('.example__submit');
    const example = document.querySelector('.example');
    const hero = document.querySelector('.hero-copy');
    const box = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { h: Math.round(r.height), y: Math.round(r.top) };
    };
    return { btn: box(btn), example: box(example), hero: box(hero) };
  });
  expect(after.btn?.h).toBe(32);
  expect(after.example?.h).toBe(before.example?.h);
  expect(Math.abs((after.hero?.y ?? 0) - (before.hero?.y ?? 0))).toBeLessThanOrEqual(1);
});
