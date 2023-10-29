export interface BaseReturn {
  success: boolean;
  message?: string;
}

/**
 * @description: 将url上的字符串转换成对象
 * @param {string} url
 * @param {*} string
 * @return {*}
 */
export const getAllQueryString = (url: string): Record<string, string> => {
  if (typeof window !== "undefined") {
    const r: Record<string, string> = {};
    const href = url || window.location.href;
    if (href.split("?")[1]) {
      const str = href.split("?")[1];
      const strList = str.split("&");
      strList.forEach((item) => {
        const [key, val] = item.split("=");
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
 * @description: 将一个对象转换成querystring，拼接到url后面
 * @return {*}
 */
export function getFreshUrl(
  url: string,
  params: Record<string, string> = {}
): string {
  let _url = url;
  if (_url.indexOf("//") === 0) {
    _url = _url.replace("//", "https://");
  }
  const urlObj = new URL(_url);
  if (params) {
    Object.keys(params).forEach((key) => {
      params[key] && urlObj.searchParams.set(key, params[key]);
    });
  }
  return urlObj.href;
}
/**
 * @description: 防抖
 * @param {any} fn
 * @param {*} ms
 * @return {*}
 */
export const debounce = (fn: any, ms = 500): any => {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};
/**
 * @description: 节流
 * @param {any} fn
 * @param {*} wait
 * @return {*}
 */
export const throttle = (fn: any, wait = 300): any => {
  let timer: NodeJS.Timeout | null;
  return function (this: any) {
    const context = this;
    const args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(context, args);
      }, wait);
    }
  };
};
/**
 * @description: requestAnimationFrame节流
 * @param {any} fn
 * @return {*}
 */
export const requestAnimation = (fn: any): any => {
  let ticking = false;
  return function (this: any) {
    const context = this;
    const args = arguments;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        fn.apply(context, args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

type Func = () => unknown;
/**
 * @description: 返回缓存的函数，执行一次后，无须执行直接返回结果
 * @param {Func} fn
 * @return {Func}
 */
export const memoize = (fn: unknown): Func => {
  let cache = false;
  let result: unknown = undefined;
  return (...args: unknown[]) => {
    if (cache) {
      return result;
    } else {
      result = typeof fn === "function" ? fn(...args) : fn;
      cache = true;
      // Allow to clean up memory for fn
      // and all dependent resources
      fn = undefined;
      return result;
    }
  };
};

/**
 * @description: 将exports对象拼接到obj上，并冻结obj
 * @param {Object} obj
 * @param {Object} exports
 * @return {Object}
 */
export const mergeExports = (obj: Object, exports: Object): Object => {
  const descriptors = Object.getOwnPropertyDescriptors(exports);
  for (const name of Object.keys(descriptors)) {
    const descriptor = descriptors[name];
    if (descriptor.get) {
      const fn = descriptor.get;
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: true,
        get: memoize(fn),
      });
    } else if (typeof descriptor.value === "object") {
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: mergeExports({}, descriptor.value),
      });
    } else {
      throw new Error(
        "Exposed values must be either a getter or an nested object"
      );
    }
  }
  return Object.freeze(obj);
};

export const noop = (): void => { };

export type Noop = () => void;
/**
 * @description: 判断当前设备
 * @param {*} function
 * @return {*}
 */

type JudgeDeviceReturn = "ipad" | "android" | "iphone" | "pc";
export const judgeDevice = (): JudgeDeviceReturn => {
  if (typeof window !== "undefined") {
    const ua = navigator.userAgent.toLowerCase();
    if (/ipad|ipod/.test(ua)) return "ipad";
    if (/android/.test(ua)) return "android";
    if (/iphone/.test(ua)) return "iphone";
    return "pc";
  }
  return "pc";
};

export const isClient = typeof window !== "undefined";

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
    return ua.includes("micromessenger");
  }
  return false;
};

/**
 * @description: 清除空格和换行
 * @param {*} str
 * @return {*}
 */
export const clearBr = (str = ""): string => {
  if (str.length === 0) return "";
  return str
    .replace(/\s+/g, "")
    .replace(/<\/?.+?>/g, "")
    .replace(/[\r\n]/g, "");
};

