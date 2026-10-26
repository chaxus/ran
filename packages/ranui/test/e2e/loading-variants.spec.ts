import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount, settlePending } from './helpers';

test.beforeEach(async ({ page }) => isolatedSetup(page, DEV_SERVER, 'r-loading'));

test('arc and drop draw no text of their own; the host carries the status and its name', async ({ page }) => {
  await mount(page, '<r-loading name="arc"></r-loading><r-loading name="drop" label="Loading files"></r-loading>');
  await settlePending(page, 'r-loading');
  const hosts = await page.locator('r-loading').evaluateAll((els) =>
    els.map((el) => ({
      role: el.getAttribute('role'),
      name: el.getAttribute('aria-label'),
      text: (el as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.textContent,
      headings: (el as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelectorAll('h1,h2,h3').length,
    })),
  );
  expect(hosts).toEqual([
    { role: 'status', name: 'Loading', text: '', headings: 0 },
    { role: 'status', name: 'Loading files', text: '', headings: 0 },
  ]);
});

test('every variant lands on the size token footprint and follows --ran-loading-size', async ({ page }) => {
  const list = [
    'arc',
    'circle',
    'circle-fold',
    'circle-line',
    'circle-rotate',
    'circle-spin',
    'circle-turn',
    'cube',
    'cube-dim',
    'cube-fold',
    'cube-grid',
    'dot',
    'dot-bar',
    'dot-circle',
    'dot-line',
    'dot-pulse',
    'double-bounce',
    'drop',
    'line',
    'line-scale',
    'pacman',
    'pulse',
    'rotate',
    'scale-out',
    'solar',
    'square',
    'stretch',
    'text',
    'triple-bounce',
  ];
  await mount(page, list.map((n) => `<r-loading name="${n}"></r-loading>`).join(''));
  await settlePending(page, 'r-loading');
  const boxes = await page.locator('r-loading').evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { name: el.getAttribute('name'), w: Math.round(r.width), h: Math.round(r.height) };
    }),
  );
  for (const box of boxes) {
    if (box.name === 'text') continue;
    expect(box.h, box.name!).toBe(40);
    expect(box.w, box.name!).toBeGreaterThanOrEqual(40);
    expect(box.w, box.name!).toBeLessThanOrEqual(80);
  }
  await mount(page, '<r-loading name="circle" style="--ran-loading-size: 24px"></r-loading>');
  await settlePending(page, 'r-loading');
  const small = await page.locator('r-loading').evaluate((el) => {
    const inner = (el as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('.circle')!;
    return Math.round(inner.getBoundingClientRect().width);
  });
  expect(small).toBeLessThanOrEqual(24);
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

test('status marks contrast with both surfaces', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => document.documentElement.setAttribute('data-ran-theme', theme), theme);
    await mount(page, '<r-loading name="pulse"></r-loading>');
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
  }
});
