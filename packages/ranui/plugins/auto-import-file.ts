import { Plugin } from 'vite';
import fs from "fs";
import ranuts from 'ranuts';
const { writeFile, readFile, queryFileInfo } = ranuts;

interface Options {
    ignore?: Array<string>,
    path: Array<string>,
    extensions: Array<string>
}

const createIndex = async (options: Options, entry: string) => {
    let content = ''
    const { path = [], extensions = [], ignore = [] } = options
    /**
     * @description: 递归查找目录
     * @param {Array} path
     */
    const recurveFile = async (path: Array<string>) => {
        for (const item of path) {
            const { status, data } = await queryFileInfo(item)
            const extension = item.substring(item.lastIndexOf('.'))
            if (status && data.isFile() && extensions.includes(extension) && !ignore.includes(item)) {
                content += `import '${item}';\n`
            }
            if (status && data.isDirectory() && !ignore.includes(item)) {
                const fileList = fs.readdirSync(item)
                const list = fileList.map(children => `${item}/${children}`)
                await recurveFile(list)
            }
        }
    }
    try {
        await recurveFile(path)
        const currContent = await readFile(entry)
        if (currContent.status && currContent.data !== content) return await writeFile(entry, content)
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
            // const { alias = {} } = context.resolve || {}
            // const aliasList = Object.keys(alias)
            if (entry) await createIndex(options, entry)
        },
        async handleHotUpdate(context) {
            const { entry = '' } = context.server.config.build.lib || {}
            if (entry) await createIndex(options, entry)
        }
    }
}