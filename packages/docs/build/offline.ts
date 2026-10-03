import { readdirSync } from 'node:fs';
import { join } from 'node:path';

interface OfflinePage {
  url: string;
  locale: { lang: string };
  kind: string;
}

/** Canonical routes, not .html output paths: the cache must match browser navigation. */
export const createOfflineManifest = (dist: string, pages: readonly OfflinePage[]) => {
  const shared: string[] = [];
  const walk = (dir: string, prefix = ''): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walk(join(dir, entry.name), path);
      else if (
        /\.(?:js|css|woff2?|png|jpe?g|svg|ico)$/i.test(entry.name) &&
        !/^\/(?:sw|offline-worker)\.js$/.test(path)
      ) {
        shared.push(path);
      }
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
  return { shared: shared.sort(), locales };
};
