import { expect, type Page } from '@playwright/test';

/** Test-only DOM geometry. Select a text-only label for Range measurements, not its padded control. */
export async function geometry(page: Page, selector: string, kind: 'frame' | 'text' = 'frame') {
  return page.evaluate(
    async ({ selector, kind }) => {
      await document.fonts.ready;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const node = document.querySelector(selector);
      if (!node) throw new Error(`Missing geometry target: ${selector}`);
      const range = document.createRange();
      range.selectNodeContents(node);
      const rect = kind === 'text' ? range.getBoundingClientRect() : node.getBoundingClientRect();
      if (!rect.width || !rect.height) throw new Error(`Empty geometry target: ${selector} (${kind})`);
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    },
    { selector, kind },
  );
}

/** Half a CSS pixel tolerates fractional font/layout rounding but fails a one-pixel spine error. */
export function sameSpine(actual: number, expected: number) {
  expect(Math.abs(actual - expected), 'visible content must share its named spine').toBeLessThanOrEqual(0.5);
}

/** Caller supplies this product role's padding; no target dimension becomes a library default. */
export function compactHitZone(hitWidth: number, contentWidth: number, padding: number) {
  expect(hitWidth, 'title hit area must hug label content plus deliberate padding').toBeLessThanOrEqual(
    contentWidth + padding * 2 + 0.5,
  );
}
