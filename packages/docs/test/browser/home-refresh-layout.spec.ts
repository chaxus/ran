import { expect, test } from './fixtures';

/**
 * Refresh flash: FOUC plates must not stack on Declarative Shadow DOM hosts.
 * Before the fix, `r-button:not(:defined)` padding sat on top of the DSD
 * `.ran-btn-content` box (50px → 32px on upgrade) and shifted the home hero ~18px.
 */
test('home invite button is 32px with DSD before and after upgrade', async ({ browser }) => {
  const wire = await (await browser.newContext()).request.get('http://127.0.0.1:5281/');
  const html = await wire.text();
  expect(html).toMatch(/r-button class="example__submit"[^>]*data-ran-dsd/);
  expect(html).toMatch(/r-button class="example__submit"[\s\S]*?shadowrootmode="closed"/);

  const measure = async (blockScripts: boolean) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      serviceWorkers: 'block',
    });
    if (blockScripts) {
      await context.route('**/*', (route) => {
        const url = route.request().url();
        if (route.request().resourceType() === 'script' && url.includes('/assets/')) {
          return route.abort();
        }
        return route.continue();
      });
    }
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:5281/', {
      waitUntil: blockScripts ? 'domcontentloaded' : 'networkidle',
    });
    if (!blockScripts) {
      await page.waitForFunction(() => customElements.get('r-button'), null, { timeout: 15000 });
    }
    const metrics = await page.evaluate(() => {
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
    await context.close();
    return metrics;
  };

  const before = await measure(true);
  expect(before.defined).toBe(false);
  expect(before.btn?.h).toBe(32);

  const after = await measure(false);
  expect(after.defined).toBe(true);
  expect(after.btn?.h).toBe(32);
  expect(after.example?.h).toBe(before.example?.h);
  expect(Math.abs((after.hero?.y ?? 0) - (before.hero?.y ?? 0))).toBeLessThanOrEqual(1);
});
