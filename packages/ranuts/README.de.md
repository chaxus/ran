# ranuts

Eine experimentelle Werkzeugbibliothek mit den Funktionen und Hilfsmitteln, die man ständig braucht

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | **Deutsch** | [فارسی](./README.fa.md)

---

## ⚠️ Bitte vorab lesen

Dies ist eine **experimentelle Werkzeugbibliothek** in einem frühen Stadium. Sie funktioniert, ist aber vor allem zum Lernen und Ausprobieren gedacht.

**Das Wichtigste:**

- 🚧 **Frühes Stadium**: An den Funktionen wird noch geschrieben und gefeilt
- 🧪 **Experimentell**: Die APIs können sich häufig ändern
- 📚 **Das Lernen zuerst**: In erster Linie, um Werkzeuge in JavaScript und TypeScript kennenzulernen

## Installation

Mit npm:

```console
npm install ranuts@latest --save
```

## Dokumentation

[Ein paar häufig gebrauchte Funktionen und Hilfsmittel](https://ran.chaxus.com/de/src/ranuts/)

**Für KI-Agenten und LLMs:** Fang mit [CLAUDE.md](./CLAUDE.md) an (die Orientierung: Einstiegspunkte, Grenzen der Laufzeitumgebung, Konventionen) und geh dann zu [docs/API.md](./docs/API.md) (die erzeugte Referenz aller exportierten Symbole samt Signaturen und Beschreibungen; neu erzeugen mit `npm run doc:api`).

Oder installier die fertige **Claude-Code-Skill** aus dem Plugin-Marktplatz `ran`: Sie gibt Assistenten die Import-Übersicht, das Verzeichnis von `ranuts/utils`, Anwendungsbeispiele und die Konventionen an die Hand und verweist auf die API-Referenz, die im Paket mitkommt:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranuts@ran
```

Claude greift danach von selbst darauf zu (oder du rufst sie mit `/ranuts:ranuts` auf).

## Verwendung

Importier nur, was du brauchst. Zur Wahl stehen:

- `ranuts/utils` — DOM/BOM, Zeichenketten, Objekte, Zahlen, Farbe, Zeit, Speicher, Binärdaten und ZIP, Worker und IndexedDB, Helfer für Mehrsprachigkeit
- `ranuts/node` — HTTP-Server, Router, WebSocket, fs, Streams, Middleware (**nur Node**)
- `ranuts/visual` — 2D-Rendermaschine (Canvas / WebGL / WebGPU, **nur Browser**)
- `ranuts/sw` — Cache-Strategien und die Service-Worker-Hälfte des Vorab-Cache-Protokolls (**nur Service Worker**)
- `ranuts/vnode` — virtuelles DOM nach Art von Snabbdom
- `ranuts/stream` — Server-Sent Events lesen, eine anbieterneutrale Faltung einer gestreamten Modellantwort, und das Token-Budget, das entscheidet, wann ein Verlauf nicht mehr hineinpasst
- `ranuts/conversation` — bildet ein nur wachsendes Ereignisprotokoll auf darstellbare Gesprächsknoten ab
- `ranuts/i18n` — die i18n-Maschine für sich, ohne den Rest von `utils`

```js
import { debounce } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { createI18n } from 'ranuts/i18n';
```

Alles auf einmal importieren (das zieht viele Module herein, die du nicht brauchst; importier lieber nur, was du wirklich verwendest)

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

## Mitmachen

Beiträge sind willkommen, ob du zum Lernen kommst oder zum Entwickeln. Das Projekt ist experimentell, hab also etwas Geduld mit dem Tempo der Entwicklung.

## Wer mitgemacht hat

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Besuche

![](http://profile-counter.glitch.me/chaxus-ranuts/count.svg)

## Sonstiges

[Lizenz (MIT)](/LICENSE)
