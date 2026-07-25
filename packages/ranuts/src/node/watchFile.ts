import type { Stats } from 'node:fs';
import fs from '@/node/fs';

/**
 * @description: Watch a file for changes and report its status
 * @param {string} path file to watch
 * @param {number} interval poll interval in milliseconds, defaults to 20
 * @return {Promise}
 */

const watchFile = (path: string, interval: number = 20): Promise<Ranuts.Identification> =>
  new Promise((resolve) => {
    fs.watchFile(path, { interval }, (curr: Stats, prev: Stats) => {
      if (curr.mtime !== prev.mtime) {
        fs.unwatchFile(path);
        resolve({
          success: true,
          _identification: true,
          data: {},
          message: 'file is changed',
        });
      } else {
        resolve({
          success: false,
          _identification: false,
          data: {},
          message: 'file is not changed',
        });
      }
    });
  });

export default watchFile;
