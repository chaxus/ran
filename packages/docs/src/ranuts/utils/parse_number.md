# parseChineseNumber / parseRomanNumber / parseEnglishNumber

Convert numerals as people write them: Chinese `二十三` / `二零二四`, Roman `XIV`, English
`Three`.

All three share one contract: **return `null` rather than a guess** when the input cannot be
parsed in full.

## API

| Function                    | Accepts                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `parseChineseNumber(value)` | Digits (half- and full-width), `一二三…`, units `十百千万/萬`, simplified + traditional |
| `parseRomanNumber(value)`   | `IVXLCDM`, any case, subtractive notation (`IV`, `IX`)                                  |
| `parseEnglishNumber(value)` | Digits, English number words `one`–`twenty`, then Roman numerals                        |

Related string helpers: `toHalfWidth(value)` / `toFullWidth(value)` normalize full-width
characters, which `parseChineseNumber` applies for you.

## Example

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('二零二四'); // 2024
parseChineseNumber('一百一'); // 110
parseChineseNumber('百'); // 100
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — extract the number segment first

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（1）'); // '(1)'
```

## Notes

1. **Pass only the number segment.** `第三章` returns `null`: pull `三` out with your own
   pattern first, then parse it.
2. **A bare unit means one of that unit** — `十` is 10, `百` is 100, `千` is 1000, `万` is
   10000 — so `十五` is 15.
3. **Consecutive digits accumulate** (`二零二四` → 2024). **Abbreviated trailing digits**
   expand to the next-smaller unit (`一百一` → 110); write `零` for the ones place
   (`一百零一` → 101).
4. **`parseEnglishNumber` tries digits, then words, then Roman.** `twenty-one` and above are
   not covered; extend the word table if you need them.
