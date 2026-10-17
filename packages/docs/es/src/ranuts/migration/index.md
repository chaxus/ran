# Migración alpha

Esta limpieza alpha elimina envoltorios de servidor sin consumidores y exportaciones de compatibilidad obsoletas. Migre los consumidores antes de actualizar. Las utilidades puras, stream/conversation e i18n siguen funcionando en Node.

| API eliminada                                                                                 | Sustitución                                                                           |
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

Las API de archivos devuelven el valor nativo y rechazan con Error, sin un objeto success. Especifique la codificación para texto.

```ts
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text, 'utf8');
```

Migre Server, Router, middleware y connect a un framework HTTP mantenido o node:http. Un servidor WebSocket necesita una implementación de servidor; el cliente WebSocket nativo no lo sustituye.

formatDate devuelve texto. Use new Date(timestamp) para obtener un objeto Date. once conserva el primer resultado, no un resultado por argumento.

Para compatibilidad MD5 use una implementación específica (node:crypto en Node). SHA-256 produce otro resumen; ninguno es un algoritmo de almacenamiento de contraseñas.

Los scripts se deduplican por tipo y contenido exactos, sin hashes ni normalización de saltos de línea.

## Workspaces experimentales retirados

Se han eliminado los paquetes independientes `visual` y `ranite`. Use el motor mantenido `ranuts/visual` y los scripts de desarrollo existentes basados en Vite.

La migración de `visual` exige adaptar la API: inicialice con `await Application.create(options)`, añada nodos `Graphics` / `Container` a `app.stage` y llame a `app.render()` o `app.start()`. Los antiguos `Bar`, `Line`, `Pie` y el `Sankey` incompleto no tienen sustituto. Las clases internas de geometría y eventos tampoco son exportaciones públicas; cambiar solo el import no basta.

## Paquetes solo ESM

ranuts, ranui y @alixex/ranview publican solo módulos ESM. Sustituye require() y las importaciones transformadas a CommonJS por ESM nativo. Los cargadores y ejecutores de pruebas antiguos deben activar ESM o usar import() dinámico; ya no se distribuyen compilaciones CommonJS ni declaraciones .d.cts. Las etiquetas script clásicas conservan los IIFE independientes.

```ts
import { rgbToHex } from 'ranuts';
import { h } from 'ranui/ssr';
```

- `ranuts/dist/umd/index.umd.cjs` → `ranuts/dist/iife/index.iife.js` (`ranuts`)
- `ranuts/dist/umd/utils/utils.umd.cjs` → `ranuts/dist/iife/utils.iife.js` (`ranuts_utils`)
- `ranui/dist/umd/index.umd.cjs` → `ranui/dist/index.iife.js` (`ranui`)
- `ranui/dist/iife/<name>.iife.js` → `ranui/dist/iife/<name>.iife.js`
