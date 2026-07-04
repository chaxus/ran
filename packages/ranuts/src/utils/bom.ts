import { getRandomString, isString } from './str';
import { isFunction } from './func';
import { noop } from '@/utils/noop';
import { performanceTime } from '@/utils/time';
import { isClient } from '@/utils/device';

/**
 * @description: 覆盖浏览器的后退事件
 * @param {*} callback
 * @return {*}
 */
export const retain = (callback = noop): void => {
  const historyReturnCb = () => {
    callback();
    if (isClient) {
      window.removeEventListener('popstate', historyReturnCb);
    }
  };

  // 向 history 栈中推入两个和当前页面一样的历史记录，用来在页面发生跳转的时候区分返回和前进动作
  if (isClient) {
    window.history.pushState(null, '', window.location.href);
  }
  setTimeout(() => {
    if (isClient) {
      window.addEventListener('popstate', historyReturnCb);
    }
  }, 500);
};

/**
 * @description: 获取指定的 cookie
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
 * @description: url 转 arrayBuffer
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
 * @description: 获取分辨率
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
 * @description: 计算每毫秒的帧率，每秒的帧率需要乘 1000
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
        // 帧率就是 1 / time
        // time 是每次 requestAnimationFrame 执行的间隔
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
 * @description: Gets the current environment configuration
 * @return {string}
 */
export const getHost = (env?: string): string | undefined => {
  if (typeof window !== 'undefined') {
    let host = '';
    if (env && isString(env)) {
      if (/trunk|neibu|release/.test(env)) {
        host = `.${env}`;
      } else if (/test/.test(env)) {
        host = env;
      } else if (/prod/.test(env)) {
        host = '';
      } else {
        host = '';
      }
    } else {
      const env = /\w(\.trunk|\.neibu|\.release|test)\./.exec(window.location.hostname);
      if (env) {
        host = env[1];
      }
    }
    // return host ? `https://log${host}.chaxus.com` : 'https://log.chaxus.com'
    return `//log.${host}`;
  }
};
/**
 * @description: 将 url 上的字符串转换成对象
 * @param {string} url
 * @param {*} string
 * @return {*}
 */
export const getAllQueryString = (url?: string): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const r: Record<string, string> = {};
    const href = url || window.location.href;
    if (href.split('?')[1]) {
      const str = href.split('?')[1];
      const strList = str.split('&');
      strList.forEach((item) => {
        const [key, val] = item.split('=');
        if (key && val) {
          r[key] = decodeURIComponent(val);
        }
      });
    }
    return r;
  }
  return {};
};

/**
 * @description: 将 url 上的字符串转换成对象
 * @param {string} url
 * @param {*} string
 * @return {*}
 */
export const getQuery = (url?: string): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const r: Record<string, string> = {};
    const href = url || window.location.href;
    if (href.split('?')[1]) {
      const str = href.split('?')[1];
      const strList = str.split('&');
      strList.forEach((item) => {
        const [key, val] = item.split('=');
        if (key && val) {
          r[key] = decodeURIComponent(val);
        }
      });
    }
    return r;
  }
  return {};
};

/**
 * @description: 将一个对象转换成 querystring，拼接到 url 后面
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
 * @description: 移除拖拽事件的阴影
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
 * 跨浏览器获取可视窗口大小
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
 * @description: 返回当前网络状态，当前吞吐量，是否切换网络
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
  url?: string; // 请求地址
  duration?: number; // 请求的间隔
  count?: number; // 请求的次数
}

interface ReturnType {
  ping: number;
  jitter: number;
}

/**
 * @description: 图片请求
 * @param {string} url
 * @return {Promise<ImageLoadError | number>}
 */
