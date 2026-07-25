// ─── Shadow DOM style injection ──────────────────────────────────────────────
//
// Constructable Stylesheets first: one piece of CSS is parsed once and then shared by
// reference across every component instance, so a thousand instances still hold one parsed
// result. Where they are unsupported, fall back to injecting a <style> tag.
//
//   import css from './index.less?inline';
//   import { adoptStyles } from 'ranuts/utils';
//
//   constructor() {
//     this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
//     adoptStyles(this._shadowDom, css);
//   }
// ─────────────────────────────────────────────────────────────────────────────

/** CSS text → CSSStyleSheet cache, so one stylesheet object is shared across every shadowRoot */
const sheetCache = new Map<string, CSSStyleSheet>();
const dynamicSheetCache = new Map<string, CSSStyleSheet>();

/** Default marker attribute on the <style> fallback, identifying styles this module injected */
export const ADOPTED_STYLE_MARKER = 'data-adopted-style';
export const ADOPTED_SHEET_MARKER = 'data-adopted-sheet';

/** Parse cssText into a CSSStyleSheet and adopt it into the shadowRoot; false when unsupported or failing. */
const adoptConstructable = (shadowRoot: ShadowRoot, cssText: string, cache: Map<string, CSSStyleSheet>): boolean => {
  if (typeof CSSStyleSheet === 'undefined') return false;
  try {
    if (!cache.has(cssText)) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      cache.set(cssText, sheet);
    }
    const sheet = cache.get(cssText)!;
    // Idempotent: the same sheet is never adopted twice
    if (!shadowRoot.adoptedStyleSheets.includes(sheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
    }
    return true;
  } catch {
    // Constructable Stylesheets unsupported (older Firefox, say) — let the caller fall back
    return false;
  }
};

/**
 * @description: Inject a component's static styles into a shadow root.
 *
 * - SSR-safe: skipped outright when there is no `document`
 * - Idempotent: one shadowRoot is never injected into twice
 * - The fallback de-duplicates per **root**: a shadowRoot keeps exactly one marked <style>,
 *   first writer wins. A component's static styles should exist once per root, so a second
 *   call means the caller made a mistake.
 *
 * @param {ShadowRoot} shadowRoot target shadow root
 * @param {string} cssText the style text
 * @param {string} marker marker attribute on the fallback <style>, defaults to `data-adopted-style`
 * @return {void}
 */
export const adoptStyles = (shadowRoot: ShadowRoot, cssText: string, marker = ADOPTED_STYLE_MARKER): void => {
  // SSR guard
  if (typeof document === 'undefined') return;
  if (!cssText) return;

  if (adoptConstructable(shadowRoot, cssText, sheetCache)) return;

  // Fallback: a <style> tag, with the marker attribute preventing a second injection
  if (!shadowRoot.querySelector(`style[${marker}]`)) {
    const style = document.createElement('style');
    style.setAttribute(marker, '');
    style.textContent = cssText;
    shadowRoot.appendChild(style);
  }
};

/**
 * @description: Inject dynamic styles supplied at runtime (a component's `sheet` property, say).
 *
 * The only difference from `adoptStyles` is what the fallback de-duplicates on: here it is
 * the **cssText**, so one root can stack several distinct dynamic stylesheets while an
 * identical one is injected only once.
 *
 * @param {ShadowRoot} shadowRoot target shadow root
 * @param {string} cssText the style text
 * @param {string} marker marker attribute on the fallback <style>, defaults to `data-adopted-sheet`
 * @return {void}
 */
export const adoptSheetText = (shadowRoot: ShadowRoot, cssText: string, marker = ADOPTED_SHEET_MARKER): void => {
  if (typeof document === 'undefined') return;
  if (!cssText) return;

  if (adoptConstructable(shadowRoot, cssText, dynamicSheetCache)) return;

  const existed = Array.from(shadowRoot.querySelectorAll(`style[${marker}]`)).some(
    (item) => item.textContent === cssText,
  );
  if (!existed) {
    const style = document.createElement('style');
    style.setAttribute(marker, '');
    style.textContent = cssText;
    shadowRoot.appendChild(style);
  }
};
