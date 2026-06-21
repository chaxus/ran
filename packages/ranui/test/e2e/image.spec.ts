import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 400 } });

// Inline SVG data URIs — no network dependency
const BLUE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='440' height='240' viewBox='0 0 440 240'%3E%3Crect width='440' height='240' fill='%230f172a'/%3E%3Ccircle cx='120' cy='92' r='48' fill='%232563eb'/%3E%3Cpath d='M0 210 L92 132 L158 176 L236 98 L440 230 Z' fill='%2314b8a6'/%3E%3C/svg%3E";

const LIGHT_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='440' height='240' viewBox='0 0 440 240'%3E%3Crect width='440' height='240' fill='%23f8fafc'/%3E%3Crect x='28' y='28' width='384' height='184' rx='10' fill='%23e2e8f0'/%3E%3C/svg%3E";

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-img');
});

test('image — single', async ({ page }) => {
  await mount(page, `
    <r-img style="width: 440px; height: 240px; display: block"
      src="${BLUE_SVG}"></r-img>
  `);
  const el = page.locator('r-img');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('image-single.png');
  await argosScreenshot(page, 'image-single', { element: el });
});

test('image — multiple side by side', async ({ page }) => {
  await mount(page, `
    <div style="display: flex; gap: 12px;">
      <r-img style="width: 200px; height: 120px; display: block" src="${BLUE_SVG}"></r-img>
      <r-img style="width: 200px; height: 120px; display: block" src="${LIGHT_SVG}"></r-img>
    </div>
  `);
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('image-multiple.png');
  await argosScreenshot(page, 'image-multiple', { element: el });
});
