import fs from 'node:fs';
import path from 'node:path';
import type { Context, MiddlewareFunction, Next } from '@/server/server';
import { getMime, setMime } from '@/node/http/mimeType';

interface Option {
  pathname: string;
  fileTypes: Record<string, string>;
}
const staticMiddleware = (option: Partial<Option> = {}): MiddlewareFunction => {
  const { pathname, fileTypes = {} } = option;
  return async (ctx: Context, next: Next): Promise<void> => {
    try {
      const { req, res } = ctx;
      if (req.url) {
        const htmlContentType = 'text/html';
        // 获取传入的地址，如果没有，取当前的目录
        const dirPath = pathname ? pathname : process.cwd();
        // 静态资源文件根路径
        const root = path.normalize(path.resolve(dirPath));
        // 获取访问的文件类型
        const extension = path.extname(req.url).slice(1);
        // 增加mimeType
        Object.keys(fileTypes).forEach((key) => setMime(key, fileTypes[key]));
        // 文件类型后缀
        const type = extension ? getMime(extension) : htmlContentType;
        // 是否支持的文件类型
        const supportedExtension = Boolean(type);
        // 如果这个文件类型不允许访问，则直接返回404
        if (!supportedExtension) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('404: File not found');
          return;
        }

        // 通过url获取访问的文件名称
        let fileName = req.url;
        // 如果访问的路径是 /
        if (req.url === '/') {
          // 则文件名是 index.html
          fileName = 'index.html';
          // 如果访问的文件类型不在允许的类型里面，默认返回index.html
        } else if (!extension) {
          try {
            // 检测文件是否允许访问
            fs.accessSync(
              path.join(root, req.url + '.html'),
              fs.constants.F_OK,
            );
            // 当允许访问时，则返回对应的页面
            fileName = req.url + '.html';
          } catch (e) {
            // 否则直接返回 index.html
            fileName = path.join(req.url, 'index.html');
          }
        }
        // 有文件名且访问的文件类型也允许访问
        const filePath = path.join(root, fileName);
        const isPathUnderRoot = path
          .normalize(path.resolve(filePath))
          .startsWith(root);

        if (!isPathUnderRoot) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('404: File not found');
          return;
        }

        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404: File not found');
          } else {
            res.writeHead(200, { 'Content-Type': type });
            res.end(data);
          }
        });
      } else {
        console.log('request has not url');
      }
      await next();
    } catch (error) {}
  };
};

export default staticMiddleware;
