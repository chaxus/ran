import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../../build/config';

const FIXTURE = `${DEV_SERVER}theme-packs.html`;

// Freeze all CSS animations and transitions for deterministic screenshots
const FREEZE_ANIMATIONS = `
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
  }
`;

const PACKS = [
  'default',
  'dark',
  'pixel-retro',
  'windows-98',
  'windows-xp',
  'system-6',
  'wired',
  'paper',
  'neo-brutalism',
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto(FIXTURE, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => customElements.get('r-button'));
  await page.addStyleTag({ content: FREEZE_ANIMATIONS });
});

for (const pack of PACKS) {
  const sectionId = pack === 'default' ? 'theme-default' : `theme-${pack}`;

  test(`theme pack: ${pack} — button row`, async ({ page }) => {
    const section = page.locator(`#${sectionId}`);
    await expect(section).toBeVisible();
    await argosScreenshot(page, `pack-${pack}-buttons`, { element: section });
  });
}

test('full theme-packs fixture page', async ({ page }) => {
  await argosScreenshot(page, 'theme-packs-full-page');
});
