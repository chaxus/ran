/**
 * The files read by machines rather than people: `sitemap.xml`, an RSS feed, and
 * `robots.txt`.
 *
 * The rule all three follow: **every URL is the URL that is actually served**.
 * packages/docs once pointed roughly 214 canonical and sitemap URLs at `/foo.html` while
 * the host served `/foo` and 308-redirected the other form. Nothing looked broken; the
 * signal just quietly named a redirect. Callers pass URLs that came from the same page
 * objects the driver wrote to disk, so the two cannot disagree.
 */

/** XML text content. `&` first, or it would double-escape the entities below it. */
export const xmlEscape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export interface SitemapEntry {
  /** Absolute URL. */
  loc: string;
  /** `YYYY-MM-DD`, when the page has a meaningful date. */
  lastmod?: string;
  priority?: string;
}

export const renderSitemap = (entries: readonly SitemapEntry[]): string => {
  const urls = entries
    .map(({ loc, lastmod, priority }) =>
      [
        '  <url>',
        `    <loc>${xmlEscape(loc)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        ...(priority ? [`    <priority>${priority}</priority>`] : []),
        '  </url>',
      ].join('\n'),
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};
