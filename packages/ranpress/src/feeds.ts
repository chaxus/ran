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

export interface FeedItem {
  title: string;
  url: string;
  /** `YYYY-MM-DD`. */
  date: string;
  description: string;
  categories?: readonly string[];
}

export interface FeedOptions {
  title: string;
  origin: string;
  description: string;
  lang: string;
  items: readonly FeedItem[];
}

/**
 * RSS 2.0. `pubDate` must be RFC-822 — a reader handed an ISO date either drops the item
 * or files it under 1970.
 */
const rfc822 = (isoDate: string): string => new Date(`${isoDate}T00:00:00Z`).toUTCString();

export const renderFeed = ({ title, origin, description, lang, items }: FeedOptions): string => {
  const body = items
    .map((item) =>
      [
        '  <item>',
        `    <title>${xmlEscape(item.title)}</title>`,
        `    <link>${xmlEscape(item.url)}</link>`,
        `    <guid isPermaLink="true">${xmlEscape(item.url)}</guid>`,
        `    <pubDate>${rfc822(item.date)}</pubDate>`,
        `    <description>${xmlEscape(item.description)}</description>`,
        ...(item.categories ?? []).map((c) => `    <category>${xmlEscape(c)}</category>`),
        '  </item>',
      ].join('\n'),
    )
    .join('\n');
  const updated = items[0] ? rfc822(items[0].date) : new Date().toUTCString();
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n` +
    `  <title>${xmlEscape(title)}</title>\n` +
    `  <link>${xmlEscape(`${origin}/`)}</link>\n` +
    `  <description>${xmlEscape(description)}</description>\n` +
    `  <language>${lang}</language>\n` +
    `  <lastBuildDate>${updated}</lastBuildDate>\n` +
    `  <atom:link href="${xmlEscape(`${origin}/feed.xml`)}" rel="self" type="application/rss+xml"/>\n` +
    `${body}\n</channel>\n</rss>\n`
  );
};

/**
 * Training crawlers are allowed by default. Both sites here exist so that their material
 * gets read and cited; excluding the crawlers behind the tools people now ask would work
 * against that.
 */
export const AI_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'CCBot',
  'PerplexityBot',
  'Bytespider',
] as const;

export const renderRobotsTxt = (origin: string, agents: readonly string[] = AI_CRAWLERS): string =>
  `User-agent: *\nAllow: /\n\n` +
  agents.map((bot) => `User-agent: ${bot}\nAllow: /\n`).join('\n') +
  `\nSitemap: ${origin}/sitemap.xml\n`;
