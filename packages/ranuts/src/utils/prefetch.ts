/**
 * 「后台预取 + 缓存探测」。
 *
 * 核心事实：只要用 fetch 请求过一次的同源 GET，就会进 Service Worker 的 CacheStorage
 * （前提是 SW 对同源 GET 做了 cache-first），之后任何代码请求同一 URL 都命中缓存、离线可用。
 * 所以「预热大资源」不需要专门的下载器，把字节拉进缓存即可。
 *
 * 但预取是**替用户花流量**，必须受约束：省流量模式、2G 慢网、用户显式关闭时都不该偷跑。
 */

/** 调用时判断，而不是模块加载时——同一份代码可能先在 SSR 里被 import，再在浏览器里被调用 */
const hasWindow = (): boolean => typeof window !== 'undefined';

export interface WhenIdleOptions {
  /** requestIdleCallback 的最长等待（毫秒），默认 8000 */
  timeout?: number;
  /** 不支持 requestIdleCallback 时的退避延时（毫秒），默认 2500 */
  fallbackDelay?: number;
}

/**
 * @description: 在浏览器空闲时执行回调，无 `requestIdleCallback`（Safari 长期缺席）时退回 setTimeout。
 * @param {Function} callback 空闲时执行
 * @param {WhenIdleOptions} options
 * @return {Function} 取消函数；回调已执行后调用无副作用
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
  /** localStorage 开关：设了任意值即视为用户关闭预取 */
  optOutKey?: string;
  /** 视为「慢网」的 effectiveType，默认 slow-2g / 2g */
  slowTypes?: string[];
}

/**
 * @description: 当前网络与用户设置是否允许「主动下载大资源」。
 * 省流量（`saveData`）、慢网、用户显式关闭时返回 false。信息拿不到时**默认允许**——
 * Network Information API 在 Safari/Firefox 上不存在，不能因为读不到就一律不预取。
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
      // localStorage 被禁用（隐私模式 / 三方 iframe）时不阻断
    }
  }
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && slowTypes.includes(conn.effectiveType)) return false;
  return true;
};

/** CacheStorage 是否可用（非安全上下文 / 老浏览器可能没有） */
const hasCaches = (): boolean => typeof caches !== 'undefined';

/**
 * @description: URL 是否已在 CacheStorage 里。探测一组文件时应挑**最后下载完成的那个**
 * （通常是最大的）作为判据，否则会把「下到一半」误判成已缓存。
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
 * @description: 拉取单个 URL 进缓存；已缓存则跳过。失败静默——预取失败只是让后续加载
 * 走一次真实下载，不该冒泡打断主流程。
 * @param {string} url
 * @return {Promise<void>}
 */
export const prefetchUrl = async (url: string): Promise<void> => {
  try {
    if (await isUrlCached(url)) return;
    await fetch(url, { cache: 'force-cache' });
  } catch {
    // 忽略
  }
};

export interface PrefetchOptions {
  /**
   * 交给 Service Worker 预取时用的消息 type。SW 里用 `event.waitUntil` 保活，
   * 下载不随页面导航中断（用户快进快出时尤其明显）；无可控 SW 时自动退回主线程 fetch。
   */
  serviceWorkerMessage?: string;
}

/** 请求 SW 在其上下文里预取；无可控 SW 返回 false */
const precacheViaServiceWorker = (urls: string[], type: string): boolean => {
  try {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const ctrl = typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? navigator.serviceWorker.controller : null;
    if (!ctrl) return false;
    ctrl.postMessage({ type, urls });
    return true;
  } catch {
    return false;
  }
};

/**
 * @description: 预取一组 URL。**串行**执行——预取是背景任务，并发打满带宽会拖慢用户
 * 正在看的页面。
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
 * @description: 在空闲时预取一组 URL，并受 `networkAllowsDownload` 约束。非阻塞，立即返回。
 * @param {string[]} urls
 * @param {object} options 合并了空闲调度、网络许可与 SW 转发三者的选项
 * @return {Function} 取消函数（仅能取消尚未开始的调度）
 */
export const prefetchWhenIdle = (
  urls: string[],
  options: WhenIdleOptions & NetworkAllowanceOptions & PrefetchOptions = {},
): (() => void) => {
  if (!networkAllowsDownload(options)) return () => {};
  return whenIdle(() => void prefetchUrls(urls, options), options);
};
