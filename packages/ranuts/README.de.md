# ranuts

TypeScript-Werkzeuge für Browser-APIs, Datenverarbeitung, Streams und 2D-Rendering.

[![npm](https://img.shields.io/npm/v/ranuts.svg)](https://www.npmjs.com/package/ranuts) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | **Deutsch** | [فارسی](./README.fa.md)

> Alpha: APIs und Paketformate können sich ändern. Fixiere eine konkrete Version und lies vor Updates den Migrationsleitfaden.

## Schnellstart

```sh
npm install ranuts
```

```ts
import { rgbToHex } from 'ranuts/utils';

console.log(rgbToHex(1, 2, 3)); // #010203
```

## ESM

Wähle den Einstieg nach Laufzeit und Aufgabe. Einzelne Helfer brauchen Browser-Globals; nicht alle Funktionen sind serverkompatibel.

| Paket                 | Einsatz                                                  |
| --------------------- | -------------------------------------------------------- |
| `ranuts/utils`        | DOM/BOM, Farben, Binärdaten, Speicher und weitere Helfer |
| `ranuts/i18n`         | Eigenständige Internationalisierung                      |
| `ranuts/stream`       | SSE-Parsing und Zustand gestreamter Antworten            |
| `ranuts/conversation` | Projektion von Gesprächsereignissen                      |
| `ranuts/visual`       | 2D-Rendering; Browser                                    |
| `ranuts/vnode`        | Virtuelles DOM; Browser                                  |
| `ranuts/sw`           | Cache-Strategien für Service Worker                      |

## IIFE / CDN

Für ein klassisches script-Tag steht ein eigenständiges IIFE bereit. Ersetze VERSION durch eine veröffentlichte Version; ein Bundler oder Modullader ist nicht nötig.

```html
<script src="https://cdn.jsdelivr.net/npm/ranuts@VERSION/dist/iife/utils.iife.js"></script>
<script>
  console.log(ranuts_utils.rgbToHex(1, 2, 3));
</script>
```

Das Utility-IIFE stellt `ranuts_utils` bereit, das vollständige `dist/iife/index.iife.js` stellt `ranuts` bereit. Ersetze VERSION durch eine veröffentlichte Version.

## Dokumentation

- [ranuts](https://ran.chaxus.com/de/src/ranuts/)
- [API](./docs/API.md)
- [Referenz für Maintainer und Agents](./CLAUDE.md)
- [Migrationsleitfaden](https://ran.chaxus.com/de/src/ranuts/migration/)

## Mitwirken

[Referenz für Maintainer und Agents](./CLAUDE.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## Lizenz

[MIT](./LICENSE)
