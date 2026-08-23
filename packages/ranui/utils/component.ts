import { adoptSheetText, adoptStyles } from './style';
import type { Ref } from './builder/core';

const shadowRootCache = new WeakMap<HTMLElement, ShadowRoot>();

/**
 * Honour the user's "reduce motion" OS setting in every component. Adopted into
 * each shadow root (last, so it overrides the component's own transitions), and
 * scoped to the shadow tree by `*`. Only active when the user has the preference set.
 */
export const REDUCED_MOTION_CSS =
  '@media (prefers-reduced-motion: reduce){' +
  '*,*::before,*::after{' +
  'animation-duration:.01ms !important;animation-iteration-count:1 !important;' +
  'transition-duration:.01ms !important;scroll-behavior:auto !important}}';

/** Component CSS joined with {@link REDUCED_MOTION_CSS}, keyed by the component's own text. */
const withMotionCache = new Map<string, string>();

/**
 * The component's styles with the reduced-motion overrides appended, built once per component.
 *
 * The join has to happen somewhere, and doing it per construction produced a fresh string
 * every time — which the stylesheet cache could only look up by hashing the whole of it,
 * about a quarter of `r-button`'s construction cost. Keying on `cssText` instead looks up
 * through the module-level string the component imported, whose hash the engine already has,
 * and hands the cache the same joined string on every call.
 *
 * @param cssText - The component's own styles.
 * @returns The text to adopt: the component's styles first, so the overrides win.
 */
const withReducedMotion = (cssText: string): string => {
  const cached = withMotionCache.get(cssText);
  if (cached !== undefined) return cached;
  const joined = cssText ? `${cssText}\n${REDUCED_MOTION_CSS}` : REDUCED_MOTION_CSS;
  withMotionCache.set(cssText, joined);
  return joined;
};

export const ensureShadowRoot = (
  host: HTMLElement,
  cssText = '',
  options: ShadowRootInit = { mode: 'closed' },
): ShadowRoot => {
  const root = host.shadowRoot || shadowRootCache.get(host) || host.attachShadow(options);
  shadowRootCache.set(host, root);
  adoptStyles(root, withReducedMotion(cssText));
  return root;
};

/**
 * The element the builder captured for this component, or a loud failure.
 *
 * Components build their shadow tree once, in the constructor, so `.ref()` on the builder
 * is the element — there is nothing to search for. Reading it back out with a selector
 * re-derives what the caller already had, and a renamed class then silently yields `null`
 * that surfaces much later as a property read on nothing. `verify-design-rules` rejects
 * that pattern; this is the replacement.
 *
 * @param ref - Holder passed to `.ref()` on the builder for this element.
 * @param name - Field name for the failure message.
 * @returns The element.
 * @throws Error - When the builder never captured it, which means the `.ref()` call is
 *   missing or the tree was built somewhere the ref could not reach.
 */
export const shadowPart = <T extends HTMLElement>(ref: Ref<T>, name: string): T => {
  if (ref.current === null) throw new Error(`ranui: ${name} is missing its .ref() on the builder`);
  return ref.current;
};

export const getStringAttribute = (element: HTMLElement, name: string, fallback = ''): string => {
  return element.getAttribute(name) ?? fallback;
};

export const setStringAttribute = (
  element: HTMLElement,
  name: string,
  value: string | null | undefined,
  options: { removeEmpty?: boolean } = {},
): void => {
  if (options.removeEmpty && !value) {
    element.removeAttribute(name);
    return;
  }
  element.setAttribute(name, value ?? '');
};

export const setBooleanAttribute = (
  element: HTMLElement,
  name: string,
  value: boolean,
  options: { aria?: string } = {},
): void => {
  if (value) {
    element.setAttribute(name, '');
    if (options.aria) element.setAttribute(`aria-${options.aria}`, 'true');
    return;
  }
  element.removeAttribute(name);
  if (options.aria) element.removeAttribute(`aria-${options.aria}`);
};

export const syncSheetAttribute = (
  host: HTMLElement,
  root: ShadowRoot,
  name: string,
  oldValue: string | null,
  newValue: string | null,
): void => {
  if (name !== 'sheet' || oldValue === newValue) return;
  const sheet = host.getAttribute('sheet') || '';
  if (!sheet) return;
  adoptSheetText(root, sheet);
};
