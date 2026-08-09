import { performanceTime } from '@/utils/time';
import { isClient } from '@/utils/device';

/**
 * @description: Read a named cookie
 * @param {string} objName
 * @return {*}
 */
export const getCookie = (objName: string): string => {
  const arrStr = document.cookie.split('; ');
  for (let i = 0; i < arrStr.length; i++) {
    const item = arrStr[i].split('=');
    if (item[0] === objName) {
      return decodeURIComponent(item[1]);
    }
  }
  return '';
};

export interface RequestUrlToArraybufferOption {
  responseType: XMLHttpRequestResponseType;
  method: string;
  withCredentials: boolean;
  headers: Record<string, string>;
  body: string;
  onProgress?: Function;
}

export interface requestUrlToArraybufferReturn extends BaseReturn {
  data: Blob;
}

export interface BaseReturn {
  success: boolean;
  message?: string;
}

/**
 * @description: Fetch a URL as an ArrayBuffer
 * @param {string} src
 * @param {RequestUrlToArraybufferOption} options
 * @return {*}
 */
export const requestUrlToBuffer = (
  src: string,
  options: Partial<RequestUrlToArraybufferOption>,
): Promise<requestUrlToArraybufferReturn> => {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', src, true);
    xhr.responseType = options.responseType || 'arraybuffer';
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve({ success: true, data: xhr.response, message: '' });
      } else {
        reject({
          success: false,
          data: xhr.status,
          message: `The request status is${xhr.status}`,
        });
      }
    };
    xhr.onerror = function (e) {
      reject({ success: false, data: e, message: `` });
    };
    xhr.onprogress = (event) => {
      if (options.onProgress) {
        options.onProgress(event);
      }
    };
    xhr.withCredentials = options.withCredentials || false;
    if (options.headers) {
      Object.keys(options.headers).forEach(function (key) {
        if (options.headers?.[key]) {
          xhr.setRequestHeader(key, options.headers[key]);
        }
      });
    }
    xhr.send(options.body);
  });
};

export interface Context {
  backingStorePixelRatio: number;
  webkitBackingStorePixelRatio: number;
  mozBackingStorePixelRatio: number;
  msBackingStorePixelRatio: number;
  oBackingStorePixelRatio: number;
}
/**
 * @description: Get the device pixel ratio
 * @param {CanvasRenderingContext2D} context
 * @return {*}
 */
export const getPixelRatio = (context: CanvasRenderingContext2D & Partial<Context>): number => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    1;
  return ((isClient && window.devicePixelRatio) || 1) / backingStore;
};

export const createObjectURL = async (src: Blob | ArrayBuffer | Response): Promise<string> => {
  if (typeof src === 'string') {
    return src;
  } else if (src instanceof Blob) {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return URL.createObjectURL(src);
  } else if (src instanceof ArrayBuffer) {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return URL.createObjectURL(new Blob([src]));
  } else if (src instanceof Response) {
    const result = await src.blob();
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return URL.createObjectURL(result);
  } else {
    return src;
  }
};

/**
 * @description: Frames per millisecond; multiply by 1000 for frames per second
 * @return {*}
 */
export const getFrame = (n: number = 10): Promise<number> => {
  const frameList: number[] = [];
  let lastFrame = 0;
  let requestAnimationFrameRef: number;
  return new Promise((resolve) => {
    const a = () => {
      const now = performanceTime();
      const frame = now - lastFrame;
      if (lastFrame !== 0) {
        frameList.push(frame);
      }
      lastFrame = now;
      if (frameList.length > n) {
        const num = frameList.reduce((i, j) => i + j);
        // Frame rate is 1 / time,
        // where time is the interval between requestAnimationFrame callbacks
        resolve(1 / (num / n));
        cancelAnimationFrame(requestAnimationFrameRef);
      }
      requestAnimationFrameRef = requestAnimationFrame(a);
    };
    if (frameList.length <= n) {
      requestAnimationFrameRef = requestAnimationFrame(a);
    }
  });
};

/**
 * Extract the query part of a URL: everything after the first `?` and before any `#`.
 * Returns '' when there is none. Reading `window.location.search` is not enough — callers
 * pass full hrefs too, and a fragment must never leak into the last parameter's value.
 */
const queryOf = (url?: string): string => {
  const href = url ?? (typeof window === 'undefined' ? '' : window.location.href);
  const start = href.indexOf('?');
  if (start === -1) return '';
  const rest = href.slice(start + 1);
  const hash = rest.indexOf('#');
  return hash === -1 ? rest : rest.slice(0, hash);
};

