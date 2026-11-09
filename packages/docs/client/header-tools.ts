/**
 * One hover fill that slides between sibling controls, matching the sidebar's soft
 * pill motion instead of each control flashing on its own.
 *
 * Header language, theme and surface are all `r-select` chrome (`ran-chrome-menu`).
 * Language options are locale URLs (navigate on change); theme/surface persist values.
 */
const mountHoverFill = (root: HTMLElement, targetSelector: string): void => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const fill = document.createElement('span');
  fill.className = 'hu__hover';
  fill.setAttribute('aria-hidden', 'true');
  root.prepend(fill);
  root.setAttribute('data-hover-fill', '');

  const targetOf = (node: EventTarget | null): HTMLElement | null => {
    const el = node instanceof Element ? node : null;
    return el?.closest?.<HTMLElement>(targetSelector) ?? null;
  };

  let current: HTMLElement | null = null;
  const place = (item: HTMLElement): void => {
    const box = item.getBoundingClientRect();
    const shift = new DOMMatrixReadOnly(getComputedStyle(fill).transform);
    const at = fill.getBoundingClientRect();
    const x = box.left - (at.left - shift.e);
    const y = box.top - (at.top - shift.f);
    fill.toggleAttribute('data-instant', current === null);
    fill.style.transform = `translate(${x}px, ${y}px)`;
    fill.style.width = `${box.width}px`;
    fill.style.height = `${box.height}px`;
    fill.style.opacity = '1';
    current = item;
  };
  const hide = (): void => {
    fill.style.opacity = '0';
    current = null;
  };

  const focusSelector = targetSelector
    .split(',')
    .map((part) => `${part.trim()}:focus-visible`)
    .join(', ');

  root.addEventListener('pointerover', (event) => {
    const item = targetOf(event.target);
    if (item && item !== current) place(item);
  });
  root.addEventListener('pointerleave', () => {
    const focused = root.querySelector<HTMLElement>(focusSelector);
    if (focused) place(focused);
    else hide();
  });
  root.addEventListener('focusin', (event) => {
    const item = targetOf(event.target);
    if (item?.matches(':focus-visible')) place(item);
  });
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget as Node | null) && !root.matches(':hover')) hide();
  });
  // Drop the wash before the navigation snapshot so a hovered product link is not
  // frozen into the outgoing root capture as a grey pill over the next header.
  root.addEventListener('click', (event) => {
    if (targetOf(event.target)) hide();
  });
  window.addEventListener('resize', () => {
    if (current) place(current);
  });
};

const finePointer = (): boolean => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type ChromeSwitch = HTMLElement & { open: boolean; value?: string };
type ChromeKind = 'lang' | 'theme' | 'surface';

const openChromePanel = (): HTMLElement | null => {
  for (const el of document.querySelectorAll<HTMLElement>('r-dropdown.ran-chrome-menu')) {
    if (getComputedStyle(el).display === 'none') continue;
    if (el.getClientRects().length === 0) continue;
    return el;
  }
  return null;
};

/** Hop duration — keep `data-chrome-switch` this long so enter/exit CSS cannot fight FLIP. */
const CHROME_HANDOFF_MS = 280;
/** Decelerating ease matching `--ran-motion-ease-standard`. */
const CHROME_HANDOFF_EASE = 'cubic-bezier(0.2, 0, 0, 1)';

type ChromePanelHost = HTMLElement & { _shadowDom?: ShadowRoot };

/**
 * Shared-layout handoff (Stripe / GSAP Flip recipe):
 * 1. Snap the incoming host onto the outgoing box *before the next paint*
 *    so the final-size panel never flashes for a frame.
 * 2. Morph position + size on the host.
 * 3. Inverse-scale + fade the painted surface so labels do not stretch.
 */
