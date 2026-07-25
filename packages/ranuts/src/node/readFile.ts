import fs from '@/node/fs';
import type { Error, FilePromiseResult } from '@/node/fs';

/**
 * @description: Read a file, returning a status code and the content on success
 * @param {string} path file path
 * @param {string} format encoding, defaults to utf-8
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
