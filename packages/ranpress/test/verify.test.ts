/**
 * Media references in the built output.
 *
 * Article screenshots were written relative to their markdown source and never copied
 * into the output, so every one of them 404'd in production while the build passed.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyDist } from '../src/verify.ts';

const ORIGIN = 'https://example.test';
let dist: string;

const put = (rel: string, body = ''): void => {
  const full = join(dist, rel);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(full, body);
};

const page = (canonical: string, body: string): string =>
  `<html><head><title>t</title><meta name="description" content="d">` +
  `<link rel="canonical" href="${ORIGIN}${canonical}"></head><body>${body}</body></html>`;

const mediaFailures = (): string[] =>
  verifyDist({ distDir: dist, origin: ORIGIN })
    .filter((f) => /^(missing|malformed) media/.test(f.message))
    // `file` is a native relative path, so Windows reports `src\\article\\post.html`.
    .map((f) => `${f.file.replaceAll('\\', '/')}: ${f.message}`);

afterEach(() => rmSync(dist, { recursive: true, force: true }));

describe('verifyDist media', () => {
  it('reports an image whose relative src is not in the output', () => {
    dist = mkdtempSync(join(tmpdir(), 'ranpress-verify-'));
    put('src/article/post.html', page('/src/article/post', '<img src="../../assets/article/shot.webp" alt="">'));
    expect(mediaFailures()).toEqual(['src/article/post.html: missing media: ../../assets/article/shot.webp']);
  });

  it('accepts relative and absolute media that exist, and skips remote ones', () => {
    dist = mkdtempSync(join(tmpdir(), 'ranpress-verify-'));
    put('assets/article/shot.webp');
    put('assets/article/clip.mp4');
    put(
      'src/article/post.html',
      page(
        '/src/article/post',
        '<img src="../../assets/article/shot.webp" alt="">' +
          '<video controls src="/assets/article/clip.mp4"></video>' +
          '<img src="https://cdn.example.test/x.png" alt=""><img src="data:image/png;base64,AA" alt="">',
      ),
    );
    expect(mediaFailures()).toEqual([]);
  });

  it('resolves a relative src the way the browser does, clamping `..` at the site root', () => {
    // A page served one level shallower than its source keeps working in the browser:
    // `../../../assets` from `/articles/sort/` stops at `/`.
    dist = mkdtempSync(join(tmpdir(), 'ranpress-verify-'));
    put('assets/sort.png');
    put('articles/sort/index.html', page('/articles/sort/', '<img src="../../../assets/sort.png" alt="">'));
    expect(mediaFailures()).toEqual([]);
  });

  it('checks <source> inside a video', () => {
    dist = mkdtempSync(join(tmpdir(), 'ranpress-verify-'));
    put('src/a.html', page('/src/a', '<video controls><source src="../assets/gone.mp4" type="video/mp4"></video>'));
    expect(mediaFailures()).toEqual(['src/a.html: missing media: ../assets/gone.mp4']);
  });

  it('reads HTML-escaped ampersands and reports a malformed URL instead of throwing', () => {
    dist = mkdtempSync(join(tmpdir(), 'ranpress-verify-'));
    put('assets/a&b.png');
    put(
      'src/a.html',
      page('/src/a', '<img src="../assets/a&amp;b.png" alt=""><img src=\'../assets/%E0%A4%A.png\' alt="">'),
    );
    expect(mediaFailures()).toEqual(['src/a.html: malformed media URL: ../assets/%E0%A4%A.png']);
  });

  it('checks every candidate in a srcset', () => {
    dist = mkdtempSync(join(tmpdir(), 'ranpress-verify-'));
    put('assets/shot.webp');
    put(
      'src/a.html',
      page(
        '/src/a',
        '<img src="../assets/shot.webp" srcset="../assets/shot.webp 1x, ../assets/shot@2x.webp 2x" alt="">',
      ),
    );
    expect(mediaFailures()).toEqual(['src/a.html: missing media: ../assets/shot@2x.webp']);
  });

  it('does not split a data: URI inside a srcset', () => {
    dist = mkdtempSync(join(tmpdir(), 'ranpress-verify-'));
    put('assets/shot.webp');
    put(
      'src/a.html',
      page(
        '/src/a',
        '<img src="../assets/shot.webp" srcset="data:image/png;base64,AAAA 1x, ../assets/shot.webp 2x" alt="">',
      ),
    );
    expect(mediaFailures()).toEqual([]);
  });
});
