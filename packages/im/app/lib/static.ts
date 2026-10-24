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
    /** Serve the file and report true, or report false to hand the request downstream. */
    const serveFile = async (): Promise<boolean> => {
      const pathname = decodeURIComponent((req.url ?? '/').split('?')[0]);
      if (!pathname.startsWith('/') || pathname.includes('\0') || pathname.includes('\\')) return false;
      const root = await realpath(dir);
      const boundary = root.endsWith(sep) ? root : `${root}${sep}`;
      const candidate = resolve(root, `.${pathname}`);
      if (!candidate.startsWith(boundary)) return false;
      const file = await realpath(candidate);
      if (!file.startsWith(boundary) || !(await stat(file)).isFile()) return false;
      const body = req.method === 'HEAD' ? undefined : await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' });
      res.end(body);
      return true;
    };
    void (async () => {
      // A missing or unreadable file is a miss, not an error.
      if (await serveFile().catch(() => false)) return;
      // Handed downstream exactly once. A throw there is the next handler's failure: report
      // it rather than passing the request along a second time or rejecting unobserved.
      try {
        next();
      } catch (error) {
        console.error('static: the next handler failed', error);
        if (!res.headersSent) res.writeHead(500);
        if (!res.writableEnded) res.end();
      }
    })();
  };
