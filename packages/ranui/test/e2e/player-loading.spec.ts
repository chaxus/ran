import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

for (const affordance of ['buffering', 'standalone'] as const) {
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    test(`${affordance} loader paints visibly and respects ${reducedMotion}`, async ({ page, baseURL }) => {
      await page.emulateMedia({ reducedMotion });
      await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-player');
      await mount(
        page,
        '<r-player id="player" style="display:block;width:640px;height:360px;background:black"></r-player>',
      );
      await page.locator('#player').evaluate((host, kind) => {
        const player = host as HTMLElement & { _shadowDom: ShadowRoot; setLoadingState: (value: boolean) => void };
        if (kind === 'buffering') player.setLoadingState(true);
        else {
          // The legacy standalone loading style is retained for existing consumers.
          const indicator = document.createElement('div');
          indicator.className = 'video-control_loading';
          indicator.style.cssText =
            '--video-control-loading-position:absolute;--video-control-loading-top:40px;--video-control-loading-left:40px;--video-control-loading-width:72px;--video-control-loading-height:72px';
          player._shadowDom.append(indicator);
        }
      }, affordance);
      const clip = await insideShadow(page, '#player', (root) => {
        const standalone = root.querySelector('.video-control_loading');
        if (standalone) {
          const rect = standalone.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        }
        const rect = root.querySelector('.ran-player')!.getBoundingClientRect();
        return { x: rect.x + rect.width / 2 - 40, y: rect.y + rect.height / 2 - 40, width: 80, height: 80 };
      });
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      const first = await page.screenshot({ clip });
      // Sample a real interval: reduced motion must stay painted without rotating;
      // normal motion must communicate ongoing work rather than stop at one frame.
      await page.waitForTimeout(180);
      const second = await page.screenshot({ clip });
      if (reducedMotion === 'reduce' && test.info().project.name === 'chromium') {
        expect(second).toMatchSnapshot(`${affordance}-reduced.png`);
      }
      expect(first.equals(second), `${reducedMotion} motion policy`).toBe(reducedMotion === 'reduce');
      await insideShadow(page, '#player', (root) => {
        const style = document.createElement('style');
        style.textContent = '.video-control_loading,.ran-player-buffering::after{visibility:hidden !important}';
        root.append(style);
      });
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      const hidden = await page.screenshot({ clip });
      expect(second.equals(hidden), 'the indicator must paint visible pixels').toBe(false);
      if (affordance === 'buffering') {
        await insideShadow(page, '#player', (root) => root.querySelector('video')!.dispatchEvent(new Event('canplay')));
        expect(
          await insideShadow(
            page,
            '#player',
            (root) => getComputedStyle(root.querySelector('.ran-player')!, '::after').content,
          ),
        ).toBe('none');
      }
    });
  }
}
