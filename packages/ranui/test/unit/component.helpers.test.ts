import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ensureShadowRoot,
  mountShadowTree,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { Div } from '@/utils/builder';

describe('utils/component helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ensureShadowRoot attaches a shadow root and adopts styles', () => {
    const host = document.createElement('div');
    const root = ensureShadowRoot(host, '.root { color: red; }');

    expect(root).toBeInstanceOf(ShadowRoot);
    expect(root.querySelector('style')?.textContent).toContain('.root { color: red; }');
  });

  it('ensureShadowRoot injects a prefers-reduced-motion override into every root', () => {
    const withCss = ensureShadowRoot(document.createElement('div'), '.root { color: red; }');
    expect(withCss.querySelector('style')?.textContent).toContain('prefers-reduced-motion');

    // Applies even to components that pass no CSS of their own.
    const noCss = ensureShadowRoot(document.createElement('div'));
    expect(noCss.querySelector('style')?.textContent).toContain('prefers-reduced-motion');
  });

  it('ensureShadowRoot reuses an existing shadow root', () => {
    const host = document.createElement('div');
    const first = ensureShadowRoot(host);
    const second = ensureShadowRoot(host);

    expect(second).toBe(first);
  });

  it('mountShadowTree builds and mounts the tree', () => {
    const host = document.createElement('div');
    const root = ensureShadowRoot(host);

    const result = mountShadowTree(root, () => Div().class('target').build());

    expect(result).toBe(root.querySelector('.target'));
  });

  it('mountShadowTree runs the factory even when the root already holds a matching element', () => {
    // A server-rendered tree never survives to be reused: components attach a *closed*
    // shadow root, so `attachShadow` runs and clears the declarative root's children. The
    // factory is the only thing that fills the tree, which is why callers can rely on the
    // refs it captures. This asserts the helper does not quietly skip it.
    const host = document.createElement('div');
    const root = ensureShadowRoot(host);
    const stale = Div().class('target').build();
    root.appendChild(stale);

    const result = mountShadowTree(root, () => Div().class('target').build());

    expect(result).not.toBe(stale);
  });

  it('getStringAttribute and setStringAttribute reflect string attributes', () => {
    const host = document.createElement('div');

    expect(getStringAttribute(host, 'label', 'fallback')).toBe('fallback');
    setStringAttribute(host, 'label', 'Name');
    expect(getStringAttribute(host, 'label')).toBe('Name');
    setStringAttribute(host, 'label', '');
    expect(host.getAttribute('label')).toBe('');
  });

  it('setStringAttribute removes empty values when requested', () => {
    const host = document.createElement('div');
    setStringAttribute(host, 'label', 'Name');
    setStringAttribute(host, 'label', '', { removeEmpty: true });

    expect(host.hasAttribute('label')).toBe(false);
  });

  it('setBooleanAttribute toggles boolean attributes and optional aria mirrors', () => {
    const host = document.createElement('div');

    setBooleanAttribute(host, 'disabled', true, { aria: 'disabled' });
    expect(host.getAttribute('disabled')).toBe('');
    expect(host.getAttribute('aria-disabled')).toBe('true');

    setBooleanAttribute(host, 'disabled', false, { aria: 'disabled' });
    expect(host.hasAttribute('disabled')).toBe(false);
    expect(host.hasAttribute('aria-disabled')).toBe(false);
  });

  it('syncSheetAttribute applies sheet only when the sheet attribute changes', () => {
    const host = document.createElement('div');
    const root = ensureShadowRoot(host);
    host.setAttribute('sheet', '.dynamic { color: red; }');

    syncSheetAttribute(host, root, 'sheet', null, '.dynamic { color: red; }');
    syncSheetAttribute(host, root, 'title', null, 'ignored');
    syncSheetAttribute(host, root, 'sheet', '.dynamic { color: red; }', '.dynamic { color: red; }');

    expect(root.querySelectorAll('style[data-ranui-sheet]')).toHaveLength(1);
    expect(root.querySelector('style[data-ranui-sheet]')?.textContent).toBe('.dynamic { color: red; }');
  });
});
