# parseChineseNumber / parseRomanNumber / parseEnglishNumber

人が読むために書かれた数字を解析します。`第二十三章`、`Chapter XIV`、`Part Three` のようなものです。

3 つとも同じ約束を守ります。入力を最後まで解析できないときは、**推測せずに `null` を返します**。これらの解析器はたいてい「この行は見出しか」という判断に使われるので、数字をひとつ取り違えると、連番の確認そのものが台無しになります。

## API

| 関数                        | 受け付けるもの                                                        |
| --------------------------- | --------------------------------------------------------------------- |
| `parseChineseNumber(value)` | 数字（半角・全角）、`一二三…`、位取りの `十百千万/萬`、簡体字と繁体字 |
| `parseRomanNumber(value)`   | `IVXLCDM`、大文字小文字どちらでも、減算記法（`IV`、`IX`）             |
| `parseEnglishNumber(value)` | 数字、英語の数詞 `one`〜`twenty`、そしてローマ数字                    |

関連する文字列のヘルパー：`toHalfWidth(value)` / `toFullWidth(value)` は全角文字を正規化します。`parseChineseNumber` はこれを内部で適用します。

## 使用例

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — まず数字の部分を取り出してください

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（１）'); // '(1)'
```

## 補足

1. **数字の部分だけを渡してください。** `第三章` は `null` を返します。まず自分のパターンで `三` を取り出し、それを解析してください。
2. **前に何もない `十` は 1 です。** だから `十五` は 5 ではなく 15 です。
3. **`parseEnglishNumber` は、数字 → 数詞 → ローマ数字の順に試します。** `twenty-one` 以上は対象外です。必要なら数詞の表を増やしてください。
