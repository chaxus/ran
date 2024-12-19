import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { readController, routing } from '@/app/routes';
import type { Context } from '@/app/types/index';

readController().then((controller) => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const ctx: Context = {
      req,
      res,
      controller,
      path: req.url || '',
    };
    routing(ctx);
    // if (req.url === '/home') {
    //   res.writeHead(200, { 'Content-Type': 'application/json' });
    //   res.end(JSON.stringify({ message: 'Hello, JSON!' }));
    // } else {
    //   res.writeHead(404, { 'Content-Type': 'text/plain' });
    //   res.end('404 Not Found\n');
    // }
  });

  const PORT = 3000;

  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
  });
});
