---
title: 同一个 markdown 组件，为什么渲染不了自己的文档站
date: 2026-09-08
pillar: internals
tags: [ranui, markdown, DOMPurify]
---

给 ranui 写了 `<r-markdown>` 之后，我一度以为文档站的渲染问题解决了：既然组件库自己带 markdown 渲染器，文档站直接用它不就行了。

结论是不行，而且原因不是「差点功能」，是这两件事根本不是一回事。

## 先看现象

`<r-markdown>` 的渲染路径末端接了 DOMPurify，配置是这样的：

```ts
const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style', 'form', 'textarea', 'select', 'button', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['style'],
  ADD_ATTR: ['target'],
};
```

拿组件库文档里最常见的那种片段喂进去：

```html
<r-button type="primary">Primary Button</r-button>
```

出来是这个：

```text
Primary Button
```

标签没了，只剩文本。`USE_PROFILES: { html: true }` 启用的是 DOMPurify 的 HTML 白名单，而自定义元素不在白名单里 —— 所有 `<r-*>` 会被剥掉，子节点提升上来。再加上 `FORBID_ATTR: ['style']`，demo 里大量用来控制布局的内联样式也一起消失。

一个组件库的文档站，最核心的内容就是「这个组件长什么样」。全部渲染成纯文本之后，页面还在，意义没了。

## 为什么不是调配置能解决的

第一反应是把自定义元素加进白名单。但往下想一层就会发现，这个配置不是随手写的，它是这个组件的设计前提。

`<r-markdown>` 要渲染的是**流式到达的、不可信的模型输出**。在那个场景里，激进净化正是它的价值 —— 模型可能吐出任何东西，而内容会被直接插进用户正在看的页面。放开自定义元素和内联样式，等于把 DOM 注入的口子开在最不该开的地方。

文档站要渲染的是**仓库自己的、构建期就位的可信源码**。作者就是我，内容在 git 里，构建期跑一次。这里需要的根本不是净化，是 frontmatter、容器语法、标题锚点、TOC 提取 —— 一整套 `<r-markdown>` 压根没有也不该有的东西。

::: note 一句话
一个是运行时的、面向不可信输入的渲染器；一个是构建期的、面向可信源码的管线。名字里都有 markdown，共同点也就到此为止。
:::

## 真正的代价

这件事的代价不在于「白写了」—— `<r-markdown>` 在它自己的场景里工作得很好。代价在于**如果不先验证就开始迁移**，会按「组件库已经有 markdown 渲染器」来估算工作量，而实际上那 1,200 行一行都用不上，整个 markdown 管线要重写。

低估一半的工作量，通常比高估一倍更贵。

所以这个站现在跑在一套单独写的构建期管线上，`marked` 加 `shiki`，和 `<r-markdown>` 共用同一个 parser，但不共用渲染路径。两边各做各的事。
