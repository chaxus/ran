# once / singleFlight

Führt etwas **genau einmal** aus und verwendet das Ergebnis weiter: verzögerte Initialisierung beim Auswerten einer Konfiguration, eine teure einmalige Berechnung, träge Getter. `once` ist synchron, `singleFlight` das asynchrone Gegenstück.

## API

### once(fn)

| Parameter | Beschreibung                                                                    | Typ               | Standard     |
| --------- | ------------------------------------------------------------------------------- | ----------------- | ------------ |
| `fn`      | Einmal auszuführende Funktion; was keine Funktion ist, kommt unverändert zurück | `Function \| any` | Erforderlich |

Zurück kommt eine umhüllte Funktion. Der erste Aufruf wertet aus und merkt sich das Ergebnis; jeder spätere gibt eben dieses zurück, **mit welchen Argumenten auch immer**.

### singleFlight(fn)

| Parameter | Beschreibung                             | Typ                | Standard     |
| --------- | ---------------------------------------- | ------------------ | ------------ |
| `fn`      | Einmal auszuführende asynchrone Funktion | `() => Promise<T>` | Erforderlich |

Zurück kommt eine umhüllte Funktion, dazu:

| Element   | Beschreibung                                                                  | Typ          |
| --------- | ----------------------------------------------------------------------------- | ------------ |
| `reset()` | Verwirft das gemerkte Ergebnis, damit der nächste Aufruf `fn` erneut ausführt | `() => void` |
| `started` | Ob ein Ergebnis vorliegt oder gerade gearbeitet wird                          | `boolean`    |

### memoize(fn)

Veralteter Zweitname von `once`. Siehe die Warnung unten.

## Beispiel

```js
import { once, singleFlight } from 'ranuts';

// Synchron: die Konfiguration wird erst beim ersten Zugriff ausgewertet
const config = once(() => JSON.parse(rawConfig));
config(); // wertet aus
config(); // liefert das Gemerkte

// Asynchron: die Datenbank wird einmal geöffnet, egal wie viele Aufrufer sich drängeln
const ready = singleFlight(() => db.openDataBase());
await Promise.all([ready(), ready(), ready()]); // öffnet einmal
```

## Hinweise

1. **`once` merkt sich nichts je Argument.** Nur die Argumente des ersten Aufrufs zählen. Brauchst du einen Zwischenspeicher je Argument, nimm selbst eine `Map`.
2. **`once` gibt `fn` nach dem Auswerten frei**, sodass alles, was diese Funktion festhielt, eingesammelt werden kann.
3. **`singleFlight` merkt sich keine Ablehnungen.** Ein fehlgeschlagener Versuch löscht den Speicher, damit ein kurzes Zucken des Netzes wiederholbar bleibt. Ein abgelehntes Promise zu merken würde einen Augenblicksfehler dauerhaft machen.
4. **Gleichzeitige Aufrufer von `singleFlight` teilen sich das laufende Promise**, `fn` läuft also auch dann einmal, wenn N Aufrufer sich drängeln. Das ist die Antwort auf den Klassiker „init() gibt void zurück, die Aufrufer können also nicht darauf warten, und frühe Schreibvorgänge scheitern“.

::: warning In 0.3 umbenannt
`memoize` war ein irreführender Name: Es hat nie je Argument gemerkt, es lief bloß einmal. Jetzt ist es ein Zweitname von `once` und gilt als veraltet. Auch die Typsignatur war früher falsch (als argumentlos deklariert, obwohl sie Argumente durchreichte); jetzt wird sie aus `fn` abgeleitet.
:::
