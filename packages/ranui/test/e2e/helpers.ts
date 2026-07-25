import type { Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';

/**
 * Freezes animations in the **light DOM** only — page chrome, demo scaffolding, anything the
 * specs mount directly into `<body>`.
 *
 * It cannot reach inside a component: this is injected as a document-level `<style>`, and
 * document stylesheets do not cascade into a shadow tree. Components are frozen instead by
 * `reducedMotion: 'reduce'` in `playwright.config.ts`, which triggers the `REDUCED_MOTION_CSS`
 * that `ensureShadowRoot` adopts into every shadow root. Don't add component animation
 * overrides here — they will silently do nothing.
 */
export const FREEZE_ANIMATIONS = `
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
  }
`;

const BASE_BODY_STYLE = 'margin: 0; padding: 24px; background: #ffffff; box-sizing: border-box;';

/**
 * Navigate to the dev server, wait for a custom element tag to register,
 * freeze all animations, and clear the body for isolated component mounting.
 */
export async function isolatedSetup(page: Page, url: string, waitForTag: string): Promise<void> {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction((tag) => !!customElements.get(tag), waitForTag);
  // Components that measure their own layout (r-tab's sliding indicator, for one) read label
  // widths once and cache the result. Run that measurement against fallback metrics and the
  // indicator lands a few pixels off — non-deterministically, since whether the webfont is
  // already cached varies run to run. Settle the fonts before anything mounts.
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.addStyleTag({ content: FREEZE_ANIMATIONS });
  await page.evaluate((style) => {
    document.body.style.cssText = style;
    document.body.innerHTML = '';
  }, BASE_BODY_STYLE);
}

/**
 * Setup for the specs under `test/e2e/visual/`, which screenshot the demo's `/components`
 * route in place rather than mounting isolated markup.
 *
 * Same determinism guarantees as `isolatedSetup` — in particular `document.fonts.ready`,
 * which these specs used to skip. `r-math` lazy-loads Temml plus two font faces, so without
 * it the formula is measured against fallback metrics and the screenshot lands a hundred-odd
 * pixels off, differently each run.
 */
export async function demoSetup(page: Page, waitForTag: string): Promise<void> {
  await page.goto(`${DEV_SERVER}components`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction((tag) => !!customElements.get(tag), waitForTag);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.addStyleTag({ content: FREEZE_ANIMATIONS });
}

/**
 * Wait until every matching element has finished rendering its lazily-loaded variant.
 *
 * Components that resolve `name` at runtime (`r-loading`, `r-icon`) fetch the variant with a
 * dynamic `import()` and expose the in-flight promise as `_pending`. A fixed `waitForTimeout`
 * races that fetch — on a cold module graph the chunk lands *after* the screenshot starts, and
 * `toHaveScreenshot` then fails with "Failed to take two consecutive stable screenshots"
 * because the element is still swapping its children between the two captures.
 *
 * Awaiting `_pending` is deterministic regardless of how slow the chunk is.
 */
export async function settlePending(page: Page, selector: string): Promise<void> {
  await page.evaluate(async (sel) => {
    const nodes = Array.from(document.querySelectorAll(sel)) as Array<HTMLElement & { _pending?: Promise<void> }>;
    await Promise.all(nodes.map((node) => node._pending ?? Promise.resolve()));
  }, selector);
}

/**
 * Replace body content with arbitrary HTML.
 * Custom elements are already registered from the dev server boot,
 * so they upgrade synchronously when inserted into the DOM.
 */
export async function mount(page: Page, html: string): Promise<void> {
  await page.evaluate((h) => {
    document.body.innerHTML = h;
  }, html);
}
