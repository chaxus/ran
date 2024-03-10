import type { BaseReturn } from '@/utils/bom';
/**
 * @description: 校验图片尺寸
 * @param {File} file
 * @return {*}
 */
export const isImageSize = (file: File, width?: number, height?: number): Promise<boolean> => {
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
export interface convertImageToBase64Return extends BaseReturn {
  data: string | ArrayBuffer | null;
}
/**
 * @description: 图片转base64
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
