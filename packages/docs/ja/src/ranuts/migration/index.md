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
