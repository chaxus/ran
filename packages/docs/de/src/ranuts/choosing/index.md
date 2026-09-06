---
description: 'Zu welchem ranuts-Werkzeug greifen: debounce oder throttle, once oder singleFlight, localStorage oder IndexedDB, eine Brücke oder ein Worker-Client – und wann die Plattform es schon mitbringt.'
---

# Das passende Werkzeug wählen

Die [API-Referenz](/de/src/ranuts/api) führt jeden Export auf. Diese Seite beantwortet die Frage, die dort offenbleibt: **Welches von zwei ähnlichen Dingen will ich, und warum?**

> **Nimm sie**, wenn du ungefähr weißt, was du brauchst („das soll seltener laufen“, „nur einmal“, „das speichern“, „mit einem Worker reden“), aber nicht, welcher Export das erledigt.

## Zuerst: hat die Plattform das nicht schon?

ranuts will die Standardbibliothek nicht ersetzen. Greif zuerst zur Plattform und nimm ein Werkzeug erst dann, wenn es wirklich etwas hinzufügt:

| Statt…                     | Die Plattform hat schon…    | Nimm die von ranuts, wenn…                                                                                                                                                                   |
| -------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloneDeep(value)`         | `structuredClone(value)`    | Der Wert enthält Funktionen oder sonst etwas, das `structuredClone` verweigert: Jenes wirft einen `DataCloneError`, während `cloneDeep` kopiert, was geht, und den Rest per Referenz behält. |
| `getAllQueryString(url)`   | `new URL(url).searchParams` | Du willst mit einem Aufruf ein schlichtes Objekt statt eines Iterators.                                                                                                                      |
| `localStorageGetItem(key)` | `localStorage.getItem(key)` | Der Code läuft auch dort, wo es keinen Speicher gibt oder er blockiert ist: Die Hüllen geben `''` zurück, statt zu werfen (Safaris privater Modus, SSR, ein iframe im Sandkasten).           |
| `escapeHtml(str)`          | `textContent = str`         | Du baust eine Zeichenkette zusammen, keinen Knoten.                                                                                                                                          |

## Etwas seltener tun

„Ruf das seltener auf“ kann vier verschiedene Dinge heißen:

| Du willst…                                                                                    | Nimm               | Verhalten                                                                                      |
| --------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| Nur den **letzten** Aufruf einer Salve (ein Suchfeld, eine Größenänderung)                    | `debounce(fn, ms)` | Läuft `ms` nachdem die Salve endet. Währenddessen läuft gar nichts.                            |
| Einen **gleichmäßigen Takt** während der Salve (Scrollposition, eine Fortschrittsanzeige)     | `throttle(fn, ms)` | Der erste Aufruf läuft sofort, danach höchstens einer je `ms`.                                 |
| Dass es **genau einmal** läuft, ein Leben lang (eine Initialisierung, eine einmalige Warnung) | `once(fn)`         | Der erste Aufruf rechnet, jeder spätere gibt genau dieses Ergebnis zurück.                     |
| Dass gleichzeitige Aufrufer sich **eine laufende Anfrage teilen**                             | `singleFlight(fn)` | Die asynchrone Spielart von once: Solange ein Aufruf noch aussteht, hängen sich weitere daran. |

**`memoize` ist der frühere Name von `once`** und tut genau dasselbe: Es legt kein Ergebnis je Argument ab, was der Name nahelegt. Neuer Code sollte `once` schreiben.

Der Unterschied, auf den es ankommt: Mit `debounce` an einem Tastatur-Handler läuft nichts, solange getippt wird; mit `throttle` läuft die ganze Zeit etwas, nur eben nicht bei jedem Anschlag. Ein Suchvorschlag will `debounce`, ein Zähler für „verbleibende Zeichen“ will `throttle`.

## Asynchrone Arbeit im Zaum halten

| Du willst…                                                                      | Nimm                                         |
| ------------------------------------------------------------------------------- | -------------------------------------------- |
| Viele Aufgaben laufen lassen, aber nur _n_ zur selben Zeit                      | `new QuestQueue({ simultaneous: n })`        |
| Ein Promise aufgeben, das zu lange braucht                                      | `withTimeout(promise, ms)`                   |
| …und statt zu werfen mit einem Vorgabewert weitermachen                         | `withTimeoutFallback(promise, ms, fallback)` |
| Ein Promise, das du von ganz woanders auflöst                                   | `deferred()`                                 |
| Asynchrone Schritte nach Koa-Art verketten, jeder kann den nächsten umschließen | `compose(middleware)`                        |

`Promise.all` ist richtig, wenn du _alle_ auf einmal willst; `QuestQueue` ist richtig, wenn „alle auf einmal“ sechzig Verbindungen öffnen würde. `withTimeout` lehnt ab: Stell ihm ein `catch` zur Seite, oder nimm die Fassung mit Ersatzwert, wenn ein Zeitablauf für dich kein Fehler ist.

## Etwas ablegen

| Lebensdauer und Größe                                           | Nimm                                                                     |
| --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Eine kurze Zeichenkette, die das Neuladen übersteht             | `localStorageSetItem` / `localStorageGetItem` / `localStorageRemoveItem` |
| Strukturierte Daten, viele Datensätze oder mehr als ein paar MB | `new WebDB({ dbName, stores })`: eine Promise-Hülle über IndexedDB       |
| Einen Wert, der **von dieser Seite zur nächsten** gereicht wird | `createHandoff({ dbName, storeName, key })`                              |

Die `localStorage*`-Hüllen gibt es, weil die nativen Aufrufe dort **werfen**, wo kein Speicher verfügbar ist (Safaris privater Modus, ein iframe im Sandkasten, ein Browser mit blockierten Website-Daten) – und ein Absturz beim Lesen ist ein schlimmerer Fehler als eine fehlende Einstellung. Die Hüllen geben `''` zurück und machen weiter.

`createHandoff` ist für den Fall, in dem keines der beiden anderen passt: ein Wert, der genau einen Seitenwechsel überstehen und dann verschwunden sein soll.

## Über Kontextgrenzen hinweg reden

| Zwischen…                                             | Nimm                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| Eine Seite und ein Web Worker, Anfrage und Antwort    | `new WorkerClient({ create })`: ordnet Antworten über die Anfrage-ID zu  |
| Zwei beliebige Enden eines `MessagePort`              | `createPortBridge(port)`                                                 |
| Zwei Fenster oder iframes, die einander finden müssen | `acceptPortBridge()` auf der einen Seite, der Handschlag auf der anderen |

`WorkerClient` ist das Richtige, wenn der Worker Fragen beantwortet: Ohne Anfrage-IDs können zwei sich überlappende Aufrufe nicht unterscheiden, wessen Antwort gerade eingetroffen ist. Eine Brücke liegt eine Ebene tiefer: Nimm sie, wenn der Verkehr nicht aus Anfrage und Antwort besteht oder wenn der Transportweg schon da ist.

## Mit Objekten arbeiten

| Du willst…                                    | Nimm                   | Hinweis                                                                         |
| --------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| Eine Kopie, die sich mit nichts anderem teilt | `cloneDeep(value)`     | Kommt mit Ringbezügen und den gängigen eingebauten Typen zurecht.               |
| Wissen, ob zwei Werte gleich sind             | `isEqual(a, b)`        | Tiefer Vergleich, nicht Gleichheit der Referenz.                                |
| Zwei Objekte zusammenführen                   | `merge(a, b)`          | Flaches Zusammenführen: Die Schlüssel von `b` gewinnen, und `a` wird verändert. |
| Einige Schlüssel weglassen                    | `filterObj(obj, keys)` | Gibt eine Kopie ohne die genannten Schlüssel zurück.                            |

## Sprache und Text

- **`resolveLocale({ supported, … })`** wählt, welche _deiner_ Sprachen genommen wird, entlang der üblichen Kette (eine ausdrückliche Wahl, der Speicher, `navigator.languages`, ein Rückfallwert). Es beantwortet „welche Sprache“, nicht „was sagt diese Zeichenkette“.
- **`createI18n` / `useI18n`** ([`ranuts/i18n`](/de/src/ranuts/i18n/)) ist die Übersetzungsmaschine: flache Wörterbücher, Einsetzen über `{param}`, Umschalten zur Laufzeit.
- **`segmentByRanges`** und **`paginateText`** dienen dem Setzen von Text: das eine für Positionen und Hervorhebungen, das andere fürs Zerteilen in Seiten, die in einen Kasten passen.

Nimm `resolveLocale` auch dann, wenn du die i18n-Maschine nicht benutzt: Die Entscheidung, die es trifft – die geordnete Liste `navigator.languages` des Lesers ganz zu achten und nicht nur ihren ersten Eintrag –, ist genau der Teil, den man leicht falsch macht.

## Eine Modellantwort streamen

Drei Schichten, jede auch für sich brauchbar:

1. **[`ranuts/stream`](/de/src/ranuts/stream/)**: liest SSE und faltet die Teilstücke mit `createStreamAccumulator()` zu einer Momentaufnahme zusammen. Anbieterneutral: Teilstücke von Text, Gedankengang und Werkzeugaufrufen landen in derselben Form, gleich von wem sie kommen.
2. **[`ranuts/conversation`](/de/src/ranuts/conversation/)**: bildet ein nur wachsendes Ereignisprotokoll mit `createConversationEngine()` auf darstellbare Knoten ab. Es entscheidet, _was_ eine Zeile ist; gezeichnet wird nichts.
3. **[`<r-conversation>`](/de/src/ranui/conversation/)** in ranui: das Element, das jene Knoten zeichnet, die Ansicht am unteren Rand festhält und Zeilen abgleicht.

Bleib bei Schicht 1, wenn du nur Text darstellst; nimm 2 dazu, sobald ein Verlauf eine Struktur hat, die sich abzubilden lohnt; nimm 3 dazu, wenn dir das Scrollen und der Abgleich abgenommen werden sollen.

## Aus welchem Einstiegspunkt importieren

Jeder Unterpfad ist ein eigenständiges Sammelmodul, aus dem sich Ungenutztes entfernen lässt. Importiere aus demjenigen, dem das Symbol gehört, nie aus einem tiefen Quellpfad.

| Import                | Enthält                                                           | Läuft wo           |
| --------------------- | ----------------------------------------------------------------- | ------------------ |
| `ranuts`              | Sammelmodul der Wurzel: die Werkzeuge und die visual-Oberfläche   | Browser + Node     |
| `ranuts/utils`        | DOM/BOM, Zeichenketten, Objekte, Zahlen, Farbe, Zeit, Speicher, … | Browser + Node\*   |
| `ranuts/node`         | HTTP-Server, Router, WebSocket, fs, Streams, Middleware           | **nur Node**       |
| `ranuts/visual`       | Die 2D-Rendermaschine (Canvas / WebGL / WebGPU)                   | **nur Browser**    |
| `ranuts/i18n`         | Die Übersetzungsmaschine, ohne DOM                                | Browser + Node     |
| `ranuts/sw`           | Cache-Strategien und die Worker-Hälfte des Vorab-Cache-Protokolls | **Service Worker** |
| `ranuts/vnode`        | Virtuelles DOM nach Art von Snabbdom                              | Browser            |
| `ranuts/stream`       | SSE lesen, Modellstrom falten, Token-Budget                       | Browser + Node     |
| `ranuts/conversation` | Vom Ereignisprotokoll zu darstellbaren Gesprächsknoten            | Browser + Node     |

\* `ranuts/utils` ist breit: Das meiste ist auf den Browser hin gedacht, aber die reinen Helfer (Zeichenketten, Objekte, Zahlen, `compose`, `cloneDeep`, …) laufen überall. **Importiere `ranuts/node` nicht in Browser-Code.** Es zieht `fs`, `http` und `child_process` herein.

## Immer noch unschlüssig?

Durchsuch die [API-Referenz](/de/src/ranuts/api): Jeder Export steht dort mit seiner Signatur und einer Zeile Beschreibung, erzeugt aus dem Quelltext. Wenn zwei davon auch nach dem Lesen beider Zeilen noch austauschbar wirken, ist das ein Dokumentationsfehler, den zu [melden](https://github.com/chaxus/ran/issues) sich lohnt.
