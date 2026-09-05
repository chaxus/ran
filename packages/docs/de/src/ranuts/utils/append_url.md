# appendUrl

Hängt ein Objekt mit Abfrageparametern ans Ende einer URL.

## API

### appendUrl

#### Rückgabe

| Argument | Beschreibung                                    | Typ      |
| -------- | ----------------------------------------------- | -------- |
| `string` | Die vollständige URL samt angehängter Parameter | `string` |

#### Parameter

| Parameter | Beschreibung                     | Typ                      | Standard     |
| --------- | -------------------------------- | ------------------------ | ------------ |
| `url`     | Ausgangs-URL                     | `string`                 | Erforderlich |
| `params`  | Objekt mit den Abfrageparametern | `Record<string, string>` | `{}`         |

## Beispiel

### Grundlegende Verwendung

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', limit: '10' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?page=1&limit=10'
```

### URLs, die schon Parameter haben

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com?sort=name';
const params = { page: '1' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?sort=name&page=1'
```

### Protokollrelative URLs

```js
import { appendUrl } from 'ranuts';

// URLs, die mit // beginnen, bekommen von allein ein https:// davor
const url = '//example.com';
const params = { id: '123' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?id=123'
```

### Leere Werte fallen weg

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', empty: '' };
const fullUrl = appendUrl(url, params);
// Werte, die eine leere Zeichenkette sind, fallen weg
console.log(fullUrl); // 'https://example.com?page=1'
```

## Hinweise

1. **Protokoll**: Beginnt die URL mit `//`, wird `https://` davorgesetzt.

2. **Zusammenführen**: Trägt die URL schon Abfrageparameter, kommen die neuen dahinter.

3. **Leere Werte**: Parameter, deren Wert eine leere Zeichenkette ist, fallen weg und landen nicht in der URL.

4. **Kodierung**: Die Werte werden von allein URL-kodiert.

5. **Überschreiben**: Gibt es den Parameternamen schon, ersetzt der neue Wert den alten (so verhält sich `URLSearchParams`).
