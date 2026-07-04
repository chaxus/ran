# ranuts overview

## 分类导航

- [工具函数](./utils/index.md) - 函数式编程、字符串处理、对象处理、数字处理等
- [文件操作](./file/write_file.md) - 文件读写、监听等操作
- [Node 服务](./node/index.md) - 迷你 HTTP 框架：服务器、路由、WebSocket、中间件（仅 Node）
- [2D 渲染引擎 (visual)](./visual/index.md) - Canvas / WebGL / WebGPU 2D 渲染引擎（仅浏览器）
- [虚拟 DOM (vnode)](./vnode/index.md) - Snabbdom 风格的轻量虚拟 DOM
- [Bridge 跨上下文通信](./bridge/index.md) - 基于 postMessage 的跨上下文通信（window / iframe / worker）
- [事件系统](./utils/sync_hook.md) - 发布订阅模式（`SyncHook`）
- [MIME 类型](./mime_type/mime_type.md) - MIME 类型处理
- [其他](./binary_tree/index.md) - 二叉树、打包器等

## 方法列表

| 方法          | 说明                               | 详细内容                             |
| ------------- | ---------------------------------- | ------------------------------------ |
| writeFile     | 写入文件                           | [writeFile](./file/write_file.md)    |
| readFile      | 读取文件                           | [readFile](./file/read_file.md)      |
| readDir       | 读取目录，获取目录下所有文件的名字 | [readDir](./file/read_dir.md)        |
| watchFile     | 观察文件的内容是否发生变化         | [watchFile](./file/watch_file.md)    |
| queryFileInfo | 查询文件信息                       | [queryFileInfo](./file/file_info.md) |
| filterObj     | 过滤对象                           | [filterObj](./utils/filter_obj.md)   |
| SyncHook      | 发布订阅类                         | [SyncHook](./utils/sync_hook.md)     |
| getMime       | 根据文件格式后缀获取 mime type     | [getMime](./mime_type/mime_type.md)  |
| getCookie     | 获取指定 cookie 的值               | [getCookie](./utils/get_cookie.md)   |

> 💡 **提示**: 更多工具函数请查看 [工具函数分类索引](./utils/index.md)
