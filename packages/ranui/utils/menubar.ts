/**
 * Hover menubar handoff for chrome selects (language / theme / surface).
 *
 * Best practice for this pattern (docs chrome selects — not mega-nav):
 * - Peer menus are independent portals (Radix Select / Floating UI), not one
 *   shared Stripe viewport. Do not FLIP-scale across portals — that fights
 *   positioning transforms and flickers.
 * - Hover open on fine pointers; close with a short leave delay (Floating UI
 *   useHover / safe hover path).
 * - Peer hops skip enter/exit CSS via `html[data-ran-menubar-switch]` so the
 *   next panel appears under its own trigger without a blank/fade flash.
 *
 * Used by `<r-menubar>` and available as `mountMenubarHandoff` for hosts that
 * already own their own root markup.
 */

export type MenubarItem = HTMLElement & { open: boolean };

export interface MenubarHandoffOptions {
  /** Region that owns the triggers; leaving it (and the panels) disarms. */
  root: HTMLElement;
  /**
   * Triggers in visual order. Defaults to light-DOM descendants that expose
   * `open` (r-select, r-theme-switch, r-surface-switch, or `[data-ran-menubar-item]`).
   */
  items?: MenubarItem[] | (() => MenubarItem[]);
  /** Portaled panel selector. Default: `r-dropdown.ran-chrome-menu`. */
  panelSelector?: string;
  /** Delay before closing after pointer leaves root + panels. Default 180. */
  leaveDelay?: number;
  /**
   * How long peer-hop CSS (zero enter/exit) stays armed, in ms. Default 120.
   * Long enough to cover close→open of the next select; not a morph duration.
   */
  switchHold?: number;
}

const DEFAULT_PANEL = 'r-dropdown.ran-chrome-menu';
const SWITCH_ATTR = 'data-ran-menubar-switch';
const STYLE_ID = 'ran-menubar-handoff-style';
/** Cover one close→open frame pair without lingering zero-duration forever. */
const DEFAULT_SWITCH_HOLD = 120;
const DEFAULT_LEAVE = 180;

const finePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const ensureHandoffStyle = (panelSelector: string): void => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  // Peer hops skip enter/exit so the next panel does not fade/scale in alone.
  style.textContent = `html[${SWITCH_ATTR}] ${panelSelector}{--ran-dropdown-animation-duration:0s!important}`;
  document.head.appendChild(style);
};

const isMenubarItem = (node: Element): node is MenubarItem => {
  if (node.hasAttribute('data-ran-menubar-item')) return true;
  const tag = node.tagName;
  if (tag === 'R-SELECT' || tag === 'R-THEME-SWITCH' || tag === 'R-SURFACE-SWITCH') return true;
  // Upgraded custom elements may expose `open` without the default tags.
  return 'open' in node;
};

const defaultItems = (root: HTMLElement): MenubarItem[] => {
  const found: MenubarItem[] = [];
  for (const el of root.querySelectorAll('*')) {
    if (!isMenubarItem(el)) continue;
    // Prefer the outermost chrome host: skip an r-select nested under another item.
    if (found.some((item) => item.contains(el))) continue;
    found.push(el);
  }
  return found;
};

/**
 * Wire hover open + instant peer handoff on a root of chrome menu triggers.
 * Returns a disposer. No-ops when the pointer is not fine (touch keeps click).
 */
export const mountMenubarHandoff = (options: MenubarHandoffOptions): (() => void) => {
  const { root, panelSelector = DEFAULT_PANEL, leaveDelay = DEFAULT_LEAVE, switchHold = DEFAULT_SWITCH_HOLD } = options;

  if (!finePointer()) return () => undefined;

  ensureHandoffStyle(panelSelector);

  const resolveItems = (): MenubarItem[] => {
    if (typeof options.items === 'function') return options.items();
    if (options.items) return options.items;
    return defaultItems(root);
  };

  let armed = false;
  let active: MenubarItem | null = null;
  let leaveTimer: number | undefined;
  let switchTimer: number | undefined;
  const cleanups: Array<() => void> = [];

  const markSwitch = (): void => {
    document.documentElement.setAttribute(SWITCH_ATTR, '');
    window.clearTimeout(switchTimer);
    switchTimer = window.setTimeout(() => {
      document.documentElement.removeAttribute(SWITCH_ATTR);
    }, switchHold);
  };

  const setOpen = (item: MenubarItem, open: boolean): void => {
    if (item.open === open) return;
    item.open = open;
  };

  const closeOthers = (keep: MenubarItem | null): void => {
    for (const item of resolveItems()) {
      if (item !== keep) setOpen(item, false);
    }
  };

  const arm = (item: MenubarItem): void => {
    window.clearTimeout(leaveTimer);
    if (active === item && armed) return;
    const hopping = armed && active !== null && active !== item;
    // Skip enter/exit on peer hops so two independent portals do not fade.
    if (hopping) markSwitch();
    armed = true;
    active = item;
    closeOthers(item);
    setOpen(item, true);
  };

  const disarm = (): void => {
    window.clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(() => {
      if (root.matches(':hover') || document.querySelector(`${panelSelector}:hover`)) return;
      closeOthers(null);
      armed = false;
      active = null;
      document.documentElement.removeAttribute(SWITCH_ATTR);
    }, leaveDelay);
  };

  const onItemEnter = (event: Event): void => {
    const target = event.currentTarget as MenubarItem;
    arm(target);
  };

  const bindItems = (): void => {
    for (const item of resolveItems()) {
      item.addEventListener('pointerenter', onItemEnter);
      cleanups.push(() => item.removeEventListener('pointerenter', onItemEnter));
    }
  };
  bindItems();

  const onPanelOver = (event: Event): void => {
    const el = event.target as Element | null;
    if (!el?.closest?.(panelSelector)) return;
    window.clearTimeout(leaveTimer);
  };
  const onPanelOut = (event: Event): void => {
    const el = event.target as Element | null;
    if (!el?.closest?.(panelSelector)) return;
    const next = (event as PointerEvent).relatedTarget as Element | null;
    if (next?.closest?.(panelSelector) || (next && root.contains(next))) return;
    disarm();
  };
  document.addEventListener('pointerover', onPanelOver);
  document.addEventListener('pointerout', onPanelOut);
  cleanups.push(() => {
    document.removeEventListener('pointerover', onPanelOver);
    document.removeEventListener('pointerout', onPanelOut);
  });

  const onRootLeave = (event: PointerEvent): void => {
    const next = event.relatedTarget as Element | null;
    if (next?.closest?.(panelSelector)) return;
    disarm();
  };
  root.addEventListener('pointerleave', onRootLeave);
  cleanups.push(() => root.removeEventListener('pointerleave', onRootLeave));

  const onKey = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    closeOthers(null);
    armed = false;
    active = null;
    document.documentElement.removeAttribute(SWITCH_ATTR);
  };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => document.removeEventListener('keydown', onKey));

  return () => {
    window.clearTimeout(leaveTimer);
    window.clearTimeout(switchTimer);
    document.documentElement.removeAttribute(SWITCH_ATTR);
    for (const stop of cleanups) stop();
  };
};
