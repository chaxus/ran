# getCookieByName

Liest den Wert eines Cookies über seinen Namen, mithilfe eines regulären Ausdrucks.

## API

### getCookieByName

#### Rückgabe

| Argument | Beschreibung                                                     | Typ      |
| -------- | ---------------------------------------------------------------- | -------- |
| `string` | Der Wert des Cookies; leere Zeichenkette, wenn es ihn nicht gibt | `string` |

#### Parameter

| Parameter | Beschreibung     | Typ      | Standard     |
| --------- | ---------------- | -------- | ------------ |
| `name`    | Name des Cookies | `string` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { getCookieByName } from 'ranuts';

const token = getCookieByName('token');
console.log(token); // Der Wert des Cookies oder eine leere Zeichenkette
```

### Der Unterschied zu getCookie

```js
import { getCookie, getCookieByName } from 'ranuts';

// getCookie zerlegt die Zeichenkette
const value1 = getCookie('token');

// getCookieByName nutzt einen regulären Ausdruck
const value2 = getCookieByName('token');

// Beide leisten dasselbe, nur die Umsetzung unterscheidet sich
```

### Prüfen, ob das Cookie existiert

```js
import { getCookieByName } from 'ranuts';

const sessionId = getCookieByName('sessionId');
if (sessionId) {
  console.log('Sitzungs-ID:', sessionId);
} else {
  console.log('Es gibt keine Sitzungs-ID');
}
```

## Hinweise

1. **Treffer über einen regulären Ausdruck**: Das Cookie wird per regulärem Ausdruck gesucht, Leerzeichen vor oder nach dem Namen stören also nicht.
2. **Auch auf dem Server sicher**: In Server-Umgebungen (kein `window`-Objekt) kommt eine leere Zeichenkette zurück, ein Fehler wird nicht geworfen.
3. **Unterschied zu getCookie**: gleiche Leistung, aber `getCookieByName` nutzt einen regulären Ausdruck und `getCookie` zerlegt die Zeichenkette.
4. **Rückgabewert**: Fehlt das Cookie, kommt eine leere Zeichenkette zurück, weder `null` noch `undefined`.
