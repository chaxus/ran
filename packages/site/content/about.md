---
title: 关于
description: chaxus 是谁，在做什么，以及这个站为什么长这样。
---

## 在做什么

**[ranui](https://ran.chaxus.com/src/ranui/)** —— 基于原生自定义元素的 Web Components 组件库。不绑定框架，React、Vue、Svelte 或者什么都不用，都是同一套组件。带 TypeScript 类型、明暗主题、SSR 和 PWA 支持。

**[ranuts](https://ran.chaxus.com/src/ranuts/)** —— TypeScript 工具库。i18n、zip、IndexedDB、Worker 封装这些真正在项目里反复要写的东西。

两个包都在 [chaxus/ran](https://github.com/chaxus/ran) 这个 monorepo 里，文档站是 [ran.chaxus.com](https://ran.chaxus.com)。

## 这个站为什么长这样

它是自己的静态站点生成器生成的 —— 没有用 VitePress、Astro 或者别的现成方案，`packages/site/build/` 里那几百行就是全部。

这么做有个具体理由。文档站现在跑在 VitePress 上，1,393 个页面、8 种语言，换引擎的风险极高。所以先在这个几十页的小站上把生成器跑通：markdown 管线、SSG 驱动、主题层、SEO，全部走一遍。跑通了再谈别的，跑不通就说明这个想法本来就不成立 —— 代价是一个个人站，不是全站的搜索排名。

页面本身不依赖 JavaScript。关掉脚本，内容、导航、样式全都在。
