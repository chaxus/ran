import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ensureShadowRoot,
  getStringAttribute,
  hostInternals,
  mountShadowTree,
  setBooleanAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';

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

  it('ensureShadowRoot reuses a closed Declarative Shadow DOM via ElementInternals', () => {
    const host = document.createElement('div');
    const existing = host.attachShadow({ mode: 'closed' });
    existing.appendChild(document.createElement('span')).className = 'dsd';
    const attachSpy = vi.spyOn(host, 'attachShadow');
    const internals = { shadowRoot: existing } as ElementInternals;

    const root = ensureShadowRoot(host, '.hydrated {}', { mode: 'closed' }, internals);

    expect(root).toBe(existing);
    expect(root.querySelector('.dsd')).toBeTruthy();
    expect(attachSpy).not.toHaveBeenCalled();
  });

  it('mountShadowTree replaceChildren a DSD snapshot with the builder node', () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'closed' });
    root.appendChild(document.createElement('span')).className = 'dsd';
    const live = document.createElement('div');
    live.className = 'live';

    mountShadowTree(root, '.mounted {}', live);

    expect(root.querySelector('.dsd')).toBeNull();
    expect(root.firstElementChild).toBe(live);
    expect(root.querySelector('style')?.textContent).toContain('.mounted {}');
  });

  it('hostInternals caches ElementInternals per host', () => {
    class HostInternalsProbe extends HTMLElement {
      static formAssociated = true;
    }
    if (!customElements.get('ran-host-internals-probe')) {
      customElements.define('ran-host-internals-probe', HostInternalsProbe);
    }
    const host = document.createElement('ran-host-internals-probe');
    const first = hostInternals(host);
    const second = hostInternals(host);
    expect(first).toBeTruthy();
    expect(second).toBe(first);
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
