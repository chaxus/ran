# clearStr

Entfernt aus einer Zeichenkette die Leerzeichen an den Rändern, die URL-Kodierung und die Anführungszeichen.

## API

### clearStr

#### Rückgabe

| Argument | Beschreibung                | Typ      |
| -------- | --------------------------- | -------- |
| `string` | Die bereinigte Zeichenkette | `string` |

#### Parameter

| Parameter | Beschreibung                 | Typ              | Standard     |
| --------- | ---------------------------- | ---------------- | ------------ |
| `str`     | Zu bereinigende Zeichenkette | `string`         | Erforderlich |
| `options` | Einstellungen                | `ClearStrOption` | `{}`         |

#### Optionen

| Parameter    | Beschreibung          | Typ       | Standard |
| ------------ | --------------------- | --------- | -------- |
| `urlencoded` | Ob URL-dekodiert wird | `boolean` | `true`   |

## Beispiel

### Grundlegende Verwendung

```js
import { clearStr } from 'ranuts';

const str = '  "hello world"  ';
const cleaned = clearStr(str);
console.log(cleaned); // 'hello world'
```

### URL-kodierte Zeichenkette

```js
import { clearStr } from 'ranuts';

const encoded = '  "hello%20world"  ';
const cleaned = clearStr(encoded);
console.log(cleaned); // 'hello world' (von allein dekodiert)
```

### Das Dekodieren abschalten

```js
import { clearStr } from 'ranuts';

const str = '  "hello%20world"  ';
const cleaned = clearStr(str, { urlencoded: false });
console.log(cleaned); // 'hello%20world' (nicht dekodiert)
```

### Anführungszeichen

```js
import { clearStr } from 'ranuts';

const str1 = "'test'";
const str2 = '"test"';
console.log(clearStr(str1)); // 'test'
console.log(clearStr(str2)); // 'test'
```

## Hinweise

1. **Was entfernt wird**: Leerzeichen an den Rändern sowie einfache und doppelte Anführungszeichen.
2. **URL-Dekodierung**: geschieht standardmäßig und lässt sich mit `urlencoded: false` abschalten.
3. **Einsatz**: üblich, um Benutzereingaben oder aus URL-Parametern gelesene Werte zu säubern.
