import { createServer, request } from 'node:http';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { createStaticServer } from '@/app/lib/static';
import type { Context } from '@/app/types/index';

it('serves query-string assets and refuses traversal and escaping symlinks', async () => {
  const root = mkdtempSync(join(tmpdir(), 'ran-static-'));
  const publicDir = join(root, 'public');
  mkdirSync(publicDir);
  writeFileSync(join(publicDir, 'asset.txt'), 'asset');
  writeFileSync(join(root, 'private.txt'), 'private');
  symlinkSync(join(root, 'private.txt'), join(publicDir, 'escape.txt'));
  const serve = createStaticServer(publicDir);
  const server = createServer((req, res) =>
    serve({ req, res } as Context, () => {
      res.writeHead(404);
      res.end('missing');
    }),
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected TCP address');
  const get = (path: string) =>
    new Promise<{ status: number; body: string }>((resolve, reject) => {
      request({ hostname: '127.0.0.1', port: address.port, path }, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => resolve({ status: res.statusCode!, body }));
      })
        .on('error', reject)
        .end();
    });
  try {
    for (const path of ['/../private.txt', '/%2e%2e/private.txt', '/escape.txt', '/%ZZ']) {
      expect(await get(path)).toEqual({ status: 404, body: 'missing' });
    }
    expect(await get('/asset.txt?version=1')).toEqual({ status: 200, body: 'asset' });
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    rmSync(root, { recursive: true, force: true });
  }
});
