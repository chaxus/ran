/**
 * How a sidebar/nav label is assembled from an invariant `name` and a translated string.
 *
 * The split exists because most labels are only *partly* translatable. `debounce - Debounce
 * function` names an exported symbol; `Button 按钮` names a custom element. Translating the
 * whole string would let a translator rename `debounce`, which is an API identifier, not
 * prose. Keeping the identifier in the structure and the prose in the message dictionary
 * makes that class of mistake impossible.
 */
export type LabelKind =
  /** The whole label is the translated string. */
  | 'full'
  /** `<name> - <translated>` — an exported symbol followed by what it does. */
  | 'dash'
  /** `<name> <translated>`, or just `<name>` when the translation is empty — an element name
   *  followed by its native-language gloss, the way `Button 按钮` reads in Chinese. English
   *  leaves the gloss empty and renders the bare name. */
  | 'suffix';

/** One node of the locale-agnostic sidebar/nav tree. */
export interface SidebarNode {
  /** Absent on an unlabelled wrapper group, whose items render flat. */
  kind?: LabelKind;
  /** Key into a locale's message dictionary; absent together with `kind`. */
  key?: string;
  /** The part of the label that is never translated (an export or element name). */
  name?: string;
  /**
   * Path without a locale prefix (`/src/ranui/`), or an absolute external URL. The builder
   * adds the active locale's prefix only when the target is actually mirrored in that
   * locale — otherwise the link falls back to the English page rather than a 404.
   */
  link?: string;
  /**
   * Nav only: the section this item highlights for, as a regex body without the `^` anchor
   * and without a locale prefix (`/src/(article|note)/`). The builder anchors it and adds
   * the prefix exactly when it prefixed `link`, so an entry that falls back to the English
   * page also matches the English routes.
   */
  activeMatch?: string;
  collapsed?: boolean;
  items?: SidebarNode[];
}

/** A locale's label dictionary: every key in `structure.ts`, plus the theme's own UI strings. */
export interface LocaleMessages {
  labels: Record<string, string>;
  ui: UiMessages;
}

/** Chrome the site renders itself, so it needs a translation per locale. */
export interface UiMessages {
  outline: string;
  returnToTop: string;
  sidebarMenu: string;
  darkModeSwitch: string;
  lightModeSwitchTitle: string;
  darkModeSwitchTitle: string;
  langMenu: string;
  prevPage: string;
  nextPage: string;
  lastUpdated: string;
  /** Local-search UI. */
  searchButton: string;
  searchPlaceholder: string;
  noResults: string;
  resetButton: string;
  backButton: string;
  selectKey: string;
  navigateKey: string;
  closeKey: string;
  footerMessage: string;
}
