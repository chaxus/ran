# formatDate / timestampToTime

Formatiert ein Datum mit einem Muster aus Token.

## API

### formatDate(value?, pattern?)

| Parameter | Beschreibung | Typ | Standard |
| --------- | ---------------------------------------------- | -------------------------- | ----------------------- |
| `value` | Zeitstempel, Datumszeichenkette oder `Date`; weglassen für jetzt | `number \| string \| Date` | jetzt |
| `pattern` | Muster aus Token | `string` | `'YYYY-MM-DD HH:mm:ss'` |

| Token | Bedeutung | Token | Bedeutung |
| ----------- | ------------ | -------- | ------------- |
| `YYYY`/`YY` | Jahr | `mm`/`m` | Minute |
| `MM`/`M` | Monat (1–12) | `ss`/`s` | Sekunde |
| `DD`/`D` | Tag | `SSS` | Millisekunden |
| `HH`/`H` | Stunde (0–23) | `A`/`a` | AM/PM · am/pm |
| `hh`/`h` | Stunde (1–12) | `[...]` | Wörtlicher Text |

Gibt `'Invalid Date'` zurück, wenn sich die Eingabe nicht deuten lässt.

### timestampToTime(timestamp?)

Veraltet. Gibt ein `Date` zurück, dem eine `format`-Methode an die Instanz gehängt wurde.

## Beispiel

```js
import { formatDate } from 'ranuts';

formatDate(); // '2026-07-25 14:30:00'
formatDate(1753425000000, 'YYYY/MM/DD'); // '2026/07/25'
formatDate(new Date(), 'YYYY[年]MM[月]DD[日] hh:mm a');
formatDate('not a date'); // 'Invalid Date'
```

## Hinweise

1. **Groß- und Kleinschreibung zählt.** `MM` ist der Monat, `mm` die Minute; `HH` zählt bis 24, `hh` bis 12.
2. **Das Muster wird in einem Durchgang ersetzt**, ein gerade geschriebener Wert kann also von einem späteren Token nie noch einmal erwischt werden.
3. **Setze wörtlichen Text in `[]`**, damit seine Buchstaben von der Ersetzung verschont bleiben.

::: warning In 0.3 behoben und abgelöst
Der alte Formatierer reihte sechs `.replace()`-Aufrufe mit dem Flag für Groß-/Kleinschreibung aneinander. Zwei Folgen: Ein späteres Muster konnte Ziffern erwischen, die ein früheres gerade geschrieben hatte, und `/M+/g`, `/m+/g` und `/D+/gi` überschnitten sich — ein kleingeschriebenes Muster wie `yyyy-mm-dd` ergab also Jahr-Minute-Tag.

`timestampToTime` ist veraltet, nimm `formatDate`: Eine Methode an eine `Date`-Instanz zu schrauben übersteht keine Serialisierung und lässt sich nicht feiner als `Function` typisieren. Sein `format` reicht jetzt an `formatDate` weiter, sodass auch bestehende Aufrufer die korrigierte Token-Behandlung bekommen.
:::
