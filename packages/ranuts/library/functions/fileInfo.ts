import fs from '../node/fs'


type Error = NodeJS.ErrnoException | null

/**
 * @description: 查询一个文件的详细信息，一般用于区分文件还是目录（data.isDirectory()）
 * @param {string} path 文件路径
 * @return {Promise}
 */

const queryFileInfo = (path: string) =>
  new Promise((resolve, reject) => {
    fs.stat(path, (err: Error, data: string) => {
      err ? reject({ status: false, data: err }) : resolve({ status: true, data });
    });
  });

export default queryFileInfo;