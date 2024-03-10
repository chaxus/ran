import fs from '@/node/fs';
import readFile from '@/node/readFile';
import type { Error } from '@/node/fs';

/**
 * @description: 给一个已经存在的文件追加内容
 * @param {string} path 文件路径
 * @param {string} content 新加的内容
 * @return {Promise}
 */

export const appendFile = (path: string, content: string): Promise<Ranuts.Identification> =>
  new Promise((resolve, reject) => {
    fs.appendFile(path, content, (err: Error) => {
      err
        ? reject({ success: false, _identification: false, data: err })
        : readFile(path).then((result: Ranuts.Identification | PromiseLike<Ranuts.Identification>) => {
            resolve(result);
          });
    });
  });
