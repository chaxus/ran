# ranui

Framework-unabhängige Web Components mit Shadow DOM, Theme-Tokens und SSR-Helfern.

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | **Deutsch** | [فارسی](./README.fa.md)

## Schnellstart

```sh
npm install ranui@0.5.0
```

Paketimporte verwenden ESM. Importiere mit einem Bundler einzelne Komponenten und lade das gemeinsame Stylesheet einmal im Anwendungseinstieg.

```js
import 'ranui/button';
import 'ranui/input';
import 'ranui/style';
```

Platziere das Custom Element im HTML:

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

## IIFE / CDN

Für ein klassisches script-Tag steht das veröffentlichte eigenständige IIFE bereit; ein Bundler oder Modullader ist nicht nötig.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@0.5.0/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

Das vollständige IIFE liegt unter `dist/index.iife.js`. Verwende auf einer Seite entweder das Gesamtpaket oder die Komponentenpakete, nicht beides.

## TypeScript

Jeder Einstieg enthält Typen. Für optionale Browser-Global- und JSX-Deklarationen verwende einen reinen Typimport:

```ts
import type {} from 'ranui/typings';
```

Wenn TypeScript CSS-Imports auf Seiteneffekte prüft, deklariere den CSS-Einstieg in der `assets.d.ts` deiner Anwendung:

```ts
declare module 'ranui/style';
```

## SSR

Verwende Node 24+ für dieses Serverbeispiel. Komponentenimporte registrieren ihre SSR-Serializer; das Ergebnis enthält Declarative Shadow DOM.

```ts
import { Button } from 'ranui/button';
import { renderToString } from 'ranui/ssr';

const html = renderToString(new Button());
console.log(html);
```

## Theme

Der Theme-Modus wird ausdrücklich aktiviert. Passe Styles über öffentliche Tokens und Parts an; vollständige Regeln und APIs sind unten verlinkt.

```ts
import { initTheme, setTheme } from 'ranui/theme';

initTheme();
setTheme('system');
```

## Dokumentation

[ranui](https://ran.chaxus.com/de/src/ranui/)

- [Komponenten-API](./docs/COMPONENTS.md)
- [Styles und Tokens](./docs/style-tokens-public.md)
- [Design und Interaktion](./docs/DESIGN.md) · [Interaction](./docs/INTERACTION.md)
- [DOM-Builder und Signale](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [Referenz für Maintainer und Agents](./CLAUDE.md)

## Mitwirken

[Referenz für Maintainer und Agents](./CLAUDE.md) · [CODING](./docs/CODING.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## Lizenz

[MIT](./LICENSE)
