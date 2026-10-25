/**
 * The host model is the one piece three callers depend on — the dev server, the preview
 * server and the verifier — and getting it wrong is not a local inconvenience: an earlier
 * disagreement between two copies of it shipped 904 canonical URLs pointing at a URL the
 * host redirects away from.
 *
 * Every expectation here was measured against Cloudflare Pages (`curl -o /dev/null -w
 * '%{http_code} %{redirect_url}'` against ran.chaxus.com), not inferred from its docs.
 */
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { followHost, followRedirects, matchRedirect, parseRedirects, resolveHost } from '../src/host.ts';

let dist: string;

beforeAll(() => {
  dist = mkdtempSync(join(tmpdir(), 'ranpress-host-'));
  const put = (rel: string): void => {
    const full = join(dist, rel);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, rel);
  };
  put('index.html');
  put('about.html'); // a page: served directly at /about
  put('blog/index.html'); // a section index: served at /blog/
  put('sitemap.xml'); // an exact file, no .html sibling
  put('404.html');
});

afterAll(() => rmSync(dist, { recursive: true, force: true }));

describe('resolveHost', () => {
  it('serves the root', () => {
    expect(resolveHost(dist, '/')).toMatchObject({ kind: 'file' });
  });

  it('serves a page at its extensionless URL, directly', () => {
    // The whole point of writing `about.html` rather than `about/index.html`.
    expect(resolveHost(dist, '/about')).toMatchObject({ kind: 'file' });
  });

  it('serves a section index at its trailing-slash URL', () => {
    expect(resolveHost(dist, '/blog/')).toMatchObject({ kind: 'file' });
  });

  it('redirects the extensionless URL of a directory to its trailing-slash form', () => {
    expect(resolveHost(dist, '/blog')).toEqual({ kind: 'redirect', to: '/blog/', status: 308 });
  });

  it('redirects in reverse when the page is a leaf .html', () => {
    expect(resolveHost(dist, '/about/')).toEqual({ kind: 'redirect', to: '/about', status: 308 });
  });

  it('does not reverse-redirect an exact file', () => {
    // Measured: /sitemap.xml serves 200, /sitemap.xml/ is a plain 404.
    expect(resolveHost(dist, '/sitemap.xml')).toMatchObject({ kind: 'file' });
    expect(resolveHost(dist, '/sitemap.xml/')).toEqual({ kind: 'notfound' });
  });

  it('serves an explicit .html URL', () => {
    expect(resolveHost(dist, '/about.html')).toMatchObject({ kind: 'file' });
  });

  it('reports an unknown path as not found', () => {
    expect(resolveHost(dist, '/nope')).toEqual({ kind: 'notfound' });
  });

  it('ignores the query string and the fragment', () => {
    expect(resolveHost(dist, '/about?x=1')).toMatchObject({ kind: 'file' });
    expect(resolveHost(dist, '/about#frag')).toMatchObject({ kind: 'file' });
  });

  describe('refuses to read outside the output directory', () => {
    // Any page open in the browser can issue these while the dev server is running.
    for (const attack of ['/../../../../etc/passwd', '/..%2f..%2f..%2fetc%2fpasswd', '/%2e%2e/%2e%2e/etc/passwd']) {
      it(attack, () => expect(resolveHost(dist, attack)).toEqual({ kind: 'notfound' }));
    }

    it('a malformed escape returns not found rather than throwing', () => {
      expect(() => resolveHost(dist, '/%ZZ')).not.toThrow();
      expect(resolveHost(dist, '/%ZZ')).toEqual({ kind: 'notfound' });
    });

    it('a NUL byte cannot truncate the path at the syscall boundary', () => {
      expect(resolveHost(dist, '/about%00.png')).toEqual({ kind: 'notfound' });
    });
  });
});

describe('followHost', () => {
  it('reports a direct hit as not redirecting', () => {
    expect(followHost(dist, '/about')?.redirects).toBe(false);
  });

  it('follows the redirect and says that it did', () => {
    // This is the distinction a canonical or a sitemap entry lives or dies on: the URL
    // resolves to a real page, and is still the wrong URL to publish.
    expect(followHost(dist, '/blog')).toMatchObject({ redirects: true });
  });

  it('returns null when nothing resolves', () => {
    expect(followHost(dist, '/nope')).toBeNull();
  });
});

describe('_redirects', () => {
  const rules = parseRedirects(
    [
      '# a retired page, then the trees that moved',
      '/old/page /about 301',
      '/old/* /blog/:splat',
      '/*.html /:splat 301',
    ].join('\n'),
  );

  it('parses `from to [status]`, defaulting to 301', () => {
    expect(rules).toEqual([
      { from: '/old/page', to: '/about', status: 301 },
      { from: '/old/*', to: '/blog/:splat', status: 301 },
      { from: '/*.html', to: '/:splat', status: 301 },
    ]);
  });

  it('rejects the forms it would otherwise misread', () => {
    expect(() => parseRedirects('/a/:id /b/:id 301')).toThrow(/named placeholders/);
    expect(() => parseRedirects('/a/* /b 200')).toThrow(/not a redirect/);
    expect(() => parseRedirects('/a/*/b/* /c 301')).toThrow(/more than one/);
  });

  it('takes the first matching rule and fills in the splat', () => {
    expect(matchRedirect(rules, '/old/page')).toEqual({ to: '/about', status: 301 });
    expect(matchRedirect(rules, '/old/x/y/')).toEqual({ to: '/blog/x/y/', status: 301 });
    expect(matchRedirect(rules, '/old/')).toEqual({ to: '/blog/', status: 301 });
    expect(matchRedirect(rules, '/old')).toBeNull();
  });

  it('applies a redirect before an existing file, as the host does', () => {
    expect(resolveHost(dist, '/about.html', rules)).toEqual({ kind: 'redirect', to: '/about', status: 301 });
  });

  it('follows every hop and counts them', () => {
    expect(followRedirects(dist, '/old/page', rules)).toEqual({ file: join(dist, 'about.html'), hops: 1 });
    expect(followRedirects(dist, '/old', rules)).toBeNull();
    // `/old/` → `/blog/` (rule) → served: one hop.
    expect(followRedirects(dist, '/old/', rules)?.hops).toBe(1);
  });

  it('stops a redirect loop', () => {
    expect(followRedirects(dist, '/a', parseRedirects('/a /b\n/b /a'))).toBeNull();
  });
});
