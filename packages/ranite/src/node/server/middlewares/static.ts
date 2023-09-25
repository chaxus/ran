import type { NextHandleFunction } from 'connect';
import sirv from 'sirv';
import { CLIENT_PUBLIC_PATH } from '../../constants';
import { isImportRequest } from '../../utils';

export function staticMiddleware(): NextHandleFunction {
  const serveFromRoot = sirv('/', { dev: true });
  return async (req, res, next) => {
    if (!req.url) {
      return;
    }
    if (isImportRequest(req.url) || req.url === CLIENT_PUBLIC_PATH) {
      return;
    }
    serveFromRoot(req, res, next);
  };
}
