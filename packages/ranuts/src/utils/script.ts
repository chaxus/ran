/**
 * 动态插入 script/link 标签
 * @param {Array | String} url script/link的url队列
 * @param {Element} append 插入的父元素 默认 body
 * @param {Function} callback 所有 script onload 回调 也可通过返回的 promise 执行回调
 */
export const scriptOnLoad = (urls: string[], append?: HTMLElement, callback?: Function): Promise<void> => {
  urls = Array.isArray(urls) ? urls : [urls];
  const array = urls.map((src) => {
    // Check if the URL ends with .css using string operations instead of regex
    const isCss = src.toLowerCase().endsWith('.css');
    let script: HTMLLinkElement | HTMLScriptElement;
    if (isCss) {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = src;
      script = link;
    } else {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
    }
    const bodyElement = document.getElementsByTagName('body')[0];
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
      if (typeof callback === 'function') {
        callback();
      }
      resolve();
    });
  });
};
