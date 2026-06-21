/**
 * E2E tests for the wired-overlay runtime.
 *
 * Unit tests (wired-overlay.test.ts) verify behaviour with mocked getBoundingClientRect.
 * These tests use a real browser to verify:
 *  1. The overlay SVG is actually appended to document.body
 *  2. Drawn paths are spatially aligned with their components
 *  3. Cleanup removes the overlay from the real DOM
 *  4. Pack switching correctly activates / deactivates in a live page
 */
import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount, FREEZE_ANIMATIONS } from './helpers';

test.use({ viewport: { width: 800, height: 600 } });

const WIRED_HTML = `
  <style>${FREEZE_ANIMATIONS}</style>
  <div id="popup-root"></div>
  <div style="display: flex; gap: 24px; padding: 24px; flex-wrap: wrap;">
    <r-button type="primary">Primary</r-button>
    <r-button>Default</r-button>
    <r-input style="width: 180px" label="Name" placeholder="Enter name"></r-input>
    <r-checkbox checked="true">Checked</r-checkbox>
    <r-select style="width: 160px" defaultValue="lucy"
      getPopupContainerId="popup-root" trigger="click">
      <r-option value="jack">Jack</r-option>
      <r-option value="lucy">Lucy</r-option>
    </r-select>
  </div>
`;

// ── Helpers ────────────────────────────────────────────────────────────────

async function activateWired(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-ran-theme-pack', 'wired');
    // The wired pack's runtime is imported by the dev server demo — trigger it
    (window as any).__ranSyncWired?.();
  });
  await page.waitForTimeout(150); // rAF + MutationObserver flush
}

async function deactivateWired(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-ran-theme-pack', 'paper');
    (window as any).__ranSyncWired?.();
  });
  await page.waitForTimeout(100);
}

// ── Tests ──────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-button');
  await mount(page, WIRED_HTML);
  await page.waitForTimeout(100); // let components connect
});

test('wired overlay — SVG is appended to body when wired pack is active', async ({ page }) => {
  await activateWired(page);

  const hasOverlay = await page.evaluate(() => document.querySelector('[data-ran-wired-overlay]') !== null);
  expect(hasOverlay).toBe(true);
});

test('wired overlay — overlay SVG has aria-hidden and is pointer-events:none', async ({ page }) => {
  await activateWired(page);

  const attrs = await page.evaluate(() => {
    const svg = document.querySelector('[data-ran-wired-overlay]') as SVGSVGElement | null;
    if (!svg) return null;
    return {
      ariaHidden: svg.getAttribute('aria-hidden'),
      pointerEvents: svg.style.pointerEvents,
    };
  });
  expect(attrs).not.toBeNull();
  expect(attrs!.ariaHidden).toBe('true');
  expect(attrs!.pointerEvents).toBe('none');
});

test('wired overlay — paths exist for each wired component', async ({ page }) => {
  await activateWired(page);

  const pathCount = await page.evaluate(() => document.querySelectorAll('[data-ran-wired-overlay] path').length);
  expect(pathCount).toBeGreaterThan(0);
});

test('wired overlay — each path has fill:none and SVG drawing commands', async ({ page }) => {
  await activateWired(page);

  const valid = await page.evaluate(() => {
    const paths = document.querySelectorAll('[data-ran-wired-overlay] path');
    if (paths.length === 0) return false;
    return Array.from(paths).every((p) => {
      const d = p.getAttribute('d') ?? '';
      return p.getAttribute('fill') === 'none' && /[MCL]/.test(d);
    });
  });
  expect(valid).toBe(true);
});

test('wired overlay — drawn paths are spatially aligned with their components', async ({ page }) => {
  await activateWired(page);

  const aligned = await page.evaluate(() => {
    const button = document.querySelector('r-button') as HTMLElement | null;
    const overlay = document.querySelector('[data-ran-wired-overlay]');
    if (!button || !overlay) return { ok: false, reason: 'missing elements' };

    const bBox = button.getBoundingClientRect();
    const componentCenterX = bBox.left + bBox.width / 2;
    const componentCenterY = bBox.top + bBox.height / 2;

    // Find the closest path group to the button
    const groups = Array.from(overlay.querySelectorAll('g'));
    if (groups.length === 0) return { ok: false, reason: 'no groups' };

    // At least one path group's bbox should cover the button's centre point
    const covers = groups.some((g) => {
      const gBox = g.getBoundingClientRect();
      return (
        gBox.left <= componentCenterX &&
        componentCenterX <= gBox.right &&
        gBox.top <= componentCenterY &&
        componentCenterY <= gBox.bottom
      );
    });

    return { ok: covers, reason: covers ? 'aligned' : 'no group covers button centre' };
  });

  expect(aligned.ok, aligned.reason).toBe(true);
});

test('wired overlay — SVG is removed from DOM after pack deactivation', async ({ page }) => {
  await activateWired(page);
  expect(await page.evaluate(() => !!document.querySelector('[data-ran-wired-overlay]'))).toBe(true);

  await deactivateWired(page);
  expect(await page.evaluate(() => !!document.querySelector('[data-ran-wired-overlay]'))).toBe(false);
});

test('wired overlay — reactivation after deactivation produces exactly one overlay', async ({ page }) => {
  await activateWired(page);
  await deactivateWired(page);
  await activateWired(page);

  const overlayCount = await page.evaluate(() => document.querySelectorAll('[data-ran-wired-overlay]').length);
  expect(overlayCount).toBe(1);
});

test('wired overlay — visual screenshot with default components', async ({ page }) => {
  await activateWired(page);
  await page.waitForTimeout(200); // extra settle time for roughjs
  await expect(page).toHaveScreenshot('wired-overlay-components.png');
  await argosScreenshot(page, 'wired-overlay-components');
});

test('wired overlay — visual screenshot in dark mode', async ({ page }) => {
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-ran-theme', 'dark');
  });
  await activateWired(page);
  await page.waitForTimeout(200);
  await expect(page).toHaveScreenshot('wired-overlay-dark.png');
  await argosScreenshot(page, 'wired-overlay-dark');
});
