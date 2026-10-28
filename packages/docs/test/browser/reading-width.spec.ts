import { expect, test } from './fixtures';

test('prose, tables and code end on one edge with the outline beside them', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ranui/coding-guides/');
  const edges = await page.evaluate(() => {
    const right = (selector: string): number =>
      Math.round(document.querySelector(selector)!.getBoundingClientRect().right);
    return {
      prose: right('.prose > p'),
      table: right('.prose .table-wrap'),
      code: right('.prose > figure.code'),
      outlineGap: Math.round(document.querySelector('.toc')!.getBoundingClientRect().left) - right('.prose'),
    };
  });
  expect(edges.table).toBe(edges.prose);
  expect(edges.code).toBe(edges.prose);
  expect(edges.outlineGap).toBeLessThanOrEqual(48);
});

test('an identifier in a table cell is never split across lines', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/ranui/player/');
  const split = await page.evaluate(() =>
    [...document.querySelectorAll('.prose td .code-word')]
      .filter((code) => code.getClientRects().length > 1)
      .map((code) => code.textContent),
  );
  expect(split).toEqual([]);
});

test('header navigation is lowercase, except German nouns and the drawer copy', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const labels = async (path: string, selector: string): Promise<string[]> => {
    await page.goto(path);
    return page.locator(selector).evaluateAll((links) => links.map((link) => (link as HTMLElement).innerText));
  };
  expect(await labels('/ranui/', '.site-header .nav__link')).toEqual(['design', 'ranui', 'ranuts', 'agents']);
  expect(await labels('/de/ranui/', '.site-header .nav__link')).toContain('Agenten');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/ranui/');
  await page.locator('.drawer__button').click();
  expect(await page.locator('.mobile-nav > .nav__link').first().innerText()).toBe('Design');
});
