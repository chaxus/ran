import { test, expect } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

test('label text is centered inside speed/clarity pill (not left-aligned)', async ({ page }) => {
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

  for (const [name, wrapSel] of [
    ['speed', '.ran-player-controller-bottom-right-speed'],
    ['clarity', '.ran-player-controller-bottom-right-clarity'],
  ]) {
    const metrics = await page.evaluate(
      ({ wrapSel }) => {
        const el = document.querySelector('r-player') as any;
        const playerRoot = el._shadowDom as ShadowRoot;
        const wrap = playerRoot.querySelector(wrapSel) as HTMLElement;
        const select = wrap.querySelector('r-select') as any;
        const selectShadow = select._shadowDom as ShadowRoot;
        const item = selectShadow.querySelector('.selection-item') as HTMLElement;
        const wrapRect = wrap.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const cs = getComputedStyle(item);
        return {
          wrapCenterX: Math.round(wrapRect.x + wrapRect.width / 2),
          itemTextCenterX: Math.round(itemRect.x + itemRect.width / 2),
          display: cs.display,
          justifyContent: cs.justifyContent,
          left: cs.left,
          right: cs.right,
        };
      },
      { wrapSel },
    );
    console.log(name, JSON.stringify(metrics, null, 2));
    // The text's own box should now span the full pill (left=0,right=0), and
    // its rendered center should land close to the pill's own center.
    expect(metrics.justifyContent, `${name} justify-content`).toBe('center');
    expect(Math.abs(metrics.wrapCenterX - metrics.itemTextCenterX), `${name} centering off by`).toBeLessThanOrEqual(2);
  }

  await page.screenshot({ path: 'repro-text-center-full.png', clip: { x: 480, y: 420, width: 260, height: 60 } });
});
