import fs from "fs";

const writeFile = (path:string, content:string) => {
    fs.writeFile(path, content, {
        mode: 438, // 可读可写666，转化为十进制就是438 
        flag: 'w+', // r+并不会清空再写入，w+会清空再写入
        encoding: 'utf-8'
    }, (err) => {
        if (err) throw { err }
    })
}

export default writeFile