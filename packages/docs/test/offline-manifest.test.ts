import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';

it('uses canonical document URLs and includes component chunks while excluding large media', async () => {
  const dist = mkdtempSync(join(tmpdir(), 'ran-offline-'));
  try {
    mkdirSync(join(dist, 'assets'));
    mkdirSync(join(dist, 'fonts'));
    for (const file of [
      'assets/button.hash.js',
      'assets/diagram.hash.js',
      'assets/font.woff2',
      'fonts/geist-variable.woff2',
      'fonts/geist-mono-variable.woff2',
      'logo.svg',
      'movie.mp4',
      'clip.gif',
      'segment.ts',
    ]) {
      writeFileSync(join(dist, file), 'fixture');
    }
    const module = await import('../build/offline.ts').catch(() => null);
    const manifest = module?.createOfflineManifest(dist, [
      { url: '/guide', locale: { lang: 'en' }, kind: 'page' },
      { url: '/cn/', locale: { lang: 'zh' }, kind: 'page' },
      { url: '/404', locale: { lang: 'en' }, kind: 'notfound' },
    ]);
    expect(manifest?.locales).toEqual({ en: ['/guide', '/search/en.json'], zh: ['/cn/', '/search/zh.json'] });
    expect(manifest?.shared).toEqual([
      '/assets/button.hash.js',
      '/assets/diagram.hash.js',
      '/assets/font.woff2',
      '/logo.svg',
    ]);
  } finally {
    rmSync(dist, { recursive: true });
  }
});
