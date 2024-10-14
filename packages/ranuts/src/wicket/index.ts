/**
 * @description: 获取 Set 数据结构的第一个元素
 * @param {Set<T>} T
 * @return {T}
 */
const setShift = <T>(set: Set<T>): T | undefined => {
  const iterator = set.values();
  const { value } = iterator.next();
  return value;
};

// 定义一个函数来生成随机 ID
const generateRandomId = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// webview 组件必须有一个唯一的 id，用于区分不同的 webview 组件
// <webview id="webview1"></webview>
// 同时会存在一个 webview 的类，用于操作 webview 组件，使用方法如下：

// const webviewInstance = new WebView({ id: 'webview1' });
// 一方面实现 iframe 的缓存，展示和隐藏
// 另一方面实现 iframe 和 H5 的通信与交互
interface ActionOption {
  key: string; // 对应的 iframe
  url?: string; // iframe 的链接
  viewOption?: Record<string, string>; // 窗口的自定义属性
  viewStyle?: Record<string, string>; // 窗口的样式
}
// 通过 key，找到对应的 iframe 实例，链接等信息
interface viewMap {
  url: string;
  instance: HTMLIFrameElement; // iframe 实例
  key: string; // 唯一索引
  zIndex: number; // 层级
}

interface WebViewOption {
  id?: string; // 当前 webview 的唯一 id
  size?: number; // 最大的 iframe 数量
}

class WebView {
  public container!: HTMLElement;
  private id: string;
  private keyMapInstance: Map<string, viewMap>;
  private keyList: Set<string>; // 用于记录当前存在的 key
  constructor(options: WebViewOption) {
    const { id = generateRandomId(), size = 5 } = options;
    this.id = id;
    this.size = this.initSize(size);
    this.keyMapInstance = new Map();
    this.keyList = new Set();
    this.initWebview();
  }
  get size(): number {
    return this.size;
  }
  // 设置最大的 iframe 数量时，调整 iframe 的数量
  set size(size: number) {
    if (size < 0) new Error('size 不能小于 0');
    this.size = size;
    while (this.keyList.size > size) {
      const firstKey = setShift<string>(this.keyList);
      if (firstKey) {
        this.destroy({ key: firstKey });
      }
    }
  }
  // 初始化 size
  private initSize = (size: number) => {
    if (size < 0) new Error('size 不能小于 0');
    return size;
  };
  // 初始化 webview
  private initWebview = () => {
    // 有指定 ID 的情况下，直接获取对应的 DOM 实例
    if (document.getElementById(this.id)) {
      this.container = document.getElementById(this.id)!;
    } else {
      // 没有指定 ID 的情况下，创建一个新的 DOM 实例
      this.container = document.createElement('div');
      // 设置 ID
      this.container.setAttribute('id', this.id);
      document.body.appendChild(this.container);
    }
  };
  // 添加 iframe
  public add = (options: ActionOption) => {
    const { key, url, viewOption = {}, viewStyle = {} } = options;
    // 如果 key 已经存在，则不添加，并提示
    if (this.keyList.has(key)) {
      throw new Error('key 已经存在');
    }
    if (!url) {
      throw new Error('url 不能为空');
    }
    if (!key) {
      throw new Error('key 不能为空');
    }
    // 如果超出最大数量，则删除第一个
    if (this.keyList.size >= this.size) {
      const firstKey = setShift<string>(this.keyList);
      if (firstKey) {
        this.destroy({ key: firstKey });
      }
    }
    const iframe = document.createElement('iframe');
    // 设置 iframe 的默认属性
    iframe.setAttribute('src', url);
    iframe.setAttribute('key', key);
    // 默认隐藏
    iframe.style.setProperty('display', 'none');
    // 默认全部展开
    iframe.style.setProperty('width', '100%');
    iframe.style.setProperty('height', '100%');
    // 默认绝对定位
    iframe.style.setProperty('position', 'absolute');
    iframe.style.setProperty('top', '0');
    iframe.style.setProperty('left', '0');
    // 设置 iframe 的自定义属性
    Object.keys(viewOption).forEach((key) => {
      iframe.setAttribute(key, viewOption[key]);
    });
    // 设置 iframe 的自定义样式
    Object.keys(viewStyle).forEach((key) => {
      iframe.style.setProperty(key, viewStyle[key]);
    });
    this.container.appendChild(iframe);
  };
  // 传入 key，展示对应的 iframe
  public show = (options: ActionOption) => {
    const { key } = options;
    if (!this.keyList.has(key)) {
      throw new Error('key 不存在');
    }
    // 按照使用顺序更新排序
    this.keyList.delete(key);
    this.keyList.add(key);
    // 展示对应的 iframe
    const element = this.keyMapInstance.get(key);
    element?.instance.style.setProperty('display', 'block');
  };
  // 传入 key，只展示当前 key 对应的 iframe，隐藏其他的 iframe
  public showOnly = (options: ActionOption) => {
    const { key } = options;
    if (!this.keyList.has(key)) {
      throw new Error('key 不存在');
    }
    // 按照使用顺序更新排序
    this.keyList.delete(key);
    this.keyList.add(key);
    // 只展示对应的 iframe
    for (const [k, v] of this.keyMapInstance) {
      if (k === key) {
        v.instance.style.setProperty('display', 'block');
      } else {
        v.instance.style.setProperty('display', 'none');
      }
    }
  };
  // 隐藏 iframe
  public hidden = (options: ActionOption) => {
    const { key } = options;
    if (!this.keyList.has(key)) {
      throw new Error('key 不存在');
    }
    // 隐藏对应的 iframe
    const element = this.keyMapInstance.get(key);
    element?.instance.style.setProperty('display', 'none');
  };
  // 隐藏所有的 iframe
  public hiddenAll = () => {
    this.keyList.forEach((key) => {
      const element = this.keyMapInstance.get(key);
      element?.instance.style.setProperty('display', 'none');
    });
  };
  // 销毁指定 key 对应的 iframe
  public destroy = (options: ActionOption) => {
    const { key } = options;
    const element = this.keyMapInstance.get(key);
    if (!element?.instance) {
      return new Error('key 不存在');
    }
    this.container.removeChild(element?.instance);
    this.keyMapInstance.delete(key);
    this.keyList.delete(key);
  };
  // 销毁所有的 iframe
  public destroyAll = () => {
    this.keyList.forEach((key) => {
      const element = this.keyMapInstance.get(key);
      if (!element?.instance) return new Error('key 不存在');
      this.container.removeChild(element?.instance);
    });
    this.keyMapInstance.clear();
    this.keyList.clear();
  };
}
