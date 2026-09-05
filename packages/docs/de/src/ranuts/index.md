---
description: 'ranuts ist eine tree-shaking-fähige Utility-Bibliothek für JavaScript/TypeScript: DOM/BOM, Helfer für Zeichenketten, Objekte, Zahlen und Farbe, Speicher, Streaming, eine 2D-Zeichen-Engine und ein virtuelles DOM.'
---

# ranuts

Eine Utility-Bibliothek fürs Frontend und für Node, veröffentlicht als **eigenständige, tree-shaking-fähige Einstiegspunkte**. Importiere aus dem Unterpfad, dem gehört, was du brauchst — der Rest landet nie in deinem Bundle. Alles ist TypeScript, und jeder Export ist aus dem Quelltext dokumentiert.

- **npm**: <a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **Quelltext**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## Einstiegspunkte

| Import                                                | Enthält                                                           | Umgebung           |
| ----------------------------------------------------- | ----------------------------------------------------------------- | ------------------ |
| `ranuts`                                              | Das Wurzel-Barrel: die Fläche aus utils und visual                | Browser + Node     |
| [`ranuts/utils`](/de/src/ranuts/utils/)               | DOM/BOM, Zeichenketten, Objekte, Zahlen, Farbe, Zeit, Speicher, … | Browser + Node\*   |
| [`ranuts/node`](/de/src/ranuts/node/)                 | HTTP-Server, Router, WebSocket, fs, Streams, Middleware           | **nur Node**       |
| [`ranuts/visual`](/de/src/ranuts/visual/)             | 2D-Zeichen-Engine (Canvas / WebGL / WebGPU)                       | **nur Browser**    |
| [`ranuts/i18n`](/de/src/ranuts/i18n/)                 | Übersetzungs-Engine: flache Wörterbücher, Umschalten zur Laufzeit | Browser + Node     |
| [`ranuts/sw`](/de/src/ranuts/sw/)                     | Cache-Strategien und die Worker-Hälfte des Precache-Protokolls    | **Service Worker** |
| [`ranuts/vnode`](/de/src/ranuts/vnode/)               | Virtuelles DOM im Stil von Snabbdom                               | Browser            |
| [`ranuts/stream`](/de/src/ranuts/stream/)             | SSE-Auswertung, Falten von Modellströmen, Token-Budget            | Browser + Node     |
| [`ranuts/conversation`](/de/src/ranuts/conversation/) | Ereignisprotokoll → darstellbare Gesprächsknoten                  | Browser + Node     |

\* `ranuts/utils` ist breit: Das meiste ist auf den Browser hin gebaut, aber die reinen Helfer laufen überall. **Importiere `ranuts/node` nicht in Browser-Code.** Es zieht `fs` / `http` / `child_process` mit.

## Was drin ist

**Funktional**: [debounce](/de/src/ranuts/utils/debounce) · [throttle](/de/src/ranuts/utils/throttle) ·
[once / singleFlight](/de/src/ranuts/utils/memoize) ·
[QuestQueue](/de/src/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/de/src/ranuts/utils/with_timeout) ·
[compose](/de/src/ranuts/utils/compose)

**Daten**: [cloneDeep](/de/src/ranuts/utils/clone_deep) · [isEqual](/de/src/ranuts/utils/is_equal) ·
[merge](/de/src/ranuts/utils/merge) · [filterObj](/de/src/ranuts/utils/filter_obj) ·
[Zahlen formatieren und einlesen](/de/src/ranuts/utils/parse_number) ·
[Farbumrechnung und -mischung](/de/src/ranuts/utils/color)

**Text**: [md5](/de/src/ranuts/utils/md5) · [truncate](/de/src/ranuts/utils/truncate) ·
[detectLanguage](/de/src/ranuts/utils/detect_language) ·
[resolveLocale](/de/src/ranuts/utils/resolve_locale) ·
[segmentByRanges](/de/src/ranuts/utils/segment) · [paginate](/de/src/ranuts/utils/paginate) ·
[escapeHtml](/de/src/ranuts/utils/escape_html)

**Browser**: [Speicher](/de/src/ranuts/utils/local_storage) ·
[IndexedDB](/de/src/ranuts/utils/web_db) · [Worker-Client](/de/src/ranuts/utils/worker_client) ·
[postMessage-Brücke](/de/src/ranuts/bridge/) · [Prefetch](/de/src/ranuts/utils/prefetch) ·
[Geräteerkennung](/de/src/ranuts/utils/current_device) ·
[Leistung](/de/src/ranuts/utils/get_performance) · [ZIP](/de/src/ranuts/utils/zip) ·
[Tonaufnahme](/de/src/ranuts/utils/audio_recorder) ·
[Sprache zu Text](/de/src/ranuts/utils/speech)

**KI und Chat**: [stream](/de/src/ranuts/stream/) · [conversation](/de/src/ranuts/conversation/) ·
[i18n](/de/src/ranuts/i18n/)

**Zeichnen**: [2D-Engine](/de/src/ranuts/visual/) · [virtuelles DOM](/de/src/ranuts/vnode/) ·
[Canvas-Helfer](/de/src/ranuts/utils/canvas) · [tween](/de/src/ranuts/utils/tween)

**Node**: [HTTP-Server und Router](/de/src/ranuts/node/) ·
[Dateioperationen](/de/src/ranuts/file/write_file) ·
[MIME-Typen](/de/src/ranuts/mime_type/mime_type)

Das ist eine Auswahl. Die [API-Referenz](/de/src/ranuts/api) führt **jeden** Export mit Signatur und Beschreibung auf, aus dem Quelltext erzeugt, damit sie nicht auseinanderlaufen kann.

## Wohin als Nächstes

| Wenn du …                                                           | Lies                                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| herausfinden willst, ob es eine Funktion gibt, und wie sie aussieht | [API-Referenz](/de/src/ranuts/api)                                              |
| dich zwischen zwei ähnlichen Helfern entscheiden willst             | [Den passenden Helfer wählen](/de/src/ranuts/choosing/)                         |
| nach Kategorien stöbern willst                                      | [Übersicht der Helfer](/de/src/ranuts/utils/)                                   |
| eine gestreamte Modellantwort darstellen willst                     | [stream](/de/src/ranuts/stream/) → [conversation](/de/src/ranuts/conversation/) |
| eine Oberfläche darauf bauen willst                                 | [ranui](/de/src/ranui/)                                                         |

Beide Pakete liefern im npm-Tarball ein `CLAUDE.md` mit: eine Orientierung für Coding-Agenten, direkt aus `node_modules` lesbar, ohne Netzzugang.
