import fs from 'node:fs'
import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite';
// import { queryFileInfo, readDir, readFile, writeFile } from 'ranuts'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

export default function output(): Plugin {
    return {
        name: 'vite-plugin-output',
        options(opts) {
            // console.log('opts',opts);
        },
        closeBundle() {
            const dirPath = resolve(__dirname, '../assets/icons')

        }
    }
}