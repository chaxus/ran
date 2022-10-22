import { Stats } from "fs";
import fs from '@/node/fs'

/**
 * @description: 观察一个文件是否被改变，返回状态
 * @param {string} path 监听的文件路径
 * @param {number} interval 监听的时间，单位毫秒，默认20毫秒
 * @return {Promise}
 */

const watchFile = (path: string, interval: number = 20) =>
  new Promise((resolve, reject) => {
    fs.watchFile(path, { interval }, (curr: Stats, prev: Stats) => {
      if (curr.mtime !== prev.mtime) {
        fs.unwatchFile(path);
        resolve({ status: true, data: { msg: 'file is changed' } });
      } else {
        resolve({ status: false, data: { msg: 'file is not changed' } })
      }
    })
  });

export default watchFile;

