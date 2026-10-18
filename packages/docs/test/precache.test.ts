import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { createOfflineManifest } from '../build/offline.ts';

it('precaches only the entry static import closure and shared styles, while planning idle resources separately by language', () => {
  const dist = mkdtempSync(join(tmpdir(), 'ran-precache-'));
  try {
    mkdirSync(join(dist, 'assets'));
    mkdirSync(join(dist, '.vite'));
    for (const file of [
      'assets/docs.entry.js',
      'assets/common.js',
      'assets/lazy.js',
      'assets/style.css',
      'assets/math.woff2',
      'assets/movie.mp4',
      'icon.png',
    ])
      writeFileSync(join(dist, file), 'fixture');
    writeFileSync(
      join(dist, '.vite/manifest.json'),
      JSON.stringify({
        main: { file: 'assets/docs.entry.js', isEntry: true, imports: ['common'], dynamicImports: ['lazy'] },
        common: { file: 'assets/common.js', imports: ['main'] },
        lazy: { file: 'assets/lazy.js', assets: ['assets/math.woff2'] },
        style: { file: 'assets/style.css' },
      }),
    );
    expect(
      createOfflineManifest(dist, [
        { url: '/guide/', locale: { lang: 'en' }, kind: 'page' },
        { url: '/cn/guide/', locale: { lang: 'zh' }, kind: 'page' },
        { url: '/news.xml', locale: { lang: 'en' }, kind: 'feed' },
      ]),
    ).toEqual({
      shared: ['/assets/common.js', '/assets/docs.entry.js', '/assets/style.css', '/icon.png'],
      deferred: ['/assets/lazy.js', '/assets/math.woff2'],
      locales: { en: ['/guide/', '/search/en.json'], zh: ['/cn/guide/', '/search/zh.json'] },
    });
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
});
