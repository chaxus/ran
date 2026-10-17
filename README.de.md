# ran

<p align="center">
  <a href="https://ran.chaxus.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
      <img width="120" src="./packages/docs/public/icon.png" alt="ran">
    </picture>
  </a>
</p>

Web Components, DOM-Builder und TypeScript-Werkzeuge in einem Workspace.

[![CI](https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml)](https://github.com/chaxus/ran/actions/workflows/ci.yml) · [MIT](./LICENSE)

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | **Deutsch** | [فارسی](./README.fa.md)

> Alpha: APIs und Paketformate können sich ändern. Fixiere eine konkrete Version und lies vor Updates den Migrationsleitfaden.

## Pakete

| Paket                                         | Einsatz                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| [ranui](packages/ranui/README.de.md)          | Framework-unabhängige Web Components mit Shadow DOM, Theme-Tokens und SSR-Helfern.  |
| [ranuts](packages/ranuts/README.de.md)        | TypeScript-Werkzeuge für Browser-APIs, Datenverarbeitung, Streams und 2D-Rendering. |
| [@alixex/ranview](packages/ranview/README.md) | DOM-Builder, Signale und statische HTML-Snapshots ohne Komponentenbibliothek.       |

## Schnellstart

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

Platziere das Custom Element im HTML:

```html
<r-button type="primary">Hello</r-button>
```

## Dokumentation

- [ranui](https://ran.chaxus.com/de/src/ranui/)
- [ranuts](https://ran.chaxus.com/de/src/ranuts/)
- [@alixex/ranview](packages/ranview/README.md)
- [Migrationsleitfaden](https://ran.chaxus.com/de/src/ranuts/migration/)

## Entwicklung im Repository

Verwende Node 24+ und pnpm. Führe die Befehle im Repository-Stamm aus:

```sh
git clone https://github.com/chaxus/ran.git
cd ran
pnpm install --frozen-lockfile
pnpm build
pnpm --filter ranui dev
```

Weitere Entwicklungsbefehle:

```sh
pnpm --filter docs dev
pnpm test
pnpm lint
pnpm verify:docs
pnpm clean
```

`pnpm clean` entfernt generierte Dateien und behält Quellcode, installierte Abhängigkeiten und Lockdateien.

## Weitere Projekte und Lernmaterial

Dokumentationswerkzeuge: [docs](packages/docs), [ranpress](packages/ranpress) und [site](packages/site). [im](packages/im) ist eine experimentelle Chat-Anwendung.

Native Beispiele: [C/C++](packages/cpro), [Bildverarbeitung](packages/image-process) und [Rust](packages/rust). Lernmaterial: [Shader](docs/learning/visual/README.md) und [Koa/Nginx](docs/learning/debug/README.md).

Workspace-Status und CI-Prüfungen stehen in [packages/manifest.json](packages/manifest.json).

## AI / Claude Code

[Referenz für Maintainer und Agents](packages/ranui/CLAUDE.md) · [ranuts](packages/ranuts/CLAUDE.md)

```text
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
/plugin install ranuts@ran
```

## Mitwirken

Lies [AGENTS.md](AGENTS.md) für Zuständigkeiten und Prüfungen. Halte Beispiele mit öffentlichen Exporten konsistent und führe die passenden Prüfungen aus.

## Lizenz

[MIT](./LICENSE)
