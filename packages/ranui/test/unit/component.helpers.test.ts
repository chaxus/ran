import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ensureShadowRoot,
  ensureShadowElement,
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
    expect(root.querySelector('style')?.textContent).toBe('.root { color: red; }');
  });

  it('ensureShadowRoot reuses an existing shadow root', () => {
    const host = document.createElement('div');
    const first = ensureShadowRoot(host);
    const second = ensureShadowRoot(host);

    expect(second).toBe(first);
  });

  it('ensureShadowElement reuses matching elements', () => {
    const host = document.createElement('div');
    const root = ensureShadowRoot(host);
    const existing = Div().class('target').build();
    root.appendChild(existing);

    const result = ensureShadowElement(root, '.target', () => Div().class('target').build());

    expect(result).toBe(existing);
    expect(root.querySelectorAll('.target')).toHaveLength(1);
  });

  it('ensureShadowElement appends newly built elements when missing', () => {
    const host = document.createElement('div');
    const root = ensureShadowRoot(host);

    const result = ensureShadowElement(root, '.target', () => Div().class('target').build());

    expect(result).toBe(root.querySelector('.target'));
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
