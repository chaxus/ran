# buildOffsets / indexForOffset / segmentByRanges

Die Koordinatenrechnung für den Fall „der Inhalt ist in Stücke zerteilt, die Anmerkungen hängen aber am zusammengefügten Text“. Speichere eine Hervorhebung als **globale Position** statt als „Stück N, Zeichen M“, und sie übersteht ein neues Zerteilen: Ändere die Schriftgröße, die Seitenbreite oder die Stückgröße — die Anmerkung zeigt weiterhin auf dieselben Wörter.

## API

### buildOffsets(lengths)

Präfixsummen: `offsets[i]` ist die Gesamtlänge von allem, was vor Stück `i` liegt.

```js
buildOffsets([3, 5, 2]); // [0, 3, 8]
```

### indexForOffset(offsets, offset)

Sucht per Halbierung das Stück, in das eine globale Position fällt. Positionen außerhalb des Bereichs werden auf `[0, offsets.length - 1]` begrenzt, ein leeres Array ergibt `0`. Das Ergebnis lässt sich immer gefahrlos als Index verwenden.

### segmentByRanges(text, chunkStart, ranges)

Zerlegt ein Stück in schlichte und getroffene Abschnitte, damit es sich abschnittsweise zeichnen lässt (Hervorhebungen, Suchtreffer, eingefärbte Unterschiede).

| Parameter    | Beschreibung                                      | Typ                         |
| ------------ | ------------------------------------------------- | --------------------------- |
| `text`       | Der Text dieses Stücks                            | `string`                    |
| `chunkStart` | Die globale Position, an der dieses Stück beginnt | `number`                    |
| `ranges`     | `{ start, end, value }[]` in globalen Koordinaten | `readonly OffsetRange<T>[]` |

Gibt `{ text, start, end, value }[]` zurück, wobei `value` für nicht abgedeckten Text `null` ist. Fügt man die Abschnitte zusammen, ergibt sich immer wieder `text`, und es gibt stets mindestens einen Abschnitt.

## Beispiel

```js
import { buildOffsets, indexForOffset, segmentByRanges } from 'ranuts';

const offsets = buildOffsets(pages.map((p) => p.text.length));

// Auf welcher Seite beginnt diese Notiz?
const pageIndex = indexForOffset(offsets, note.start);

// Eine Seite samt ihren Hervorhebungen zeichnen
const segments = segmentByRanges(
  pages[i].text,
  offsets[i],
  notes.map((n) => ({
    start: n.start,
    end: n.end,
    value: n,
  })),
);
segments.forEach((s) => container.append(s.value ? mark(s.text, s.value) : text(s.text)));
```

## Hinweise

1. **Die Bereiche sind halboffen**: `[start, end)`.
2. **Überschneidungen werden aufgelöst, nicht zusammengefasst.** Die Bereiche werden der Reihe nach abgearbeitet; ein späterer nimmt nur den Teil, der noch nicht abgedeckt ist, und einer, den ein früherer ganz verschluckt, fällt weg. Die Schnittpunkte wachsen streng, also entsteht kein Abschnitt versehentlich leer oder doppelt.
3. **Bereiche außerhalb des Stücks werden übergangen**, teilweise überlappende beschnitten — du kannst also die ganze Liste der Anmerkungen jedem Stück übergeben.
