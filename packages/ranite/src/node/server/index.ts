import connect from 'connect';
import { blue, green } from 'picocolors';
import type { FSWatcher } from 'chokidar';
import chokidar from 'chokidar';
import { optimize } from '../optimizer/index';
import { ModuleGraph } from '../ModuleGraph';
import type { PluginContainer } from '../pluginContainer';
import { createPluginContainer } from '../pluginContainer';
import { resolvePlugins } from '../plugins';
import { createWebSocketServer } from '../ws';
import { bindingHMREvents } from '../hmr';
import type { Plugin } from '../plugin';
import { staticMiddleware } from './middlewares/static';
import { indexHtmlMiddleware } from './middlewares/indexHtml';
import { transformMiddleware } from './middlewares/transform';

export interface ServerContext {
  root: string;
  pluginContainer: PluginContainer;
  app: connect.Server;
  plugins: Plugin[];
  moduleGraph: ModuleGraph;
  ws: { send: (data: any) => void; close: () => void };
  watcher: FSWatcher;
}

export async function startDevServer(): Promise<void> {
  const app = connect();
  const root = process.cwd();
  const startTime = Date.now();
  // 加载所有的插件
  const plugins = resolvePlugins();
  // 通过加载所有的插件，创建插件容器
  const pluginContainer = createPluginContainer(plugins);
  // 加载模块的依赖图
  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url));
  const watcher = chokidar.watch(root, {
    ignored: ['**/node_modules/**', '**/.git/**'],
    ignoreInitial: true,
  });
  // WebSocket 对象
  const ws = createWebSocketServer();
  // // 开发服务器上下文
  const serverContext: ServerContext = {
    root: process.cwd(),
    app,
    pluginContainer,
    plugins,
    moduleGraph,
    ws,
    watcher,
  };
  bindingHMREvents(serverContext);
  for (const plugin of plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(serverContext);
    }
  }

  // // 核心编译逻辑
  app.use(transformMiddleware(serverContext));

  // 入口 HTML 资源
  app.use(indexHtmlMiddleware(serverContext));

  // 静态资源
  app.use(staticMiddleware());

  app.listen(3000, async () => {
    await optimize(root);
    console.log(green('🚀 No-Bundle 服务已经成功启动!'), `耗时: ${Date.now() - startTime}ms`);
    console.log(`> 本地访问路径: ${blue('http://localhost:3000')}`);
  });
}
