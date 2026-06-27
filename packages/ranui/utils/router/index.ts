export interface RouteConfig {
  path: string;
  exact?: boolean;
  meta?: Record<string, unknown>;
  children?: RouteConfig[];
}

export type ViewTransitionMode = 'spa' | 'mpa' | 'both';

export interface RouterConfig {
  mode?: 'history' | 'hash';
  base?: string;
  routes?: RouteConfig[];
  /**
   * Enable View Transitions API.
   *
   * - `'spa'` / `true`  — wraps same-document DOM updates in document.startViewTransition().
   * - `'mpa'`           — injects `@view-transition { navigation: auto }` for cross-document
   *                       transitions; hooks pageswap/pagereveal for customization.
   * - `'both'`          — spa + mpa combined; best for apps that do both client-side and
   *                       full-page navigation.
   *
   * Gracefully degrades when the API is not supported.
   */
  viewTransition?: boolean | ViewTransitionMode;
}

export interface RouteLocation {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  fullPath: string;
}

export type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation | null,
  next: (redirect?: string | false) => void,
) => void;

export type RouteChangeHandler = (to: RouteLocation, from: RouteLocation | null) => void;

// pageswap / pagereveal are not yet in TypeScript's lib — use minimal structural types.
export interface PageSwapEvent extends Event {
  readonly viewTransition: ViewTransitionHandle | null;
  readonly activation: NavigationActivation | null;
}

export interface PageRevealEvent extends Event {
  readonly viewTransition: ViewTransitionHandle | null;
}

interface NavigationActivation {
  readonly entry: unknown;
  readonly from: unknown;
  readonly navigationType: string;
}

interface ViewTransitionHandle {
  readonly ready: Promise<void>;
  readonly finished: Promise<void>;
  readonly updateCallbackDone: Promise<void>;
  skipTransition(): void;
  types?: Set<string>;
}

// Structural interface — r-router component satisfies this without importing it
export interface RouterComponentElement extends HTMLElement {
  _syncRoutes(): void;
}

let _globalRouter: RouterCore | null = null;

// Injected <style> for MPA mode — kept as a module singleton so it's only injected once.
let _mpaStyleEl: HTMLStyleElement | null = null;

// SSG path context — set before renderToString so r-route._preSerialize() can resolve visibility.
let _ssgPath: string | null = null;

export function getSSGPath(): string | null {
  return _ssgPath;
}

export function setSSGPath(path: string): void {
  _ssgPath = path;
}

export function clearSSGPath(): void {
  _ssgPath = null;
}

