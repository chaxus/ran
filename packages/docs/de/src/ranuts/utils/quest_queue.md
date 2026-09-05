# QuestQueue

Eine Warteschlange für asynchrone Aufgaben mit begrenzter Nebenläufigkeit. Gleichzeitig laufen höchstens `simultaneous` Aufgaben; der Rest wartet, und jedes Mal, wenn eine fertig ist, wird ein Platz frei. Nimm sie für Uploads oder Anfragen im Bündel — für alles, was du nicht auf einen Schlag losschicken kannst.

## API

### new QuestQueue({ simultaneous })

| Parameter      | Beschreibung                               | Typ      | Standard |
| -------------- | ------------------------------------------ | -------- | -------- |
| `simultaneous` | Höchste Nebenläufigkeit; `<= 0` bedeutet 1 | `number` | `1`      |

| Element                                     | Beschreibung                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `add(task)`                                 | Reiht eine Aufgabe ein und gibt **ihr eigenes** Ergebnis-Promise zurück. Startet, sobald ein Platz frei ist |
| `allSettled(tasks)`                         | Reiht ein Bündel ein; erfüllt sich wie `Promise.allSettled`, in der Reihenfolge der Eingabe                 |
| `onIdle()`                                  | Wartet, bis die Warteschlange leer ist                                                                      |
| `clear()`                                   | Verwirft alles, was noch nicht begonnen hat (laufende Aufgaben bleiben)                                     |
| `running` / `pending` / `executed` / `idle` | Laufende Zähler                                                                                             |

## Beispiel

```js
import { QuestQueue } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 3 });
const results = await Promise.all(urls.map((url) => queue.add(() => fetch(url))));

// Oder losschicken und vergessen, danach auf alles warten, Fehlschläge eingeschlossen
urls.forEach((url) => queue.add(() => fetch(url)).catch(report));
await queue.onIdle();
```

## Hinweise

1. **FIFO**: Die Aufgaben laufen in der Reihenfolge, in der sie eingereiht wurden.
2. **Ein Fehlschlag legt die Warteschlange nicht lahm.** Jede Aufgabe lehnt ihr eigenes Promise ab; die nächste startet trotzdem.
3. **Auch eine Aufgabe, die synchron wirft, wird abgefangen**, sodass sie nicht aus `add()` entwischt und den Zähler der Nebenläufigkeit blockiert.
4. **`allSettled` bewahrt die Reihenfolge der Eingabe** und meldet jedes Ergebnis für sich.

::: warning In 0.3 neu geschrieben
Die frühere Umsetzung war unbrauchbar. `add()` reihte bloß ein (starten musste man von Hand über `running()`); entnommen wurde nach LIFO; ein einziges Promise trug die Ergebnisse fremder Aufgaben; und `allSettled` schrieb die Ergebnisse ab Index 1 und erfüllte sich schon bei der ersten Aufgabe. Die Option `total` des Konstruktors gibt es nicht mehr: nimm stattdessen `onIdle()` oder `allSettled(tasks)`.
:::
