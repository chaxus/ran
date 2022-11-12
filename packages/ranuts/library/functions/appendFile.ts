import fs from '../node/fs'
import readFile from './readFile'

type Error = NodeJS.ErrnoException | null

interface Status {
    status: boolean;
    message: string;
  }

/**
 * @description: 给一个已经存在的文件追加内容
 * @param {string} path 文件路径
 * @param {string} content 新加的内容
 * @return {Promise} 
 */

const appendFile = (path: string, content: string) =>
    new Promise((resolve, reject) => {
        fs.appendFile(path, content, (err: Error) => {
            err ? reject({ status: false, data: err }) : readFile(path).then((result) => {
                resolve(result)
            })
        });
    });

export default appendFile;
