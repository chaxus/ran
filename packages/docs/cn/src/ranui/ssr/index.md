---
description: '用 ranui/ssr-stream 把 ranui 组件服务端渲染成声明式 Shadow DOM——JavaScript 尚未执行时首屏就是对的。'
---

# 服务端渲染

ranui 组件会序列化成**声明式 Shadow DOM**，因此服务端可以直接吐出真实标记，在任何 JavaScript 执行
之前首屏就是正确的。

> **适用场景**：在服务端或构建期渲染页面时——SSG、Express / Hono / Workers 路由、邮件预览任务——希望
> `<r-*>` 元素以可见标记的形式到达，而不是等待 hydration 的空标签。

## 快速开始

```js
import 'ranui'; // 先做这一步：填充 SSR 注册表
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

每一个已注册的 `<r-*>` 标签都会被实例化、应用属性、递归渲染子节点，并以内含
`<template shadowrootmode="closed">` 的形式输出。未知标签原样透传，因此对整页普通 HTML 运行也是安全的。

### 流式

`renderToStream` 是同一个渲染器的异步生成器版本，静态片段可以先发给客户端，后面的组件继续渲染：

```js
import { renderToStream } from 'ranui/ssr-stream';

for await (const chunk of renderToStream(pageHtml)) response.write(chunk);
```

### 单个组件

`ranui/ssr` 渲染你自己构造的实例——当你是在 Node 里拼装一棵树而不是套模板字符串时很有用：

```js
import { renderToString } from 'ranui/ssr';
import { Button } from 'ranui';

const html = renderToString(new Button());
```

## API 参考

| 导出                       | 入口               | 签名                                       | 说明                                           |
| -------------------------- | ------------------ | ------------------------------------------ | ---------------------------------------------- |
| `renderHTMLToString(html)` | `ranui/ssr-stream` | `(html: string) => Promise<string>`        | 展开 HTML 字符串里所有已注册的 `<r-*>`。       |
| `renderToStream(html)`     | `ranui/ssr-stream` | `(html: string) => AsyncGenerator<string>` | 同上，按块产出。                               |
| `renderToString(el)`       | `ranui/ssr`        | `(component) => string`                    | 序列化单个组件实例。                           |
| `RanElement`               | `ranui/ssr`        | 类                                         | 浏览器里是 `HTMLElement`，Node 里是 SSR mock。 |
| `h(tag, props, …children)` | `ranui/ssr`        | `(tag, props?, ...children) => string`     | 手工拼装标记的小工具。                         |

## 服务端能做什么、不能做什么

**客户端是重建，不是复用。** ranui 挂载的是 **closed** shadow root，而对已经带有声明式 shadow root
的元素调用 `attachShadow`，在 closed 模式下**会清空那个 root 的子节点**。因此服务端渲染的树只负责画出
第一帧，随后被一棵一模一样的客户端树替换。两个结论：

- 你得到的是正确的首屏，而不是 hydration 复用。这是选择 closed root 所付的代价——见
  [编码规范](/cn/src/ranui/coding-guides/#服务端渲染)。
- **不要把状态写进服务端渲染的 shadow 标记里**指望客户端读回来。用属性传，属性会留下。

**服务端不存在任何测量值。** 依赖 `getBoundingClientRect` / `offsetWidth` 的一切都在挂载后、在浏览器
里才解析。组件的初始布局之所以交给 CSS，正是为了这一点。

**目前有四个元素不能服务端渲染**，都是因为构造时就伸手去拿浏览器 API：`<r-content>`
（`MutationObserver`）、`<r-link>`（`document`）、`<r-modal>`（SSR mock 未实现的 slot 方法）、
`<r-radar>`（`ResizeObserver`）。它们会作为普通标签透传，在客户端升级。其余每个元素都有测试守着，一旦
不能渲染就失败，因此这份名单不会悄悄变长。

## 主题与闪烁

`initTheme()` 在服务端是空操作（所有 `document` / `localStorage` / `matchMedia` 访问都有守卫），主题由
客户端应用。要避免主题闪烁，请在服务端模板里直接给 `<html>` 写上 `data-ran-theme`——从 cookie 取，或者
用一小段在首屏绘制前读 `localStorage` 的内联脚本——之后交给 [`initTheme`](/cn/src/ranui/theme/) 接管。

## 最佳实践

- **渲染前先引入 `ranui`（或具体的 `ranui/<component>` 入口）。** 注册表靠引入的副作用填充；不引入的话
  每个标签都会原样透传，页面就静默丢失了这些标记。
- **对整页跑，而不是只对片段跑。** `renderHTMLToString` 对任意 HTML 都安全，不必把 ranui 的部分单独摘出来。
- **别忘了样式表。** DSD 标记自带组件样式，但页面级令牌来自 `ranui/style`（字体来自 `ranui/fonts`）。
