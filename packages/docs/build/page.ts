/**
 * The documentation page document.
 *
 * Everything that is not the article itself — the top nav, the sidebar, the outline,
 * previous/next — is rendered here, server-side, as plain HTML. The mobile drawer is a
 * checkbox and a label. Language / theme / surface are `r-select` chrome (same menu
 * recipe); CSS FOUC plates reserve their footprint until the client upgrades them.
 * Closed DSD SSR was tried and reverted — attachShadow rebuilds wipe first paint and
 * flash harder. Product links stay plain HTML.
 */
import type { Assets } from 'ranpress';
import { LOCALES, SITE } from './config.ts';
import {
  BD_ANALYSE,
  GOOGLE_ANALYSE,
  GTAG,
  OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  PREVIEW_CODE,
  SERVICE_WORK,
  SET_FONT_SIZE,
  SIDEBAR_SCROLL,
  SPECULATION_RULES,
} from './common/index.ts';
import type { LocaleDef } from './config.ts';
import type { DocPage } from './content.ts';
import { navFor, prevNextFor, secondaryNavFor, sidebarFor } from './nav.ts';
import type { NavLink } from './nav.ts';
import { pageUrl } from './urls.ts';
import { pageTitle } from './seo.ts';
import type { SidebarItem } from './nav.ts';
import { messagesFor } from './langs/index.ts';
import { interactionCopy } from '../client/copy.ts';

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Trailing slashes are inconsistent in the structure; compare without one. */
const samePath = (a: string, b: string): boolean => a.replace(/\/$/, '') === b.replace(/\/$/, '');

const sidebarHtml = (items: SidebarItem[], url: string, depth = 0): string => {
  if (!items.length) return '';
  const lis = items
    .map((item) => {
      const active = item.link ? samePath(item.link, url) : false;
      const children = item.items?.length ? sidebarHtml(item.items, url, depth + 1) : '';
      // A group whose own link is the page a reader is on must never start collapsed,
      // and neither must one holding it — otherwise the sidebar opens with the current
      // page hidden, which reads as the page not being in the navigation at all.
      const holdsCurrent = active || (children.includes('aria-current="page"') ?? false);
      const collapsed = item.collapsed === true && !holdsCurrent;
      // The rail marks the current page on a group's line. A top-level row has no line to
      // mark, and the rail would sit left of the sidebar's edge, clipped by its scrolling
      // box, until a view transition lifted it out and flashed it; there, weight alone marks it.
      const rail = active && depth > 0 ? '<span class="sb__rail" aria-hidden="true"></span>' : '';
      const label = item.link
        ? `<a class="sb__link" href="${escapeHtml(item.link)}"${active ? ' aria-current="page"' : ''}>${rail}${escapeHtml(item.text)}</a>`
        : `<span class="sb__label">${escapeHtml(item.text)}</span>`;
      if (!children) return `<li class="sb__item">${label}</li>`;
      // An untitled group only gathers its rows, at its own depth; a summary with no label would
      // be an invisible toggle that hides them all.
      if (!item.text) return `<li class="sb__item">${sidebarHtml(item.items!, url, depth)}</li>`;
      return (
        `<li class="sb__item sb__item--group"${collapsed ? ' data-collapsed' : ''}>` +
        `<details class="sb__details"${collapsed ? '' : ' open'}>` +
        `<summary class="sb__summary">${label}</summary>${children}</details></li>`
      );
    })
    .join('');
  return `<ul class="sb__list sb__list--d${depth}">${lis}</ul>`;
};

const tocHtml = (page: DocPage, label: string): string => {
  const entries = page.toc.filter((entry) => entry.level === 2 || entry.level === 3);
  if (entries.length < 2) return '';
  const items = entries
    .map(
      (entry) =>
        `<li class="toc__item toc__item--h${entry.level}">` +
        `<a class="toc__link" href="#${encodeURIComponent(entry.slug)}">${escapeHtml(entry.text)}</a></li>`,
    )
    .join('');
  return `<aside class="toc"><p class="toc__label">${escapeHtml(label)}</p><ul class="toc__list">${items}</ul></aside>`;
};

/**
 * Header language control: the same r-select chrome recipe as theme/surface.
 * Option values are locale URLs; the client navigates on change.
 *
 * Only locales that actually ship this page appear. A switcher that offers a language
 * and then 404s is worse than one that offers fewer.
 */
