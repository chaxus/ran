# paginateText

Zerlegt einfachen Text in Seiten, die in einen festen Rahmen passen: ein Lesegerät, ein Teleprompter, eine Druckvorschau.

Reine Rechnerei: Der Rahmen und die Schriftmaße kommen als Zahlen herein, das DOM wird nie angefasst. Miss den Container einmal im Hauptthread und paginiere danach in einem Worker, auf dem Server oder in einem Test.

## API

### paginateText(text, box, metrics, options?)

| Parameter        | Beschreibung                                                   | Typ               |
| ---------------- | -------------------------------------------------------------- | ----------------- |
| `text`           | Ausgangstext; `\r\n` und `\r` werden zu `\n` vereinheitlicht   | `string`          |
| `box`            | `{ width, height }` in px                                      | `TextBox`         |
| `metrics`        | `{ charWidth, lineHeight, narrowRatio? }` in px                | `TextGridMetrics` |
| `options.minBox` | Darunter gilt der Rahmen als noch nicht gesetzt. Standard `30` | `number`          |

`narrowRatio` ist der Vorschub eines ASCII-Zeichens als Bruchteil von `charWidth`; standardmäßig `0.5625` (9/16).

Zurück kommt `{ pages, total, charsPerLine, linesPerPage, charsPerPage }`; jede Seite ist `{ text, start, end, index }`, die Positionen beziehen sich auf den vereinheitlichten Ausgangstext.

## Beispiel

```js
import { paginateText } from 'ranuts';

const { width, height } = container.getBoundingClientRect();
const result = paginateText(book, { width, height }, { charWidth: 18.4, lineHeight: 40 });

render(result.pages[0].text);
console.log(`${result.pages.length} Seiten, ${result.charsPerLine} Zeichen je Zeile`);
```

## Hinweise

1. **Es setzt ein Raster fester Breite voraus**: Jedes Zeichen rückt um eine Zelle vor (CJK, volle Breite) oder um `narrowRatio` davon (ASCII). Bei einer dicktengleichen Schrift stimmt das genau, bei überwiegend CJK-lastigem Fließtext nahe genug — ein Ersatz für echte Glyphenformung bei proportionaler lateinischer Schrift ist es aber **nicht**.
2. **ASCII-Wörter bleiben ganz.** Eine Seite endet nie mitten im Wort, es sei denn, das Wort ist länger als eine Zeile; dann muss es gebrochen werden.
3. **Die Positionen schließen lückenlos an**: `pages[i].start === pages[i - 1].end`, und fügt man alle `page.text` zusammen, ergibt sich genau der vereinheitlichte Ausgangstext. Genau deshalb kannst du eine Anmerkung als globale Position speichern, und sie bleibt auch nach einer neuen Seitenaufteilung gültig. Siehe [segmentByRanges](./segment).
4. **Ein Rahmen kleiner als `minBox` liefert keine Seiten.** Sonst würde die Aufteilung beim ersten Zeichnen, wenn der Container noch 0 misst, ins Leere drehen.

::: tip Ein Wort, das länger ist als eine Seite
Eine URL, ein Base64-Blob oder eine lange Reihe von Bindestrichen zählen alle als Wortzeichen. Reicht eine solche Reihe über eine ganze Seite hinaus, gibt es keine „nächste Seite“, auf die man sie verschieben könnte — also wird hart umbrochen. Sie stattdessen zu verschieben würde den Cursor an den Beginn der Seite zurückspulen. Die Seite käme leer heraus und die Schleife käme nie voran: ein Hänger, nicht bloß ein hässlicher Satz.
:::
