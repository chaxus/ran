<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Designmethoden, Komponenten und Werkzeuge für Webprodukte, für Entwickler und Coding-Agents.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui auf npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts auf npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="CI-Status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="MIT-Lizenz"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/de/">Dokumentation</a> · <a href="https://ran.chaxus.com/de/src/ranui/">Komponenten</a> · <a href="https://ran.chaxus.com/de/src/agents/">Agents</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <b>Deutsch</b> · <a href="./README.fa.md">فارسی</a></p>

ran besteht aus drei Teilen, die sich einzeln nutzen lassen: **ranui**, UI-Komponenten als native Custom Elements; **ranuts**, typisierte TypeScript-Hilfsfunktionen; und **Ran Design**, Methoden für Layout, Interaktion und Abnahme, die Menschen und Coding-Agents in jedem Stack anwenden können.

- **Funktioniert mit jedem Framework oder ganz ohne.** Jede Komponente ist ein `<r-*>`-Tag, daher nutzen React, Vue, Svelte und eine einfache HTML-Datei sie auf dieselbe Weise. Es gibt keinen Adapter und keine Framework-Laufzeit, ein Script-Tag genügt.
- **Bausteine für KI-Chatoberflächen.** Eine Gesprächsansicht, die gestreamter Ausgabe folgt, Markdown, das halb geschriebenen Text darstellt, Zeilen für Reasoning und Tool-Aufrufe, Anhänge und Spracheingabe. `ranuts/stream` wertet die gestreamte Antwort aus.
- **Themes, Server-Rendering und Typen inklusive.** Helles und dunkles Theme über Design-Tokens, SSR-Hilfen und TypeScript-Deklarationen sind im Paket enthalten.
- **Nur installieren, was gebraucht wird.** Jedes Paket und jede Komponente hat einen eigenen Einstiegspunkt.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/readme-home-dark.webp">
    <img width="800" src="./.github/assets/readme-home.webp" alt="Die Startseite von ran.chaxus.com: links ranui-Markup, rechts ein Live-Panel, das dieselben Buttons, Fortschrittsbalken, Ladeanzeige und Checkbox darstellt">
  </picture>
</p>

## Pakete

| Paket                                    | Wofür                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.de.md)   | Formulare, Dialoge, Tabellen, Markdown, Mediaplayer und KI-Chatansichten als Custom Elements, mit Themes und Hilfen für Server-Rendering.   |
| [ranuts](./packages/ranuts/README.de.md) | Hilfsfunktionen für Strings, Farben, Zeit, Dateien, Speicher und das DOM, dazu SSE-Parsing und Zustand gestreamter Antworten.               |
| [Ran Design](./design/README.md)         | Methoden für Komposition, Interaktion, Bewegung und belegbasierte Abnahme. Wird als Agent-Plugin ausgeliefert und setzt ranui nicht voraus. |

Die Builder- und Reaktivitätsschicht von ranui erscheint separat als [@alixex/ranview](./packages/ranview/README.md).

## Schnellstart

Ohne Build-Schritt eine Komponente von einem CDN laden und das Tag schreiben:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Speichern</r-button>
```

Mit einem Bundler das Paket installieren und die benötigten Komponenten importieren:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui ist im Alpha-Stadium, neue Versionen können inkompatible Änderungen enthalten. Im Produktivbetrieb daher eine exakte Version festlegen. Die [Komponentendokumentation](https://ran.chaxus.com/de/src/ranui/) zeigt Live-Beispiele, Events und Styling für jedes Element.

## Mit einem Coding-Agent nutzen

Das **ran**-Plugin ergänzt Claude Code und Codex um die Skills design, ranui und ranuts. Es braucht weder MCP-Server noch Konto.

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

In einer neuen Sitzung `/ran:design`, `/ran:ranui` oder `/ran:ranuts` in Claude Code bzw. `$design`, `$ranui` oder `$ranuts` in Codex verwenden. Zur Installation aus einem lokalen Checkout siehe den [Agent-Leitfaden](https://ran.chaxus.com/de/src/agents/); die Skills selbst liegen in [plugins/ran](./plugins/ran/).

## Mitwirken

Node 24 oder neuer und die in `package.json` festgelegte pnpm-Version verwenden.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

Vor dem Mitwirken [AGENTS.md](./AGENTS.md) lesen, beim Vorbereiten von Paketen den [Release-Leitfaden](./docs/RELEASING.md).

## Lizenz

[MIT](./LICENSE)
