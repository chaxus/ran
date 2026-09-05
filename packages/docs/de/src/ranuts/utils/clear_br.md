# clearBr

Entfernt Leerzeichen, HTML-Tags und Zeilenumbrüche aus einer Zeichenkette.

## API

### clearBr

#### Rückgabe

| Argument | Beschreibung                | Typ      |
| -------- | --------------------------- | -------- |
| `string` | Die bereinigte Zeichenkette | `string` |

#### Parameter

| Parameter | Beschreibung                 | Typ      | Standard |
| --------- | ---------------------------- | -------- | -------- |
| `str`     | Zu bereinigende Zeichenkette | `string` | `''`     |

## Beispiel

### Grundlegende Verwendung

```js
import { clearBr } from 'ranuts';

const text = '  <p>Hello\nWorld</p>  ';
const cleaned = clearBr(text);
console.log(cleaned); // 'HelloWorld'
```

### HTML-Inhalt bereinigen

```js
import { clearBr } from 'ranuts';

const html = '<div>Das ist <strong>Test</strong>inhalt</div>\nZeilenumbruch';
const cleaned = clearBr(html);
console.log(cleaned); // 'DasistTestinhaltZeilenumbruch'
```

### Leere Zeichenkette

```js
import { clearBr } from 'ranuts';

console.log(clearBr('')); // '' (leere Zeichenkette)
console.log(clearBr()); // '' (leere Zeichenkette)
```

## Hinweise

1. **Was entfernt wird**: alle Leerzeichen, HTML-Tags und Zeilenumbrüche (`\r\n`).
2. **Leere Zeichenkette**: Ist die Eingabe leer, kommt direkt eine leere Zeichenkette zurück.
3. **Einsatzfall**: Üblich, um reinen Text ohne Formatierungsmarken herauszuziehen.
