# isMobile

Stellt fest, ob das aktuelle Gerät ein Mobilgerät ist.

## API

### isMobile

#### Rückgabe

| Argument  | Beschreibung             | Typ       |
| --------- | ------------------------ | --------- |
| `boolean` | Ob es ein Mobilgerät ist | `boolean` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  console.log('Das aktuelle Gerät ist ein Mobilgerät');
} else {
  console.log('Das aktuelle Gerät ist ein Rechner');
}
```

### Anpassungsfähiges Layout

```js
import { isMobile } from 'ranuts';

const layout = isMobile() ? 'mobile' : 'desktop';
console.log(`Layout ${layout} wird verwendet`);
```

### Bedingtes Laden

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  // Den Code fürs Mobilgerät laden
  import('./mobile-module');
} else {
  // Den Code für den Rechner laden
  import('./desktop-module');
}
```

## Hinweise

1. **Erkennungsregeln**: Erkennt anhand des User Agents diese Geräte:
   - Android
   - webOS
   - iPhone
   - iPod
   - iPad
   - BlackBerry

2. **Serverseitiges Rendern**: Gibt in Server-Umgebungen (kein `window`-Objekt) `false` zurück.

3. **Genauigkeit**: Stützt sich auf den User Agent; ein veränderter UA kann es täuschen.

4. **Das iPad**: Je nach User Agent wird das iPad in manchen Fällen als Mobilgerät erkannt.
