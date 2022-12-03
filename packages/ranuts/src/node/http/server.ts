
import http, { IncomingMessage, ServerResponse } from 'node:http';

type Next = () => Promise<never> | Promise<void>;

type MiddlewareFunction = (req: IncomingMessage, res: ServerResponse, next?: Next) => void

class Server {
  stack: Array<MiddlewareFunction>;
  constructor() {
    this.stack = [];
    /**
     * @description: 添加中间件
     */
  }
  use(handle: MiddlewareFunction) {
    if (!handle) {
      throw new Error('the use function has an incorrect argument');
    }
    this.stack.push(handle);
  }
  listen(...args: any) {
    const fn = compose(this.stack);
    const server = http.createServer((req, res) => {
      fn(req, res).then().catch(onerror)
    });
    return server.listen(...args);
  }
}

function onerror(err: Error) {
  console.error(err.stack || err.toString());
}

function compose(middleware: Array<MiddlewareFunction>) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (req: IncomingMessage, res: ServerResponse, next?: Next) {
    let index = -1
    return dispatch(0)
    function dispatch(i: number): Promise<never> | Promise<void> {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length && next) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(req, res, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

export default Server