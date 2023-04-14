import { Socket } from 'node:net'
import type { IncomingMessage, ServerResponse } from 'node:http'
import http from 'node:http'
import os from 'node:os'

export type Next = () => Promise<never> | Promise<void>

export type MiddlewareFunction = (
  ctx: Context,
  next: Next,
) => void | Promise<void>

export interface Context {
  [x: string]: unknown
  ipv4: () => string | undefined,
  req: IncomingMessage
  res: ServerResponse
}

function ipv4(): string | undefined {
  const interfaces = os.networkInterfaces()
  for (const name in interfaces) {
    const iface = interfaces[name]
    if (iface) {
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          return alias.address
        }
      }
    }
  }
}

class Server {
  stack: Array<MiddlewareFunction>
  ctx: Context
  constructor() {
    this.ctx = {
      ipv4,
      req: new http.IncomingMessage(new Socket()),
      res: new http.ServerResponse(new http.IncomingMessage(new Socket()))
    }
    this.stack = []
    /**
     * @description: 添加中间件
     */
  }
  use(handle: MiddlewareFunction): void {
    if (!handle) {
      throw new Error('the use function has an incorrect argument')
    }
    this.stack.push(handle)
  }
  listen(...args: any): http.Server {
    const fn = compose(this.stack)
    const server = http.createServer((req, res) => {
      this.ctx.req = req
      this.ctx.res = res
      fn(this.ctx).then().catch(onerror)
    })
    return server.listen(...args)
  }
}

function onerror(err: Error) {
  console.error(err.stack || err.toString())
}

function compose(middleware: Array<MiddlewareFunction>) {
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!')
  }
  return function (ctx: Context, next?: Next) {
    let index = -1
    function dispatch(i: number): Promise<never> | Promise<void> {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length && next) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}

export default Server
