/**
 * Hover menubar handoff for chrome selects (language / theme / surface).
 *
 * Industry pattern for smooth peer hops (Stripe / Radix NavigationMenu):
 * one shared viewport shell morphs position + size; content layers cross-slide
 * with directional `data-motion`. Independent select portals stay open for
 * state/a11y but are visually suppressed while the viewport is showing.
 *
 * Used by `<r-menubar>` and available as `mountMenubarHandoff`.
 */

export type MenubarItem = HTMLElement & { open: boolean; value?: string };

export interface MenubarHandoffOptions {
  /** Region that owns the triggers; leaving it (and the viewport) disarms. */
  root: HTMLElement;
  /**
   * Triggers in visual order. Defaults to light-DOM descendants that expose
   * `open` (r-select, r-theme-switch, r-surface-switch, or `[data-ran-menubar-item]`).
   */
  items?: MenubarItem[] | (() => MenubarItem[]);
  /** Native portaled panel selector (harvested then hidden). Default: `r-dropdown.ran-chrome-menu`. */
  panelSelector?: string;
  /** Delay before closing after pointer leaves root + viewport. Default 180. */
  leaveDelay?: number;
  /** Shell morph + content slide duration in ms. Default 280. */
  duration?: number;
  /** Motion easing. Default spring decelerate. */
  easing?: string;
}

const DEFAULT_PANEL = 'r-dropdown.ran-chrome-menu';
const VIEWPORT_ATTR = 'data-ran-menubar-viewport';
const STYLE_ID = 'ran-menubar-viewport-style';
const VIEWPORT_CLASS = 'ran-menubar-viewport';
const DEFAULT_LEAVE = 180;
const DEFAULT_DURATION = 280;
const DEFAULT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** Content slide distance — GodUI ~3rem is carousel-like; 24px reads as direction. */
const SLIDE_DX = 24;

type Harvest = {
  items: Array<{ value: string; label: string; active: boolean }>;
  width: number;
  height: number;
};

const finePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const reduceMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ensureViewportStyle = (panelSelector: string, duration: number, easing: string): void => {
  if (typeof document === 'undefined') return;
  const css = `
html[${VIEWPORT_ATTR}] ${panelSelector}{opacity:0!important;pointer-events:none!important}
.${VIEWPORT_CLASS}{position:fixed;inset:0;z-index:1200;pointer-events:none}
.${VIEWPORT_CLASS}__shell{
  position:fixed;top:0;left:0;box-sizing:border-box;pointer-events:auto;
  padding:4px;overflow:hidden;
  background:var(--ran-color-bg-elevated,#fff);
  border:1px solid var(--ran-color-border,#e4e4e8);
  border-radius:var(--ran-radius-md,12px);
  box-shadow:var(--ran-shadow-menu,var(--ran-shadow-elevated,0 8px 24px rgba(0,0,0,.12)));
  transform:translate3d(var(--ran-menubar-x,0px),var(--ran-menubar-y,0px),0);
  width:var(--ran-menubar-w,0px);height:var(--ran-menubar-h,0px);
  opacity:var(--ran-menubar-opacity,0);
  transition:
    transform ${duration}ms ${easing},
    width ${duration}ms ${easing},
    height ${duration}ms ${easing},
    opacity ${Math.min(180, duration)}ms linear;
}
:root[data-ran-surface=glass] .${VIEWPORT_CLASS}__shell{
  background:var(--ran-surface-glass-bg,rgba(255,255,255,.72));
  border-color:var(--ran-surface-glass-border,rgba(255,255,255,.45));
  backdrop-filter:blur(var(--ran-surface-glass-blur,16px));
  -webkit-backdrop-filter:blur(var(--ran-surface-glass-blur,16px));
}
.${VIEWPORT_CLASS}__clip{position:relative;width:100%;height:100%;overflow:hidden}
.${VIEWPORT_CLASS}__layer{position:absolute;inset:0;display:flex;flex-direction:column;gap:0}
.${VIEWPORT_CLASS}__layer[data-motion=from-start]{animation:ran-menubar-from-start ${duration}ms ${easing} both}
.${VIEWPORT_CLASS}__layer[data-motion=from-end]{animation:ran-menubar-from-end ${duration}ms ${easing} both}
.${VIEWPORT_CLASS}__layer[data-motion=to-start]{animation:ran-menubar-to-start ${duration}ms ${easing} both}
.${VIEWPORT_CLASS}__layer[data-motion=to-end]{animation:ran-menubar-to-end ${duration}ms ${easing} both}
.${VIEWPORT_CLASS}__layer[data-motion=fade]{animation:ran-menubar-fade-in ${Math.min(180, duration)}ms ${easing} both}
@keyframes ran-menubar-from-start{from{opacity:0;transform:translateX(-${SLIDE_DX}px)}to{opacity:1;transform:translateX(0)}}
@keyframes ran-menubar-from-end{from{opacity:0;transform:translateX(${SLIDE_DX}px)}to{opacity:1;transform:translateX(0)}}
@keyframes ran-menubar-to-start{from{opacity:1;transform:translateX(0)}50%{opacity:0}to{opacity:0;transform:translateX(-${SLIDE_DX}px)}}
@keyframes ran-menubar-to-end{from{opacity:1;transform:translateX(0)}50%{opacity:0}to{opacity:0;transform:translateX(${SLIDE_DX}px)}}
@keyframes ran-menubar-fade-in{from{opacity:0}to{opacity:1}}
.${VIEWPORT_CLASS}__option{
  appearance:none;border:0;background:transparent;margin:0;cursor:pointer;text-align:start;
  display:block;width:100%;box-sizing:border-box;
  padding:6px 12px;border-radius:var(--ran-radius-sm,8px);
  color:var(--ran-color-text,rgba(0,0,0,.88));
  font:inherit;font-size:var(--ran-text-label-1,14px);font-weight:var(--ran-text-label-weight,500);
  line-height:1.4;white-space:nowrap;
}
.${VIEWPORT_CLASS}__option:hover,.${VIEWPORT_CLASS}__option:focus-visible{
  outline:none;background:var(--ran-color-fill-secondary,rgba(0,0,0,.06));
}
.${VIEWPORT_CLASS}__option[aria-selected=true]{
  background:var(--ran-color-fill-secondary,rgba(0,0,0,.06));
}
@media (prefers-reduced-motion:reduce){
  .${VIEWPORT_CLASS}__shell{transition:none}
  .${VIEWPORT_CLASS}__layer[data-motion]{animation:none}
}`;
  const existing = document.getElementById(STYLE_ID);
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

const openNativePanels = (panelSelector: string): HTMLElement[] => {
  const open: HTMLElement[] = [];
  for (const el of document.querySelectorAll<HTMLElement>(panelSelector)) {
    if (getComputedStyle(el).display === 'none') continue;
    if (el.getClientRects().length === 0) continue;
    open.push(el);
  }
  return open;
};

const harvestFromPanel = (panel: HTMLElement): Harvest | null => {
  const items = [...panel.querySelectorAll('r-dropdown-item')].map((el) => ({
    value: el.getAttribute('value') || '',
    label: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    active: el.getAttribute('aria-selected') === 'true' || el.hasAttribute('active'),
  }));
  if (!items.length || items.every((item) => !item.label)) return null;
  const box = panel.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return null;
  return { items, width: box.width, height: box.height };
};

/** True when harvested values look like they belong to this trigger. */
const harvestMatchesItem = (item: MenubarItem, harvest: Harvest): boolean => {
  const values = harvest.items.map((entry) => entry.value);
  const tag = item.tagName;
  if (tag === 'R-THEME-SWITCH')
    return values.some((value) => value === 'light' || value === 'system' || value === 'dark');
  if (tag === 'R-SURFACE-SWITCH') return values.some((value) => value === 'solid' || value === 'glass');
  if (tag === 'R-SELECT') {
    // Language chrome uses locale path values; other selects still match by default.
    if (values.some((value) => value.startsWith('/') || /^https?:/i.test(value))) return true;
  }
  return true;
};

const harvestPanel = (panelSelector: string, item?: MenubarItem): Harvest | null => {
  const panels = openNativePanels(panelSelector);
  // Newest panel last — during a hop the previous portal can still be closing.
  for (let i = panels.length - 1; i >= 0; i -= 1) {
    const harvested = harvestFromPanel(panels[i]!);
    if (!harvested) continue;
    if (item && !harvestMatchesItem(item, harvested)) continue;
    return harvested;
  }
  return null;
};

/**
 * Wire hover open + shared-viewport peer handoff.
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

  ensureViewportStyle(panelSelector, duration, easing);

  const resolveItems = (): MenubarItem[] => {
    if (typeof options.items === 'function') return options.items();
    if (options.items) return options.items;
    return defaultItems(root);
  };

  let armed = false;
  let active: MenubarItem | null = null;
  let leaveTimer: number | undefined;
  let hopGeneration = 0;
  const cleanups: Array<() => void> = [];

  // Shared viewport DOM
  const viewport = document.createElement('div');
  viewport.className = VIEWPORT_CLASS;
  viewport.setAttribute('aria-hidden', 'true');
  const shell = document.createElement('div');
  shell.className = `${VIEWPORT_CLASS}__shell`;
  shell.setAttribute('role', 'listbox');
  const clip = document.createElement('div');
  clip.className = `${VIEWPORT_CLASS}__clip`;
  shell.appendChild(clip);
  viewport.appendChild(shell);
  document.body.appendChild(viewport);
  cleanups.push(() => viewport.remove());

  const setShellBox = (x: number, y: number, w: number, h: number, opacity: number, instant: boolean): void => {
    if (instant) shell.style.transition = 'none';
    shell.style.setProperty('--ran-menubar-x', `${Math.round(x)}px`);
    shell.style.setProperty('--ran-menubar-y', `${Math.round(y)}px`);
    shell.style.setProperty('--ran-menubar-w', `${Math.ceil(w)}px`);
    shell.style.setProperty('--ran-menubar-h', `${Math.ceil(h)}px`);
    shell.style.setProperty('--ran-menubar-opacity', String(opacity));
    if (instant) {
      void shell.offsetWidth;
      shell.style.transition = '';
    }
  };

  const hideViewport = (): void => {
    document.documentElement.removeAttribute(VIEWPORT_ATTR);
    setShellBox(0, 0, 0, 0, 0, true);
    clip.replaceChildren();
    viewport.setAttribute('aria-hidden', 'true');
  };

  const buildLayer = (harvest: Harvest, motion: string | null, onPick: (value: string) => void): HTMLElement => {
    const layer = document.createElement('div');
    layer.className = `${VIEWPORT_CLASS}__layer`;
    if (motion && !reduceMotion()) layer.setAttribute('data-motion', motion);
    for (const item of harvest.items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `${VIEWPORT_CLASS}__option`;
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', item.active ? 'true' : 'false');
      btn.dataset.value = item.value;
      btn.textContent = item.label;
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onPick(item.value);
      });
      layer.appendChild(btn);
    }
    return layer;
  };

  const showViewport = (
    item: MenubarItem,
    harvest: Harvest,
    hopping: boolean,
    direction: 'left' | 'right' | null,
  ): void => {
    const trigger = item.getBoundingClientRect();
    // Align to trigger start (same as default select bottom placement).
    const x = trigger.left;
    const y = trigger.bottom + 4;
    const w = harvest.width;
    const h = harvest.height;

    document.documentElement.setAttribute(VIEWPORT_ATTR, direction || 'open');
    viewport.setAttribute('aria-hidden', 'false');

    const onPick = (value: string): void => {
      if ('value' in item) item.value = value;
      else item.setAttribute('value', value);
      // Close after commit.
      window.clearTimeout(leaveTimer);
      closeOthers(null);
      armed = false;
      active = null;
      hideViewport();
    };

    if (!hopping || reduceMotion()) {
      clip.replaceChildren(buildLayer(harvest, hopping ? null : 'fade', onPick));
      setShellBox(x, y, w, h, 1, !hopping);
      return;
    }

    const enterMotion = direction === 'right' ? 'from-end' : 'from-start';
    const leaveMotion = direction === 'right' ? 'to-start' : 'to-end';
    const incoming = buildLayer(harvest, enterMotion, onPick);
    const outgoing = clip.querySelector<HTMLElement>(`.${VIEWPORT_CLASS}__layer:not([data-leaving])`);
    if (outgoing) {
      outgoing.setAttribute('data-leaving', '');
      outgoing.setAttribute('data-motion', leaveMotion);
      outgoing.addEventListener(
        'animationend',
        () => {
          outgoing.remove();
        },
        { once: true },
      );
    }
    clip.appendChild(incoming);
    // Morph shell toward the new trigger / content box.
    setShellBox(x, y, w, h, 1, false);
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

  const present = (item: MenubarItem, hopping: boolean, direction: 'left' | 'right' | null, gen: number): void => {
    const tryHarvest = (attempt: number): void => {
      if (gen !== hopGeneration || active !== item) return;
      const harvested = harvestPanel(panelSelector, item);
      if (!harvested) {
        if (attempt < 24) {
          requestAnimationFrame(() => tryHarvest(attempt + 1));
          return;
        }
        // Fallback: leave the native portal visible.
        document.documentElement.removeAttribute(VIEWPORT_ATTR);
        return;
      }
      showViewport(item, harvested, hopping, direction);
    };
    // Two frames so select measurePanel can lock px width before harvest.
    requestAnimationFrame(() => requestAnimationFrame(() => tryHarvest(0)));
  };

  const arm = (item: MenubarItem): void => {
    window.clearTimeout(leaveTimer);
    if (active === item && armed) return;
    const hopping = armed && active !== null && active !== item;
    let direction: 'left' | 'right' | null = null;
    if (hopping && active) {
      const fromLeft = active.getBoundingClientRect().left;
      const toLeft = item.getBoundingClientRect().left;
      direction = toLeft >= fromLeft ? 'right' : 'left';
    }
    armed = true;
    active = item;
    const gen = ++hopGeneration;
    // Hide native portals before open so the harvest frame does not flash.
    document.documentElement.setAttribute(VIEWPORT_ATTR, direction || 'pending');
    closeOthers(item);
    setOpen(item, true);
    present(item, hopping, direction, gen);
  };

  const disarm = (): void => {
    window.clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(() => {
      if (root.matches(':hover') || viewport.matches(':hover')) return;
      closeOthers(null);
      armed = false;
      active = null;
      hideViewport();
    }, leaveDelay);
  };

  const onItemEnter = (event: Event): void => {
    arm(event.currentTarget as MenubarItem);
  };

  for (const item of resolveItems()) {
    item.addEventListener('pointerenter', onItemEnter);
    cleanups.push(() => item.removeEventListener('pointerenter', onItemEnter));
  }

  viewport.addEventListener('pointerenter', () => window.clearTimeout(leaveTimer));
  viewport.addEventListener('pointerleave', (event: PointerEvent) => {
    const next = event.relatedTarget as Element | null;
    if (next && root.contains(next)) return;
    disarm();
  });

  const onRootLeave = (event: PointerEvent): void => {
    const next = event.relatedTarget as Element | null;
    if (next?.closest?.(`.${VIEWPORT_CLASS}`)) return;
    disarm();
  };
  root.addEventListener('pointerleave', onRootLeave);
  cleanups.push(() => root.removeEventListener('pointerleave', onRootLeave));

  const onKey = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    closeOthers(null);
    armed = false;
    active = null;
    hideViewport();
  };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => document.removeEventListener('keydown', onKey));

  return () => {
    window.clearTimeout(leaveTimer);
    hideViewport();
    for (const stop of cleanups) stop();
  };
};
