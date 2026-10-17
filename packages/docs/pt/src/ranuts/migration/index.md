# Migração alpha

Esta limpeza alpha remove wrappers de servidor sem consumidores e exports de compatibilidade obsoletos. Migre os consumidores antes de atualizar. Utilitários puros, stream/conversation e i18n continuam funcionando no Node.

| API removida                                                                                  | Substituição                                                                          |
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

As APIs de arquivos retornam o valor nativo e rejeitam com Error, sem um objeto success. Especifique a codificação para texto.

```ts
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text, 'utf8');
```

Migre Server, Router, middleware e connect para um framework HTTP mantido ou node:http. Um servidor WebSocket precisa de uma implementação de servidor; o cliente WebSocket nativo não o substitui.

formatDate retorna texto. Use new Date(timestamp) para um objeto Date. once guarda o primeiro resultado, não um resultado por argumento.

Para compatibilidade MD5 use uma implementação específica (node:crypto no Node). SHA-256 gera outro resumo; nenhum deles é um algoritmo de armazenamento de senhas.

Scripts são deduplicados por tipo e conteúdo exatos, sem hashes nem normalização de quebras de linha.
