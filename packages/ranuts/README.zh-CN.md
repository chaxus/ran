# ranuts

实验性工具函数库，包含常用的函数和工具

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

**中文** | [English](./README.md)

---

## ⚠️ 重要说明

这是一个**实验性工具函数库**，处于早期开发阶段。虽然功能可用，但主要用于学习和实验。

**关键要点：**

- 🚧 **早期开发**: 功能仍在开发和完善中
- 🧪 **实验性**: API 可能会频繁变化
- 📚 **学习导向**: 主要用于学习 JavaScript/TypeScript 工具函数

## 安装

使用 npm:

```console
npm install ranuts@latest --save
```

## 文档

[一些常用的函数和工具](https://ran.chaxus.com/cn/src/ranuts/)

## 使用方式

按需导入。您可以选择：

- `ranuts/utils` —— DOM/BOM、字符串、对象、数字、颜色、时间、存储、i18n 等工具
- `ranuts/node` —— HTTP 服务、路由、ws、fs、流、中间件（**仅 Node**）
- `ranuts/visual` —— 2D 渲染引擎（Canvas / WebGL / WebGPU，**仅浏览器**）
- `ranuts/vnode` —— Snabbdom 风格的虚拟 DOM
- `ranuts/i18n` —— 单独的 i18n 引擎，不牵入 `utils` 的其余部分

```js
import { debounce } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { createI18n } from 'ranuts/i18n';
```

全量导入（全量导入会引入许多不必要的模块，建议按需导入）

- ESM

```js
import { debounce } from 'ranuts';

const onResize = debounce(() => {
  console.log('窗口尺寸发生变化');
}, 200);

window.addEventListener('resize', onResize);
```

- UMD, IIFE, CJS

```html
<script src="./ranuts/dist/umd/index.umd.cjs"></script>

<script>
    const { debounce } = require('ranuts')
    const onResize = debounce(() => {
      console.log('窗口尺寸发生变化');
    }, 200);

    window.addEventListener('resize', onResize);
<script>
```

## 贡献

我们欢迎学习者和开发者的贡献！这是一个实验性项目，请对开发过程保持耐心。

## 贡献者

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## 访问统计

![](http://profile-counter.glitch.me/chaxus-ranuts/count.svg)

## Meta

[LICENSE (MIT)](/LICENSE)
