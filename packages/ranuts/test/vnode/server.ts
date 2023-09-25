import type { ClientRequestArgs } from 'node:http';
import http from 'node:http';
import url from 'node:url';
import colors from '@/colors';

const { blue, green } = colors;

const startDevServer = (): void => {
  const startTime = Date.now();
  const server = http.createServer((req, res) => {
    const { pathname } = url.parse(`http://${req.headers.host}${req.url}`);
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
            <script src="./vnode.ts" type="module"></script>
            <div id="app">Not Found</div>
      `);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<div id="app">Not Found</div>');
  });

  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });

  server.listen(8080, async () => {
    const { port } = server.address() as ClientRequestArgs; // { address: '::', family: 'IPv6', port: 8080 }
    console.log(
      green('🚀 No-Bundle 服务已经成功启动!'),
      `耗时: ${Date.now() - startTime}ms`,
    );
    console.log(`> 本地访问路径: ${blue(`http://localhost:${port}`)}`);
  });
};

export { startDevServer };