export const imageRequest = (url?: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const startTime = new Date().getTime();
    // 此处选择加载 github 的 favicon，大小为 2.2kB
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
 * @description: 间隔一定时间，执行指定的函数
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
 * @description: 通过请求来测试当前网络的 ping 值
 * @param {*} options
 */
export const networkSpeed = async (options: Options): Promise<ReturnType> => {
  const { url, duration = 3000, count = 5 } = options;
  // 抖动，用来描述网络的波动情况。比如每秒测量一次 ping 值，5s 后取五次测量结果的最大最小值求差，可以看出网络的波动情况，差值越小代表网络越稳定；
  let jitter = 0;
  // 平均的 ping 值
  let ping = 0;
  // ping 值的数组
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
  // 不是标准，但 ios safari 上有 vendor 属性
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

// #region Bridge start

export interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}

export interface MessageData<T = unknown> {
  type: string;
  payload: T;
  id?: string;
  isResponse?: boolean;
  isError?: boolean;
  /** 通道标识：用于隔离同一窗口上的多个 bridge（默认 DEFAULT_CHANNEL） */
  channel?: string;
  /** 发送方实例 id：用于避免 bridge 处理自己发出的请求（自答自问） */
  senderId?: string;
}

export interface PendingRequest<R = unknown> {
  resolve: (value: R) => void;
  reject: (error: unknown) => void;
}

const DEFAULT_TIMEOUT = 120000;
// 协议标记：只有带此标记的消息才被 bridge 处理，
// 借此和页面上其它库（HMR、DevTools、第三方 SDK）的 postMessage 流量区分开。
// 导出以便需要手动互操作/测试时对齐协议。
export const BRIDGE_MARKER = '__ranuts_bridge__';
// 默认通道：不显式指定 channel 时两端都落在这里，保持向后兼容。
export const DEFAULT_CHANNEL = 'default';
// 白名单
// const whiteList = ['localhost', '127.0.0.1', 'chaxus.github.io']

/** bridge 在线路上传输的信封：MessageData + 协议标记 */
interface BridgeEnvelope<T = unknown> extends MessageData<T> {
  __bridge: string;
}

/**
 * 全局消息分发器：所有 PostMessageBridge 共享**同一个** window 'message' 监听器，
 * 再由它把事件分发给各 bridge（方案 C）。避免 N 个 bridge = N 个监听器、
 * 每条消息被处理 N 遍。第一个 bridge 注册时挂监听，最后一个注销时摘掉。
 */
class BridgeDispatcher {
  private bridges = new Set<PostMessageBridge>();
  // 记录当前挂载监听器的 window（而非布尔），以便在 window 变化时重新挂载。
  private attachedWindow: Window | null = null;

  private handleMessage = (event: MessageEvent): void => {
    // 复制成数组，避免 bridge 在 receive 内销毁自身时修改遍历中的集合。
    for (const bridge of Array.from(this.bridges)) {
      bridge.receive(event);
    }
  };

  add(bridge: PostMessageBridge): void {
    this.bridges.add(bridge);
    if (typeof window !== 'undefined' && this.attachedWindow !== window) {
      window.addEventListener('message', this.handleMessage);
      this.attachedWindow = window;
    }
  }

  remove(bridge: PostMessageBridge): void {
    this.bridges.delete(bridge);
    if (this.bridges.size === 0 && this.attachedWindow) {
      this.attachedWindow.removeEventListener('message', this.handleMessage);
      this.attachedWindow = null;
    }
  }
}

const bridgeDispatcher = new BridgeDispatcher();

/**
 * Bridge 注册事件，供 client 消费
 */

export class PostMessageBridge {
  private targetWindow: Window;
  private targetOrigin: string;
  private messageHandlers: Map<string, MessageHandler<any, any>>;
  private pendingRequests: Map<string, PendingRequest<any>>;
  // 通道标识：同一窗口上区分不同 bridge（方案 A）。默认落在 DEFAULT_CHANNEL，
  // 两端不显式传 channel 时行为与旧版一致，向后兼容。
  private channel: string;
  // 本实例唯一 id：用于避免处理自己发出的请求（自答自问，方案 A）。
  private senderId: string;
  // 是否运行在可用的浏览器环境（存在 window）。
  // 非浏览器环境（node/SSR）下降级为惰性 no-op，避免实例化即抛错。
  private available: boolean;

  constructor(targetWindow?: Window, targetOrigin = '*', channel: string = DEFAULT_CHANNEL) {
    this.targetOrigin = targetOrigin;
    this.channel = channel;
    this.senderId = getRandomString(12);
    this.messageHandlers = new Map();
    this.pendingRequests = new Map();
    this.available = typeof window !== 'undefined';
    if (!this.available) {
      // 无 window：桥接不可用，保留空实例，各操作降级处理。
      this.targetWindow = undefined as unknown as Window;
      return;
    }
    this.targetWindow = targetWindow ?? window;
    // 注册到共享分发器（方案 C），不再各自 addEventListener。
    bridgeDispatcher.add(this);
  }

  // 用结构化克隆（postMessage 原生能力）直接发对象，盖上协议标记 + 通道 + 发送方 id。
  // 不再走 base64/JSON，从而保留 Date/Map/Set/ArrayBuffer 等类型，也不再额外编解码。
  private post(target: Window, data: MessageData): void {
    const envelope: BridgeEnvelope = {
      ...data,
      __bridge: BRIDGE_MARKER,
      channel: this.channel,
      senderId: this.senderId,
    };
    target.postMessage(envelope, this.targetOrigin);
  }

  // 由共享分发器调用，处理单条 window message 事件。
  // @internal 不建议外部直接调用。
  receive = (event: MessageEvent): void => {
    if (!this.available) return;
    // const hostname = new URL(event.origin).hostname
    // if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin && !whiteList.includes(hostname)) return
    if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) return;

    // 校验来源窗口，避免不同窗口互相串消息。event.source 为 null 时不过滤。
    if (event.source && event.source !== this.targetWindow) return;

    const data = event.data as BridgeEnvelope | undefined;
    // 协议标记过滤：非本协议流量（其它库的 postMessage）直接忽略，
    // 无需解码、无控制台噪音。
    if (!data || typeof data !== 'object' || data.__bridge !== BRIDGE_MARKER) return;
    // 通道隔离：只处理本通道的消息（方案 A，解决同窗口多 bridge 串台）。
    if ((data.channel ?? DEFAULT_CHANNEL) !== this.channel) return;

    const { type, payload, id, isResponse, isError, senderId } = data;

    // 处理响应消息
    if (isResponse && id) {
      const pendingRequest = this.pendingRequests.get(id);
      if (pendingRequest) {
        // 远端 handler 抛错时回传 isError，需要 reject 而不是 resolve，
        // 否则调用方会把错误信息当成正常结果。
        if (isError) {
          pendingRequest.reject(new Error(typeof payload === 'string' ? payload : 'Bridge request failed'));
        } else {
          pendingRequest.resolve(payload);
        }
        this.pendingRequests.delete(id);
      }
      return;
    }

    // 自答自问防护（方案 A）：不处理自己发出的请求。
    // 同窗口做请求/响应时请用两个 bridge 实例（senderId 不同即可互通）。
    if (senderId && senderId === this.senderId) return;

    // 处理普通消息
    if (typeof type !== 'string' || !this.messageHandlers.has(type)) return;
    const handler = this.messageHandlers.get(type);
    if (isFunction(handler)) {
      // 响应回发给消息真正的来源，而非固定的 targetWindow，
      // 避免 targetWindow 与请求来源不一致时回错窗口。
      const replyWindow = (event.source as Window | null) ?? this.targetWindow;
      Promise.resolve(handler(payload))
        .then((response) => {
          if (id) this.post(replyWindow, { type, payload: response, id, isResponse: true });
        })
        .catch((error) => {
          if (id) {
            this.post(replyWindow, {
              type,
              payload: error instanceof Error ? error.message : String(error),
              id,
              isResponse: true,
              isError: true,
            });
          }
        });
    }
  };

  // 注册消息处理器
  on = <T = unknown, R = unknown>(type: string, handler: MessageHandler<T, R>): void => {
    this.messageHandlers.set(type, handler as MessageHandler<any, any>);
  };

  // 移除消息处理器
  off = (type: string): void => {
    this.messageHandlers.delete(type);
  };

  // 发送消息并等待响应
  send = async <T = unknown, R = unknown>(type: string, payload: T): Promise<R> => {
    if (!this.available) {
      return Promise.reject(new Error('PostMessageBridge is unavailable outside a browser environment'));
    }
    const id = getRandomString(10);
    return new Promise<R>((rs, reject) => {
      // 兜底方案，如果一段时间没有收到响应，则请求结束
      const timeout = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, DEFAULT_TIMEOUT);
      const resolve = (value: R) => {
        clearTimeout(timeout);
        rs(value);
      };
      const rejectWith = (error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      };
      // 先注册 pending，再发送，避免响应先于注册到达。
      this.pendingRequests.set(id, { resolve, reject: rejectWith });
      try {
        this.post(this.targetWindow, { type, payload, id });
      } catch (error) {
        // 结构化克隆失败（如 payload 含函数 / DOM 节点）立即 reject，
        // 不再让请求白白等满超时。（循环引用结构化克隆本身能处理）
        this.pendingRequests.delete(id);
        rejectWith(error instanceof Error ? error : new Error('Failed to post message'));
      }
    });
  };

  // 广播消息
  broadcast = <T = unknown>(data: { type: string; payload: T }): void => {
    if (!this.available) return;
    try {
      this.post(this.targetWindow, { type: data.type, payload: data.payload });
    } catch {
      // 广播为尽力而为，克隆失败静默忽略。
    }
  };

  // 清理
  destroy = (): void => {
    bridgeDispatcher.remove(this);
    this.messageHandlers.clear();
    // reject 未决请求，顺带清理各自的 timeout 定时器，避免悬挂。
    this.pendingRequests.forEach((pending) => {
      pending.reject(new Error('Bridge destroyed'));
    });
    this.pendingRequests.clear();
  };
}
// #endregion Bridge end

