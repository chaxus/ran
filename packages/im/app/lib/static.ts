import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { MIME_TYPES } from './constant';
import type { Context } from '../types/index';

/** Decode once, enforce the real filesystem boundary, then serve only regular files. */
export const createStaticServer =
  (dir: string) =>
  (ctx: Context, next: () => void): void => {
    const { req, res } = ctx;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    void (async () => {
      try {
        const pathname = decodeURIComponent((req.url ?? '/').split('?')[0]);
        if (!pathname.startsWith('/') || pathname.includes('\0') || pathname.includes('\\')) {
          next();
          return;
        }
        const root = await realpath(dir);
        const boundary = root.endsWith(sep) ? root : `${root}${sep}`;
        const candidate = resolve(root, `.${pathname}`);
        if (!candidate.startsWith(boundary)) {
          next();
          return;
        }
        const file = await realpath(candidate);
        if (!file.startsWith(boundary) || !(await stat(file)).isFile()) {
          next();
          return;
        }
        const body = req.method === 'HEAD' ? undefined : await readFile(file);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' });
        res.end(body);
      } catch {
        next();
      }
    })();
  };
