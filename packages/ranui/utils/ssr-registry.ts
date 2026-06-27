import { isSSR } from './builder/env';

const registry = new Map<string, new () => HTMLElement>();

/**
 * Unified registration that handles both browser (customElements.define) and
 * SSR (internal registry) environments. Replace all bare customElements.define
 * calls with this so new components are automatically available to renderToStream.
 */
export function defineSSR(tagName: string, constructor: new () => HTMLElement): void {
  if (isSSR) {
    registry.set(tagName, constructor);
    // Mark the prototype so HTMLElementMock.serialize() uses the correct tag name
    // when this component appears as a child in a larger element tree.
    (constructor.prototype as Record<string, unknown>)._ssrTag = tagName;
  } else if (!customElements.get(tagName)) {
    customElements.define(tagName, constructor);
  }
}

export function getSSRConstructor(tagName: string): (new () => HTMLElement) | undefined {
  return registry.get(tagName);
}

export function getSSRRegistry(): ReadonlyMap<string, new () => HTMLElement> {
  return registry;
}
