import menubarCss from './index.less?inline';
import { EventManager, Slot, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  getStringAttribute,
  mountShadowTree,
  paintedShadowChild,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { mountMenubarHandoff } from '@/utils/menubar';
import type { MenubarHandoffOptions, MenubarItem } from '@/utils/menubar';

/**
 * `<r-menubar>` — hover handoff across sibling chrome selects.
 *
 * Wrap `r-select` / `r-theme-switch` / `r-surface-switch` (or any host with `open`).
 * On fine pointers the bar opens on hover and morphs a **shared viewport** between
 * peers (Stripe / Radix NavigationMenu): shell size/position transitions, content
 * slides by direction. Touch keeps each control's own click trigger.
 *
 * ```html
 * <r-menubar>
 *   <r-select dropdownclass="ran-chrome-menu">…</r-select>
 *   <r-theme-switch></r-theme-switch>
 *   <r-surface-switch></r-surface-switch>
 * </r-menubar>
 * ```
 */
export class Menubar extends RanElement {
  static get observedAttributes(): string[] {
    return ['panel-selector', 'leave-delay', 'duration', 'sheet'];
  }

  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _slot: HTMLSlotElement;
  _dispose: (() => void) | null = null;

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, menubarCss);
    // Keep Declarative Shadow DOM shell when present (slot by builder child order).
    const painted = paintedShadowChild(this._shadowDom);
    const paintedSlot = painted?.children.item(0) ?? painted?.children[0] ?? null;
    if (paintedSlot?.tagName?.toLowerCase() === 'slot') {
      this._slot = paintedSlot as HTMLSlotElement;
      return;
    }
    this._slot = Slot().build() as HTMLSlotElement;
    mountShadowTree(
      this._shadowDom,
      menubarCss,
      View('div').class('ran-menubar').attr('part', 'root').children(this._slot).build(),
    );
  }

  /** CSS injected into the component's shadow DOM. */
  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  /** Native panels harvested into the shared viewport. Defaults to `r-dropdown.ran-chrome-menu`. */
  get panelSelector(): string {
    return getStringAttribute(this, 'panel-selector') || 'r-dropdown.ran-chrome-menu';
  }
  set panelSelector(value: string) {
    setStringAttribute(this, 'panel-selector', value, { removeEmpty: true });
  }

  /** Milliseconds before close after the pointer leaves the bar and viewport. */
  get leaveDelay(): number {
    const raw = this.getAttribute('leave-delay');
    const n = raw == null || raw === '' ? NaN : Number(raw);
    return Number.isFinite(n) ? n : 180;
  }
  set leaveDelay(value: number) {
    this.setAttribute('leave-delay', String(value));
  }

  /** Shared viewport morph + content slide duration in milliseconds. */
  get duration(): number {
    const raw = this.getAttribute('duration');
    const n = raw == null || raw === '' ? NaN : Number(raw);
    return Number.isFinite(n) ? n : 280;
  }
  set duration(value: number) {
    this.setAttribute('duration', String(value));
  }

  private _options = (): MenubarHandoffOptions => ({
    root: this,
    panelSelector: this.panelSelector,
    leaveDelay: this.leaveDelay,
    duration: this.duration,
    items: () => this._items(),
  });

  private _items = (): MenubarItem[] => {
    const found: MenubarItem[] = [];
    for (const el of this.querySelectorAll('r-select, r-theme-switch, r-surface-switch, [data-ran-menubar-item]')) {
      if (found.some((item) => item.contains(el))) continue;
      found.push(el as MenubarItem);
    }
    return found;
  };

  private _remount = (): void => {
    this._dispose?.();
    this._dispose = null;
    if (!this.isConnected) return;
    this._dispose = mountMenubarHandoff(this._options());
  };

  private handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._remount();
    this._events.on(this._slot, 'slotchange', this._remount);
  }

  disconnectedCallback(): void {
    this._events.abort();
    this._dispose?.();
    this._dispose = null;
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') {
      this.handlerExternalCss();
      return;
    }
    if (this.isConnected) this._remount();
  }
}

defineSSR('r-menubar', Menubar as unknown as new () => HTMLElement);
export default Menubar;

export { mountMenubarHandoff } from '@/utils/menubar';
export type { MenubarHandoffOptions, MenubarItem } from '@/utils/menubar';