const flipChromePanel = (from: DOMRect): void => {
  if (reduceMotion()) return;

  const paintedOf = (host: ChromePanelHost): HTMLElement | null =>
    host._shadowDom?.querySelector<HTMLElement>('.ranui-dropdown') ?? null;

  const clearInlineMotion = (host: ChromePanelHost, painted: HTMLElement | null): void => {
    host.style.transform = '';
    host.style.transformOrigin = '';
    host.style.opacity = '';
    if (!painted) return;
    painted.style.transform = '';
    painted.style.transformOrigin = '';
    painted.style.opacity = '';
  };

  const run = (attempt: number): void => {
    const el = openChromePanel() as ChromePanelHost | null;
    if (!el) {
      if (attempt < 8) requestAnimationFrame(() => run(attempt + 1));
      return;
    }
    const to = el.getBoundingClientRect();
    if (to.width < 1 || to.height < 1) {
      if (attempt < 8) {
        requestAnimationFrame(() => run(attempt + 1));
        return;
      }
      // Give up: never leave the hop panel invisible.
      el.style.opacity = '';
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

    // Snap onto the outgoing box in this frame (rAF runs before paint) — no
    // final-position flash. Opacity stays muted until the morph is committed.
    const fromHost = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    const invX = 1 / sx;
    const invY = 1 / sy;
    el.style.transformOrigin = '0 0';
    el.style.transform = fromHost;
    el.style.opacity = '1';
    if (painted) {
      painted.style.transformOrigin = '0 0';
      painted.style.transform = `scale(${invX}, ${invY})`;
      painted.style.opacity = '0.5';
    }

    requestAnimationFrame(() => {
      // Re-check the host still owns the open chrome panel (a faster hop may
      // have replaced it).
      if (openChromePanel() !== el) {
        clearInlineMotion(el, painted);
        return;
      }
      const hostAnim = el.animate(
        [
          { transform: fromHost, opacity: 1, transformOrigin: '0 0' },
          { transform: 'translate(0, 0) scale(1, 1)', opacity: 1, transformOrigin: '0 0' },
        ],
        { duration: CHROME_HANDOFF_MS, easing: CHROME_HANDOFF_EASE, fill: 'none' },
      );
      void hostAnim.finished
        .catch(() => undefined)
        .finally(() => {
          if (openChromePanel() === el) clearInlineMotion(el, painted);
        });

      if (!painted) return;
      const contentAnim = painted.animate(
        [
          { transform: `scale(${invX}, ${invY})`, opacity: 0.5, transformOrigin: '0 0' },
          { transform: 'scale(1, 1)', opacity: 1, transformOrigin: '0 0' },
        ],
        { duration: CHROME_HANDOFF_MS, easing: CHROME_HANDOFF_EASE, fill: 'none' },
      );
      void contentAnim.finished
        .catch(() => undefined)
        .finally(() => {
          if (openChromePanel() === el) {
            painted.style.transform = '';
            painted.style.transformOrigin = '';
            painted.style.opacity = '';
          }
        });
    });
  };

  // First rAF: select has positioned the portal. Snap before that frame paints.
  requestAnimationFrame(() => run(0));
};

/** Locale URLs live in option values — navigate on change (select is not a link menu). */
const wireLangNavigation = (lang: ChromeSwitch): void => {
  lang.addEventListener('change', (event) => {
    const value = (event as CustomEvent<{ value?: string }>).detail?.value || lang.value;
    if (!value) return;
    const next = new URL(value, location.href);
    if (next.pathname === location.pathname && next.search === location.search) return;
    location.assign(next.href);
  });
};

/**
 * Language / theme / surface open on hover and hand off with a FLIP morph so the
 * panel slides with horizontal travel. First open from idle keeps the usual
 * dropdown enter animation. Touch keeps click — but language navigation must
 * still mount when there is no fine pointer (hover arming stays gated).
 */
const mountChromeMenus = (): void => {
  const utils = document.querySelector<HTMLElement>('.header-utils');
  if (!utils) return;

  const wire = (): void => {
    const lang = utils.querySelector('.lang-switch') as ChromeSwitch | null;
    const theme = utils.querySelector('.theme-switch') as ChromeSwitch | null;
    const surface = utils.querySelector('.surface-switch') as ChromeSwitch | null;
    if (!lang && !theme && !surface) return;

    // Always wire locale navigation — touch and keyboard rely on click, not hover.
    if (lang) wireLangNavigation(lang);

    if (!finePointer()) return;

    let armed = false;
    let active: ChromeKind | null = null;
    let leaveTimer: number | undefined;
    let switchTimer: number | undefined;

    const markSwitch = (): void => {
      document.documentElement.setAttribute('data-chrome-switch', '');
      window.clearTimeout(switchTimer);
      // Hold for the full morph so a late enter keyframe cannot flash mid-hop.
      switchTimer = window.setTimeout(() => {
        document.documentElement.removeAttribute('data-chrome-switch');
      }, CHROME_HANDOFF_MS + 40);
    };

    const setOpen = (host: ChromeSwitch | null, open: boolean): void => {
      if (!host || host.open === open) return;
      host.open = open;
    };

    const closePeers = (keep: ChromeKind | null): void => {
      if (keep !== 'lang') setOpen(lang, false);
      if (keep !== 'theme') setOpen(theme, false);
      if (keep !== 'surface') setOpen(surface, false);
    };

    const openWhich = (which: ChromeKind): void => {
      if (which === 'lang') setOpen(lang, true);
      else if (which === 'theme') setOpen(theme, true);
      else setOpen(surface, true);
    };

    const arm = (which: ChromeKind): void => {
      window.clearTimeout(leaveTimer);
      if (active === which && armed) return;
      const hopping = armed && active !== null && active !== which;
      const from = hopping ? (openChromePanel()?.getBoundingClientRect() ?? null) : null;
      if (hopping) markSwitch();
      armed = true;
      active = which;
      closePeers(which);
      openWhich(which);
      if (from) {
        // Hide the incoming host until FLIP snaps it onto `from` — otherwise one
        // paint shows the final box and reads as a blink.
        const incoming = openChromePanel();
        if (incoming) incoming.style.opacity = '0';
        flipChromePanel(from);
      }
    };

    const disarm = (): void => {
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => {
        if (utils.matches(':hover') || document.querySelector('r-dropdown.ran-chrome-menu:hover')) return;
        closePeers(null);
        armed = false;
        active = null;
        document.documentElement.removeAttribute('data-chrome-switch');
      }, 180);
    };

    lang?.addEventListener('pointerenter', () => arm('lang'));
    theme?.addEventListener('pointerenter', () => arm('theme'));
    surface?.addEventListener('pointerenter', () => arm('surface'));

    document.addEventListener('pointerover', (event) => {
      const el = event.target as Element | null;
      if (!el?.closest?.('r-dropdown.ran-chrome-menu')) return;
      window.clearTimeout(leaveTimer);
    });
    document.addEventListener('pointerout', (event) => {
      const el = event.target as Element | null;
      if (!el?.closest?.('r-dropdown.ran-chrome-menu')) return;
      const next = event.relatedTarget as Element | null;
      if (next?.closest?.('r-dropdown.ran-chrome-menu') || (next && utils.contains(next))) return;
      disarm();
    });

    utils.addEventListener('pointerleave', (event) => {
      const next = event.relatedTarget as Element | null;
      if (next?.closest?.('r-dropdown.ran-chrome-menu')) return;
      disarm();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closePeers(null);
      armed = false;
      active = null;
    });
  };

  const ready =
    (!document.querySelector('.lang-switch') || customElements.get('r-select')) &&
    (!document.querySelector('.theme-switch') || customElements.get('r-theme-switch')) &&
    (!document.querySelector('.surface-switch') || customElements.get('r-surface-switch'));

  if (ready) wire();
  else {
    void Promise.all([
      customElements.whenDefined('r-select'),
      customElements.whenDefined('r-theme-switch'),
      customElements.whenDefined('r-surface-switch'),
    ]).then(wire);
  }
};

/** Primary nav (wordmark + product links) and trailing tools share the same motion. */
export const mountHeaderTools = (): void => {
  const primary = document.querySelector<HTMLElement>('.header-primary');
  if (primary) mountHoverFill(primary, '.wordmark, .nav__link');

  const tools = document.querySelector<HTMLElement>('.header-tools');
  if (tools) mountHoverFill(tools, '.search-open, .header-github, .lang-switch, .theme-switch, .surface-switch');

  mountChromeMenus();
};
