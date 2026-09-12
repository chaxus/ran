/**
 * The redirect path, exercised against a real server.
 *
 * CodeQL flagged `Location` being built from `req.url` (Server-side URL redirect,
 * medium). It was not exploitable: `resolveHost` refuses to resolve outside `distDir`, so
 * a redirect is only ever produced for a path that reached a real file inside the output.
 * But that guarantee lived two modules away from the header that depends on it, and the
 * point of these tests is that it now has to keep holding locally.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';
import { createPreviewServer } from '../src/serve.ts';

let dist: string;
let server: Server;
let origin: string;

/** `--path-as-is`: the request must reach the server exactly as written. */
const raw = async (path: string): Promise<{ status: number; location: string | null }> => {
  const res = await fetch(`${origin}${path}`, { redirect: 'manual' });
  await res.arrayBuffer();
  return { status: res.status, location: res.headers.get('location') };
};

beforeAll(async () => {
  dist = mkdtempSync(join(tmpdir(), 'ranpress-serve-'));
  const put = (rel: string): void => {
    const full = join(dist, rel);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, rel);
  };
  put('index.html');
  put('about.html');
  put('blog/index.html');
  put('404.html');

  server = createPreviewServer({ distDir: dist, port: 0 });
  await new Promise<void>((r) => server.once('listening', () => r()));
  const addr = server.address();
  origin = `http://127.0.0.1:${typeof addr === 'object' && addr ? addr.port : 0}`;
});

afterAll(async () => {
  await new Promise<void>((r) => server.close(() => r()));
  rmSync(dist, { recursive: true, force: true });
});

describe('redirects', () => {
  it('308s a directory page to its trailing-slash form', async () => {
    expect(await raw('/blog')).toEqual({ status: 308, location: '/blog/' });
  });

  it('308s a leaf page back from its trailing-slash form', async () => {
    expect(await raw('/about/')).toEqual({ status: 308, location: '/about' });
  });

  it('carries the query string across', async () => {
    expect((await raw('/blog?a=1&b=2')).location).toBe('/blog/?a=1&b=2');
  });

  it('escapes control characters in the query rather than emitting a second header', async () => {
    const { location } = await raw('/blog?a=1%0D%0AX-Injected:%20yes');
    expect(location).not.toMatch(/[\r\n]/);
    expect(location?.startsWith('/blog/?')).toBe(true);
  });
});

describe('cannot be turned into an open redirect', () => {
  for (const path of ['//evil.com', '//evil.com/', '/%2f%2fevil.com', '/.//evil.com']) {
    it(`404s ${path} instead of redirecting off-origin`, async () => {
      const { status, location } = await raw(path);
      expect(status).toBe(404);
      expect(location).toBeNull();
    });
  }

  it('never emits a Location that leaves the origin', async () => {
    for (const path of ['/blog', '/about/', '/blog?x=1']) {
      const { location } = await raw(path);
      expect(location).toMatch(/^\/(?!\/)/);
    }
  });
});

describe('serving', () => {
  it('serves the root', async () => {
    expect((await raw('/')).status).toBe(200);
  });

  it('serves a leaf page directly', async () => {
    expect((await raw('/about')).status).toBe(200);
  });

  it('answers an unknown path with the site 404', async () => {
    expect((await raw('/nope')).status).toBe(404);
  });

  it('refuses to read outside the output directory', async () => {
    expect((await raw('/../../../../etc/passwd')).status).toBe(404);
  });
});
