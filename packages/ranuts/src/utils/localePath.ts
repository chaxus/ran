/**
 * URL maths for a multi-language site (pure functions, no global state, no DOM).
 *
 * Uses **sub-directories** rather than sub-domains (`/zh/book/`, not `zh.example.com/book/`):
 * search engines treat a sub-domain as a separate site that starts from zero authority,
 * while a sub-directory inherits the main site's. The default language lives at the root
 * (`/book/`); every other language carries a prefix.
 *
 * Decoupled from "what is the current language" — this module only converts paths, the
 * language state belongs to the caller (the i18n runtime). That is why it runs both in
 * build-time scripts (sitemap / hreflang generation) and in the browser.
 */

export interface LocaleRoute {
  /** Language code, e.g. `zh-CN`; the public identifier (hreflang, i18n dictionary key) */
  code: string;
  /** URL prefix, e.g. `zh`. Empty = the default language, served from the root */
  prefix?: string;
}

export interface LocalePathConfig {
  locales: readonly LocaleRoute[];
  /** Default language code; when omitted, the first locale without a prefix, else `locales[0]` */
  defaultLocale?: string;
  /** Deployment sub-path, e.g. `/weread`; empty for a root deployment. A trailing slash is ignored */
  base?: string;
}

export interface LocalePath {
  /** Normalised base (no trailing slash; empty string for a root deployment) */
  readonly base: string;
  readonly defaultLocale: string;
  /** Detect the language from a pathname, falling back to the default language */
  localeFromPath: (pathname: string) => string;
  /** Drop the language prefix to get the language-independent path (for route matching) */
  stripLocale: (pathname: string) => string;
  /** Build a link for a language; an already-prefixed path is stripped first, so repeated calls are idempotent */
  href: (path: string, code?: string) => string;
  /** Convert a path in any language to its counterpart in another language (for a language switcher) */
  hrefForLocale: (pathname: string, code: string) => string;
  /** This path in every language, for `<link rel="alternate" hreflang>` */
  alternates: (pathname: string) => Array<{ code: string; href: string }>;
}

/** Normalise the base: drop the trailing slash, add a leading one; an empty base stays empty */
const normalizeBase = (base: string): string => {
  const trimmed = base.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

/** Split off query/hash: the maths only applies to the pathname, the rest is re-attached as is */
const splitSuffix = (path: string): [string, string] => {
  const index = path.search(/[?#]/);
  return index === -1 ? [path, ''] : [path.slice(0, index), path.slice(index)];
};

/**
 * @description: Create the set of locale path conversion functions.
 *
 * @param {LocalePathConfig} config
 * @return {LocalePath}
 * @example
 * ```ts
 * const paths = createLocalePath({
 *   locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }],
 *   base: '/docs',
 * });
 * paths.href('/book/walden/');                 // '/docs/book/walden/'
 * paths.href('/book/walden/', 'zh-CN');        // '/docs/zh/book/walden/'
 * paths.localeFromPath('/docs/zh/book/');      // 'zh-CN'
 * paths.stripLocale('/docs/zh/book/');         // '/docs/book/'
 * paths.hrefForLocale('/docs/zh/book/', 'zh-HK'); // '/docs/zh-hant/book/'
 * ```
 */
export const createLocalePath = (config: LocalePathConfig): LocalePath => {
  const locales = config.locales.length > 0 ? config.locales : [{ code: 'en' }];
  const base = normalizeBase(config.base ?? '');
  const defaultLocale = config.defaultLocale ?? (locales.find((l) => !l.prefix) ?? locales[0]).code;
  // Longest prefix wins: otherwise `zh` would match `/zh-hant/...` first and read a
  // traditional-Chinese path as simplified
  const prefixed = locales
    .filter((l) => l.prefix)
    .sort((a, b) => (b.prefix as string).length - (a.prefix as string).length);

  const localeOf = (code: string): LocaleRoute => locales.find((l) => l.code === code) ?? { code: defaultLocale };

  /**
   * Strip the base only from the **start**. `replace(base, '')` would strip the first
   * occurrence anywhere in the string, so a base of `/zh` would cut the wrong segment out
   * of a path that contains another `/zh` later on.
   */
  const stripBase = (pathname: string): string => {
    const path = pathname || '/';
    if (!base) return path.startsWith('/') ? path : `/${path}`;
    if (path === base) return '/';
    if (path.startsWith(`${base}/`)) return path.slice(base.length);
    return path.startsWith('/') ? path : `/${path}`;
  };

  /** Recognise and strip the language prefix from a path whose base is already removed */
  const splitPrefix = (rest: string): { code: string; rest: string } => {
    const first = rest.split('/').filter(Boolean)[0];
    const hit = first ? prefixed.find((l) => l.prefix === first) : undefined;
    if (!hit) return { code: defaultLocale, rest };
    const stripped = rest.slice((hit.prefix as string).length + 1) || '/';
    return { code: hit.code, rest: stripped.startsWith('/') ? stripped : `/${stripped}` };
  };

  const localeFromPath = (pathname: string): string => splitPrefix(stripBase(splitSuffix(pathname)[0])).code;

  const stripLocale = (pathname: string): string => {
    const [path, suffix] = splitSuffix(pathname);
    return `${base}${splitPrefix(stripBase(path)).rest}${suffix}`;
  };

  const href = (path: string, code: string = defaultLocale): string => {
    const [pathname, suffix] = splitSuffix(path);
    const { rest } = splitPrefix(stripBase(pathname));
    const { prefix } = localeOf(code);
    const withPrefix = prefix ? `/${prefix}${rest}` : rest;
    return `${base}${withPrefix}${suffix}` || '/';
  };

  return {
    base,
    defaultLocale,
    localeFromPath,
    stripLocale,
    href,
    hrefForLocale: (pathname: string, code: string): string => href(pathname, code),
    alternates: (pathname: string): Array<{ code: string; href: string }> =>
      locales.map((l) => ({ code: l.code, href: href(pathname, l.code) })),
  };
};
