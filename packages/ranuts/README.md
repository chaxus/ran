# ranuts

Experimental utility library with commonly used functions and tools

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

---

## ⚠️ Important Notice

This is an **experimental utility library** in early development. While functional, it's primarily designed for learning and experimentation.

**Key points:**

- 🚧 **Early Development**: Features are still being developed and refined
- 🧪 **Experimental**: APIs may change frequently
- 📚 **Learning Focus**: Primarily for learning JavaScript/TypeScript utilities

## Install

Using npm:

```console
npm install ranuts@latest --save
```

## Document

[Some commonly used functions and tools](https://ran.chaxus.com/src/ranuts/)

**For AI agents / LLMs:** start from [CLAUDE.md](./CLAUDE.md) (orientation: entry points,
runtime constraints, conventions) and [docs/API.md](./docs/API.md) (generated reference of
every exported symbol with signatures + descriptions, run `npm run doc:api` to refresh).

Or install the ready-made **Claude Code skill** from the `ran` plugin marketplace — it
gives assistants the import map, `ranuts/utils` inventory, usage examples, and conventions,
and points to the API reference shipped in the package:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranuts@ran
```

Claude then uses it automatically (or invoke it as `/ranuts:ranuts`).

## Usage

Import as required. You can select:

- `ranuts/utils` — DOM/BOM, string, object, number, colour, time, storage, i18n helpers
- `ranuts/node` — HTTP server, router, ws, fs, streams, middleware (**Node only**)
- `ranuts/visual` — 2D rendering engine (Canvas / WebGL / WebGPU, **browser only**)
- `ranuts/vnode` — Snabbdom-style virtual DOM
- `ranuts/i18n` — the i18n engine on its own, without the rest of `utils`

```js
import { debounce } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { createI18n } from 'ranuts/i18n';
```

Full import,(Full import will introduce many unnecessary modules. You are advised to import them on demand)

- ESM

```js
import { debounce } from 'ranuts';

const onResize = debounce(() => {
  console.log('window resized');
}, 200);

window.addEventListener('resize', onResize);
```

- UMD, IIFE, CJS

```html
<script src="./ranuts/dist/umd/index.umd.cjs"></script>

<script>
    const { debounce } = require('ranuts')
    const onResize = debounce(() => {
      console.log('window resized');
    }, 200);

    window.addEventListener('resize', onResize);
<script>
```

## Contributing

We welcome contributions from learners and developers! This is an experimental project, so please be patient with the development process.

## Contributors

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Visitors

![](http://profile-counter.glitch.me/chaxus-ranuts/count.svg)

## Meta

[LICENSE (MIT)](/LICENSE)
