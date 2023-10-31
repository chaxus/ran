import fs from '@/file/fs';
import readFile from '@/file/readFile';
import type { Error } from '@/file/fs';

/**
 * @description: 给一个已经存在的文件追加内容
 * @param {string} path 文件路径
 * @param {string} content 新加的内容
 * @return {Promise}
 */

const appendFile = (
  path: string,
  content: string,
): Promise<Ranuts.Identification> =>
  new Promise((resolve, reject) => {
    fs.appendFile(path, content, (err: Error) => {
      err
        ? reject({ success: false, _identification: false, data: err })
        : readFile(path).then((result) => {
            resolve(result);
          });
    });
  });

export default appendFile;
