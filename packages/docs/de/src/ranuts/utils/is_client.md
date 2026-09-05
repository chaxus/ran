# isClient

Stellt fest, ob die aktuelle Umgebung eine Client-Umgebung (Browser) ist.

## API

### isClient

#### Rückgabe

| Argument  | Beschreibung                   | Typ       |
| --------- | ------------------------------ | --------- |
| `boolean` | Ob es eine Client-Umgebung ist | `boolean` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { isClient } from 'ranuts';

if (isClient) {
  console.log('Gerade in einer Browser-Umgebung');
  // Browser-APIs wie window und document sind nutzbar
  window.localStorage.setItem('key', 'value');
} else {
  console.log('Gerade in einer Server-Umgebung');
}
```

### Bedingte Ausführung

```js
import { isClient } from 'ranuts';

// Nur auf dem Client ausführen
if (isClient) {
  document.addEventListener('click', handleClick);
}
```

### Sicherheit beim serverseitigen Rendern

```js
import { isClient } from 'ranuts';

function getWindowSize() {
  if (isClient) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 0, height: 0 };
}
```

## Hinweise

1. **Erkennungsweg**: Prüft `typeof window !== 'undefined'`.
2. **Eine Konstante**: `isClient` ist eine Konstante, keine Funktion; beim Verwenden braucht es keine Klammern.
3. **Einsatzfall**: Üblich, um Client und Server zu unterscheiden und Fehler beim Griff auf Browser-APIs im Server zu vermeiden.
