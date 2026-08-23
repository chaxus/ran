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

export const ensureShadowRoot = (
  host: HTMLElement,
  cssText = '',
  options: ShadowRootInit = { mode: 'closed' },
): ShadowRoot => {
  const root = host.shadowRoot || shadowRootCache.get(host) || host.attachShadow(options);
  shadowRootCache.set(host, root);
  // Append the reduced-motion overrides AFTER the component CSS (last wins) in the
  // same adopted sheet, so they apply in both the constructable-stylesheet and the
  // <style> fallback paths (the fallback only injects one marked style per root).
  adoptStyles(root, cssText ? `${cssText}\n${REDUCED_MOTION_CSS}` : REDUCED_MOTION_CSS);
  return root;
};

/**
 * Builds a component's shadow tree and mounts it, once.
 *
 * This does not look for an existing tree to reuse, because there is never one to find.
 * Server rendering does emit a declarative shadow root, but every ranui component attaches
 * a **closed** one: `host.shadowRoot` stays `null`, so {@link ensureShadowRoot} reaches
 * `attachShadow`, and attaching to an element that already has a declarative shadow root
 * removes that root's children. The server-rendered markup paints the first frame and is
 * then replaced by an identical client-built tree. Reuse would need `mode: 'open'`, which
 * this library does not use.
 *
 * Callers therefore keep what the builder hands them — see {@link shadowPart}.
 *
 * @param root - The component's shadow root.
 * @param factory - Builds the tree. Called exactly once, from the component's constructor.
 * @returns The mounted element.
 */
export const mountShadowTree = <T extends HTMLElement>(root: ShadowRoot, factory: () => T): T => {
  const element = factory();
  root.appendChild(element);
  return element;
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
