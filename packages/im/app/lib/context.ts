import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Context, Controller, RequestBody } from '@/app/types/index';
import { TYPE_FUNCTION, TYPE_OPJECT } from '@/app/lib/constant';
import { handlerQueryParams } from '@/app/lib/request';

// 在 ctx 上挂载 controller
export const createController = async (dir: string): Promise<Controller> => {
  const controller: Controller = {};
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    if (file.length > 0 && file.startsWith('.')) continue;
    const { default: route } = await import(`${dir}/${file}`);
    const type = Reflect.toString.call(route);
    const [key, _] = file.split('.');
    if (type === TYPE_OPJECT) controller[key] = route;
    if (type === TYPE_FUNCTION) controller[key] = new route();
  }
  return controller;
};
// 处理请求的 body 数据
export const createRequestBody = (ctx: Context): Promise<RequestBody> => {
  const { req } = ctx || {};
  // const { headers } = req || {}
  // const contentType = headers['content-type'] || ''
  // if (!contentType.includes('application/json')) return Promise.resolve({});
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    // 监听 end 事件，当数据接收完毕时触发
    req.on('end', () => {
      // 解析 JSON 数据（如果请求体是 JSON 格式）
      if (!body) return resolve({});
      try {
        const parsedBody = JSON.parse(body);
        ctx.request.body = parsedBody;
        console.log('parsedBody:', parsedBody);
        resolve(parsedBody);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        resolve({});
      }
    });
  });
};
// 初始化 ctx
export const createContext = (req: IncomingMessage, res: ServerResponse, controller: Controller): Promise<Context> => {
  const { url = '' } = req;
  const [path] = url.split('?');
  // 根据 url 处理请求的 params 和 query
  const { params, query } = handlerQueryParams(req);
  const request = {
    path,
    url,
    query,
    body: {},
    params,
  };
  const response = {
    setHeader: (name: string, value: string | number | readonly string[]): ServerResponse<IncomingMessage> => {
      return res.setHeader(name, value);
    },
    write: (chunk: any, callback?: (error: Error | null | undefined) => void): boolean => {
      return res.write(chunk, callback);
    },
    type: '',
  };
  // 初始化 ctx
  const ctx: Context = {
    req,
    res,
    controller,
    request,
    response,
  };
  return new Promise((resolve) => {
    // 处理请求的 body 数据
    createRequestBody(ctx).then((body) => {
      ctx.request.body = body;
      resolve(ctx);
    });
  });
};
