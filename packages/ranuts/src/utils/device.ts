/**
 * @description: Detect the current device
 * @param {*} function
 * @return {*}
 */
export enum DEVICE {
  IPAD = 'ipad',
  ANDROID = 'android',
  IPhONE = 'iphone',
  PC = 'pc',
}
export type CurrentDevice = 'ipad' | 'android' | 'iphone' | 'pc';
export const currentDevice = (): CurrentDevice => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const ua = navigator.userAgent.toLowerCase();
    if (/ipad|ipod/.test(ua)) return 'ipad';
    if (/android/.test(ua)) return 'android';
    if (/iphone/.test(ua)) return 'iphone';
    return 'pc';
  }
  return 'pc';
};

export const isClient = typeof window !== 'undefined';

/** Viewport breakpoint, matching where the mobile layout takes over */
export const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

/**
 * @description: Read whether a media query currently matches, synchronously. Returns false under SSR.
 *
 * Prefer this over `isMobile()` when asking "is this mobile": UA sniffing identifies the
 * **device**, a media query the **viewport** — and only the latter is right when a desktop
 * window is narrowed or a tablet is rotated.
 * @param {string} query the media query
 * @return {boolean}
 */
export const matchMediaQuery = (query: string): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(query).matches;
};

/**
 * @description: Watch a media query. The callback **fires once synchronously with the
 * current value** (so the caller need not read the initial state separately), then on every
 * change. Returns an unsubscribe function — call it when the component is destroyed or the
 * page is disposed; an unreleased MediaQueryList listener leaks the closure and every DOM
 * node it captured.
 * @param {string} query the media query
 * @param {Function} callback called when the match state changes
 * @return {Function} unsubscribe
 * @example
 * ```ts
 * const off = watchMediaQuery(MOBILE_MEDIA_QUERY, (isMobile) => render(isMobile));
 * onCleanup(off);
 * ```
 */
export const watchMediaQuery = (query: string, callback: (matches: boolean) => void): (() => void) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    callback(false);
    return () => {};
  }
  const mql = window.matchMedia(query);
  const handler = (): void => callback(mql.matches);
  handler();
  // addEventListener is the modern form; Safari before 14 only had addListener, so wire up both
  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }
  const legacy = mql as unknown as {
    addListener: (cb: () => void) => void;
    removeListener: (cb: () => void) => void;
  };
  legacy.addListener(handler);
  return () => legacy.removeListener(handler);
};

/**
 * @description: Whether this is the WeChat in-app browser
 * @param {*} boolean
 * @return {*}
 */
export const isWeiXin = (): boolean => {
  if (isClient) {
    // navigator.userAgent carries the browser type and version, the OS and the engine, so it can identify the browser
    const ua = window.navigator.userAgent.toLowerCase();
    // alert(ua)
    // Match the UA against the MicroMessenger marker
    return ua.includes('micromessenger');
  }
  return false;
};

/**
 * Whether this is a mobile device
 */
export const isMobile = (): boolean => {
  if (!isClient) return false;
  const ua = window.navigator.userAgent;
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(ua)) {
    return true;
  }
  return false;
};
