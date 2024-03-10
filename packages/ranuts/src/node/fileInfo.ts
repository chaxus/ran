import type { Stats } from 'node:fs';
import fs from '@/node/fs';

/**
 * @description: 查询一个文件的详细信息，一般用于区分文件还是目录（data.isDirectory()）
 * @param {string} path 文件路径
 * @return {Promise}
 */

const queryFileInfo = (path: string): Promise<Ranuts.Identification> =>
  new Promise((resolve, reject) => {
    fs.stat(path, (err, data: Stats) => {
      err
        ? reject({ success: false, _identification: false, data: err })
        : resolve({ success: true, _identification: true, data });
    });
  });

export default queryFileInfo;
