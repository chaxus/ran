/**
 * The documentation site's client bundle.
 *
 * Small on purpose. Navigation, sidebar, outline, language menu and the mobile drawer
 * are all server-rendered HTML and CSS — a documentation site that needs script to show
 * its navigation shows nothing to a crawler, and nothing to a reader on a failed request.
 * What is here genuinely cannot be done without it.
 */
import '../styles/docs.css';
import 'ranui/style';

// Registers every `<r-*>` the pages use. The demos are already in the markup as inert
// custom elements; this is what upgrades them.
import('ranui').then(() => {
  // Split out of the main package; the doc-preview demo needs it.
  void import('@ranui/preview');
});

/**
 * Code-group tabs. The panes are all in the markup — one is visible and the rest carry
 * `hidden` — so with no script a reader still gets the first example rather than a row
 * of dead buttons and no code.
 */
document.addEventListener('click', (event) => {
  const tab = (event.target as Element | null)?.closest?.('.code-group__tab');
  if (!(tab instanceof HTMLButtonElement)) return;
  const group = tab.closest('.code-group');
  if (!group) return;
  const index = Number(tab.dataset.index ?? 0);
  for (const [i, button] of [...group.querySelectorAll('.code-group__tab')].entries()) {
    button.setAttribute('aria-selected', String(i === index));
  }
  for (const [i, pane] of [...group.querySelectorAll('.code-group__pane')].entries()) {
    pane.toggleAttribute('hidden', i !== index);
  }
});

/**
 * Mark the outline entry for whatever section is on screen.
 *
 * `IntersectionObserver` rather than a scroll handler: the callback only fires when a
 * heading actually crosses the line, instead of on every frame of every scroll.
 */
const headings = [...document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id]')];
const links = new Map<string, HTMLAnchorElement>();
for (const link of document.querySelectorAll<HTMLAnchorElement>('.toc__link')) {
  links.set(decodeURIComponent(link.hash.slice(1)), link);
}
if (headings.length && links.size) {
  let current: HTMLAnchorElement | undefined;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const link = links.get(entry.target.id);
        if (!link || link === current) continue;
        current?.removeAttribute('data-active');
        link.setAttribute('data-active', '');
        current = link;
      }
    },
    // A band just under the sticky header: a heading counts as "current" once it reaches
    // the top of the reading area, not when it first appears at the bottom.
    { rootMargin: '-72px 0px -70% 0px' },
  );
  for (const heading of headings) observer.observe(heading);
}

/** Close the mobile drawer after following a link, or it covers the page just opened. */
document.querySelector('.sidebar')?.addEventListener('click', (event) => {
  if (!(event.target as Element | null)?.closest?.('a')) return;
  const toggle = document.querySelector<HTMLInputElement>('#drawer');
  if (toggle) toggle.checked = false;
});
