# ranuts

TypeScript utilities for browser APIs, data processing, streams and 2D rendering.

[![npm](https://img.shields.io/npm/v/ranuts.svg)](https://www.npmjs.com/package/ranuts) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

**English** | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Alpha: APIs and package formats can change. Pin an exact version and read the migration guide before upgrading.

## Quick start

```sh
npm install ranuts
```

```ts
import { rgbToHex } from 'ranuts/utils';

console.log(rgbToHex(1, 2, 3)); // #010203
```

## ESM

Choose an entry by runtime and task. Individual utilities may require browser globals; importing a package does not make every helper server-compatible.

| Package               | Use for                                           |
| --------------------- | ------------------------------------------------- |
| `ranuts/utils`        | DOM/BOM, color, binary, storage and other helpers |
| `ranuts/i18n`         | Internationalization without the utility barrel   |
| `ranuts/stream`       | SSE parsing and streamed-response state           |
| `ranuts/conversation` | Conversation event-log projection                 |
| `ranuts/visual`       | 2D rendering; browser                             |
| `ranuts/vnode`        | Virtual DOM; browser                              |
| `ranuts/sw`           | Service-worker cache strategies; service worker   |

## IIFE / CDN

For a classic browser script tag, use a standalone IIFE. Replace VERSION with a published version; no bundler or module loader is needed.

```html
<script src="https://cdn.jsdelivr.net/npm/ranuts@VERSION/dist/iife/utils.iife.js"></script>
<script>
  console.log(ranuts_utils.rgbToHex(1, 2, 3));
</script>
```

The utility IIFE exposes `ranuts_utils`; the full `dist/iife/index.iife.js` exposes `ranuts`. Replace VERSION with a published version.

## Documentation

- [ranuts](https://ran.chaxus.com/src/ranuts/)
- [API](./docs/API.md)
- [Maintainer and agent reference](./CLAUDE.md)
- [Migration guide](https://ran.chaxus.com/src/ranuts/migration/)

## Contributing

[Maintainer and agent reference](./CLAUDE.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## License

[MIT](./LICENSE)
