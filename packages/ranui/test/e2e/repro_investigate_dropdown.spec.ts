import { test } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

test('investigate clarity/speed select + dropdown alignment and colors', async ({ page }) => {
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
    const wrap = (sel: string) => playerRoot.querySelector(sel) as HTMLElement | null;
    const rectOf = (n: HTMLElement | null) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        centerX: Math.round(r.x + r.width / 2),
        overflow: cs.overflow,
      };
    };
    const clarityWrap = wrap('.ran-player-controller-bottom-right-clarity');
    const claritySelect = wrap('.ran-player-controller-bottom-right-clarity r-select');
    const speedWrap = wrap('.ran-player-controller-bottom-right-speed');
    const speedSelect = wrap('.ran-player-controller-bottom-right-speed r-select');
    return { clarityWrap, claritySelect, speedWrap, speedSelect };
  });
  console.log('CLOSED STATE:', JSON.stringify(closedMetrics, null, 2));

  // Open clarity dropdown and inspect the panel's position + colors.
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
    if (!dropdownHost) return { error: 'no dropdown host found', selectRect: { x: selectRect.x, w: selectRect.width } };
    const dropdownRect = dropdownHost.getBoundingClientRect();
    const dropdownShadow = dropdownHost._shadowDom as ShadowRoot;
    const panel = dropdownShadow?.querySelector('.ranui-dropdown') as HTMLElement | null;
    const panelCs = panel ? getComputedStyle(panel) : null;
    return {
      selectRect: { x: Math.round(selectRect.x), w: Math.round(selectRect.width), centerX: Math.round(selectRect.x + selectRect.width / 2) },
      dropdownHostRect: { x: Math.round(dropdownRect.x), w: Math.round(dropdownRect.width), centerX: Math.round(dropdownRect.x + dropdownRect.width / 2) },
      panelBorder: panelCs?.border,
      panelBorderColor: panelCs?.borderColor,
      panelBackground: panelCs?.backgroundColor,
    };
  });
  console.log('OPEN STATE:', JSON.stringify(openMetrics, null, 2));

  await page.screenshot({ path: 'repro-dropdown-zoom.png', clip: { x: 480, y: 250, width: 200, height: 220 } });
});
