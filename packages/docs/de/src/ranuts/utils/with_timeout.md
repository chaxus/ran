# withTimeout / deferred

Promise-Bausteine, die JavaScript nicht mitbringt: ein von außen entschiedenes Promise und ein begrenztes Warten.

## API

| Funktion                                                 | Beschreibung                                                         |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| `deferred<T>()`                                          | `{ promise, resolve, reject }`, von außen zu entscheiden             |
| `withTimeout(promise, ms, options?)`                     | Lehnt mit `TimeoutError` ab, wenn binnen `ms` nichts entschieden ist |
| `withTimeoutFallback(promise, ms, fallback, onTimeout?)` | Erfüllt mit `fallback`, statt abzulehnen                             |
| `delay(ms)`                                              | Erfüllt sich nach `ms`                                               |
| `TimeoutError`                                           | Die Fehlerklasse, die `withTimeout` wirft                            |

### `withTimeout` options

| Option      | Beschreibung                                                    | Standard                           |
| ----------- | --------------------------------------------------------------- | ---------------------------------- |
| `message`   | Fehlermeldung                                                   | `operation timed out after {ms}ms` |
| `onTimeout` | Wird beim Ablauf der Frist aufgerufen, um den Vorgang abzubauen | —                                  |

## Beispiel

### Eine Anfrage begrenzen und bei Ablauf abbrechen

```js
import { withTimeout } from 'ranuts';

const controller = new AbortController();
const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
  message: 'fetch timed out',
  onTimeout: () => controller.abort(),
});
```

### Lieber abspecken als scheitern

```js
import { withTimeoutFallback } from 'ranuts';

// Ein langsames Speichern soll die ursprüngliche Datei zurückgeben, nicht den Ablauf zerreißen.
const file = await withTimeoutFallback(editor.requestSave(), 60_000, originalFile);
```

### Ein Promise aus einem Callback heraus entscheiden

```js
import { deferred } from 'ranuts';

const ready = deferred();
sdk.onReady((editor) => ready.resolve(editor));
sdk.onError((error) => ready.reject(error));

const editor = await ready.promise;
```

### Vorgänge mit Frist hintereinander abarbeiten

```js
import { QuestQueue, withTimeout } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 1 });
await queue.add(() => withTimeout(recreateEditor(config), 30_000));
```

## Hinweise

1. **Der Timer wird immer aufgeräumt**, auch dann, wenn die Arbeit das Rennen gewinnt. Die übliche selbstgebaute Fassung (`Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])`) lässt den Timer jedes Mal liegen, wenn die Aufgabe zuerst fertig ist. In Node hält das den Prozess bis zum Ende der Frist am Leben; in Tests bleibt ein verirrter Timer zurück, der in den nächsten Test hineinfeuert.

2. **Eine abgelaufene Frist bricht die Arbeit nicht ab.** Ein Promise lässt sich nicht abbrechen. `onTimeout` ist der Ort, an dem du den Fetch abbrichst, den Worker beendest oder die Verbindung schließt.

3. **`withTimeoutFallback` schluckt nur die Frist.** Eine echte Ablehnung des umhüllten Promise wird weiterhin durchgereicht: Ein Fristablauf ist kein Fehler, aber ein Fehler bleibt einer.

4. **`delay` nutzt das blanke `setTimeout`** und läuft daher in Node, in Web Workers und im Browser gleichermaßen. `window.setTimeout` würde außerhalb eines Dokuments werfen.

5. **`deferred` schlägt äußere `let`s.** Die Argumente des Executors außen deklarierten Variablen zuzuweisen ist die verbreitete Alternative; TypeScript kann nicht beweisen, dass sie zugewiesen sind, und man vertut sich dabei leicht auf unauffällige Weise.