const langMenuHtml = (page: DocPage, urls: ReadonlySet<string>, label: string): string => {
  // The not-found page has no counterparts, but the header must not lose a control there:
  // each language leads to its own home instead.
  const urlIn = (dir: string): string =>
    page.kind === 'notfound' ? (dir ? `/${dir}/` : '/') : pageUrl(page.baseRel, dir);
  const options = LOCALES.filter((locale) => page.kind === 'notfound' || urls.has(urlIn(locale.dir)));
  if (options.length < 2) return '';
  const current = urlIn(page.locale.dir);
  const items = options
    .map(
      (locale) =>
        `<r-option value="${escapeHtml(urlIn(locale.dir))}" lang="${escapeHtml(locale.lang)}">${escapeHtml(
          locale.label,
        )}</r-option>`,
    )
    .join('');
  // Same r-select chrome as theme/surface so header menus share hover + FLIP handoff.
  // Option values are locale URLs; the client navigates on change.
  return (
    `<r-select class="lang-switch" value="${escapeHtml(current)}" aria-label="${escapeHtml(label)}"` +
    ` dropdownclass="ran-chrome-menu">${items}</r-select>`
  );
};

export interface RenderDocOptions {
  page: DocPage;
  head: string[];
  assets: Assets;
  urls: ReadonlySet<string>;
}

