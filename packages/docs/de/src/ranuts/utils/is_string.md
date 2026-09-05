# isString

Stellt fest, ob ein Wert vom Typ Zeichenkette ist.

## API

### isString

#### Rückgabe

| Argument | Beschreibung | Typ |
| --------- | ---------------------- | --------- |
| `boolean` | Ob es eine Zeichenkette ist | `boolean` |

#### Parameter

| Parameter | Beschreibung | Typ | Standard |
| --------- | -------------- | --------- | -------- |
| `obj` | Zu prüfender Wert | `unknown` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { isString } from 'ranuts';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
```

### Typprüfung

```js
import { isString } from 'ranuts';

function processValue(value) {
  if (isString(value)) {
    console.log('Ist eine Zeichenkette:', value.toUpperCase());
  } else {
    console.log('Keine Zeichenkette');
  }
}

processValue('hello'); // 'Ist eine Zeichenkette: HELLO'
processValue(123); // 'Keine Zeichenkette'
```

### Argumente prüfen

```js
import { isString } from 'ranuts';

function validateInput(input) {
  if (!isString(input)) {
    throw new Error('Die Eingabe muss eine Zeichenkette sein');
  }
  return input.trim();
}
```

## Hinweise

1. **Typerkennung**: nutzt `Object.prototype.toString.call()` und unterscheidet damit genau.
2. **Strenge**: `true` kommt nur zurück, wenn der Wert wirklich vom Typ Zeichenkette ist; andere Typen (auch String-Objekte) ergeben `false`.
3. **Einsatz**: üblich beim Prüfen von Typen, beim Validieren von Argumenten und Ähnlichem.
