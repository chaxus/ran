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

/** Keep install small; prepare language documents and remaining local assets only at idle. */
export const createOfflineManifest = (dist: string, pages: readonly OfflinePage[] = []) => {
  const shared = new Set<string>();
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
    }
  }
  for (const file of readdirSync(dist)) if (/^icon[^/]*\.png$/.test(file)) shared.add(`/${file}`);
  const deferred = new Set<string>();
  const walk = (dir: string, prefix = ''): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const url = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walk(join(dir, entry.name), url);
      else if (
        /\.(?:js|css|woff2?|png|jpe?g|svg|ico|webp|avif)$/i.test(entry.name) &&
        !shared.has(url) &&
        !/^\/(?:sw|offline-worker)\.js$/.test(url) &&
        !/^\/fonts\/geist(?:-mono)?-variable\.woff2$/.test(url)
      )
        deferred.add(url);
    }
  };
  walk(dist);
  const locales: Record<string, string[]> = {};
  for (const page of pages) {
    if (page.kind === 'page') (locales[page.locale.lang] ??= []).push(page.url);
  }
  for (const [lang, urls] of Object.entries(locales)) {
    locales[lang] = [...new Set(urls)].sort().concat(`/search/${lang}.json`);
  }
  return { shared: [...shared].sort(), deferred: [...deferred].sort(), locales };
};
