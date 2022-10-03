import { fs } from '@/function/nodeLibrary'

type Error = NodeJS.ErrnoException | null

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