/**
 * FileReader 的 Promise 封装。原生 FileReader 是 `onload`/`onerror`/`onabort` 三个回调，
 * 忘了接 `onabort` 时用户取消会让 promise 永远挂着——这里三条出口都接上。
 */

type ReadAs = 'arrayBuffer' | 'text' | 'dataURL' | 'binaryString';

const read = <T>(blob: Blob, as: ReadAs, encoding?: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      reject(new Error('FileReader is not available'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as T);
    reader.onerror = () => reject(reader.error ?? new Error('read file error'));
    reader.onabort = () => reject(new Error('read file aborted'));
    if (as === 'arrayBuffer') reader.readAsArrayBuffer(blob);
    else if (as === 'text') reader.readAsText(blob, encoding);
    else if (as === 'dataURL') reader.readAsDataURL(blob);
    else reader.readAsBinaryString(blob);
  });
};

/**
 * @description: 读取 File / Blob 为 ArrayBuffer
 * @param {Blob} blob
 * @return {Promise<ArrayBuffer>}
 */
export const readFileAsArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => read<ArrayBuffer>(blob, 'arrayBuffer');

/**
 * @description: 读取 File / Blob 为 Uint8Array（配合 checkEncoding / arrayBufferToString 做编码嗅探）
 * @param {Blob} blob
 * @return {Promise<Uint8Array>}
 */
export const readFileAsUint8Array = async (blob: Blob): Promise<Uint8Array> =>
  new Uint8Array(await readFileAsArrayBuffer(blob));

/**
 * @description: 读取 File / Blob 为文本
 * @param {Blob} blob
 * @param {string} encoding 字符集，默认 utf-8；未知编码的文本文件应先用 checkEncoding 嗅探
 * @return {Promise<string>}
 */
export const readFileAsText = (blob: Blob, encoding?: string): Promise<string> => read<string>(blob, 'text', encoding);

/**
 * @description: 读取 File / Blob 为 data: URL（图片预览等）
 * @param {Blob} blob
 * @return {Promise<string>}
 */
export const readFileAsDataURL = (blob: Blob): Promise<string> => read<string>(blob, 'dataURL');
