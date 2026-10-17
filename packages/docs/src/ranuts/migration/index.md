# Alpha migration

This alpha cleanup removes unused server wrappers and obsolete compatibility exports. Update consumers before upgrading. Pure utilities, stream/conversation and i18n still run in Node.

| Removed API                                                                                   | Replacement                                                                           |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `ranuts/node`: `readFile`, `writeFile`, `appendFile`, `readDir`, `queryFileInfo`, `watchFile` | `node:fs/promises`: `readFile`, `writeFile`, `appendFile`, `readdir`, `stat`, `watch` |
| `ranuts/node`: `readStream`, `writeStream`                                                    | `node:fs`: `createReadStream`, `createWriteStream`                                    |
| `Server`, `Router`, `body`, `staticMiddleware`, `connect`, `Context`                          | `node:http` / maintained HTTP framework                                               |
| `WSS`                                                                                         | WebSocket server library                                                              |
| `get`, `paresUrl`                                                                             | `fetch` + HTTP status/body checks; `new URL(url, base)`                               |
| `startTask`, `taskEnd`                                                                        | `performance.now()` (ms), `process.hrtime.bigint()` (ns)                              |
| `runCommand`, `prompt`, `colors`, `FMT`                                                       | `node:child_process`, `node:readline/promises`, `node:util.styleText`                 |
| `traverse`, `traverseSync`                                                                    | `node:fs/promises.readdir`, `node:fs.readdirSync` + recursion                         |
| `isColorSupported`                                                                            | `process.stdout.hasColors?.()`                                                        |
| `getIPAdress`                                                                                 | `node:os.networkInterfaces()`                                                         |
| `memoize`                                                                                     | `once` / `singleFlight`                                                               |
| `timeFormat`                                                                                  | `formatDuration`                                                                      |
| `timestampToTime`                                                                             | `formatDate` / `new Date(timestamp)`                                                  |
| `isClient`                                                                                    | `typeof window !== 'undefined'`                                                       |
| `md5`                                                                                         | `node:crypto.createHash('md5')` / dedicated MD5 library                               |

File helpers now return the native value and reject with an Error, rather than a success envelope. Pass an encoding explicitly for text.

```ts
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text, 'utf8');
```

Use a maintained HTTP framework or node:http for Server, Router, middleware and connect. A WebSocket server needs a server implementation; the platform WebSocket client is not a replacement.

formatDate returns formatted text. Use new Date(timestamp) when you need a Date object. once caches the first result, not one result per argument.

MD5 compatibility requires a dedicated implementation (node:crypto on Node). SHA-256 produces a different digest; neither is a password-storage algorithm.

Script loading now de-duplicates the exact type and content, without hashing or normalizing line endings.

## Retired experimental workspaces

The standalone `visual` and `ranite` packages have been removed. Use the maintained `ranuts/visual` engine and the existing Vite-based development scripts.

`visual` consumers must adapt to the current public API: initialize with `await Application.create(options)`, add `Graphics`/`Container` nodes to `app.stage`, then call `app.render()` or `app.start()`. The old `Bar`, `Line`, `Pie` and unfinished `Sankey` have no replacement in ranuts. Old geometry/event internals are not public exports; changing only the import name is insufficient.

## ESM-only packages

ranuts, ranui and @alixex/ranview now publish ESM modules only. Replace require() calls and CommonJS-transformed imports with native ESM imports. Older loaders and test runners must enable ESM or use dynamic import(); no CommonJS compatibility build or .d.cts declarations are shipped. Classic browser script tags still use standalone IIFEs.

```ts
import { rgbToHex } from 'ranuts';
import { h } from 'ranui/ssr';
```

- `ranuts/dist/umd/index.umd.cjs` → `ranuts/dist/iife/index.iife.js` (`ranuts`)
- `ranuts/dist/umd/utils/utils.umd.cjs` → `ranuts/dist/iife/utils.iife.js` (`ranuts_utils`)
- `ranui/dist/umd/index.umd.cjs` → `ranui/dist/index.iife.js` (`ranui`)
- `ranui/dist/iife/<name>.iife.js` → `ranui/dist/iife/<name>.iife.js`
