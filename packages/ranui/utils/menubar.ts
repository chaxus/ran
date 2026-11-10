/**
 * Hover menubar handoff for chrome selects (language / theme / surface).
 *
 * Industry recipe (Stripe morphing nav / react-flip-toolkit / Radix NavigationMenu):
 * - One panel “shell” morphs between peers via FLIP (`transform` only — GPU).
 * - Content sits under an inverse scale so labels do not stretch (Stripe’s
 *   split background/content trick; we inverse-scale the painted surface).
 * - Hop keeps opacity at 1 — no fade flash; idle open still uses dropdown enter.
 * - Skip dropdown enter/exit CSS for the hop via `html[data-ran-menubar-switch]`.
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
  /** FLIP morph duration in ms. Default 320 (Stripe-like settle). */
  duration?: number;
  /** FLIP easing. Default `--ran-motion-ease-spring`. */
  easing?: string;
}

const DEFAULT_PANEL = 'r-dropdown.ran-chrome-menu';
const SWITCH_ATTR = 'data-ran-menubar-switch';
const STYLE_ID = 'ran-menubar-handoff-style';
/** Slightly longer than `--ran-motion-duration-slow` — Stripe morphs ~300–400ms. */
const DEFAULT_DURATION = 320;
/** Spring decelerate — same token as ranui motion spring. */
const DEFAULT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DEFAULT_LEAVE = 180;

type PanelHost = HTMLElement & { _shadowDom?: ShadowRoot };

const finePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const reduceMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ensureHandoffStyle = (panelSelector: string): void => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  // Skip enter/exit while a hop owns the morph — same idea as docs `data-chrome-switch`.
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

const openPanel = (panelSelector: string): PanelHost | null => {
  for (const el of document.querySelectorAll<HTMLElement>(panelSelector)) {
    if (getComputedStyle(el).display === 'none') continue;
    if (el.getClientRects().length === 0) continue;
    return el as PanelHost;
  }
  return null;
};

const paintedOf = (host: PanelHost): HTMLElement | null =>
  host._shadowDom?.querySelector<HTMLElement>('.ranui-dropdown') ?? null;

const clearInlineMotion = (host: PanelHost, painted: HTMLElement | null): void => {
  host.style.transform = '';
  host.style.transformOrigin = '';
  host.style.willChange = '';
  if (!painted) return;
  painted.style.transform = '';
  painted.style.transformOrigin = '';
  painted.style.willChange = '';
};

/**
 * Stripe / Lokesh FLIP: snap the shell to the previous box before paint, then
 * animate transform only. Inverse-scale the painted surface so text stays crisp.
 * Two rAFs before measuring “to” so select’s px width lock has settled.
 */
const flipPanel = (from: DOMRect, panelSelector: string, duration: number, easing: string): void => {
  if (reduceMotion()) return;

  const run = (attempt: number): void => {
    const el = openPanel(panelSelector);
    if (!el) {
      if (attempt < 10) requestAnimationFrame(() => run(attempt + 1));
      return;
    }
    const to = el.getBoundingClientRect();
    if (to.width < 1 || to.height < 1) {
      if (attempt < 10) {
        requestAnimationFrame(() => run(attempt + 1));
        return;
      }
      return;
    }
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = from.width / Math.max(to.width, 1);
    const sy = from.height / Math.max(to.height, 1);
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.02 && Math.abs(sy - 1) < 0.02) {
      clearInlineMotion(el, paintedOf(el));
      return;
    }

    const painted = paintedOf(el);
    el.getAnimations().forEach((animation) => animation.cancel());
    painted?.getAnimations().forEach((animation) => animation.cancel());

    const fromHost = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    const invX = 1 / sx;
    const invY = 1 / sy;

    // Snap before the next paint — no final-size flash (Stripe FLIP first frame).
    el.style.willChange = 'transform';
    el.style.transformOrigin = '0 0';
    el.style.transform = fromHost;
    if (painted) {
      painted.style.willChange = 'transform';
      painted.style.transformOrigin = '0 0';
      painted.style.transform = `scale(${invX}, ${invY})`;
    }
    // Force style flush so the snap is committed before we schedule the play.
    void el.offsetWidth;

    requestAnimationFrame(() => {
      if (openPanel(panelSelector) !== el) {
        clearInlineMotion(el, painted);
        return;
      }
      const hostAnim = el.animate(
        [
          { transform: fromHost, transformOrigin: '0 0' },
          { transform: 'translate(0, 0) scale(1, 1)', transformOrigin: '0 0' },
        ],
        { duration, easing, fill: 'none' },
      );
      void hostAnim.finished
        .catch(() => undefined)
        .finally(() => {
          if (openPanel(panelSelector) === el) clearInlineMotion(el, painted);
        });

      if (!painted) return;
      const contentAnim = painted.animate(
        [
          { transform: `scale(${invX}, ${invY})`, transformOrigin: '0 0' },
          { transform: 'scale(1, 1)', transformOrigin: '0 0' },
        ],
        { duration, easing, fill: 'none' },
      );
      void contentAnim.finished
        .catch(() => undefined)
        .finally(() => {
          if (openPanel(panelSelector) === el) {
            painted.style.transform = '';
            painted.style.transformOrigin = '';
            painted.style.willChange = '';
          }
        });
    });
  };

  // Two frames: (1) panel opens + select measurePanel locks px width, (2) morph.
  requestAnimationFrame(() => requestAnimationFrame(() => run(0)));
};

/**
 * Wire hover open + FLIP peer handoff on a root of chrome menu triggers.
 * Returns a disposer. No-ops when the pointer is not fine (touch keeps click).
 */
export const mountMenubarHandoff = (options: MenubarHandoffOptions): (() => void) => {
  const {
    root,
    panelSelector = DEFAULT_PANEL,
    leaveDelay = DEFAULT_LEAVE,
    duration = DEFAULT_DURATION,
    easing = DEFAULT_EASE,
  } = options;

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
    }, duration + 40);
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
    const from = hopping ? (openPanel(panelSelector)?.getBoundingClientRect() ?? null) : null;
    if (hopping) markSwitch();
    armed = true;
    active = item;
    closeOthers(item);
    setOpen(item, true);
    // Do not zero opacity on the incoming panel — Stripe keeps the shell visible
    // and only morphs transform; a fade reads as flicker on short chrome menus.
    if (from) flipPanel(from, panelSelector, duration, easing);
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