// #region BridgeManager start
export interface BridgeManagerOptions {
  id?: string;
  targetOrigin?: string;
  targetWindow?: Window;
  /** 通道标识：需要隔离同一窗口上的多个连接时显式指定，两端须一致 */
  channel?: string;
}

export class BridgeManager {
  private static instance: BridgeManager;

  private bridges = new Map<string, PostMessageBridge>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): BridgeManager {
    if (!BridgeManager.instance) {
      BridgeManager.instance = new BridgeManager();
    }
    return BridgeManager.instance;
  }

  // 创建新的 bridge
  connectClient = ({
    id,
    targetOrigin,
    targetWindow,
    channel,
  }: BridgeManagerOptions): { bridge: PostMessageBridge; id: string } => {
    const bridge = new PostMessageBridge(targetWindow, targetOrigin, channel);
    if (!id) {
      id = getRandomString(10);
    }
    if (this.bridges.has(id)) {
      throw new Error(`Bridge ${id} already exists`);
    }
    this.bridges.set(id, bridge);
    return { bridge, id };
  };

  // 获取指定 bridge
  getClient = (id: string): PostMessageBridge | undefined => {
    return this.bridges.get(id);
  };

  // 移除 bridge
  removeClient = (id: string): void => {
    const bridge = this.bridges.get(id);
    if (bridge) {
      bridge.destroy();
      this.bridges.delete(id);
    }
  };

  // 移除所有 bridge
  removeAllClient = (): void => {
    this.bridges.forEach((bridge) => {
      bridge.destroy();
    });
    this.bridges.clear();
  };

  // 广播消息到所有 bridge
  broadcast = <T = unknown>(payload: { type: string; payload: T }): void => {
    this.bridges.forEach((bridge) => {
      bridge.broadcast(payload);
    });
  };

  // 发送消息到指定 bridge
  sendTo = <T = unknown, R = unknown>(id: string, type: string, payload: T): Promise<R> => {
    const bridge = this.getClient(id);
    if (!bridge) {
      return Promise.reject(new Error(`Bridge ${id} not found`));
    }
    return bridge.send<T, R>(type, payload);
  };
}

