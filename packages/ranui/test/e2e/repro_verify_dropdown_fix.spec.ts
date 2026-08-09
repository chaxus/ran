import { test, expect } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

test('clarity/speed select width no longer compressed; dropdown border themed dark', async ({ page }) => {
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

  const closedMetrics = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const playerRoot = el._shadowDom as ShadowRoot;
    const rectOf = (sel: string) => {
      const n = playerRoot.querySelector(sel) as HTMLElement | null;
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return { x: Math.round(r.x), w: Math.round(r.width), centerX: Math.round(r.x + r.width / 2) };
    };
    return {
      clarityWrap: rectOf('.ran-player-controller-bottom-right-clarity'),
      claritySelect: rectOf('.ran-player-controller-bottom-right-clarity r-select'),
      speedWrap: rectOf('.ran-player-controller-bottom-right-speed'),
      speedSelect: rectOf('.ran-player-controller-bottom-right-speed r-select'),
    };
  });
  console.log('CLOSED STATE:', JSON.stringify(closedMetrics, null, 2));
  expect(closedMetrics.claritySelect!.w).toBe(46);
  expect(closedMetrics.speedSelect!.w).toBe(46);

  await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const root = el._shadowDom as ShadowRoot;
    const claritySelect = root?.querySelector('.ran-player-controller-bottom-right-clarity r-select') as HTMLElement | null;
    claritySelect?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    claritySelect?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  });
  await page.waitForTimeout(400);

  const openMetrics = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const playerRoot = el._shadowDom as ShadowRoot;
    const claritySelect = playerRoot.querySelector('.ran-player-controller-bottom-right-clarity r-select') as HTMLElement;
    const selectRect = claritySelect.getBoundingClientRect();

    const dropdownHost = playerRoot.querySelector('r-dropdown.video-clarity-dropdown') as any;
    const dropdownRect = dropdownHost.getBoundingClientRect();
    const dropdownShadow = dropdownHost._shadowDom as ShadowRoot;
    const panel = dropdownShadow?.querySelector('.ranui-dropdown') as HTMLElement | null;
    const panelCs = panel ? getComputedStyle(panel) : null;
    return {
      selectCenterX: Math.round(selectRect.x + selectRect.width / 2),
      dropdownHostCenterX: Math.round(dropdownRect.x + dropdownRect.width / 2),
      panelBorderColor: panelCs?.borderColor,
    };
  });
  console.log('OPEN STATE:', JSON.stringify(openMetrics, null, 2));
  expect(openMetrics.panelBorderColor).not.toBe('rgb(234, 234, 234)');

  await page.screenshot({ path: 'repro-dropdown-fixed.png', clip: { x: 480, y: 250, width: 220, height: 220 } });
});
