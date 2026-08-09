import { test, expect } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

// Real transition timing is needed to observe the mid-fade frame — override the
// suite-wide reduced-motion freeze (see playwright.config.ts) for this spec only.
test.use({ contextOptions: { reducedMotion: 'no-preference' } });

// Reproduces docs' Demo.vue wrapper pattern: `.wrap:has(r-modal[open])` escalates
// z-index above a competing fixed nav bar only while `open` is present. `close()`
// removes `open` synchronously, but the modal's own CSS transition keeps painting
// for ~300ms more — if the escalation drops the instant `open` is gone, that tail
// repaints underneath the nav, which shows as the mask "losing" whatever region
// the nav covers while the rest keeps fading normally (the reported "segmented"
// close).
test('modal mask is not clipped by page chrome mid-close-fade', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-modal');
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      body { margin: 0; }
      .nav { position: fixed; top: 0; left: 0; right: 0; height: 60px; background: red; z-index: 30; }
      .wrap { isolation: isolate; }
      .wrap:has(r-modal[open]), .wrap:has(r-modal[closing]) { position: relative; z-index: 100; }
    `;
    document.head.appendChild(style);
    const nav = document.createElement('div');
    nav.className = 'nav';
    document.body.appendChild(nav);
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.innerHTML = `<r-modal id="m" title="Test"><div>Body content</div></r-modal>`;
    document.body.appendChild(wrap);
  });

  const modal = page.locator('#m');
  await modal.evaluate((el: any) => {
    el.open = true;
  });
  await page.waitForTimeout(500);

  await modal.evaluate((el: any) => {
    el.close('program');
  });

  // Sample partway through the 300ms close transition, at a point inside the
  // nav's rect (top-left area, y=30) where the mask should still be covering it.
  await page.waitForTimeout(120);
  const pixel = await page.evaluate(() => {
    const x = 40,
      y = 30;
    const el = document.elementFromPoint(x, y);
    return { tag: el?.tagName, cls: (el as HTMLElement)?.className };
  });
  console.log('element at nav position mid-close (120ms in):', JSON.stringify(pixel));
  expect(pixel.cls).not.toBe('nav');

  await page.screenshot({ path: 'repro-modal-midclose-120.png' });

  await page.waitForTimeout(50);
  const pixel2 = await page.evaluate(() => {
    const el = document.elementFromPoint(40, 30);
    return { tag: el?.tagName, cls: (el as HTMLElement)?.className };
  });
  console.log('element at nav position mid-close (170ms in):', JSON.stringify(pixel2));
  expect(pixel2.cls).not.toBe('nav');
  await page.screenshot({ path: 'repro-modal-midclose-170.png' });

  await page.waitForTimeout(400);
});
