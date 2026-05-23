import { describe, it, expect, beforeEach } from 'vitest';
import { defineSSR, getSSRConstructor, getSSRRegistry } from '@/utils/ssr-registry';
import { HTMLElementMock } from '@/utils/builder';

class TestComponent extends HTMLElementMock {
  constructor() {
    super('r-test');
  }
}

describe('SSR registry', () => {
  it('defineSSR registers a constructor in Node.js environment', () => {
    defineSSR('r-test-reg', TestComponent as unknown as new () => HTMLElement);
    expect(getSSRConstructor('r-test-reg')).toBe(TestComponent);
  });

  it('getSSRConstructor returns undefined for unknown tags', () => {
    expect(getSSRConstructor('r-does-not-exist')).toBeUndefined();
  });

  it('getSSRRegistry exposes all registered entries', () => {
    defineSSR('r-test-map', TestComponent as unknown as new () => HTMLElement);
    const registry = getSSRRegistry();
    expect(registry.get('r-test-map')).toBe(TestComponent);
  });

  it('does not throw when the same tag is registered twice', () => {
    defineSSR('r-test-dup', TestComponent as unknown as new () => HTMLElement);
    expect(() => defineSSR('r-test-dup', TestComponent as unknown as new () => HTMLElement)).not.toThrow();
  });
});
