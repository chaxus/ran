import type { BaseReturn } from '@/utils/bom';
import { isClient } from '@/utils/device';

/**
 * @description: 校验图片尺寸是否等于给定的宽 / 高。两者都传时必须**同时**满足；
 * 都不传时只要图片能解码就算通过。
 *
 * 无论成功失败都会 `revokeObjectURL`，否则每校验一张图就泄漏一个 blob URL，
 * 它们要活到页面卸载才释放。解码失败（损坏文件、非图片）走 reject 而不是永远挂着。
 *
 * @param {File} file 待校验的图片文件
 * @param {number} width 期望宽度（像素）
 * @param {number} height 期望高度（像素）
 * @return {Promise<boolean>}
 */
export const isImageSize = (file: File, width?: number, height?: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // 必须 return：原先只调 reject 不返回，后面照样访问 window，SSR 下直接抛 ReferenceError
    if (!isClient) {
      reject(new Error('isImageSize is browser-only: window is undefined'));
      return;
    }
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    const url = _URL.createObjectURL(file);
    const release = (): void => _URL.revokeObjectURL(url);
    img.onload = (): void => {
      release();
      // 逐条 AND：原先后一个条件会整个覆盖前一个，同时传宽高时宽度形同虚设
      const matchesWidth = width === undefined || img.width === width;
      const matchesHeight = height === undefined || img.height === height;
      resolve(matchesWidth && matchesHeight);
    };
    img.onerror = (): void => {
      release();
      reject(new Error('failed to decode image'));
    };
    img.src = url;
  });
};
export interface convertImageToBase64Return extends BaseReturn {
  data: string | ArrayBuffer | null;
}
/**
 * @description: 图片转 base64
 * @param {File} file
 * @return {*}
 */
export const convertImageToBase64 = (file: File): Promise<convertImageToBase64Return> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve({ success: true, data: reader.result, message: '' });
    };
    reader.onerror = (e) => {
      reject({ success: false, data: e, message: '' });
    };
    reader.readAsDataURL(file);
  });
};
