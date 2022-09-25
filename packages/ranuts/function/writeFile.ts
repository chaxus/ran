const fs = require('fs')

const writeFile = (path: string, content: string) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, {
            mode: 438, // 可读可写666，转化为十进制就是438 
            flag: 'w+', // r+并不会清空再写入，w+会清空再写入
            encoding: 'utf-8'
        }, (err: any) => {
            if (err) {
                reject(err)
                throw err
            } else {
                resolve({ path, content })
            }
        })

    })
}

export default writeFile