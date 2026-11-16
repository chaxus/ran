# parseChineseNumber / parseRomanNumber / parseEnglishNumber

Convert numerals as people write them: Chinese `二十三` / `二零二四`, Roman `XIV`, English
`Three`.

All three share one contract: **return `null` rather than a guess** when the input cannot be
parsed in full.

## API

| Function                    | Accepts                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `parseChineseNumber(value)` | Digits (half- and full-width), `一二三…`, units `十百千万/萬亿/億`, shorthand `廿卅卌`, simplified + traditional |
| `parseRomanNumber(value)`   | `IVXLCDM`, any case, subtractive notation (`IV`, `IX`)                                                           |
| `parseEnglishNumber(value)` | Digits, English number words `one`–`twenty`, then Roman numerals                                                 |

Related string helpers: `toHalfWidth(value)` / `toFullWidth(value)` normalize full-width
characters, which `parseChineseNumber` applies for you.

## Example

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('廿三'); // 23
parseChineseNumber('二零二四'); // 2024
parseChineseNumber('一百一'); // 110
parseChineseNumber('百'); // 100
parseChineseNumber('一亿两千万'); // 120000000
parseChineseNumber('一万亿'); // 1000000000000
parseChineseNumber('一百百'); // null — repeated unit
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — extract the number segment first

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（1）'); // '(1)'
```

## Notes

1. **Pass only the number segment.** `第三章` returns `null`: pull `三` out with your own
   pattern first, then parse it.
2. **A bare leading unit means one of that unit** — `十`/`百`/`千`/`万`/`亿` are 10 / 100 /
   1000 / 10000 / 1e8, and `百万` / `千万` are 1e6 / 1e7 — so `十五` is 15. Only the first
   character may be bare, apart from `十` (`一百十` → 110). **`廿`/`卅`/`卌`** are 20 / 30 / 40
   (`廿三` → 23).
3. **Sections stack**: everything before `亿` is its count, so `一万亿` is 1e12 and `一千万亿`
   is 1e15. A repeated or out-of-order unit (`一百百`, `千千`, `十十`, `万万`) returns `null`.
4. **Consecutive digits accumulate** (`二零二四` → 2024). **Abbreviated trailing digits**
   expand to the next-smaller unit (`一百一` → 110); write `零` for the ones place
   (`一百零一` → 101).
5. **`parseEnglishNumber` tries digits, then words, then Roman.** `twenty-one` and above are
   not covered; extend the word table if you need them.
