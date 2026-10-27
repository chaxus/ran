import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

const CARDS = ['#d5b8e8', '#b8cfe6', '#c8e8b8', '#e8d5b8', '#e8b8c8']
  .map((color) => `<div style="width:120px;height:160px;border-radius:12px;background:${color}"></div>`)
  .join('');

// The open fan turns its outer cards about a pivot far below them, so they reach well past one
// card's width. The component's own box holds that reach (it once spilled over the docs
// sidebar), and on a container narrower than the fan it scales down instead of scrolling the page.
for (const width of [375, 1024]) {
  test(`the open fan stays inside its box at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await isolatedSetup(page, DEV_SERVER, 'r-fan-gallery');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mount(
      page,
      `<div style="display:flex;justify-content:center;padding:24px"><r-fan-gallery spread="48">${CARDS}</r-fan-gallery></div>`,
    );
    await expect
      .poll(() =>
        page.evaluate(() => {
          const gallery = document.querySelector('r-fan-gallery')!;
          const box = gallery.getBoundingClientRect();
          const cards = [...gallery.children].map((card) => card.getBoundingClientRect());
          return (
            Math.min(...cards.map((card) => card.left)) >= box.left - 0.5 &&
            Math.max(...cards.map((card) => card.right)) <= box.right + 0.5 &&
            document.documentElement.scrollWidth <= innerWidth
          );
        }),
      )
      .toBe(true);
  });
}
