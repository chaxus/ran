import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Koa from 'koa';
import serve from 'koa-static';
import send from 'koa-send';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();

const PORT = 5555;

const STATIC_DIR = 'dist';

app.use(async (ctx, next) => {
  ctx.set('Cross-Origin-Opener-Policy', 'same-origin');
  ctx.set('Cross-Origin-Embedder-Policy', 'require-corp');
  await next();
});

// 处理 HTML 文件路由
app.use(async (ctx, next) => {
  // 如果不是 API 请求
  if (!ctx.path.startsWith('/api')) {
    // 如果请求的是根路径，返回 index.html
    if (ctx.path === '/') {
      await send(ctx, 'index.html', { root: STATIC_DIR });
      return;
    }

    // 如果请求的是 book-detail 路径，返回 book-detail.html
    // if (ctx.path.startsWith('/book-detail')) {
    //   await send(ctx, '/book-detail.html', { root: STATIC_DIR });
    //   return;
    // }

    // 如果请求的是其他 HTML 文件，直接返回
    if (ctx.path.endsWith('.html')) {
      await next();
      return;
    }
  }

  await next();
});

// Serve static files from the 'dist' directory
app.use(serve(path.join(__dirname, STATIC_DIR)));

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
