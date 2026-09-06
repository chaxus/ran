# ran — Web-Components-UI-Bibliothek (ranui) und TypeScript-Hilfsmittel (ranuts)

<p align="center">
  <a href="https://ran.chaxus.com/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://ran.chaxus.com/icon.png" alt="ran logo">
  </a>
</p>

<p align="center">
  <strong>Eine frameworkunabhängige UI-Bibliothek aus Web Components auf Basis nativer custom elements (ranui) und eine tree-shaking-fähige TypeScript-Hilfsbibliothek (ranuts) — dazu die Werkzeuge und die zweisprachige Dokumentation (Englisch und Chinesisch) drumherum.</strong>
</p>

<p align="center">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status">
  </a>
  <img src="https://badgen.net/npm/types/ranui" alt="Types Included">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/forks/chaxus/ran" alt="forks">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/stars/chaxus/ran" alt="stars">
  </a>
</p>

<p align="center">
  <a href="#-funktionen">Funktionen</a> •
  <a href="#-pakete">Pakete</a> •
  <a href="#-schnellstart">Schnellstart</a> •
  <a href="#-dokumentation">Dokumentation</a> •
  <a href="#-mitmachen">Mitmachen</a>
</p>

---

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | **Deutsch** | [فارسی](./README.fa.md)

## ✨ Funktionen

- 🎨 **UI-Bibliotheken**: Web Components
- 🛠️ **Hilfsbibliotheken**: Hilfsmittel in TypeScript
- 🤖 **Maschinelles Lernen**: einfache ML-Werkzeuge und Versuche
- 📱 **Webanwendungen**: IM-Chat-Anwendung (Prototyp)
- 🔧 **Entwicklungswerkzeuge**: Build-Werkzeuge und Hilfen zum Debuggen
- 🌐 **Web3**: Versuche mit Smart Contracts
- 🎯 **Visuelle Werkzeuge**: Versuche zur Datenvisualisierung

## 📦 Pakete

Dieses Monorepo versammelt verschiedene experimentelle Pakete:

### Kernbibliotheken (Alpha-Stadium)

