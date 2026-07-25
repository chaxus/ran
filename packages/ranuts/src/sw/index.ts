/**
 * Service Worker building blocks.
 *
 * A companion to `prefetchUrls` / `prefetchWhenIdle` in `ranuts/utils`: those ship the page
 * side of the "warm the cache in the background" protocol, and {@link servePrecache} is the
 * worker side that answers them. The two caching strategies below are the standard pair every
 * SW ends up writing.
 *
 * Its own entry point (`ranuts/sw`) rather than part of `ranuts/utils`, because this code runs
 * in a `ServiceWorkerGlobalScope` where `window` and `document` do not exist — pulling in the
 * general utils barrel would drag DOM-facing modules into a worker bundle.
 *
 * All of it assumes a bundled service worker. A hand-written `sw.js` served as a static file
 * cannot import from node_modules; either bundle it, or copy the pieces you need.
 */

/**
 * The bit of `ExtendableMessageEvent` used here, declared locally rather than pulled from
 * `lib.webworker` — that lib conflicts with `lib.dom` in a project that compiles both, and
 * this package must stay importable from either.
 */
export interface PrecacheMessageEvent {
  data: unknown;
  waitUntil: (promise: Promise<unknown>) => void;
}

/** Minimal view of the SW global the helpers touch, so they can be unit-tested with a stub. */
export interface SWScope {
  caches: CacheStorage;
  fetch: typeof fetch;
  addEventListener: (type: string, listener: (event: never) => void) => void;
  removeEventListener: (type: string, listener: (event: never) => void) => void;
}

const globalScope = (): SWScope => globalThis as unknown as SWScope;

/** A 408 stand-in, so a failed handler still resolves to a Response instead of rejecting. */
const offlineResponse = (): Response =>
  new Response('Network error happened', { status: 408, headers: { 'Content-Type': 'text/plain' } });

export interface CacheStrategyOptions {
  /** Cache to read and write. */
  cacheName: string;
  /** Whether a response may be stored. Default: any GET answered with 200. */
  shouldCache?: (request: Request, response: Response) => boolean;
  /** Scope override, for tests or a non-global worker. */
  scope?: SWScope;
}

const defaultShouldCache = (request: Request, response: Response): boolean =>
  request.method === 'GET' && response.status === 200;

/**
 * Store a response without consuming the copy the page is waiting for.
 *
 * `response.clone()` must be called **synchronously, before the body is read**. Awaiting
 * `caches.open()` first and cloning afterwards is the classic bug: by then the body may
 * already be streaming to the caller, and the clone throws `Failed to execute 'clone'`.
 */
const putClone = (scope: SWScope, cacheName: string, request: Request, response: Response): Promise<void> => {
  const copy = response.clone();
  return scope.caches
    .open(cacheName)
    .then((cache) => cache.put(request.url, copy))
    .catch(() => {
      // A full quota or an opaque response must not fail the navigation.
    });
};

/**
 * @description: Cache-first: serve the stored copy when there is one, otherwise fetch and
 * store. For immutable, content-hashed assets — scripts, styles, fonts, model weights.
 *
 * @param {Request} request
 * @param {CacheStrategyOptions} options
 * @return {Promise<Response>} never rejects; a network failure resolves to a 408
 */
export const cacheFirst = async (request: Request, options: CacheStrategyOptions): Promise<Response> => {
  const scope = options.scope ?? globalScope();
  const shouldCache = options.shouldCache ?? defaultShouldCache;
  try {
    const cached = await scope.caches.match(request.url);
    if (cached) return cached;
    const response = await scope.fetch(request);
    if (shouldCache(request, response)) void putClone(scope, options.cacheName, request, response);
    return response;
  } catch {
    return offlineResponse();
  }
};

/**
 * @description: Network-first: go to the network, store what comes back, and fall back to the
 * cache when offline. For anything that must reflect a deploy immediately — HTML navigations,
 * a manifest, an API response you also want available offline.
 *
 * @param {Request} request
 * @param {CacheStrategyOptions} options
 * @return {Promise<Response>} never rejects; offline with nothing cached resolves to a 408
 */
export const networkFirst = async (request: Request, options: CacheStrategyOptions): Promise<Response> => {
  const scope = options.scope ?? globalScope();
  const shouldCache = options.shouldCache ?? defaultShouldCache;
  try {
    const response = await scope.fetch(request);
    if (shouldCache(request, response)) void putClone(scope, options.cacheName, request, response);
    return response;
  } catch {
    const cached = await scope.caches.match(request.url).catch(() => undefined);
    return cached ?? offlineResponse();
  }
};

/**
 * @description: Fill a cache with a list of URLs, skipping what is already there. Failures are
 * per-URL and silent — one 404 in a precache list must not abort the install.
 *
 * @param {string} cacheName
 * @param {string[]} urls
 * @param {object} options
 * @return {Promise<void>}
 */
export const precache = async (
  cacheName: string,
  urls: readonly string[],
  options: { scope?: SWScope } = {},
): Promise<void> => {
  const scope = options.scope ?? globalScope();
  const cache = await scope.caches.open(cacheName);
  for (const url of urls) {
    try {
      if (await cache.match(url)) continue;
      const response = await scope.fetch(url, { cache: 'force-cache' });
      if (response.ok) await cache.put(url, response.clone());
    } catch {
      // Skip and keep going: a missing entry only means a cache miss later.
    }
  }
};

/**
 * @description: Delete every cache except the ones named. Call it on `activate` so a new
 * build's caches replace the previous build's instead of accumulating.
 *
 * @param {string[]} keep cache names to preserve
 * @param {object} options
 * @return {Promise<string[]>} the names that were deleted
 */
export const dropCachesExcept = async (
  keep: readonly string[],
  options: { scope?: SWScope } = {},
): Promise<string[]> => {
  const scope = options.scope ?? globalScope();
  const names = await scope.caches.keys();
  const stale = names.filter((name) => !keep.includes(name));
  await Promise.all(stale.map((name) => scope.caches.delete(name)));
  return stale;
};

export interface ServePrecacheOptions {
  /** Cache the URLs land in. */
  cacheName: string;
  /** Message `type` to answer. Must match `prefetchUrls({ serviceWorkerMessage })`. */
  type: string;
  scope?: SWScope;
}

/**
 * @description: Answer the precache messages that `prefetchUrls({ serviceWorkerMessage })`
 * posts from the page — the worker half of that protocol.
 *
 * Downloading here rather than on the page is the whole point: the work is wrapped in
 * `event.waitUntil`, so the service worker stays alive through navigations. A page-side fetch
 * is aborted the moment the user clicks away, and a large asset then restarts from zero on the
 * next visit.
 *
 * @param {ServePrecacheOptions} options
 * @return {Function} stop — removes the listener
 * @example
 * ```ts
 * // sw.ts
 * servePrecache({ type: 'precache-models', cacheName: 'models' });
 *
 * // page
 * prefetchUrls(modelFiles, { serviceWorkerMessage: 'precache-models' });
 * ```
 */
export const servePrecache = (options: ServePrecacheOptions): (() => void) => {
  const scope = options.scope ?? globalScope();
  const listener = (event: PrecacheMessageEvent): void => {
    const data = event.data as { type?: string; urls?: unknown } | undefined;
    if (!data || data.type !== options.type || !Array.isArray(data.urls)) return;
    event.waitUntil(precache(options.cacheName, data.urls as string[], { scope }));
  };
  scope.addEventListener('message', listener as (event: never) => void);
  return () => scope.removeEventListener('message', listener as (event: never) => void);
};
