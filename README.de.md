<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center"><b>Web Components für KI-Chats und Produkt-UI. Ein <code>&lt;r-*&gt;</code>-Tag funktioniert in React, Vue, Svelte oder einer einfachen HTML-Datei gleich.</b></p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui auf npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts auf npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="CI-Status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="MIT-Lizenz"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/de/">Dokumentation</a> · <a href="https://ran.chaxus.com/de/ranui/">Komponenten</a> · <a href="https://ran.chaxus.com/de/agents/">Agents</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <b>Deutsch</b> · <a href="./README.fa.md">فارسی</a></p>

## In Zahlen

|                                                     |       ranui | Shoelace | Web Awesome | Material Web |
| --------------------------------------------------- | ----------: | -------: | ----------: | -----------: |
| Ein Button mit allen Abhängigkeiten und Theme, gzip | **12.4 kB** |  22.5 kB |     41.1 kB |      14.4 kB |
| 1000 Buttons erzeugt und gerendert                  |   **32 ms** |    52 ms |       60 ms |       102 ms |

| ranui allein                                                                   |                  |
| ------------------------------------------------------------------------------ | ---------------: |
| Ein Formular mit fünf Controls (button, input, checkbox, select, modal), gzip  |          41.3 kB |
| Server-Rendering von 140 Elementen zu Declarative Shadow DOM, Node             |           1.5 ms |
| Erster gestylter Paint, servergerendert vs. nur Client (Slow 4G, 4× CPU)       | 424 ms vs 662 ms |
| [ran.chaxus.com](https://ran.chaxus.com/) in Lighthouse mobil: Score, LCP, CLS |     97, 2.5 s, 0 |

<details>
<summary>So wurde gemessen</summary>

- **Direktvergleich:** ranui 0.5.5, Shoelace 2.20.1, Web Awesome 3.14.0 (kostenlos), Material Web 2.5.0, jeweils von npm. Die Größe ist der Button-Einstiegspunkt, gebündelt mit `esbuild --bundle --minify --format=esm`, plus das Theme-Stylesheet, das die Dokumentation der jeweiligen Bibliothek verlangt (Material Web braucht keins), komprimiert mit `gzip -9`. Die Buttons von Web Awesome und Shoelace ziehen ihre Icon- und Spinner-Komponenten mit. Die Zeit ist der Median aus 10 frischen Seiten: 1000 Buttons erzeugen, anhängen, einen Task warten, damit Lit-basierte Komponenten fertig rendern, und das Layout auslesen.
- **Formulargröße:** die fünf Komponenten zusammen importiert aus einem Build von `main` (`3f54e43`) und mit esbuild gebündelt, gezählt wurde jede Datei, die der Browser geladen hat. Einzeln importiert ergeben sie zusammen 74.4 kB, weil sie sich eine Laufzeit teilen.
- **Server-Rendering:** `renderHTMLToString` aus `ranui/ssr-stream` auf einer Seite mit 20 Formularen, Median aus 15 Messungen. Die Ausgabe umfasst 947 kB HTML (125 kB mit gzip), weil jedes Element seine eigenen Styles mitbringt.
- **Erster gestylter Paint:** dieselbe Seite mit 20 Formularen, gzip aktiv, Chromium gedrosselt auf Slow 4G und eine 4× langsamere CPU, Median aus 10 Durchläufen. Servergerendert ist das Formular schon im ersten Paint gestylt; nur im Client erhält es seine Styles, sobald die Komponenten geladen sind. Beim Upgrade verschiebt sich die servergerenderte Seite derzeit mit einem CLS von 0.125.
- **Lighthouse:** Lighthouse 12.8 mit Mobil-Preset, Median aus drei Durchläufen. Die Button-Seite erreicht dieselben Werte (97, LCP 2.3 s, CLS 0).

</details>

ran besteht aus drei Teilen, die sich einzeln nutzen lassen: **ranui**, UI-Komponenten als native Custom Elements; **ranuts**, typisierte TypeScript-Hilfsfunktionen; und **Ran Design**, Methoden für Layout, Interaktion und Abnahme, die Menschen und Coding-Agents in jedem Stack anwenden können.

- **Funktioniert mit jedem Framework oder ganz ohne.** Jede Komponente ist ein `<r-*>`-Tag, daher nutzen React, Vue, Svelte und eine einfache HTML-Datei sie auf dieselbe Weise. Es gibt keinen Adapter und keine Framework-Laufzeit, ein Script-Tag genügt.
- **Bausteine für KI-Chatoberflächen.** Eine Gesprächsansicht, die gestreamter Ausgabe folgt, Markdown, das halb geschriebenen Text darstellt, Zeilen für Reasoning und Tool-Aufrufe, Anhänge und Spracheingabe. `ranuts/stream` wertet die gestreamte Antwort aus.
- **Themes, Server-Rendering und Typen inklusive.** Helles und dunkles Theme über Design-Tokens, SSR-Hilfen und TypeScript-Deklarationen sind im Paket enthalten.
- **Nur installieren, was gebraucht wird.** Jedes Paket und jede Komponente hat einen eigenen Einstiegspunkt.

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

ranui ist im Alpha-Stadium, neue Versionen können inkompatible Änderungen enthalten. Im Produktivbetrieb daher eine exakte Version festlegen. Die [Komponentendokumentation](https://ran.chaxus.com/de/ranui/) zeigt Live-Beispiele, Events und Styling für jedes Element.

## Mit einem Coding-Agent nutzen

Das **ran**-Plugin ergänzt Claude Code und Codex um die Skills design, ranui und ranuts. Es braucht weder MCP-Server noch Konto.

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

In einer neuen Sitzung `/ran:design`, `/ran:ranui` oder `/ran:ranuts` in Claude Code bzw. `$design`, `$ranui` oder `$ranuts` in Codex verwenden. Zur Installation aus einem lokalen Checkout siehe den [Agent-Leitfaden](https://ran.chaxus.com/de/agents/); die Skills selbst liegen in [plugins/ran](./plugins/ran/).

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
