import { Stats } from "fs";
import { fs } from '@/function/nodeLibrary'


// 每20毫秒监控一次
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
