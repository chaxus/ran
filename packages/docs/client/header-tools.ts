/**
 * One hover fill that slides between sibling controls in a row (header tools,
 * primary nav) — same recipe as `.sb__hover`, not a per-control background flash.
 *
 * Two layers, two owners (do not collapse them):
 * - Trigger row: this helper. Targets must list every peer in the row.
 * - Open menu rows: `<r-menubar>` / `r-select` glass wash inside the panel.
 * Incomplete trigger targets caused the "wash stuck on Search" bug; "clear when
 * leaving a target" patches made gaps flash. Keep the target list complete.
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

  // Stay on the last target across gaps; only leave the root (or focus) hides.
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

type ChromeSwitch = HTMLElement & { open: boolean; value?: string };

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
 * Language change still navigates on every pointer type. Hover open + peer handoff
 * between language / theme / surface is owned by `<r-menubar>` in the library.
 */
const mountChromeMenus = (): void => {
  const utils = document.querySelector<HTMLElement>('.header-utils');
  if (!utils) return;

  const wire = (): void => {
    const lang = utils.querySelector('.lang-switch') as ChromeSwitch | null;
    if (lang) wireLangNavigation(lang);
  };

  if (!document.querySelector('.lang-switch') || customElements.get('r-select')) wire();
  else void customElements.whenDefined('r-select').then(wire);
};

/** Primary nav (wordmark + product links) and trailing tools share the same motion. */
export const mountHeaderTools = (): void => {
  const primary = document.querySelector<HTMLElement>('.header-primary');
  if (primary) mountHoverFill(primary, '.wordmark, .nav__link');

  const tools = document.querySelector<HTMLElement>('.header-tools');
  // Full peer list — selects stay triggers for this wash; menubar only owns the panel.
  if (tools) {
    mountHoverFill(tools, '.search-open, .lang-switch, .theme-switch, .surface-switch, .header-github');
  }

  mountChromeMenus();
};
