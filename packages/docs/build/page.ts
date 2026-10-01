/**
 * The documentation page document.
 *
 * Everything that is not the article itself — the top nav, the sidebar, the outline,
 * previous/next, the language menu — is rendered here, server-side, as plain HTML. The
 * mobile drawer is a checkbox and a label; the only thing the client bundle adds is the
 * theme switch and the code-group tabs. A documentation site that needs JavaScript to
 * show its navigation is a documentation site that shows nothing to a crawler.
 */
import type { Assets } from 'ranpress';
import { ElementBuilder, DocumentFragmentMock } from '@alixex/ranview/static';
import type { Child } from '@alixex/ranview/static';
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
} from './common/index.ts';
import type { LocaleDef } from './config.ts';
import type { DocPage } from './content.ts';
import { navFor, prevNextFor, sidebarFor } from './nav.ts';
import type { SidebarItem } from './nav.ts';
import { messagesFor } from './langs/index.ts';
import { interactionCopy } from '../client/copy.ts';

// Element text and attributes are escaped by the static serializer. Raw HTML is
// restricted to rendered Markdown, already serialized head tags, and script source.
const node = (
  tag: string,
  attrs: Record<string, string | boolean | undefined> = {},
  ...children: Child[]
): ElementBuilder => {
  const element = new ElementBuilder(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (typeof value === 'boolean') element.boolAttr(name, value);
    else if (value !== undefined) element.attr(name, value);
  }
  return element.children(...children);
};
const serializedHead = (tags: string[]): HTMLElement => {
  const fragment = new DocumentFragmentMock();
  // Preserve the string[] head API without emitting template wrappers.
  fragment.serialize = () => tags.join('');
  return fragment as unknown as HTMLElement;
};
const samePath = (a: string, b: string): boolean => a.replace(/\/$/, '') === b.replace(/\/$/, '');
const containsCurrent = (item: SidebarItem, url: string): boolean =>
  Boolean(item.link && samePath(item.link, url)) || Boolean(item.items?.some((child) => containsCurrent(child, url)));

const sidebarTree = (items: SidebarItem[], url: string, depth = 0): ElementBuilder | null => {
  if (!items.length) return null;
  return node(
    'ul',
    { class: `sb__list sb__list--d${depth}` },
    items.map((item) => {
      const active = Boolean(item.link && samePath(item.link, url));
      const children = sidebarTree(item.items ?? [], url, depth + 1);
      const label = item.link
        ? node('a', { class: 'sb__link', href: item.link, 'aria-current': active ? 'page' : undefined }, item.text)
        : node('span', { class: 'sb__label' }, item.text);
      if (!children) return node('li', { class: 'sb__item' }, label);
      const collapsed = item.collapsed === true && !containsCurrent(item, url);
      return node(
        'li',
        { class: 'sb__item sb__item--group', 'data-collapsed': collapsed },
        node(
          'details',
          { class: 'sb__details', open: !collapsed },
          node('summary', { class: 'sb__summary' }, label),
          children,
        ),
      );
    }),
  );
};

const tocList = (page: DocPage): ElementBuilder | null => {
  const entries = page.toc.filter((entry) => entry.level === 2 || entry.level === 3);
  if (entries.length < 2) return null;
  return node(
    'ul',
    { class: 'toc__list' },
    entries.map((entry) =>
      node(
        'li',
        { class: `toc__item toc__item--h${entry.level}` },
        node('a', { class: 'toc__link', href: `#${encodeURIComponent(entry.slug)}` }, entry.text),
      ),
    ),
  );
};

const icon = (className: string, width: string, search = false): ElementBuilder =>
  node(
    'svg',
    {
      class: className,
      'aria-hidden': 'true',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': width,
    },
    node('circle', search ? { cx: '10.5', cy: '10.5', r: '6.5' } : { cx: '12', cy: '12', r: '9' }),
    node('path', { d: search ? 'm16 16 4 4' : 'M3 12h18M12 3a17 17 0 0 1 0 18M12 3a17 17 0 0 0 0 18' }),
  );

