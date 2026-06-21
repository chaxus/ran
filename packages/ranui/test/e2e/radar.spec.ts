import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
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

test('radar — default dataset', async ({ page }) => {
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
  await argosScreenshot(page, 'radar-default', { element: el });
});

test('radar — uniform scores', async ({ page }) => {
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
  await argosScreenshot(page, 'radar-uniform', { element: el });
});
