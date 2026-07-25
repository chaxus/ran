import fs from 'node:fs';
import path from 'node:path';
import type { Context, MiddlewareFunction, Next } from '@/node/server';
import { getMime, setMime } from '@/utils/mimeType';

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
        // Use the given directory, falling back to the current one
        const dirPath = pathname ? pathname : process.cwd();
        // Static asset root
        const root = path.normalize(path.resolve(dirPath));
        // The requested file's type
        const extension = path.extname(req.url).slice(1);
        // Register the MIME type
        Object.keys(fileTypes).forEach((key) => setMime(key, fileTypes[key]));
        // File extension
        const type = extension ? getMime(extension) : htmlContentType;
        // Is this file type served?
        const supportedExtension = Boolean(type);
        // A disallowed file type is a 404 outright
        if (!supportedExtension) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('404: File not found');
          return;
        }

        // Take the file name from the URL
        let fileName = req.url;
        // The path is /
        if (req.url === '/') {
          // so the file is index.html
          fileName = 'index.html';
          // An unlisted file type falls back to index.html
        } else if (!extension) {
          try {
            // Check whether the file may be served
            fs.accessSync(path.join(root, req.url + '.html'), fs.constants.F_OK);
            // Allowed — serve that page
            fileName = req.url + '.html';
          } catch {
            // otherwise serve index.html
            fileName = path.join(req.url, 'index.html');
          }
        }
        // A file name is present and its type is allowed
        const filePath = path.join(root, fileName);
        const isPathUnderRoot = path.normalize(path.resolve(filePath)).startsWith(root);

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
    } catch {
      // Ignore middleware-chain errors to preserve current static-serving behavior.
    }
  };
};

export default staticMiddleware;