/**
 * 动态插入script/link标签
 * @param {Array | String} url script/link的url队列
 * @param {Element} append 插入的父元素 默认body
 * @param {Function} callback 所有script onload回调 也可通过返回的promise执行回调
 */
export const scriptOnLoad = (
  urls: string[],
  append?: HTMLElement,
  callback?: Function
): Promise<void> => {
  urls = Array.isArray(urls) ? urls : [urls];
  const array = urls.map((src) => {
    const cssReg = /\w*.css$/;
    let script: HTMLLinkElement | HTMLScriptElement;
    if (cssReg.test(src)) {
      const link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = src;
      script = link;
    } else {
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
    }
    const bodyElement = document.getElementsByTagName("body")[0];
    const currentAppend = append || bodyElement;
    currentAppend.appendChild(script);
    return new Promise<void>((resolve) => {
      script.onload = () => {
        resolve();
      };
    });
  });

  return new Promise((resolve) => {
    Promise.all(array).then(() => {
      if (typeof callback === "function") {
        callback();
      }
      resolve();
    });
  });
};

/**
 * 是否是移动端
 */
export const isMobile = (): boolean => {
  const ua = window.navigator.userAgent;
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(ua)) {
    return true;
  }
  return false;
};
/**
 * @description: 校验图片尺寸
 * @param {File} file
 * @return {*}
 */
export const isImageSize = (
  file: File,
  width?: number,
  height?: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    img.onload = function () {
      let valid = false;
      if (width) {
        valid = img.width === width;
      }
      if (height) {
        valid = img.height === height;
      }
      _URL.revokeObjectURL(img.src);
      resolve(valid);
    };
    img.src = _URL.createObjectURL(file);
  });
};
/**
 * @description: 覆盖浏览器的后退事件
 * @param {*} callback
 * @return {*}
 */
export const retain = (callback = noop): void => {
  const historyReturnCb = () => {
    callback();
    window.removeEventListener("popstate", historyReturnCb);
  };

  // 向history栈中推入两个和当前页面一样的历史记录，用来在页面发生跳转的时候区分返回和前进动作
  window.history.pushState(null, "", window.location.href);
  setTimeout(() => {
    window.addEventListener("popstate", historyReturnCb);
  }, 500);
};
/**
 * @description: 移除拖拽事件的阴影
 * @param {DragEvent} event
 * @return {*}
 */
// dragDom.addEventListener('mouseenter', removeGhosting);
// dragDom.addEventListener('dragstart', removeGhosting);
// dragDom.addEventListener('drag', removeGhosting);
export const removeGhosting = (event: DragEvent): void => {
  const dragIcon = document.createElement("img");
  const url =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  dragIcon.src = url;
  dragIcon.width = 0;
  dragIcon.height = 0;
  dragIcon.style.opacity = "0";
  if (event.dataTransfer) {
    event.dataTransfer.setDragImage(dragIcon, 0, 0);
  }
};

function formatDuration(time: number): string | number {
  return time < 10 ? `0${time}` : time;
}
/**
 * @description: 时间戳转日期
 * @param {*} timestamp
 * @param {*} returnType
 * @return {*}
 */
export function timestampToTime(
  timestamp?:number | string,
): Date & { format?: Function } {
  let date: Date & { format?: Function } = new Date();
  if (timestamp) {
    date = new Date(timestamp);
  }
  date.format = (format = "YYYY-MM-DD HH:mm:ss"):string => {
    const year = date.getFullYear();
    const month = formatDuration(date.getMonth() + 1);
    const day = formatDuration(date.getDate());
    const hour = formatDuration(date.getHours());
    const minute = formatDuration(date.getMinutes());
    const second = formatDuration(date.getSeconds());
    return format
      .replace(/Y+/gi, `${year}`)
      .replace(/M+/g, `${month}`)
      .replace(/D+/gi, `${day}`)
      .replace(/H+/gi, `${hour}`)
      .replace(/m+/g, `${minute}`)
      .replace(/S+/gi, `${second}`);
  }
  return date
}