// 导出单例实例
export const bridgeManager = BridgeManager.getInstance();

// #endregion BridgeManager end

// #region Client start

export interface BroadcastPayload {
  type: string;
  payload: unknown;
}

export interface CallToPayload<T = unknown> {
  id: string;
  type: string;
  payload: T;
}

export const Client = {
  // 连接 Client
  connect: ({
    id,
    targetWindow,
    targetOrigin,
    channel,
  }: BridgeManagerOptions): { bridge: PostMessageBridge; id: string } => {
    return bridgeManager.connectClient({ id, targetWindow, targetOrigin, channel });
  },
  // 移除 Client 连接
  remove: (id: string): void => {
    if (!id) return;
    bridgeManager.removeClient(id);
  },
  // 移除所有 Client 连接
  removeAll: (): void => {
    bridgeManager.removeAllClient();
  },
  /** 广播消息到所有 Platform */
  broadcast: (payload: BroadcastPayload): void => {
    return bridgeManager.broadcast(payload);
  },
  /** 发送消息到指定 Platform */
  call: <T = unknown, R = unknown>({ id, type, payload }: CallToPayload<T>): Promise<R> => {
    return bridgeManager.sendTo<T, R>(id, type, payload);
  },
  /** 广播消息到所有所有可以接收消息的窗口 (为了安全考虑，不建议使用) */
  broadcastToAll: (payload: BroadcastPayload): void => {
    if (typeof window === 'undefined') return;
    // 与 bridge 协议一致：发结构化信封（带协议标记 + 默认通道），
    // 这样接收端的 PostMessageBridge / Platform 才能识别。
    const envelope: BridgeEnvelope = {
      __bridge: BRIDGE_MARKER,
      channel: DEFAULT_CHANNEL,
      type: payload.type,
      payload: payload.payload,
    };
    return window.postMessage(envelope, '*');
  },
};
// #endregion Client end

