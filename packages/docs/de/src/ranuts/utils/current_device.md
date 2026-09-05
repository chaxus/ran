# currentDevice

Ermittelt den Typ des aktuellen Geräts.

## API

### currentDevice

#### Rückgabe

| Argument        | Beschreibung                   | Typ                                       |
| --------------- | ------------------------------ | ----------------------------------------- |
| `CurrentDevice` | Zeichenkette mit dem Gerätetyp | `'ipad' \| 'android' \| 'iphone' \| 'pc'` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
console.log(`Aktuelles Gerät: ${device}`);
// Mögliche Ausgabe: 'ipad', 'android', 'iphone' oder 'pc'
```

### Je nach Gerätetyp anders verzweigen

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
switch (device) {
  case 'iphone':
    // Logik nur für das iPhone
    break;
  case 'android':
    // Logik nur für Android
    break;
  case 'ipad':
    // Logik nur für das iPad
    break;
  case 'pc':
    // Logik nur für den PC
    break;
}
```

### Gerätespezifische Stile

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
document.body.classList.add(`device-${device}`);
```

## Hinweise

1. **Reihenfolge der Erkennung**: geprüft wird in dieser Reihenfolge:
   - iPad/iPod
   - Android
   - iPhone
   - alles Übrige (standardmäßig 'pc')

2. **Serverseitiges Rendern**: In Server-Umgebungen (kein `window`-Objekt) kommt `'pc'` zurück.

3. **Wie erkannt wird**: über die User-Agent-Zeichenkette.

4. **Rückgabewert**: ein Aufzählungstyp; nur `'ipad'`, `'android'`, `'iphone'` oder `'pc'` sind möglich.
