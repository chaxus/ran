# Alpha-Migration

Diese Alpha-Bereinigung entfernt ungenutzte Server-Wrapper und veraltete Kompatibilitätsexporte. Migrieren Sie Aufrufer vor dem Upgrade. Reine Hilfsfunktionen, stream/conversation und i18n laufen weiterhin in Node.

| Entfernte API                                                                                 | Ersatz                                                                                |
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

Datei-APIs liefern den nativen Wert und lehnen mit Error ab, statt ein success-Objekt zurückzugeben. Geben Sie für Text eine Kodierung an.

```ts
import { readFile, writeFile } from 'node:fs/promises';

const text = await readFile('input.txt', 'utf8');
await writeFile('output.txt', text, 'utf8');
```

Migrieren Sie Server, Router, Middleware und connect zu einem gepflegten HTTP-Framework oder node:http. Ein WebSocket-Server braucht eine Serverimplementierung; der native WebSocket-Client ersetzt sie nicht.

formatDate liefert Text. Für ein Date-Objekt verwenden Sie new Date(timestamp). once speichert das erste Ergebnis, kein Ergebnis pro Argument.

Für MD5-Kompatibilität ist eine eigene Implementierung nötig (node:crypto in Node). SHA-256 erzeugt einen anderen Hash; beide sind keine Verfahren zur Passwortspeicherung.

Skripte werden anhand des exakten Typs und Inhalts dedupliziert, ohne Hashing oder Normalisierung von Zeilenumbrüchen.

## Entfernte experimentelle Workspaces

Die eigenständigen Pakete `visual` und `ranite` wurden entfernt. Verwenden Sie die gepflegte Engine `ranuts/visual` und die vorhandenen Vite-Entwicklungsskripte.

Aufrufer von `visual` müssen die öffentliche API anpassen: mit `await Application.create(options)` initialisieren, `Graphics` / `Container` zu `app.stage` hinzufügen und `app.render()` oder `app.start()` aufrufen. Für `Bar`, `Line`, `Pie` und das unfertige `Sankey` gibt es keinen Ersatz. Alte interne Geometrie- und Ereignisklassen sind keine öffentlichen Exporte; ein geänderter Importname allein reicht nicht.

## Pakete nur mit ESM

ranuts, ranui und @alixex/ranview veröffentlichen nur noch ESM-Module. Ersetze require() und nach CommonJS umgewandelte Importe durch natives ESM. Ältere Loader und Testwerkzeuge müssen ESM aktivieren oder dynamisches import() verwenden; CommonJS-Builds und .d.cts-Deklarationen entfallen. Eigenständige IIFEs für klassische script-Tags bleiben erhalten.

```ts
import { rgbToHex } from 'ranuts';
import { h } from 'ranui/ssr';
```

- `ranuts/dist/umd/index.umd.cjs` → `ranuts/dist/iife/index.iife.js` (`ranuts`)
- `ranuts/dist/umd/utils/utils.umd.cjs` → `ranuts/dist/iife/utils.iife.js` (`ranuts_utils`)
- `ranui/dist/umd/index.umd.cjs` → `ranui/dist/index.iife.js` (`ranui`)
- `ranui/dist/iife/<name>.iife.js` → `ranui/dist/iife/<name>.iife.js`
