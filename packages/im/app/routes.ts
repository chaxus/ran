import path, { resolve } from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { noop } from 'ranuts';
import routes from '@/app/router.config';
import type { Context, Controller } from '@/app/types/index';

const regex = /#\/(.*?)\/#/;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const dir = resolve(__dirname, 'controllers');

export const readController = async (): Promise<Controller> => {
  const controller: Controller = {};
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    if (file.length > 0 && file.startsWith('.')) continue;
    const { default: route } = await import(`${dir}/${file}`);
    const type = Reflect.toString.call(route);
    const [key, _] = file.split('.');
    if (type === '[object Object]') controller[key] = route;
    if (type === '[object Function]') controller[key] = new route();
  }
  return controller;
};

export const routing = async (ctx: Context): Promise<void> => {
  const { req, controller } = ctx;
  for (const [key, value] of Object.entries(routes)) {
    const [method, path] = key.split('=>');
    // 验证路由是否合法
    const [_, url] = new RegExp(regex).exec(path) || [];
    if (req.method === method.toUpperCase() && req.url && new RegExp(url).test(req.url)) {
      const [name, func] = value.split('#');
      const handler = controller[name][func] || noop;
      handler(ctx);
      return;
    }
  }
};
