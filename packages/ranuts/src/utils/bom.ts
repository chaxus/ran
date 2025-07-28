import { MessageCodec, getRandomString, isString } from './str';
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
    isClient && window.removeEventListener('popstate', historyReturnCb);
  };

  // 向 history 栈中推入两个和当前页面一样的历史记录，用来在页面发生跳转的时候区分返回和前进动作
  isClient && window.history.pushState(null, '', window.location.href);
  setTimeout(() => {
    isClient && window.addEventListener('popstate', historyReturnCb);
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
      options.onProgress && options.onProgress(event);
    };
    xhr.withCredentials = options.withCredentials || false;
    if (options.headers) {
      Object.keys(options.headers).forEach(function (key) {
        options.headers?.[key] && xhr.setRequestHeader(key, options.headers[key]);
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
}

export interface PendingRequest<R = unknown> {
  resolve: (value: R) => void;
  reject: (error: unknown) => void;
}

const DEFAULT_TIMEOUT = 120000;
// 白名单
// const whiteList = ['localhost', '127.0.0.1', 'chaxus.github.io']

/**
 * Bridge 注册事件，供 client 消费
 */

export class PostMessageBridge {
  private targetWindow: Window;
  private targetOrigin: string;
  private messageHandlers: Map<string, MessageHandler<any, any>>;
  private pendingRequests: Map<string, PendingRequest<any>>;

  constructor(targetWindow: Window = window, targetOrigin = '*') {
    this.targetWindow = targetWindow;
    this.targetOrigin = targetOrigin;
    this.messageHandlers = new Map();
    this.pendingRequests = new Map();
    // 监听消息
    window.addEventListener('message', this.handleMessage);
  }

  private handleMessage = <T = unknown>(event: MessageEvent) => {
    // const hostname = new URL(event.origin).hostname
    // 验证消息来源
    // if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin && !whiteList.includes(hostname)) return
    if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) return;

    // 创建 event.data 的副本，避免对其他监听器造成干扰
    const dataCopy = typeof event.data === 'string' ? String(event.data) : event.data;
    const decodedData = MessageCodec.decode<MessageData<T>>(dataCopy);
    if (!decodedData) return;

    const { type, payload, id, isResponse } = decodedData;

    // 处理响应消息
    if (isResponse && id) {
      const pendingRequest = this.pendingRequests.get(id);
      if (pendingRequest) {
        pendingRequest.resolve(payload);
        this.pendingRequests.delete(id);
      }
      return;
    }

    // 处理普通消息
    const handler = this.messageHandlers.get(type);
    if (handler) {
      Promise.resolve(handler(payload))
        .then((response) => {
          if (id) {
            this.targetWindow.postMessage(
              MessageCodec.encode({
                type,
                payload: response,
                id,
                isResponse: true,
              }),
              this.targetOrigin,
            );
          }
        })
        .catch((error) => {
          if (id) {
            this.targetWindow.postMessage(
              MessageCodec.encode({
                type,
                payload: error.message,
                id,
                isResponse: true,
                isError: true,
              }),
              this.targetOrigin,
            );
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
    const id = Math.random().toString(36).slice(2, 11);
    return new Promise<R>((rs, reject) => {
      this.targetWindow.postMessage(
        MessageCodec.encode({
          type,
          payload,
          id,
        }),
        this.targetOrigin,
      );
      // 兜底方案，如果一段时间没有收到响应，则请求结束
      const timeout = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, DEFAULT_TIMEOUT);
      const resolve = (payload: R) => {
        clearTimeout(timeout);
        rs(payload);
      };
      this.pendingRequests.set(id, { resolve, reject });
    });
  };

  // 广播消息
  broadcast = <T = unknown>(data: { type: string; payload: T }): void => {
    const { type, payload } = data;
    this.targetWindow.postMessage(
      MessageCodec.encode({
        type,
        payload,
      }),
      this.targetOrigin,
    );
  };

  // 清理
  destroy = (): void => {
    window.removeEventListener('message', this.handleMessage);
    this.messageHandlers.clear();
    this.pendingRequests.clear();
  };
}
// #endregion Bridge end

// #region BridgeManager start
export interface BridgeManagerOptions {
  id?: string;
  targetOrigin?: string;
  targetWindow?: Window;
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
  }: BridgeManagerOptions): { bridge: PostMessageBridge; id: string } => {
    const bridge = new PostMessageBridge(targetWindow, targetOrigin);
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
  connect: ({ id, targetWindow, targetOrigin }: BridgeManagerOptions): { bridge: PostMessageBridge; id: string } => {
    return bridgeManager.connectClient({ id, targetWindow, targetOrigin });
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
    console.log('call', id, type, payload);
    return bridgeManager.sendTo<T, R>(id, type, payload);
  },
  /** 广播消息到所有所有可以接收消息的窗口 (为了安全考虑，不建议使用) */
  broadcastToAll: (payload: BroadcastPayload): void => {
    return window.postMessage(MessageCodec.encode(payload), '*');
  },
};
// #endregion Client end

// #region Platform start
export const initPlatform = <T = unknown, R = unknown>(
  events: Record<string, MessageHandler<T, R>>,
): { destroy: () => void } => {
  // 找到指定的元素，建立连接，通信
  const initBridge = async (event: MessageEvent) => {
    // const hostname = new URL(event.origin).hostname
    // 验证消息来源
    // if (!whiteList.includes(hostname)) return
    // 解码
    if (typeof event.data !== 'string') return;
    // 创建 event.data 的副本，避免对其他监听器造成干扰
    const str = String(event.data);
    const decodedData = MessageCodec.decode<MessageData<T>>(str);
    if (!decodedData) return;
    const { type, payload, id } = decodedData;
    const handler = events[type];
    if (!isFunction(handler)) return;
    const result = await handler(payload);
    // 编码
    const encodedData = MessageCodec.encode({ type, payload: result, id, isResponse: true });
    // 发送
    event.source?.postMessage(encodedData, { targetOrigin: event.origin });
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
