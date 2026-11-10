import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Menubar } from '@/components/menubar';
import '@/components/menubar';
import { mountMenubarHandoff } from '@/utils/menubar';

type OpenHost = HTMLElement & { open: boolean };

const finePointer = (matches = true) => {
  return vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
    const fine = /\(hover:\s*hover\)/.test(query) || /\(pointer:\s*fine\)/.test(query);
    return {
      matches: fine ? matches : false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    } as MediaQueryList;
  });
};

const makeItem = (tag = 'r-select'): OpenHost => {
  const el = document.createElement(tag) as OpenHost;
  let open = false;
  Object.defineProperty(el, 'open', {
    configurable: true,
    get: () => open,
    set: (value: boolean) => {
      open = Boolean(value);
    },
  });
  return el;
};

describe('r-menubar contract', () => {
  let media: ReturnType<typeof finePointer> | null = null;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-menubar-switch');
    media = finePointer(true);
  });

  afterEach(() => {
    media?.mockRestore();
    media = null;
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-menubar-switch');
    document.getElementById('ran-menubar-handoff-style')?.remove();
  });

  it('does not throw on createElement', () => {
    expect(() => document.createElement('r-menubar')).not.toThrow();
  });

  it('exposes defaults and reflects attributes', () => {
    const el = document.createElement('r-menubar') as Menubar;
    document.body.appendChild(el);
    expect(el.panelSelector).toBe('r-dropdown.ran-chrome-menu');
    expect(el.leaveDelay).toBe(180);
    expect(el.duration).toBe(320);

    el.panelSelector = '.panel';
    el.leaveDelay = 90;
    el.duration = 120;
    expect(el.getAttribute('panel-selector')).toBe('.panel');
    expect(el.getAttribute('leave-delay')).toBe('90');
    expect(el.getAttribute('duration')).toBe('120');
    expect(el.panelSelector).toBe('.panel');
    expect(el.leaveDelay).toBe(90);
    expect(el.duration).toBe(120);
  });

  it('opens a slotted select on fine-pointer hover', () => {
    const bar = document.createElement('r-menubar') as Menubar;
    const a = makeItem();
    const b = makeItem();
    a.className = 'a';
    b.className = 'b';
    bar.append(a, b);
    document.body.appendChild(bar);

    a.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    expect(a.open).toBe(true);
    expect(b.open).toBe(false);

    b.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    expect(a.open).toBe(false);
    expect(b.open).toBe(true);
    expect(document.documentElement.hasAttribute('data-ran-menubar-switch')).toBe(true);
  });

  it('finds triggers nested under a wrapper', () => {
    const bar = document.createElement('r-menubar') as Menubar;
    const wrap = document.createElement('div');
    wrap.className = 'appearance';
    const theme = makeItem('r-theme-switch');
    wrap.appendChild(theme);
    const lang = makeItem();
    bar.append(lang, wrap);
    document.body.appendChild(bar);

    theme.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    expect(theme.open).toBe(true);
    expect(lang.open).toBe(false);
  });
});

describe('mountMenubarHandoff', () => {
  let media: ReturnType<typeof finePointer> | null = null;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-menubar-switch');
    media = finePointer(true);
  });

  afterEach(() => {
    media?.mockRestore();
    media = null;
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-menubar-switch');
    document.getElementById('ran-menubar-handoff-style')?.remove();
  });

  it('no-ops when the pointer is not fine', () => {
    media?.mockRestore();
    media = finePointer(false);
    const root = document.createElement('div');
    const item = makeItem();
    root.appendChild(item);
    document.body.appendChild(root);
    const stop = mountMenubarHandoff({ root });
    item.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    expect(item.open).toBe(false);
    stop();
  });

  it('wires hover open for an imperative host root', () => {
    const root = document.createElement('div');
    root.className = 'chrome';
    const a = makeItem();
    const b = makeItem();
    root.append(a, b);
    document.body.appendChild(root);

    const stop = mountMenubarHandoff({ root });
    a.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    expect(a.open).toBe(true);
    b.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    expect(a.open).toBe(false);
    expect(b.open).toBe(true);
    stop();
    expect(document.documentElement.hasAttribute('data-ran-menubar-switch')).toBe(false);
  });
});
