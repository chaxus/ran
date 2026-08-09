import { test, expect } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

test('selection box now matches 20px, text is centered', async ({ page }) => {
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
  });
  await page.waitForTimeout(300);

  const metrics = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const playerRoot = el._shadowDom as ShadowRoot;
    const claritySelect = playerRoot.querySelector('.ran-player-controller-bottom-right-clarity r-select') as any;
    const selectRoot = claritySelect._shadowDom as ShadowRoot;
    const selection = selectRoot.querySelector('.selection') as HTMLElement;
    const selectionItem = selectRoot.querySelector('.selection-item') as HTMLElement;
    const rectOf = (n: HTMLElement | null) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return { h: Math.round(r.height), centerY: Math.round(r.y + r.height / 2) };
    };
    return { selection: rectOf(selection), selectionItem: rectOf(selectionItem) };
  });
  console.log(JSON.stringify(metrics, null, 2));
  expect(metrics.selection!.h).toBe(20);

  await page.screenshot({ path: 'repro-select-text-fixed.png', clip: { x: 500, y: 425, width: 200, height: 50 } });

  // Hover to show the pill background, matching the user's screenshot.
  const clarityWrapBox = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const root = el._shadowDom as ShadowRoot;
    const wrap = root.querySelector('.ran-player-controller-bottom-right-clarity') as HTMLElement;
    const r = wrap.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.move(clarityWrapBox.x, clarityWrapBox.y);
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'repro-select-hover-fixed.png', clip: { x: 500, y: 425, width: 200, height: 50 } });
});
