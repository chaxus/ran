import type { Context, MiddlewareFunction, Next } from '@/server/server';
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

const handler = (ctx: Context, next: Next): void => {
    const { method, path } = ctx.request
    if (method === 'GET') {

    }
}

class Router {
    ctx?: Context;
    next?: Next;
    get(url: string, handler: Handler): void {
        if (this.ctx && this.next) {
            const { method, path } = this.ctx.request
            if (method === "GET" && path === url) {
                handler(this.ctx, this.next)
            }
        }
    }
    post(url: string, handler: Handler): void {
        if (this.ctx && this.next) {
            const { method, path } = this.ctx.request
            if (method === "POST" && path === url) {
                handler(this.ctx, this.next)
            }
        }
    }
    put(url: string, handler: Handler): void {
        if (this.ctx && this.next) {
            const { method, path } = this.ctx.request
            if (method === "PUT" && path === url) {
                handler(this.ctx, this.next)
            }
        }
    }
    del(url: string, handler: Handler): void {
        if (this.ctx && this.next) {
            const { method, path } = this.ctx.request
            if (method === "DELETE" && path === url) {
                handler(this.ctx, this.next)
            }
        }
    }
    routes(): MiddlewareFunction {
        return (ctx, next) => {
            this.ctx = ctx
            this.next = next
        }
    }
    allowedMethods(): MiddlewareFunction {
        return () => {

        }
    }
}

export default Router