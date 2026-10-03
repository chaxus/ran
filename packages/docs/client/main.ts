/**
 * The documentation site's client bundle.
 *
 * Small on purpose. Navigation, sidebar, outline, language menu and the mobile drawer
 * are all server-rendered HTML and CSS — a documentation site that needs script to show
 * its navigation shows nothing to a crawler, and nothing to a reader on a failed request.
 * What is here genuinely cannot be done without it.
 */
import '../styles/docs.css';
import '../styles/home.css';
import '../styles/demos.css';
import 'ranui/style';
import { mountOfflineCache } from './offline.ts';
import { mountComponents } from './components.ts';
import { mountCodeGroups } from './code-groups.ts';
import { mountSearch } from './search.ts';
import { mountDemos } from './home.ts';
import { mountNavigation, mountCodeCopy } from './interactions.ts';

mountComponents();

mountCodeGroups();

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

mountSearch();
mountDemos();

mountNavigation();
mountCodeCopy();

mountOfflineCache();
