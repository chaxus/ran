/**
 * @description: 判断当前设备
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

/** 视口断点：与移动端布局的分界线保持一致 */
export const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

/**
 * @description: 同步读取一条媒体查询当前是否匹配。SSR 返回 false。
 *
 * 判断「是不是移动端」优先用这个而不是 `isMobile()`：UA 嗅探认的是**设备**，
 * 媒体查询认的是**视口**——桌面浏览器缩窄窗口、平板横竖屏切换时只有后者是对的。
 * @param {string} query 媒体查询串
 * @return {boolean}
 */
export const matchMediaQuery = (query: string): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(query).matches;
};

/**
 * @description: 监听媒体查询变化。回调会**先同步触发一次当前值**（省掉调用方自己再读一遍
 * 初值），之后每次变化再触发。返回取消订阅函数——务必在组件销毁 / 页面 dispose 时调用，
 * MediaQueryList 的监听不解绑会让闭包连同它捕获的 DOM 一起泄漏。
 * @param {string} query 媒体查询串
 * @param {Function} callback 匹配状态变化时调用
 * @return {Function} 取消订阅
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
  // addEventListener 是新写法；Safari 14 以前只有 addListener，两者都接一下
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
 * @description: 判断是否是微信浏览器的函数
 * @param {*} boolean
 * @return {*}
 */
export const isWeiXin = (): boolean => {
  if (isClient) {
    // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    const ua = window.navigator.userAgent.toLowerCase();
    // alert(ua)
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    return ua.includes('micromessenger');
  }
  return false;
};

/**
 * 是否是移动端
 */
export const isMobile = (): boolean => {
  if (!isClient) return false;
  const ua = window.navigator.userAgent;
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(ua)) {
    return true;
  }
  return false;
};

// 判断是否是刘海屏机型
export const isBangDevice = (): boolean => {
  if (!isClient) return false;
  const iphone = /iphone/i.test(window.navigator.userAgent); // 是否 iphone 机型
  const ratio2 = window.devicePixelRatio && window.devicePixelRatio === 2; // 像素比是否为 2
  const ratio3 = window.devicePixelRatio && window.devicePixelRatio === 3; // 像素比是否为 3

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
