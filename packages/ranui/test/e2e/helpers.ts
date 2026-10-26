import type { Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';

/**
 * Freezes animations in the **light DOM** only — page chrome, demo scaffolding, anything the
 * specs mount directly into `<body>`.
 * Zero transition duration matters: a tiny positive duration creates transitions on
 * otherwise static elements (the initial transition-property is all), so geometry,
 * theme colors and layer overrides can still be sampled before their next frame.
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
    transition-duration: 0s !important;
    transition-delay: 0ms !important;
  }
`;

const BASE_BODY_STYLE = 'margin: 0; padding: 24px; background: #ffffff; box-sizing: border-box;';
/** Remove the demo's live media input before custom elements can start a network load.
 * Aborting HLS requests is insufficient: its delayed error dialog can outlive body clearing
 * and intercept an unrelated control. This changes only fetched demo HTML, never player code
 * or media fixtures subsequently mounted by a test.
 */
async function withoutLiveDemoMedia(page: Page, target: string): Promise<void> {
  const origin = new URL(target).origin;
  await page.route(
    (url) => url.origin === origin && ['/', '/components'].includes(url.pathname),
    async (route) => {
      if (route.request().resourceType() !== 'document') {
        await route.fallback();
        return;
      }
      const response = await route.fetch();
      const html = await response.text();
      const body = html.replace(/<r-player\b[^>]*>/gi, (tag) => tag.replace(/\s+src=(["']).*?\1/gi, ''));
      await route.fulfill({ response, body });
    },
  );
}

/**
 * Navigate to the dev server, wait for a custom element tag to register,
 * freeze all animations, and clear the body for isolated component mounting.
 *
 * Screenshot the element you mounted, not `body`. The demo app this navigates to can repaint
 * into the body after the clear, and a capture that happens to catch it comes back a
 * different height — `toHaveScreenshot` then alternates between two sizes across its retries
 * and reports whichever it ended on. A component's baseline should be of the component
 * anyway.
 */
export async function isolatedSetup(page: Page, url: string, waitForTag: string): Promise<void> {
  await withoutLiveDemoMedia(page, url);
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
export async function demoSetup(page: Page, waitForTag: string, options: { liveMedia?: boolean } = {}): Promise<void> {
  if (!options.liveMedia) await withoutLiveDemoMedia(page, DEV_SERVER);
  await page.goto(`${DEV_SERVER}components`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction((tag) => !!customElements.get(tag), waitForTag);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  // Keep page chrome in normal flow so automatic screenshot scrolling cannot
  // paint the sticky header over tall component sections. No component is hidden.
  await page.addStyleTag({ content: FREEZE_ANIMATIONS + '\n.topbar { position: static; }' });
}

/** Click a real tab header across the closed-root boundary, never its offscreen pane. */
export async function clickTabHeader(page: Page, selector: string, key: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
  const point = await page.evaluate(
    ({ selector, key }) => {
      const host = document.querySelector(selector) as HTMLElement & { _shadowDom: ShadowRoot };
      const header = [...host._shadowDom.querySelectorAll('.tab-header-nav-item')].find(
        (node) => node.getAttribute('r-key') === key,
      );
      if (!header) throw new Error(`Missing tab header: ${key}`);
      const rect = header.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    },
    { selector, key },
  );
  await page.mouse.click(point.x, point.y);
  // Off the headers again: these screenshots are of the selection, and a pointer left on
  // the tab would also paint its hover fill.
  await page.mouse.move(0, 0);
}

/** The selected header, indicator and visible panel must agree before capture. */
export const activeTabPainted = (root: ShadowRoot): boolean => {
  const host = root.host;
  const header = [...root.querySelectorAll('.tab-header-nav-item')].find(
    (node) => node.getAttribute('r-key') === host.getAttribute('active'),
  );
  const line = root.querySelector('.ran-tab-header-line');
  if (!header || !line) return false;
  const a = header.getBoundingClientRect();
  const b = line.getBoundingClientRect();
  return a.width > 0 && Math.abs(a.left - b.left) < 1 && Math.abs(a.width - b.width) < 1;
};

/** Include a portaled popup in the same capture as its trigger, without clipping its options. */
export async function popupCaptureBounds(page: Page, section: string, popup: string) {
  return page.evaluate(
    ({ section, popup }) => {
      const rects = [section, popup].map((selector) => {
        const node = document.querySelector(selector);
        if (!node) throw new Error(`Missing capture target: ${selector}`);
        return node.getBoundingClientRect();
      });
      // Capture the real viewport. Mobile full-page capture can temporarily resize
      // it, repositioning a live portal after its document-space crop was measured.
      // Round in document space first, preserving the reviewed pixel origin even
      // when a mobile/zoomed page has a fractional scroll offset.
      const documentX = Math.floor(Math.min(...rects.map((rect) => rect.left)) + scrollX);
      const documentY = Math.floor(Math.min(...rects.map((rect) => rect.top)) + scrollY);
      const x = documentX - scrollX;
      const y = documentY - scrollY;
      const bounds = {
        x,
        y,
        width: Math.ceil(Math.max(...rects.map((rect) => rect.right)) + scrollX) - documentX,
        height: Math.ceil(Math.max(...rects.map((rect) => rect.bottom)) + scrollY) - documentY,
      };
      if (x < 0 || y < 0 || x + bounds.width > innerWidth || y + bounds.height > innerHeight)
        throw new Error(
          `Popup and trigger must fit inside the viewport: ${JSON.stringify({ bounds, width: innerWidth, height: innerHeight })}`,
        );
      return bounds;
    },
    { section, popup },
  );
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

/**
 * Reaching inside a closed shadow root is `ranui/testing`'s job, not this file's.
 *
 * It is exported from the package because it is not internal test scaffolding: every
 * consumer testing against these components hits the same wall, and answering it once in the
 * public API is better than each of them rediscovering `_shadowDom`.
 */
export { insideShadow, settlePainted } from '../../testing';
