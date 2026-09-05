# checkEncoding

Erkennt die Zeichenkodierung von Daten in einem `Uint8Array`.

## API

### checkEncoding

#### Rückgabe

| Argument | Beschreibung           | Typ      |
| -------- | ---------------------- | -------- |
| `string` | Die erkannte Kodierung | `string` |

#### Parameter

| Parameter    | Beschreibung           | Typ          | Standard     |
| ------------ | ---------------------- | ------------ | ------------ |
| `uint8Array` | Zu untersuchende Daten | `Uint8Array` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { checkEncoding } from 'ranuts';

const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
const encoding = checkEncoding(data);
console.log(encoding); // 'UTF-8' oder eine andere erkannte Kodierung
```

### Kodierung einer Datei erkennen

```js
import { checkEncoding } from 'ranuts';

async function detectFileEncoding(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  return encoding;
}
```

### Text dekodieren

```js
import { checkEncoding } from 'ranuts';

function decodeText(uint8Array) {
  const encoding = checkEncoding(uint8Array);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
}
```

## Hinweise

1. **Abhängigkeit**: Für die Erkennung wird die Bibliothek `jschardet` verwendet.
2. **Standardkodierung**: Schlägt die Erkennung fehl, wird `'utf-8'` angenommen.
3. **Genauigkeit**: Die Erkennung trifft nicht in 100 % der Fälle zu, bei kurzen Texten besonders selten.
4. **Einsatz**: üblich beim Verarbeiten von Dateien, beim Dekodieren von Text und beim Umwandeln von Zeichenkodierungen.
