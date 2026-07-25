import fs from '@/node/fs';
import readFile from '@/node/readFile';
import type { Error } from '@/node/fs';

/**
 * @description: Append content to an existing file
 * @param {string} path file path
 * @param {string} content content to append
 * @return {Promise}
 */

export const appendFile = (path: string, content: string): Promise<Ranuts.Identification> =>
  new Promise((resolve, reject) => {
    fs.appendFile(path, content, (err: Error) => {
      if (err) {
        reject({ success: false, _identification: false, data: err });
      } else {
        readFile(path).then((result: Ranuts.Identification | PromiseLike<Ranuts.Identification>) => {
          resolve(result);
        });
      }
    });
  });
