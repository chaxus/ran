/**
 * Turning a link written between markdown files into the URL it should point at.
 *
 * Pure and standalone: `components.ts` needs it and `content.ts` needs `components.ts`,
 * so leaving it in `content.ts` made those two import each other.
 */
import { publicUrl } from './urls.ts';

/**
 * Resolve a link written the way markdown sources link to each other, from `pageUrl`, the
 * linking page's source URL.
 *
 * Sources address each other as files — `./debounce`, `../utils/index.md`,
 * `foo.md#anchor` — because that is what they are on disk and what an editor can follow.
 * The published site addresses them as URLs. VitePress did this translation silently;
 * emitting the file paths unchanged produces 1,018 dead links that look entirely
 * ordinary in the markup.
 *
 * The rules mirror VitePress's:
 *
 * - `.md` is dropped, and a trailing `/index` becomes a directory URL.
 * - A relative path resolves against the *directory* of the linking page.
 * - An anchor and anything with a scheme are left alone.
 * - The result is the target's public URL: `/src/ranui/x` is published as `/ranui/x`.
 */
export const resolveLinkFrom = (pageUrl: string): ((href: string) => string) => {
  // `/src/ranui/button/` and `/src/ranui/button` both sit in `/src/ranui/`.
  const dir = pageUrl.endsWith('/') ? pageUrl : `${pageUrl.slice(0, pageUrl.lastIndexOf('/') + 1)}`;
  return (href: string): string => {
    if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#') || href.startsWith('//')) return href;

    const hash = href.indexOf('#');
    let path = hash === -1 ? href : href.slice(0, hash);
    const fragment = hash === -1 ? '' : href.slice(hash);
    if (!path) return href;

    const absolute = path.startsWith('/');
    // `new URL` does the `..` walking; the origin is a placeholder and never appears.
    const resolved = new URL(path, `https://x${absolute ? '' : dir}`).pathname;

    path = resolved.replace(/\.md$/, '');
    if (path.endsWith('/index')) path = `${path.slice(0, -'index'.length)}`;
    // Sources link to each other by source path; the page is published at its public URL.
    return `${publicUrl(path)}${fragment}`;
  };
};
