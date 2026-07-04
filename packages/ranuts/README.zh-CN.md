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

[一些常用的函数和工具](https://chaxus.github.io/ran/cn/src/ranuts/)

## 使用方式

按需导入。您可以选择：

- ranuts/utils
- ranuts/node
- ranuts/react

```js
import { str2Xml } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { reactify } from 'ranuts/react';
```

全量导入（全量导入会引入许多不必要的模块，建议按需导入）

- ESM

```js
import { str2Xml } from 'ranuts';

const data = `
    <svg t="1688378016663" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2608" width="128" height="128"><path d="M568 515.008l254.016-255.008q12-11.008 12-27.488t-11.488-28-28-11.488-27.488 12l-255.008 254.016-255.008-254.016q-11.008-12-27.488-12t-28 11.488-11.488 28 12 27.488l254.016 255.008-254.016 255.008q-12 11.008-12 27.488t11.488 28 28 11.488 27.488-12l255.008-255.008 255.008 255.008q11.008 12 27.488 12t28-11.488 11.488-28-12-27.488z" p-id="2609" ></path></svg>
`;

const html = str2Xml(data, 'image/svg+xml');

document.body.appendChild(html);
```

- UMD, IIFE, CJS

```html
<script src="./ranuts/dist/umd/index.umd.cjs"></script>

<script>
    const { str2Xml } = require('ranuts')
    const data = `
    <svg t="1688378016663" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2608" width="128" height="128"><path d="M568 515.008l254.016-255.008q12-11.008 12-27.488t-11.488-28-28-11.488-27.488 12l-255.008 254.016-255.008-254.016q-11.008-12-27.488-12t-28 11.488-11.488 28 12 27.488l254.016 255.008-254.016 255.008q-12 11.008-12 27.488t11.488 28 28 11.488 27.488-12l255.008-255.008 255.008 255.008q11.008 12 27.488 12t28-11.488 11.488-28-12-27.488z" p-id="2609" ></path></svg>
`

const html = str2Xml(data, 'image/svg+xml');

document.body.appendChild(html);

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
