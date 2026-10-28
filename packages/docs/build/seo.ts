/**
 * Per-page `<head>` for the documentation site, and the files read by machines.
 *
 * The part that does not exist on a single-language site: **hreflang across eight
 * locales, existence-checked**. Advertising a translation that 404s is worse than
 * advertising none, and there is no way to notice it from a browser — which is why the
 * check is against the set of URLs the build actually produced rather than against the
 * locale registry.
 */
import { renderSitemap } from 'ranpress';
import { LOCALES, ORIGIN, ROOT_LOCALE, SITE } from './config.ts';
import type { DocContent, DocPage } from './content.ts';
import { pageUrl } from './urls.ts';
import { homeCopy } from './langs/home-copy.ts';
import { SEO } from './langs/seo.ts';

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const meta = (attr: 'name' | 'property', key: string, content: string): string =>
  `<meta ${attr}="${key}" content="${escapeHtml(content)}">`;

export const absoluteUrl = (path: string): string => `${ORIGIN}${path}`;

/**
 * The author, as chaxus.com describes the same person. The `@id`, name and url must match
 * what chaxus.com and edit.chaxus.com publish, or search engines see three different people.
 */
const AUTHOR = {
  '@type': 'Person',
  '@id': 'https://chaxus.com/#person',
  name: SITE.author,
  url: SITE.authorUrl,
  sameAs: ['https://github.com/chaxus'],
};

/** The home page's JSON-LD: the site and its two libraries, all by the one author. */
const homeJsonLd = (page: DocPage): string => {
  const { dir, lang } = page.locale;
  const copy = SEO[dir] ?? SEO['']!;
  const by = { '@id': AUTHOR['@id'] };
  const library = (name: string, path: string, description: string) => ({
    '@type': 'SoftwareSourceCode',
    name,
    description,
    url: absoluteUrl(`${dir ? `/${dir}` : ''}${path}`),
    codeRepository: SITE.github,
    programmingLanguage: 'TypeScript',
    license: 'https://opensource.org/licenses/MIT',
    inLanguage: lang,
    author: by,
    publisher: by,
  });
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      AUTHOR,
      {
        '@type': 'WebSite',
        name: SITE.name,
        url: absoluteUrl(page.url),
        description: copy.homeDescription,
        inLanguage: lang,
        author: by,
        publisher: by,
      },
      library('ranui', '/ranui/', copy.ranui),
      library('ranuts', '/ranuts/', copy.ranuts),
    ],
  };
  // `<` escaped so no string in the data can close the script element.
  return `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`;
};

/** The URL this page would have in another locale, whether or not it exists. */
const urlIn = (page: DocPage, dir: string): string => pageUrl(page.baseRel, dir);

/** The document title. Every language's home leads with what ran is; elsewhere the page leads. */
export const pageTitle = (page: DocPage): string =>
  page.baseRel === 'index.md' ? `${SITE.name} — ${homeCopy(page.locale.dir).headline}` : `${page.title} | ${SITE.name}`;

export const headFor = (page: DocPage, content: DocContent): string[] => {
  // Served from every wrong URL there is, so a canonical would claim a different page
  // each time and a sitemap entry would invite indexing.
  if (page.kind === 'notfound') return [`<meta name="robots" content="noindex, follow">`];

  const url = absoluteUrl(page.url);
  const title = pageTitle(page);

  const head = [`<link rel="canonical" href="${url}">`, meta('name', 'author', SITE.author)];

  // Only the locales that actually ship this page. Most languages carry the library
  // reference and nothing else, so most pages have two or three alternates, not eight.
  for (const locale of LOCALES) {
    const candidate = urlIn(page, locale.dir);
    if (!content.urls.has(candidate)) continue;
    const href = absoluteUrl(candidate);
    head.push(`<link rel="alternate" hreflang="${locale.lang}" href="${href}">`);
    // x-default follows the language served from the root.
    if (locale.dir === ROOT_LOCALE.dir) {
      head.push(`<link rel="alternate" hreflang="x-default" href="${href}">`);
    }
  }

  head.push(
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', SITE.name),
    meta('property', 'og:title', title),
    meta('property', 'og:description', page.description),
    meta('property', 'og:url', url),
    meta('property', 'og:locale', page.locale.ogLocale),
    ...LOCALES.filter((locale) => locale.dir !== page.locale.dir && content.urls.has(urlIn(page, locale.dir))).map(
      (locale) => meta('property', 'og:locale:alternate', locale.ogLocale),
    ),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', page.description),
  );
  if (page.baseRel === 'index.md') head.push(homeJsonLd(page));

  return head;
};

export const generatedFiles = ({ pages }: DocContent): Array<[string, string]> => [
  [
    'sitemap.xml',
    renderSitemap(
      pages
        .filter((page) => page.kind !== 'notfound')
        .map((page) => ({
          loc: absoluteUrl(page.url),
          priority: page.url === '/' ? '1.0' : '0.7',
        })),
    ),
  ],
  // No robots.txt here: `public/robots.txt` is hand-maintained and carries a considered
  // policy with its reasoning in comments. Generating one would copy `public/` into the
  // output and then overwrite it with something blander.
];