/**
 * @description: Parse a URL's query string into an object. Defaults to the current
 * `window.location.href`, so it returns `{}` under SSR unless a URL is passed.
 *
 * A **bare flag keeps its place** as an empty string: `?embed` and `?embed=` both yield
 * `{ embed: '' }`. The previous implementation dropped any parameter without a value,
 * which made `?readonly` and `?embed` — the usual way to write a boolean flag —
 * indistinguishable from the parameter being absent. Use [`queryFlag`](#queryflag) to read
 * such a flag as a boolean.
 *
 * `+` is decoded as a space and a value containing `=` is preserved (only the first `=`
 * splits), matching `URLSearchParams`.
 *
 * @param {string} url full URL or query string; defaults to the current location
 * @return {Record<string, string>} parameters; `{}` when there are none
 * @example
 * ```ts
 * getAllQueryString('https://x.dev/a?embed&lang=zh-CN&next=/a%3Fb%3D1');
 * // { embed: '', lang: 'zh-CN', next: '/a?b=1' }
 * ```
 */
export const getAllQueryString = (url?: string): Record<string, string> => {
  const result: Record<string, string> = {};
  const query = queryOf(url);
  if (!query) return result;
  for (const pair of query.split('&')) {
    if (!pair) continue;
    const eq = pair.indexOf('=');
    const rawKey = eq === -1 ? pair : pair.slice(0, eq);
    const rawValue = eq === -1 ? '' : pair.slice(eq + 1);
    if (!rawKey) continue;
    try {
      result[decodeURIComponent(rawKey.replace(/\+/g, ' '))] = decodeURIComponent(rawValue.replace(/\+/g, ' '));
    } catch {
      // A malformed percent-escape ("%zz") throws in decodeURIComponent — keep the raw text
      // rather than dropping the parameter, so a single bad value cannot hide the others.
      result[rawKey] = rawValue;
    }
  }
  return result;
};

/**
 * @description: Alias of [`getAllQueryString`](#getallquerystring). The two used to be
 * byte-identical copies of the same body; this one now forwards so a fix lands in both.
 * @param {string} url full URL or query string; defaults to the current location
 * @return {Record<string, string>}
 */
export const getQuery = (url?: string): Record<string, string> => getAllQueryString(url);

/**
 * @description: Read a query parameter as a boolean flag. True for `?k`, `?k=`, `?k=1` and
 * `?k=true` (case-insensitive); false for anything else, including an absent parameter and
 * an explicit `?k=false`.
 *
 * This is the URL spelling of a boolean: `?embed`, `?readonly` and `?debug` are all written
 * without a value most of the time, so a plain `getQuery(url).embed` check is wrong for the
 * most common form.
 *
 * @param {string} key parameter name
 * @param {string} url full URL or query string; defaults to the current location
 * @return {boolean}
 * @example
 * ```ts
 * queryFlag('embed', '?embed');        // true
 * queryFlag('embed', '?embed=1');      // true
 * queryFlag('embed', '?embed=false');  // false
 * queryFlag('embed', '?lang=en');      // false
 * ```
 */
export const queryFlag = (key: string, url?: string): boolean => {
  const value = getAllQueryString(url)[key];
  if (value === undefined) return false;
  const normalized = value.toLowerCase();
  return normalized === '' || normalized === '1' || normalized === 'true';
};

/**
 * @description: Whether this page is running inside an iframe. Returns false under SSR.
 *
 * Cross-origin embedding can make `window.parent` throw on access in some engines, so the
 * comparison is guarded: an unreadable parent means the page is framed by a foreign origin,
 * which still counts as embedded.
 *
 * @return {boolean}
 */
export const isInIframe = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.parent !== window;
  } catch {
    return true;
  }
};

/**
 * @description: Turn an object into a query string and append it to a URL
 * @return {*}
 */
export function appendUrl(url: string, params: Record<string, string> = {}): string {
  let _url = url;
  if (_url.indexOf('//') === 0) {
    _url = _url.replace('//', 'https://');
  }
  const urlObj = new URL(_url);
  if (params) {
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        urlObj.searchParams.set(key, params[key]);
      }
    });
  }
  return urlObj.href;
}

/**
 * @description: Remove the drag event's ghost image
 * @param {DragEvent} event
 * @return {*}
 */
// dragDom.addEventListener('mouseenter', removeGhosting);
// dragDom.addEventListener('dragstart', removeGhosting);
// dragDom.addEventListener('drag', removeGhosting);
export const removeGhosting = (event: DragEvent): void => {
  const dragIcon = document.createElement('img');
  const url = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  dragIcon.src = url;
  dragIcon.width = 0;
  dragIcon.height = 0;
  dragIcon.style.opacity = '0';
  if (event.dataTransfer) {
    event.dataTransfer.setDragImage(dragIcon, 0, 0);
  }
};

