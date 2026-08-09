import { test } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';
import fs from 'fs';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

test('capture baseline computed styles for icon/pill controls', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-player');
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.style.cssText = 'width:800px;height:450px;background:#111;position:relative;';
    const player = document.createElement('r-player') as any;
    player.setAttribute('src', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
    player.setAttribute('debug', 'true');
    container.appendChild(player);
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:24px;background:#222;';
    document.body.appendChild(container);
  });
  await page.waitForTimeout(4000);
  await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const root = el._shadowDom as ShadowRoot;
    const controller = root?.querySelector('.ran-player-controller') as HTMLElement | null;
    if (controller) controller.style.opacity = '1';
    root.querySelector('.ran-player-controller-bottom-right-pip')?.classList.remove('ran-player-controller-bottom-right-pip-hidden');
    root.querySelector('.ran-player-controller-bottom-right-remote')?.classList.remove('ran-player-controller-bottom-right-remote-hidden');
  });
  await page.waitForTimeout(300);

  const selectors: Record<string, string> = {
    toggle: '.ran-player-controller-bottom-left-btn',
    pip: '.ran-player-controller-bottom-right-pip',
    remote: '.ran-player-controller-bottom-right-remote',
    full: '.ran-player-controller-bottom-right-full',
    speed: '.ran-player-controller-bottom-right-speed',
    subtitle: '.ran-player-controller-bottom-right-subtitle',
    clarity: '.ran-player-controller-bottom-right-clarity',
  };

  const results: Record<string, any> = {};
  for (const [name, sel] of Object.entries(selectors)) {
    const base = await page.evaluate((sel) => {
      const el = document.querySelector('r-player') as any;
      const root = el._shadowDom as ShadowRoot;
      const node = root.querySelector(sel) as HTMLElement | null;
      if (!node) return { error: 'not found' };
      const rect = node.getBoundingClientRect();
      const cs = getComputedStyle(node);
      return {
        rect: { w: Math.round(rect.width), h: Math.round(rect.height) },
        display: cs.display,
        alignItems: cs.alignItems,
        justifyContent: cs.justifyContent,
        padding: cs.padding,
        borderRadius: cs.borderRadius,
        color: cs.color,
        cursor: cs.cursor,
        outline: cs.outline,
        transition: cs.transition,
      };
    }, sel);

    const box = await page.evaluate((sel) => {
      const el = document.querySelector('r-player') as any;
      const root = el._shadowDom as ShadowRoot;
      const node = root.querySelector(sel) as HTMLElement | null;
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, sel);
    let hoverBackground: string | null = null;
    if (box) {
      await page.mouse.move(box.x, box.y);
      await page.waitForTimeout(150);
      hoverBackground = await page.evaluate((sel) => {
        const el = document.querySelector('r-player') as any;
        const root = el._shadowDom as ShadowRoot;
        const node = root.querySelector(sel) as HTMLElement | null;
        return node ? getComputedStyle(node).backgroundColor : null;
      }, sel);
      await page.mouse.move(0, 0);
      await page.waitForTimeout(100);
    }

    const focusVisible = await page.evaluate((sel) => {
      const el = document.querySelector('r-player') as any;
      const root = el._shadowDom as ShadowRoot;
      const node = root.querySelector(sel) as HTMLElement | null;
      node?.focus();
      if (!node) return null;
      const cs = getComputedStyle(node);
      return {
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor,
        outlineOffset: cs.outlineOffset,
      };
    }, sel);

    results[name] = { ...base, hoverBackground, focusVisible };
  }

  fs.writeFileSync('/tmp/player-mixin-baseline.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
});
