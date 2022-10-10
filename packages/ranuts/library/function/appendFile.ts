import fs from '@/node/fs'
import readFile from '@/function/readFile'

type Error = NodeJS.ErrnoException | null

/**
 * @description: 给一个已经存在的文件追加内容
 * @param {string} path 文件路径
 * @param {string} content 新加的内容
 * @return {Promise} 
 */

const appendFile = (path: string, content: string) =>
    new Promise((resolve, reject) => {
        fs.appendFile(path, content, (err: Error) => {
            err ? reject({ status: false, data: err }) : readFile(path).then((content: string) => {
                resolve({ status: true, data: { path, content } })
            })
        });
    });

export default appendFile;
