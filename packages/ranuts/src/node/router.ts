import type { Context, MiddlewareFunction, Next } from '@/node/server';
/**
 * @description:
 *
 * Basic usage:
 *
 * ```javascript
 * import Server from '@/server/server'
 * import Router from '@/server/router'
 *
 * const app = new Server();
 * const router = new Router();
 *
 * router.get('/', (ctx, next) => {
 *   // ctx.router available
 * });
 *
 * app
 *   .use(router.routes())
 *   .use(router.allowedMethods());
 * ```
 * @return {*}
 */

type Handler = (ctx: Context, next: Next) => void;

class Router {
  ctx?: Context;
  map: Map<string, Map<string, Handler>>;
  methods: Set<string>;
  paths: Set<string>;
  constructor() {
    this.map = new Map();
    this.methods = new Set();
    this.paths = new Set();
  }
  get(url: string, handler: Handler): void {
    this.addHandlerToMap('GET')(url, handler);
  }
  post(url: string, handler: Handler): void {
    this.addHandlerToMap('POST')(url, handler);
  }
  put(url: string, handler: Handler): void {
    this.addHandlerToMap('PUT')(url, handler);
  }
  patch(url: string, handler: Handler): void {
    this.addHandlerToMap('PATCH')(url, handler);
  }
  del(url: string, handler: Handler): void {
    this.addHandlerToMap('DELETE')(url, handler);
  }
  head(url: string, handler: Handler): void {
    this.addHandlerToMap('HEAD')(url, handler);
  }
  options(url: string, handler: Handler): void {
    this.addHandlerToMap('OPTIONS')(url, handler);
  }
  private addHandlerToMap(method: string) {
    this.methods.add(method);
    return (url: string, handler: Handler): void => {
      this.paths.add(url);
      let path = this.map.get(method);
      if (!path) {
        path = new Map();
        this.map.set(method, path);
      }
      path.set(url, handler);
    };
  }
  routes(): MiddlewareFunction {
    return (ctx, next) => {
      this.ctx = ctx;
      const { path, method } = ctx.request;
      const pathMap = this.map.get(method);
      const handler = pathMap ? pathMap.get(path) : next;
      handler && handler(ctx, next);
    };
  }
  allowedMethods(): MiddlewareFunction {
    return (ctx) => {
      const { res } = ctx;
      const { path, method } = ctx.request;
      // 地址存在，但方法不存在
      if (!this.methods.has(method) && this.paths.has(path)) {
        res.statusCode = 405;
        res.end('405, method is not allowed');
      }
      // 地址不存在，但方法存在
      if (this.methods.has(method) && !this.paths.has(path)) {
        res.statusCode = 404;
        res.end('404, the request address does not exist');
      }
      // 方法和地址都不存在
      if (!this.methods.has(method) && !this.paths.has(path)) {
        res.statusCode = 501;
        res.end('501, not support the functionality needed to satisfy the request');
      }
    };
  }
}

export default Router;
