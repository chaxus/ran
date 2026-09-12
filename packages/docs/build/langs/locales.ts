/**
 * The site's locale registry — the single list every other piece of i18n machinery reads:
 * `config.ts` (VitePress `locales`, hreflang, `og:locale`), the sidebar builder, the
 * language switcher and `bin/build.sh`'s llms-full.txt walk.
 *
 * Adding a language means adding one row here plus one file under `messages/`. Anything
 * that needs a hard-coded list of languages elsewhere is a bug — it will silently miss the
 * next language added.
 */

/** Directory under the VitePress root that holds a locale's pages; `''` is the root locale. */
export type LocaleDir = '' | 'cn' | 'ja' | 'es' | 'pt' | 'ko' | 'de' | 'fa';

export interface LocaleDef {
  /** VitePress locale id — the key in `config.locales`. `root` for the default language. */
  id: string;
  /** Content directory. Also the URL prefix (`/cn/src/...`). */
  dir: LocaleDir;
  /** BCP-47 tag: the `<html lang>`, the hreflang, and the i18n dictionary key. */
  lang: string;
  /** Name shown in the language menu, written in that language. */
  label: string;
  /** Open Graph locale (`og:locale`), which uses `xx_YY` rather than a BCP-47 tag. */
  ogLocale: string;
  /** Writing direction; only Persian is right-to-left. */
  rtl?: true;
  /**
   * Content trees mirrored in this locale, as path prefixes of the *unprefixed* path.
   * A link outside these falls back to the English page instead of pointing at a 404 —
   * VitePress has no per-page language fallback, a missing page is simply not built.
   */
  mirrors: readonly string[];
}

/** Every content tree — what a fully mirrored locale carries. */
const ALL = ['/src/ranui/', '/src/ranuts/', '/src/article/', '/src/note/'] as const;
/** The library reference only; articles and notes stay English. */
const LIBS = ['/src/ranui/', '/src/ranuts/'] as const;

/**
 * Menu order is deliberate: Chinese and English first (the two fully mirrored languages,
 * and the author's own), then the rest.
 */
export const LOCALES: readonly LocaleDef[] = [
  { id: 'cn', dir: 'cn', lang: 'zh-CN', label: '简体中文', ogLocale: 'zh_CN', mirrors: ALL },
  { id: 'root', dir: '', lang: 'en', label: 'English', ogLocale: 'en_US', mirrors: ALL },
  { id: 'ja', dir: 'ja', lang: 'ja', label: '日本語', ogLocale: 'ja_JP', mirrors: LIBS },
  { id: 'es', dir: 'es', lang: 'es', label: 'Español', ogLocale: 'es_ES', mirrors: LIBS },
  { id: 'pt', dir: 'pt', lang: 'pt', label: 'Português', ogLocale: 'pt_BR', mirrors: LIBS },
  { id: 'ko', dir: 'ko', lang: 'ko', label: '한국어', ogLocale: 'ko_KR', mirrors: LIBS },
  { id: 'de', dir: 'de', lang: 'de', label: 'Deutsch', ogLocale: 'de_DE', mirrors: LIBS },
  { id: 'fa', dir: 'fa', lang: 'fa', label: 'فارسی', ogLocale: 'fa_IR', rtl: true, mirrors: LIBS },
];

/** The root locale — the one served without a prefix, and the hreflang `x-default`. */
export const ROOT_LOCALE: LocaleDef = LOCALES.find((l) => l.dir === '')!;

/** URL prefix for a locale's pages: `''` for the root locale, `/cn` otherwise. */
export const prefixOf = (locale: LocaleDef): string => (locale.dir ? `/${locale.dir}` : '');

/**
 * Which locale a source path belongs to, e.g. `cn/src/ranui/index.md` → the `cn` locale.
 * Used by `config.ts` to emit the right `og:locale` and hreflang set per page.
 */
export const localeOfPath = (relativePath: string): LocaleDef => {
  const dir = relativePath.split('/')[0];
  return LOCALES.find((l) => l.dir && l.dir === dir) ?? ROOT_LOCALE;
};

/**
 * Which locale a *URL* belongs to, e.g. `/ja/src/ranui/` → the `ja` locale. The browser-side
 * counterpart of `localeOfPath`, used to keep the vue-i18n runtime on the same language as
 * the page being rendered.
 */
export const localeFromUrlPath = (pathname: string): LocaleDef => {
  const segment = pathname.replace(/^\/+/, '').split('/')[0];
  return LOCALES.find((l) => l.dir && l.dir === segment) ?? ROOT_LOCALE;
};

/** Which locale a BCP-47 tag names, e.g. VitePress's `useData().lang`. */
export const localeFromLang = (lang: string): LocaleDef =>
  LOCALES.find((l) => l.lang.toLowerCase() === lang.toLowerCase()) ??
  LOCALES.find((l) => lang.toLowerCase().startsWith(`${l.lang.toLowerCase()}-`)) ??
  ROOT_LOCALE;

/**
 * Prefix a site-internal path for a locale — but only when that locale actually mirrors the
 * target. An unmirrored path is returned unchanged so the link lands on the English page
 * rather than a 404: VitePress has no per-page language fallback, a page missing from a
 * locale is simply never built.
 *
 * External URLs pass through. The home page exists in every locale, so `/` is always
 * prefixed.
 */
export const localeHref = (link: string, locale: LocaleDef): string => {
  if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('//')) return link;
  const prefix = prefixOf(locale);
  if (!prefix) return link;
  if (link === '/') return `${prefix}/`;
  return locale.mirrors.some((m) => link.startsWith(m)) ? `${prefix}${link}` : link;
};

/** Strip a locale directory from a source path: `cn/src/a.md` → `src/a.md`. */
export const stripLocaleDir = (relativePath: string): string => {
  const locale = localeOfPath(relativePath);
  return locale.dir ? relativePath.slice(locale.dir.length + 1) : relativePath;
};
