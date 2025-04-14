// Pre-render the app into static HTML.
// run `npm run generate` and then `dist/static` can be served as a static site.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const toAbsolute = (p) => path.resolve(__dirname, p);
const template = fs.readFileSync(toAbsolute('../dist/client/index.html'), 'utf-8');
const { render } = await import('../dist/server/server.js');

// determine routes to pre-render from src/pages
const routesToPrerender = fs.readdirSync(toAbsolute('../pages')).map((file) => {
  const name = file.replace(/\.tsx$/, '').toLowerCase();
  return name === 'home' ? `/index` : `/${name}`;
});

(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const appHtml = await render(url);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml);

    const filePath = `../dist/client${url === '/' ? '/index' : url}.html`;
    fs.writeFileSync(toAbsolute(filePath), html);
  }
})();
