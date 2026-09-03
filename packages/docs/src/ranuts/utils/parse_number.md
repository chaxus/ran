# parseChineseNumber / parseRomanNumber / parseEnglishNumber

Parse numbers written for humans: `第二十三章`, `Chapter XIV`, `Part Three`.

All three share one contract: **return `null` rather than a guess** when the input cannot be
parsed in full. These parsers usually feed a "is this line a heading?" decision, and one wrong
number poisons the whole sequence check.

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
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — extract the number segment first

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（１）'); // '(1)'
```

## Notes

1. **Pass only the number segment.** `第三章` returns `null`: pull `三` out with your own
   pattern first, then parse it.
2. **`十` with nothing in front is 1**, so `十五` is 15, not 5.
3. **`parseEnglishNumber` tries digits, then words, then Roman.** `twenty-one` and above are
   not covered; extend the word table if you need them.
