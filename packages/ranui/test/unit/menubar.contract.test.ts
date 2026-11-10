import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Menubar } from '@/components/menubar';
import '@/components/menubar';
import { harvestMatchesItem, mountMenubarHandoff } from '@/utils/menubar';
import type { MenubarItem } from '@/utils/menubar';

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
    document.documentElement.removeAttribute('data-ran-menubar-viewport');
    media = finePointer(true);
  });

  afterEach(() => {
    media?.mockRestore();
    media = null;
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-menubar-viewport');
    document.getElementById('ran-menubar-viewport-style')?.remove();
  });

  it('does not throw on createElement', () => {
    expect(() => document.createElement('r-menubar')).not.toThrow();
  });

  it('exposes defaults and reflects attributes', () => {
    const el = document.createElement('r-menubar') as Menubar;
    document.body.appendChild(el);
    expect(el.panelSelector).toBe('r-dropdown.ran-chrome-menu');
    expect(el.leaveDelay).toBe(180);
    expect(el.duration).toBe(280);

    el.panelSelector = '.panel';
    el.leaveDelay = 90;
    el.duration = 160;
    expect(el.getAttribute('panel-selector')).toBe('.panel');
    expect(el.getAttribute('leave-delay')).toBe('90');
    expect(el.getAttribute('duration')).toBe('160');
    expect(el.panelSelector).toBe('.panel');
    expect(el.leaveDelay).toBe(90);
    expect(el.duration).toBe(160);
  });

  it('opens a slotted select on fine-pointer hover and arms the shared viewport', () => {
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
    expect(document.documentElement.hasAttribute('data-ran-menubar-viewport')).toBe(true);

    b.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    expect(a.open).toBe(false);
    expect(b.open).toBe(true);
    expect(document.documentElement.getAttribute('data-ran-menubar-viewport')).toMatch(/left|right|pending|open/);
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

describe('harvestMatchesItem', () => {
  it('rejects theme/surface harvests for a language r-select', () => {
    const lang = makeItem('r-select') as MenubarItem;
    const en = document.createElement('r-option');
    en.setAttribute('value', '/');
    en.textContent = 'English';
    const cn = document.createElement('r-option');
    cn.setAttribute('value', '/cn/');
    cn.textContent = '简体中文';
    lang.append(en, cn);

    expect(
      harvestMatchesItem(lang, {
        items: [
          { value: 'system', label: 'System', active: true },
          { value: 'light', label: 'Light', active: false },
        ],
        width: 120,
        height: 80,
      }),
    ).toBe(false);
    expect(
      harvestMatchesItem(lang, {
        items: [
          { value: 'solid', label: 'Graphite', active: true },
          { value: 'glass', label: 'Liquid glass', active: false },
        ],
        width: 120,
        height: 80,
      }),
    ).toBe(false);
    expect(
      harvestMatchesItem(lang, {
        items: [
          { value: '/', label: 'English', active: true },
          { value: '/cn/', label: '简体中文', active: false },
        ],
        width: 160,
        height: 200,
      }),
    ).toBe(true);
  });

  it('matches theme and surface switches only to their own values', () => {
    const theme = makeItem('r-theme-switch') as MenubarItem;
    const surface = makeItem('r-surface-switch') as MenubarItem;
    expect(
      harvestMatchesItem(theme, {
        items: [{ value: 'system', label: 'System', active: true }],
        width: 100,
        height: 40,
      }),
    ).toBe(true);
    expect(
      harvestMatchesItem(theme, {
        items: [{ value: '/', label: 'English', active: true }],
        width: 100,
        height: 40,
      }),
    ).toBe(false);
    expect(
      harvestMatchesItem(surface, {
        items: [
          { value: 'solid', label: 'Graphite', active: true },
          { value: 'glass', label: 'Liquid glass', active: false },
        ],
        width: 100,
        height: 40,
      }),
    ).toBe(true);
  });
});

describe('mountMenubarHandoff', () => {
  let media: ReturnType<typeof finePointer> | null = null;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-menubar-viewport');
    media = finePointer(true);
  });

  afterEach(() => {
    media?.mockRestore();
    media = null;
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ran-menubar-viewport');
    document.getElementById('ran-menubar-viewport-style')?.remove();
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
    expect(document.documentElement.hasAttribute('data-ran-menubar-viewport')).toBe(false);
    expect(document.querySelector('.ran-menubar-viewport')).toBeNull();
  });
});
