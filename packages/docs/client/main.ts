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
import '../styles/studio.css';
import { mountOfflineCache } from './offline.ts';
import { mountCodeGroups } from './code-groups.ts';
import { mountOutline } from './outline.ts';
import { mountSearch } from './search.ts';
import { mountDemos } from './home.ts';
import { mountNavigation, mountCodeCopy } from './interactions.ts';

// Registers every `<r-*>` the pages use. The demos are already in the markup as inert
// custom elements; this is what upgrades them.
import('ranui').then(() => {
  /*
   * `@ranui/preview` bundles pdf.js — 1.33 MB, which is over half of everything a page
   * downloads. It defines `<r-preview>`, which appears on a handful of pages out of
   * 1,393. Loading it unconditionally (as the VitePress theme also did) charged every
   * reader for a component almost none of them would see.
   */
  if (document.querySelector('r-preview')) void import('@ranui/preview');
});

mountCodeGroups();

mountOutline();

mountSearch();
mountDemos();

mountNavigation();
mountCodeCopy();

mountOfflineCache();
