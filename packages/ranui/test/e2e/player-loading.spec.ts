import { expect, test, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

// Backdrop-filter can change a few background antialiasing channels by one level
// between captures in Chrome. Compare decoded paint, not PNG bytes, without
// importing Playwright internals or adding a PNG runtime dependency.
async function changedPaintPixels(page: Page, first: Buffer, second: Buffer): Promise<number> {
  return page.evaluate(
    async ([before, after]) => {
      const images = await Promise.all(
        [before, after].map(async (data) => {
          const image = new Image();
          image.src = `data:image/png;base64,${data}`;
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext('2d')!;
          context.drawImage(image, 0, 0);
          return context.getImageData(0, 0, image.width, image.height);
        }),
      );
      if (images[0].width !== images[1].width || images[0].height !== images[1].height) {
        throw new Error('Loader capture dimensions changed');
      }
      let changed = 0;
      for (let index = 0; index < images[0].data.length; index += 4) {
        if (
          [0, 1, 2, 3].some(
            (channel) => Math.abs(images[0].data[index + channel] - images[1].data[index + channel]) > 1,
          )
        ) {
          changed++;
        }
      }
      return changed;
    },
    [first.toString('base64'), second.toString('base64')],
  );
}

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
      const changed = await changedPaintPixels(page, first, second);
      if (reducedMotion === 'reduce') {
        expect(changed, 'reduced motion keeps the ring still').toBe(0);
        expect(
          await insideShadow(page, '#player', (root) => {
            const standalone = root.querySelector('.video-control_loading');
            const style = getComputedStyle(
              standalone ?? root.querySelector('.ran-player')!,
              standalone ? null : '::after',
            );
            return { animation: style.animationName, transform: style.transform };
          }),
        ).toEqual({ animation: 'none', transform: 'none' });
      } else {
        expect(changed, 'ordinary motion rotates the ring').toBeGreaterThan(20);
      }
      await insideShadow(page, '#player', (root) => {
        const style = document.createElement('style');
        style.textContent = '.video-control_loading,.ran-player-buffering::after{visibility:hidden !important}';
        root.append(style);
      });
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      const hidden = await page.screenshot({ clip });
      expect(await changedPaintPixels(page, second, hidden), 'the indicator must paint visible pixels').toBeGreaterThan(
        100,
      );
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
