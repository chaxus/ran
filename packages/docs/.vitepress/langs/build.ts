import type { DefaultTheme } from 'vitepress';
import { GITHUB } from '../common/index.ts';
import { NAV, SIDEBAR } from './structure.ts';
import { localeHref as href, prefixOf } from './locales.ts';
import type { LocaleDef } from './locales.ts';
import type { LocaleMessages, SidebarNode } from './types.ts';

/**
 * Assembles one locale's `themeConfig` from the shared structure plus that locale's strings.
 *
 * Two rules carry all the weight:
 *
 * 1. **A link is prefixed only when the target exists in that locale.** VitePress has no
 *    per-page language fallback — a page missing from a locale is simply not built, and a
 *    link to it 404s. Only Chinese and English mirror the articles, so in the other six
 *    locales the "articles" entries keep pointing at the English pages. That is a language
 *    switch mid-navigation, but it is a working page rather than a dead one.
 * 2. **The sidebar map is keyed by prefixed path**, and only for mirrored trees — an
 *    unmirrored key would never match any built route and would just be dead config.
 */

/** Render a node's label for one locale. See `LabelKind` for why labels are split. */
const label = (node: SidebarNode, labels: Record<string, string>): string => {
  const msg = node.key ? (labels[node.key] ?? '') : '';
  if (node.kind === 'dash') return `${node.name} - ${msg}`;
  if (node.kind === 'suffix') return msg ? `${node.name} ${msg}` : (node.name ?? '');
  return msg;
};

/**
 * Prefix a path for a locale, or leave it alone when the page is not mirrored there.
 * External URLs and the home page are handled first: the home page exists in every locale.
 */
const buildItems = (
  nodes: SidebarNode[],
  locale: LocaleDef,
  labels: Record<string, string>,
): DefaultTheme.SidebarItem[] =>
  nodes.map((node) => {
    const item: DefaultTheme.SidebarItem = {};
    if (node.kind) item.text = label(node, labels);
    if (node.link) item.link = href(node.link, locale);
    if (node.collapsed !== undefined) item.collapsed = node.collapsed;
    if (node.items) item.items = buildItems(node.items, locale, labels);
    return item;
  });

const buildNav = (locale: LocaleDef, labels: Record<string, string>): DefaultTheme.NavItem[] =>
  NAV.map((node) => {
    const raw = node.link ?? '/';
    const link = href(raw, locale);
    const item: DefaultTheme.NavItem = { text: label(node, labels), link };
    if (node.activeMatch) {
      // Prefix the pattern exactly when the link itself was prefixed, so an entry that
      // falls back to the English pages highlights on the English routes.
      item.activeMatch = `^${link === raw ? '' : prefixOf(locale)}${node.activeMatch}`;
    }
    return item;
  });

export const buildThemeConfig = (locale: LocaleDef, messages: LocaleMessages): DefaultTheme.Config => {
  const { labels, ui } = messages;
  const sidebar: DefaultTheme.SidebarMulti = {};
  for (const [path, nodes] of Object.entries(SIDEBAR)) {
    // An unmirrored tree is served from the English locale, whose own config already
    // carries this sidebar — emitting a prefixed key here would match no built route.
    if (locale.dir && !locale.mirrors.some((m) => path.startsWith(m))) continue;
    sidebar[href(path, locale)] = buildItems(nodes, locale, labels);
  }

  return {
    logo: '/home.svg',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: ui.searchButton, buttonAriaLabel: ui.searchButton },
          modal: {
            noResultsText: ui.noResults,
            resetButtonTitle: ui.resetButton,
            backButtonTitle: ui.backButton,
            displayDetails: ui.searchPlaceholder,
            footer: { selectText: ui.selectKey, navigateText: ui.navigateKey, closeText: ui.closeKey },
          },
        },
      },
    },
    nav: buildNav(locale, labels),
    socialLinks: [{ icon: 'github', link: GITHUB }],
    footer: {
      message: ui.footerMessage,
      copyright: 'Copyright © 2022-11-11',
    },
    outline: { label: ui.outline },
    returnToTopLabel: ui.returnToTop,
    sidebarMenuLabel: ui.sidebarMenu,
    darkModeSwitchLabel: ui.darkModeSwitch,
    lightModeSwitchTitle: ui.lightModeSwitchTitle,
    darkModeSwitchTitle: ui.darkModeSwitchTitle,
    langMenuLabel: ui.langMenu,
    docFooter: { prev: ui.prevPage, next: ui.nextPage },
    lastUpdated: { text: ui.lastUpdated },
    sidebar,
  };
};
