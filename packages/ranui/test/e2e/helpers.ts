import type { Page } from '@playwright/test';

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
  await page.addStyleTag({ content: FREEZE_ANIMATIONS });
  await page.evaluate((style) => {
    document.body.style.cssText = style;
    document.body.innerHTML = '';
  }, BASE_BODY_STYLE);
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
