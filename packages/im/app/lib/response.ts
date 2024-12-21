import type { Context } from '@/app/types/index';
// 没有匹配到的响应
export const notMatchResponse = (ctx: Context): void => {
  const { res } = ctx;
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found\n');
};
