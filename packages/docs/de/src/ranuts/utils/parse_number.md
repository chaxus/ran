# parseChineseNumber / parseRomanNumber / parseEnglishNumber

Wertet Zahlen aus, die für Menschen geschrieben wurden: `第二十三章`, `Chapter XIV`, `Part Three`.

Alle drei halten dieselbe Zusage: Lässt sich die Eingabe nicht vollständig auswerten, **kommt `null` zurück statt einer Vermutung**. Solche Parser speisen meist die Entscheidung „ist diese Zeile eine Überschrift?“, und eine einzige falsch gelesene Zahl verdirbt die ganze Prüfung der Reihenfolge.

## API

| Funktion | Nimmt an |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `parseChineseNumber(value)` | Ziffern (halb- und vollbreit), `一二三…`, die Stellen `十百千万/萬`, Kurz- und Langzeichen |
| `parseRomanNumber(value)` | `IVXLCDM`, Groß- wie Kleinschreibung, subtraktive Schreibweise (`IV`, `IX`) |
| `parseEnglishNumber(value)` | Ziffern, die englischen Zahlwörter `one`–`twenty`, danach römische Zahlen |

Verwandte Zeichenketten-Helfer: `toHalfWidth(value)` / `toFullWidth(value)` vereinheitlichen vollbreite Zeichen — `parseChineseNumber` wendet das schon für dich an.

## Beispiel

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — den Zahlenteil vorher herauslösen

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（１）'); // '(1)'
```

## Hinweise

1. **Übergib nur den Zahlenteil.** `第三章` ergibt `null`: Hol das `三` erst mit einem eigenen Muster heraus und werte dann das aus.
2. **Ein `十` ohne etwas davor steht für 1**, `十五` ist also 15 und nicht 5.
3. **`parseEnglishNumber` versucht Ziffern, dann Wörter, dann römische Zahlen.** Ab `twenty-one` reicht die Abdeckung nicht mehr; erweitere bei Bedarf die Wortliste.
