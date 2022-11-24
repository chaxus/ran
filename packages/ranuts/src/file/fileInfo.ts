import fs from '@/node/fs'

type Error = NodeJS.ErrnoException | null

/**
 * @description: 查询一个文件的详细信息，一般用于区分文件还是目录（data.isDirectory()）
 * @param {string} path 文件路径
 * @return {Promise}
 */

const queryFileInfo = (path: string):Promise<Ranuts.Identification> =>
  new Promise((resolve, reject) => {
    if(!fs._identification) return reject({ _identification: false, data: 'fs is not loaded' })
    fs.stat(path, (err: Error, data: string) => {
      err ? reject({ _identification: false, data: err }) : resolve({ _identification: true, data });
    });
  });

export default queryFileInfo;