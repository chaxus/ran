import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 500 } });

const ABILITIES = JSON.stringify([
  { abilityName: 'Performance', scoreRate: '92' },
  { abilityName: 'Accessibility', scoreRate: '83' },
  { abilityName: 'DX', scoreRate: '75' },
  { abilityName: 'Stability', scoreRate: '86' },
  { abilityName: 'Features', scoreRate: '80' },
]);

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-radar');
});

test('radar — default dataset', { tag: '@visual' }, async ({ page }) => {
  await mount(
    page,
    `
    <div style="width: 300px; height: 300px;">
      <r-radar style="display: block; width: 100%; height: 100%"
        abilitys='${ABILITIES}'></r-radar>
    </div>
  `,
  );
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await page.waitForTimeout(200); // canvas paints asynchronously after connectedCallback
  await expect(el).toHaveScreenshot('radar-default.png');
});

test('radar — uniform scores', { tag: '@visual' }, async ({ page }) => {
  const uniform = JSON.stringify([
    { abilityName: 'A', scoreRate: '50' },
    { abilityName: 'B', scoreRate: '50' },
    { abilityName: 'C', scoreRate: '50' },
    { abilityName: 'D', scoreRate: '50' },
    { abilityName: 'E', scoreRate: '50' },
  ]);
  await mount(
    page,
    `
    <div style="width: 300px; height: 300px;">
      <r-radar style="display: block; width: 100%; height: 100%"
        abilitys='${uniform}'></r-radar>
    </div>
  `,
  );
  const el = page.locator('div').first();
  await expect(el).toBeVisible();
  await page.waitForTimeout(200);
  await expect(el).toHaveScreenshot('radar-uniform.png');
});

test('radar fits rectangular bounds and repaints when theme colors change', async ({ page }) => {
  await mount(page, `<r-radar style="display:block;width:320px;height:180px" abilitys='${ABILITIES}'></r-radar>`);
  const radar = page.locator('r-radar');
  const before = await radar.evaluate((node) => {
    const canvas = (node as HTMLElement & { abilityRadarChart: HTMLCanvasElement }).abilityRadarChart;
    const context = canvas.getContext('2d')!;
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    const edgeAlpha: number[] = [];
    for (let x = 0; x < canvas.width; x++) {
      edgeAlpha.push(image.data[x * 4 + 3], image.data[((canvas.height - 1) * canvas.width + x) * 4 + 3]);
    }
    return { pixels: canvas.toDataURL(), edgeAlpha };
  });
  expect(before.edgeAlpha.every((alpha) => alpha === 0)).toBe(true);
  await page.evaluate(() => document.documentElement.setAttribute('data-ran-theme', 'dark'));
  await expect
    .poll(() =>
      radar.evaluate((node) =>
        (node as HTMLElement & { abilityRadarChart: HTMLCanvasElement }).abilityRadarChart.toDataURL(),
      ),
    )
    .not.toBe(before.pixels);
});
