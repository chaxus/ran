import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 400 } });

// Inline SVG data URIs — no network dependency
const BLUE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='440' height='240' viewBox='0 0 440 240'%3E%3Crect width='440' height='240' fill='%230f172a'/%3E%3Ccircle cx='120' cy='92' r='48' fill='%232563eb'/%3E%3Cpath d='M0 210 L92 132 L158 176 L236 98 L440 230 Z' fill='%2314b8a6'/%3E%3C/svg%3E";

const LIGHT_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='440' height='240' viewBox='0 0 440 240'%3E%3Crect width='440' height='240' fill='%23f8fafc'/%3E%3Crect x='28' y='28' width='384' height='184' rx='10' fill='%23e2e8f0'/%3E%3C/svg%3E";

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-img');
});

test('loaded image remains singular and keeps its accessible text through reconnect', async ({ page }) => {
  await mount(page, `<r-img id="photo" src="${BLUE_SVG}" alt="Mountain landscape"></r-img>`);
  const imageState = () =>
    insideShadow(page, '#photo', (root) => {
      const images = [...root.querySelectorAll('img')];
      return images.map((image) => ({ ready: image.complete && image.naturalWidth > 0, alt: image.alt }));
    });
  await expect.poll(imageState).toEqual([{ ready: true, alt: 'Mountain landscape' }]);
  await page.locator('#photo').evaluate((host) => {
    host.remove();
    document.body.append(host);
  });
  await expect.poll(imageState).toEqual([{ ready: true, alt: 'Mountain landscape' }]);
});

test('an explicitly sized image fits its host without overflowing the page', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 500 });
  await mount(page, `<r-img id="photo" style="display:block;width:200px;height:120px" src="${BLUE_SVG}"></r-img>`);
  await expect.poll(() => insideShadow(page, '#photo', (root) => root.querySelector('img')?.complete)).toBe(true);
  const sizes = await insideShadow(page, '#photo', (root) => {
    const host = root.host.getBoundingClientRect();
    const image = root.querySelector('img')!.getBoundingClientRect();
    return {
      host: { left: host.left, right: host.right, top: host.top, bottom: host.bottom },
      image: { left: image.left, right: image.right, top: image.top, bottom: image.bottom },
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    };
  });
  expect(sizes.image.right).toBeLessThanOrEqual(sizes.host.right);
  expect(sizes.image.bottom).toBeLessThanOrEqual(sizes.host.bottom);
  expect(sizes.scroll).toBe(sizes.viewport);
});

test('image — single', { tag: '@visual' }, async ({ page }) => {
  await mount(
    page,
    `
    <r-img style="width: 440px; height: 240px; display: block"
      src="${BLUE_SVG}"></r-img>
  `,
  );
  const el = page.locator('r-img');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('image-single.png');
});

test('image — multiple side by side', { tag: '@visual' }, async ({ page }) => {
  await mount(
    page,
    `
    <div style="display: flex; gap: 12px;">
      <r-img style="width: 200px; height: 120px; display: block" src="${BLUE_SVG}"></r-img>
      <r-img style="width: 200px; height: 120px; display: block" src="${LIGHT_SVG}"></r-img>
    </div>
  `,
  );
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('image-multiple.png');
});
