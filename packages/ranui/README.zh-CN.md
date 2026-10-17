# ranui

框架无关的 Web Components，提供 Shadow DOM、主题 Token 和 SSR 工具。

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | **中文** | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> 预发布阶段：API 和包格式可能变化。请锁定具体版本，升级前阅读迁移指南。

## 快速开始

```sh
npm install ranui
```

包导入采用 ESM。在构建工具中按组件导入，并在应用入口导入一次公共样式。

```js
import 'ranui/button';
import 'ranui/input';
import 'ranui/style';
```

在 HTML 中使用自定义元素：

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

## IIFE / CDN

普通浏览器 script 标签可加载独立 IIFE。将 VERSION 替换为已发布版本，无需构建工具或模块加载器。

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@VERSION/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

完整 IIFE 位于 `dist/index.iife.js`。同一页面请选择完整包或单组件包，避免混用两者。

## TypeScript

每个入口都附带类型。需要可选的浏览器全局和 JSX 声明时，使用仅类型导入：

```ts
import type {} from 'ranui/typings';
```

如果 TypeScript 检查 CSS 副作用导入，请在应用的 `assets.d.ts` 中声明样式入口：

```ts
declare module 'ranui/style';
```

## SSR

以下服务端示例使用 Node 24+。组件导入会注册对应的 SSR 序列化器，结果包含声明式 Shadow DOM。

```ts
import { Button } from 'ranui/button';
import { renderToString } from 'ranui/ssr';

const html = renderToString(new Button());
console.log(html);
```

## Theme

主题模式需要主动启用。通过公共 Token 和 part 定制样式，完整规则与 API 见下方链接。

```ts
import { initTheme, setTheme } from 'ranui/theme';

initTheme();
setTheme('system');
```

## 文档

[ranui](https://ran.chaxus.com/cn/src/ranui/)

- [组件 API](./docs/COMPONENTS.md)
- [样式与 Token](./docs/style-tokens-public.md)
- [设计与交互](./docs/DESIGN.md) · [Interaction](./docs/INTERACTION.md)
- [DOM 构建器与信号](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [维护者与 Agent 参考](./CLAUDE.md)
- [迁移指南](https://ran.chaxus.com/cn/src/ranuts/migration/)

## 参与贡献

[维护者与 Agent 参考](./CLAUDE.md) · [CODING](./docs/CODING.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## 许可证

[MIT](./LICENSE)
