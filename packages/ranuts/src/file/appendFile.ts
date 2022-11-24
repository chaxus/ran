import fs from '@/node/fs'
import readFile from '@/file/readFile'

type Error = NodeJS.ErrnoException | null

/**
 * @description: 给一个已经存在的文件追加内容
 * @param {string} path 文件路径
 * @param {string} content 新加的内容
 * @return {Promise} 
 */

const appendFile = (path: string, content: string):Promise<Ranuts.Identification> =>
    new Promise((resolve, reject) => {
        if(!fs._identification) return reject({ _identification: false, data: 'fs is not loaded' })
        fs.appendFile(path, content, (err: Error) => {
            err ? reject({ _identification: false, data: err }) : readFile(path).then((result:Ranuts.Identification) => {
                resolve(result)
            })
        });
    });

export default appendFile;
