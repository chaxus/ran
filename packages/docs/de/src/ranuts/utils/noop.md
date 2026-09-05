# noop

Eine leere Funktion, die nichts tut. Üblich als Standard-Callback oder als Platzhalter.

## API

### noop

#### Rückgabe

| Argument | Beschreibung      | Typ    |
| -------- | ----------------- | ------ |
| `void`   | Kein Rückgabewert | `void` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { noop } from 'ranuts';

// Als Standard-Callback
const callback = noop;
callback(); // Tut nichts
```

### Als Standardwert eines Parameters

```js
import { noop } from 'ranuts';

function processData(data, onSuccess = noop, onError = noop) {
  try {
    // Daten verarbeiten
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// Nur der Erfolgs-Callback wird übergeben
processData({ id: 1 }, (data) => {
  console.log('Erfolg:', data);
});

// Gar kein Callback
processData({ id: 2 }); // Wirft keinen Fehler
```

### Callback unter Vorbehalt

```js
import { noop } from 'ranuts';

const handleClick = isEnabled
  ? () => {
      console.log('Aktion ausführen');
    }
  : noop;

button.addEventListener('click', handleClick);
```

### Platzhalter für einen Event-Listener

```js
import { noop } from 'ranuts';

const unsubscribe = someService.subscribe(noop); // Vorerst werden keine Ereignisse behandelt
```

## Hinweise

1. **Kosten**: Der Aufruf einer leeren Funktion kostet fast nichts und eignet sich daher als Standardwert.
2. **Typsicherheit**: In TypeScript hat `noop` den Typ `() => void` und passt überall dorthin, wo eine Funktion erwartet wird.
3. **Lesbarkeit**: `noop` sagt deutlicher als `() => {}`, dass hier absichtlich nichts geschieht.
