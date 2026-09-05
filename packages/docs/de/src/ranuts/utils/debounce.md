# debounce

Entprellen: Wird eine Funktion in schneller Folge ausgelöst, läuft sie **erst, wenn das Auslösen** für `ms` Millisekunden aufhört. Passend, wenn nur der Endzustand zählt: Suche während der Eingabe, Fenstergröße, automatisches Speichern.

Wenn du auch die Zwischenwerte brauchst, nimm [throttle](./throttle).

## API

### debounce(fn, ms?)

#### Parameter

| Parameter | Beschreibung             | Typ        | Standard     |
| --------- | ------------------------ | ---------- | ------------ |
| `fn`      | Zu entprellende Funktion | `Function` | Erforderlich |
| `ms`      | Ruhezeit (ms)            | `number`   | `500`        |

#### Rückgabe

Eine entprellte Funktion, die das `this` der Aufrufstelle und die **letzten** Argumente behält, dazu:

| Element     | Beschreibung                                                     | Typ             |
| ----------- | ---------------------------------------------------------------- | --------------- |
| `cancel()`  | Verwirft den ausstehenden Aufruf                                 | `() => void`    |
| `flush()`   | Führt den ausstehenden Aufruf sofort aus (etwa vor dem Absenden) | `() => void`    |
| `pending()` | Ob ein Aufruf wartet                                             | `() => boolean` |

## Beispiel

```js
import { debounce } from 'ranuts';

const save = debounce((draft) => api.save(draft), 800);
input.addEventListener('input', (e) => save(e.target.value));

form.addEventListener('submit', () => save.flush()); // damit der letzte Tastendruck nicht verloren geht
onUnmount(() => save.cancel());
```

## Hinweise

1. **Nur der letzte Aufruf läuft**, und zwar mit dessen Argumenten.
2. **Das `this` stammt von der Aufrufstelle**: `obj.handler()` sieht `obj`.
3. **Beim Abbau immer `cancel()` aufrufen**, sonst feuert der wartende Timer in einen bereits zerstörten Kontext.
4. **Vollständig typisiert**: Parameter- und Rückgabetypen werden aus `fn` abgeleitet.
