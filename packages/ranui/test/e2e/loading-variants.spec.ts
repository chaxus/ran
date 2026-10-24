import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount, settlePending } from './helpers';

test.beforeEach(async ({ page }) => isolatedSetup(page, DEV_SERVER, 'r-loading'));

test('arc keeps its loading label visible and in flow with reduced motion in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => document.documentElement.setAttribute('data-ran-theme', theme), theme);
    await mount(page, '<r-loading name="arc"></r-loading>');
    await settlePending(page, 'r-loading');
    const result = await insideShadow(page, 'r-loading', (root) => {
      const label = root.querySelector('h1')!;
      const text = root.querySelector('span')!;
      const style = getComputedStyle(label);
      return {
        display: getComputedStyle(text).display,
        color: style.color,
        weight: Number(style.fontWeight),
        expected: getComputedStyle(document.body).color,
        contained:
          label.getBoundingClientRect().bottom <= root.querySelector('.arc')!.getBoundingClientRect().bottom + 1,
      };
    });
    expect(result.display).not.toBe('none');
    expect(result.weight).toBeGreaterThanOrEqual(400);
    expect(result.color).toBe(result.expected);
    expect(result.contained).toBe(true);
  }
});

test('dot-pulse shows all five static dots immediately in reduced motion', async ({ page }) => {
  await mount(page, '<r-loading name="dot-pulse"></r-loading>');
  await settlePending(page, 'r-loading');
  const dots = await insideShadow(page, 'r-loading', (root) =>
    Array.from(root.querySelectorAll('.dot-pulse-item-dot')).map((el) => {
      const style = getComputedStyle(el);
      const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
      return { scale: Math.hypot(matrix.a, matrix.b), animation: style.animationName };
    }),
  );
  expect(dots).toHaveLength(5);
  for (const dot of dots) {
    expect(dot.scale).toBe(1);
    expect(dot.animation).toBe('none');
  }
});

test('status marks contrast with both surfaces and drop text stays outside its animated fill', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => document.documentElement.setAttribute('data-ran-theme', theme), theme);
    await mount(page, '<r-loading name="pulse"></r-loading><r-loading name="drop"></r-loading>');
    await settlePending(page, 'r-loading');
    const result = await insideShadow(page, 'r-loading[name="pulse"]', (root) => {
      const luminance = (color: string): number => {
        const values = color
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map((n) => {
            const v = n / 255;
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          });
        return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
      };
      const probe = document.createElement('div');
      probe.style.background = 'var(--ran-color-bg)';
      document.body.append(probe);
      const background = luminance(getComputedStyle(probe).backgroundColor);
      probe.remove();
      const foreground = luminance(getComputedStyle(root.querySelector('.pulse-bubble')!).backgroundColor);
      return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    });
    expect(result).toBeGreaterThanOrEqual(3);
    const geometry = await insideShadow(page, 'r-loading[name="drop"]', (root) => {
      const label = root.querySelector('.drop-item-bg')!;
      const fill = root.querySelector('.drop-item')!;
      return { labelTop: label.getBoundingClientRect().top, fillBottom: fill.getBoundingClientRect().bottom };
    });
    expect(geometry.labelTop).toBeGreaterThanOrEqual(geometry.fillBottom + 4);
  }
});
