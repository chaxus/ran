import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();

const PORT = 5555;

const STATIC_DIR = 'dist';

// 设置正确的 MIME 类型
app.use(async (ctx, next) => {
  if (ctx.path.endsWith('.js')) {
    ctx.type = 'application/javascript';
  } else if (ctx.path.endsWith('.mjs')) {
    ctx.type = 'application/javascript';
  } else if (ctx.path.endsWith('.json')) {
    ctx.type = 'application/json';
  } else if (ctx.path.endsWith('.css')) {
    ctx.type = 'text/css';
  }
  await next();
});

app.use(async (ctx, next) => {
  ctx.set('Cross-Origin-Opener-Policy', 'same-origin');
  ctx.set('Cross-Origin-Embedder-Policy', 'require-corp');
  await next();
});

// Serve static files from the 'dist' directory with /weread prefix
app.use(mount('/weread', serve(path.join(__dirname, STATIC_DIR))));

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
