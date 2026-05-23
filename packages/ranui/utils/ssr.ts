import { HTMLElementMock } from './builder';
import { getSSRRegistry } from './ssr-registry';

// ─── SSR/Node Compatibility ───────────────────────────────────────────────────

export const HTMLElementSSR = (): { new (): HTMLElement; prototype: HTMLElement } => {
  if (typeof document !== 'undefined') {
    return HTMLElement;
  }
  return HTMLElementMock as unknown as { new (): HTMLElement; prototype: HTMLElement };
};

export const RanElement = HTMLElementSSR()!;

/**
 * Resolve the custom element tag name for a component instance.
 * Checks the SSR registry first, then falls back to the component's own tagName.
 */
const resolveTagName = (component: any): string => {
  if (component.tagName && component.tagName !== 'div') {
    return component.tagName;
  }
  const registry = getSSRRegistry();
  for (const [tag, Ctor] of registry) {
    if (component instanceof Ctor) return tag;
  }
  return component.constructor.name.toLowerCase();
};

/**
 * Rendering utility for RanUI components in SSR environments.
 * Accepts a component instance and returns its HTML string with Declarative Shadow DOM.
 */
export const renderToString = (component: any): string => {
  if (!component) return '';
  const tagName = resolveTagName(component);
  if (typeof component.serialize === 'function') {
    return component.serialize(tagName);
  }
  if (component instanceof HTMLElementMock) {
    return component.serialize(tagName);
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
