# Alpha 移行ガイド

この alpha 整理では、利用されていないサーバー用ラッパーと古い互換エクスポートを削除します。更新前に呼び出し側を移行してください。純粋なユーティリティ、stream/conversation、i18n は引き続き Node で動作します。

| 削除した API                                                                                  | 移行先                                                                                |
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

ファイル API は success オブジェクトではなく、値を直接返し、失敗時は Error で拒否します。テキストには文字コードを指定してください。

```ts
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text, 'utf8');
```

Server、Router、ミドルウェア、connect は保守されている HTTP フレームワークか node:http に移行してください。WebSocket サーバーにはサーバー実装が必要です。標準 WebSocket クライアントでは代替できません。

formatDate は文字列を返します。Date オブジェクトには new Date(timestamp) を使います。once は引数別ではなく最初の結果を保持します。

MD5 互換性が必要なら専用実装（Node では node:crypto）を使います。SHA-256 は異なるダイジェストです。どちらもパスワード保存用アルゴリズムではありません。

スクリプトは type と内容の完全一致で重複を除きます。ハッシュ計算や改行の正規化は行いません。

## 廃止した実験ワークスペース

独立した `visual` と `ranite` パッケージを削除しました。描画には保守中の `ranuts/visual`、開発には既存の Vite スクリプトを使用してください。

`visual` の移行では公開 API への適応が必要です。`await Application.create(options)` で初期化し、`Graphics` / `Container` を `app.stage` に追加して `app.render()` または `app.start()` を呼びます。旧 `Bar`、`Line`、`Pie`、未完成の `Sankey` に対応する API はありません。旧ジオメトリとイベントの内部クラスも公開されていないため、import 名の変更だけでは移行できません。

## ESM のみのパッケージ

ranuts、ranui、@alixex/ranview は ESM モジュールのみを公開します。require() や CommonJS に変換されるインポートをネイティブ ESM に変更してください。旧ローダーとテストツールでは ESM を有効にするか動的 import() を使用します。CommonJS ビルドと .d.cts 宣言は提供しません。通常の script タグ用の独立 IIFE は引き続き利用できます。

```ts
import { rgbToHex } from 'ranuts';
import { h } from 'ranui/ssr';
```

- `ranuts/dist/umd/index.umd.cjs` → `ranuts/dist/iife/index.iife.js` (`ranuts`)
- `ranuts/dist/umd/utils/utils.umd.cjs` → `ranuts/dist/iife/utils.iife.js` (`ranuts_utils`)
- `ranui/dist/umd/index.umd.cjs` → `ranui/dist/index.iife.js` (`ranui`)
- `ranui/dist/iife/<name>.iife.js` → `ranui/dist/iife/<name>.iife.js`
