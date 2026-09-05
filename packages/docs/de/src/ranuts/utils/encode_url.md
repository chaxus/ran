# encodeUrl

Kodiert eine URL gefahrlos: bereits kodierte Folgen bleiben unangetastet, unpaarige Ersatzzeichen werden behandelt.

## API

### encodeUrl

#### Rückgabe

| Argument | Beschreibung     | Typ      |
| -------- | ---------------- | -------- |
| `string` | Die kodierte URL | `string` |

#### Parameter

| Parameter | Beschreibung      | Typ      | Standard     |
| --------- | ----------------- | -------- | ------------ |
| `url`     | Zu kodierende URL | `string` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/path with spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### Bereits kodierte URLs

```js
import { encodeUrl } from 'ranuts';

// Was schon kodiert war, wird nicht erneut kodiert
const url = 'https://example.com/path%20with%20spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### Sonderzeichen

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/search?q=hello world&lang=zh-CN';
const encoded = encodeUrl(url);
console.log(encoded); // Die kodierte URL
```

### Kaputte Kodierungen

```js
import { encodeUrl } from 'ranuts';

// Kaputte Folgen (etwa %foo) werden sehr wohl kodiert
const url = 'https://example.com/path%foo';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%25foo'
```

## Hinweise

1. **Kodiert mit Augenmaß**: Angefasst wird nur, was noch nicht kodiert war; bereits kodierte Folgen wie `%20` bleiben, wie sie sind.
2. **Ersatzzeichen**: Unpaarige Ersatzzeichen werden von allein behandelt und durch das Unicode-Ersatzzeichen ersetzt.
3. **Keine Fehler**: Es wird nichts geworfen; die URL wird so gut wie möglich kodiert.
4. **Einsatz**: üblich für URLs aus Benutzereingaben und für das Zusammensetzen sicherer URLs.
