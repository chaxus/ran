import { Plugin } from 'vite';
import fs from "fs";
import pkg from 'ranuts';
const { writeFile } = pkg;

interface Options {
    ignore?: Array<string>,
    path: Array<string>
}

export default function componentsIndexPlugin(options: Options): Plugin {
    return {
        name: 'vite-plugin-components-index',
        config(value) {
            const { path } = options
            const { entry = '' } = value.build?.lib || {};
            let content = ''
            path.forEach(item => {
                fs.readdirSync(item).forEach(data => {
                    content += `import '${path}/${data}/index.ts';\n`
                    writeFile(entry, content)
                    // fs.writeFile(entry, content, {
                    //     mode: 438, // 可读可写666，转化为十进制就是438 
                    //     flag: 'w+', // r+并不会清空再写入，w+会清空再写入
                    //     encoding: 'utf-8'
                    // }, (err) => {
                    //     if (err) throw { err }
                    // })
                })
            })
        }
    }
}