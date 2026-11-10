/**
 * Hover menubar handoff for chrome selects (language / theme / surface).
 *
 * Peer menus stay independent portals (Radix Select / Floating UI) — do not
 * FLIP-scale the positioned host (that fights placement transforms and
 * flickers). Instead:
 * - Hover open on fine pointers; close with a short leave delay.
 * - Peer hops zero the dropdown’s scale enter/exit, then soft-fade +
 *   directional slide via `::part(dropdown)` (opacity + translateX only).
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
   * How long peer-hop CSS stays armed, in ms. Default 360.
   * Must outlast select’s async portal mount + soft hop duration.
   */
  switchHold?: number;
  /** Soft hop duration in ms. Default 280. */
  duration?: number;
  /** Soft hop easing. Default spring decelerate. */
  easing?: string;
}

const DEFAULT_PANEL = 'r-dropdown.ran-chrome-menu';
const SWITCH_ATTR = 'data-ran-menubar-switch';
const STYLE_ID = 'ran-menubar-handoff-style';
/** Cover close → portal mount → soft hop play. */
const DEFAULT_SWITCH_HOLD = 360;
const DEFAULT_LEAVE = 180;
const DEFAULT_DURATION = 280;
const DEFAULT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** Slide distance — large enough to read as motion, small enough not to feel jumpy. */
const HOP_DX = 16;

const finePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const reduceMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Inject hop keyframes + ::part overrides.
 * Scale enter/exit is zeroed; soft opacity/translate runs on the painted part.
 */
const ensureHandoffStyle = (panelSelector: string, duration: number, easing: string): void => {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(STYLE_ID);
  const css = `
@keyframes ran-menubar-hop-from-left{from{opacity:0;transform:translateX(-${HOP_DX}px)}to{opacity:1;transform:translateX(0)}}
@keyframes ran-menubar-hop-from-right{from{opacity:0;transform:translateX(${HOP_DX}px)}to{opacity:1;transform:translateX(0)}}
html[${SWITCH_ATTR}] ${panelSelector}{--ran-dropdown-animation-duration:0s!important}
html[${SWITCH_ATTR}="right"] ${panelSelector}::part(dropdown){animation:ran-menubar-hop-from-left ${duration}ms ${easing} both!important}
html[${SWITCH_ATTR}="left"] ${panelSelector}::part(dropdown){animation:ran-menubar-hop-from-right ${duration}ms ${easing} both!important}
@media (prefers-reduced-motion:reduce){
html[${SWITCH_ATTR}] ${panelSelector}::part(dropdown){animation:none!important}
}`;
  if (existing) {
    existing.textContent = css;
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
};

const isMenubarItem = (node: Element): node is MenubarItem => {
  if (node.hasAttribute('data-ran-menubar-item')) return true;
  const tag = node.tagName;
  if (tag === 'R-SELECT' || tag === 'R-THEME-SWITCH' || tag === 'R-SURFACE-SWITCH') return true;
  return 'open' in node;
};

const defaultItems = (root: HTMLElement): MenubarItem[] => {
  const found: MenubarItem[] = [];
  for (const el of root.querySelectorAll('*')) {
    if (!isMenubarItem(el)) continue;
    if (found.some((item) => item.contains(el))) continue;
    found.push(el);
  }
  return found;
};

/**
 * Wire hover open + soft peer handoff on a root of chrome menu triggers.
 * Returns a disposer. No-ops when the pointer is not fine (touch keeps click).
 */
export const mountMenubarHandoff = (options: MenubarHandoffOptions): (() => void) => {
  const {
    root,
    panelSelector = DEFAULT_PANEL,
    leaveDelay = DEFAULT_LEAVE,
    switchHold = DEFAULT_SWITCH_HOLD,
    duration = DEFAULT_DURATION,
    easing = DEFAULT_EASE,
  } = options;

  if (!finePointer()) return () => undefined;

  ensureHandoffStyle(panelSelector, duration, easing);

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

  const markSwitch = (direction: 'left' | 'right'): void => {
    // Direction drives which ::part hop keyframe runs.
    document.documentElement.setAttribute(SWITCH_ATTR, reduceMotion() ? '' : direction);
    window.clearTimeout(switchTimer);
    switchTimer = window.setTimeout(
      () => {
        document.documentElement.removeAttribute(SWITCH_ATTR);
      },
      Math.max(switchHold, duration + 80),
    );
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
    if (hopping && active) {
      const fromLeft = active.getBoundingClientRect().left;
      const toLeft = item.getBoundingClientRect().left;
      // Hopping right → content arrives from the left (Radix NavigationMenu pattern).
      markSwitch(toLeft >= fromLeft ? 'right' : 'left');
    }
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
