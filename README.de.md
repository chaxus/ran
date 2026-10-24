<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Designmethoden, Komponenten und Werkzeuge für Webprodukte, für Entwickler und Coding-Agents.</p>
<p align="center"><a href="https://ran.chaxus.com/de/">Dokumentation</a> · <a href="https://ran.chaxus.com/de/src/ranui/">Komponenten</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <b>Deutsch</b> · <a href="./README.fa.md">فارسی</a></p>

ran besteht aus drei Teilen, die sich einzeln nutzen lassen: **ranui**, UI-Komponenten als native Custom Elements; **ranuts**, typisierte TypeScript-Hilfsfunktionen; und **Ran Design**, Methoden für Layout, Interaktion und Abnahme, die Menschen und Coding-Agents in jedem Stack anwenden können. Jede ranui-Komponente ist ein `<r-*>`-Tag und funktioniert deshalb in React, Vue, Svelte und reinem HTML gleich; Bausteine für KI-Chatoberflächen sind enthalten.

## Installation

Ohne Build-Schritt die Komponente von einem CDN laden und das Tag schreiben:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Speichern</r-button>
```

Mit einem Bundler:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui ist im Alpha-Stadium, neue Versionen können inkompatible Änderungen enthalten. Im Produktivbetrieb eine exakte Version festlegen.

## Weiterlesen

Details zu den Paketen stehen in [ranui](./packages/ranui/README.de.md) und [ranuts](./packages/ranuts/README.de.md), Live-Beispiele auf der [Dokumentationswebsite](https://ran.chaxus.com/de/). Das Plugin für Coding-Agents und die Hinweise zum Mitwirken finden sich im [englischen README](./README.md).

## Lizenz

[MIT](./LICENSE)
