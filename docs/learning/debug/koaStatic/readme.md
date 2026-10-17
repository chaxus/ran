# 静态服务

用于排查一些本地启动没有问题，但是部署到线上环境就无法运行的问题

有时候需要搭配 nginx 做反向代理域名映射，用于完整并彻底的模拟线上环境

## Koa 静态服务示例

以下保留原始 TypeScript 示例作为学习参考；它不再是可直接运行的工作区。若要复现实验，请在独立项目中安装 `koa`、`koa-static`、`koa-mount` 及所需类型，配置 TypeScript 运行环境，并按实际构建产物调整 `STATIC_DIR`。示例把模块旁的 `dist` 目录挂载到 `/weread`，监听端口 `5555`。

```ts
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
```
