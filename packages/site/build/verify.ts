/**
 * Post-build checks, run as part of `pnpm -F site build`.
 *
 * Every check here corresponds to a failure that is invisible in a browser. A dead
 * internal link, a canonical naming a URL that redirects, a page with no description —
 * none of them break a page, and none of them get reported by anyone. They are found
 * either by a check like this one or by a search console, months later.
 *
 * Exits non-zero on any failure, so `bin/build.sh` fails the deploy rather than
 * publishing.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ORIGIN } from './config.ts';
import { DIST_DIR } from './build.ts';

interface Failure {
  file: string;
  message: string;
}

const failures: Failure[] = [];
const fail = (file: string, message: string): void => {
  failures.push({ file, message });
};

const walkHtml = (dir: string): string[] => {
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walkHtml(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
};

/** `/about` → `dist/about/index.html`; `/` → `dist/index.html`. Also accepts a real file. */
const resolveUrlPath = (path: string): string | null => {
  const clean = path.split('#')[0].split('?')[0];
  const candidates =
    clean === '/' ? ['index.html'] : [join(clean.replace(/^\/|\/$/g, ''), 'index.html'), clean.replace(/^\//, '')];
  for (const candidate of candidates) {
    const full = join(DIST_DIR, candidate);
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
};

const attrValues = (html: string, pattern: RegExp): string[] => {
  const out: string[] = [];
  for (const match of html.matchAll(pattern)) out.push(match[1]);
  return out;
};

const main = (): void => {
  if (!existsSync(DIST_DIR)) {
    console.error('verify: dist/ does not exist — run the build first');
    process.exit(1);
  }

  const pages = walkHtml(DIST_DIR);
  if (!pages.length) {
    console.error('verify: dist/ contains no HTML');
    process.exit(1);
  }

  // Collect every id on every page, so an anchor link can be checked against the page
  // it actually points at rather than merely against the page existing.
  const idsByFile = new Map<string, Set<string>>();
  for (const file of pages) {
    idsByFile.set(file, new Set(attrValues(readFileSync(file, 'utf8'), /\sid="([^"]+)"/g)));
  }

  for (const file of pages) {
    const rel = relative(DIST_DIR, file);
    const html = readFileSync(file, 'utf8');

    // ── head essentials ────────────────────────────────────────────────────
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
    if (!title.trim()) fail(rel, 'empty or missing <title>');
    const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
    if (!description.trim()) fail(rel, 'empty or missing meta description');

    // ── canonical ──────────────────────────────────────────────────────────
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    if (!canonical) {
      fail(rel, 'missing canonical');
    } else {
      if (!canonical.startsWith(ORIGIN)) fail(rel, `canonical is not on ${ORIGIN}: ${canonical}`);
      if (canonical.endsWith('.html')) fail(rel, `canonical points at a .html URL: ${canonical}`);
      // The canonical must name this very file, or the page is telling search engines
      // to index a different one — the single most expensive thing to get wrong here.
      const target = resolveUrlPath(canonical.slice(ORIGIN.length) || '/');
      if (target !== file) fail(rel, `canonical ${canonical} does not resolve back to this page`);
    }

    // ── internal links ─────────────────────────────────────────────────────
    for (const href of attrValues(html, /<a\s[^>]*href="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
      if (!href.startsWith('/')) {
        fail(rel, `relative link (use a site-absolute path): ${href}`);
        continue;
      }
      if (href.endsWith('.html')) fail(rel, `link points at a .html URL: ${href}`);
      const [path, hash] = href.split('#');
      const target = resolveUrlPath(path || '/');
      if (!target) {
        // Not every site-absolute href is a page — feed.xml and llms.txt are files.
        if (!existsSync(join(DIST_DIR, path.replace(/^\//, '')))) fail(rel, `dead link: ${href}`);
        continue;
      }
      if (hash && !idsByFile.get(target)?.has(decodeURIComponent(hash))) {
        fail(rel, `link to a missing anchor: ${href}`);
      }
    }

    // ── referenced assets ──────────────────────────────────────────────────
    for (const src of [
      ...attrValues(html, /<script[^>]*\ssrc="([^"]+)"/g),
      ...attrValues(html, /<link[^>]*\srel="stylesheet"[^>]*\shref="([^"]+)"/g),
    ]) {
      if (/^https?:/.test(src)) continue;
      if (!existsSync(join(DIST_DIR, src.replace(/^\//, '')))) fail(rel, `missing asset: ${src}`);
    }
  }

  // ── sitemap ──────────────────────────────────────────────────────────────
  const sitemapPath = join(DIST_DIR, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    fail('sitemap.xml', 'not generated');
  } else {
    const locs = attrValues(readFileSync(sitemapPath, 'utf8'), /<loc>([^<]+)<\/loc>/g);
    if (!locs.length) fail('sitemap.xml', 'contains no URLs');
    const listed = new Set<string>();
    for (const loc of locs) {
      if (!loc.startsWith(ORIGIN)) fail('sitemap.xml', `URL is not on ${ORIGIN}: ${loc}`);
      const target = resolveUrlPath(loc.slice(ORIGIN.length) || '/');
      if (!target) fail('sitemap.xml', `URL does not resolve to a built page: ${loc}`);
      else listed.add(target);
    }
    // The reverse direction matters too: a page nobody links to and the sitemap omits
    // is a page that will not be found.
    for (const file of pages) {
      if (!listed.has(file)) fail(relative(DIST_DIR, file), 'built but absent from sitemap.xml');
    }
  }

  if (failures.length) {
    console.error(`verify: ${failures.length} problem(s)\n`);
    for (const { file, message } of failures) console.error(`  ${file}: ${message}`);
    process.exit(1);
  }
  console.log(`verify: ${pages.length} pages — links, anchors, canonicals, assets and sitemap all consistent`);
};

main();