/**
 * @description: 对象转url字符串
 * @param {*} data
 * @return {*}
 */
export function querystring(data = {}): string {
  if (typeof data !== "object") {
    throw new TypeError("param must be object");
  }
  return Object.entries(data)
    .reduce(
      (searchParams, [name, value]) =>
        value === undefined || value === null
          ? searchParams
          : (searchParams.append(
            decodeURIComponent(name),
            decodeURIComponent(value)
          ),
            searchParams),
      new URLSearchParams()
    )
    .toString();
}

const transitionJsonToString = (
  jsonObj: string | JSON,
  callback = (error: Error) => { }
) => {
  // 转换后的jsonObj受体对象
  let _jsonObj: string = "";
  // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
  if (Object.prototype.toString.call(jsonObj) !== "[object String]") {
    try {
      _jsonObj = JSON.stringify(jsonObj);
    } catch (error) {
      // 转换失败错误信息
      // console.error('您传递的json数据格式有误，请核对...');
      // console.error(error);
      callback(error);
    }
  } else {
    try {
      jsonObj =
        typeof jsonObj === "string"
          ? jsonObj.replace(/(')/g, '"')
          : JSON.stringify(jsonObj);
      _jsonObj = JSON.stringify(JSON.parse(jsonObj));
    } catch (error) {
      // 转换失败错误信息
      // console.error('您传递的json数据格式有误，请核对...');
      // console.error(error);
      callback(error);
    }
  }
  return _jsonObj;
};
// callback为数据格式化错误的时候处理函数
export const formatJson = (jsonObj: string, callback = () => { }): string => {
  // 转换后的字符串变量
  let formatted = "";
  // 换行缩进位数
  let pad = 0;
  // 一个tab对应空格位数
  const PADDING = "    ";
  // json对象转换为字符串变量
  let jsonString = transitionJsonToString(jsonObj, callback);
  if (!jsonString) {
    return jsonString;
  }
  // 存储需要特殊处理的字符串段
  const _index: { start: number; end: number }[] = [];
  // 存储需要特殊处理的“再数组中的开始位置变量索引
  let _indexStart: number | null = null;
  // 存储需要特殊处理的“再数组中的结束位置变量索引
  let _indexEnd: number | null = null;
  // 将jsonString字符串内容通过\r\n符分割成数组
  let jsonArray: string[] = [];
  // 正则匹配到{,}符号则在两边添加回车换行
  jsonString = jsonString.replace(/([{}])/g, "\r\n$1\r\n");
  // 正则匹配到[,]符号则在两边添加回车换行
  jsonString = jsonString.replace(/([[\]])/g, "\r\n$1\r\n");
  // 正则匹配到,符号则在两边添加回车换行
  jsonString = jsonString.replace(/(,)/g, "$1\r\n");
  // 正则匹配到要超过一行的换行需要改为一行
  jsonString = jsonString.replace(/(\r\n\r\n)/g, "\r\n");
  // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
  jsonString = jsonString.replace(/\r\n,/g, ",");
  // 特殊处理双引号中的内容
  jsonArray = jsonString.split("\r\n");
  jsonArray.forEach(function (node, index) {
    // 获取当前字符串段中"的数量
    const num = node.match(/"/g) ? node.match(/"/g)?.length || 0 : 0;
    // 判断num是否为奇数来确定是否需要特殊处理
    if (num % 2 && !_indexStart) {
      _indexStart = index;
    }
    if (num % 2 && _indexStart && _indexStart != index) {
      _indexEnd = index;
    }
    // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
    if (_indexStart && _indexEnd) {
      _index.push({
        start: _indexStart,
        end: _indexEnd,
      });
      _indexStart = null;
      _indexEnd = null;
    }
  });
  // 开始处理双引号中的内容，将多余的"去除
  _index.reverse().forEach(function (item, index) {
    const newArray = jsonArray.slice(item.start, item.end + 1);
    jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(""));
  });
  // 奖处理后的数组通过\r\n连接符重组为字符串
  jsonString = jsonArray.join("\r\n");
  // 将匹配到:后为回车换行加大括号替换为冒号加大括号
  jsonString = jsonString.replace(/:\r\n\{/g, ":{");
  // 将匹配到:后为回车换行加中括号替换为冒号加中括号
  jsonString = jsonString.replace(/:\r\n\[/g, ":[");
  // 将上述转换后的字符串再次以\r\n分割成数组
  jsonArray = jsonString.split("\r\n");
  // 将转换完成的字符串根据PADDING值来组合成最终的形态
  jsonArray.forEach(function (item, index) {
    // console.log(item)
    let i = 0;
    // 表示缩进的位数，以tab作为计数单位
    let indent = 0;
    // 表示缩进的位数，以空格作为计数单位
    let padding = "";
    if (item.match(/\{$/) || item.match(/\[$/)) {
      // 匹配到以{和[结尾的时候indent加1
      indent += 1;
    } else if (
      item.match(/\}$/) ||
      item.match(/\]$/) ||
      item.match(/\},$/) ||
      item.match(/\],$/)
    ) {
      // 匹配到以}和]结尾的时候indent减1
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }
    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }
    formatted += padding + item + "\r\n";
    pad += indent;
  });
  // 返回的数据需要去除两边的空格
  return formatted.trim();
};
/**
 * @description: 获取指定的cookie
 * @param {string} objName
 * @return {*}
 */
