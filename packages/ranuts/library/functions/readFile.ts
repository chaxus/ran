import fs from '../node/fs'


type Error = NodeJS.ErrnoException | null

/**
 * @description: 读取一个文件，读取成功返回状态码和文件内容
 * @param {string} path 文件路径
 * @param {string} format 读取格式，默认utf-8
 * @return {Promise}
 */

const readFile = (path: string, format: string = "utf-8") =>
  new Promise((resolve, reject) => {
    fs.readFile(path, format, (err: Error, data: string) => {
      err ? reject({ status: false, data: err }) : resolve({ status: true, data });
    });
  });

export default readFile;
