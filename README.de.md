<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">UI-Komponenten und TypeScript-Werkzeuge für Webanwendungen.</p>
<p align="center"><a href="https://ran.chaxus.com/de/">Dokumentation</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <b>Deutsch</b> · <a href="./README.fa.md">فارسی</a></p>

ran ist eine Sammlung von Bibliotheken zum Erstellen von Weboberflächen. Mit fertigen HTML-Komponenten lassen sich Formulare, Dashboards und Inhaltsseiten bauen. Dazu kommen Hilfsfunktionen für Browser und Datenverarbeitung sowie reaktive DOM-Ansichten direkt in TypeScript.

Jedes Paket lässt sich einzeln installieren. Die [Dokumentationswebsite](./packages/docs/) und die [IM-Demo](./packages/im/) zeigen ihr Zusammenspiel in vollständigen Anwendungen.

## Ein Paket auswählen

| Paket                                           | Was sich damit bauen lässt                                                                                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.de.md)          | Oberflächen aus eigenen HTML-Elementen: Eingaben, Auswahllisten, Dialoge, Tabellen, Markdown und Mediaplayer. Mit Themes und Hilfen für serverseitiges Rendering. |
| [ranuts](./packages/ranuts/README.de.md)        | Browser- und Datenabläufe: Farb- und Binärkonvertierung, Speicherzugriff, SSE-Verarbeitung und Zustände gestreamter Antworten.                                    |
| [@alixex/ranview](./packages/ranview/README.md) | DOM-Ansichten mit verkettbaren Buildern und reaktiven Signalen; statische HTML-Ausgaben für serverseitiges Rendering.                                             |

## ranui ausprobieren

In einer Browseranwendung mit einem ESM-kompatiblen Bundler installieren:

```sh
npm install ranui
```

Diesen Code im JavaScript-Einstiegspunkt der Anwendung ergänzen. Er erzeugt einen Button, der auf einen Klick reagiert:

```js
import 'ranui/button';
import 'ranui/style';

const button = document.createElement('r-button');
button.setAttribute('type', 'primary');
button.textContent = 'Speichern';
button.addEventListener('click', () => {
  button.textContent = 'Gespeichert';
});
document.body.append(button);
```

Die Komponenten nutzen Custom Elements und standardmäßige Browserereignisse; eine React- oder Vue-Laufzeit ist nicht erforderlich. Weitere Komponenten werden über eigene Einstiegspunkte wie `ranui/input` importiert. Die [Komponentenbeispiele](https://ran.chaxus.com/de/src/ranui/) zeigen Markup, Ereignisse und Anpassungen. Ohne Bundler hilft das [Beispiel mit eigenständigem Skript](./packages/ranui/README.de.md#iife--cdn).

## Am Repository arbeiten

Node 24+ und pnpm 11.6.0 verwenden.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

Die Paketverzeichnisse enthalten eigene Anleitungen und Beispiele. Vor Beiträgen die [Repository-Regeln](./AGENTS.md) lesen; zum Vorbereiten von Paketen die [Release-Anleitung](./docs/RELEASING.md) nutzen.

## Lizenz

[MIT](./LICENSE)
