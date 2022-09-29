import { Plugin } from 'vite';
import fs from "fs";
import ranuts from 'ranuts';
const { writeFile, watchFile } = ranuts;

interface Options {
    ignore?: Array<string>,
    path: Array<string>
}

const createIndex = async (options: Options, entry: string) => {
    let content = ''
    const { path = [] } = options
    const result = []
    try {
        for (const item of path) {
            const fileList = fs.readdirSync(item)
            for (const file of fileList) {
                content += `import '${path}/${file}/index.ts';\n`
                const data = await writeFile(entry, content)
                result.push(data)
            }
        }
        return result
    } catch (error) {
        throw error
    }

}

export default function componentsIndexPlugin(options: Options): Plugin {
    return {
        name: 'vite-plugin-components-index',
        async config(context) {
            const { entry = '' } = context.build?.lib || {};
            if (entry) await createIndex(options, entry)
        },
        async handleHotUpdate(context) {
            const { entry = '' } = context.server.config.build.lib || {}
            const flag = await watchFile(entry)
            if(entry && flag) await createIndex(options, entry)
        }
    }
}