// #region Platform start
export const initPlatform = <T = unknown, R = unknown>(
  events: Record<string, MessageHandler<T, R>>,
): { destroy: () => void } => {
  const handlers = new Map<string, MessageHandler<T, R>>(
    Object.entries(events).filter((entry): entry is [string, MessageHandler<T, R>] => isFunction(entry[1])),
  );

  // 找到指定的元素，建立连接，通信。
  // 与 PostMessageBridge 使用同一套信封协议（结构化对象 + 协议标记 + 通道），
  // 因此 Client(PostMessageBridge) ↔ Platform 可以直接互通。
  const initBridge = async (event: MessageEvent) => {
    // const hostname = new URL(event.origin).hostname
    // if (!whiteList.includes(hostname)) return
    const data = event.data as BridgeEnvelope<T> | undefined;
    // 协议标记过滤：忽略非本协议的 postMessage 流量。
    if (!data || typeof data !== 'object' || data.__bridge !== BRIDGE_MARKER) return;
    const { type, payload, id } = data;
    const channel = data.channel ?? DEFAULT_CHANNEL;
    if (typeof type !== 'string' || !handlers.has(type)) return;
    const handler = handlers.get(type);
    if (!handler) return;
    const reply = (body: Partial<BridgeEnvelope<unknown>>) => {
      if (!id) return;
      event.source?.postMessage(
        { __bridge: BRIDGE_MARKER, channel, type, id, isResponse: true, ...body },
        { targetOrigin: event.origin },
      );
    };
    try {
      const result = await handler(payload);
      reply({ payload: result });
    } catch (error) {
      // 回传错误，让调用方 reject，而不是一直等到超时。
      reply({ payload: error instanceof Error ? error.message : String(error), isError: true });
    }
  };
  window.removeEventListener('message', initBridge);
  // iframe 中建立连接
  window.addEventListener('message', initBridge);

  const destroy = () => {
    window.removeEventListener('message', initBridge);
  };

  return {
    destroy,
  };
};

export const Platform = {
  init: initPlatform,
};
// #endregion Platform end

// #region PortBridge start
/**
 * 基于 MessagePort 的点对点桥接（方案 B，作为新 API 提供）。
 *
 * 与 PostMessageBridge 的「全局广播 + 过滤」不同，MessagePort 是浏览器提供的
 * 私有点对点信道：只有握手时拿到 port 的双方能通信。因此天然规避了
 * 跨窗口串消息、来源伪造、同窗口多桥串台、自答自问等问题，也无需 origin 过滤、
 * 无需协议标记、无需 base64——payload 直接走结构化克隆。
 *
 * 典型用法：
 *   // A 窗口（发起方）
 *   const bridge = openPortBridge({ targetWindow: iframe.contentWindow, targetOrigin });
 *   const res = await bridge.send('ping', { n: 1 });
 *
 *   // B 窗口（接收方）
 *   const bridge = await acceptPortBridge({ targetOrigin });
 *   bridge.on('ping', ({ n }) => n + 1);
 *
 * 也可用于已有 port 的场景（Web Worker / SharedWorker）：createPortBridge(port)。
 */
export interface PortBridge {
  on: <T = unknown, R = unknown>(type: string, handler: MessageHandler<T, R>) => void;
  off: (type: string) => void;
  send: <T = unknown, R = unknown>(type: string, payload: T) => Promise<R>;
  broadcast: <T = unknown>(data: { type: string; payload: T }) => void;
  destroy: () => void;
}

// 握手消息标记：接收方据此识别「有人递来了 port」。
const PORT_INIT_MARKER = '__ranuts_port_init__';

export interface OpenPortBridgeOptions {
  targetWindow: Window;
  targetOrigin?: string;
  /** 连接名：一个页面里区分多个独立 port 连接，两端须一致（默认 'default'） */
  name?: string;
}

export interface AcceptPortBridgeOptions {
  targetOrigin?: string;
  name?: string;
}

