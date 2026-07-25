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

// Whether the device has a notch
export const isBangDevice = (): boolean => {
  if (!isClient) return false;
  const iphone = /iphone/i.test(window.navigator.userAgent); // is it an iPhone?
  const ratio2 = window.devicePixelRatio && window.devicePixelRatio === 2; // device pixel ratio of 2?
  const ratio3 = window.devicePixelRatio && window.devicePixelRatio === 3; // device pixel ratio of 3?

  const mini12 = window.screen.width === 360 && window.screen.height === 780; // 12mini
  const pro11 = window.screen.width === 375 && window.screen.height === 812; // X Xs 11pro
  const pro12 = window.screen.width === 390 && window.screen.height === 844; // 12 12pro
  const promax11 = window.screen.width === 414 && window.screen.height === 896; // Xsm XR 11 11promax
  const promax12 = window.screen.width === 428 && window.screen.height === 926; // 12promax

  switch (true) {
    case iphone && ratio3 && mini12: // 12 mini
    case iphone && ratio3 && pro11: // X Xs 11pro
    case iphone && ratio3 && pro12: // 12 12pro
    case iphone && ratio2 && promax11: // XR 11
    case iphone && ratio3 && promax11: // Xsm 11promax
    case iphone && ratio3 && promax12: // 12promax
      return true;
    default:
      return false;
  }
};
