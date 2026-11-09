/**
 * One hover fill that slides between sibling controls, matching the sidebar's soft
 * pill motion instead of each control flashing on its own.
 *
 * Header language stays `<details>` + `<a>` (options are locale URLs). Theme and
 * surface stay `r-select` (persisted values). Under glass, r-select owns the same
 * sliding-wash recipe inside its portaled panel — this helper is for in-flow chrome
 * and the language list, not a second select implementation.
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

type ChromeSwitch = HTMLElement & { open: boolean };

/**
 * Language / theme / surface open on hover and hand off without a close→open blink.
 * A first open from idle keeps the usual scale+fade; peer hops set `data-chrome-switch`
 * so exit/enter animations are skipped for one frame. Touch keeps click / details.
 */
const mountChromeMenus = (): void => {
  const utils = document.querySelector<HTMLElement>('.header-utils');
  const langs = document.querySelector<HTMLDetailsElement>('details.langs');
  if (!utils || !finePointer()) return;

  const summary = langs?.querySelector<HTMLElement>('.langs__summary');

  const wire = (): void => {
    const theme = utils.querySelector('.theme-switch') as ChromeSwitch | null;
    const surface = utils.querySelector('.surface-switch') as ChromeSwitch | null;
    if (!theme && !surface && !langs) return;

    let armed = false;
    let leaveTimer: number | undefined;
    let switchTimer: number | undefined;

    const markSwitch = (): void => {
      document.documentElement.setAttribute('data-chrome-switch', '');
      window.clearTimeout(switchTimer);
      switchTimer = window.setTimeout(() => {
        document.documentElement.removeAttribute('data-chrome-switch');
      }, 80);
    };

    const setLangsOpen = (open: boolean): void => {
      if (!langs || langs.open === open) return;
      langs.open = open;
    };

    const setSwitchOpen = (host: ChromeSwitch | null, open: boolean): void => {
      if (!host || host.open === open) return;
      host.open = open;
    };

    const closePeers = (keep: 'langs' | 'theme' | 'surface' | null): void => {
      if (keep !== 'langs') setLangsOpen(false);
      if (keep !== 'theme') setSwitchOpen(theme, false);
      if (keep !== 'surface') setSwitchOpen(surface, false);
    };

    const arm = (which: 'langs' | 'theme' | 'surface'): void => {
      window.clearTimeout(leaveTimer);
      if (armed) markSwitch();
      armed = true;
      // Drive open via the switch `open` API (inner select stays click for touch/keyboard).
      closePeers(which);
      if (which === 'langs') setLangsOpen(true);
      else if (which === 'theme') setSwitchOpen(theme, true);
      else setSwitchOpen(surface, true);
    };

    const disarm = (): void => {
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => {
        // Portaled panels sit under <body>; relatedTarget is often null on synthetic
        // hovers, so re-check whether the pointer still covers utils or a chrome menu.
        if (utils.matches(':hover') || document.querySelector('r-dropdown.ran-chrome-menu:hover')) return;
        closePeers(null);
        armed = false;
        document.documentElement.removeAttribute('data-chrome-switch');
      }, 180);
    };

    langs?.addEventListener('pointerenter', () => arm('langs'));
    theme?.addEventListener('pointerenter', () => arm('theme'));
    surface?.addEventListener('pointerenter', () => arm('surface'));

    // Portaled select panels live under <body>; keep the cluster armed while the pointer
    // is on an open chrome menu, and cancel a pending leave when re-entering it.
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

    // Hover owns open/close; a summary click must not toggle the panel shut mid-hover.
    summary?.addEventListener('click', (event) => {
      if (!finePointer()) return;
      event.preventDefault();
      arm('langs');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closePeers(null);
      armed = false;
    });
  };

  // Switches use a closed shadow tree; wire once the `open` API exists. Prefer sync
  // when already upgraded so the first hover after `whenDefined` is not a missed microtask.
  if (customElements.get('r-theme-switch') && customElements.get('r-surface-switch')) wire();
  else {
    void Promise.all([
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
  if (tools) mountHoverFill(tools, '.search-open, .langs__summary, .theme-switch, .surface-switch');

  /* Language panel: URL links keep details; wash matches glass r-select rows. */
  const langsList = document.querySelector<HTMLElement>('.langs__list');
  if (langsList) mountHoverFill(langsList, '.langs__link');

  mountChromeMenus();
};
