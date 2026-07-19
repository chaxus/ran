---
description: 'ranuts is a tree-shakeable JavaScript/TypeScript utility library: DOM/BOM, string/object/number/color helpers, algorithms, a 2D rendering engine and a virtual DOM.'
---

# ranuts overview

## Category Navigation

- [Utility Functions](./utils/index.md) - Functional programming, string processing, object processing, number processing, etc.
- [File Operations](./file/write_file.md) - File read/write, watch operations
- [Node Server](./node/index.md) - Mini HTTP framework: server, router, WebSocket, middleware (node-only)
- [2D Rendering (visual)](./visual/index.md) - Canvas / WebGL / WebGPU 2D rendering engine (browser-only)
- [Virtual DOM (vnode)](./vnode/index.md) - Snabbdom-style lightweight virtual DOM
- [Bridge (postMessage)](./bridge/index.md) - Cross-context messaging over postMessage (window / iframe / worker)
- [Event System](./utils/sync_hook.md) - Publish-subscribe pattern (`SyncHook`)
- [MIME Type](./mime_type/mime_type.md) - MIME type processing
- [Others](./binary_tree/index.md) - Binary tree, bundler, etc.

## Method list

| Method        | description                                                            | detail                               |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| writeFile     | Write to file                                                          | [writeFile](./file/write_file.md)    |
| readFile      | Read file                                                              | [readFile](./file/read_file.md)      |
| readDir       | Read the directory and get the names of all the files in the directory | [readDir](./file/read_dir.md)        |
| watchFile     | Check whether the contents of the file have changed                    | [watchFile](./file/watch_file.md)    |
| queryFileInfo | Query file information                                                 | [queryFileInfo](./file/file_info.md) |
| filterObj     | Filter object                                                          | [filterObj](./utils/filter_obj.md)   |
| SyncHook      | Publish-subscribe class                                                | [SyncHook](./utils/sync_hook.md)     |
| getMime       | Gets the `mime type` based on the file format suffix                   | [getMime](./mime_type/mime_type.md)  |
| getCookie     | Gets the value of the specified cookie                                 | [getCookie](./utils/get_cookie.md)   |

> 💡 **Tip**: For more utility functions, see [Utility Functions Category Index](./utils/index.md)
