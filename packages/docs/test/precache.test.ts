import { afterEach, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { offlineFiles, precacheFiles } from '../build/service-worker.ts';

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));
it('precaches canonical homes and entry dependencies without unrelated documents or lazy chunks', () => {
  const root = mkdtempSync(join(tmpdir(), 'docs-precache-'));
  roots.push(root);
  mkdirSync(join(root, '.vite'));
  mkdirSync(join(root, 'fonts'));
  writeFileSync(join(root, 'fonts/body.woff2'), 'font');
  writeFileSync(
    join(root, '.vite/manifest.json'),
    JSON.stringify({
      'main.ts': {
        file: 'assets/docs.js',
        isEntry: true,
        imports: ['shared'],
        dynamicImports: ['../ranui/dist/index.js', 'pdf'],
        css: ['assets/docs.css'],
      },
      '../ranui/dist/index.js': { file: 'assets/ranui.js', imports: ['runtime'], dynamicImports: ['pdf'] },
      runtime: { file: 'assets/runtime.js' },
      shared: { file: 'assets/shared.js' },
      pdf: { file: 'assets/pdf.js' },
      'font.woff2': { file: 'assets/mono.woff2' },
    }),
  );
  expect(precacheFiles(root, { js: ['/assets/docs.js'], css: ['/assets/docs.css'] })).toEqual([
    '/',
    '/cn/',
    '/ja/',
    '/es/',
    '/pt/',
    '/ko/',
    '/de/',
    '/fa/',
    '/404.html',
    '/assets/docs.js',
    '/assets/docs.css',
    '/assets/shared.js',
    '/assets/ranui.js',
    '/assets/runtime.js',
    '/assets/mono.woff2',
    '/fonts/body.woff2',
  ]);
});

it('inventories all docs, lazy assets and search using canonical cache URLs and content revisions', () => {
  const root = mkdtempSync(join(tmpdir(), 'docs-offline-'));
  roots.push(root);
  mkdirSync(join(root, 'cn'), { recursive: true });
  mkdirSync(join(root, 'assets'));
  mkdirSync(join(root, 'search'));
  for (const path of [
    'index.html',
    'cn/index.html',
    'cn/中文.html',
    'assets/pdf.js',
    'search/en.json',
    'llms-full.txt',
    'sw.js',
    '_headers',
  ])
    writeFileSync(join(root, path), path);
  const files = offlineFiles(root);
  expect(files.map((file) => file.url)).toEqual(
    expect.arrayContaining([
      '/',
      '/cn/',
      '/cn/%E4%B8%AD%E6%96%87',
      '/assets/pdf.js',
      '/search/en.json',
      '/llms-full.txt',
    ]),
  );
  expect(files).toHaveLength(6);
  const previous = files.find((file) => file.url === '/assets/pdf.js')!.revision;
  writeFileSync(join(root, 'assets/pdf.js'), 'updated');
  expect(offlineFiles(root).find((file) => file.url === '/assets/pdf.js')!.revision).not.toBe(previous);
});
