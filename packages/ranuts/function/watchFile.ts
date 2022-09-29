import { Stats } from 'fs'
const fs = require('fs')

// 每20毫秒监控一次  
const watchFile = (path: string, interval: number = 20) => {
    new Promise((resolve, reject) => {
        fs.watchFile(path, { interval }, (curr: Stats, prev: Stats) => {
            console.log('curr', '文件被改变了',curr,prev);
            if (curr.mtime !== prev.mtime) {
               
                fs.unwatchFile(path)
                resolve(true)
            }
        })
    })
}

export default watchFile