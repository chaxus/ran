import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { Route } from '@/components/route';
import { Router } from '@/components/router';
import { createRouter, useRouter, clearSSGPath, getSSGPath } from '@/utils/router';
import { renderStaticPage, generateStaticPages } from '@/utils/ssg';
import '@/components/route';
import '@/components/router';

function buildApp(): HTMLElement {
  const routerEl = new Router();

  const home = new Route();
  home.setAttribute('path', '/');
  home.setAttribute('exact', '');
  home.textContent = 'Home page';

  const about = new Route();
  about.setAttribute('path', '/about');
  about.textContent = 'About page';

  const user = new Route();
  user.setAttribute('path', '/users/:id');
  user.textContent = 'User page';

  routerEl.appendChild(home);
  routerEl.appendChild(about);
  routerEl.appendChild(user);

  return routerEl as unknown as HTMLElement;
}

beforeEach(() => {
  createRouter({
    routes: [
      { path: '/', exact: true },
      { path: '/about' },
      { path: '/users/:id' },
    ],
  });
});

afterEach(() => {
  useRouter()?.destroy();
  clearSSGPath();
});

describe('renderStaticPage', () => {
  it('returns a non-empty HTML string', () => {
    const html = renderStaticPage(buildApp(), '/');
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('hides non-matching routes for /', () => {
    const html = renderStaticPage(buildApp(), '/');
    // home (exact /) is visible — no hidden attr
    // about is hidden
    expect(html).toMatch(/r-route[^>]*path="\/"/);
    expect(html).toMatch(/r-route[^>]*path="\/about"[^>]*hidden/);
  });

  it('hides non-matching routes for /about', () => {
    const html = renderStaticPage(buildApp(), '/about');
    expect(html).toMatch(/r-route[^>]*path="\/about"(?![^>]*hidden)/);
    expect(html).toMatch(/r-route[^>]*path="\/"[^>]*hidden/);
  });

  it('matches dynamic :id routes', () => {
    const html = renderStaticPage(buildApp(), '/users/42');
    expect(html).toMatch(/r-route[^>]*path="\/users\/:id"(?![^>]*hidden)/);
  });

  it('clears SSG path context after rendering', () => {
    renderStaticPage(buildApp(), '/about');
    expect(getSSGPath()).toBeNull();
  });

  it('clears SSG path even if renderToString would throw', () => {
    try {
      renderStaticPage(null as unknown as HTMLElement, '/about');
    } catch {
      // ignore
    }
    expect(getSSGPath()).toBeNull();
  });
});

describe('generateStaticPages', () => {
  it('returns one page per route from RouterCore.getStaticPaths()', () => {
    const pages = generateStaticPages(buildApp);
    expect(pages).toHaveLength(3);
    expect(pages.map((p) => p.path)).toEqual(['/', '/about', '/users/:id']);
  });

  it('each page has a non-empty html string', () => {
    const pages = generateStaticPages(buildApp);
    for (const page of pages) {
      expect(page.html.length).toBeGreaterThan(0);
    }
  });

  it('each page shows the correct route as visible', () => {
    const pages = generateStaticPages(buildApp);

    const home = pages.find((p) => p.path === '/')!;
    expect(home.html).toMatch(/r-route[^>]*path="\/about"[^>]*hidden/);

    const about = pages.find((p) => p.path === '/about')!;
    expect(about.html).toMatch(/r-route[^>]*path="\/about"(?![^>]*hidden)/);
  });

  it('accepts explicit paths override', () => {
    const pages = generateStaticPages(buildApp, { paths: ['/about', '/'] });
    expect(pages.map((p) => p.path)).toEqual(['/about', '/']);
  });

  it('accepts explicit paths without a router', () => {
    useRouter()?.destroy();
    // No global router — must provide paths explicitly
    const pages = generateStaticPages(buildApp, { paths: ['/about'] });
    expect(pages).toHaveLength(1);
    expect(pages[0].path).toBe('/about');
  });
});

describe('RouterCore.matchRoute', () => {
  it('returns matching route config', () => {
    const router = useRouter()!;
    const match = router.matchRoute('/about');
    expect(match?.path).toBe('/about');
  });

  it('returns null for unmatched path', () => {
    const router = useRouter()!;
    expect(router.matchRoute('/nonexistent')).toBeNull();
  });

  it('respects exact flag — /about does not match /', () => {
    const router = useRouter()!;
    const match = router.matchRoute('/about');
    // '/' with exact: true should NOT match '/about'
    expect(match?.path).not.toBe('/');
  });

  it('matches dynamic segment :id', () => {
    const router = useRouter()!;
    expect(router.matchRoute('/users/99')?.path).toBe('/users/:id');
  });
});

describe('RouterCore.getStaticPaths', () => {
  it('returns all route paths', () => {
    const paths = useRouter()!.getStaticPaths();
    expect(paths).toEqual(['/', '/about', '/users/:id']);
  });

  it('returns empty array when no routes configured', () => {
    createRouter({ routes: [] });
    expect(useRouter()!.getStaticPaths()).toEqual([]);
  });
});
