import type { Context, MiddlewareFunction, Next } from '@/server/server'
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

type Handler = (ctx: Context, next: Next) => void

class Router {
  ctx?: Context
  map: Map<string, Map<string, Handler>>
  constructor() {
    this.map = new Map()
  }
  get(url: string, handler: Handler): void {
    this.addHandlerToMap('GET')(url, handler)
  }
  post(url: string, handler: Handler): void {
    this.addHandlerToMap('POST')(url, handler)
  }
  put(url: string, handler: Handler): void {
    this.addHandlerToMap('PUT')(url, handler)
  }
  patch(url: string, handler: Handler): void {
    this.addHandlerToMap('PATCH')(url, handler)
  }
  del(url: string, handler: Handler): void {
    this.addHandlerToMap('DELETE')(url, handler)
  }
  head(url: string, handler: Handler): void {
    this.addHandlerToMap('HEAD')(url, handler)
  }
  options(url: string, handler: Handler): void {
    this.addHandlerToMap('OPTIONS')(url, handler)
  }
  private addHandlerToMap(method: string) {
    return (url: string, handler: Handler): void => {
      let path = this.map.get(method)
      if (!path) {
        path = new Map()
        this.map.set(method, path)
      }
      path.set(url, handler)
    }
  }
  routes(): MiddlewareFunction {
    return (ctx, next) => {
      this.ctx = ctx
      const { path, method } = ctx.request
      const pathMap = this.map.get(method)
      const handler = pathMap ? pathMap.get(path) : next
      handler && handler(ctx, next)
    }
  }
  allowedMethods(): MiddlewareFunction {
    return (ctx, next) => {}
  }
}

export default Router
