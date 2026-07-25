import { escapeHtml, getMime } from 'ranuts/utils';
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

/**
 * 极简的声明式模板实现
 * 将模板字符串解析为 DocumentFragment，并对动态部分进行转义防止 XSS
 */
export const html = (strings: TemplateStringsArray, ...values: unknown[]): DocumentFragment => {
  const template = document.createElement('template');
  template.innerHTML = strings.reduce((acc, str, i) => {
    const value = values[i - 1];
    const safeValue = Array.isArray(value)
      ? value.map((item) => escapeHtml(item as string)).join('')
      : escapeHtml(value as string);
    return acc + safeValue + str;
  });
  return template.content;
};

/**
 * 根据文件扩展名获取 MIME 类型，未知扩展名回落到 `application/octet-stream`。
 */
export function getMimeTypeFromExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return getMime(`.${ext}`) || 'application/octet-stream';
}