const langMenu = (page: DocPage, urls: ReadonlySet<string>, label: string): ElementBuilder | null => {
  const stem = page.baseRel.replace(/\.md$/, '');
  const urlIn = (dir: string): string => {
    const prefix = dir ? `/${dir}` : '';
    if (stem === 'index') return `${prefix}/`;
    if (stem.endsWith('/index')) return `${prefix}/${stem.slice(0, -'index'.length)}`;
    return `${prefix}/${stem}`;
  };
  const options = LOCALES.filter((locale) => urls.has(urlIn(locale.dir)));
  if (options.length < 2) return null;
  return node(
    'details',
    { class: 'langs' },
    node(
      'summary',
      { class: 'langs__summary', 'aria-label': label },
      node('span', { class: 'langs__current' }, page.locale.label),
      icon('langs__icon', '1.6'),
    ),
    node(
      'ul',
      { class: 'langs__list' },
      options.map((locale) =>
        node(
          'li',
          {},
          node(
            'a',
            {
              class: 'langs__link',
              href: urlIn(locale.dir),
              lang: locale.lang,
              'aria-current': locale.dir === page.locale.dir ? 'true' : undefined,
            },
            locale.label,
          ),
        ),
      ),
    ),
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
  const feedback = interactionCopy(page.locale.lang);
  const title = page.url === '/' ? SITE.name : `${page.title} | ${SITE.name}`;
  const sidebar = sidebarFor(page.url, page.locale);
  const { prev, next } = prevNextFor(page.url, sidebar);
  const sb = sidebarTree(sidebar, page.url);
  const nav = navFor(page.locale).map((item) => {
    const active = item.activeMatch ? new RegExp(item.activeMatch).test(page.url) : samePath(item.link, page.url);
    return node(
      'a',
      {
        class: 'nav__link',
        href: item.link,
        'aria-current': active ? 'page' : undefined,
        target: item.external ? '_blank' : undefined,
        rel: item.external ? 'noopener noreferrer' : undefined,
      },
      item.text,
    );
  });
  const pagerLink = (item: { link: string; text: string } | undefined, direction: 'prev' | 'next', label: string) =>
    item
      ? node(
          'a',
          { class: `pager__link pager__link--${direction}`, href: item.link },
          node('span', { class: 'pager__dir' }, label),
          node('span', { class: 'pager__text' }, item.text),
        )
      : node('span');
  const pager =
    prev || next
      ? node(
          'nav',
          { class: 'pager', 'aria-label': `${ui.prevPage} / ${ui.nextPage}` },
          pagerLink(prev, 'prev', ui.prevPage),
          pagerLink(next, 'next', ui.nextPage),
        )
      : null;
  // Script is a raw-text element; HTML entity escaping would alter executable JS.
  const script = (source: string) => node('script').unsafeHtml(source);
  const meta = (attrs: Record<string, string>) => node('meta', attrs);
  const landing = page.url === '/' || /^\/[a-z]{2}(-[A-Z]{2})?\/$/.test(page.url);
  const mobileOutline = tocList(page);
  const desktopOutline = tocList(page);
  const document = node(
    'html',
    { lang: page.locale.lang, dir: page.locale.rtl ? 'rtl' : undefined },
    node(
      'head',
      {},
      meta({ charset: 'utf-8' }),
      meta({ name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      node('title', {}, title),
      meta({ name: 'description', content: page.description }),
      meta({ name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' }),
      meta({ name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0b0d10' }),
      node('link', { rel: 'icon', href: '/favicon.ico' }),
      node('link', { rel: 'manifest', href: '/manifest.json' }),
      meta({ name: 'robots', content: 'all' }),
      meta({ name: 'google', content: 'notranslate' }),
      meta({ property: 'og:image', content: OG_IMAGE }),
      meta({ property: 'og:image:width', content: OG_IMAGE_WIDTH }),
      meta({ property: 'og:image:height', content: OG_IMAGE_HEIGHT }),
      meta({ property: 'og:image:alt', content: OG_IMAGE_ALT }),
      meta({ name: 'twitter:image', content: OG_IMAGE }),
      node('link', { rel: 'alternate', type: 'text/markdown', href: '/llms.txt', title: 'llms.txt' }),
      node('link', { rel: 'alternate', type: 'text/plain', href: '/llms-full.txt', title: 'llms-full.txt' }),
      script(THEME_BOOTSTRAP),
      script(SET_FONT_SIZE),
      script(PREVIEW_CODE),
      node('script', { defer: true, src: GTAG }),
      script(GOOGLE_ANALYSE),
      script(BD_ANALYSE),
      script(SERVICE_WORK),
      // ranpress exposes per-page head tags as serialized strings.
      serializedHead(head),
      assets.css.map((href) => node('link', { rel: 'stylesheet', href })),
    ),
    node(
      'body',
      { class: sb ? 'has-sidebar' : undefined },
      node('a', { class: 'skip', href: '#main' }, feedback.skip),
      node(
        'header',
        { class: 'site-header' },
        node(
          'div',
          { class: 'site-header__inner' },
          sb ? node('input', { type: 'checkbox', id: 'drawer', class: 'drawer__toggle', hidden: true }) : null,
          sb
            ? node(
                'label',
                {
                  class: 'drawer__button',
                  for: 'drawer',
                  'aria-controls': 'doc-sidebar',
                  'aria-label': ui.sidebarMenu,
                },
                node('span'),
                node('span'),
                node('span'),
              )
            : null,
          node('a', { class: 'wordmark', href: page.locale.dir ? `/${page.locale.dir}/` : '/' }, SITE.name),
          node('nav', { class: 'nav', 'aria-label': ui.sidebarMenu }, nav),
          node(
            'button',
            { class: 'search-open', type: 'button', 'aria-label': ui.searchButton },
            icon('search-open__icon', '1.8', true),
            node('span', { class: 'search-open__text' }, ui.searchButton),
            node('kbd', { class: 'search-open__kbd' }, '/'),
          ),
          langMenu(page, urls, ui.langMenu),
          node('r-theme-switch', { class: 'theme-switch' }),
        ),
      ),
      node(
        'div',
        { class: 'layout' },
        sb ? node('label', { class: 'drawer__scrim', for: 'drawer' }) : null,
        sb ? node('nav', { id: 'doc-sidebar', class: 'sidebar', 'aria-label': ui.sidebarMenu }, sb) : null,
        node(
          'main',
          { id: 'main', class: 'doc' },
          mobileOutline
            ? node('details', { class: 'mobile-toc' }, node('summary', {}, ui.outline), mobileOutline)
            : null,
          node(landing ? 'div' : 'article', { class: landing ? 'landing' : 'prose' }).unsafeHtml(page.html),
          pager,
        ),
        desktopOutline
          ? node('aside', { class: 'toc' }, node('p', { class: 'toc__label' }, ui.outline), desktopOutline)
          : null,
      ),
      node(
        'dialog',
        { id: 'search-dialog', class: 'search', 'aria-label': ui.searchButton },
        node(
          'form',
          { class: 'search__form', method: 'dialog', onsubmit: 'return false' },
          node('input', {
            id: 'search-input',
            class: 'search__input',
            type: 'search',
            autocomplete: 'off',
            spellcheck: 'false',
            placeholder: ui.searchPlaceholder,
            'aria-label': ui.searchButton,
            role: 'combobox',
            'aria-expanded': 'false',
            'aria-controls': 'search-results',
            'aria-autocomplete': 'list',
          }),
          node('button', { class: 'search__close', type: 'button', value: 'close', 'aria-label': ui.closeKey }, 'esc'),
        ),
        node('p', {
          id: 'search-status',
          class: 'search__status',
          role: 'status',
          'aria-live': 'polite',
          'data-error': feedback.error,
          'data-loading': feedback.loading,
          'data-empty': ui.noResults,
        }),
        node('button', { class: 'search__retry', type: 'button', hidden: true }, feedback.retry),
        node('ul', { id: 'search-results', class: 'search__results', role: 'listbox', 'aria-label': ui.searchButton }),
      ),
      assets.js.map((src) => node('script', { type: 'module', src })),
    ),
  );
  return `<!doctype html>\n${document.serialize()}\n`;
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
var t=localStorage.getItem('ran-theme');
if(t==='dark'||t==='light'){var e=document.documentElement;e.setAttribute('data-ran-theme',t);e.setAttribute('theme',t);}
}catch(e){}})();`;
