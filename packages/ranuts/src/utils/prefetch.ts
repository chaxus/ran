/**
 * Background prefetching plus cache probing.
 *
 * The key fact: a same-origin GET that has been fetched once lands in the service worker's
 * CacheStorage (assuming the SW is cache-first for same-origin GETs), and from then on any
 * code requesting that URL hits the cache and works offline. So "warming up a large asset"
 * needs no dedicated downloader — pulling the bytes into the cache is enough.
 *
 * But prefetching **spends the user's data on their behalf**, so it must be constrained:
 * it should stay quiet under data-saver mode, on slow 2G, and whenever the user turned it off.
 */

/** Checked at call time, not module load — the same code may be imported during SSR and called later in the browser */
const hasWindow = (): boolean => typeof window !== 'undefined';

export interface WhenIdleOptions {
  /** Maximum wait for requestIdleCallback in milliseconds, defaults to 8000 */
  timeout?: number;
  /** Fallback delay in milliseconds when requestIdleCallback is unavailable, defaults to 2500 */
  fallbackDelay?: number;
}

/**
 * @description: Run a callback while the browser is idle, falling back to setTimeout where
 * `requestIdleCallback` is missing (long absent in Safari).
 * @param {Function} callback runs when idle
 * @param {WhenIdleOptions} options
 * @return {Function} cancel function; calling it after the callback ran is a no-op
 */
export const whenIdle = (callback: () => void, options: WhenIdleOptions = {}): (() => void) => {
  const { timeout = 8000, fallbackDelay = 2500 } = options;
  if (!hasWindow()) return () => {};
  const idle = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    }
  ).requestIdleCallback;
  if (idle) {
    const handle = idle(callback, { timeout });
    return () => (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(handle);
  }
  const timer = setTimeout(callback, fallbackDelay);
  return () => clearTimeout(timer);
};

export interface NetworkAllowanceOptions {
  /** localStorage switch: any value stored under this key means the user turned prefetching off */
  optOutKey?: string;
  /** effectiveType values treated as a "slow network", defaults to slow-2g / 2g */
  slowTypes?: string[];
}

/**
 * @description: Whether the current network and user settings allow proactively downloading
 * a large asset. Returns false under data-saver (`saveData`), on a slow network, or when the
 * user opted out. When the information is unavailable it **defaults to allowed** — the
 * Network Information API does not exist in Safari/Firefox, and a missing reading must not
 * disable prefetching everywhere.
 * @param {NetworkAllowanceOptions} options
 * @return {boolean}
 */
export const networkAllowsDownload = (options: NetworkAllowanceOptions = {}): boolean => {
  const { optOutKey, slowTypes = ['slow-2g', '2g'] } = options;
  if (!hasWindow()) return false;
  if (optOutKey) {
    try {
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      if (localStorage.getItem(optOutKey)) return false;
    } catch {
      // Do not block when localStorage is disabled (private mode / third-party iframe)
    }
  }
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && slowTypes.includes(conn.effectiveType)) return false;
  return true;
};

/** Whether CacheStorage is available (missing in insecure contexts / old browsers) */
const hasCaches = (): boolean => typeof caches !== 'undefined';

/**
 * @description: Whether a URL is already in CacheStorage. When probing a group of files,
 * test the one that **finishes downloading last** (usually the largest), otherwise a
 * half-finished download reads as fully cached.
 * @param {string} url
 * @return {Promise<boolean>}
 */
export const isUrlCached = async (url: string): Promise<boolean> => {
  if (!hasCaches()) return false;
  try {
    return Boolean(await caches.match(url));
  } catch {
    return false;
  }
};

/**
 * @description: Pull a single URL into the cache; skipped when already cached. Failures are
 * silent — a failed prefetch only means the later load performs a real download, it must not
 * bubble up and interrupt the main flow.
 * @param {string} url
 * @return {Promise<void>}
 */
export const prefetchUrl = async (url: string): Promise<void> => {
  try {
    if (await isUrlCached(url)) return;
    await fetch(url, { cache: 'force-cache' });
  } catch {
    // ignored
  }
};

export interface PrefetchOptions {
  /**
   * Message type used to hand prefetching to the service worker. The SW keeps the work alive
   * with `event.waitUntil`, so a download survives page navigation (very noticeable when the
   * user moves around quickly); without a controlling SW it falls back to a main-thread fetch.
   */
  serviceWorkerMessage?: string;
}

/** Ask the SW to prefetch in its own context; returns false when there is no controlling SW */
const precacheViaServiceWorker = (urls: string[], type: string): boolean => {
  try {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const ctrl =
      typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? navigator.serviceWorker.controller : null;
    if (!ctrl) return false;
    ctrl.postMessage({ type, urls });
    return true;
  } catch {
    return false;
  }
};

/**
 * @description: Prefetch a group of URLs, **serially** — prefetching is background work, and
 * saturating the bandwidth in parallel slows down the page the user is actually looking at.
 * @param {string[]} urls
 * @param {PrefetchOptions} options
 * @return {Promise<void>}
 */
export const prefetchUrls = async (urls: string[], options: PrefetchOptions = {}): Promise<void> => {
  if (urls.length === 0) return;
  if (options.serviceWorkerMessage && precacheViaServiceWorker(urls, options.serviceWorkerMessage)) return;
  for (const url of urls) {
    await prefetchUrl(url);
  }
};

/**
 * @description: Prefetch a group of URLs while idle, subject to `networkAllowsDownload`.
 * Non-blocking, returns immediately.
 * @param {string[]} urls
 * @param {object} options the idle-scheduling, network-allowance and SW-forwarding options combined
 * @return {Function} cancel function (can only cancel a schedule that has not started)
 */
export const prefetchWhenIdle = (
  urls: string[],
  options: WhenIdleOptions & NetworkAllowanceOptions & PrefetchOptions = {},
): (() => void) => {
  if (!networkAllowsDownload(options)) return () => {};
  return whenIdle(() => void prefetchUrls(urls, options), options);
};
