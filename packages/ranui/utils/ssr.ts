import { HTMLElementMock } from './builder';

/**
 * Rendering utility for RanUI components in SSR environments.
 * It takes a component instance and returns its HTML string representation,
 * including Declarative Shadow DOM (DSD) templates.
 *
 * @param component The RanUI component instance (e.g. new Button())
 * @returns HTML string with DSD
 */
export const renderToString = (component: any): string => {
  if (component && typeof component.serialize === 'function') {
    return component.serialize();
  }
  // Fallback for HTMLElementMock instances
  if (component instanceof HTMLElementMock) {
    return component.serialize();
  }
  return '';
};

/**
 * Convenience helper to render a tag with attributes and children manually.
 */
export const h = (tag: string, props: Record<string, string> = {}, ...children: any[]): string => {
  const el = new HTMLElementMock(tag);
  Object.entries(props).forEach(([k, v]) => el.setAttribute(k, v));
  children.forEach((child) => {
    if (child) el.appendChild(child);
  });
  return el.serialize();
};
