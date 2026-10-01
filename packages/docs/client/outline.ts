/** Keep the desktop and mobile outlines in sync, including fast scrolls and hash jumps. */
export const mountOutline = (): (() => void) => {
  const headings = [...document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id]')];
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.toc__link')];
  if (!headings.length || !links.length) return () => {};
  let current: string | undefined;
  let pending = false;
  let disposed = false;
  const update = (): void => {
    pending = false;
    if (disposed) return;
    const edge = (document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 60) + 24;
    // Heading order follows document order. Read only O(log n) rectangles per frame,
    // even for long API pages; positions remain correct when demos change their height.
    let low = 0;
    let high = headings.length;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if (headings[middle].getBoundingClientRect().top <= edge) low = middle + 1;
      else high = middle;
    }
    const id = headings[low - 1]?.id;
    if (id === current) return;
    current = id;
    for (const link of links) {
      let active = false;
      try {
        active = decodeURIComponent(link.hash.slice(1)) === id;
      } catch {
        /* Ignore malformed anchors. */
      }
      link.toggleAttribute('data-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const schedule = (): void => {
    if (pending || disposed) return;
    pending = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
  const article = document.querySelector('.prose');
  if (article) observer?.observe(article);
  update();
  return () => {
    disposed = true;
    observer?.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('hashchange', schedule);
  };
};
