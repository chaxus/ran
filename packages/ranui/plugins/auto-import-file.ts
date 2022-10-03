import { Plugin } from 'vite';
import fs from "fs";
import ranuts from 'ranuts';
const { writeFile, watchFile, readFile } = ranuts;

interface Options {
    ignore?: Array<string>,
    path: Array<string>
}
/**
 * @description: 递归的查找目录
 * @return {*}
 */
const recursionFindFile = (path: Array<string>) => {
    for (const item of path) {
        const fileList = fs.readdirSync(item)
        for (const file of fileList) {

        }
    }
}

const createIndex = async (options: Options, entry: string) => {
    let content = ''
    const { path = [] } = options
    try {
        for (const item of path) {
            const fileList = fs.readdirSync(item)
            for (const file of fileList) {
                content += `import '${path}/${file}/index.ts';\n`
            }
        }
        const currContent = await readFile(entry)
        if (currContent !== content) return await writeFile(entry, content)
        return { status: false }
    } catch (error) {
        throw error
    }

}

export default function autoImportFilePlugin(options: Options): Plugin {
    return {
        name: 'vite-plugin-auto-import-file',
        async config(context) {
            const { entry = '' } = context.build?.lib || {};
            if (entry) await createIndex(options, entry)
        },
        async handleHotUpdate(context) {
            const { entry = '' } = context.server.config.build.lib || {}
            if (entry ) await createIndex(options, entry)
        }
    }
}