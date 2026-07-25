import type { Stats } from 'node:fs';
import fs from '@/node/fs';

/**
 * @description: Stat a file — typically to tell a file from a directory via data.isDirectory()
 * @param {string} path file path
 * @return {Promise}
 */

const queryFileInfo = (path: string): Promise<Ranuts.Identification> =>
  new Promise((resolve, reject) => {
    fs.stat(path, (err, data: Stats) => {
      if (err) {
        reject({ success: false, _identification: false, data: err });
      } else {
        resolve({ success: true, _identification: true, data });
      }
    });
  });

export default queryFileInfo;
