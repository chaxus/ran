# ranuts

Some commonly used functions and tools

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

---


## Install

Using npm:

```console
npm install ranuts --save
```

## Document

[Some commonly used functions and tools](https://chaxus.github.io/ran/src/ranuts/utils/)



## Usage

- ESM

```js
import { str2Xml } from 'ranuts';

const data = `
    <svg t="1688378016663" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2608" width="128" height="128"><path d="M568 515.008l254.016-255.008q12-11.008 12-27.488t-11.488-28-28-11.488-27.488 12l-255.008 254.016-255.008-254.016q-11.008-12-27.488-12t-28 11.488-11.488 28 12 27.488l254.016 255.008-254.016 255.008q-12 11.008-12 27.488t11.488 28 28 11.488 27.488-12l255.008-255.008 255.008 255.008q11.008 12 27.488 12t28-11.488 11.488-28-12-27.488z" p-id="2609" ></path></svg>
`

const html = str2Xml(data, 'image/svg+xml');

document.body.appendChild(html);
```

- UMD, IIFE, CJS

```html
<script src="./ranuts/dist/index.umd.cjs"></script>

<script>
    const { str2Xml } = require('ranuts')
    const data = `
    <svg t="1688378016663" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2608" width="128" height="128"><path d="M568 515.008l254.016-255.008q12-11.008 12-27.488t-11.488-28-28-11.488-27.488 12l-255.008 254.016-255.008-254.016q-11.008-12-27.488-12t-28 11.488-11.488 28 12 27.488l254.016 255.008-254.016 255.008q-12 11.008-12 27.488t11.488 28 28 11.488 27.488-12l255.008-255.008 255.008 255.008q11.008 12 27.488 12t28-11.488 11.488-28-12-27.488z" p-id="2609" ></path></svg>
`

const html = str2Xml(data, 'image/svg+xml');

document.body.appendChild(html);

<script>
```

## Contributors

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Meta

[LICENSE (MIT)](/LICENSE)