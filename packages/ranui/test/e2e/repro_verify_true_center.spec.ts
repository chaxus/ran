import { test, expect } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

async function setupPlayer(page: import('@playwright/test').Page) {
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
  // Clarity's <r-select> is created lazily once HLS manifest levels are
  // ready — wait for it to actually exist instead of a fixed timeout.
  await page.waitForFunction(() => {
    const el = document.querySelector('r-player') as any;
    const root = el?._shadowDom as ShadowRoot | undefined;
    return !!root?.querySelector('.ran-player-controller-bottom-right-clarity r-select');
  }, { timeout: 15000 });
  await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const root = el._shadowDom as ShadowRoot;
    const controller = root?.querySelector('.ran-player-controller') as HTMLElement | null;
    if (controller) controller.style.opacity = '1';
  });
  await page.waitForTimeout(300);
}

for (const [name, wrapSel, dropdownClass] of [
  ['speed', '.ran-player-controller-bottom-right-speed', 'video-speed-dropdown'],
  ['clarity', '.ran-player-controller-bottom-right-clarity', 'video-clarity-dropdown'],
] as const) {
  test(`${name} panel is truly centered on its trigger`, async ({ page }) => {
    await setupPlayer(page);

    await page.evaluate(
      ({ wrapSel }) => {
        const el = document.querySelector('r-player') as any;
        const root = el._shadowDom as ShadowRoot;
        const select = root.querySelector(`${wrapSel} r-select`) as HTMLElement;
        select.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        select.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      },
      { wrapSel },
    );
    await page.waitForTimeout(600);

    const metrics = await page.evaluate(
      ({ wrapSel, dropdownClass }) => {
        const el = document.querySelector('r-player') as any;
        const playerRoot = el._shadowDom as ShadowRoot;
        const select = playerRoot.querySelector(`${wrapSel} r-select`) as HTMLElement;
        const selectRect = select.getBoundingClientRect();
        const ariaExpanded = select.getAttribute('aria-expanded');
        const allDropdowns = Array.from(playerRoot.querySelectorAll(`r-dropdown.${dropdownClass}`));
        const dropdownCount = allDropdowns.length;
        const dropdownHost = allDropdowns[allDropdowns.length - 1] as any;
        if (!dropdownHost) return { error: 'no dropdown host', ariaExpanded };
        const hostDisplay = getComputedStyle(dropdownHost).display;
        const hostStyleDisplay = dropdownHost.style.display;
        const panel = dropdownHost._shadowDom?.querySelector('.ranui-dropdown') as HTMLElement | null;
        if (!panel) return { error: 'no panel in shadow', ariaExpanded, hostDisplay, hostStyleDisplay };
        const panelRect = panel.getBoundingClientRect();
        return {
          selectCenterX: Math.round(selectRect.x + selectRect.width / 2),
          panelCenterX: Math.round(panelRect.x + panelRect.width / 2),
          panelW: Math.round(panelRect.width),
          selectW: Math.round(selectRect.width),
          ariaExpanded,
          hostDisplay,
          hostStyleDisplay,
          dropdownCount,
        };
      },
      { wrapSel, dropdownClass },
    );
    console.log(name, JSON.stringify(metrics));
    expect(metrics.error, `${name} error`).toBeUndefined();
    expect(Math.abs(metrics.selectCenterX! - metrics.panelCenterX!), `${name} centering off by`).toBeLessThanOrEqual(1);
  });
}
