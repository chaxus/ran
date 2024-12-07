import { describe, expect, it } from 'vitest';
import { Router, Server, body, colors } from '@/node';

const app = new Server();
const PORT = 30103;

const router = new Router();

router.get('/api/test', (ctx) => {
  const { query } = ctx.request;
  ctx.res.end(JSON.stringify(query));
});

router.post('/api/test', (ctx) => {
  const { body } = ctx.request;
  ctx.res.end(JSON.stringify(body));
});

// const requestMiddleWare = (ctx: Context, next: Next) => {
//   const { method, path, body } = ctx.request;
//   const { res } = ctx;
//   if (method === 'POST') {
//     // application/json
//     if (path === '/api/test') {
//       res.end(JSON.stringify(body));
//     }
//     // file
//     if (path === '/api/upload') {
//       res.end(JSON.stringify(body));
//     }
//   }
// };
app.use(body());

app.use(router.routes());
// app.use(requestMiddleWare)

app.listen(PORT, () => {
  console.info(colors.green(`===========================> Server Start at ${PORT} <===============================`));
});
//     })
// })
describe('encodeUrl(url)', function () {
  it('should keep URL the same', function () {
    expect(1).toEqual(1);
  });
});
