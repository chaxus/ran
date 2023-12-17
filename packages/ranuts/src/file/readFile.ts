import fs from '@/file/fs';
import type { Error, FilePromiseResult } from '@/file/fs';

/**
 * @description: 读取一个文件，读取成功返回状态码和文件内容
 * @param {string} path 文件路径
 * @param {string} format 读取格式，默认utf-8
 * @return {Promise}
 */
const readFile = (path: string, format: BufferEncoding = 'utf-8'): FilePromiseResult => {
  const controller = new AbortController();
  const signal = controller.signal;
  const result: FilePromiseResult = new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: format, signal }, (err: Error, data: string) => {
      if (err) {
        controller.abort();
        reject({ success: false, _identification: false, data: err });
      } else {
        resolve({ success: true, _identification: true, data });
      }
    });
  });
  result.abort = controller.abort;
  return result;
};

export default readFile;
