import { getMime } from 'ranuts/utils';

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
 * 根据文件扩展名获取 MIME 类型，未知扩展名回落到 `application/octet-stream`。
 */
export function getMimeTypeFromExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return getMime(`.${ext}`) || 'application/octet-stream';
}
