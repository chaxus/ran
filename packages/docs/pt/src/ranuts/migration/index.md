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

## Workspaces experimentais removidos

Os pacotes independentes `visual` e `ranite` foram removidos. Use o motor mantido `ranuts/visual` e os scripts de desenvolvimento existentes baseados em Vite.

A migração de `visual` exige adaptar a API: inicialize com `await Application.create(options)`, adicione nós `Graphics` / `Container` a `app.stage` e chame `app.render()` ou `app.start()`. Os antigos `Bar`, `Line`, `Pie` e o `Sankey` incompleto não têm substitutos. Classes internas de geometria e eventos não são exports públicos; alterar apenas o import não basta.

## Pacotes apenas ESM

ranuts, ranui e @alixex/ranview publicam apenas módulos ESM. Substitua require() e importações transformadas em CommonJS por ESM nativo. Carregadores e ferramentas de teste antigos devem ativar ESM ou usar import() dinâmico; não há compilação CommonJS nem declarações .d.cts. As tags script clássicas continuam usando IIFEs independentes.

```ts
import { rgbToHex } from 'ranuts';
import { h } from 'ranui/ssr';
```

- `ranuts/dist/umd/index.umd.cjs` → `ranuts/dist/iife/index.iife.js` (`ranuts`)
- `ranuts/dist/umd/utils/utils.umd.cjs` → `ranuts/dist/iife/utils.iife.js` (`ranuts_utils`)
- `ranui/dist/umd/index.umd.cjs` → `ranui/dist/index.iife.js` (`ranui`)
- `ranui/dist/iife/<name>.iife.js` → `ranui/dist/iife/<name>.iife.js`
