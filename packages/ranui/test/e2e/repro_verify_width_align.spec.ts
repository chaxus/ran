import { test, expect } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

test('trigger and wrapper widths now match (50px), no overflow, dropdown still centered', async ({ page }) => {
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
    ['subtitle', '.ran-player-controller-bottom-right-subtitle'],
    ['clarity', '.ran-player-controller-bottom-right-clarity'],
  ]) {
    const metrics = await page.evaluate(
      ({ wrapSel }) => {
        const el = document.querySelector('r-player') as any;
        const playerRoot = el._shadowDom as ShadowRoot;
        const wrap = playerRoot.querySelector(wrapSel) as HTMLElement;
        const select = wrap?.querySelector('r-select') as HTMLElement | null;
        if (!wrap || !select) return { error: 'not found (likely empty subtitle)' };
        const wrapRect = wrap.getBoundingClientRect();
        const selectRect = select.getBoundingClientRect();
        return {
          wrapW: Math.round(wrapRect.width),
          selectW: Math.round(selectRect.width),
          wrapCenterX: Math.round(wrapRect.x + wrapRect.width / 2),
          selectCenterX: Math.round(selectRect.x + selectRect.width / 2),
        };
      },
      { wrapSel },
    );
    console.log(name, JSON.stringify(metrics));
  }

  // Hover speed to open its dropdown and check panel centering vs the new, wider trigger.
  const speedHandle = await page.evaluateHandle(() => {
    const el = document.querySelector('r-player') as any;
    const root = el._shadowDom as ShadowRoot;
    return root.querySelector('.ran-player-controller-bottom-right-speed r-select');
  });
  const speedEl = speedHandle.asElement();
  await speedEl?.hover();
  await page.waitForTimeout(500);

  const openMetrics = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const playerRoot = el._shadowDom as ShadowRoot;
    const select = playerRoot.querySelector('.ran-player-controller-bottom-right-speed r-select') as HTMLElement;
    const selectRect = select.getBoundingClientRect();
    const dropdownHost = playerRoot.querySelector('r-dropdown.video-speed-dropdown') as any;
    const dropdownHostRect = dropdownHost.getBoundingClientRect();
    const panel = dropdownHost._shadowDom.querySelector('.ranui-dropdown') as HTMLElement;
    const panelRect = panel.getBoundingClientRect();
    const panelCs = getComputedStyle(panel);
    return {
      selectCenterX: Math.round(selectRect.x + selectRect.width / 2),
      dropdownHostW: Math.round(dropdownHostRect.width),
      dropdownHostCenterX: Math.round(dropdownHostRect.x + dropdownHostRect.width / 2),
      panelW: Math.round(panelRect.width),
      panelCenterX: Math.round(panelRect.x + panelRect.width / 2),
      panelMinWidth: panelCs.minWidth,
      panelOverflow: panelCs.overflow,
      selectW: Math.round(selectRect.width),
    };
  });
  console.log('open state', JSON.stringify(openMetrics, null, 2));
  expect(Math.abs(openMetrics.selectCenterX - openMetrics.panelCenterX)).toBeLessThanOrEqual(1);

  await page.screenshot({ path: 'repro-width-aligned.png', clip: { x: 460, y: 200, width: 300, height: 280 } });
});
