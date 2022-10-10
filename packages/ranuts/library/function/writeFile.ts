import fs from '@/node/fs'

type Error = NodeJS.ErrnoException | null

/**
 * @description: 根据文件路径创建文件，如果文件存在会清空再写入，如果不存在会创建
 * @param {string} path 文件路径
 * @param {string} content 文件内容
 * @return {Promise}
 */

const writeFile = (path: string, content: string) => new Promise((resolve, reject) => {
    fs.writeFile(path, content, {
        mode: 438, // 可读可写666，转化为十进制就是438 
        flag: 'w+', // r+并不会清空再写入，w+会清空再写入
        encoding: 'utf-8'
    }, (err: Error) => {
        if (err) {
            reject({ status: false, data: err })
            throw err
        } else {
            resolve({ status: true, data: { path, content } })
        }
    })

})

export default writeFile