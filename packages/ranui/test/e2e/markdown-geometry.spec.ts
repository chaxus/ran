import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup } from './helpers';

for (const theme of ['light', 'dark'] as const) {
  test(`Markdown keyboard targets remain visible in ${theme}`, async ({ page, browserName }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-markdown');
    await page.emulateMedia({ colorScheme: theme });
    await page.evaluate(async (theme) => {
      document.documentElement.setAttribute('data-ran-theme', theme);
      document.body.style.background = 'var(--ran-color-bg)';
      const reader = document.createElement('r-markdown') as HTMLElement & { content: string; _pending: Promise<void> };
      reader.id = 'reader';
      reader.setAttribute('copy', '');
      reader.style.width = '300px';
      document.body.append(reader);
      reader.content =
        '```text\nlong code line ' + 'x'.repeat(100) + '\n```\n\n| Item | Cost |\n| --- | ---: |\n| Pilot | 24 |';
      await reader._pending;
    }, theme);
    for (const expected of ['BUTTON', 'PRE', 'DIV']) {
      // Safari's platform keyboard route includes buttons with Option+Tab.
      await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
      const state = await insideShadow(page, '#reader', (root) => {
        const active = root.activeElement as HTMLElement;
        const style = getComputedStyle(active);
        return {
          tag: active.tagName,
          visible: active.matches(':focus-visible'),
          outline: style.outlineStyle,
          width: parseFloat(style.outlineWidth),
          shadow: style.boxShadow,
        };
      });
      expect(state.tag).toBe(expected);
      expect(state.visible).toBe(true);
      expect((state.outline !== 'none' && state.width > 0) || state.shadow !== 'none').toBe(true);
    }
  });
}

test('code chrome aligns to text and numeric table columns preserve their semantics', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-markdown');
  await page.evaluate(async () => {
    const reader = document.createElement('r-markdown') as HTMLElement & { content: string; _pending: Promise<void> };
    reader.id = 'reader';
    reader.setAttribute('copy', '');
    reader.style.width = '300px';
    document.body.append(reader);
    reader.content = '```text\nexample\n```\n\n| Item | Cost |\n| --- | ---: |\n| Pilot | 24 |';
    await reader._pending;
  });
  const geometry = await insideShadow(page, '#reader', (root) => {
    const language = root.querySelector('[part="code-lang"]')!;
    const pre = root.querySelector('pre')!;
    const range = document.createRange();
    range.selectNodeContents(pre.querySelector('.line')!);
    const button = root.querySelector('button')!.getBoundingClientRect();
    return {
      header: language.getBoundingClientRect().left,
      text: range.getBoundingClientRect().left,
      font: getComputedStyle(pre).fontSize,
      target: { width: button.width, height: button.height },
      align: [...root.querySelectorAll('th:last-child,td:last-child')].map((cell) => getComputedStyle(cell).textAlign),
    };
  });
  expect(Math.abs(geometry.header - geometry.text)).toBeLessThanOrEqual(0.5);
  expect(geometry.font).toBe('14px');
  expect(geometry.target.width).toBeGreaterThanOrEqual(32);
  expect(geometry.target.height).toBeGreaterThanOrEqual(32);
  expect(geometry.align).toEqual(['right', 'right']);
});
