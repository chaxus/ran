import { expect, test, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

/**
 * `<r-glass backdrop>` refracts an image with WebGL2 and lets the image's brightness choose
 * the tone. Both are things a reader sees: pixels in the pane, and ink that stays legible.
 */
const picture = (fill: string, ink: string): string =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="${fill}"/>` +
      `<rect x="40" y="40" width="120" height="160" fill="${ink}"/></svg>`,
  );

const stage = (src: string, attrs = ''): string =>
  `<div style="position:relative;width:400px;height:240px">` +
  `<img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%">` +
  `<r-glass id="g" backdrop ${attrs} style="position:absolute;left:20px;top:20px;width:240px">` +
  `<div id="ink" style="height:160px">text</div></r-glass></div>`;

/**
 * Painted pixels in the refraction canvas. A WebGL canvas is cleared once the browser
 * composites it, so this changes a value to force a redraw and reads in the same frame,
 * after the glass's own frame callback has drawn.
 */
const refracted = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const glass = document.querySelector('#g') as HTMLElement & { _shadowDom: ShadowRoot };
        glass.setAttribute('displace', String(10 + Math.random()));
        requestAnimationFrame(() => {
          const canvas = glass._shadowDom.querySelector('.ran-glass-refraction canvas') as HTMLCanvasElement | null;
          if (!canvas || !canvas.width) return resolve(0);
          const copy = document.createElement('canvas');
          copy.width = canvas.width;
          copy.height = canvas.height;
          const context = copy.getContext('2d')!;
          context.drawImage(canvas, 0, 0);
          const { data } = context.getImageData(0, 0, copy.width, copy.height);
          let drawn = 0;
          for (let i = 3; i < data.length; i += 4) if (data[i]! > 0) drawn++;
          resolve(drawn);
        });
      }),
  );

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-glass');
  const webgl2 = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'));
  test.skip(!webgl2, 'this browser has no WebGL2 here');
});

test('backdrop refracts the image under the pane', async ({ page }) => {
  await mount(page, stage(picture('#1e1b4b', '#f43f5e')));
  await expect.poll(() => refracted(page)).toBeGreaterThan(1000);
});

test('a dark image keeps a light ink, a pale one turns it dark', async ({ page }) => {
  await mount(page, stage(picture('#1e1b4b', '#f43f5e')));
  await expect.poll(() => page.locator('#g').evaluate((el) => el.matches(':state(dark)'))).toBe(true);
  await expect(page.locator('#ink')).toHaveCSS('color', 'rgb(255, 255, 255)');

  await mount(page, stage(picture('#f4f4f5', '#e4e4e7')));
  await expect.poll(() => page.locator('#g').evaluate((el) => el.matches(':state(light)'))).toBe(true);
  await expect(page.locator('#ink')).toHaveCSS('color', 'rgb(24, 24, 27)');
});

test('an explicit tone wins over the image', async ({ page }) => {
  await mount(page, stage(picture('#f4f4f5', '#e4e4e7'), 'tone="dark"'));
  await expect.poll(() => refracted(page)).toBeGreaterThan(0);
  await expect(page.locator('#g')).toHaveJSProperty('tone', 'dark');
  await expect(page.locator('#ink')).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('removing backdrop returns the pane to the CSS glass', async ({ page }) => {
  await mount(page, stage(picture('#1e1b4b', '#f43f5e')));
  await expect.poll(() => refracted(page)).toBeGreaterThan(0);
  await page.locator('#g').evaluate((el) => el.removeAttribute('backdrop'));
  await expect.poll(() => refracted(page)).toBe(0);
});

test('an image added after the glass is picked up, and a removed one is let go', async ({ page }) => {
  await mount(
    page,
    `<div id="stage" style="position:relative;width:400px;height:240px">` +
      `<r-glass id="g" backdrop style="position:absolute;left:20px;top:20px;width:240px"><div style="height:160px">x</div></r-glass></div>`,
  );
  await expect.poll(() => refracted(page)).toBe(0);
  await page.evaluate(
    (src) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
      document.querySelector('#stage')!.prepend(img);
    },
    picture('#1e1b4b', '#f43f5e'),
  );
  await expect.poll(() => refracted(page)).toBeGreaterThan(1000);
  await page.evaluate(() => document.querySelector('#stage img')!.remove());
  await expect.poll(() => refracted(page)).toBe(0);
});
