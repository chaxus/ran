/** Saved here on leaving a page; read by the inline `SIDEBAR_SCROLL` in build/common. */
export const SIDEBAR_SCROLL_KEY = 'ran-sidebar-scroll';

/**
 * One hover fill that slides between sidebar links, instead of each link lighting up on its
 * own, and the sidebar's scroll position carried to the next page.
 *
 * The fill follows the pointer and keyboard focus and fades out when both leave. It does not
 * rest on the current page: that row is marked by the rail, and selection must not look like
 * hover (see the `.sb__link[aria-current]` rule in docs.css).
 */
export const mountSidebar = (): void => {
  const sidebar = document.querySelector<HTMLElement>('.sidebar');
  if (!sidebar) return;
  const first = sidebar.querySelector('.sb__link')?.getAttribute('href');
  if (first) {
    // Read back by the inline `SIDEBAR_SCROLL` on the next page, before it paints.
    let anchor: { href: string; offset: number } | undefined;
    const save = (): void => {
      try {
        sessionStorage.setItem(
          SIDEBAR_SCROLL_KEY,
          JSON.stringify({ sidebar: first, top: sidebar.scrollTop, ...anchor }),
        );
      } catch {
        // Storage blocked: the next page falls back to showing its own link.
      }
    };
    sidebar.addEventListener('click', (event) => {
      const link = (event.target as Element).closest?.<HTMLElement>('.sb__link');
      if (!link) return;
      const offset = link.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
      anchor = { href: link.getAttribute('href') ?? '', offset };
      save();
    });
    window.addEventListener('pagehide', save);
  }

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const fill = document.createElement('span');
  fill.className = 'sb__hover';
  fill.setAttribute('aria-hidden', 'true');
  sidebar.prepend(fill);
  sidebar.setAttribute('data-hover-fill', '');

  let current: HTMLElement | null = null;
  const place = (link: HTMLElement): void => {
    const box = link.getBoundingClientRect();
    // Measured from the fill's own untranslated origin rather than from the sidebar's box:
    // scroll offset, border and a right-to-left scrollbar (WebKit puts it on the left) all
    // cancel out. Computed style gives the in-flight transform, so mid-slide works too.
    const shift = new DOMMatrixReadOnly(getComputedStyle(fill).transform);
    const at = fill.getBoundingClientRect();
    const x = box.left - (at.left - shift.e);
    const y = box.top - (at.top - shift.f);
    // Appearing, it fades in where it is; only a fill already showing slides.
    fill.toggleAttribute('data-instant', current === null);
    fill.style.transform = `translate(${x}px, ${y}px)`;
    fill.style.width = `${box.width}px`;
    fill.style.height = `${box.height}px`;
    fill.style.opacity = '1';
    current = link;
  };
  const hide = (): void => {
    fill.style.opacity = '0';
    current = null;
  };

  sidebar.addEventListener('pointerover', (event) => {
    const link = (event.target as Element).closest?.<HTMLElement>('.sb__link');
    if (link && link !== current) place(link);
  });
  sidebar.addEventListener('pointerleave', () => {
    // Back to the row the keyboard is on, if any, rather than staying on the last one hovered.
    const focused = sidebar.querySelector<HTMLElement>('.sb__link:focus-visible');
    if (focused) place(focused);
    else hide();
  });
  sidebar.addEventListener('focusin', (event) => {
    const link = event.target;
    if (link instanceof HTMLElement && link.matches('.sb__link:focus-visible')) place(link);
  });
  sidebar.addEventListener('focusout', (event) => {
    if (!sidebar.contains(event.relatedTarget as Node | null) && !sidebar.matches(':hover')) hide();
  });
  // Opening or closing a group moves every row below it (`toggle` does not bubble), and a
  // resize or a font-size change can rewrap the labels.
  const replace = (): void => {
    if (current) place(current);
  };
  sidebar.addEventListener('toggle', replace, true);
  window.addEventListener('resize', replace);
};
