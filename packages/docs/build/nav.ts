/**
 * Resolving the shared navigation tree for one locale and one page.
 *
 * The tree itself lives in `build/langs/structure.ts` and the label strings in
 * `messages/`, both locale-agnostic and both already the single source the site reads.
 * This module only turns them into the shape this renderer wants: labels assembled,
 * links prefixed, the right sidebar picked, previous/next derived.
 *
 * Nothing here re-decides *what* the navigation is. That was the expensive lesson behind
 * the structure file existing at all — the tree used to be copy-pasted per language, two
 * ~500-line files edited in lockstep, which does not survive eight languages.
 */
import { NAV, SIDEBAR } from './langs/structure.ts';
import { localeHref, prefixOf } from './langs/locales.ts';
import { messagesFor } from './langs/index.ts';
import type { SidebarNode } from './langs/types.ts';
import type { LocaleDef } from './config.ts';

export interface NavLink {
  text: string;
  link: string;
  external?: boolean;
  /** Anchored regex body; the page is in this section when it matches. */
  activeMatch?: string;
}

export interface SidebarItem {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
}

/**
 * A label is only ever partly translatable. `debounce - Debounce function` names an
 * exported symbol; `Button 按钮` names a custom element. The identifier stays in the
 * structure and the prose in the dictionary, which makes renaming an API identifier
 * through a translation impossible rather than merely discouraged.
 */
const label = (node: SidebarNode, labels: Record<string, string>): string => {
  const msg = node.key ? (labels[node.key] ?? '') : '';
  if (node.kind === 'dash') return `${node.name} - ${msg}`;
  if (node.kind === 'suffix') return msg ? `${node.name} ${msg}` : (node.name ?? '');
  return msg;
};

const isExternal = (link: string): boolean => /^https?:\/\//.test(link);

const resolveItems = (nodes: SidebarNode[], locale: LocaleDef, labels: Record<string, string>): SidebarItem[] =>
  nodes.map((node) => {
    const item: SidebarItem = { text: node.kind ? label(node, labels) : '' };
    if (node.link) item.link = isExternal(node.link) ? node.link : localeHref(node.link, locale);
    if (node.collapsed !== undefined) item.collapsed = node.collapsed;
    if (node.items) item.items = resolveItems(node.items, locale, labels);
    return item;
  });

export const navFor = (locale: LocaleDef): NavLink[] => {
  const { labels } = messagesFor(locale);
  return NAV.map((node) => {
    const raw = node.link ?? '/';
    const link = isExternal(raw) ? raw : localeHref(raw, locale);
    const item: NavLink = { text: label(node, labels), link };
    if (isExternal(raw)) item.external = true;
    if (node.activeMatch) {
      // Prefix the pattern exactly when the link itself was prefixed, so an entry that
      // falls back to the English pages also highlights on the English routes.
      item.activeMatch = `^${link === raw ? '' : prefixOf(locale)}${node.activeMatch}`;
    }
    return item;
  });
};

/**
 * The sidebar for a page: by path prefix, longest first. A page whose path matches no key
 * has no sidebar, which is correct for the home page and is how a stray page announces
 * itself.
 */
export const sidebarFor = (url: string, locale: LocaleDef): SidebarItem[] => {
  const { labels } = messagesFor(locale);
  const candidates = Object.keys(SIDEBAR)
    .map((key) => [key, localeHref(key, locale)] as const)
    .filter(([, prefixed]) => url.startsWith(prefixed))
    .sort((a, b) => b[1].length - a[1].length);
  const match = candidates[0];
  return match ? resolveItems(SIDEBAR[match[0]], locale, labels) : [];
};

export interface PrevNext {
  prev?: { text: string; link: string };
  next?: { text: string; link: string };
}

/** Every linked item in the order a reader walks them. */
const flatten = (items: SidebarItem[], out: Array<{ text: string; link: string }> = []) => {
  for (const item of items) {
    if (item.link && !isExternal(item.link)) out.push({ text: item.text, link: item.link });
    if (item.items) flatten(item.items, out);
  }
  return out;
};

/**
 * Previous and next, from the sidebar's own order.
 *
 * Derived rather than configured: a hand-maintained pair per page is a pair that goes
 * stale the first time a section is reordered, and nothing about the page looks wrong
 * when it does.
 */
export const prevNextFor = (url: string, sidebar: SidebarItem[]): PrevNext => {
  const flat = flatten(sidebar);
  // Links in the structure carry a trailing slash inconsistently; compare without one.
  const key = (s: string): string => s.replace(/\/$/, '');
  const i = flat.findIndex((item) => key(item.link) === key(url));
  if (i === -1) return {};
  return { prev: flat[i - 1], next: flat[i + 1] };
};
