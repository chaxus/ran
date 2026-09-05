# randomString

Erzeugt eine zufällige Zeichenkette mit vorangestelltem Zeitstempel, damit sie sich kaum wiederholt.

## API

### randomString

#### Rückgabe

| Argument | Beschreibung                                              | Typ      |
| -------- | --------------------------------------------------------- | -------- |
| `string` | Zufällige Zeichenkette (Form: Zeitstempel-Zufallszeichen) | `string` |

#### Parameter

| Parameter | Beschreibung                                  | Typ      | Standard |
| --------- | --------------------------------------------- | -------- | -------- |
| `len`     | Länge des zufälligen Teils (ohne Zeitstempel) | `number` | `8`      |

## Beispiel

### Grundlegende Verwendung

```js
import { randomString } from 'ranuts';

const str = randomString();
console.log(str); // etwa: '1703123456789-abc12345'
```

### Die Länge angeben

```js
import { randomString } from 'ranuts';

const str = randomString(12);
console.log(str); // etwa: '1703123456789-abcdefghijkl'
```

### Eine eindeutige ID erzeugen

```js
import { randomString } from 'ranuts';

const uniqueId = randomString(16);
console.log('Eindeutige ID:', uniqueId);
```

### Name für eine temporäre Datei

```js
import { randomString } from 'ranuts';

const tempFileName = `temp_${randomString(10)}.txt`;
console.log(tempFileName); // etwa: 'temp_1703123456789-xyz1234567.txt'
```

## Hinweise

1. **Kaum Dopplungen**: Weil der Zeitstempel darin steckt, wiederholt sich die erzeugte Zeichenkette so gut wie nie.
2. **Zeichenvorrat**: `ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678`, ohne die leicht zu verwechselnden Zeichen (0, O, 1, I, l und dergleichen).
3. **Form**: `{Zeitstempel}-{Zufallszeichen}`.
4. **Länge**: Das Argument `len` bestimmt nur den zufälligen Teil; Zeitstempel und Bindestrich zählen nicht mit.

## getRandomString

Eine leichtere Alternative: kein Zeitstempel, kein eingeschränkter Zeichenvorrat, bloß `Math.random().toString(36)` auf `len` Zeichen gekürzt (Basis 36, also `0-9a-z`). Nicht so kollisionsfest wie `randomString`; nimm es für eine einmalige DOM-ID oder einen Query-Parameter gegen den Cache, wo Eindeutigkeit keine Zeitstempel-Kollision überstehen muss.

```js
import { getRandomString } from 'ranuts/utils';

getRandomString(); // etwa 'k3j9x2p1' (8 Zeichen)
getRandomString(4); // etwa 'a1b2'
```