/**
 * 在任意 MessagePort 上构建 bridge（Web Worker / SharedWorker 或已握手的 port）。
 */
export const createPortBridge = (port: MessagePort): PortBridge => {
  const messageHandlers = new Map<string, MessageHandler<any, any>>();
  const pendingRequests = new Map<string, PendingRequest<any>>();

  const onMessage = (event: MessageEvent): void => {
    const data = event.data as MessageData | undefined;
    if (!data || typeof data !== 'object' || typeof data.type !== 'string') return;
    const { type, payload, id, isResponse, isError } = data;

    if (isResponse && id) {
      const pending = pendingRequests.get(id);
      if (pending) {
        if (isError) pending.reject(new Error(typeof payload === 'string' ? payload : 'Bridge request failed'));
        else pending.resolve(payload);
        pendingRequests.delete(id);
      }
      return;
    }

    if (!messageHandlers.has(type)) return;
    const handler = messageHandlers.get(type);
    if (isFunction(handler)) {
      Promise.resolve(handler(payload))
        .then((response) => {
          if (id) port.postMessage({ type, payload: response, id, isResponse: true });
        })
        .catch((error) => {
          if (id) {
            port.postMessage({
              type,
              payload: error instanceof Error ? error.message : String(error),
              id,
              isResponse: true,
              isError: true,
            });
          }
        });
    }
  };

  port.addEventListener('message', onMessage);
  // 使用 addEventListener 时需显式 start() 才开始收消息。
  port.start();

  return {
    on: (type, handler) => {
      messageHandlers.set(type, handler as MessageHandler<any, any>);
    },
    off: (type) => {
      messageHandlers.delete(type);
    },
    send: <T = unknown, R = unknown>(type: string, payload: T): Promise<R> => {
      const id = getRandomString(10);
      return new Promise<R>((rs, reject) => {
        const timeout = setTimeout(() => {
          if (pendingRequests.has(id)) {
            pendingRequests.delete(id);
            reject(new Error('Request timeout'));
          }
        }, DEFAULT_TIMEOUT);
        const resolve = (value: R) => {
          clearTimeout(timeout);
          rs(value);
        };
        const rejectWith = (error: unknown) => {
          clearTimeout(timeout);
          reject(error);
        };
        pendingRequests.set(id, { resolve, reject: rejectWith });
        try {
          port.postMessage({ type, payload, id });
        } catch (error) {
          pendingRequests.delete(id);
          rejectWith(error instanceof Error ? error : new Error('Failed to post message'));
        }
      });
    },
    broadcast: (data) => {
      try {
        port.postMessage({ type: data.type, payload: data.payload });
      } catch {
        // 尽力而为
      }
    },
    destroy: () => {
      port.removeEventListener('message', onMessage);
      messageHandlers.clear();
      pendingRequests.forEach((pending) => pending.reject(new Error('Bridge destroyed')));
      pendingRequests.clear();
      port.close();
    },
  };
};

/**
 * 发起方：创建 MessageChannel，把一端交给目标窗口，自己持有另一端。
 */
export const openPortBridge = ({
  targetWindow,
  targetOrigin = '*',
  name = 'default',
}: OpenPortBridgeOptions): PortBridge => {
  const channel = new MessageChannel();
  targetWindow.postMessage({ [PORT_INIT_MARKER]: true, name }, targetOrigin, [channel.port2]);
  return createPortBridge(channel.port1);
};

/**
 * 接收方：等待发起方递来的 port，握手完成后返回 bridge。
 * 返回的 Promise 在收到匹配 name 的握手消息后 resolve。
 */
export const acceptPortBridge = ({
  targetOrigin = '*',
  name = 'default',
}: AcceptPortBridgeOptions = {}): Promise<PortBridge> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('acceptPortBridge is unavailable outside a browser environment'));
  }
  return new Promise<PortBridge>((resolve) => {
    const onInit = (event: MessageEvent): void => {
      if (targetOrigin !== '*' && event.origin !== targetOrigin) return;
      const data = event.data as { [PORT_INIT_MARKER]?: boolean; name?: string } | undefined;
      if (!data || typeof data !== 'object' || data[PORT_INIT_MARKER] !== true || data.name !== name) return;
      const port = event.ports?.[0];
      if (!port) return;
      window.removeEventListener('message', onInit);
      resolve(createPortBridge(port));
    };
    window.addEventListener('message', onInit);
  });
};
// #endregion PortBridge end
