import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  RouterCore,
  createRouter,
  enableMpaViewTransitions,
  useRouter,
} from '@/utils/router';
import type { RouterComponentElement } from '@/utils/router';

// ── helpers ────────────────────────────────────────────────────────────────

function makeMockComponent(): RouterComponentElement & { syncCount: number } {
  return {
    _syncRoutes: vi.fn(),
    syncCount: 0,
  } as unknown as RouterComponentElement & { syncCount: number };
}

// ── setup / teardown ───────────────────────────────────────────────────────

beforeEach(() => {
  window.history.pushState(null, '', '/');
});

afterEach(() => {
  // Clean up any global router and injected MPA styles after each test.
  useRouter()?.destroy();
  document.head.querySelectorAll('style').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

// ── createRouter / useRouter ───────────────────────────────────────────────

describe('createRouter / useRouter', () => {
  it('useRouter returns null before createRouter is called', () => {
    expect(useRouter()).toBeNull();
  });

  it('createRouter returns a RouterCore instance', () => {
    const router = createRouter();
    expect(router).toBeInstanceOf(RouterCore);
  });

  it('useRouter returns the created router', () => {
    const router = createRouter();
    expect(useRouter()).toBe(router);
  });

  it('calling createRouter twice replaces the previous instance', () => {
    const first = createRouter();
    const second = createRouter();
    expect(useRouter()).toBe(second);
    expect(useRouter()).not.toBe(first);
  });

  it('second createRouter call destroys the first (clears MPA style)', () => {
    createRouter({ viewTransition: 'mpa' });
    expect(document.head.querySelector('style')).not.toBeNull();
    createRouter(); // replaces — should remove the MPA style
    expect(document.head.querySelector('style')).toBeNull();
  });
});

// ── RouterCore default config ──────────────────────────────────────────────

describe('RouterCore defaults', () => {
  it('mode defaults to history', () => {
    const router = createRouter();
    expect(router.mode).toBe('history');
  });

  it('base defaults to empty string', () => {
    const router = createRouter();
    expect(router.base).toBe('');
  });

  it('routes defaults to empty array', () => {
    const router = createRouter();
    expect(router.routes).toEqual([]);
  });

  it('currentRoute is null before first navigation', () => {
    const router = createRouter();
    expect(router.currentRoute).toBeNull();
  });

  it('routes returns a copy, not the original array', () => {
    const routes = [{ path: '/' }];
    const router = createRouter({ routes });
    expect(router.routes).not.toBe(routes);
  });
});

// ── push / replace ─────────────────────────────────────────────────────────

describe('push', () => {
  it('updates window.location.pathname', async () => {
    const router = createRouter();
    await router.push('/about');
    expect(window.location.pathname).toBe('/about');
  });

  it('adds a history entry (pushState)', async () => {
    const router = createRouter();
    const spy = vi.spyOn(window.history, 'pushState');
    await router.push('/contact');
    expect(spy).toHaveBeenCalledWith({ path: '/contact' }, '', '/contact');
  });

  it('sets currentRoute after navigation', async () => {
    const router = createRouter();
    await router.push('/page');
    expect(router.currentRoute?.path).toBe('/page');
  });

  it('parses query string into currentRoute.query', async () => {
    const router = createRouter();
    await router.push('/search?q=hello&page=2');
    expect(router.currentRoute?.query).toEqual({ q: 'hello', page: '2' });
    expect(router.currentRoute?.path).toBe('/search');
    expect(router.currentRoute?.fullPath).toBe('/search?q=hello&page=2');
  });
});

describe('replace', () => {
  it('uses replaceState instead of pushState', async () => {
    const router = createRouter();
    const spy = vi.spyOn(window.history, 'replaceState');
    await router.replace('/replaced');
    expect(spy).toHaveBeenCalledWith({ path: '/replaced' }, '', '/replaced');
  });

  it('updates window.location.pathname', async () => {
    const router = createRouter();
    await router.replace('/new-page');
    expect(window.location.pathname).toBe('/new-page');
  });
});

// ── hash mode ──────────────────────────────────────────────────────────────

describe('hash mode', () => {
  it('push produces a hash URL', async () => {
    const router = createRouter({ mode: 'hash' });
    const spy = vi.spyOn(window.history, 'pushState');
    await router.push('/foo');
    expect(spy).toHaveBeenCalledWith({ path: '/foo' }, '', '#/foo');
  });

  it('getCurrentPath reads from hash', async () => {
    const router = createRouter({ mode: 'hash' });
    window.history.pushState(null, '', '#/hash-page');
    expect(router._getCurrentPath()).toBe('/hash-page');
  });

  it('empty hash returns /', () => {
    const router = createRouter({ mode: 'hash' });
    window.history.pushState(null, '', '#');
    expect(router._getCurrentPath()).toBe('/');
  });
});

// ── base path ──────────────────────────────────────────────────────────────

describe('base path', () => {
  it('prepends base to pushState URL', async () => {
    const router = createRouter({ base: '/app' });
    const spy = vi.spyOn(window.history, 'pushState');
    await router.push('/home');
    expect(spy).toHaveBeenCalledWith({ path: '/home' }, '', '/app/home');
  });

  it('strips base from getCurrentPath', () => {
    const router = createRouter({ base: '/app' });
    window.history.pushState(null, '', '/app/home');
    expect(router._getCurrentPath()).toBe('/home');
  });

  it('getCurrentPath returns / when path equals base', () => {
    const router = createRouter({ base: '/app' });
    window.history.pushState(null, '', '/app');
    expect(router._getCurrentPath()).toBe('/');
  });
});

// ── back / forward / go ────────────────────────────────────────────────────

describe('back / forward / go', () => {
  it('back delegates to window.history.back', () => {
    const router = createRouter();
    const spy = vi.spyOn(window.history, 'back');
    router.back();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('forward delegates to window.history.forward', () => {
    const router = createRouter();
    const spy = vi.spyOn(window.history, 'forward');
    router.forward();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('go delegates to window.history.go with the given delta', () => {
    const router = createRouter();
    const spy = vi.spyOn(window.history, 'go');
    router.go(-2);
    expect(spy).toHaveBeenCalledWith(-2);
  });
});

// ── navigation guards ──────────────────────────────────────────────────────

describe('beforeEach', () => {
  it('guard receives to and from locations', async () => {
    const router = createRouter();
    await router.push('/start');

    const guard = vi.fn((_to, _from, next) => next());
    router.beforeEach(guard);
    await router.push('/end');

    expect(guard).toHaveBeenCalledOnce();
    const [to, from] = guard.mock.calls[0];
    expect(to.path).toBe('/end');
    expect(from?.path).toBe('/start');
  });

  it('next() allows navigation', async () => {
    const router = createRouter();
    router.beforeEach((_to, _from, next) => next());
    await router.push('/allowed');
    expect(window.location.pathname).toBe('/allowed');
  });

  it('next(false) cancels navigation', async () => {
    const router = createRouter();
    window.history.pushState(null, '', '/original');
    router.beforeEach((_to, _from, next) => next(false));
    await router.push('/blocked');
    expect(window.location.pathname).toBe('/original');
  });

  it('next(path) redirects to another path', async () => {
    const router = createRouter();
    router.beforeEach((to, _from, next) => {
      if (to.path === '/protected') next('/login');
      else next();
    });
    await router.push('/protected');
    expect(window.location.pathname).toBe('/login');
  });

  it('multiple guards run in registration order', async () => {
    const router = createRouter();
    const order: string[] = [];
    router.beforeEach((_to, _from, next) => { order.push('first'); next(); });
    router.beforeEach((_to, _from, next) => { order.push('second'); next(); });
    await router.push('/multi');
    expect(order).toEqual(['first', 'second']);
  });

  it('second guard does not run if first cancels', async () => {
    const router = createRouter();
    const second = vi.fn((_to, _from, next) => next());
    router.beforeEach((_to, _from, next) => next(false));
    router.beforeEach(second);
    await router.push('/blocked');
    expect(second).not.toHaveBeenCalled();
  });

  it('returns an unsubscribe function that removes the guard', async () => {
    const router = createRouter();
    const guard = vi.fn((_to, _from, next) => next());
    const unsubscribe = router.beforeEach(guard);
    unsubscribe();
    await router.push('/page');
    expect(guard).not.toHaveBeenCalled();
  });
});

// ── afterEach ──────────────────────────────────────────────────────────────

describe('afterEach', () => {
  it('fires after navigation completes', async () => {
    const router = createRouter();
    const handler = vi.fn();
    router.afterEach(handler);
    await router.push('/done');
    expect(handler).toHaveBeenCalledOnce();
    const [to] = handler.mock.calls[0];
    expect(to.path).toBe('/done');
  });

  it('returns an unsubscribe function', async () => {
    const router = createRouter();
    const handler = vi.fn();
    const unsub = router.afterEach(handler);
    unsub();
    await router.push('/page');
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not fire when navigation is cancelled by a guard', async () => {
    const router = createRouter();
    router.beforeEach((_to, _from, next) => next(false));
    const handler = vi.fn();
    router.afterEach(handler);
    await router.push('/blocked');
    expect(handler).not.toHaveBeenCalled();
  });
});

// ── onRouteChange ──────────────────────────────────────────────────────────

describe('onRouteChange', () => {
  it('fires on every navigation', async () => {
    const router = createRouter();
    const handler = vi.fn();
    router.onRouteChange(handler);
    await router.push('/a');
    await router.push('/b');
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('returns an unsubscribe function', async () => {
    const router = createRouter();
    const handler = vi.fn();
    const unsub = router.onRouteChange(handler);
    unsub();
    await router.push('/page');
    expect(handler).not.toHaveBeenCalled();
  });
});

// ── _bind / _unbind / _notify ──────────────────────────────────────────────

describe('component binding', () => {
  it('_bind registers a component; _notify calls _syncRoutes on it', async () => {
    const router = createRouter();
    const comp = makeMockComponent();
    router._bind(comp);
    await router.push('/synced');
    expect(comp._syncRoutes).toHaveBeenCalled();
  });

  it('_unbind stops the component from receiving updates', async () => {
    const router = createRouter();
    const comp = makeMockComponent();
    router._bind(comp);
    router._unbind(comp);
    await router.push('/after-unbind');
    expect(comp._syncRoutes).not.toHaveBeenCalled();
  });

  it('multiple components all receive _syncRoutes', async () => {
    const router = createRouter();
    const a = makeMockComponent();
    const b = makeMockComponent();
    router._bind(a);
    router._bind(b);
    await router.push('/both');
    expect(a._syncRoutes).toHaveBeenCalled();
    expect(b._syncRoutes).toHaveBeenCalled();
  });
});

// ── destroy ────────────────────────────────────────────────────────────────

describe('destroy', () => {
  it('unbinds all components so they no longer receive updates', async () => {
    const router = createRouter();
    const comp = makeMockComponent();
    router._bind(comp);
    router.destroy();
    router._notify();
    expect(comp._syncRoutes).not.toHaveBeenCalled();
  });

  it('removes the MPA style element', () => {
    const router = createRouter({ viewTransition: 'mpa' });
    expect(document.head.querySelector('style')).not.toBeNull();
    router.destroy();
    expect(document.head.querySelector('style')).toBeNull();
  });
});

// ── _buildLocation ─────────────────────────────────────────────────────────

describe('_buildLocation', () => {
  it('parses plain path', () => {
    const router = createRouter();
    const loc = router._buildLocation('/users/42');
    expect(loc).toEqual({ path: '/users/42', params: {}, query: {}, fullPath: '/users/42' });
  });

  it('parses path with query string', () => {
    const router = createRouter();
    const loc = router._buildLocation('/search?q=test&sort=asc');
    expect(loc.path).toBe('/search');
    expect(loc.query).toEqual({ q: 'test', sort: 'asc' });
    expect(loc.fullPath).toBe('/search?q=test&sort=asc');
  });

  it('returns / for empty path', () => {
    const router = createRouter();
    const loc = router._buildLocation('');
    expect(loc.path).toBe('/');
    expect(loc.fullPath).toBe('/');
  });
});

// ── MPA view transitions ───────────────────────────────────────────────────

describe('MPA view transitions', () => {
  it('viewTransition: mpa injects @view-transition style', () => {
    createRouter({ viewTransition: 'mpa' });
    const style = document.head.querySelector('style');
    expect(style?.textContent).toContain('@view-transition');
  });

  it('viewTransition: both also injects the style', () => {
    createRouter({ viewTransition: 'both' });
    expect(document.head.querySelector('style')?.textContent).toContain('@view-transition');
  });

  it('viewTransition: spa does NOT inject the style', () => {
    createRouter({ viewTransition: 'spa' });
    expect(document.head.querySelector('style')).toBeNull();
  });

  it('style is injected only once when createRouter is called twice with mpa', () => {
    createRouter({ viewTransition: 'mpa' });
    createRouter({ viewTransition: 'mpa' });
    expect(document.head.querySelectorAll('style')).toHaveLength(1);
  });

  it('onPageSwap registers a handler and returns unsubscribe', () => {
    const router = createRouter({ viewTransition: 'mpa' });
    const handler = vi.fn();
    const unsub = router.onPageSwap(handler);
    window.dispatchEvent(new Event('pageswap'));
    expect(handler).toHaveBeenCalledOnce();
    unsub();
    window.dispatchEvent(new Event('pageswap'));
    expect(handler).toHaveBeenCalledOnce(); // no extra call after unsub
  });

  it('onPageReveal registers a handler and returns unsubscribe', () => {
    const router = createRouter({ viewTransition: 'mpa' });
    const handler = vi.fn();
    const unsub = router.onPageReveal(handler);
    window.dispatchEvent(new Event('pagereveal'));
    expect(handler).toHaveBeenCalledOnce();
    unsub();
    window.dispatchEvent(new Event('pagereveal'));
    expect(handler).toHaveBeenCalledOnce();
  });
});

// ── SPA view transitions ───────────────────────────────────────────────────

describe('SPA view transitions', () => {
  it('gracefully degrades when document.startViewTransition is absent', async () => {
    const router = createRouter({ viewTransition: 'spa' });
    // jsdom does not implement startViewTransition — navigation must still complete.
    await expect(router.push('/spa-page')).resolves.toBeUndefined();
    expect(window.location.pathname).toBe('/spa-page');
  });

  it('wraps _notify in startViewTransition when available', async () => {
    const mockTransition = vi.fn((cb: () => void) => cb());
    Object.defineProperty(document, 'startViewTransition', {
      value: mockTransition,
      configurable: true,
      writable: true,
    });

    const router = createRouter({ viewTransition: 'spa' });
    await router.push('/transition-page');
    expect(mockTransition).toHaveBeenCalled();

    // Clean up
    Object.defineProperty(document, 'startViewTransition', {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });
});

// ── enableMpaViewTransitions ───────────────────────────────────────────────

describe('enableMpaViewTransitions', () => {
  it('injects @view-transition style', () => {
    enableMpaViewTransitions();
    expect(document.head.querySelector('style')?.textContent).toContain('@view-transition');
  });

  it('returns a cleanup that removes the style', () => {
    const cleanup = enableMpaViewTransitions();
    cleanup();
    expect(document.head.querySelector('style')).toBeNull();
  });

  it('calling it twice does not inject duplicate styles', () => {
    enableMpaViewTransitions();
    enableMpaViewTransitions();
    expect(document.head.querySelectorAll('style')).toHaveLength(1);
  });
});

// ── SSR guard ──────────────────────────────────────────────────────────────

describe('SSR guards (window mocked as undefined)', () => {
  it('_getCurrentPath returns / when window is undefined', () => {
    const router = createRouter();
    // Temporarily shadow window for this assertion only.
    const origWindow = globalThis.window;
    (globalThis as Record<string, unknown>).window = undefined;
    try {
      expect(router._getCurrentPath()).toBe('/');
    } finally {
      globalThis.window = origWindow;
    }
  });

  it('back() is a no-op when window is undefined', () => {
    const router = createRouter();
    const origWindow = globalThis.window;
    (globalThis as Record<string, unknown>).window = undefined;
    try {
      expect(() => router.back()).not.toThrow();
    } finally {
      globalThis.window = origWindow;
    }
  });

  it('forward() is a no-op when window is undefined', () => {
    const router = createRouter();
    const origWindow = globalThis.window;
    (globalThis as Record<string, unknown>).window = undefined;
    try {
      expect(() => router.forward()).not.toThrow();
    } finally {
      globalThis.window = origWindow;
    }
  });

  it('go() is a no-op when window is undefined', () => {
    const router = createRouter();
    const origWindow = globalThis.window;
    (globalThis as Record<string, unknown>).window = undefined;
    try {
      expect(() => router.go(-1)).not.toThrow();
    } finally {
      globalThis.window = origWindow;
    }
  });
});
