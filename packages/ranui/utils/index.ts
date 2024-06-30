export const falseList = [false, 'false', null, undefined];
/**
 * @description: 判断这个元素上是否有 disabled 属性
 * @param {Element} element
 * @return {*}
 */
export const isDisabled = (element: Element): boolean => {
  const status = element.hasAttribute('disabled');
  const value = element.getAttribute('disabled');
  if (status && !falseList.includes(value)) return true;
  return false;
};

/**
 * @description: 查询指定元素的子级元素，删除他们的某一个指定 class
 * @param {Element} parent
 * @param {string} deleteClass
 */
export const removeClassToElementChild = (parent: Element, deleteClass: string): void => {
  const pre = parent.querySelectorAll(`.${deleteClass}`);
  if (pre.length > 0) {
    pre.forEach((item) => item.classList.remove(deleteClass));
  }
};

/**
 * @description: 创建 icon 的文档示例
 */
export const createIconList = (): void => {
  setTimeout(() => {
    const list = [
      'add-user',
      'book',
      'check-circle',
      'close-circle',
      'eye-close',
      'eye',
      'info-circle',
      'loading',
      'lock',
      'message',
      'power-off',
      'setting',
      'team',
      'unlock',
      'user',
    ];
    const dom = document.getElementById('icon-list');
    list.forEach((item) => {
      const container = document.createElement('div');
      container.style.setProperty('display', 'flex');
      container.style.setProperty('align-items', 'center');
      container.style.setProperty('margin', '15px');
      container.style.setProperty('justify-content', 'center');
      container.style.setProperty('flex-flow', 'column nowrap');
      const icon = document.createElement('r-icon');
      icon.setAttribute('name', item);
      icon.setAttribute('size', '50');
      container.appendChild(icon);
      const span = document.createElement('span');
      span.innerHTML = item;
      container.appendChild(span);
      console.log(container, dom);
      dom?.appendChild(container);
    });
  }, 0);
};

export const loadScript = (src: string): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = function () {
      resolve({ success: true });
    };
    script.onerror = function (error) {
      reject({ success: false, error });
    };
    document.body.append(script);
  });
};

export interface CustomErrorType {
  new (m: string): void;
}

export function createCustomError(msg: string = ''): CustomErrorType {
  return class CustomError {
    message: string;
    constructor(message: string = msg) {
      this.message = message;
    }
  };
}

export const vod = {
  FD: {
    label: '流畅',
  },
  LD: {
    bandWidth: {
      h264: 1500000, // 1.5 mbps
      h265: 750000, // 0.75 mbps
    },
    label: '标清',
  },
  SD: {
    bandWidth: {
      h264: 3000000,
      h265: 1500000,
    },
    label: '高清',
  },
  HD: {
    bandWidth: {
      h264: 6000000,
      h265: 3000000,
    },
    label: '超清',
  },
  '2K': {
    bandWidth: {
      h264: 15000000,
      h265: 7500000,
    },
    label: '2K',
  },
  '4K': {
    bandWidth: {
      h264: 32000000,
      h265: 15000000,
    },
    label: '4K',
  },
};

export const HTMLElementSSR = (): { new (): HTMLElement; prototype: HTMLElement } | null => {
  if (typeof document !== 'undefined') {
    return HTMLElement;
  }
  return null;
};

export const createSignal = <T = unknown>(
  value: T,
  options?: { subscriber?: Function[]; equals?: boolean | ((prev: T | undefined, next: T) => boolean) },
): [() => T, (newValue: T) => void] => {
  const signal = {
    value,
    // 订阅者
    subscribers: new Set<Function>(),
    comparator: options?.equals,
  };
  const { subscriber } = options || {};
  // 订阅
  if (subscriber && Array.isArray(subscriber)) {
    subscriber.forEach((item) => {
      if (typeof item === 'function' && !signal.subscribers.has(item)) {
        signal.subscribers.add(item);
      }
    });
  }
  const getter = () => {
    return signal.value;
  };
  const updateSignal = (newValue: T) => {
    if (signal.value !== newValue) {
      signal.value = newValue;
      // 通知订阅者
      signal.subscribers.forEach((subscriber) => subscriber(newValue));
    }
  };
  const setter = (newValue: T) => {
    const { comparator } = signal;
    if (comparator instanceof Function) {
      return !comparator(signal.value, newValue) && updateSignal(newValue);
    }
    if (comparator === undefined) {
      if (signal.value !== newValue) {
        updateSignal(newValue);
      }
    } else {
      !comparator && updateSignal(newValue);
    }
  };
  return [getter, setter];
};
