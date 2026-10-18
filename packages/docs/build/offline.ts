import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

interface Chunk {
  file: string;
  isEntry?: boolean;
  imports?: string[];
  css?: string[];
  assets?: string[];
}

/** Only the initial static graph is precached; other resources follow actual visits. */
export const createOfflineManifest = (dist: string) => {
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
  return { shared: [...shared].sort() };
};
