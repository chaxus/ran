# setMime

Legt eine MIME-Typ-Zuordnung an oder ändert sie.

## API

### setMime

#### Rückgabe

| Argument              | Beschreibung                         | Typ                   |
| --------------------- | ------------------------------------ | --------------------- |
| `Map<string, string>` | Die `Map` mit der MIME-Typ-Zuordnung | `Map<string, string>` |

#### Parameter

| Parameter  | Beschreibung | Typ      | Standard     |
| ---------- | ------------ | -------- | ------------ |
| `ext`      | Dateiendung  | `string` | Erforderlich |
| `mimeType` | MIME-Typ     | `string` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { setMime, getMime } from 'ranuts';

// Einen eigenen MIME-Typ festlegen
setMime('.myext', 'application/x-my-custom-type');

// Den MIME-Typ auslesen
const mime = getMime('.myext');
console.log(mime); // 'application/x-my-custom-type'
```

### Einen vorhandenen Typ ändern

```js
import { setMime, getMime } from 'ranuts';

// Den MIME-Typ von .js ändern
setMime('.js', 'application/javascript-custom');

const mime = getMime('script.js');
console.log(mime); // 'application/javascript-custom'
```

### Einen neuen Typ ergänzen

```js
import { setMime } from 'ranuts';

// Die Zuordnung für einen neuen Dateityp ergänzen
setMime('.xyz', 'application/x-xyz-format');
```

## Hinweise

1. **Wirkt global**: Was du festlegst, gilt für die gesamte MIME-Typ-Zuordnung und damit überall, wo `getMime` benutzt wird.
2. **Überschreibt**: Gibt es die Endung schon, geht ihr bisheriger MIME-Typ verloren.
3. **Rückgabewert**: die ganze `Map`, sodass du weiterarbeiten kannst.
4. **Einsatz**: üblich, um MIME-Typen für eigene Dateiformate zu hinterlegen.

## MimeType

Die zugrunde liegende `Map<string, string>`, aus der `getMime`, `setMime` und `getExtensions` lesen und in die sie schreiben. Importiere sie direkt, wenn du alle bekannten Paare aus Endung und Typ durchgehen willst, statt eines nachzuschlagen.

```js
import { MimeType } from 'ranuts/utils';

MimeType.get('.pdf'); // 'application/pdf'
MimeType.size; // Zahl der bekannten Endungen
[...MimeType.entries()].filter(([, type]) => type.startsWith('image/'));
```

Es ist dieselbe `Map`-Instanz, die `setMime` ändert: Was du über `setMime` einträgst, ist hier sofort zu sehen, und umgekehrt genauso. Sie direkt zu ändern geht auch; `setMime` ist nur ein benannter Einstieg für den Normalfall.
