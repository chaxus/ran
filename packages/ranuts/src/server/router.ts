import type { Context, MiddlewareFunction, Next } from '@/server/server'
/**
 * @description:
 *
 * Basic usage:
 *
 * ```javascript
 * const Koa = require('koa');
 * const Router = require('@koa/router');
 *
 * const app = new Koa();
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

const noop = () => {}

class Router {
  ctx?: Context
  map: Map<string, Map<string, Handler>>
  constructor() {
    this.map = new Map()
  }
  get(url: string, handler: Handler): void {
    let path = this.map.get('GET')
    if (!path) {
      path = new Map()
      this.map.set('GET', path)
    }
    path.set(url, handler)
  }
  post(url: string, handler: Handler): void {
    let path = this.map.get('POST')
    if (!path) {
      path = new Map()
      this.map.set('POST', path)
    }
    path.set(url, handler)
  }
  put(url: string, handler: Handler): void {
    let path = this.map.get('PUT')
    if (!path) {
      path = new Map()
      this.map.set('PUT', path)
    }
    path.set(url, handler)
  }
  patch(url: string, handler: Handler): void {
    let path = this.map.get('PATCH')
    if (!path) {
      path = new Map()
      this.map.set('PATCH', path)
    }
    path.set(url, handler)
  }
  del(url: string, handler: Handler): void {
    let path = this.map.get('DELETE')
    if (!path) {
      path = new Map()
      this.map.set('DELETE', path)
    }
    path.set(url, handler)
  }
  head(url: string, handler: Handler): void {
    let path = this.map.get('HEAD')
    if (!path) {
      path = new Map()
      this.map.set('HEAD', path)
    }
    path.set(url, handler)
  }
  options(url: string, handler: Handler): void {
    let path = this.map.get('OPTIONS')
    if (!path) {
      path = new Map()
      this.map.set('OPTIONS', path)
    }
    path.set(url, handler)
  }
  routes(): MiddlewareFunction {
    return (ctx, next) => {
      const { path, method } = ctx.request
      const pathMap = this.map.get(method)
      const handler = pathMap ? pathMap.get(path) : next
      handler && handler(ctx, next)
    }
  }
  allowedMethods(): MiddlewareFunction {
    return () => {}
  }
}

export default Router
