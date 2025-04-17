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
  return { name, url: name === 'home' ? '/' : `/${name}` };
});

const createClientTemplate = (url) => `
import { StaticRouter } from 'react-router-dom';
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
    fs.mkdirSync(toAbsolute(`../dist/${name}`), { recursive: true });
    // copy the dist/client/views directory to dist/${name}
    fs.cpSync(toAbsolute('../dist/client/views'), toAbsolute(`../dist/${name}`), { recursive: true });
    // copy the dist/client/assets directory to dist/${name}/assets
    fs.cpSync(toAbsolute('../dist/client/assets'), toAbsolute(`../dist/${name}/assets`), { recursive: true });
    // copy the dist/client/public directory to dist/${name}/public
    fs.cpSync(toAbsolute('../dist/client/sw.js'), toAbsolute(`../dist/${name}/sw.js`), { recursive: true });
    // 读取 dist/${name}/assets 目录下的所有文件的名称
    const assets = fs.readdirSync(toAbsolute(`../dist/${name}/assets`));
    // 将所有名称拼接成一个数组字符串，输出
    const assetsString = assets.map((asset) => `"/${asset}"`).join(',');
    // 写入到 sw.js 文件开头
    const swContent = fs.readFileSync(toAbsolute(`../dist/${name}/sw.js`), 'utf-8');
    const newSwContent = 'const SERVICE_WORK_CACHE_FILE_PATHS = [' + assetsString + '];' + swContent;
    fs.writeFileSync(toAbsolute(`../dist/${name}/sw.js`), newSwContent);
    // render the app
    const appHtml = await render(url);
    // read the template
    const template = fs.readFileSync(toAbsolute(`../dist/${name}/index.html`), 'utf-8');
    // replace the ssr-outlet with the app html
    const html = template.replace(`<!--ssr-outlet-->`, appHtml);
    // write to dist/${name}/index.html
    const filePath = `../dist/${name}/index.html`;
    // create the dist/${name} directory if it doesn't exist
    fs.mkdirSync(toAbsolute(path.dirname(filePath)), { recursive: true });
    // write the file
    fs.writeFileSync(toAbsolute(filePath), html);
  }
})();
