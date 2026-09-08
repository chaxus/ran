---
title: 把 1016 个 Vue 组件降级成一个零运行时的自定义元素
date: 2026-09-06
pillar: practice
tags: [Web Components, Vue, VitePress, 重构]
description: 一个包着两层 div 和一张样式表、一行 JavaScript 都没有的组件，凭什么需要一个框架。
---

文档站里有个 `Demo.vue`，用来包住组件库文档里所有的实时示例。八种语言、248 个文件、1016 处使用 —— 全站最宽的 Vue 接触面。

打开一看，它是这个：

```html
<template>
  <div class="ran-demo">
    <div class="ran-demo__preview" :class="[`is-${align}`, { 'is-column': column }]">
      <slot />
    </div>
  </div>
</template>
```

加一张 scoped 样式表。**一行 JavaScript 都没有。**

## 降成什么

第一反应可能是「那就写成 web component」。但对这个东西，加 shadow DOM 是错的。

demo 里装的是活的 `<r-*>` 元素和 markdown 生成的 `<p>`，它们必须继续被页面自己的 `.vp-doc` 规则命中 —— 整个站的排版就是靠那些规则工作的。一道 shadow 边界会把它们全部切断。

真正合适的是**一个零运行时的自定义元素**：

```html
<ran-demo column>
  <r-input label="Name"></r-input>
</ran-demo>
```

没有人注册它，没有 shadow root，没有升级过程。它就是一个带连字符的未知元素，被全局 CSS 样式化。带连字符的标签名在 HTML 里是合法的自定义元素名，浏览器会给它一个正常的 `HTMLElement`，可以随便设 `display: flex`。

这么做换来三件事，而它们恰好也是真做成 web component 会失去的：

- demo 的标记留在**服务端渲染的 HTML** 里，可被索引，关掉 JavaScript 也正确
- 页面自己的规则**照样够得着** demo 内部
- **没有升级、没有 hydration、没有运行时**

给 Vue 编译器加一句 `tag.startsWith('ran-')` 就够了，和它本来就在放行的 ranui `r-*` 并列。站里由此有了两个清晰的命名空间：`r-*` 是真组件，`ran-*` 是没有行为的展示元素。

## 怎么证明没改坏

1016 个块，248 个文件，八种语言。肉眼是查不过来的。

做法是**构建两次**：一次在改动前的 commit 上，一次在改动后，然后对比渲染产物。取 3 种语言 10 个页面的 demo 块做无截断比对，约 12.4 万字符。

第一次比对全是差异，因为归一化正则没吃掉 Vue 的 `data-v-` 作用域属性。修正之后，只剩一种差异：

```diff
- <!--[--><r-button>Button</r-button><!--]-->
+ <r-button>Button</r-button>
```

`<!--[-->` 和 `<!--]-->` 是 Vue SSR 给 slot 内容打的片段锚点。它们消失正是预期结果 —— 新产物更干净。抹掉这两个标记后，**12.4 万字符逐字节相同**。

::: tip 一个容易漏的守卫
`check-langs.ts` 里有段代码按 `<Demo\b` 计数，比对各语言页面是不是漏了 demo 块。如果只改 markdown 不改这个正则，它会匹配到 0 个，然后 `0 === 0` 恒真通过 —— 守卫还在，但已经不守任何东西了。

我改完之后特意删掉日文页的一个块试了一下，它正确报出 `3 vs 4`。这种验证值得花那两分钟。
:::

## 顺手挖出来的东西

`align="stretch"` 在全站用了 32 次，而 CSS 里根本没有 `stretch` 这条规则 —— 它一直在静默回落到 `center`。

更有意思的是：**就算实现了也没用**。`align-items` 管的是 flex 的**交叉轴**，在默认的 row 容器里它控制的是垂直方向，永远不可能把子元素撑宽。

作者想要的是「section 组件占满容器宽度」。实测下来那四个 demo 在 640px 的容器里只有 226–339px，右边一半是空的 —— 一个自我描述为「页面区块表面」的组件，渲染成这样看起来像是组件坏了。

这个体系里能产生整宽的拼写是已有的 `column`：它设 `flex-direction: column`，交叉轴变成水平，`align-items: stretch` 这才终于是作者想要的意思。改完四个都是 638px。

## 值得记住的

一个组件没有 JavaScript，就不该是一个组件。这句话听起来像废话，但 `Demo.vue` 在那儿放了很久 —— 因为它长得像组件，用起来像组件，而且**能用**。

能用和该这么写是两回事。判断标准很具体：这个东西需要状态或者事件处理吗？不需要的话，它就是标记加样式，而标记加样式在 2026 年不需要框架。
