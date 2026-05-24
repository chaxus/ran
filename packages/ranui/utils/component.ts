import { adoptSheetText, adoptStyles } from './style';

const shadowRootCache = new WeakMap<HTMLElement, ShadowRoot>();

export const ensureShadowRoot = (
  host: HTMLElement,
  cssText = '',
  options: ShadowRootInit = { mode: 'closed' },
): ShadowRoot => {
  const root = host.shadowRoot || shadowRootCache.get(host) || host.attachShadow(options);
  shadowRootCache.set(host, root);
  if (cssText) adoptStyles(root, cssText);
  return root;
};

export const ensureShadowElement = <T extends HTMLElement>(root: ShadowRoot, selector: string, factory: () => T): T => {
  const existing = root.querySelector<T>(selector);
  if (existing) return existing;
  const element = factory();
  root.appendChild(element);
  return element;
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
