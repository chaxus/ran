# isSafari

Stellt fest, ob der aktuelle Browser Safari ist.

## API

### isSafari

#### Rückgabe

| Argument                         | Beschreibung                 | Typ                              |
| -------------------------------- | ---------------------------- | -------------------------------- |
| `boolean \| undefined \| string` | Ob es der Safari-Browser ist | `boolean \| undefined \| string` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { isSafari } from 'ranuts';

const isSafariBrowser = isSafari();
if (isSafariBrowser) {
  console.log('Der aktuelle Browser ist Safari');
} else {
  console.log('Kein Safari');
}
```

### Safari-eigene Funktionen

```js
import { isSafari } from 'ranuts';

if (isSafari()) {
  // Safari-eigene Behandlung
  // etwa: bestimmte Kompatibilitätsprobleme umgehen
  applySafariFix();
}
```

### Server-Umgebung

```js
import { isSafari } from 'ranuts';

// Gibt in einer Server-Umgebung undefined zurück
const result = isSafari();
console.log(result); // undefined (Server-Umgebung)
```

## Hinweise

1. **Erkennungsweg**: Prüft, ob `navigator.vendor` 'Apple' enthält.
2. **Andere Browser ausschließen**: Chrome iOS (CriOS) und Firefox iOS (FxiOS) fallen heraus.
3. **Server-Umgebung**: Gibt in Server-Umgebungen (kein `navigator`-Objekt) `undefined` zurück.
4. **Rückgabewert**: Im Browser `boolean`, auf dem Server `undefined`; in manchen Fällen kann eine Zeichenkette zurückkommen.
