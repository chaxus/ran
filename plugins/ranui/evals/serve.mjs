import { createRequire } from 'node:module';
import { readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
export async function serve(dir, port = 0) {
  dir = realpathSync(dir);
  const { repo } = JSON.parse(readFileSync(path.join(dir, 'run.json')));
  const require = createRequire(path.join(repo, 'packages/ranui/package.json'));
  const { createServer } = await import(pathToFileURL(require.resolve('vite')).href);
  const packageDir = path.join(repo, 'packages/ranui');
  const server = await createServer({
    configFile: false,
    root: dir,
    logLevel: 'error',
    server: { port, host: '127.0.0.1', fs: { allow: [dir, repo] } },
    resolve: {
      alias: {
        'ranui/button': path.join(packageDir, 'components/button/index.ts'),
        'ranui/style': path.join(packageDir, 'style.ts'),
        'ranui/fonts': path.join(packageDir, 'fonts/fonts.css'),
        '@': packageDir,
      },
    },
    css: {
      preprocessorMaxWorkers: 0,
      preprocessorOptions: {
        less: { javascriptEnabled: true, additionalData: `@import "${path.join(packageDir, 'base.less')}";` },
      },
    },
    plugins: [
      {
        name: 'eval-index',
        configureServer(s) {
          s.middlewares.use((req, res, next) => {
            if (req.url === '/' || req.url?.startsWith('/?')) req.url = '/surface/index.html';
            next();
          });
        },
      },
    ],
  });
  await server.listen();
  return { server, url: `http://127.0.0.1:${server.httpServer.address().port}` };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await serve(path.resolve(process.argv[2]), Number(process.argv[3] || 0));
  console.log(url);
}
