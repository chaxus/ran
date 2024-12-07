import type { Stats } from 'node:fs';
import fs from '@/node/fs';

/**
 * @description: 观察一个文件是否被改变，返回状态
 * @param {string} path 监听的文件路径
 * @param {number} interval 监听的时间，单位毫秒，默认 20 毫秒
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
