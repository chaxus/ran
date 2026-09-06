# prefetch

Legt ein großes Asset schon vorgewärmt in den Browser-Cache, bevor es gebraucht wird — ohne hinter dem Rücken der Nutzenden ihr Datenvolumen zu verbrauchen.

Der springende Punkt: Bedient ein Service Worker GET-Anfragen desselben Ursprungs zuerst aus dem Cache, genügt ein einmaliges `fetch` einer URL, damit sie im CacheStorage landet. Jede spätere Anfrage an dieselbe URL trifft den Cache und funktioniert offline. Vorabladen braucht deshalb keinen besonderen Downloader: Es reicht, die Bytes hereinzuholen.

## API

| Funktion                           | Beschreibung                                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `whenIdle(callback, options?)`     | Läuft, wenn der Browser Leerlauf hat; gibt eine Abbruchfunktion zurück                    |
| `networkAllowsDownload(options?)`  | Dürfen wir gerade jetzt fremdes Datenvolumen verbrauchen?                                 |
| `isUrlCached(url)`                 | Liegt diese URL schon im CacheStorage?                                                    |
| `prefetchUrl(url)`                 | Holt eine URL in den Cache; überspringt sie, wenn sie schon da ist, und scheitert lautlos |
| `prefetchUrls(urls, options?)`     | Dasselbe für eine Liste, **nacheinander**                                                 |
| `prefetchWhenIdle(urls, options?)` | Die drei zusammen: erlaubt → Leerlauf → nacheinander vorabladen. Blockiert nicht          |

### Optionen

| Option                 | Gilt für       | Beschreibung                                                                                            | Standard            |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------- | ------------------- |
| `timeout`              | `whenIdle`     | Höchste Wartezeit auf `requestIdleCallback` (ms)                                                        | `8000`              |
| `fallbackDelay`        | `whenIdle`     | Wartezeit, wenn es `requestIdleCallback` nicht gibt (ms)                                                | `2500`              |
| `optOutKey`            | Netz-Erlaubnis | Schlüssel im localStorage; welcher Wert auch immer dort steht, heißt: das Vorabladen wurde abgeschaltet | —                   |
| `slowTypes`            | Netz-Erlaubnis | `effectiveType`-Werte, die als zu langsam gelten                                                        | `['slow-2g', '2g']` |
| `serviceWorkerMessage` | `prefetchUrls` | Der `type` der Nachricht, mit der die Liste an einen steuernden SW geht                                 | —                   |

## Beispiel

```js
import { prefetchWhenIdle, isUrlCached } from 'ranuts';

prefetchWhenIdle(modelFiles, {
  optOutKey: 'disable_model_prefetch',
  serviceWorkerMessage: 'precache-models',
});

// Später: liegt es schon lokal? (die Datei prüfen, die zuletzt fertig lädt)
const ready = await isUrlCached(modelFiles.at(-1));
```

## Hinweise

1. **Vorabladen verbraucht fremdes Datenvolumen.** `networkAllowsDownload` lehnt bei aktivem Datensparmodus ab, bei langsamer Verbindung, oder wenn abgelehnt wurde.
2. **Unbekannt heißt erlaubt.** Die Network Information API gibt es in Safari und Firefox nicht; die Verbindung nicht auslesen zu können ist kein Grund, nie vorabzuladen.
3. **Listen werden nacheinander geholt**: Die Leitung auszureizen würde ausgerechnet die Seite bremsen, die gerade betrachtet wird.
4. **Nimm möglichst den Weg über den Service Worker.** Ein SW mit `event.waitUntil` lädt über Seitenwechsel hinweg weiter; ein Fetch im Hauptthread stirbt, sobald weitergeklickt wird. Ohne steuernden SW wird automatisch ausgewichen.
5. **Prüfe die größte Datei**, wenn du wissen willst, ob ein Satz im Cache liegt — sonst liest sich ein halb fertiger Download als vollständig.
6. **Dass Fehlschläge stumm bleiben, ist Absicht**: Ein misslungenes Vorabladen bedeutet bloß, dass der echte Ladevorgang später herunterlädt.
