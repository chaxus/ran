---
description: '用 ranui/ssr-stream 在服务端把 ranui 组件渲染成声明式 Shadow DOM，JavaScript 还没执行时首屏就已经是正确的。'
---

# 服务端渲染

ranui 组件可以序列化成**声明式 Shadow DOM**，服务端因此能直接输出真实标记，JavaScript 还没执行时
首屏就已经是正确的。

> **适用场景**：在服务端或构建期渲染页面（SSG、Express / Hono / Workers 路由、邮件预览任务），希望
> `<r-*>` 元素到达浏览器时已经是可见的标记，而不是等着 hydration 的空标签。

## 快速开始

```js
import 'ranui'; // 先做这一步：填充 SSR 注册表
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

渲染器会实例化每一个已注册的 `<r-*>` 标签，应用属性，递归渲染子节点，最后输出内含
`<template shadowrootmode="closed">` 的标记。不认识的标签原样透传，所以拿整页普通 HTML 来跑也没问题。

### 流式

`renderToStream` 是同一个渲染器的异步生成器版本，静态片段可以先发给客户端，后面的组件继续渲染：

```js
import { renderToStream } from 'ranui/ssr-stream';

for await (const chunk of renderToStream(pageHtml)) response.write(chunk);
```

### 单个组件

`ranui/ssr` 渲染的是你自己构造的组件实例。如果你在 Node 里手动拼装一棵树，而不是套模板字符串，用它
更合适：

```js
import { renderToString } from 'ranui/ssr';
import { Button } from 'ranui';

const html = renderToString(new Button());
```

## API 参考

| 导出                       | 入口               | 签名                                       | 说明                                           |
| -------------------------- | ------------------ | ------------------------------------------ | ---------------------------------------------- |
| `renderHTMLToString(html)` | `ranui/ssr-stream` | `(html: string) => Promise<string>`        | 展开 HTML 字符串里所有已注册的 `<r-*>`。       |
| `renderToStream(html)`     | `ranui/ssr-stream` | `(html: string) => AsyncGenerator<string>` | 同上，但按块流式输出。                         |
| `renderToString(el)`       | `ranui/ssr`        | `(component) => string`                    | 序列化单个组件实例。                           |
| `RanElement`               | `ranui/ssr`        | 类                                         | 浏览器里是 `HTMLElement`，Node 里是 SSR mock。 |
| `h(tag, props, …children)` | `ranui/ssr`        | `(tag, props?, ...children) => string`     | 手工拼装标记的小工具。                         |

## 服务端能做什么、不能做什么

**客户端会重建，而不是复用。** ranui 挂载的是 **closed** shadow root；对已经带有声明式 shadow root
的元素调用 `attachShadow`，在 closed 模式下**会清空该 root 的子节点**。所以服务端渲染出来的树只负责
第一帧，随后会被一棵一模一样的客户端树替换。由此有两点要注意：

- 它保证的是首屏正确，不是 hydration 复用。这是选用 closed root 的代价，原因见
  [编码规范](/cn/src/ranui/coding-guides/#服务端渲染)。
- **不要把状态写进服务端渲染的 shadow 标记里**，指望客户端再读回来。状态请通过属性传递，属性在重建后
  仍然保留。

**服务端没有任何尺寸信息。** 凡是依赖 `getBoundingClientRect` / `offsetWidth` 的逻辑，都要等到组件在
浏览器里挂载之后才会执行。组件把初始布局交给 CSS，正是出于这个原因。

**目前有四个元素不能服务端渲染**，原因都是它们在构造函数里就访问了浏览器 API：`<r-content>`
（`MutationObserver`）、`<r-link>`（`document`）、`<r-modal>`（SSR mock 未实现的 slot 方法）、
`<r-radar>`（`ResizeObserver`）。这四个会作为普通标签透传，到客户端再升级。其余每个元素都有对应的
测试，一旦不能渲染测试就会失败，所以这份名单不会悄悄变长。

## 主题与闪烁

`initTheme()` 在服务端不做任何事（所有 `document` / `localStorage` / `matchMedia` 访问都加了判断），
主题由客户端应用。要避免主题闪烁，请在服务端模板里直接给 `<html>` 写好 `data-ran-theme`：值可以从
cookie 取，也可以用一小段在首屏绘制前读取 `localStorage` 的内联脚本来设置，之后再交给
[`initTheme`](/cn/src/ranui/theme/) 接管。

## 最佳实践

- **渲染前先引入 `ranui`（或具体的 `ranui/<component>` 入口）。** 注册表依赖引入时的副作用来填充；
  没有引入的话，所有标签都会原样透传，页面就会悄无声息地少掉这些标记。
- **对整页跑，而不是只对片段跑。** `renderHTMLToString` 对任意 HTML 都安全，不必把 ranui 的部分单独摘出来。
- **别忘了样式表。** 声明式 Shadow DOM 标记自带组件样式，但页面级令牌来自 `ranui/style`（字体来自 `ranui/fonts`）。
