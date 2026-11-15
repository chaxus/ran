# parseChineseNumber / parseRomanNumber / parseEnglishNumber

把人写的数字转成阿拉伯数字：中文 `二十三` / `二零二四`、罗马 `XIV`、英文 `Three`。

三者共享同一约定：**无法完整解析就返回 `null`，绝不返回猜测值**。

## API

| 函数                        | 支持                                                        |
| --------------------------- | ----------------------------------------------------------- |
| `parseChineseNumber(value)` | 数字（半角与全角）、`一二三…`、单位 `十百千万/萬亿/億`、简写 `廿卅卌`，简繁通用 |
| `parseRomanNumber(value)`   | `IVXLCDM`，大小写皆可，支持减法记法（`IV`、`IX`）           |
| `parseEnglishNumber(value)` | 数字、英文数词 `one`–`twenty`，再退回罗马数字               |

相关字符串工具：`toHalfWidth(value)` / `toFullWidth(value)` 做全半角归一化，
`parseChineseNumber` 已内置调用。

## 示例

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('廿三'); // 23
parseChineseNumber('二零二四'); // 2024
parseChineseNumber('一百一'); // 110
parseChineseNumber('百'); // 100
parseChineseNumber('一亿两千万'); // 120000000
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null —— 请先截出编号段

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（1）'); // '(1)'
```

## 注意

1. **只传编号段**。`第三章` 返回 `null`，请先用你自己的模式把 `三` 截出来再解析。
2. **裸单位按「一」个该单位计**——`十`/`百`/`千`/`万`/`亿` 分别是 10 / 100 / 1000 / 10000 / 1e8——所以 `十五` 是 15。**`廿`/`卅`/`卌`** 是 20 / 30 / 40（`廿三` → 23）。
3. **连续数字位累加**（`二零二四` → 2024）。**省略的尾数**补下一档单位（`一百一` → 110）；个位要写 `零`（`一百零一` → 101）。
4. **`parseEnglishNumber` 依次尝试数字、数词、罗马数字**。`twenty-one` 及以上未覆盖，
   需要的话自行扩展词表。