export const renderDoc = ({ page, head, assets, urls }: RenderDocOptions): string => {
  const { ui, labels } = messagesFor(page.locale as LocaleDef);
  const feedback = interactionCopy(page.locale.lang);
  const title = pageTitle(page);
  const nav = navFor(page.locale);
  const sidebar = sidebarFor(page.url, page.locale);
  const { prev, next } = prevNextFor(page.url, sidebar);

  const linksHtml = (items: NavLink[], className: string): string =>
    items
      .map((item) => {
        const active = item.activeMatch ? new RegExp(item.activeMatch).test(page.url) : samePath(item.link, page.url);
        return (
          `<a class="${className}" href="${escapeHtml(item.link)}"${active ? ' aria-current="page"' : ''}` +
          `${item.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(item.text)}</a>`
        );
      })
      .join('');
  const navHtml = linksHtml(nav, 'nav__link');
  const secondary = secondaryNavFor(page.locale);

  const footerNav =
    prev || next
      ? `<nav class="pager" aria-label="${escapeHtml(ui.prevPage)} / ${escapeHtml(ui.nextPage)}">` +
        (prev
          ? `<a class="pager__link pager__link--prev" href="${escapeHtml(prev.link)}"><span class="pager__dir">${escapeHtml(ui.prevPage)}</span><span class="pager__text">${escapeHtml(prev.text)}</span></a>`
          : '<span></span>') +
        (next
          ? `<a class="pager__link pager__link--next" href="${escapeHtml(next.link)}"><span class="pager__dir">${escapeHtml(ui.nextPage)}</span><span class="pager__text">${escapeHtml(next.text)}</span></a>`
          : '<span></span>') +
        `</nav>`
      : '';

  const sb = sidebarHtml(sidebar, page.url);

  return `<!doctype html>
<html lang="${page.locale.lang}"${page.locale.rtl ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(page.description)}">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0d10">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.json">
<link rel="preload" href="/fonts/geist-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/geist-mono-variable.woff2" as="font" type="font/woff2" crossorigin>
<meta name="robots" content="all">
<meta name="google" content="notranslate">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="${OG_IMAGE_WIDTH}">
<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}">
<meta property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<link rel="alternate" type="text/markdown" href="/llms.txt" title="llms.txt">
<link rel="alternate" type="text/plain" href="/llms-full.txt" title="llms-full.txt">
<script>${THEME_BOOTSTRAP}</script>
<script>${SET_FONT_SIZE}</script>
<script>${PREVIEW_CODE}</script>
<script async src="${GTAG}"></script>
<script>${GOOGLE_ANALYSE}</script>
<script>${BD_ANALYSE}</script>
<script>${SERVICE_WORK}</script>
<script type="speculationrules">${SPECULATION_RULES}</script>
${head.join('\n')}
${assets.css.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}
</head>
<body${sb ? ' class="has-sidebar"' : ''}>
<a class="skip" href="#main">${escapeHtml(feedback.skip)}</a>
<header class="site-header">
  <div class="site-header__inner">
    <input type="checkbox" id="drawer" class="drawer__toggle" aria-controls="doc-sidebar" aria-label="${escapeHtml(ui.sidebarMenu)}"><label class="drawer__button" for="drawer" aria-controls="doc-sidebar" aria-label="${escapeHtml(ui.sidebarMenu)}"><span></span><span></span><span></span></label>
    <div class="header-primary">
      <a class="wordmark" href="${escapeHtml(page.locale.dir ? `/${page.locale.dir}/` : '/')}">${escapeHtml(SITE.name)}</a>
      <nav class="nav" aria-label="${escapeHtml(ui.sidebarMenu)}">${navHtml}</nav>
    </div>
    <div class="header-tools">
      <button class="search-open" type="button" aria-label="${escapeHtml(ui.searchButton)}">
        <svg class="search-open__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.25"/><path d="m15.8 15.8 4.2 4.2"/></svg>
        <span class="search-open__text">${escapeHtml(ui.searchButton)}</span>
        <kbd class="search-open__kbd">/</kbd>
      </button>
      <r-menubar class="header-utils" lang="${escapeHtml(page.locale.lang)}">
        ${langMenuHtml(page, urls, ui.langMenu)}
        <div class="appearance" role="group" aria-label="${escapeHtml(ui.appearance)}">
          <r-theme-switch class="theme-switch" lang="${escapeHtml(page.locale.lang)}"></r-theme-switch>
          <r-surface-switch class="surface-switch" lang="${escapeHtml(page.locale.lang)}"></r-surface-switch>
        </div>
      </r-menubar>
      <!-- Trailing outbound jump: after in-page chrome, last in the tools row. -->
      <a class="header-github" href="${escapeHtml(SITE.github)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(labels.github)}">
        <svg class="header-github__icon" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>
        <span class="header-github__text">${escapeHtml(labels.github)}</span>
      </a>
    </div>
  </div>
</header>
<div class="layout">
<label class="drawer__scrim" for="drawer"></label><nav id="doc-sidebar" class="sidebar${sb ? '' : ' sidebar--mobile-only'}" aria-label="${escapeHtml(ui.sidebarMenu)}"><div class="mobile-nav">${navHtml}<div class="mobile-nav__secondary">${linksHtml(secondary, 'nav__link')}</div></div>${sb}</nav>${sb ? `<script>${SIDEBAR_SCROLL}</script>` : ''}
<main id="main" class="doc">
${tocHtml(page, ui.outline) ? `<details class="mobile-toc"><summary>${escapeHtml(ui.outline)}</summary>${tocHtml(page, ui.outline).replace(/<aside[^>]*>|<\/aside>|<p[^>]*>.*?<\/p>/g, '')}</details>` : ''}
<${page.url === '/' || /^\/[a-z]{2}(-[A-Z]{2})?\/$/.test(page.url) ? 'div class="landing"' : 'article class="prose"'}>${page.html}</${page.url === '/' || /^\/[a-z]{2}(-[A-Z]{2})?\/$/.test(page.url) ? 'div' : 'article'}>
${footerNav}
<footer class="site-footer">${linksHtml(secondary, 'site-footer__link')}<a class="site-footer__link" href="${page.locale.dir === 'cn' ? SITE.authorUrlCn : SITE.authorUrl}" rel="author">${escapeHtml(ui.authorLink)}</a></footer>
</main>
${tocHtml(page, ui.outline)}
</div>
<dialog id="search-dialog" class="search" aria-label="${escapeHtml(ui.searchButton)}">
  <form class="search__form" method="dialog" onsubmit="return false">
    <input id="search-input" class="search__input" type="search" autocomplete="off" spellcheck="false"
           placeholder="${escapeHtml(ui.searchPlaceholder)}" aria-label="${escapeHtml(ui.searchButton)}" role="combobox" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list">
    <button class="search__close" type="button" value="close" aria-label="${escapeHtml(ui.closeKey)}">esc</button>
  </form>
  <p id="search-status" class="search__status" role="status" aria-live="polite" data-error="${escapeHtml(feedback.error)}" data-loading="${escapeHtml(feedback.loading)}" data-empty="${escapeHtml(ui.noResults)}"></p>
  <button class="search__retry" type="button" hidden>${escapeHtml(feedback.retry)}</button>
  <ul id="search-results" class="search__results" role="listbox" aria-label="${escapeHtml(ui.searchButton)}"></ul>
</dialog>
${assets.js.map((src) => `<script type="module" src="${src}"></script>`).join('\n')}
</body>
</html>
`;
};

/**
 * Applies the stored theme before first paint.
 *
 * The client bundle is a module script and therefore deferred; by the time it stamps
 * `data-ran-theme` the browser has already painted a frame in the other theme. On a
 * documentation site that is a white flash on every single navigation. Writes nothing
 * for "system", leaving `prefers-color-scheme` in charge.
 */
/*
 * Runs before first paint: restores the stored theme, and marks that script is running
 * at all.
 *
 * The `js` class is what lets CSS hide something it expects script to bring back. A
 * scroll-reveal that sets `opacity: 0` unconditionally is a bet that the observer will
 * always run; when it does not, the content below the fold is simply gone, and a reader
 * with JavaScript disabled has no way to know there was anything there.
 */
const THEME_BOOTSTRAP = `(function(){try{
document.documentElement.classList.add('js');
var e=document.documentElement;
var t=localStorage.getItem('ran-theme');
if(t==='dark'||t==='light'){e.setAttribute('data-ran-theme',t);e.setAttribute('theme',t);}
if(localStorage.getItem('ran-surface')==='glass')e.setAttribute('data-ran-surface','glass');
}catch(e){}})();`;
