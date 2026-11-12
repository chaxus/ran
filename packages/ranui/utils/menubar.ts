/**
 * Hover menubar handoff for chrome selects (language / theme / surface).
 *
 * Industry pattern for peer hops (Stripe / Radix NavigationMenu viewport):
 * one shared shell morphs position + size; incoming content fades/slides by
 * direction. Outgoing content is dropped immediately (no dual-layer residual).
 * Hop end snaps the shell to the new trigger so mid-flight travel cannot leave
 * a settled miss. First open paints wash with the first layout (no content fade).
 * Independent select portals stay open for state/a11y but are visually
 * suppressed while the viewport is showing.
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
/** Content enter slide — short enough to read as direction, not a stranded panel. */
const SLIDE_DX = 16;

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
.${VIEWPORT_CLASS}__layer{position:absolute;inset:0;display:flex;flex-direction:column;gap:0;opacity:1}
.${VIEWPORT_CLASS}__layer[data-motion=from-start]{animation:ran-menubar-from-start ${duration}ms ${easing} both}
.${VIEWPORT_CLASS}__layer[data-motion=from-end]{animation:ran-menubar-from-end ${duration}ms ${easing} both}
/* Incoming only — outgoing is removed, so opacity here cannot stack two menus. */
@keyframes ran-menubar-from-start{from{opacity:0;transform:translateX(-${SLIDE_DX}px)}to{opacity:1;transform:translateX(0)}}
@keyframes ran-menubar-from-end{from{opacity:0;transform:translateX(${SLIDE_DX}px)}to{opacity:1;transform:translateX(0)}}
/* One wash slides between rows — same motion as docs .sb__hover / r-select glass fill. */
.${VIEWPORT_CLASS}__hover{
  position:absolute;top:0;left:0;z-index:0;width:0;height:0;
  border-radius:var(--ran-radius-sm,8px);
  background:var(--ran-color-bg-hover,var(--ran-color-fill-secondary,rgba(0,0,0,.06)));
  opacity:0;pointer-events:none;
  /* Transform/size only — never ease opacity (open/hop must not read as a late fill). */
  transition:
    transform ${duration}ms ${easing},
    width ${duration}ms ${easing},
    height ${duration}ms ${easing};
}
:root[data-ran-surface=glass] .${VIEWPORT_CLASS}__hover{
  background:var(--ran-surface-glass-hover,color-mix(in srgb,var(--ran-gray-1000,#111113) 8%,transparent));
}
.${VIEWPORT_CLASS}__hover[data-instant]{transition:none}
.${VIEWPORT_CLASS}__option{
  appearance:none;border:0;background:transparent;margin:0;cursor:pointer;text-align:start;
  position:relative;z-index:1;
  display:block;width:100%;min-width:100%;box-sizing:border-box;align-self:stretch;
  padding:6px 12px;border-radius:var(--ran-radius-sm,8px);
  color:var(--ran-color-text,rgba(0,0,0,.88));
  font:inherit;font-size:var(--ran-text-label-1,14px);font-weight:var(--ran-text-label-weight,500);
  line-height:1.4;white-space:nowrap;
}
.${VIEWPORT_CLASS}__option:hover,.${VIEWPORT_CLASS}__option:focus-visible{outline:none}
/* Selection is weight, not a second fill — the sliding wash owns the transient cue. */
.${VIEWPORT_CLASS}[data-hover-fill] .${VIEWPORT_CLASS}__option:hover,
.${VIEWPORT_CLASS}[data-hover-fill] .${VIEWPORT_CLASS}__option:focus-visible,
.${VIEWPORT_CLASS}[data-hover-fill] .${VIEWPORT_CLASS}__option[aria-selected=true]{
  background:transparent;
}
.${VIEWPORT_CLASS}__option[aria-selected=true]{font-weight:600}
@media (prefers-reduced-motion:reduce){
  .${VIEWPORT_CLASS}__shell{transition:none}
  .${VIEWPORT_CLASS}__hover{transition:none}
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

const THEME_VALUES = new Set(['system', 'light', 'dark']);
const SURFACE_VALUES = new Set(['solid', 'glass']);

/**
 * True when harvested option values belong to this trigger.
 *
 * Must be strict: during a peer hop the previous portal can still be open, and a
 * loose match paints the wrong menu under the new trigger (language showing
 * theme/surface rows, with a clipped outgoing label stuck as a floating chip).
 */
export const harvestMatchesItem = (item: MenubarItem, harvest: Harvest): boolean => {
  const values = harvest.items.map((entry) => entry.value).filter(Boolean);
  if (!values.length) return false;
  const tag = item.tagName;
  if (tag === 'R-THEME-SWITCH') return values.every((value) => THEME_VALUES.has(value));
  if (tag === 'R-SURFACE-SWITCH') return values.every((value) => SURFACE_VALUES.has(value));

  // Prefer the select's own light-DOM options (docs language chrome).
  const options = [...item.querySelectorAll(':scope > r-option')]
    .map((el) => el.getAttribute('value') || '')
    .filter(Boolean);
  if (options.length) return values.every((value) => options.includes(value));

  // Unknown r-select: accept locale-like values only — never theme/surface tokens.
  if (values.some((value) => THEME_VALUES.has(value) || SURFACE_VALUES.has(value))) return false;
  return values.every((value) => value.startsWith('/') || /^https?:/i.test(value));
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
  viewport.setAttribute('data-hover-fill', '');
  const shell = document.createElement('div');
  shell.className = `${VIEWPORT_CLASS}__shell`;
  shell.setAttribute('role', 'listbox');
  const hover = document.createElement('span');
  hover.className = `${VIEWPORT_CLASS}__hover`;
  hover.setAttribute('aria-hidden', 'true');
  const clip = document.createElement('div');
  clip.className = `${VIEWPORT_CLASS}__clip`;
  // Fill lives in the clip (same containing block as options) so shell morph
  // cannot leave a stale viewport-space translate.
  clip.appendChild(hover);
  shell.appendChild(clip);
  viewport.appendChild(shell);
  document.body.appendChild(viewport);
  cleanups.push(() => viewport.remove());

  const SHELL_PAD = 4;
  let hoverTarget: HTMLElement | null = null;
  let hoverSettleTimer: number | undefined;
  let hoverGen = 0;

  const ensureHoverInClip = (): void => {
    if (hover.parentNode !== clip) clip.prepend(hover);
  };

  /**
   * Place in clip-local coordinates — stable while the shell itself translates.
   * Width uses the **target** shell row (CSS var), not the in-flight box: during a
   * hop morph `clientWidth` is still the previous menu’s width, so a measured wash
   * looked fit-content until settle. Overflow clips until the shell catches up.
   */
  const placeHover = (option: HTMLElement): void => {
    ensureHoverInClip();
    const clipBox = clip.getBoundingClientRect();
    const box = option.getBoundingClientRect();
    // Shell is border-box; clip is the content box (padding inset). During hop morph
    // clientWidth can still be the previous menu — derive the *target* content width.
    const targetShellW = parseFloat(shell.style.getPropertyValue('--ran-menubar-w')) || 0;
    const shellCs = getComputedStyle(shell);
    const borderX = (parseFloat(shellCs.borderLeftWidth) || 0) + (parseFloat(shellCs.borderRightWidth) || 0);
    const targetRowW = targetShellW > 0 ? Math.max(0, targetShellW - SHELL_PAD * 2 - borderX) : 0;
    const rowW = Math.max(clip.clientWidth, box.width, targetRowW);
    hover.toggleAttribute('data-instant', hoverTarget === null);
    hover.style.transform = `translate(0px, ${box.top - clipBox.top}px)`;
    hover.style.width = `${rowW}px`;
    hover.style.height = `${box.height}px`;
    hover.style.opacity = '1';
    hoverTarget = option;
  };
  const hideHover = (): void => {
    hover.style.opacity = '0';
    hoverTarget = null;
  };

  const layerContentHeight = (layer: HTMLElement): number => {
    let h = 0;
    for (const child of layer.children) {
      if (!(child instanceof HTMLElement)) continue;
      if (child === hover || child.classList.contains(`${VIEWPORT_CLASS}__hover`)) continue;
      h += child.offsetHeight;
    }
    return h;
  };

  const setShellBox = (
    x: number,
    y: number,
    w: number,
    h: number,
    opacity: number,
    instant: boolean,
    /** When false, leave `transition: none` applied so callers can paint wash before flush. */
    flush = true,
  ): void => {
    if (instant) shell.style.transition = 'none';
    shell.style.setProperty('--ran-menubar-x', `${Math.round(x)}px`);
    shell.style.setProperty('--ran-menubar-y', `${Math.round(y)}px`);
    shell.style.setProperty('--ran-menubar-w', `${Math.ceil(w)}px`);
    shell.style.setProperty('--ran-menubar-h', `${Math.ceil(h)}px`);
    shell.style.setProperty('--ran-menubar-opacity', String(opacity));
    if (instant && flush) {
      void shell.offsetWidth;
      shell.style.transition = '';
    }
  };

  const flushShellTransition = (): void => {
    void shell.offsetWidth;
    shell.style.transition = '';
  };

  /**
   * Fit height to the rebuilt rows (native harvest height was often taller —
   * empty gap under the last option). Keep harvest width as the floor so labels
   * match the measured chrome panel.
   *
   * `afterLayout` runs after size is written but **before** the instant flush —
   * place the selected wash there so the first painted frame already has it.
   */
  const fitAndShow = (
    layer: HTMLElement,
    x: number,
    y: number,
    minWidth: number,
    opacity: number,
    instant: boolean,
    afterLayout?: () => void,
  ): void => {
    ensureHoverInClip();
    // Width first so nowrap labels lay out; height follows content. No flush yet.
    setShellBox(
      x,
      y,
      minWidth,
      Math.max(layerContentHeight(layer) + SHELL_PAD * 2, SHELL_PAD * 2 + 1),
      opacity,
      true,
      false,
    );
    const h = layerContentHeight(layer) + SHELL_PAD * 2;
    const w = Math.max(minWidth, layer.scrollWidth + SHELL_PAD * 2);
    setShellBox(x, y, w, h, opacity, instant, false);
    afterLayout?.();
    if (instant) flushShellTransition();
    else shell.style.transition = '';
  };

  const syncHoverToLayer = (layer: HTMLElement): void => {
    window.clearTimeout(hoverSettleTimer);
    hoverGen += 1;
    const selected = layer.querySelector<HTMLElement>(`.${VIEWPORT_CLASS}__option[aria-selected="true"]`);
    if (selected?.isConnected) placeHover(selected);
    else hideHover();
  };

  const hideViewport = (): void => {
    hoverGen += 1;
    document.documentElement.removeAttribute(VIEWPORT_ATTR);
    setShellBox(0, 0, 0, 0, 0, true);
    hideHover();
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
    // Width floor from the native panel; height is measured from rebuilt rows.
    const w = harvest.width;

    document.documentElement.setAttribute(VIEWPORT_ATTR, direction || 'open');
    viewport.setAttribute('aria-hidden', 'false');

    const onPick = (value: string): void => {
      // Prefer select's commit path so `change` fires (language URL navigation,
      // theme/surface persistence). Bare `value =` mirrors the IDL setter and
      // syncs the label without notifying — that left the docs lang switch stuck
      // on the English page with only the trigger label updated.
      const options = item.querySelectorAll?.('r-option');
      const option = options
        ? ([...options].find((node) => node.getAttribute('value') === value) as HTMLElement | undefined)
        : undefined;
      const selectLike = item as MenubarItem & {
        selectOptionElement?: (el: HTMLElement, shouldDispatch?: boolean) => void;
      };
      if (option && typeof selectLike.selectOptionElement === 'function') {
        selectLike.selectOptionElement(option, true);
      } else if ('value' in item) {
        item.value = value;
      } else {
        item.setAttribute('value', value);
      }
      // Close after commit.
      window.clearTimeout(leaveTimer);
      closeOthers(null);
      armed = false;
      active = null;
      hideViewport();
    };

    if (!hopping || reduceMotion()) {
      // First open: no content fade — a fade reads as “selected wash arrived late”.
      const layer = buildLayer(harvest, null, onPick);
      clip.replaceChildren(hover, layer);
      fitAndShow(layer, x, y, w, 1, true, () => {
        hoverTarget = null;
        syncHoverToLayer(layer);
      });
      return;
    }

    const enterMotion = direction === 'right' ? 'from-end' : 'from-start';
    const incoming = buildLayer(harvest, enterMotion, onPick);
    // Drop every prior layer before paint — no dual-menu residual.
    for (const stale of [...clip.querySelectorAll<HTMLElement>(`.${VIEWPORT_CLASS}__layer`)]) {
      stale.remove();
    }
    ensureHoverInClip();
    clip.appendChild(incoming);
    void incoming.offsetHeight;
    const nextH = layerContentHeight(incoming) + SHELL_PAD * 2;
    const nextW = Math.max(w, incoming.scrollWidth + SHELL_PAD * 2);
    // Morph shell toward the new trigger (Stripe / Radix viewport travel).
    setShellBox(x, y, nextW, nextH, 1, false);
    hoverTarget = null;
    syncHoverToLayer(incoming);
    // Settle exactly on the trigger — mid-flight travel must not leave a miss.
    // Remeasure height: a tall→short hop (language → theme) must not keep the
    // previous menu’s empty pad under the last row.
    const settle = (): void => {
      const settledH = layerContentHeight(incoming) + SHELL_PAD * 2;
      const settledW = Math.max(nextW, incoming.scrollWidth + SHELL_PAD * 2);
      setShellBox(x, y, settledW, settledH, 1, true);
      hoverTarget = null;
      syncHoverToLayer(incoming);
    };
    const onEnd = (event: TransitionEvent): void => {
      if (event.target !== shell) return;
      if (event.propertyName !== 'transform' && event.propertyName !== 'width' && event.propertyName !== 'height') {
        return;
      }
      shell.removeEventListener('transitionend', onEnd);
      settle();
    };
    shell.addEventListener('transitionend', onEnd);
    window.clearTimeout(hoverSettleTimer);
    hoverSettleTimer = window.setTimeout(() => {
      shell.removeEventListener('transitionend', onEnd);
      settle();
    }, duration + 50);
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
    // One frame so select measurePanel can lock px width before harvest.
    // A second rAF left the shared viewport empty after the native portal was
    // already suppressed — that gap reads as a late wash / blank menu.
    requestAnimationFrame(() => tryHarvest(0));
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
    // First open: leave the native portal visible until harvest swaps in the
    // shared viewport (suppressing first left a blank gap). Peer hops: keep
    // suppression so two native panels do not stack during the morph.
    if (hopping) document.documentElement.setAttribute(VIEWPORT_ATTR, direction || 'pending');
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
  // Sliding wash follows the pointer inside the rebuilt option list.
  shell.addEventListener('pointerover', (event: PointerEvent) => {
    const option = (event.target as Element | null)?.closest?.<HTMLElement>(`.${VIEWPORT_CLASS}__option`);
    if (!option || option.closest('[data-leaving]') || option === hoverTarget) return;
    placeHover(option);
  });
  shell.addEventListener('focusin', (event: FocusEvent) => {
    const option = (event.target as Element | null)?.closest?.<HTMLElement>(`.${VIEWPORT_CLASS}__option`);
    if (!option || option.closest('[data-leaving]')) return;
    placeHover(option);
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
