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
  window.addEventListener('resize', () => {
    if (current) place(current);
  });
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
};
