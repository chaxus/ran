import fs from 'node:fs';
import { createServer } from 'node:http';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { noop } from 'ranuts';
import { routing } from '@/app/routes';
import { createContext, createController } from '@/app/lib/context';
import { LOCAL_URL, MIME_TYPES, PORT } from '@/app/lib/constant';
import type { Context } from '@/app/types/index';
import { vite } from '@/app/lib/vite';

// 静态文件目录
const createStaticDir = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return resolve(__dirname, 'public');
};
// 静态服务
const createStaticServer =
  (dirStatic: string) =>
  (ctx: Context, callback = noop): void => {
    const { req, res } = ctx;
    const filePath = path.join(dirStatic, req.url || '/');
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    fs.readFile(filePath, (error, content) => {
      if (error) {
        // Anything this middleware cannot serve belongs to the next one. Only ENOENT was
        // treated that way, so a request for `/` — which resolves to the static directory
        // itself — answered 500 EISDIR and the page never reached its controller. That
        // stayed hidden while `dist/views/` did not exist, because then the same request
        // failed with ENOENT and fell through.
        //
        // The middleware chain hands in a zero-argument `next`; passing ctx here was
        // ignored at runtime and rejected by tsc, which nothing ran on this package.
        callback();
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  };
// controller 目录
const createControllerDir = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return resolve(__dirname, 'controllers');
};

const dirController = createControllerDir();

createController(dirController).then((controller) => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    // 创建上下文
    createContext(req, res, controller).then((ctx) => {
      // 定义一个处理函数链
      const handleRequest = (handlers: Array<(ctx: Context, next: () => void) => void>, index = 0) => {
        if (index < handlers.length) {
          handlers[index](ctx, () => handleRequest(handlers, index + 1));
        }
      };
      // 处理函数链，包括静态文件服务、Vite 中间件和自定义路由
      const handlers = [
        (ctx: Context, next: () => void) => createStaticServer(createStaticDir())(ctx, next),
        (_: Context, next: () => void) => vite.middlewares(req, res, next),
        (ctx: Context) => routing(ctx),
      ];
      // 开始处理请求
      handleRequest(handlers);
    });
  });
  server.listen(PORT, () => {
    console.log(`Server is running at ${LOCAL_URL}`);
  });
});
