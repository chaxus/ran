# ranuts

覆盖浏览器 API、数据处理、流和二维渲染的 TypeScript 工具。

[![npm](https://img.shields.io/npm/v/ranuts.svg)](https://www.npmjs.com/package/ranuts) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | **中文** | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Alpha 阶段：API 和包格式可能变化。请锁定具体版本，升级前阅读迁移指南。

## 快速开始

```sh
npm install ranuts
```

```ts
import { rgbToHex } from 'ranuts/utils';

console.log(rgbToHex(1, 2, 3)); // #010203
```

## ESM

按运行环境和用途选择入口。部分工具依赖浏览器全局对象；可以导入包不代表所有工具都能在服务端运行。

| 包                    | 用途                                    |
| --------------------- | --------------------------------------- |
| `ranuts/utils`        | DOM/BOM、颜色、二进制、存储等工具       |
| `ranuts/i18n`         | 独立国际化引擎                          |
| `ranuts/stream`       | SSE 解析与流式响应状态                  |
| `ranuts/conversation` | 会话事件日志投影                        |
| `ranuts/visual`       | 二维渲染；浏览器                        |
| `ranuts/vnode`        | 虚拟 DOM；浏览器                        |
| `ranuts/sw`           | Service Worker 缓存策略；Service Worker |

## IIFE / CDN

普通浏览器 script 标签可加载独立 IIFE。将 VERSION 替换为已发布版本，无需构建工具或模块加载器。

```html
<script src="https://cdn.jsdelivr.net/npm/ranuts@VERSION/dist/iife/utils.iife.js"></script>
<script>
  console.log(ranuts_utils.rgbToHex(1, 2, 3));
</script>
```

工具 IIFE 暴露 `ranuts_utils`；完整 `dist/iife/index.iife.js` 暴露 `ranuts`。请将 VERSION 替换为已发布版本。

## 文档

- [ranuts](https://ran.chaxus.com/cn/src/ranuts/)
- [API](./docs/API.md)
- [维护者与 Agent 参考](./CLAUDE.md)
- [迁移指南](https://ran.chaxus.com/cn/src/ranuts/migration/)

## 参与贡献

[维护者与 Agent 参考](./CLAUDE.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## 许可证

[MIT](./LICENSE)