export const getCookie = (objName: string): string => {
  const arrStr = document.cookie.split("; ");
  for (let i = 0; i < arrStr.length; i++) {
    const item = arrStr[i].split("=");
    if (item[0] == objName) {
      return decodeURIComponent(item[1]);
    }
  }
  return "";
};

interface convertImageToBase64Return extends BaseReturn {
  data: string | ArrayBuffer | null;
}
/**
 * @description: 图片转base64
 * @param {File} file
 * @return {*}
 */
export const convertImageToBase64 = (
  file: File
): Promise<convertImageToBase64Return> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve({ success: true, data: reader.result, message: "" });
    };
    reader.onerror = (e) => {
      reject({ success: false, data: e, message: "" });
    };
    reader.readAsDataURL(file);
  });
};

interface requestUrlToArraybufferReturn extends BaseReturn {
  data: unknown;
}

interface RequestUrlToArraybufferOption {
  responseType: XMLHttpRequestResponseType;
  method: string;
  withCredentials: boolean;
  headers: Record<string, string>;
  body: string;
  onProgress?: Function;
}
/**
 * @description: url转arrayBuffer
 * @param {string} src
 * @param {RequestUrlToArraybufferOption} options
 * @return {*}
 */
export const requestUrlToBuffer = (
  src: string,
  options: RequestUrlToArraybufferOption
): Promise<requestUrlToArraybufferReturn> => {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || "GET", src, true);
    xhr.responseType = options.responseType || "arraybuffer";
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve({ success: true, data: xhr.response, message: "" });
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
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }
    xhr.send(options.body);
  });
};

interface Context {
  backingStorePixelRatio: number;
  webkitBackingStorePixelRatio: number;
  mozBackingStorePixelRatio: number;
  msBackingStorePixelRatio: number;
  oBackingStorePixelRatio: number;
}

export const getPixelRatio = (
  context: CanvasRenderingContext2D & Partial<Context>
): number => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};

export const createObjectURL = async (
  src: Blob | ArrayBuffer | Response
): Promise<string> => {
  if (typeof src === "string") {
    return src;
  } else if (src instanceof Blob) {
    return URL.createObjectURL(src);
  } else if (src instanceof ArrayBuffer) {
    return URL.createObjectURL(new Blob([src]));
  } else if (src instanceof Response) {
    const result = await src.blob();
    return URL.createObjectURL(result);
  } else {
    return src;
  }
};

/**
 * @description: 给指定的元素添加指定的class
 * @param {Element} element
 * @param {string} addClass
 */
export const addClassToElement = (element: Element, addClass: string): void => {
  const classList = element.classList;
  if (!classList.contains(addClass)) {
    classList.add(addClass);
  }
};