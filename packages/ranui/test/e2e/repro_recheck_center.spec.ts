import { test, expect } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

test('recheck clarity + speed dropdown centering with real hover', async ({ page }) => {
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

  for (const name of ['clarity', 'speed']) {
    const wrapSel = `.ran-player-controller-bottom-right-${name}`;
    const dropdownClass = name === 'clarity' ? 'video-clarity-dropdown' : 'video-speed-dropdown';

    // Real hover via Playwright's own mouse simulation, into an iframe-less shadow root
    // requires locating through the element handle directly.
    const handle = await page.evaluateHandle(
      ({ wrapSel }) => {
        const el = document.querySelector('r-player') as any;
        const root = el._shadowDom as ShadowRoot;
        return root.querySelector(`${wrapSel} r-select`);
      },
      { wrapSel },
    );
    const el = handle.asElement();
    if (!el) throw new Error(`${name} select not found`);
    await el.hover();
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(
      ({ wrapSel, dropdownClass }) => {
        const el = document.querySelector('r-player') as any;
        const playerRoot = el._shadowDom as ShadowRoot;
        const select = playerRoot.querySelector(`${wrapSel} r-select`) as HTMLElement;
        const selectRect = select.getBoundingClientRect();
        const dropdownHost = playerRoot.querySelector(`r-dropdown.${dropdownClass}`) as any;
        if (!dropdownHost) return { error: 'dropdown host not found' };
        const dropdownRect = dropdownHost.getBoundingClientRect();
        const shadow = dropdownHost._shadowDom as ShadowRoot;
        const panel = shadow?.querySelector('.ranui-dropdown') as HTMLElement | null;
        const panelRect = panel?.getBoundingClientRect();
        return {
          selectRect: {
            x: Math.round(selectRect.x),
            w: Math.round(selectRect.width),
            centerX: Math.round(selectRect.x + selectRect.width / 2),
          },
          dropdownHostRect: {
            x: Math.round(dropdownRect.x),
            w: Math.round(dropdownRect.width),
            centerX: Math.round(dropdownRect.x + dropdownRect.width / 2),
          },
          panelRect: panelRect
            ? {
                x: Math.round(panelRect.x),
                w: Math.round(panelRect.width),
                centerX: Math.round(panelRect.x + panelRect.width / 2),
              }
            : null,
        };
      },
      { wrapSel, dropdownClass },
    );
    console.log(name, JSON.stringify(metrics, null, 2));

    await page.screenshot({ path: `repro-recheck-${name}.png`, clip: { x: 400, y: 150, width: 400, height: 320 } });

    await el.hover({ position: { x: -50, y: -50 } }).catch(() => {});
    await page.mouse.move(10, 10);
    await page.waitForTimeout(400);
  }
});
