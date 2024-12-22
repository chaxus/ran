import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getMime } from 'ranuts';
import { vite } from '@/app/lib/vite';
import { HtmlWritable, getEnv } from '@/app/lib/index';
import { FORMAT, HTML_PATH_MAP, RENDER_PATH_MAP, TEMPLATE_REPLACE } from '@/app/lib/constant';
import type { Context } from '@/app/types/index';

const env = getEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class HomeController {
  async index(ctx: Context): Promise<void> {
    try {
      const fsTemplate = fs.readFileSync(path.resolve(__dirname, HTML_PATH_MAP[env]), FORMAT);
      const template = await vite.transformIndexHtml(ctx.request.path, fsTemplate);
      const { render } = await vite.ssrLoadModule(path.resolve(__dirname, RENDER_PATH_MAP[env]));
      const writable = new HtmlWritable();
      const stream = render(ctx, {
        onShellReady() {
          stream.pipe(writable);
        },
        onShellError() {
          ctx.res.write('<h1>Something went wrong</h1>');
        },
        onError(error: Error) {
          // ctx.errorHandler({ error });
          console.log('home:', error);
        },
        onAllReady() {
          const type = getMime(ctx.request.url) || 'text/html';
          if (type) {
            ctx.res.setHeader('Content-Type', type);
          } else {
            // 如果 `getMime` 返回 `null` 或 `undefined`，你可以手动设置 `Content-Type`
            //  ctx.res.setHeader('Content-Type', 'application/javascript');
            // ctx.response.setHeader('Content-Type', 'text/html');
            // ctx.response.setHeader('Transfer-Encoding', 'chunked');
          }
        },
      });
      const writeableFinish = (): Promise<{ success: true; data: string }> => {
        return new Promise((resolve, reject) => {
          writable.on('finish', () => {
            const stream = writable.getHtml();
            const html = template.replace(TEMPLATE_REPLACE, stream);
            resolve({ success: true, data: html });
          });
          writable.on('error', (error) => {
            reject({ success: false, data: error });
          });
        });
      };
      const result = await writeableFinish();
      ctx.res.end(result.data);
    } catch (error) {
      console.log('home:', error);
      // ctx.errorHandler({ error });
    }
  }
}
