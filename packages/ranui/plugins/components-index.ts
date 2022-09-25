import { Plugin } from 'vite';
import fs from "fs";
import ranuts from 'ranuts';
const { writeFile } = ranuts;

interface Options {
    ignore?: Array<string>,
    path: Array<string>
}

const createIndex = (options: Options, entry: string) => {
    let content = ''
    const { path } = options
    path.forEach(item => {
        fs.readdirSync(item).forEach(async data => {
            content += `import '${path}/${data}/index.ts';\n`
            await writeFile(entry, content)
        })
    })
}

export default function componentsIndexPlugin(options: Options): Plugin {
    return {
        name: 'vite-plugin-components-index',
        config(context) {
            const { entry = '' } = context.build?.lib || {};
            if(entry) createIndex(options, entry)
        },
        handleHotUpdate(context) {
            const { entry = '' } = context.server.config.build.lib || {}
            if(entry) createIndex(options, entry)
        }
    }
}