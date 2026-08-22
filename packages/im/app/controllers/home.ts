import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderHTMLToString } from 'ranui/ssr-stream';
import { vite } from '@/app/lib/vite';
import { getEnv } from '@/app/lib/index';
import { FORMAT, HTML_PATH_MAP } from '@/app/lib/constant';
import type { Context } from '@/app/types/index';
// Registering the elements is what gives the server anything to render.
import 'ranui/card';
import 'ranui/conversation';
import 'ranui/input';
import 'ranui/button';
import 'ranui/reasoning';
import 'ranui/theme-switch';

const env = getEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class HomeController {
  /**
   * Serves the page with its custom elements already rendered.
   *
   * ranui's elements serialize to Declarative Shadow DOM, so the browser paints the shell —
   * the conversation frame, the composer, the theme switch — before any script runs, and
   * the same elements upgrade in place when it does. There is no separate server component
   * tree to keep in step with the client one, because there is only one implementation of
   * each element.
   *
   * @param ctx Request context.
   */
  async index(ctx: Context): Promise<void> {
    try {
      const template = fs.readFileSync(path.resolve(__dirname, HTML_PATH_MAP[env]), FORMAT);
      const html = await vite.transformIndexHtml(ctx.request.path, template);
      ctx.res.setHeader('Content-Type', 'text/html; charset=utf-8');
      ctx.res.end(await renderHTMLToString(html));
    } catch (error) {
      console.log('home:', error);
      ctx.res.statusCode = 500;
      ctx.res.end('<h1>Something went wrong</h1>');
    }
  }
}