export function getCookieByName(name: string): string {
  if (typeof window !== 'undefined') {
    const cookieList = new RegExp(`(^| )${name}(?:=([^;]*))?(;|$)`).exec(document.cookie);
    if (cookieList && cookieList[2]) return cookieList[2];
  }
  return '';
}
interface ClientRatio {
  width: number;
  height: number;
}
/**
 * Get the viewport size across browsers
 */
export const getWindow = (): ClientRatio => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return {
    width: 0,
    height: 0,
  };
};

/**
 * @description: Current network status: type, throughput, and whether the connection changed
 */
export const connection = (): number | undefined => {
  if (typeof window !== 'undefined') {
    return (window.navigator as any).connection;
  }
};

/**
 * RegExp to match non-URL code points, *after* encoding (i.e. not including "%")
 * and including invalid escape sequences.
 */

const ENCODE_CHARS_REGEXP = /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x7E]|%(?:[^\da-f]|[\da-f][^\da-f]|$))+/gi;

/**
 * RegExp to match unmatched surrogate pair.
 * @private
 */

const UNMATCHED_SURROGATE_PAIR_REGEXP = /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g;

/**
 * String to replace unmatched surrogate pair with.
 * @private
 */

const UNMATCHED_SURROGATE_PAIR_REPLACE = '$1\uFFFD$2';

/**
 * Encode a URL to a percent-encoded form, excluding already-encoded sequences.
 *
 * This function will take an already-encoded URL and encode all the non-URL
 * code points. This function will not encode the "%" character unless it is
 * not part of a valid sequence (`%20` will be left as-is, but `%foo` will
 * be encoded as `%25foo`).
 *
 * This encode is meant to be "safe" and does not throw errors. It will try as
 * hard as it can to properly encode the given URL, including replacing any raw,
 * unpaired surrogate pairs with the Unicode replacement character prior to
 * encoding.
 *
 * @param {string} url
 * @return {string}
 * @public
 */

export function encodeUrl(url: string): string {
  return String(url)
    .replace(UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE)
    .replace(ENCODE_CHARS_REGEXP, encodeURI);
}

interface Options {
  url?: string; // request URL
  duration?: number; // interval between requests
  count?: number; // number of requests
}

interface ReturnType {
  ping: number;
  jitter: number;
}

/**
 * @description: Request an image (used to time the network)
 * @param {string} url
 * @return {Promise<ImageLoadError | number>}
 */
export const imageRequest = (url?: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const startTime = new Date().getTime();
    // GitHub's favicon is used here — 2.2 kB
    img.src = url ? url : `https://github.com/favicon.ico?d=${startTime}`;
    img.onload = () => {
      const endTime = new Date().getTime();
      const delta = endTime - startTime;
      resolve(delta);
    };
    img.onerror = (err) => {
      console.log('error', err);
      reject(err);
    };
  });
};

/**
 * @description: Run a function repeatedly at a fixed interval
 * @param {HandlerFunction} handler
 * @param {array} params
 */
export const durationHandler =
  <T, U>(handler: (...args: T[]) => U, ...params: T[]): ((a: number) => Promise<U>) =>
  (duration: number): Promise<U> =>
    new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await handler(...params);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, duration);
    });

/**
 * @description: Measure the network's ping by timing requests
 * @param {*} options
 */
export const networkSpeed = async (options: Options): Promise<ReturnType> => {
  const { url, duration = 3000, count = 5 } = options;
  // Jitter describes how much the network fluctuates: ping once a second, then after 5s take the spread between the highest and lowest of the five readings. A smaller spread means a steadier connection.
  let jitter = 0;
  // Mean ping
  let ping = 0;
  // All ping readings
  const pingList: Array<number> = [];
  for (let i = 0; i < count; i++) {
    const handler = durationHandler(imageRequest, url);
    const delta = await handler(duration);
    pingList.push(delta);
  }
  const maxPing = Math.max(...pingList);
  const minPing = Math.min(...pingList);
  jitter = maxPing - minPing;
  ping = pingList.reduce((a, b) => a + b) / pingList.length;
  return { ping, jitter };
};

export const isSafari = (): boolean | undefined | string => {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  if (typeof navigator === 'undefined') {
    return undefined;
  }
  // Non-standard, but iOS Safari exposes a `vendor` property
  return (
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    navigator.vendor &&
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    navigator.vendor.indexOf('Apple') > -1 &&
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    navigator.userAgent &&
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    !navigator.userAgent.includes('CriOS') &&
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    !navigator.userAgent.includes('FxiOS')
  );
};
