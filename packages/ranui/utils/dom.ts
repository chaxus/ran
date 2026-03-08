import { md5 } from 'ranuts/utils';
import { Div, Span, View } from './builder';

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
      const container = Div()
        .style({
          display: 'flex',
          'align-items': 'center',
          margin: '15px',
          'justify-content': 'center',
          'flex-flow': 'column nowrap',
        })
        .children(View('r-icon').attr('name', item).attr('size', '50'), Span().text(item))
        .build();
      dom?.appendChild(container);
    });
  }, 0);
};

// Cache for loaded scripts
const loadedScripts = new Set<string>();

/**
 * @description: 动态加载脚本
 */
export const loadScript = ({ type, content }: { type: string; content: string }): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    // Generate a unique key for the script using MD5
    const scriptKey = md5(content);

    // Check if script is already loaded
    if (loadedScripts.has(scriptKey)) {
      resolve({ success: true });
      return;
    }

    const script = document.createElement('script');
    if (type === 'url') {
      script.src = content;
    }
    if (type === 'content') {
      script.textContent = content;
    }
    script.onload = function () {
      loadedScripts.add(scriptKey);
      resolve({ success: true });
    };
    script.onerror = function (error) {
      reject({ success: false, error });
    };
    document.body.append(script);
  });
};

/**
 * 转义 HTML 特殊字符，防止 XSS
 */
export const escapeHtml = (unsafe: any): string => {
  if (typeof unsafe !== 'string') return String(unsafe);
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * 极简的声明式模板实现
 * 将模板字符串解析为 DocumentFragment，并对动态部分进行转义防止 XSS
 */
export const html = (strings: TemplateStringsArray, ...values: any[]): DocumentFragment => {
  const template = document.createElement('template');
  template.innerHTML = strings.reduce((acc, str, i) => {
    const value = values[i - 1];
    const safeValue = Array.isArray(value) ? value.map(escapeHtml).join('') : escapeHtml(value);
    return acc + safeValue + str;
  });
  return template.content;
};

/**
 * 根据文件扩展名获取 MIME 类型
 */
export function getMimeTypeFromExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    pdf: 'application/pdf',
    txt: 'text/plain',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}
