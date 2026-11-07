/**
 * The one mapping from where a page lives in the source tree to the URL it is published at.
 *
 * Sources keep their directories — `src/ranui/button/index.md`, `cn/src/ranuts/x.md`.
 * Relative markdown links resolve against the source URL; absolute links and nav emitters
 * should use the public path (`/ranui/button/`, `/cn/ranuts/x`). Everything that emits or
 * compares a URL goes through here; a second copy of this rule is how hreflang, sitemap
 * and language links disagree.
 *
 * The old `/src/…` URLs were public, so they stay reachable through `legacyRedirects()`.
 */
import { LOCALES, ROOT_LOCALE } from './langs/locales.ts';

const LOCALE_DIRS = new Set<string>(LOCALES.map((locale) => locale.dir).filter(Boolean));

/**
 * `/src/ranui/x` → `/ranui/x`, `/cn/src/ranuts/y` → `/cn/ranuts/y`. A path that is not
 * under a `src/` tree is returned unchanged, so this is safe on any site-internal link.
 */
export const publicUrl = (path: string): string => {
  const match = /^(\/[^/]+)?\/src(?:\/(.*))?$/.exec(path);
  if (!match) return path;
  const [, prefix = '', rest] = match;
  if (prefix && !LOCALE_DIRS.has(prefix.slice(1))) return path;
  return `${prefix}/${rest ?? ''}`;
};

/**
 * Every tree the site publishes (`design`, `ranui`, …). Mirrors are public path prefixes
 * (`/ranui/`); older `/src/ranui/` forms are still accepted so a partial migration cannot
 * empty this set and break `legacyUrl`.
 */
const TREES = new Set(
  ROOT_LOCALE.mirrors.map((mirror) => {
    const parts = mirror.replace(/^\/|\/$/g, '').split('/');
    return parts[0] === 'src' ? parts[1]! : parts[0]!;
  }),
);

/** The inverse of `publicUrl`: the `/src/…` URL a published page used to have, or null. */
export const legacyUrl = (path: string): string | null => {
  const segments = path.split('/');
  const prefix = LOCALE_DIRS.has(segments[1]!) ? `/${segments[1]}` : '';
  const [tree = '', ...rest] = segments.slice(prefix ? 2 : 1);
  return TREES.has(tree) ? `${prefix}/src/${[tree, ...rest].join('/')}` : null;
};

/** The URL a source path had before clean URLs, e.g. `src/ranui/index.md` in `cn` → `/cn/src/ranui/`. */
export const sourceUrl = (baseRel: string, dir: string): string => {
  const stem = baseRel.replace(/\.md$/, '');
  const prefix = dir ? `/${dir}` : '';
  if (stem === 'index') return `${prefix}/`;
  if (stem.endsWith('/index')) return `${prefix}/${stem.slice(0, -'index'.length)}`;
  return `${prefix}/${stem}`;
};

/** The published URL of a source path in a locale. */
export const pageUrl = (baseRel: string, dir: string): string => publicUrl(sourceUrl(baseRel, dir));

/**
 * The articles and notes moved to chaxus.com in 2026-10, slug for slug: `/articles/<slug>`
 * and `/notes/<slug>` became `/writing/<slug>/`, Chinese under `/zh/`. Only English and
 * Chinese ever published them.
 */
const MOVED: Readonly<Record<string, readonly string[]>> = {
  article: [
    'ai',
    'doc_preview',
    'functional_programming',
    'math/linear_algebra',
    'video',
    'visual',
    'sort',
    ...['bubble', 'select', 'insert', 'shell', 'merge', 'quick', 'heap', 'count', 'bucket', 'radix'].map(
      (name) => `sort/${name}`,
    ),
  ],
  note: ['centos', 'docker', 'libreoffice2wasm'],
};

/** chaxus.com answers a URL without its trailing slash with a 307, so every target ends in `/`. */
const WRITING: Readonly<Record<string, string>> = {
  '': 'https://chaxus.com/writing/',
  cn: 'https://chaxus.com/zh/writing/',
};

/** One hop from every URL a moved page had, `/src/…` forms included, to its chaxus.com page. */
export const movedRedirects = (): string[] =>
  Object.entries(WRITING).flatMap(([dir, writing]) => {
    const prefix = dir ? `/${dir}` : '';
    return Object.entries(MOVED).flatMap(([source, slugs]) => {
      const trees = [`${prefix}/${source}s`, `${prefix}/src/${source}`];
      return [
        ...trees.flatMap((tree) =>
          // The `.html` forms date from GitHub Pages; the catch-all below would send them to the index.
          slugs.flatMap((slug) =>
            ['', '/', '.html', '/index.html'].map((form) => `${tree}/${slug}${form} ${writing}${slug}/ 301`),
          ),
        ),
        // The indexes, and anything under them that has no page of its own there.
        ...trees.flatMap((tree) => ['', '/', '/index.html', '/*'].map((form) => `${tree}${form} ${writing} 301`)),
      ];
    });
  });

/**
 * `_redirects` rules that keep every retired `/src/…` URL reaching its page in one hop.
 * Moved pages come first: the host takes the first matching rule.
 */
/**
 * Design-method pages that left ranui Foundations for the Design pillar (2026-11).
 * Keep every prior `/ranui/…` form reachable in one hop.
 */
const DESIGN_PILLAR_MOVES: ReadonlyArray<readonly [string, string]> = [
  ['ranui/design-system', 'design/design-system'],
  ['ranui/design-guides', 'design/design-guides'],
  ['ranui/information-architecture', 'design/information-architecture'],
];

const designPillarRedirects = (): string[] =>
  ['', ...LOCALE_DIRS].flatMap((dir) => {
    const prefix = dir ? `/${dir}` : '';
    return DESIGN_PILLAR_MOVES.flatMap(([from, to]) =>
      ['', '/', '/index.html'].flatMap((form) => [
        `${prefix}/${from}${form} ${prefix}/${to}/ 301`,
        `${prefix}/src/${from}${form} ${prefix}/${to}/ 301`,
      ]),
    );
  });

export const legacyRedirects = (): string[] => [
  ...movedRedirects(),
  ...designPillarRedirects(),
  ...['', ...LOCALE_DIRS].flatMap((dir) => {
    const prefix = dir ? `/${dir}` : '';
    return [`${prefix}/src ${prefix}/ 301`, `${prefix}/src/* ${prefix}/:splat 301`];
  }),
];
