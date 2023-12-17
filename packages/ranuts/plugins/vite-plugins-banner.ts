import fs from 'node:fs';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const indexPath = resolve(__dirname, '../dist/index.js');

export default function vitePluginBanner(): Plugin {
  return {
    name: 'vite-plugins-banner',
    // 通用钩子
    closeBundle() {
      fs.readFile(indexPath, 'utf-8', (error, data) => {
        if (!error) {
          const code = data.replace('const fs = {};\n', 'import fs from "node:fs";\n');
          fs.writeFile(
            indexPath,
            code,
            {
              mode: 438, // 可读可写666，转化为十进制就是438
              flag: 'w+', // r+并不会清空再写入，w+会清空再写入
              encoding: 'utf-8',
            },
            (error) => console.error('write bundle error', error),
          );
        } else {
          console.error('read bundle error', error);
        }
      });
    },
  };
}
