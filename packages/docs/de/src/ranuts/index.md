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

| Import                                            | Enthält                                                           | Umgebung           |
| ------------------------------------------------- | ----------------------------------------------------------------- | ------------------ |
| `ranuts`                                          | Das Wurzel-Barrel: die Fläche aus utils und visual                | Browser + Node     |
| [`ranuts/utils`](/de/ranuts/utils/)               | DOM/BOM, Zeichenketten, Objekte, Zahlen, Farbe, Zeit, Speicher, … | Browser + Node\*   |
| [`ranuts/visual`](/de/ranuts/visual/)             | 2D-Zeichen-Engine (Canvas / WebGL / WebGPU)                       | **nur Browser**    |
| [`ranuts/i18n`](/de/ranuts/i18n/)                 | Übersetzungs-Engine: flache Wörterbücher, Umschalten zur Laufzeit | Browser + Node     |
| [`ranuts/sw`](/de/ranuts/sw/)                     | Cache-Strategien und die Worker-Hälfte des Precache-Protokolls    | **Service Worker** |
| [`ranuts/vnode`](/de/ranuts/vnode/)               | Virtuelles DOM im Stil von Snabbdom                               | Browser            |
| [`ranuts/stream`](/de/ranuts/stream/)             | SSE-Auswertung, Falten von Modellströmen, Token-Budget            | Browser + Node     |
| [`ranuts/conversation`](/de/ranuts/conversation/) | Ereignisprotokoll → darstellbare Gesprächsknoten                  | Browser + Node     |

## Was drin ist

**Funktional**: [debounce](/de/ranuts/utils/debounce) · [throttle](/de/ranuts/utils/throttle) ·
[once / singleFlight](/de/ranuts/utils/memoize) ·
[QuestQueue](/de/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/de/ranuts/utils/with_timeout) ·
[compose](/de/ranuts/utils/compose)

**Daten**: [cloneDeep](/de/ranuts/utils/clone_deep) · [isEqual](/de/ranuts/utils/is_equal) ·
[merge](/de/ranuts/utils/merge) · [filterObj](/de/ranuts/utils/filter_obj) ·
[Zahlen formatieren und einlesen](/de/ranuts/utils/parse_number) ·
[Farbumrechnung und -mischung](/de/ranuts/utils/color)

**Text**: [truncate](/de/ranuts/utils/truncate) ·
[detectLanguage](/de/ranuts/utils/detect_language) ·
[resolveLocale](/de/ranuts/utils/resolve_locale) ·
[segmentByRanges](/de/ranuts/utils/segment) · [paginate](/de/ranuts/utils/paginate) ·
[escapeHtml](/de/ranuts/utils/escape_html)

**Browser**: [Speicher](/de/ranuts/utils/local_storage) ·
[IndexedDB](/de/ranuts/utils/web_db) · [Worker-Client](/de/ranuts/utils/worker_client) ·
[postMessage-Brücke](/de/ranuts/bridge/) · [Prefetch](/de/ranuts/utils/prefetch) ·
[Geräteerkennung](/de/ranuts/utils/current_device) ·
[Leistung](/de/ranuts/utils/get_performance) · [ZIP](/de/ranuts/utils/zip) ·
[Tonaufnahme](/de/ranuts/utils/audio_recorder) ·
[Sprache zu Text](/de/ranuts/utils/speech)

**KI und Chat**: [stream](/de/ranuts/stream/) · [conversation](/de/ranuts/conversation/) ·
[i18n](/de/ranuts/i18n/)

**Zeichnen**: [2D-Engine](/de/ranuts/visual/) · [virtuelles DOM](/de/ranuts/vnode/) ·
[Canvas-Helfer](/de/ranuts/utils/canvas) · [tween](/de/ranuts/utils/tween)

Das ist eine Auswahl. Die [API-Referenz](/de/ranuts/api) führt **jeden** Export mit Signatur und Beschreibung auf, aus dem Quelltext erzeugt, damit sie nicht auseinanderlaufen kann.

## Wohin als Nächstes

| Wenn du …                                                           | Lies                                                                    |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| herausfinden willst, ob es eine Funktion gibt, und wie sie aussieht | [API-Referenz](/de/ranuts/api)                                          |
| dich zwischen zwei ähnlichen Helfern entscheiden willst             | [Den passenden Helfer wählen](/de/ranuts/choosing/)                     |
| nach Kategorien stöbern willst                                      | [Übersicht der Helfer](/de/ranuts/utils/)                               |
| eine gestreamte Modellantwort darstellen willst                     | [stream](/de/ranuts/stream/) → [conversation](/de/ranuts/conversation/) |
| eine Oberfläche darauf bauen willst                                 | [ranui](/de/ranui/)                                                     |

Beide Pakete liefern im npm-Tarball ein `CLAUDE.md` mit: eine Orientierung für Coding-Agenten, direkt aus `node_modules` lesbar, ohne Netzzugang.
