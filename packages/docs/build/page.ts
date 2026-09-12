/**
 * The documentation page document.
 *
 * Everything that is not the article itself — the top nav, the sidebar, the outline,
 * previous/next, the language menu — is rendered here, server-side, as plain HTML. The
 * mobile drawer is a checkbox and a label; the only thing the client bundle adds is the
 * theme switch and the code-group tabs. A documentation site that needs JavaScript to
 * show its navigation is a documentation site that shows nothing to a crawler.
 */
import type { Assets } from 'ssg';
import { LOCALES, SITE } from './config.ts';
import type { LocaleDef } from './config.ts';
import type { DocPage } from './content.ts';
import { navFor, prevNextFor, sidebarFor } from './nav.ts';
import type { SidebarItem } from './nav.ts';
import { messagesFor } from '../.vitepress/langs/index.ts';

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
      const label = item.link
        ? `<a class="sb__link" href="${escapeHtml(item.link)}"${active ? ' aria-current="page"' : ''}>${escapeHtml(item.text)}</a>`
        : `<span class="sb__label">${escapeHtml(item.text)}</span>`;
      if (!children) return `<li class="sb__item">${label}</li>`;
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
 * The language menu, rendered as links rather than a script-driven dropdown.
 *
 * Only locales that actually ship this page appear. A switcher that offers a language
 * and then 404s is worse than one that offers fewer.
 */
const langMenuHtml = (page: DocPage, urls: ReadonlySet<string>, label: string): string => {
  const stem = page.baseRel.replace(/\.md$/, '');
  const urlIn = (dir: string): string => {
    const prefix = dir ? `/${dir}` : '';
    if (stem === 'index') return `${prefix}/`;
    if (stem.endsWith('/index')) return `${prefix}/${stem.slice(0, -'index'.length)}`;
    return `${prefix}/${stem}`;
  };
  const options = LOCALES.filter((locale) => urls.has(urlIn(locale.dir)));
  if (options.length < 2) return '';
  const items = options
    .map(
      (locale) =>
        `<li><a class="langs__link" href="${escapeHtml(urlIn(locale.dir))}" lang="${locale.lang}"${
          locale.dir === page.locale.dir ? ' aria-current="true"' : ''
        }>${escapeHtml(locale.label)}</a></li>`,
    )
    .join('');
  return (
    `<details class="langs"><summary class="langs__summary" aria-label="${escapeHtml(label)}">` +
    `${escapeHtml(page.locale.label)}</summary><ul class="langs__list">${items}</ul></details>`
  );
};

export interface RenderDocOptions {
  page: DocPage;
  head: string[];
  assets: Assets;
  urls: ReadonlySet<string>;
}

export const renderDoc = ({ page, head, assets, urls }: RenderDocOptions): string => {
  const { ui } = messagesFor(page.locale as LocaleDef);
  const title = page.url === '/' ? SITE.name : `${page.title} | ${SITE.name}`;
  const nav = navFor(page.locale);
  const sidebar = sidebarFor(page.url, page.locale);
  const { prev, next } = prevNextFor(page.url, sidebar);

  const navHtml = nav
    .map((item) => {
      const active = item.activeMatch ? new RegExp(item.activeMatch).test(page.url) : samePath(item.link, page.url);
      return (
        `<a class="nav__link" href="${escapeHtml(item.link)}"${active ? ' aria-current="page"' : ''}` +
        `${item.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(item.text)}</a>`
      );
    })
    .join('');

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
<script>${THEME_BOOTSTRAP}</script>
${head.join('\n')}
${assets.css.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}
</head>
<body${sb ? ' class="has-sidebar"' : ''}>
<a class="skip" href="#main">${escapeHtml(ui.returnToTop)}</a>
<header class="site-header">
  <div class="site-header__inner">
    ${sb ? `<input type="checkbox" id="drawer" class="drawer__toggle" hidden><label class="drawer__button" for="drawer" aria-label="${escapeHtml(ui.sidebarMenu)}"><span></span><span></span><span></span></label>` : ''}
    <a class="wordmark" href="${escapeHtml(page.locale.dir ? `/${page.locale.dir}/` : '/')}">${escapeHtml(SITE.name)}</a>
    <nav class="nav" aria-label="${escapeHtml(ui.sidebarMenu)}">${navHtml}</nav>
    <button class="search-open" type="button" aria-label="${escapeHtml(ui.searchButton)}">
      <span class="search-open__text">${escapeHtml(ui.searchButton)}</span>
      <kbd class="search-open__kbd">/</kbd>
    </button>
    ${langMenuHtml(page, urls, ui.langMenu)}
    <r-theme-switch class="theme-switch"></r-theme-switch>
  </div>
</header>
<div class="layout">
${sb ? `<label class="drawer__scrim" for="drawer"></label><nav class="sidebar" aria-label="${escapeHtml(ui.sidebarMenu)}">${sb}</nav>` : ''}
<main id="main" class="doc">
<${page.url === '/' || /^\/[a-z]{2}(-[A-Z]{2})?\/$/.test(page.url) ? 'div class="landing"' : 'article class="prose"'}>${page.html}</${page.url === '/' || /^\/[a-z]{2}(-[A-Z]{2})?\/$/.test(page.url) ? 'div' : 'article'}>
${footerNav}
</main>
${tocHtml(page, ui.outline)}
</div>
<dialog id="search-dialog" class="search" aria-label="${escapeHtml(ui.searchButton)}">
  <form class="search__form" method="dialog" onsubmit="return false">
    <input id="search-input" class="search__input" type="search" autocomplete="off" spellcheck="false"
           placeholder="${escapeHtml(ui.searchPlaceholder)}" aria-label="${escapeHtml(ui.searchButton)}">
    <button class="search__close" type="submit" value="close" aria-label="${escapeHtml(ui.closeKey)}">esc</button>
  </form>
  <p id="search-status" class="search__status" data-loading="${escapeHtml(ui.searchPlaceholder)}" data-empty="${escapeHtml(ui.noResults)}"></p>
  <ul id="search-results" class="search__results"></ul>
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
const THEME_BOOTSTRAP = `(function(){try{
var t=localStorage.getItem('ran-theme');
if(t==='dark'||t==='light'){var e=document.documentElement;e.setAttribute('data-ran-theme',t);e.setAttribute('theme',t);}
}catch(e){}})();`;
