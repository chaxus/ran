# WorkerClient

Anfrage und Antwort über einen Web Worker. Ein blanker Worker kennt nur „eine Nachricht senden“ und „eine Nachricht empfangen“: Schickst du zwei Aufgaben gleichzeitig los, kommen zwei Nachrichten zurück, und nichts sagt dir, welche zu welcher gehört. `WorkerClient` stempelt jeder Anfrage eine Kennung auf und leitet jede Antwort an das Promise zurück, das dazugehört.

## API

### new WorkerClient(options)

| Parameter         | Beschreibung                                                    | Typ                 | Standard                  |
| ----------------- | --------------------------------------------------------------- | ------------------- | ------------------------- |
| `create`          | Wie der Worker erzeugt wird                                     | `() => Worker`      | Erforderlich              |
| `isProgress`      | Ist das eine Fortschrittsnachricht? (beendet die Anfrage nicht) | `(res) => boolean`  | `res.type === 'progress'` |
| `getProgress`     | Holt den Inhalt des Fortschritts heraus                         | `(res) => Progress` | `res.progress`            |
| `isError`         | Ist das eine Fehlernachricht?                                   | `(res) => boolean`  | `res.type === 'error'`    |
| `getErrorMessage` | Der Fehlertext                                                  | `(res) => string`   | `res.message`             |
| `timeout`         | Frist je Anfrage (ms); lehnt nur diese eine ab                  | `number`            | keine                     |

| Element                                 | Beschreibung                                     |
| --------------------------------------- | ------------------------------------------------ |
| `send(request, onProgress?, transfer?)` | Schickt eine Anfrage und wartet auf ihre Antwort |
| `dispose()`                             | Beendet den Worker und lehnt alles Laufende ab   |
| `active`                                | Ob der Worker bereits erzeugt wurde              |
| `pendingCount`                          | Wie viele Anfragen gerade laufen                 |

### serveWorker(handler, options?) — die Worker-Seite

Das Gegenstück, das _im_ Worker läuft. Es liest die `operationId` jeder Anfrage aus, wartet auf deinen Handler und schickt die Antwort mit eben dieser Kennung zurück.

| Parameter            | Beschreibung                                                                                        | Typ        |
| -------------------- | --------------------------------------------------------------------------------------------------- | ---------- |
| `handler`            | `(request, { progress }) => Response \| Promise<Response>`                                          | `Function` |
| `options.scope`      | Wo gelauscht wird. Standardmäßig `self`; für einen Port oder einen Test überschreiben               | object     |
| `options.resultType` | Der `type` der Antwort, wenn der Handler etwas zurückgibt, das kein Objekt ist. Standard `'result'` | `string`   |

Gibt eine `stop`-Funktion zurück, die den Listener wieder entfernt.

## Beispiel

```js
import { WorkerClient } from 'ranuts';

const client = new WorkerClient({
  create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
});

await client.send({ type: 'load', modelId }, (p) => renderProgress(p.progress));
const { scores } = await client.send({ type: 'classify', lines });
client.dispose();
```

Und die Worker-Seite:

```js
// nlp.worker.ts
import { serveWorker } from 'ranuts';

serveWorker(async (request, { progress }) => {
  if (request.type === 'load') {
    const device = await loadModel(request.modelId, (p) => progress(p));
    return { type: 'loaded', device };
  }
  return { type: 'result', scores: await classify(request.lines) };
});
```

## Hinweise

1. **Der Worker entsteht erst, wenn er gebraucht wird**, beim ersten `send`: Schwere Arbeit soll nicht schon beim Laden der Seite anlaufen.
2. **Fortschrittsnachrichten beenden die Anfrage nicht**, eine einzelne Anfrage kann also viele Zwischenstände senden und sich am Ende trotzdem genau einmal erfüllen.
3. **Stürzt der Worker ab, werden alle laufenden Anfragen abgelehnt.** Ein nicht abgefangener Fehler im Worker trägt keine `operationId`, lässt sich also keiner einzelnen Anfrage zuordnen.
4. **`dispose()` beendet und lehnt ab**; das nächste `send` baut den Worker neu auf.
5. **Eine abgelaufene Frist lehnt nur diese eine Anfrage ab** und lässt den Worker am Leben.
6. **Nimm für große Puffer `transfer`**, um den Besitz zu übergeben, statt eine Kopie strukturiert zu klonen.
7. **`serveWorker` fängt auch synchron geworfene Fehler ab.** Ein synchroner Wurf innerhalb von `onmessage` entwischt zum Fehler-Handler des Workers, und auf diesem Weg reist keine `operationId` mit — der Client könnte dann nur _alle_ laufenden Anfragen scheitern lassen statt der einen, die tatsächlich kaputtging.
8. **Dass beide Hälften zusammen ausgeliefert werden, hat einen Grund.** Die Worker-Seite selbst zu schreiben ist genau die Stelle, an der das Zurückspiegeln der Kennung und die Hülle für Fehler von Projekt zu Projekt auseinanderdriften.