function parseQuery(search: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!search) return result;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function hasSpaSupport(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

function runWithSpaTransition(fn: () => void): void {
  if (hasSpaSupport()) {
    (document as Document & { startViewTransition(cb: () => void): ViewTransitionHandle }).startViewTransition(fn);
  } else {
    fn();
  }
}

/** Inject `@view-transition { navigation: auto }` once for cross-document transitions. */
function injectMpaTransitionStyle(): void {
  if (typeof document === 'undefined') return;
  if (_mpaStyleEl && document.head.contains(_mpaStyleEl)) return;
  _mpaStyleEl = document.createElement('style');
  _mpaStyleEl.textContent = '@view-transition { navigation: auto; }';
  document.head.appendChild(_mpaStyleEl);
}

/** Remove the injected MPA style. Called when the router is replaced. */
function removeMpaTransitionStyle(): void {
  _mpaStyleEl?.remove();
  _mpaStyleEl = null;
}

function resolveSpaMode(v: boolean | ViewTransitionMode | undefined): boolean {
  return v === true || v === 'spa' || v === 'both';
}

function resolveMpaMode(v: boolean | ViewTransitionMode | undefined): boolean {
  return v === 'mpa' || v === 'both';
}

export class RouterCore {
  private readonly _mode: 'history' | 'hash';
  private readonly _base: string;
  private readonly _routes: RouteConfig[];
  private readonly _vtMode: boolean | ViewTransitionMode | undefined;
  private readonly _beforeGuards: NavigationGuard[] = [];
  private readonly _afterGuards: RouteChangeHandler[] = [];
  private readonly _changeHandlers: RouteChangeHandler[] = [];
  private readonly _pageSwapHandlers: Array<(e: PageSwapEvent) => void> = [];
  private readonly _pageRevealHandlers: Array<(e: PageRevealEvent) => void> = [];
  private readonly _components: Set<RouterComponentElement> = new Set();
  private _current: RouteLocation | null = null;
  private _mpaActive = false;

  constructor(config: RouterConfig = {}) {
    this._mode = config.mode ?? 'history';
    this._base = config.base ?? '';
    this._routes = config.routes ?? [];
    this._vtMode = config.viewTransition;

    if (resolveMpaMode(this._vtMode)) {
      this._enableMpa();
    }
  }

  get mode(): 'history' | 'hash' {
    return this._mode;
  }

  get base(): string {
    return this._base;
  }

  get routes(): RouteConfig[] {
    return [...this._routes];
  }

  get currentRoute(): RouteLocation | null {
    return this._current;
  }

  // ── Static path matching (used by matchRoute and SSG) ───────────────────

  private _matchConfigPath(path: string, route: RouteConfig): boolean {
    const paramNames: string[] = [];
    const regexStr = route.path
      .split('/')
      .map((segment) => {
        if (segment.startsWith(':')) {
          paramNames.push(segment.slice(1));
          return '([^/]+)';
        }
        if (segment === '*') return '(.*)';
        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');
    const pattern = route.exact
      ? new RegExp(`^${regexStr}$`)
      : new RegExp(`^${regexStr}(?:/.*)?$`);
    return pattern.test(path);
  }

  /** Return the first RouteConfig whose path matches the given URL path, or null. */
  matchRoute(path: string): RouteConfig | null {
    return this._routes.find((r) => this._matchConfigPath(path, r)) ?? null;
  }

  /** Return all route paths declared in the router config — used to enumerate SSG pages. */
  getStaticPaths(): string[] {
    return this._routes.map((r) => r.path);
  }

  // ── MPA setup ───────────────────────────────────────────────────────────

  private _enableMpa(): void {
    if (this._mpaActive) return;
    this._mpaActive = true;
    injectMpaTransitionStyle();

    if (typeof window !== 'undefined') {
      window.addEventListener('pageswap', this._onPageSwap as EventListener);
      window.addEventListener('pagereveal', this._onPageReveal as EventListener);
    }
  }

  private _disableMpa(): void {
    if (!this._mpaActive) return;
    this._mpaActive = false;
    removeMpaTransitionStyle();

    if (typeof window !== 'undefined') {
      window.removeEventListener('pageswap', this._onPageSwap as EventListener);
      window.removeEventListener('pagereveal', this._onPageReveal as EventListener);
    }
  }

  private _onPageSwap = (e: Event): void => {
    this._pageSwapHandlers.forEach((h) => h(e as PageSwapEvent));
  };

  private _onPageReveal = (e: Event): void => {
    this._pageRevealHandlers.forEach((h) => h(e as PageRevealEvent));
  };

  // ── Component binding ────────────────────────────────────────────────────

  _bind(component: RouterComponentElement): void {
    this._components.add(component);
  }

  _unbind(component: RouterComponentElement): void {
    this._components.delete(component);
  }

  // ── Path helpers ─────────────────────────────────────────────────────────

  _buildLocation(path: string): RouteLocation {
    const qIdx = path.indexOf('?');
    const pathname = qIdx === -1 ? path : path.slice(0, qIdx);
    const search = qIdx === -1 ? '' : path.slice(qIdx + 1);
    return {
      path: pathname || '/',
      params: {},
      query: parseQuery(search),
      fullPath: path || '/',
    };
  }

  _getCurrentPath(): string {
    if (typeof window === 'undefined') return '/';
    if (this._mode === 'hash') {
      return window.location.hash.slice(1) || '/';
    }
    const path = window.location.pathname;
    const base = this._base;
    const stripped = base && path.startsWith(base) ? path.slice(base.length) || '/' : path;
    return stripped + (window.location.search || '');
  }

  // ── Notify ───────────────────────────────────────────────────────────────

  _notify(): void {
    const to = this._buildLocation(this._getCurrentPath());
    const from = this._current;
    this._current = to;

    const syncDOM = () => {
      this._components.forEach((c) => c._syncRoutes());
    };

    if (resolveSpaMode(this._vtMode)) {
      runWithSpaTransition(syncDOM);
    } else {
      syncDOM();
    }

    this._afterGuards.forEach((h) => h(to, from));
    this._changeHandlers.forEach((h) => h(to, from));
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  private async _navigate(path: string, replace: boolean): Promise<void> {
    const to = this._buildLocation(path);
    const from = this._current;

    for (const guard of this._beforeGuards) {
      const decision = await new Promise<string | false | undefined>((resolve) => {
        guard(to, from, resolve);
      });
      if (decision === false) return;
      if (typeof decision === 'string') {
        return this._navigate(decision, replace);
      }
    }

    if (typeof window !== 'undefined') {
      const url = this._mode === 'hash' ? `#${path}` : this._base + path;
      if (replace) {
        window.history.replaceState({ path }, '', url);
      } else {
        window.history.pushState({ path }, '', url);
      }
    }
    this._notify();
  }

  push(path: string): Promise<void> {
    return this._navigate(path, false);
  }

  replace(path: string): Promise<void> {
    return this._navigate(path, true);
  }

  back(): void {
    if (typeof window !== 'undefined') window.history.back();
  }

  forward(): void {
    if (typeof window !== 'undefined') window.history.forward();
  }

  go(delta: number): void {
    if (typeof window !== 'undefined') window.history.go(delta);
  }

  /** Tear down MPA listeners and injected CSS. Call when the router is no longer needed. */
  destroy(): void {
    this._disableMpa();
    this._components.clear();
  }

  // ── Guards & hooks ────────────────────────────────────────────────────────

  /** Register a navigation guard. Returns an unsubscribe function. */
  beforeEach(guard: NavigationGuard): () => void {
    this._beforeGuards.push(guard);
    return () => {
      const i = this._beforeGuards.indexOf(guard);
      if (i !== -1) this._beforeGuards.splice(i, 1);
    };
  }

  /** Register a post-navigation hook. Returns an unsubscribe function. */
  afterEach(handler: RouteChangeHandler): () => void {
    this._afterGuards.push(handler);
    return () => {
      const i = this._afterGuards.indexOf(handler);
      if (i !== -1) this._afterGuards.splice(i, 1);
    };
  }

  /** Subscribe to route changes. Returns an unsubscribe function. */
  onRouteChange(handler: RouteChangeHandler): () => void {
    this._changeHandlers.push(handler);
    return () => {
      const i = this._changeHandlers.indexOf(handler);
      if (i !== -1) this._changeHandlers.splice(i, 1);
    };
  }

  /**
   * Subscribe to the cross-document `pageswap` event (fires on the outgoing page).
   * Only active when viewTransition is 'mpa' or 'both'.
   * Returns an unsubscribe function.
   */
  onPageSwap(handler: (e: PageSwapEvent) => void): () => void {
    this._pageSwapHandlers.push(handler);
    return () => {
      const i = this._pageSwapHandlers.indexOf(handler);
      if (i !== -1) this._pageSwapHandlers.splice(i, 1);
    };
  }

  /**
   * Subscribe to the cross-document `pagereveal` event (fires on the incoming page).
   * Only active when viewTransition is 'mpa' or 'both'.
   * Returns an unsubscribe function.
   */
  onPageReveal(handler: (e: PageRevealEvent) => void): () => void {
    this._pageRevealHandlers.push(handler);
    return () => {
      const i = this._pageRevealHandlers.indexOf(handler);
      if (i !== -1) this._pageRevealHandlers.splice(i, 1);
    };
  }
}

/** Create and register a global RouterCore instance. */
export function createRouter(config?: RouterConfig): RouterCore {
  // Clean up previous MPA listeners if the router is being replaced.
  _globalRouter?.destroy();
  const router = new RouterCore(config);
  _globalRouter = router;
  return router;
}

/** Return the current global RouterCore instance, or null if none was created. */
export function useRouter(): RouterCore | null {
  return _globalRouter;
}

/**
 * Standalone helper — enable cross-document View Transitions without a router.
 * Injects `@view-transition { navigation: auto }` once and returns a cleanup function.
 *
 * Useful for pure MPA sites that don't need a JS router at all.
 */
export function enableMpaViewTransitions(): () => void {
  injectMpaTransitionStyle();
  return () => removeMpaTransitionStyle();
}
