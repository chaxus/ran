import { noop } from 'ranuts';
import routes from '@/app/router.config';
import type { Context } from '@/app/types/index';
// import { notMatchResponse } from '@/app/lib/response';

const regex = /#\/(.*?)\/#/;

// 根据 url 处理请求的 params 和 query

export const routing = (ctx: Context): void => {
  const { req, controller } = ctx;
  for (const [key, value] of Object.entries(routes)) {
    const [method, path] = key.split('=>');
    // 验证路由是否合法
    const [_, url] = new RegExp(regex).exec(path) || [];
    // 路由匹配 controller
    if (req.method === method.toUpperCase() && req.url && new RegExp(url).test(req.url)) {
      const [name, func] = value.split('#');
      const handler = controller[name][func] || noop;
      handler(ctx);
      return;
    } else {
      // 处理匹配不上的情况
      // notMatchResponse(ctx);
    }
  }
};
