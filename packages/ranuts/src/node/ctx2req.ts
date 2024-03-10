import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Context, MiddlewareFunction, Next } from '@/node/server';

type ConnectMiddleware = (req: IncomingMessage, res: ServerResponse, next?: Function) => void;

const noop = () => {};

const PARAM_LENGTH = 3;

function noCallbackHandler(ctx: Context, connectMiddleware: ConnectMiddleware, next: Next): Promise<void> {
  connectMiddleware(ctx.req, ctx.res, noop);
  return next();
}

function withCallbackHandler(ctx: Context, connectMiddleware: ConnectMiddleware, next: Next): Promise<void> {
  return new Promise((resolve, reject) => {
    connectMiddleware(ctx.req, ctx.res, (err: Error) => {
      err ? reject(err) : resolve(next());
    });
  });
}

function connect(connectMiddleware: ConnectMiddleware): MiddlewareFunction {
  const handler = connectMiddleware.length < PARAM_LENGTH ? noCallbackHandler : withCallbackHandler;
  return function connect(ctx: Context, next: Next) {
    return handler(ctx, connectMiddleware, next);
  };
}

export default connect;
