/** Install the reader shell first, then cache the complete site in idle batches. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import type { Assets } from 'ranpress';
import { LOCALES, ROOT_LOCALE } from './config.ts';

interface Chunk {
  file: string;
  imports?: string[];
  css?: string[];
  isEntry?: boolean;
}
const previous = new Map<string, string[]>();

export const precacheFiles = (dist: string, assets: Assets): string[] => {
  const manifestFile = join(dist, '.vite/manifest.json');
  // Fast Markdown rebuilds remove the manifest but keep the same bundle dependencies.
  if (!existsSync(manifestFile) && previous.has(dist)) return previous.get(dist)!;
  const files = new Set([
    ...[ROOT_LOCALE, ...LOCALES.filter((locale) => locale !== ROOT_LOCALE)].map((locale) =>
      locale.dir ? `/${locale.dir}/` : '/',
    ),
    '/404.html',
    ...assets.js,
    ...assets.css,
  ]);
  if (existsSync(manifestFile)) {
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as Record<string, Chunk>;
    const visited = new Set<string>();
    const include = (key: string): void => {
      if (visited.has(key)) return;
      visited.add(key);
      const chunk = manifest[key];
      if (!chunk) return;
      files.add(`/${chunk.file}`);
      for (const css of chunk.css ?? []) files.add(`/${css}`);
      for (const dependency of chunk.imports ?? []) include(dependency);
    };
    for (const [key, chunk] of Object.entries(manifest)) if (chunk.isEntry) include(key);
    // ranui is dynamically imported on every page; the home also always shows this spinner.
    // Other dynamic imports (PDF, media engines, diagrams, grammars) remain on demand.
    for (const key of Object.keys(manifest)) {
      if (/\/ranui\/dist\/(?:index\.js|circle-line-[^/]+\.js)$/.test(key)) include(key);
    }
    for (const chunk of Object.values(manifest)) if (/\.woff2?$/.test(chunk.file)) files.add(`/${chunk.file}`);
  }
  const fonts = join(dist, 'fonts');
  if (existsSync(fonts)) {
    for (const font of readdirSync(fonts).sort()) if (/\.woff2?$/.test(font)) files.add(`/fonts/${font}`);
  }
  const result = [...files];
  previous.set(dist, result);
  return result;
};

export const offlineFiles = (dist: string): { url: string; revision: string }[] => {
  const files: { url: string; revision: string }[] = [];
  const walk = (dir: string, prefix = ''): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (
        entry.name.startsWith('.') ||
        ['sw.js', 'offline-manifest.json', '_headers', '_redirects'].includes(entry.name)
      )
        continue;
      const path = `${prefix}${entry.name}`;
      if (entry.isDirectory()) walk(join(dir, entry.name), `${path}/`);
      else {
        let url = `/${path}`;
        if (path === 'index.html') url = '/';
        else if (path.endsWith('/index.html')) url = `/${path.slice(0, -10)}`;
        else if (path.endsWith('.html') && path !== '404.html') url = `/${path.slice(0, -5)}`;
        files.push({
          url: encodeURI(url),
          revision: createHash('sha256')
            .update(readFileSync(join(dir, entry.name)))
            .digest('hex'),
        });
      }
    }
  };
  walk(dist);
  return files;
};

export const writeServiceWorker = (root: string, dist: string, assets?: Assets): void => {
  const manifestPath = join(dist, 'offline-manifest.json');
  const shell = assets
    ? precacheFiles(dist, assets)
    : (JSON.parse(readFileSync(manifestPath, 'utf8')).shell as string[]);
  const files = offlineFiles(dist);
  const source = readFileSync(join(root, 'public/sw.js'), 'utf8');
  const version = createHash('sha256').update(JSON.stringify({ files, shell })).update(source).digest('hex');
  writeFileSync(manifestPath, JSON.stringify({ version, shell, files }));
  writeFileSync(
    join(dist, 'sw.js'),
    `const SERVICE_WORK_CACHE_FILE_PATHS = ${JSON.stringify([...shell, '/offline-manifest.json'])};\nconst VERSION = ${JSON.stringify(version)};\n${source}`,
  );
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  writeServiceWorker(root, join(root, 'dist'));
}