| Paket                     | Version                                                                                              | Downloads                                                                                  | Beschreibung                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------- |
| [ranui](packages/ranui)   | [![ranui version](https://img.shields.io/npm/v/ranui.svg?label=%20)](packages/ranui/README.de.md)    | [![npm-d](https://img.shields.io/npm/dt/ranui.svg)](https://www.npmjs.com/package/ranui)   | Bibliothek aus Web Components |
| [ranuts](packages/ranuts) | [![ranuts version](https://img.shields.io/npm/v/ranuts.svg?label=%20)](packages/ranuts/README.de.md) | [![npm-d](https://img.shields.io/npm/dt/ranuts.svg)](https://www.npmjs.com/package/ranuts) | Hilfsbibliothek               |

### Experimentelle Projekte

| Paket                                   | Beschreibung                        |
| --------------------------------------- | ----------------------------------- |
| [im](packages/im)                       | Prototyp einer Chat-Anwendung       |
| [visual](packages/visual)               | Versuche zur Datenvisualisierung    |
| [ranite](packages/ranite)               | Versuche mit Entwicklungswerkzeugen |
| [debug](packages/debug)                 | Hilfen zum Debuggen                 |
| [image-process](packages/image-process) | Versuche zur Bildverarbeitung       |
| [cpro](packages/cpro)                   | Lernen und Ausprobieren in C/C++    |
| [rust](packages/rust)                   | Lernen und Ausprobieren in Rust     |

Welche davon die CI tatsächlich prüft, steht in [packages/manifest.json](packages/manifest.json), und diese Datei wird ausgeführt, statt bloß zu beschreiben: `bin/run-checks.mjs` führt eine Prüfung über alle Pakete aus, die sie deklarieren. Ein Paket, das dort als geprüft geführt wird, ist es also wirklich, und bei einem ungeprüften steht der Grund dabei. `pnpm run verify:packages` schlägt fehl, sobald unter `packages/` ein Verzeichnis auftaucht, das im Manifest fehlt — ein neues Paket kann somit nicht ankommen, ohne dass jemand entscheidet, ob es geprüft wird.

## 🚀 Schnellstart

### Installation

```bash
# Das Repository klonen
git clone https://github.com/chaxus/ran.git
cd ran

# Abhängigkeiten installieren
pnpm install

# Alle Pakete bauen
pnpm build
```

### Die Kernpakete verwenden

```bash
# ranui (Web Components) installieren
npm install ranui

# Die Hilfsmittel installieren
npm install ranuts
```

### Entwicklung

```bash
# Entwicklungsserver starten
pnpm dev

# Tests ausführen
pnpm test

# Ein bestimmtes Paket bauen
pnpm --filter ranui build
```

## 📚 Dokumentation

- **📖 Blog und Artikel**: [Vorschau von Webdokumenten](https://ran.chaxus.com/src/article/doc_preview)
- **🎨 Dokumentation zu RanUI**: [Leitfaden zur UI-Bibliothek](https://ran.chaxus.com/src/ranui/)
- **🛠️ Dokumentation zu RanUTS**: [Leitfaden zur Hilfsbibliothek](https://ran.chaxus.com/src/ranuts/)
- **📝 Projektdokumentation**: [docs](packages/docs)

## 🤖 KI / Claude Code

Das Repository bringt einen Claude-Code-Plugin-Marketplace mit, damit KI-Assistenten die Bibliotheken lesen und benutzen können, ohne sich durch den Quelltext zu graben. Füge den Marketplace hinzu und installiere dann die Bibliothek, die du verwendest:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran      # ranui — Web Components
/plugin install ranuts@ran     # ranuts — Hilfsmittel
```

Jede Skill behandelt die Import-Map, ein Verzeichnis der Bestandteile, Anwendungsbeispiele und die Konventionen und verweist auf die API-Referenz, die im jeweiligen Paket mitgeliefert wird. Einzelheiten stehen im Abschnitt der jeweiligen Bibliothek: [ranui](packages/ranui/README.de.md) und [ranuts](packages/ranuts/README.de.md).

## ⚠️ Wichtiger Hinweis

Dies ist ein **Projekt zum Erkunden von Technik und zum Lernen**, noch in früher Entwicklung. Die meisten Pakete stehen im Alpha-Stadium oder sind experimentell.

**Das Wichtigste:**

- 🚧 **Frühe Entwicklung**: die meisten Funktionen entstehen noch
- 🧪 **Experimentell**: APIs können sich häufig ändern
- 📚 **Zum Lernen gedacht**: vor allem zum Lernen und Ausprobieren

## 🤝 Mitmachen

Beiträge von Lernenden wie von Entwicklerinnen und Entwicklern sind willkommen. So kannst du helfen:

1. Das Repository **forken**
2. Einen Branch für die Funktion **anlegen** (`git checkout -b feature/amazing-feature`)
3. Die Änderungen **committen** (`git commit -m 'Add amazing feature'`)
4. Den Branch **pushen** (`git push origin feature/amazing-feature`)
5. Einen Pull Request **eröffnen**

### Hinweise zur Entwicklung

- Halte dich an den vorhandenen Stil des Codes
- Ergänze nach Möglichkeit Tests für neue Funktionen
- Aktualisiere die Dokumentation, wo es nötig ist
- Sei geduldig mit dem, was noch experimentell ist

## 🌟 Warum quelloffen?

Ich glaube daran, dass quelloffene Arbeit Lernen und Erneuerung beschleunigt. Auf meinem Weg als Entwickler haben mich unzählige quelloffene Projekte geprägt. Indem ich diesen experimentellen Code öffne, hoffe ich:

- Erfahrungen aus dem Lernen mit der Gemeinschaft zu teilen
- anderen zu ermöglichen, an diesem Code zu lernen und damit zu experimentieren
- Zusammenarbeit und den Austausch von Wissen zu fördern
- einen Ort für fortwährendes Lernen und Verbessern zu schaffen

## 📊 Projektstatistik

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" alt="Contributors" />
</a>

![](http://profile-counter.glitch.me/chaxus-ran/count.svg)

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz — Einzelheiten stehen in der Datei [LICENSE](LICENSE).

---

<div align="center">
  <p>Mit ❤️ von der Ran-Gemeinschaft gemacht</p>
  <p>Wenn dir das Projekt beim Lernen hilft, gib ihm gern einen ⭐️</p>
</div>
