# createSignal

Ein Signal in seiner knappsten Form: `[lesen, schreiben]`, auf Wunsch mit einer Meldung über den gemeinsamen Bus [`subscribers`](./sync_hook), sodass auch fremde Module auf eine Änderung reagieren können.

## API

### createSignal(value, options?)

#### Parameter

| Parameter            | Beschreibung                                               | Typ                                          | Standard     |
| -------------------- | ---------------------------------------------------------- | -------------------------------------------- | ------------ |
| `value`              | Anfangswert                                                | `T`                                          | Erforderlich |
| `options.subscriber` | Name des Ereignisses; meldet Änderungen über `subscribers` | `string`                                     | `undefined`  |
| `options.equals`     | Wie entschieden wird, ob sich etwas geändert hat           | `boolean \| ((prev: T, next: T) => boolean)` | `true`       |

Was `equals` bedeutet:

| Wert                 | Verhalten                                                                            |
| -------------------- | ------------------------------------------------------------------------------------ |
| weggelassen / `true` | `Object.is`: Gleichheit nach Referenz oder Wert (das übliche Verhalten von Signalen) |
| `false`              | Jedes Schreiben gilt als Änderung und meldet                                         |
| eine Funktion        | `true` heißt „gleich, keine Meldung“                                                 |

#### Rückgabe

`[getter, setter]`.

## Beispiel

```js
import { createSignal, isEqual, subscribers } from 'ranuts';

const [count, setCount] = createSignal(0, { subscriber: 'count-changed' });
subscribers.tap('count-changed', () => render(count()));

setCount(1); // meldet
setCount(1); // gleicher Wert — keine Meldung

// Den tiefen Vergleich nur dann anfordern, wenn du ihn wirklich brauchst
const [tree, setTree] = createSignal(initial, { equals: isEqual });
```

## Hinweise

1. **Standardmäßig zählt die Referenz.** Ein neu gebautes, innen aber gleiches Objekt _ist_ eine Änderung. Das entspricht dem üblichen Verhalten von Signalen und hält das Schreiben bei O(1).
2. **Den tiefen Vergleich musst du anfordern**, über `{ equals: isEqual }` — so ist sein Preis an der Aufrufstelle zu sehen.
3. **`subscriber` ist freiwillig.** Ohne ihn ist das Signal einfach lokaler Zustand.

::: warning In 0.3 geändert
Zwei Korrekturen, die das Verhalten ändern:

- `{ equals: true }` hieß früher „immer gleich“ und fror das Signal ein, sodass es sich **nie aktualisierte**. Jetzt heißt es „nimm den Standardvergleich“, genau wie `undefined`.
- Bei jedem Schreiben liefen früher zusätzlich zu `equals` noch `cloneDeep` und `isEqual`. Das legte eine Kopie in der Größe der Daten auf den heißen Pfad des Schreibens, und die zusätzliche tiefe Prüfung überstimmte `equals`, sodass `{ equals: false }` („immer melden“) bei innen gleichen Werten stillschweigend nichts tat. Beides ist weg.
  :::
