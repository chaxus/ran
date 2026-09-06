# truncate

Kürzt eine Zeichenkette auf eine Höchstlänge und markiert den Schnitt mit Auslassungspunkten. Geht sauber mit Unicode um und weiß, dass es einen Unterschied macht, _welches Ende_ du behältst.

## Verwendung

```ts
import { truncate } from 'ranuts/utils';

truncate('the quick brown fox', 12); // 'the quick b…'

truncate('/Users/me/code/app/src/index.ts', { length: 20, position: 'start' });
// '…de/app/src/index.ts'

truncate('0xabcdef0123456789', { length: 11, position: 'middle' });
// '0xabc…56789'
```

## API

### `truncate(value, options)`

#### Parameter

| Parameter | Beschreibung                                      | Typ                         | Standard     |
| --------- | ------------------------------------------------- | --------------------------- | ------------ |
| `value`   | Die zu kürzende Zeichenkette                      | `string`                    | Erforderlich |
| `options` | Eine bloße Zahl ist die Kurzform für `{ length }` | `TruncateOptions \| number` | Erforderlich |

#### `TruncateOptions`

| Feld       | Beschreibung                                                    | Typ                            | Standard |
| ---------- | --------------------------------------------------------------- | ------------------------------ | -------- |
| `length`   | Höchstlänge des Ergebnisses, die Auslassungspunkte eingerechnet | `number`                       | —        |
| `position` | Welches Ende bleibt — siehe unten                               | `'end' \| 'start' \| 'middle'` | `'end'`  |
| `ellipsis` | Die Markierung an der Schnittstelle                             | `string`                       | `'…'`    |

`position` entscheidet, welches Ende bleibt, und diese Wahl trägt echte Information:

- `'end'` (Standard) behält den Anfang — das Richtige für Fließtext und Überschriften.
- `'start'` behält das **Ende**, und genau das will ein Dateipfad: `/Users/jemand/arbeit/…` ist der Teil, den die lesende Person längst kennt; `…/src/utils/str.ts` ist der, auf den es ankommt.
- `'middle'` behält beide Enden — für Bezeichner, bei denen Anfang _und_ Ende etwas bedeuten, etwa ein Hash oder eine Kontonummer.

#### Rückgabe

`string`, nie länger als `length`. Ist `length` kürzer als die Auslassungspunkte selbst, werden eben diese gekürzt, statt über die Grenze hinauszulaufen.

## Hinweise

1. **Geschnitten wird nach Unicode-Codepoints, nicht nach UTF-16-Einheiten.** Ein naives `value.slice(i)` kann mitten in einem Ersatzpaar landen: Jedes Zeichen außerhalb der mehrsprachigen Basis-Ebene (Emoji, manche CJK-Erweiterungszeichen) belegt zwei UTF-16-Einheiten und hinterlässt neben den Auslassungspunkten ein einzelnes Ersatzzeichen, das als Zeichensalat erscheint. `truncate` läuft stattdessen über Codepoints, sodass mehrteilige Zeichen nie zerrissen werden.
2. Ein `value`, der kürzer ist als `length`, kommt unverändert zurück — ohne Auslassungspunkte.
3. Übergib ein eigenes `ellipsis` (etwa `'...'` oder `'[cut]'`), wenn das voreingestellte `'…'` in der Schrift fehlt, mit der du zeichnest.
