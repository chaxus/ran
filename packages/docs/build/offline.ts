import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

interface Chunk {
  file: string;
  isEntry?: boolean;
  imports?: string[];
  css?: string[];
  assets?: string[];
}

interface OfflinePage {
  url: string;
  locale: { lang: string };
  kind: string;
}

const IMAGE = /\.(?:png|jpe?g|svg|ico|webp|avif)$/i;
/** shiki's grammars and themes: only `r-markdown` loads them, and it shows plain code without. */
const HIGHLIGHTER = /(?:^|[\\/])(?:shiki|@shikijs)[\\/]/;

/** The built HTML file a page URL is served from, if it is in the output. */
const htmlFor = (dist: string, url: string): string | undefined =>
  [url.endsWith('/') ? `${url}index.html` : `${url}.html`, `${url}/index.html`]
    .map((file) => join(dist, file))
    .find((file) => existsSync(file));

/**
 * Keep install small; prepare language documents and remaining local assets only at idle.
 * Images are planned per language, from what that language's pages show, so a reader is
 * not sent every other language's illustrations; the highlighter's grammars are left to load
 * on use (see HIGHLIGHTER).
 */
export const createOfflineManifest = (dist: string, pages: readonly OfflinePage[] = []) => {
  const shared = new Set<string>();
  const highlighter = new Set<string>();
  const path = join(dist, '.vite/manifest.json');
  if (existsSync(path)) {
    const manifest: Record<string, Chunk> = JSON.parse(readFileSync(path, 'utf8'));
    const visited = new Set<string>();
    const visit = (key: string): void => {
      if (visited.has(key)) return;
      visited.add(key);
      const chunk = manifest[key];
      if (!chunk) throw new Error(`Missing static precache dependency: ${key}`);
      for (const file of [chunk.file, ...(chunk.css ?? []), ...(chunk.assets ?? [])]) shared.add(`/${file}`);
      for (const dependency of chunk.imports ?? []) visit(dependency);
    };
    for (const [key, chunk] of Object.entries(manifest)) {
      if (chunk.isEntry) visit(key);
      if (chunk.file.endsWith('.css')) shared.add(`/${chunk.file}`);
      if (HIGHLIGHTER.test(key)) highlighter.add(`/${chunk.file}`);
    }
  }
  for (const file of readdirSync(dist)) if (/^icon[^/]*\.png$/.test(file)) shared.add(`/${file}`);
  const deferred = new Set<string>();
  const walk = (dir: string, prefix = ''): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const url = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walk(join(dir, entry.name), url);
      else if (
        /\.(?:js|css|woff2?)$/i.test(entry.name) &&
        !shared.has(url) &&
        !highlighter.has(url) &&
        !/^\/(?:sw|offline-worker)\.js$/.test(url) &&
        !/^\/fonts\/geist(?:-mono)?-variable\.woff2$/.test(url)
      )
        deferred.add(url);
    }
  };
  walk(dist);
  const locales: Record<string, string[]> = {};
  const media: Record<string, Set<string>> = {};
  for (const page of pages) {
    if (page.kind !== 'page') continue;
    (locales[page.locale.lang] ??= []).push(page.url);
    const html = htmlFor(dist, page.url);
    if (!html) continue;
    const seen = (media[page.locale.lang] ??= new Set());
    // Article images are written relative to the page (`../../assets/article/…`).
    for (const [, ref] of readFileSync(html, 'utf8').matchAll(/(?:src|href|poster)="([^"#?]+)"/g)) {
      if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(ref!) || !IMAGE.test(ref!)) continue;
      let url: string;
      try {
        url = decodeURI(new URL(ref!, `https://x${page.url}`).pathname);
      } catch {
        continue; // A malformed `%` escape names no file; verify reports broken references.
      }
      if (!shared.has(url) && existsSync(join(dist, url))) seen.add(url);
    }
  }
  for (const [lang, urls] of Object.entries(locales)) {
    locales[lang] = [...new Set(urls)].sort().concat(`/search/${lang}.json`);
  }
  return {
    shared: [...shared].sort(),
    deferred: [...deferred].sort(),
    locales,
    media: Object.fromEntries(Object.entries(media).map(([lang, urls]) => [lang, [...urls].sort()])),
  };
};
