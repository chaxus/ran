// Pre-render the app into static HTML.
// run `npm run generate` and then `dist/static` can be served as a static site.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import childProcess from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const toAbsolute = (p) => path.resolve(__dirname, p);
// const template = fs.readFileSync(toAbsolute('../dist/client/index.html'), 'utf-8');
const { render } = await import('../dist/server/server.js');
// determine routes to pre-render from src/pages
const routesToPrerender = fs.readdirSync(toAbsolute('../pages')).map((file) => {
  const name = file.replace(/\.tsx$/, '').toLowerCase();
  return { name: name === 'home' ? 'index' : name, url: name === 'home' ? '/weread/' : `/weread/${name}` };
});

const createClientTemplate = (url) => `import { StaticRouter } from 'react-router-dom';
import { hydrateRoot } from 'react-dom/client';
import { App } from '../app';

const container = document.getElementById('app')!;

hydrateRoot(
  container,
  <StaticRouter location="${url}">
    <App />
  </StaticRouter>,
);
`;

(async () => {
  // pre-render each route...
  for (const { name, url } of routesToPrerender) {
    const clientEntry = createClientTemplate(url);
    // write client entry to views/client.tsx
    fs.writeFileSync(toAbsolute(`../views/client.tsx`), clientEntry);
    // run vite build
    childProcess.execSync(`npm run build:client`);
    // create a directory
    // const distPath = '../dist';
    // if (name !== 'home') {
    //   distPath = `../dist/${name}`;
    // }
    // fs.mkdirSync(toAbsolute(distPath), { recursive: true });
    // copy the dist/client/views directory to dist/${name}
    if (name === 'index') {
      fs.cpSync(toAbsolute('../dist/client/views/index.html'), toAbsolute(`../dist/${name}.html`), { recursive: true });
    } else {
      fs.mkdirSync(toAbsolute(`../dist/${name}`), { recursive: true });
      fs.cpSync(toAbsolute('../dist/client/views/index.html'), toAbsolute(`../dist/${name}/index.html`), {
        recursive: true,
      });
    }
    // copy the dist/client/assets directory to dist/${name}/assets
    // 复制 assets 目录到 dist 目录下的 assets 目录下，如果 assets 目录不存在，则创建，如果 assets 目录下文件同名，则覆盖
    // fs.cpSync(toAbsolute('../dist/client/assets'), toAbsolute(`../dist/assets`), { recursive: true });
    if (!fs.existsSync(toAbsolute(`../dist/assets`))) {
      fs.mkdirSync(toAbsolute(`../dist/assets`), { recursive: true });
    }
    // 复制 assets 目录下的所有文件
    const assetsPath = toAbsolute('../dist/client/assets');
    const distAssetsPath = toAbsolute(`../dist/assets`);
    if (fs.existsSync(assetsPath)) {
      const files = fs.readdirSync(assetsPath);
      files.forEach((file) => {
        const sourcePath = path.join(assetsPath, file);
        const targetPath = path.join(distAssetsPath, file);
        if (fs.statSync(sourcePath).isDirectory()) {
          // 如果是目录，递归复制
          if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
          }
          const subFiles = fs.readdirSync(sourcePath);
          subFiles.forEach((subFile) => {
            fs.copyFileSync(path.join(sourcePath, subFile), path.join(targetPath, subFile));
          });
        } else {
          // 如果是文件，直接复制
          fs.copyFileSync(sourcePath, targetPath);
        }
      });
    }
    // copy the dist/client/public directory to dist/${name}/public
    // 读取 client 下的所有文件，非目录
    const clientFiles = fs.readdirSync(toAbsolute('../dist/client'));
    // 将所有文件复制到 dist/${name}/public
    clientFiles.forEach((file) => {
      fs.cpSync(toAbsolute(`../dist/client/${file}`), toAbsolute(`../dist/${file}`), { recursive: true });
    });
    // 读取 dist/${name}/assets 目录下的所有文件的名称
    const assets = fs.readdirSync(toAbsolute(`../dist/assets`));
    // 将所有名称拼接成一个数组字符串，输出
    const assetsString = assets.map((asset) => `"/weread/assets/${asset}"`).join(',');
    // 写入到 sw.js 文件开头
    const swContent = fs.readFileSync(toAbsolute(`../dist/sw.js`), 'utf-8');
    const newSwContent = 'const SERVICE_WORK_CACHE_FILE_PATHS = [' + assetsString + '];' + swContent;
    fs.writeFileSync(toAbsolute(`../dist/sw.js`), newSwContent);
    // render the app
    const appHtml = await render(url);
    // read the template
    let template = '';
    if (name === 'index') {
      template = fs.readFileSync(toAbsolute(`../dist/${name}.html`), 'utf-8');
    } else {
      template = fs.readFileSync(toAbsolute(`../dist/${name}/index.html`), 'utf-8');
    }
    // replace the ssr-outlet with the app html
    const html = template.replace(`<!--ssr-outlet-->`, appHtml);
    // write to dist/${name}/index.html
    let filePath = '';
    if (name === 'index') {
      filePath = `../dist/${name}.html`;
    } else {
      filePath = `../dist/${name}/index.html`;
    }
    // create the dist/${name} directory if it doesn't exist
    // fs.mkdirSync(toAbsolute(path.dirname(filePath)), { recursive: true });
    // write the file
    fs.writeFileSync(toAbsolute(filePath), html);
  }
})();
