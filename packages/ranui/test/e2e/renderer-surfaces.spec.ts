import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

const encode = encodeURIComponent;

for (const theme of ['light', 'dark'] as const) {
  test(`renderer errors share one block in ${theme}`, async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-markdown');
    await page.waitForFunction(() => !!customElements.get('r-math') && !!customElements.get('r-mermaid'));
    await page.evaluate((theme) => document.documentElement.setAttribute('data-ran-theme', theme), theme);
    await mount(
      page,
      `<r-mermaid id="mermaid" code="${encode('graph LR; A-->')}"></r-mermaid>` +
        `<r-math id="math" display="block" latex="${encode('\\frac{1}{')}"></r-math>` +
        '<r-markdown id="markdown"></r-markdown>',
    );
    await page.evaluate(async () => {
      const markdown = document.getElementById('markdown') as unknown as {
        _pending?: Promise<void>;
        showError(message: string): void;
      };
      await markdown._pending;
      markdown.showError('failed');
    });
    const read = (id: string) =>
      insideShadow(page, `#${id}`, (root) => {
        const box = root.querySelector('[part="error"]');
        if (!box) return null;
        const s = getComputedStyle(box);
        return [
          s.backgroundColor,
          s.borderTopColor,
          s.borderTopWidth,
          s.color,
          s.fontFamily,
          s.fontSize,
          s.padding,
          s.borderTopLeftRadius,
        ];
      });
    await expect.poll(() => read('mermaid'), { timeout: 15000 }).not.toBeNull();
    await expect.poll(() => read('math'), { timeout: 15000 }).not.toBeNull();
    await expect.poll(() => read('markdown')).not.toBeNull();
    const markdown = await read('markdown');
    expect(await read('mermaid')).toEqual(markdown);
    expect(await read('math')).toEqual(markdown);
    expect(markdown![5]).toBe('13px');
    expect(markdown![6]).toBe('8px 12px');
  });
}

test('a display formula never gets a vertical scrollbar', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-math');
  await mount(
    page,
    `<r-math id="math" display="block" latex="${encode('\\lim_{x\\to 0}\\frac{\\sin x}{x}=1')}"></r-math>`,
  );
  await expect
    .poll(() => insideShadow(page, '#math', (root) => !!root.querySelector('.ran-math-render math')), {
      timeout: 15000,
    })
    .toBe(true);
  const overflowY = await insideShadow(page, '#math', (root) => {
    const render = root.querySelector('.ran-math-render') as HTMLElement;
    return getComputedStyle(render).overflowY;
  });
  expect(overflowY).not.toMatch(/auto|scroll/);
});
