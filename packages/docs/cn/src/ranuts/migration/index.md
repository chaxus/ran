# Alpha 迁移指南

本次 alpha 清理移除了没有仓库业务调用的服务端封装和过时兼容导出。升级前请迁移调用方；纯工具、stream/conversation 和 i18n 仍可在 Node 中使用。

| 移除的 API                                                                                    | 替代方式                                                                              |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `ranuts/node`: `readFile`, `writeFile`, `appendFile`, `readDir`, `queryFileInfo`, `watchFile` | `node:fs/promises`: `readFile`, `writeFile`, `appendFile`, `readdir`, `stat`, `watch` |
| `ranuts/node`: `readStream`, `writeStream`                                                    | `node:fs`: `createReadStream`, `createWriteStream`                                    |
| `Server`, `Router`, `body`, `staticMiddleware`, `connect`, `Context`                          | `node:http` / maintained HTTP framework                                               |
| `WSS`                                                                                         | WebSocket server library                                                              |
| `get`, `paresUrl`                                                                             | `fetch` + HTTP status/body checks; `new URL(url, base)`                               |
| `startTask`, `taskEnd`                                                                        | `performance.now()` (ms), `process.hrtime.bigint()` (ns)                              |
| `runCommand`, `prompt`, `colors`, `FMT`                                                       | `node:child_process`, `node:readline/promises`, `node:util.styleText`                 |
| `traverse`, `traverseSync`                                                                    | `node:fs/promises.readdir`, `node:fs.readdirSync` + recursion                         |
| `isColorSupported`                                                                            | `process.stdout.hasColors?.()`                                                        |
| `getIPAdress`                                                                                 | `node:os.networkInterfaces()`                                                         |
| `memoize`                                                                                     | `once` / `singleFlight`                                                               |
| `timeFormat`                                                                                  | `formatDuration`                                                                      |
| `timestampToTime`                                                                             | `formatDate` / `new Date(timestamp)`                                                  |
| `isClient`                                                                                    | `typeof window !== 'undefined'`                                                       |
| `md5`                                                                                         | `node:crypto.createHash('md5')` / dedicated MD5 library                               |

文件 API 现在直接返回原生值，失败时抛出 Error，不再返回 success 包装对象。读取文本时显式指定编码。

```ts
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text, 'utf8');
```

Server、Router、中间件和 connect 请迁移到维护中的 HTTP 框架或 node:http。WebSocket 服务端需要真正的服务端实现，平台提供的 WebSocket 客户端不能替代它。

formatDate 返回格式化文本；需要 Date 对象时使用 new Date(timestamp)。once 缓存第一次结果，不会按参数分别缓存。

必须兼容 MD5 时使用专门的实现（Node 中使用 node:crypto）。SHA-256 的摘要不同，不能直接替换已有摘要；二者都不是密码存储算法。

脚本加载现在按完整 type 和内容去重，不再计算哈希或归一化换行。

## 移除的实验性工作区

独立的 `visual` 和 `ranite` 包已移除。二维渲染统一使用维护中的 `ranuts/visual`，开发服务使用已有的 Vite 脚本。

`visual` 调用方需要适配当前公开 API：使用 `await Application.create(options)` 初始化，将 `Graphics` / `Container` 节点加入 `app.stage`，再调用 `app.render()` 或 `app.start()`。旧 `Bar`、`Line`、`Pie` 和未完成的 `Sankey` 在 ranuts 中没有替代接口。旧几何和事件内部类也不属于公开导出，不能只修改导入名称。

## 仅发布 ESM 模块

ranuts、ranui 和 @alixex/ranview 现在仅发布 ESM 模块。将 require() 和转换为 CommonJS 的导入改为原生 ESM 导入。旧加载器和测试工具需要启用 ESM 或使用动态 import()；不再提供 CommonJS 兼容构建和 .d.cts 声明。浏览器普通 script 标签仍可使用独立 IIFE。

```ts
import { rgbToHex } from 'ranuts';
import { h } from 'ranui/ssr';
```

- `ranuts/dist/umd/index.umd.cjs` → `ranuts/dist/iife/index.iife.js` (`ranuts`)
- `ranuts/dist/umd/utils/utils.umd.cjs` → `ranuts/dist/iife/utils.iife.js` (`ranuts_utils`)
- `ranui/dist/umd/index.umd.cjs` → `ranui/dist/index.iife.js` (`ranui`)
- `ranui/dist/iife/<name>.iife.js` → `ranui/dist/iife/<name>.iife.js`
